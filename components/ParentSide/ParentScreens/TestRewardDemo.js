// TODO: the reward amount in the relational table needs to be updated when the
// reward here is removed or added
import React, { Component } from "react";
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Slider,
  Switch,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Text,
} from "react-native";
import { Video } from "expo-av";
import { TextField } from "react-native-material-textfield";
import { Image } from "react-native";
import Tags from "react-native-tags";
import { Player } from "@react-native-community/audio-toolkit";
import Dialog, { DialogContent } from "react-native-popup-dialog";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
import { AppLoading } from "expo";
import SearchableDropdown from "react-native-searchable-dropdown";
import uuid from "uuid";
import { RaisedTextButton } from "react-native-material-buttons";

import Environment from "../../../database/sqlEnv";
import UserInfo from "../../../state/UserInfo";
import firebase from "../../../database/irDb";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
Icon.loadFont();

const mainColor = "#3ca897";
const parentId = UserInfo.parent_id;
const childId = UserInfo.child_id;
const userId = UserInfo.user_id;
const pincode = UserInfo.pincode;

const { width: WIDTH } = Dimensions.get("window");

export default class TestRewardDemo extends Component {
  constructor(props) {
    super(props);
    this.recording = null;
    this.sound = null;
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;
    this.state = {
      filteredRoutines: null,
      // disabled: false,
      video: null,
      prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
      recordings: [],
      visible: false,
      rewardImage: this.props.navigation.state.params.rewardImage,
      rewardDescription: this.props.navigation.state.params.rewardImage,
      rewardVideo: this.props.navigation.state.params.rewardVideo,
      //   previousPage: this.props.navigation.state.params.previousPage,
      allActivitiesDictionary: null,
      routines: null,
      routinesLoaded: false,
      activitiesLoaded: false,
      changedValues: [],
      haveRecordingPermissions: false,
      isLoading: false,
      rewardDescriptionModal: false,
      tempRewardDescription: "",
      isPlaybackAllowed: false,
      currentlySelectedRoutine: null,
      newReward: null,
      rewardRoutines: [],
      addRoutineButtonClicked: false,
      addRewardButtonClicked: false,
      activityChangeLoad: false,
    };
    this.recordingSettings = JSON.parse(
      JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY)
    );
  }

  removeCurrentlyAddedRoutinesFromOptions() {
    var tempArray = [];
    console.log("REMOVE time and routines are ");
    console.log(this.state.routines.length);

    for (var i = 0; i < this.state.routines.length; i++) {
      tempArray.push({
        id: this.state.routines[i].routine_id,
        name: this.state.routines[i].routine_name,
      });
    }
    // this.state.routines.map((item) => {
    //   console.log("ITEM " + item);
    //   //   if (!(key in this.state.routineActivitiesById)) {
    //   tempArray.push({
    //     id: item.routine_id,
    //     name: item.routine_name,
    //   });
    // });
    //   }
    // }
    this.setState({ filteredRoutines: tempArray });
    console.log(this.state.filteredRoutines);
    this.setState({ routinesLoaded: true });
  }

  getAddButtonClickAction(listName) {
    // THIS IS TEMPORARY
    // this.setState({ filteredRoutines: this.state.routines });

    console.log("in get add button click action");
    if (this.state.filteredRoutines === [] && listName === "activity") {
      this.reRenderList(listName);
    }
    listName === "routine"
      ? this.clickedAddRoutine(listName)
      : this.clickedAddReward(listName);
  }

  //   removeCurrentlyAddedRoutinesFromOptions() {
  //     let tempArray = [];

  //     for (var key in this.state.allActivitiesDictionary) {
  //       if (!(key in this.state.routineActivitiesById)) {
  //         tempArray.push({
  //           id: key,
  //           name: this.state.allActivitiesDictionary[key].activity_name,
  //         });
  //       }
  //     }
  //     this.setState({ filteredRoutines: tempArray });
  //     console.log(this.state.filteredRoutines);
  //     this.setState({ routinesLoaded: true });
  //   }

  displayList(listName) {
    var itemNumCounter = 0;
    var mappingVal = [];

    // If no reward, nothing to display
    if (listName === "routine") {
      mappingVal = this.state.rewardRoutines;

      return;
    } else {
      mappingVal = this.state.allActivities;
    }

    var item_name = "";

    //  this is the loop where activities populate and rewards populate
    if (mappingVal !== null) {
      return mappingVal.map((item) => {
        if (listName === "activity") {
          item_name = item.activity_name;
          // console.log("ITEM NAME :: " +item.activity_name);
        } else {
          item_name = item.reward_name;
        }
        itemNumCounter += 1;

        return (
          <View style={styles.formIndent}>
            <View style={styles.editRoutineButtonAndList}>
              <Text style={styles.redNumbers}>{itemNumCounter}</Text>
              <Text style={styles.activityText}>{item_name}</Text>
              <Text>
                <Icon
                  name="minus-circle-outline"
                  style={styles.deleteItemIcon}
                  onPress={() => {
                    if (listName === "activity") {
                      this.removeItem(
                        item.routine_activity_id,
                        item.order,
                        item.activity_id,
                        listName
                      );
                    } else {
                      this.removeItem(
                        item.reward_id,
                        item.reward_id,
                        item.reward_id,
                        listName
                      );
                    }
                  }}
                />
              </Text>
            </View>
          </View>
        );
      });
    }
  }

  // ReRender the components on the click of the new button
  reRenderList(listName) {
    console.log("in rerender");
    this.setState({ activityChangeLoad: false });

    if (listName === "routine") {
      // This is to save the previously added activity if they
      // already added one and now clicked add again
      if (this.state.currentlySelectedRoutine != null) {
        this.addNewActivityToState();
      }

      // Display everything once the activity is loaded
      //   {
      //     this.state.activityChangeLoad && this.displayList(listName);

      //     this.addRow(
      //       Object.keys(this.state.rewardRoutines).length + 1,
      //       "routine"
      //     );
      //   }
      console.log("here ");
      this.addRow(Object.keys(this.state.rewardRoutines).length + 1, "routine");
    }

    // Re-Load Rewards
    // if (listName === "reward") {
    //   this.changeRoutineComponent("reward_id", this.state.newReward.id);

    //   this.setState({
    //     currentlySelectedReward: this.state.allRewardsByIdDictionary[
    //       this.state.newReward.id
    //     ],
    //   });
    // }
  }

  // Add a dropdown item in a new row for activities
  addRow(rowNum, listName) {
    var dropdownItems = null;
    var placeholderText = "";
    var clicked = true;

    if (listName === "activity") {
      clicked = this.state.addRewardButtonClicked;
      placeholderText = "Select an activity";
      dropdownItems = this.state.filteredRoutines;
    
      // console.log(this.state.filteredRoutines);
    } else {
      clicked = this.state.addRoutineButtonClicked;
      placeholderText = "Select a Routine";
      dropdownItems = this.state.filteredRoutines;
      console.log("drop down for routines!");
      console.log(dropdownItems);
      //   console.log("ALL REWARD NAMES " + this.state.allRewardNames);
    }

    return (
      <View>
        {clicked && (
          <View style={styles.formIndent}>
            <View style={styles.editRoutineButtonAndList}>
              <Text style={styles.redNumbers}>{rowNum}</Text>

              <SearchableDropdown
                onItemSelect={(item) => {
                  if (listName === "routine") {
                    this.setState({ currentlySelectedRoutine: item });
                  } else {
                    this.setState({ newReward: item });
                  }
                }}
                containerStyle={{ padding: 5 }}
                itemStyle={styles.dropDownItem}
                itemTextStyle={{ color: "#222" }}
                itemsContainerStyle={{ maxHeight: 140 }}
                items={dropdownItems}
                // defaultIndex={2}
                resetValue={false}
                textInputProps={{
                  placeholder: placeholderText,
                  underlineColorAndroid: "transparent",
                  style: {
                    padding: 12,
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 5,
                  },
                }}
                // value={this.state.currentlySelectedRoutine}
                listProps={{
                  nestedScrollEnabled: true,
                }}
              />
            </View>
          </View>
        )}
      </View>
    );
  }

  addNewActivityToState() {
    var order = Object.keys(this.state.routineActivitiesByOrder).length;

    var activity = this.state.allActivitiesDictionary[
      this.state.currentlySelectedRoutine.id
    ];

    // Insert a new activity into the relationship table
    this.insertActivityRelationship(activity.activity_id, order);
  }

  addNewItemButtonToList(listName) {
    var textfield = "";
    listName === "routine"
      ? (textfield = "Add a routine")
      : (textfield = "Add an activity");

    // Don't include the add button if there's a reward
    // since you can only add one to a routine.
    if (listName === "reward") {
      if (!this.state.rewardLoaded) {
        return;
      }
      if (this.state.currentlySelectedReward !== null) {
        if (this.state.rewardId !== 0) {
          return;
        }
      }
    }

    // This is to prevent rendering an add button or list if user has not
    // yet added activities
    // else if (this.state.filteredRoutines === []) {
    //   return (
    //     <View style={styles.formIndent}>
    //       <Text style={styles.activityText}>
    //         You have no un-used activities to add. Activities can be created
    //         from the activities menu.
    //       </Text>
    //     </View>
    //   );
    // }
    // Render the button to add a new item
    return (
      <View style={styles.formIndent}>
        <View style={styles.editRoutineButtonAndList}>
          <RaisedTextButton
            style={styles.roundAddButton}
            titleStyle={{
              color: "#FFFFFF",
              fontSize: 10,
              padding: 0,
              margin: 0,
              fontWeight: "bold",
            }}
            onPress={() => {
              this.getAddButtonClickAction(listName);
            }}
            title="+"
            titleColor="white"
            color="#FF6978"
          />
        </View>
      </View>
    );
  }

  getRoutines() {
    console.log("getting routines");
    fetch(Environment + "/getRoutinesByUser/" + userId, {
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((routineResults) => {
        this.setState({ routines: routineResults.routines });
        this.removeCurrentlyAddedRoutinesFromOptions();
        // this.checkAmounts(routineResults);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getAllActivitiesForUser() {
    console.log("get activities");

    fetch(Environment + "/getActivities/" + userId, {
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((activitiesResults) => {
        this.setState({ allActivities: activitiesResults });
        this.setState({ activitiesLoaded: true });

        // this.createActivityDictionary();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  updateActivity(tag, value) {
    var data = {
      [tag]: value,
    };
    try {
      let response = fetch(
        Environment + "/updateActivity/" + this.state.activityId,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (response.status >= 200 && response.status < 300) {
        console.log("SUCCESS");
      }
    } catch (errors) {
      alert(errors);
    }
  }

  //   createActivityDictionary() {
  //     var tempDict = {};
  //     if (this.state.allActivities) {
  //       this.state.allActivities.map((item) => {
  //         tempDict[item.activity_id] = item;
  //       });
  //       this.setState({ allActivitiesDictionary: tempDict });
  //       this.setState({ activitiesLoaded: true });
  //     }
  //   }

  updateAllChangedAttributes() {
    if (this.state.activityId === null) {
      console.log("no activity id !!");
    } else {
      if (this.state.changedValues) {
        for (const keyValuePair of this.state.changedValues) {
          Object.entries(keyValuePair).map(([key, val]) => {
            this.updateActivity(key, val);
          });
        }
      }
    }
    if (this.state.previousPage !== "Edit Routine") {
      this.props.navigation.navigate("ParentRoutines");
    }
  }

  pushToUpdateActivityArray(tag, value) {
    let tempArray = this.state.changedValues;
    tempArray.push({ [tag]: value });
    this.setState({ changedValues: tempArray });
  }

  async componentDidMount() {
    this.getRoutines();

    this.getAllActivitiesForUser();
    if (this.state.activitiesLoaded) {
      console.log("here");
      this.displayActivities();
    }

    this.getAllRewardsForUser();

    this._askForPermissions();
    console.log(this.state.activityTags);

    await this.props.navigation.addListener("didFocus", (payload) => {
      console.log("reloading items");
      this.setState({ routinesLoaded: false });
      this.setState({ activitiesLoaded: false });

      this.getRoutines();

      if (this.state.routinesLoaded) {
        this.displayRoutines();
      }
    });
  }

  _askForPermissions = async () => {
    const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.setState({
      haveRecordingPermissions: response.status === "granted",
    });
  };

  _updateScreenForSoundStatus = (status) => {
    if (status.isLoaded) {
      this.setState({
        soundDuration: status.durationMillis,
        soundPosition: status.positionMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        rate: status.rate,
        muted: status.isMuted,
        volume: status.volume,
        shouldCorrectPitch: status.shouldCorrectPitch,
        isPlaybackAllowed: true,
      });
    } else {
      this.setState({
        soundDuration: null,
        soundPosition: null,
        isPlaybackAllowed: false,
      });
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  _updateScreenForRecordingStatus = (status) => {
    if (status.canRecord) {
      this.setState({
        isRecording: status.isRecording,
        recordingDuration: status.durationMillis,
      });
    } else if (status.isDoneRecording) {
      this.setState({
        isRecording: false,
        recordingDuration: status.durationMillis,
      });
      if (!this.state.isLoading) {
        this._stopRecordingAndEnablePlayback();
      }
    }
  };

  _handleImagePicked = async (pickerResult, imageName) => {
    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        var uploadUrl = await this.uploadImageAsync(pickerResult.uri);
        console.log("Upload URL is " + uploadUrl);

        if (imageName === "activityImage") {
          this.setState({ activityImagePath: uploadUrl });
          this.pushToUpdateActivityArray(
            "image_path",
            this.state.activityImagePath
          );
        } else {
          this.setState({ rewardImage: uploadUrl });
          this.pushToUpdateActivityArray(
            "reward_image",
            this.state.rewardImage
          );
        }
      }
    } catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    } finally {
      this.setState({ uploading: false });
    }
  };

  async uploadImageAsync(uri) {
    console.log("uploading image");
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

  _playFromStart = () => {
    this._onSeekSliderSlidingComplete(0);
    if (this.sound != null) {
      if (this.state.isPlaying) {
        this.sound.pauseAsync();
      } else {
        this.sound.playAsync();
      }
    }
  };

  imagePicker = async (imageName) => {
    console.log("in image picker");
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (pickerResult) {
      console.log("picker result is here " + pickerResult);
      this._handleImagePicked(pickerResult, imageName);
      // this.setState({ activityImagePath: pickerResult });
    }
  };

  newTagAdded(newTag) {
    console.log("newTagAdded");
    console.log("tag is " + newTag);
    this.setState({ activityTags: newTag.split(",") });
    if (this.state.activityId) {
      console.log("activity id exists");
      this.updateActivity("tags", newTag.toLowerCase().replace(/\s+/g, ""));
    }
    console.log("state is " + this.state.activityTags);
  }

  getImageText() {
    if (this.state.rewardImage !== null) {
      return this.state.rewardImage.substring(0, 5) + "..";
    } else {
      return "Image";
    }
  }

  getDescriptionText() {
    if (this.state.rewardDescription !== null) {
      var textPreview = this.state.rewardDescription.substring(0, 5) + "..";
      return textPreview;
    } else {
      return "Description";
    }
  }

  videoPicker = async () => {
    let vid = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    this.setState({ video: vid });
    console.log("VIDEO " + vid);
  };

  returnImage = () => {
    if (this.state.activityImagePath) {
      return (
        <Image
          style={{ width: 300, height: 200, borderRadius: 15 }}
          source={{ uri: this.state.activityImagePath }}
        />
      );
    } else {
      return <Icon name="camera-enhance" color="#DADADA" size={100} />;
    }
  };

  returnVideo = () => {
    console.log(this.state.video);
    if (this.state.video) {
      return (
        <Video
          source={{ uri: this.state.video.uri }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="stretch"
          shouldPlay
          isLooping
          style={{ width: 300, height: 300 }}
        />
      );
    } else {
      return <Icon name="camera-enhance" color="#DADADA" size={100} />;
    }
  };

  fieldRef = React.createRef();

  onSubmit = () => {
    let { current: field } = this.fieldRef;
    console.log(field.value());
  };

  clickedRewardDescription() {
    this.setState({ rewardDescriptionModal: true });
  }

  formatText = (text) => {
    return text.replace(/[^+\d]/g, "");
  };

  noRecs = () => {
    if (this.state.recordings.length == 0) {
      return (
        <Text style={{ color: "#c4c4c4", padding: 10 }}>
          There are no recordings
        </Text>
      );
    }
  };

  clickedAddReward() {
    // this.setState({
    //   addRewardButtonClicked: true,
    // });
    // this.addRow(1, "reward");
  }

  clickedAddRoutine() {
    this.setState({
      addRoutineButtonClicked: true,
    });
    this.reRenderList("routine");
  }

  cancelRewardDescription() {
    this.setState({ rewardDescriptionModal: false });
  }

  saveRewardDescription() {
    this.setState({ rewardDescriptionModal: false });

    if (this.state.tempRewardDescription !== "") {
      this.setState({ rewardDescription: this.state.tempRewardDescription });
      this.pushToUpdateActivityArray(
        "reward_description",
        this.state.tempRewardDescription
      );
    }
  }

  render() {
    return (
      <ScrollView
        keyboardShouldPersistTaps="always"
        style={{ backgroundColor: "#FFFCF9", padding: 20 }}
      >
        <View style={styles.textFields}>
          <Text style={styles.titles}>What is the reward called?</Text>

          <TextField
            placeholder="(e.g. Wear Shoes)"
            value={this.state.activityName}
            style={(styles.textfieldWithFloatingLabel, styles.textFields)}
            textInputStyle={{ flex: 1 }}
            onEndEditing={(e) => {
              this.pushToUpdateActivityArray(
                "activity_name",
                this.state.activityName
              );
            }}
            onChangeText={(text) => this.setState({ activityName: text })}
          />
        </View>

        <View style={(styles.descriptionBox, styles.textFields)}>
          <Text style={styles.titles}>Reward Image</Text>
          <Text style={styles.description}>
            Upload an image for the reward.
          </Text>
          <View style={{ margin: 20, alignItems: "center" }}>
            <TouchableOpacity
              style={styles.camerabutton}
              onPress={() => {
                this.imagePicker("activityImage");
              }}
            >
              {this.returnImage()}
            </TouchableOpacity>
          </View>
        </View>

        <View style={(styles.descriptionBox, styles.textFields)}>
          <Text style={styles.titles}>Reward Description</Text>
          <TextField
            placeholder="Set reward description."
            value={this.state.activityDescription}
            // labelOffset={10}
            style={
              (styles.textfieldWithFloatingLabel,
              styles.textFields,
              styles.descriptionLines)
            }
            textInputStyle={{ flex: 1 }}
            onEndEditing={(e) => {
              this.pushToUpdateActivityArray(
                "activity_description",
                this.state.activityDescription
              );
            }}
            multiline={true}
            onChangeText={(text) =>
              this.setState({ activityDescription: text })
            }
          />
        </View>

        <View style={(styles.descriptionBox, styles.textFields)}>
          <Text style={styles.titles}>Reward Video</Text>
          <Text style={styles.description}>Add a reward video.</Text>
          <View style={{ margin: 20, alignItems: "center" }}>
            <TouchableOpacity
              style={styles.camerabutton}
              onPress={() => this.videoPicker()}
            >
              {this.returnVideo()}
            </TouchableOpacity>
          </View>
        </View>

        <View style={(styles.descriptionBox, styles.textFields)}>
          {this.state.activitiesLoaded && this.state.routinesLoaded && (
            <View>
              <Text style={styles.titles}>Apply To Routines</Text>
              <Text style={styles.description}>
                Choose the routines that will contain this reward.
              </Text>
              <View style={{ marginBottom: 10 }} />

              {this.displayList("routine")}
              {this.addRow(
                Object.keys(this.state.rewardRoutines).length + 1,
                "routine"
              )}
              {this.addNewItemButtonToList("routine")}
            </View>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            margin: 15,
            marginBottom: 100,
          }}
        >
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => this.updateAllChangedAttributes()}
          >
            <Text style={{ color: "#fff", fontSize: 20 }}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  addImageButton: {
    color: "grey",
    fontSize: 65,
  },
  activityImage: {
    position: "absolute",
    paddingHorizontal: 50,
    height: 200,
    width: 200,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 200,
  },
  imageButton: {
    marginTop: 50,
    marginLeft: 100,
  },
  textFields: {
    padding: 2,
    margin: 2,
    marginLeft: 10,
  },
  descriptionBox: {
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 15,
  },
  descriptionLines: {
    marginBottom: 4,
    marginLeft: 8,
    marginRight: 8,
    marginTop: 10,
  },
  lowerCorner: {
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: "flex-end",
    marginRight: 20,
  },
  footer: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopWidth: 1,
    borderTopColor: "#e8e8e8",
    backgroundColor: "#e8e8e8",
  },
  roundButton: {
    fontSize: 30,
    height: 50,
    minWidth: 50,
    width: 50,
    borderRadius: 50,
    color: "#40b6ac",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: mainColor,
  },
  textInput: {
    height: 40,
    borderColor: "white",
    borderWidth: 1,
    marginTop: 8,
    borderRadius: 5,
    padding: 3,
  },
  tag: {
    backgroundColor: "#fff",
  },
  tagText: {
    color: mainColor,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  tagsbutton: {
    flexWrap: "nowrap",
    overflow: "hidden",
    fontSize: 30,
    height: 30,
    minWidth: 50,
    // width: 100,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderColor: "#FF6978",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 12,
    paddingRight: 8,
    margin: 6,
  },
  button: {
    fontSize: 30,
    minWidth: 150,
    minHeight: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderColor: "#FF6978",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    margin: 5,
    padding: 2,
  },
  chooseButton: {
    fontSize: 30,
    minWidth: 50,
    minHeight: 40,
    width: "30%",
    borderRadius: 20,
    backgroundColor: "#fff",
    borderColor: "#FF6978",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    margin: 5,
    padding: 2,
  },
  saveButton: {
    fontSize: 30,
    minWidth: 150,
    minHeight: 40,
    borderRadius: 20,
    backgroundColor: "#FF6978",
    borderColor: "#fff",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    margin: 5,
    padding: 2,
  },
  saveButtonMargin: {
    fontSize: 30,
    minWidth: 150,
    minHeight: 40,
    borderRadius: 20,
    backgroundColor: "#FF6978",
    borderColor: "#fff",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 5,
    padding: 2,
    marginBottom: 10,
  },
  disabledbutton: {
    fontSize: 30,
    minWidth: 150,
    minHeight: 40,
    borderRadius: 20,
    backgroundColor: "#ffff",
    borderColor: "#c4c4c4",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    margin: 5,
    padding: 2,
  },
  camerabutton: {
    fontSize: 30,
    height: 200,
    width: 300,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    margin: 5,
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  text: {
    color: "#FF6978",
  },
  titles: {
    fontSize: 24,
    padding: 5,
  },
  description: {
    fontSize: 20,
    padding: 5,
  },
  descriptionModal: {
    // margin: 12,
    // height: 100,
    // marginTop: 8,
    // backgroundColor: "#f7f7f7",
    // padding: 20,
    // minWidth: 150,
    // width: "70%",
    // alignItems: "center",
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 1,
    //   height: 2,
    // },
    shadowOpacity: 0.65,
    shadowRadius: 3.84,
    elevation: 5,
    fontSize: 30,
    height: 200,
    width: 300,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    margin: 5,
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    paddingBottom: 10,
  },
  redNumbers: {
    marginLeft: 10,
    color: "#FF6978",
    fontSize: 20,
    padding: 0,
    margin: 0,
    marginTop: 3,
    fontWeight: "bold",
  },
  editRoutineButtonAndList: {
    flexDirection: "row",
  },
  rewardDescriptionInput: {
    marginLeft: 10,
    width: "70%",
    minWidth: 130,
    borderRadius: 15,
    borderColor: "#d3d3d3",
    borderStyle: "solid",
    borderWidth: 1,
    height: 100,
    // justifyContent: "center",
  },
  dropDownItem: {
    padding: 10,
    marginTop: 2,
    backgroundColor: "#ddd",
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 5,
  },
  roundAddButton: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    marginRight: 10,
    height: 35,
    minWidth: 35,
    width: 35,
    borderRadius: 50,
    color: "white",
    fontWeight: "bold",
  },
});
