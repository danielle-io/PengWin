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
import uuid from "uuid";

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

export default class Activity extends Component {
  constructor(props) {
    super(props);
    this.recording = null;
    this.sound = null;
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;
    this.state = {
      video: null,
      prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
      recordings: [],
      visible: false,
      activityName: this.props.navigation.state.params.activityName,
      activityId: this.props.navigation.state.params.activityId,
      activityTags: this.props.navigation.state.params.activityTags,
      activityImagePath: this.props.navigation.state.params.activityImagePath,
      activityDescription: this.props.navigation.state.params
        .activityDescription,
      activityAudioPath: this.props.navigation.state.params.activityAudioPath,
      activityVideoPath: this.props.navigation.state.params.activityVideoPath,
      isPublic: this.props.navigation.state.params.isPublic,
      rewardImage: this.props.navigation.state.params.rewardImage,
      rewardDescription: this.props.navigation.state.params.rewardImage,
      rewardVideo: this.props.navigation.state.params.rewardVideo,
      previousPage: this.props.navigation.state.params.previousPage,
      allActivitiesDictionary: this.props.navigation.state.params
        .allActivitiesDictionary,

      changedValues: [],
      haveRecordingPermissions: false,
      isLoading: false,
      rewardDescriptionModal: false,
      tempRewardDescription: "",
      isPlaybackAllowed: false,
      muted: false,
      soundPosition: null,
      soundDuration: null,
      recordingDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isRecording: false,
      shouldCorrectPitch: true,
      volume: 1.0,
      rate: 1.0,
    };
    this.recordingSettings = JSON.parse(
      JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY)
    );
  }

  navigationOptions = ({ navigation }) => ({
    title: "Add an Activity",
    // prevScreenTitle: this.props.navigation.state.params.previousPage,
    headerTitleStyle: { textAlign: "center", alignSelf: "center" },
    headerStyle: {
      backgroundColor: "white",
    },
    params: this.getParams(),
  });

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
      }
    } catch (errors) {
      alert(errors);
    }
  }

  async createNewActivity() {
    const parentId = UserInfo.parent_id;
    const childId = UserInfo.child_id;
    const userId = UserInfo.user_id;
    let data = {
      activity_name: this.state.activityName,
      tags: this.state.activityTags.join(","),
      image_path: this.state.activityImagePath,
      activity_description: this.state.activityDescription,
      audio_path: this.state.activityAudioPath,
      video_path: this.state.activityVideoPath,
      reward_image: this.state.rewardImage,
      reward_video: this.state.rewardVideo,
      reward_description: this.state.rewardDescription,
      is_public: this.state.isPublic,
      user_id: userId,
      deleted: 0,
    };
    let response = await fetch(Environment + "/insertActivity", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((results) => {
        this.setState({ activityId: results.insertId });
        if (this.state.previousPage !== "Edit Routine") {
          this.props.navigation.navigate("ParentRoutines");
        } else {
          // Add the new activity to the all activities dictionary
          let data = {
            activity_id: this.state.activityId,
            activity_name: this.state.activityName,
            tags: this.state.activityTags.join(","),
            image_path: this.state.activityImagePath,
            activity_description: this.state.activityDescription,
            audio_path: this.state.activityAudioPath,
            video_path: this.state.activityVideoPath,
            reward_image: this.state.rewardImage,
            reward_video: this.state.rewardVideo,
            reward_description: this.state.rewardDescription,
            is_public: this.state.isPublic,
            user_id: userId,
            deleted: 0,
          };

          var tempDict = this.state.allActivitiesDictionary;
          tempDict[this.state.activityId] = data;
          this.setState({ allActivitiesDictionary: tempDict });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  updateAllChangedAttributes() {
    if (this.state.activityId === null) {
      this.createNewActivity();
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

  getParams() {
    return { allActivitiesDictionary: this.state.allActivitiesDictionary };
  }

  getCurrentSwitchState() {
    if (this.state.isPublic === 1) {
      return true;
    }
    return false;
  }

  handleApprovalSwitchChange() {
    var newSwitchValue = 1;
    if (this.state.isPublic === 0) {
      this.setState({ isPublic: 1 });
    } else {
      this.setState({ isPublic: 0 });
      newSwitchValue = 0;
    }
    this.pushToUpdateActivityArray("is_public", newSwitchValue);
  }

  pushToUpdateActivityArray(tag, value) {
    let tempArray = this.state.changedValues;
    tempArray.push({ [tag]: value });
    this.setState({ changedValues: tempArray });
  }

  componentDidMount() {
    this._askForPermissions();
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

  async _stopPlaybackAndBeginRecording() {
    this.setState({
      isLoading: true,
    });
    if (this.sound !== null) {
      await this.sound.unloadAsync();
      this.sound.setOnPlaybackStatusUpdate(null);
      this.sound = null;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    if (this.recording !== null) {
      this.recording.setOnRecordingStatusUpdate(null);
      this.recording = null;
    }

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(this.recordingSettings);
    recording.setOnRecordingStatusUpdate(this._updateScreenForRecordingStatus);

    this.recording = recording;
    this.setState((state) => {
      const recordings = [...state.recordings, recording];

      return {
        recordings,
      };
    });
    await this.recording.startAsync();
    this.setState({
      isLoading: false,
    });
  }

  async _stopRecordingAndEnablePlayback() {
    this.setState({
      isLoading: true,
    });
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {}
    const info = await FileSystem.getInfoAsync(this.recording.getURI());
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      playsInSilentLockedModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    const { sound, status } = await this.recording.createNewLoadedSoundAsync(
      {
        isLooping: false,
        isMuted: this.state.muted,
        volume: this.state.volume,
        rate: this.state.rate,
        shouldCorrectPitch: this.state.shouldCorrectPitch,
      },
      this._updateScreenForSoundStatus
    );
    this.sound = sound;
    this.setState({
      isLoading: false,
    });
  }

  _onRecordPressed = () => {
    if (this.state.isRecording) {
      this._stopRecordingAndEnablePlayback();
    } else {
      this._stopPlaybackAndBeginRecording();
    }
  };

  _onPlayPausePressed = () => {
    if (this.sound != null) {
      if (this.state.isPlaying) {
        this.sound.pauseAsync();
      } else {
        this.sound.playAsync();
      }
    }
  };

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

  _onSeekSliderValueChange = (value) => {
    if (this.sound != null && !this.isSeeking) {
      this.isSeeking = true;
      this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
      this.sound.pauseAsync();
    }
  };

  _onSeekSliderSlidingComplete = async (value) => {
    if (this.sound != null) {
      this.isSeeking = false;
      const seekPosition = value * this.state.soundDuration;
      if (this.shouldPlayAtEndOfSeek) {
        this.sound.playFromPositionAsync(seekPosition);
      } else {
        this.sound.setPositionAsync(seekPosition);
      }
    }
  };

  _getSeekSliderPosition() {
    if (
      this.sound != null &&
      this.state.soundPosition != null &&
      this.state.soundDuration != null
    ) {
      return this.state.soundPosition / this.state.soundDuration;
    }
    return 0;
  }

  _getMMSSFromMillis(millis) {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = (number) => {
      const string = number.toString();
      if (number < 10) {
        return "0" + string;
      }
      return string;
    };
    return padWithZero(minutes) + ":" + padWithZero(seconds);
  }

  _getPlaybackTimestamp() {
    if (
      this.sound != null &&
      this.state.soundPosition != null &&
      this.state.soundDuration != null
    ) {
      return `${this._getMMSSFromMillis(
        this.state.soundPosition
      )} / ${this._getMMSSFromMillis(this.state.soundDuration)}`;
    }
    return "";
  }

  _getRecordingTimestamp() {
    if (this.state.recordingDuration != null) {
      return `${this._getMMSSFromMillis(this.state.recordingDuration)}`;
    }
    return `${this._getMMSSFromMillis(0)}`;
  }

  
  imagePicker = async (imageName) => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (pickerResult) {
      this._handleImagePicked(pickerResult, imageName);
    }
  };

  newTagAdded(newTag) {
    this.setState({ activityTags: newTag.split(",") });
    if (this.state.activityId) {
      this.updateActivity("tags", newTag.toLowerCase().replace(/\s+/g, ""));
    }
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
      <ScrollView style={{ backgroundColor: "#FFFCF9", padding: 20 }}>
        <View style={styles.textFields}>
          <Text style={styles.titles}>What is the activity called?</Text>

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
          <Text style={styles.titles}>Tags</Text>
          <Text style={styles.description}>
            Tags are words related to the activity that you'd like your child to
            photograph. Type in the word and use a comma or space to add it
            (starting with the most accurate).
          </Text>

          <Tags
            textInputProps={{
              placeholder: "?TAGS",
            }}
            initialTags={this.state.activityTags}
            containerStyle={{ justifyContent: "center" }}
            inputStyle={{
              backgroundColor: "#FFFCF9",
              borderBottomColor: "#c4c4c4",
              borderBottomWidth: 1,
            }}
            onChangeTags={(tags) => this.newTagAdded(tags.join(","))}
            renderTag={({
              tag,
              index,
              onPress,
              deleteTagOnPress,
              readonly,
            }) => (
              <View style={styles.tagsbutton}>
                <Text style={styles.text}>{tag} </Text>
                <TouchableOpacity
                  style={{ paddingLeft: 19 }}
                  key={`${tag}-${index}`}
                  onPress={onPress}
                >
                  <Text style={styles.text}>X</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        <View style={(styles.descriptionBox, styles.textFields)}>
          <Text style={styles.titles}>Activity Image</Text>
          <Text style={styles.description}>
            Upload an image your child can scan to show activity completion.
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
          <Text style={styles.titles}>Description</Text>
          <TextField
            placeholder="Explain steps that would help your child complete the activity."
            value={this.state.activityDescription}
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
          <Text style={styles.titles}>Audio</Text>
          <Text style={styles.description}>
            Is your child an auditory learner? They might like to hear you
            explain the activity to them.
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              margin: 15,
            }}
          >
            <View>
              {/* Record button */}
              <TouchableOpacity
                style={
                  this.state.isRecording ? styles.disabledbutton : styles.button
                }
                onPress={() => this._onRecordPressed()}
              >
                <Icon
                  name="microphone"
                  color={this.state.isRecording ? "#c4c4c4" : "#FF6978"}
                  size={30}
                  style={{ marginRight: 10 }}
                />

                <Text>Record</Text>
              </TouchableOpacity>

              <Text>{this.state.isRecording ? "LIVE" : ""}</Text>
              <View>
                <Text>{this._getRecordingTimestamp()}</Text>
              </View>
            </View>

            <View>
              <TouchableOpacity
                onPress={this._onPlayPausePressed}
                style={
                  this.state.disabled ? styles.disabledbutton : styles.button
                }
              >
                <Text>Play</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Slider
              style={styles.playbackSlider}
              value={this._getSeekSliderPosition()}
              onValueChange={this._onSeekSliderValueChange}
              onSlidingComplete={this._onSeekSliderSlidingComplete}
              disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
            />
            <Text>{this._getPlaybackTimestamp()}</Text>
          </View>

          <View styles={{ flexDirection: "row", justifyContent: "center" }}>
            <TouchableOpacity
              style={styles.chooseButton}
              onPress={() => {
                this.setState({ visible: true });
              }}
            >
              <Icon name="upload" color="#FF6978" size={30} />
              <Text>Choose from recordings</Text>
            </TouchableOpacity>
          </View>

          <Dialog
            visible={this.state.visible}
            onTouchOutside={() => {
              this.setState({ visible: false });
            }}
          >
            <DialogContent style={{ backgroundColor: "#FFFCF9", padding: 20 }}>
              <View>
                <View style={{ margin: 10 }}>
                  <Text
                    style={{
                      color: "#FF6978",
                      fontSize: 30,
                      alignContent: "center",
                    }}
                  >
                    Previous Recordings
                  </Text>
                </View>
                {this.noRecs()}

                {this.state.recordings !== [] && (
                  <View>
                    {this.state.recordings.map((item) => {
                      return (
                        <TouchableOpacity
                          onPress={this._playFromStart}
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            margin: 20,
                            width: 250,
                            borderRadius: 15,
                            height: 50,
                            backgroundColor: "#fff",
                            shadowColor: "grey",
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.4,
                            shadowRadius: 2,
                          }}
                        >
                          <Icon
                            name="music"
                            color="#FF6978"
                            size={30}
                            style={{ paddingRight: 30 }}
                          />
                          <Text style={{ fontSize: 20, color: "black" }}>
                            {item._uri}
                          </Text>
                          <Text>{item._duration}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            </DialogContent>
          </Dialog>
        </View>

        <Dialog
          style={styles.descriptionModal}
          hasOverlay={true}
          overlayOpacity={0.1}
          visible={this.state.rewardDescriptionModal}
          onTouchOutside={() => {
            this.cancelRewardDescription();
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 10,
            }}
          >
            <Text style={styles.titles}>Add a Reward Description</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 6,
            }}
          >
            <TextInput // multiline={true}
              // input={{ paddingLeft: 8, marginLeft: 10, fontSize: 12 }}
              style={styles.rewardDescriptionInput}
              onChangeText={(text) =>
                this.setState({ tempRewardDescription: text })
              }
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 6,
            }}
          >
            <TouchableOpacity
              style={styles.saveButtonMargin}
              onPress={() => this.saveRewardDescription()}
            >
              <Text style={{ textAlign: "center", color: "#fff" }}>Save</Text>
            </TouchableOpacity>
          </View>
        </Dialog>

        <View style={(styles.descriptionBox, styles.textFields)}>
          <Text style={styles.titles}>Video</Text>
          <Text style={styles.description}>
            Is your child a visual learner? A video might help your child learn
            how to do the activity step-by-step.
          </Text>
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
          <Text style={styles.titles}>Activity Reward</Text>
          <Text style={styles.description}>
            Positive reinforcement is amazing for kids! An image and/or a video
            of the reward (eg: video of baby shark) might get your child pumped
            to perform their activities.
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              margin: 15,
            }}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.clickedRewardDescription();
              }}
            >
              <Icon name="text" color="#FF6978" size={30} />
              <Text>{this.getDescriptionText()}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.imagePicker("rewardImage");
              }}
            >
              <Icon
                name="camera"
                color="#FF6978"
                size={30}
                style={{ marginRight: 10 }}
              />
              <Text style={{ overflow: "hidden" }}>{this.getImageText()}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <Icon
                name="video"
                color="#FF6978"
                size={30}
                style={{ marginRight: 10 }}
              />
              <Text>Video</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <View style={(styles.descriptionBox, styles.textFields)}>
            <Text style={styles.titles}>Make Public</Text>
            <Text style={styles.description}>
              Would you like this activity to be added to the public library, so
              other families can access a copy of it for their own use?
            </Text>

            <View style={styles.editRoutineIconAndTitle}>
              <Text style={styles.editRoutinesInstructionsText} />
              <Switch
                style={{ padding: 10 }}
                trackColor={{ false: "#767577", true: "#FF6978" }}
                value={this.getCurrentSwitchState()}
                onValueChange={() => this.handleApprovalSwitchChange()}
              />
            </View>
          </View>
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
});
