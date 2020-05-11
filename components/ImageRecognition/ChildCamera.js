// TODO: the failure path
// TODO: disable back button
import React from "react";
import {
  ActivityIndicator,
  Button,
  Clipboard,
  Dimensions,
  FlatList,
  Image,
  Share,
  StyleSheet,
  Text,
  ScrollView,
  TouchableHighlight,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import * as Progress from "react-native-progress";
import * as Font from "expo-font";

import uuid from "uuid";
import Environment from "../../database/sqlEnv";

import irEnv from "../../database/irEnv";
import firebase from "../../database/irDb";

import Star from "../../assets/images/fillstar.png";
import Ribbon from "../../assets/images/ribbon.png";
import Head from "../../assets/images/PenguinFaceWink.png";

import UserInfo from "../../state/UserInfo";

import { AppLoading } from "expo";
let customFonts = {
  SF: require("../../assets/fonts/SF/SF-Pro-Display-ThinItalic.otf"),
  "Inter-SemiBoldItalic":
    "https://rsms.me/inter/font-files/Inter-SemiBoldItalic.otf?v=3.12",
};

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
const parentId = UserInfo.parent_id;
const childId = UserInfo.child_id;
const userId = UserInfo.user_id;
const pincode = UserInfo.pincode;


// currentImages: eval(this.state.currentImages),

export default class ChildCamera extends React.Component {
  constructor(props) {
    super(props);
    const { navigate } = this.props.navigation;
    this.navigate = navigate;

    this.state = {
      prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
      currentRoutine: this.props.navigation.state.params.currentRoutine,
      currentImages: null,
      childNotificationsId: this.props.navigation.state.params
        .childNotificationsId,
      tags: this.props.navigation.state.params.tags,
      activities: this.props.navigation.state.params.activities,
      key: this.props.navigation.state.params.key,
      activityImage: null,
      itemIsInTags: false,
      uploading: false,
      googleResponse: null,
      fontsLoaded: false,
      tagsDictionary: null,
    };
  }

  concatString(){
    var inputString = "";
    if (this.state.currentImages){
      inputString = this.state.currentImages + "," + this.state.activityImage;
    }
    else {
      console.log("=== empty");
      inputString = this.state.activityImage;
    }
    
    this.updateImageArrayInDb(inputString);
  }

 updateImageArrayInDb(inputString) {
  console.log("inputString is :: " + inputString);
  console.log("the notif id is " + this.state.childNotificationsId);

    var data = {
      image_path_array: inputString,
      activities_complete: this.state.key + 1
    };

    fetch(
      Environment +
        "/updateChildNotifications/" +
        this.state.childNotificationsId,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((results) => {        
        this.goBackToActivityPage();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async getCurrentImages() {
    console.log("getting image paths from db");
    fetch(
      Environment +
        "/getImagePathFromNotifcations/" +
        this.state.childNotificationsId
    )
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((results) => {
        console.log("RESULTS FROM DB ARE " + results[0].image_path_array);
        this.setState({ currentImages: results[0].image_path_array });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  goBackToActivityPage() {
    console.log("leaving page");
    const { navigate } = this.props.navigation;
    this.navigate("ChildActivity", {
    });
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  static navigationOptions = ({ navigation }) => ({
    // title: `${navigation.state.params.currentRoutine}`,
  });

  async componentDidMount() {
    this._loadFontsAsync();
    if (this.state.key > 0){
      this.getCurrentImages();
    }
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);
    this.createTagDictionary();
  }

  // TODO: apply this function on component did mount
  createTagDictionary() {
    var tempDictionary = {};

    for (var i in this.state.tags) {
      var word = this.state.tags[i].toLowerCase();
      tempDictionary[word] = 1;
    }
    this.setState({ tagsDictionary: tempDictionary });
  }

  _compareToTags = (description) => {
    var tagMatch = false;

    if (description.toLowerCase() in this.state.tagsDictionary) {
      tagMatch = true;
    }

    if (!this.state.itemIsInTags && tagMatch) {
      this.setState({ itemIsInTags: true });
      this.concatString();
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
              alignContent: "center",
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
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
          width: 250,
          borderRadius: 3,
          elevation: 2,
        }}
      >
        <View
          style={{
            borderTopRightRadius: 3,
            borderTopLeftRadius: 3,
            shadowColor: "rgba(0,0,0,1)",
            shadowOpacity: 0.2,
            shadowOffset: { width: 4, height: 4 },
            shadowRadius: 5,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={{ uri: activityImage }}
            style={{
              width: 250,
              height: 250,
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </View>
      </View>
    );
  };

  _keyExtractor = (item, index) => item.id;

  _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };

  _handleImagePicked = async (pickerResult) => {
    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        var uploadUrl = await this.uploadImageAsync(pickerResult.uri);
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

  async uploadImageAsync(uri) {
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

  submitToGoogle = async () => {
    try {
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
          irEnv["GOOGLE_CLOUD_VISION_API_KEY"],
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
      this.setState({
        googleResponse: responseJson,
        uploading: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    let { activityImage } = this.state;
    var titleString = "Click here and take a photo of: " + this.state.tags[0];

    if (this.state.fontsLoaded) {
      return (
        <View style={{ flex: 1, resizeMode: "contain" }}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <View style={styles.headerContainerLeft}>
              <View style={styles.headerContainerStar}>
                <Image
                  source={Star}
                  style={{
                    marginTop: "1%",
                    marginLeft: "1%",
                    flex: 1,
                    resizeMode: "contain",
                  }}
                />
              </View>

              <Text style={styles.headerLeftText}>
                {this.state.key + 1} / {this.state.activities.length}
              </Text>
            </View>

            <Image
              source={Head}
              // style={{transform: [{ scale: 0.40 }]}}
              // style={{ width: 140, height: 115 }}
              style={{
                flex: 1,
                width: 140,
                height: 115,
                resizeMode: "contain",
              }}
            />

            <View style={styles.headerContainerRight}>
              <Progress.Bar
                progress={(this.state.key + 1) / this.state.activities.length}
                color={"#B1EDE8"}
                width={100}
                height={30}
                borderWidth={2}
                borderRadius={20}
                // flex: 1,
                // resizeMode: "contain",
                // marginRight: "1%",
              />

              <View style={styles.headerRibbonContainer}>
                <Image
                  source={Ribbon}
                  style={{
                    height: 50,
                    width: 40,
                    marginTop: 1,
                    marginLeft: 9,
                    resizeMode: "contain",
                    flex: 1,
                  }}
                />
              </View>
            </View>
          </View>

          {/* Body */}
          <ScrollView
          // style={styles.container}
          // contentContainerStyle={styles.contentContainer}
          >
            <View>
              {!this.state.itemIsInTags && (
                // <Button
                //   onPress={this._takePhoto}
                //   title={titleString}
                //   titleStyle={{
                //     fontFamily: "SF",
                //     fontSize: 25,
                //     padding: 10,
                //     marginLeft: 20}}
                // />
                <View style={styles.linkContainer}>
                  <TouchableHighlight onPress={this._takePhoto}>
                    <Text style={styles.linkStyle}>{titleString}</Text>
                  </TouchableHighlight>
                </View>
              )}
              {this.state.googleResponse && (
                <View>
                  <FlatList
                    data={
                      this.state.googleResponse.responses[0].labelAnnotations
                    }
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={({ item }) => {
                      if (!this.state.itemIsInTags) {
                        this._compareToTags(item.description);
                      }
                    }}
                  />
                </View>
              )}

              {!this.state.itemIsInTags && (
                <View>
                  {this._maybeRenderImage()}
                  {this._maybeRenderUploadingOverlay()}
                </View>
              )}

              {/* {this.state.googleResponse && this.state.itemIsInTags && (
                <View>
                  {this.concatString()}
                </View>
              )} */}

              {this.state.googleResponse && !this.state.itemIsInTags && (
                <Text>
                  Oh no, your photo didn't match! try again to take a photo of
                  your {this.state.tags[0]}
                </Text>
              )}
            </View>
          </ScrollView>
        </View>
      );
    } else {
      return <AppLoading />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFCF9",
    top: 0,
    left: 0,
    flex: 1,
    paddingBottom: 10,
  },
  contentContainer: {
    paddingTop: 30,
  },
  linkContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  headerContainer: {
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    width: WIDTH,
    top: 0,
    left: 0,
    backgroundColor: "white",
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  headerContainerLeft: {
    height: 10,
    paddingRight: 100,
    marginTop: 50,
    flexDirection: "row",
  },
  headerContainerStar: {
    padding: 10,
    borderRadius: 40,
    borderWidth: 1,
    top: -20,
    right: -15,
    backgroundColor: "white",
    borderColor: "#B1EDE8",
    height: 80,
    width: 80,
    zIndex: 99,
  },
  headerLeftText: {
    fontFamily: "SF",
    borderColor: "#B1EDE8",
    borderWidth: 2,
    height: 40,
    width: 100,
    paddingLeft: 40,
    paddingTop: 10,
    alignItems: "center",
    borderRadius: 20,
  },
  headerContainerRight: {
    height: 30,
    paddingLeft: 100,
    marginTop: 50,
    flexDirection: "row",
  },
  headerRibbonContainer: {
    padding: 10,
    borderRadius: 40,
    borderWidth: 1,
    top: -20,
    left: -15,
    backgroundColor: "white",
    borderColor: "#B1EDE8",
    height: 80,
    width: 80,
  },
  ribbonImage: {
    height: 50,
    width: 40,
    marginTop: 1,
    marginLeft: 9,
  },
  linkStyle: {
    fontFamily: "SF",
    fontSize: 20,
    padding: 10,
    marginLeft: 20,
    color: "#0000EE",
    textDecorationLine: "underline",
    flexWrap: "wrap",
  },
});
