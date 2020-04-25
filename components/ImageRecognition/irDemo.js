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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import uuid from "uuid";
import Environment from "../../database/irEnv";
import firebase from "../../database/irDb";

export default class App extends React.Component {
  state = {
    image: null,
    itemIsInTags: false,
    uploading: false,
    completedCheck: false,
    tagsMatched: [],
    googleResponse: null,
    tags: ["toothbrush", "brushing", "teeth", "tooth"],
  };

  async componentDidMount() {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);
  }

  render() {
    let { image } = this.state;

    return (
      <View style={styles.container}>
          
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
    
        
        <View style={styles.helpContainer}>

        {!this.state.itemIsInTags &&
                <Button
                onPress={this._takePhoto}
                title="Take a photo of your toothbrush"
                />
        }
            {this.state.googleResponse && (
              <FlatList
                data={this.state.googleResponse.responses[0].labelAnnotations}
                extraData={this.state}
                keyExtractor={this._keyExtractor}
                renderItem={({ item }) => (
                  <View>{this._compareToTags(item.description)}</View>
                )}
              />
            )}
            {this._maybeRenderImage()}
            {this._maybeRenderUploadingOverlay()}
            {/* {this._setCheckComplete()} */}

            {this.state.googleResponse && this.state.itemIsInTags && (
              <Text>Good job!</Text>
            )}

            {this.state.googleResponse && !this.state.itemIsInTags && (
              <Text>
                Oh no, your photo didn't match! try again to take a photo of
                your toothbrush
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  organize = (array) => {
    return array.map(function(item, i) {
      return (
        <View key={i}>
          <Text>{item}</Text>
        </View>
      );
    });
  };

  _setCheckComplete = () => {
    this.setState({ completedCheck: true });
  };

  _compareToTags = (description) => {
    var tagMatch = false;
    for (let i = 0; i < this.state.tags.length; i++) {
      console.log(this.state.tags[i]);
      if (this.state.tags[i].toLowerCase() === description.toLowerCase()) {
        tagMatch = true;
      }
    }
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
    let { image, googleResponse } = this.state;
    if (!image) {
      return;
    }

    return (
      <View
        style={{
          marginTop: 20,
          width: 250,
          borderRadius: 3,
          elevation: 2,
        }}
      >
        {!this.state.itemIsInTags && (
          <Button
            style={{ marginBottom: 10 }}
            onPress={() => this.submitToGoogle()}
            title="Is this your toothbrush? Click here to submit the photo!"
          />
        )}

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
          <Image source={{ uri: image }} style={{ width: 250, height: 250 }} />
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

  _pickImage = async () => {
    // this.setState({completedCheck : false})

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };

  _handleImagePicked = async (pickerResult) => {
    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        uploadUrl = await uploadImageAsync(pickerResult.uri);
        this.setState({ image: uploadUrl });
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
      let { image } = this.state;
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
                imageUri: image,
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
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center",
  },
  contentContainer: {
    paddingTop: 30,
  },

  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50,
  },

  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center",
  },

  helpContainer: {
    marginTop: 15,
    alignItems: "center",
  },
});
