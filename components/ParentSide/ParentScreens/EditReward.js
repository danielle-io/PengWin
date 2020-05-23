import React, { Component } from "react";
import {
  Button,
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { TextField, FilledTextField } from "react-native-material-textfield";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Dropdown } from "react-native-material-dropdown";
import { Video } from "expo-av";
import { Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import SearchableDropdown from "react-native-searchable-dropdown";
import { RaisedTextButton } from "react-native-material-buttons";

import Environment from "../../../database/sqlEnv";
import UserInfo from "../../../state/UserInfo";

const { width: WIDTH } = Dimensions.get("window");

export default class ParentRewards extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Edit Reward",
    prevScreenTitle: "Rewards",
  });

  constructor(props) {
    super(props);
    const { navigate } = this.props.navigation;
    this.navigate = navigate;
    this.state = {
      prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
      rewardId: this.props.navigation.state.params.rewardId,
      rewardName: this.props.navigation.state.params.rewardName,
      rewardDescription: this.props.navigation.state.params.rewardDescription,
      rewardImage: this.props.navigation.state.params.rewardImage,
      rewardVideo: this.props.navigation.state.params.rewardVideo,
      userId: 1,
      photos: null,
      video: null,
      routinesLoaded: false,
      allRoutines: null,
      allActivities: null,
      currentRoutine: null,
      activitiesLoaded: false,
      currentActivity: null,
      routineData: null,
      activityData: null,
      changedRewardFields: [],
    };
  }

  componentDidMount() {
    this.props.navigation.addListener("didFocus", (payload) => {
      this.getRoutines();
      // this.getActivitiesForRoutine();
    });
  }

  createNewReward() {
    const parentId = UserInfo.parent_id;
    const childId = UserInfo.child_id;
    const userId = UserInfo.user_id;
    // console.log("Environment :: " + Environment);
    // console.log("rewardName :: " + this.state.rewardName);
    // console.log("rewardDescription :: " + this.state.rewardDescription);
    // console.log("userId :: " + this.state.userId);

    data = {
      reward_name: this.state.rewardName,
      reward_description: this.state.rewardDescription,
      reward_image: this.state.rewardImage,
      reward_video: this.state.rewardVideo,
      user_id: userId,
      deleted: 0,
    };
    let response = fetch(Environment + "/insertRewards", {
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
        this.setState({ rewardId: results.insertId });
        // this.saveAnyChanges();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getAllActivitiesForRoutine() {
    var routineId = this.state.currentRoutine.id;
    fetch(Environment + "/joinRoutineActivityTableByRoutineId/" + routineId, {
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((results) => {
        this.setState({ allActivities: results });
        this.setState({ activitiesLoaded: true });
        this.storeActivites();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getRoutines() {
    fetch(Environment + "/getRoutinesByUser/" + this.state.userId, {
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((results) => {
        this.setState({ allRoutines: results });
        this.setState({ routinesLoaded: true });
        this.storeRoutines();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async updateRewardField(tag, value) {
    if (tag && value) {
      var data = {
        [tag]: value,
      };
      try {
        let response = await fetch(
          Environment + "/updateReward/" + this.state.rewardId,
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
        console.log(errors);
      }
    }
  }

  storeRoutines() {
    var temprArray = [];
    this.state.allRoutines["routines"].map((item) =>
      temprArray.push({ id: item.routine_id, name: item.routine_name })
    );
    this.setState({ routineData: temprArray });
  }

  storeActivites() {
    var tempArray = [];
    this.state.allActivities.map((item) =>
      tempArray.push({ id: item.activity_id, name: item.activity_name })
    );
    this.setState({ activityData: tempArray });
  }

  pushToChangedRewardsFields(tag, value) {
    if (tag && value) {
      Object.keys(this.state.changedRewardFields).map(function(
        keyName,
        keyIndex
      ) {
        if (keyName === tag) {
          return;
        }
      });
      // console.log("TAG " + tag + " VALUE " + value)

      let tempArray = this.state.changedRewardFields;
      tempArray.push({ [tag]: value });
      this.setState({ changedRewardFields: tempArray });
    }
  }

  updateExistingRewardChanges() {
    if (this.state.changedRewardFields) {
      for (const keyValuePair of this.state.changedRewardFields) {
        Object.entries(keyValuePair).map(([key, val]) => {
          this.updateRewardField(key, val);
        });
      }
    }
  }

  displayForm(currentList) {
    var stateName = "";
    var placeholder = "";
    var displayItems = [];

    if (currentList === "activites") {
      placeholder = "Select an activity";
      displayItems = this.state.activityData;
    } else {
      placeholder = "Select an routine";
      displayItems = this.state.routineData;
    }

    return (
      <View style={styles.drop}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <SearchableDropdown
            onItemSelect={(item) => {
              if (currentList === "activity") {
                this.setState({ currentActivity: item });
              } else {
                this.setState({ currentRoutine: item });
              }
            }}
            containerStyle={{ padding: 5 }}
            itemStyle={styles.dropDownItem}
            itemTextStyle={{ color: "#222" }}
            itemsContainerStyle={{ maxHeight: 140 }}
            items={displayItems}
            resetValue={false}
            textInputProps={{
              placeholder: placeholder,
              underlineColorAndroid: "transparent",
              style: {
                padding: 12,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 5,
              },
            }}
            // value={this.state.currentlySelectedActivity}
            listProps={{
              nestedScrollEnabled: true,
            }}
          />
        </ScrollView>
      </View>
    );
  }


  //from EditActivity
  _handleButtonPress = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this.setState({ photos: pickerResult });
  };

  videoPicker = async () => {
    let vid = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    this.setState({ video: vid });
  };

  returnImage = () => {
    if (this.state.photos) {
      return (
        <Image
          style={{ width: 300, height: 200, borderRadius: 15 }}
          source={{ uri: this.state.photos.uri }}
        />
      );
    } else {
      return <Icon name="camera-enhance" color="#DADADA" size={100} />;
    }
  };

//   returnVideo = () => {
//     if (this.state.video) {
//       return (
//         <Video
//           source={{ uri: this.state.video.uri }}
//           rate={1.0}
//           volume={1.0}
//           isMuted={false}
//           resizeMode="stretch"
//           shouldPlay
//           isLooping
//           style={{ width: 300, height: 300 }}
//         />
//       );
//     } else {
//       return <Icon name="video" color="#DADADA" size={100} />;
//     }
//   };

  fieldRef = React.createRef();
//   onSubmit = () => {
//     let { current: field } = this.fieldRef;
//   };

  rewardName() {}

  _onSubmit = () => {
    console.log("saving");
    // if (this.state.rewardId) {
    //   this.updateExistingRewardChanges();

    // } else {
    //   console.log("new reward");
    //   this.createNewReward();
    // }
  };

  render() {
    const { navigate } = this.props.navigation;
    const ripple = { id: "submitButton" };

    return (
      <ScrollView keyboardShouldPersistTaps="always">
        <View>
          <View style={styles.rewardsContainer}>
            <View>
              <Text style={styles.textFields}>Reward Name</Text>

              <TextField
                id="reward_name"
                placeholder="What's the Reward?"
                value={this.state.rewardName}
                style={(styles.textfieldWithFloatingLabel, styles.textFields)}
                textInputStyle={{ flex: 1 }}
                onChangeText={(text) => this.setState({ rewardName: text })}
                onEndEditing={(e) => {
                  this.pushToChangedRewardsFields(
                    "reward_name",
                    this.state.rewardName
                  );
                }}
              />

              <Text style={styles.textFields}>Reward Description</Text>

              <TextField
                id="reward_description"
                placeholder="Describe the Reward"
                value={this.state.rewardDescription}
                style={(styles.textfieldWithFloatingLabel, styles.textFields)}
                textInputStyle={{ flex: 1 }}
                onChangeText={(text) =>
                  this.setState({ rewardDescription: text })
                }
                onEndEditing={(e) => {
                  this.pushToChangedRewardsFields(
                    "reward_description",
                    this.state.rewardDescription
                  );
                }}
              />

              {this.state.routinesLoaded && (
                <View>
                  <Text style={styles.textFields}>Select Routine</Text>
                  {this.displayForm("routine")}
                </View>
              )}

              {this.state.currentRoutine !== null && (
                <View>{this.getAllActivitiesForRoutine()}</View>
              )}

              {this.state.activitiesLoaded && (
                <View>
                  <Text style={styles.textFields}>Select Activity</Text>
                  {this.displayForm("activites")}
                </View>
              )}

              <View style={styles.editRoutineIconAndTitle}>
                <Text style={styles.textFields}>Add Image</Text>
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    margin: 70,
                  }}
                >
                  <TouchableOpacity
                    style={styles.camerabutton}
                    onPress={this._handleButtonPress}
                  >

                    {this.returnImage()}
                  </TouchableOpacity>
                </View>
              </View>

              {/* <TouchableOpacity
                            style={styles.buttonStyle}
                            onPress={() => {
                                this.navigate('Camera', { prevScreenTitle: 'EditReward' });
                                this._onNext();
                            }}>
                            <Text style={styles.textStyle}>Take A Picture!</Text>
                        </TouchableOpacity> */}

              {/* //insert image  */}

              {/* <Text style = {styles.textFields}>
                        Video 
                    </Text> */}
              {/* //insert vieo
               */}

              {/* <View style={styles.editRoutineIconAndTitle}>
                <Text style={styles.textFields}>Add Video</Text>
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    margin: 70,
                  }}
                >
                  <TouchableOpacity
                    style={styles.camerabutton}
                    // onPress={() => this.videoPicker()}
                  >
÷                  </TouchableOpacity>
                </View>
              </View> */}

              {/* <Button
                            title="Save"
                            type="outline"
                            color='#FF6978'
                        /> */}

              {/* <TouchableOpacity style={styles.button}>
                            <Icon
                                name="camera"
                                color="#FF6978"
                                size={30}
                                style={{ marginRight: 10 }}
                            />
                            <Text>Image</Text>
                        </TouchableOpacity> */}

              {/* <TouchableOpacity style={styles.button}>
                            <Icon
                                name="video"
                                color="#FF6978"
                                size={30}
                                style={{ marginRight: 10 }}
                            />
                            <Text>Video</Text>
                        </TouchableOpacity> */}
            </View>

            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                margin: 15,
                marginBottom: 100,
              }}
            >
              <RaisedTextButton
                onPress={() => this._onSubmit()}
                style={{ width: 150 }}
                titleStyle={styles.buttonstyle}
                title="Save Reward"
                titleColor={"#FF6978"}
                color={"white"}
                ripple={ripple}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  editRoutineIconAndTitle: {
    flexDirection: "row",
    marginTop: 10,
  },
  drop: {
    marginTop: 10,
    marginLeft: 30,
    marginRight: 100,
    marginBottom: 50,
  },
  rewardsContainer: {
    marginTop: 10,
    marginLeft: 100,
    marginRight: 100,
    marginBottom: 50,
  },
  textFields: {
    padding: 2,
    margin: 2,
    marginLeft: 10,
    marginTop: 5,
    marginBottom: 10,
    fontSize: 20,
  },

  // routineTitle: {
  //     paddingLeft: 15,
  //     paddingTop: 12,
  //     marginTop: 15,
  //     fontSize: 10,
  //     marginLeft: 10,
  //     textAlign: 'left',
  //     textAlignVertical: 'center'
  // },
  detailsContainer: {
    padding: 2,
    paddingTop: 10,
    paddingBottom: 15,
  },
  routines: {
    paddingLeft: 3,
    textAlignVertical: "center",
    width: WIDTH * 0.3,
    height: 100,
    marginTop: 5,
    marginBottom: 5,
    borderWidth: 3,
    borderRadius: 15,
    backgroundColor: "white",
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "black",
    shadowOpacity: 0.1,
    borderWidth: 0,
  },
  routineTitle: {
    fontSize: 14,
    textAlign: "center",
    textAlignVertical: "center",
  },
  camerabutton: {
    fontSize: 30,
    height: 150,
    width: 250,
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
  savebutton: {
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
  dropDownItem: {
    padding: 10,
    marginTop: 2,
    backgroundColor: "#ddd",
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonstyle: {
    fontSize: 15,
    padding: 0,
    margin: 0,
    fontWeight: "bold",
  },
});
