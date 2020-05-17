import React from "react";
import {
  ActivityIndicator,
  Button,
  Clipboard,
  FlatList,
  Image,
  Share,
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import uuid from "uuid";
import Environment from "../../database/irEnv";
import firebase from "../../database/irDb"; 

export default class App extends React.Component {
  state = {
    activityImage: null,
    itemIsInTags: false,
    uploading: false,
    completedCheck: false,
    tagsMatched: [],
    googleResponse: null,
    tags: {"toothbrush":1, "brushing":1, "teeth":1, "tooth":1}
  };

  async componentDidMount() {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);
  }

  render() {
    let { activityImage } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
        
        <View style={styles.helpContainer}>

        {!this.state.itemIsInTags &&
                
             <TouchableOpacity
              style={styles.buttonStyle}
              onPress={this._takePhoto}
              >
              <Text>Take a photo of your toothbrush</Text>
            </TouchableOpacity> 
        }
            <View>
              {this._maybeRenderImage()}
              {this._maybeRenderUploadingOverlay()}
            </View>

            {this.state.googleResponse && this.state.itemIsInTags && (
              <View><Text style={styles.goodJobText}>Good job!</Text></View>
            )}

            {this.state.googleResponse && !this.state.itemIsInTags && (
              <Text style={styles.badJobText}>
                Oh no, your photo didn't match! try again to take a photo of
                your toothbrush
              </Text>
            )}
          </View>
            {this.state.googleResponse && (
              <View>
              <FlatList
                data={this.state.googleResponse.responses[0].labelAnnotations}
                extraData={this.state}
                keyExtractor={this._keyExtractor}
                renderItem={({ item }) => (
                  // TODO: MODIFY THIS SO IT ONLY RUNS WHILE !this.state.itemIsInTags
                  this._compareToTags(item.description)
                )
                }
                  
              />
                 </View>
            )}
            
        </ScrollView>
      </View>
    );
  }


  _compareToTags = (description) => {
    var tagMatch = false;

    if (description.toLowerCase() in this.state.tags){
      tagMatch = true;
    }

    // for (let i = 0; i < this.state.tags.length; i++) {
    //   console.log(this.state.tags[i]);
    //   if (this.state.tags[i].toLowerCase() === description.toLowerCase()) {
    //     
    //   }
    // }
    if (!this.state.itemIsInTags && tagMatch) {
      this.setState({ itemIsInTags: true });
    }
  };

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(0,0,0,0.4)",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  };

  _maybeRenderImage = () => {
    let { activityImage, googleResponse } = this.state;
    if (!activityImage) {
      return;
    }
    console.log("in maybe render");
    return (
      <View
        style={{
          //marginTop: 20,
          width: 500,
          borderRadius: 3,
          elevation: 2,
        }}
      >
        {/* {!this.state.itemIsInTags && (

          
          <Button
            style={{ marginBottom: 10 }}
            onPress={() => this.submitToGoogle()}
            title="Is this your toothbrush? Click here to submit the photo!"
          />
        )} */}

        <View
          style={{
            borderTopRightRadius: 3,
            borderTopLeftRadius: 3,
            shadowColor: "rgba(0,0,0,1)",
            shadowOpacity: 0.2,
            shadowOffset: { width: 4, height: 4 },
            shadowRadius: 5,
            overflow: "hidden",
          }}
        >
          {/* {!this.state.completedCheck && */}
          <Image source={{ uri: activityImage }} style={{ width: 500, height: 500 }} />
          {/* } */}
        </View>
      </View>
    );
  };

  _keyExtractor = (item, index) => item.id;

  _renderItem = (item) => {
    <Text>response: {JSON.stringify(item)}</Text>;
  };

  _takePhoto = async () => {
    // this.setState({completedCheck : false})

    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };


  // 
  _handleImagePicked = async (pickerResult) => {
    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        uploadUrl = await uploadImageAsync(pickerResult.uri);
        this.setState({ activityImage: uploadUrl });
        this.submitToGoogle();
      }
    } catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    } finally {
      this.setState({ uploading: false });

    }
  };

  submitToGoogle = async () => {
    try {
      this.setState({ completedCheck: false });
      this.setState({ itemIsInTags: false });
      this.setState({ uploading: true });
      let { activityImage } = this.state;
      let body = JSON.stringify({
        requests: [
          {
            features: [
              { type: "LABEL_DETECTION", maxResults: 10 },
              { type: "LANDMARK_DETECTION", maxResults: 5 },
              { type: "FACE_DETECTION", maxResults: 5 },
              { type: "LOGO_DETECTION", maxResults: 5 },
              { type: "TEXT_DETECTION", maxResults: 5 },
              { type: "DOCUMENT_TEXT_DETECTION", maxResults: 5 },
              { type: "SAFE_SEARCH_DETECTION", maxResults: 5 },
              { type: "IMAGE_PROPERTIES", maxResults: 5 },
              { type: "CROP_HINTS", maxResults: 5 },
              { type: "WEB_DETECTION", maxResults: 5 },
            ],
            image: {
              source: {
                imageUri: activityImage,
              },
            },
          },
        ],
      });
      let response = await fetch(
        "https://vision.googleapis.com/v1/images:annotate?key=" +
          Environment["GOOGLE_CLOUD_VISION_API_KEY"],
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: body,
        }
      );
      let responseJson = await response.json();
      console.log(responseJson);
      this.setState({
        googleResponse: responseJson,
        uploading: false,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

async function uploadImageAsync(uri) {
  console.log("uploading async");
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function(e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const ref = firebase
    .storage()
    .ref()
    .child(uuid.v4());
  const snapshot = await ref.put(blob);

  blob.close();

  return await snapshot.ref.getDownloadURL();


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 10,
  },
  contentContainer: {
    paddingTop: 30,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  buttonStyle: {
    padding: 10,
    marginBottom: 50,
    margin: 50,
    backgroundColor: "#FF6978",
    borderRadius: 5,
  },
  goodJobText: {
    marginTop: 10,
    fontWeight: "700",
    fontSize: 30,
    
  },
  badJobText: {
    marginTop: 10,
    fontWeight: "400",
    
  },
});
