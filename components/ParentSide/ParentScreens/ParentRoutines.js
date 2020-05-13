// TODO: move activitites page and tab over to allActivitiesDictionary
// rather than allActivities
import React, { Component } from "react";
import {
  Button,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RaisedTextButton } from "react-native-material-buttons";
import {
  MenuProvider,
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import MaterialTabs from "react-native-material-tabs";
import Dialog, { DialogContent, DialogFooter } from "react-native-popup-dialog";
import SearchableDropdown from "react-native-searchable-dropdown";
import { AppLoading } from "expo";

import Environment from "../../../database/sqlEnv";
import UserInfo from "../../../state/UserInfo";

const { width: WIDTH } = Dimensions.get("window");
const parentId = UserInfo.parent_id;
const childId = UserInfo.child_id;
const userId = UserInfo.user_id;
const pincode = UserInfo.pincode;

Icon.loadFont();

export default class ParentRoutines extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Routines",
    prevScreenTitle: "Routines",
    activeTab: 2,
  });

  constructor() {
    super();
    this.state = {
      routinesLoaded: false,
      activitiesLoaded: false,
      routines: null,
      allActivities: null,
      index: 0,
      selectedTab: 0,
      routes: [{ key: "1", title: "First" }, { key: "2", title: "Second" }],
      deleteModalVisible: false,
      allRewardsByIdDictionary: null,
      allActivitiesDictionary: null,
      typeToDelete: null,
    };
  }

  _renderScene = ({ route }) => {
    switch (route.key) {
      case "1":
        return (
          <View
            style={{
              flex: 1,
              backgroundColor: "#ff4081",
            }}
          />
        );
      case "2":
        return (
          <View
            style={{
              flex: 1,
              backgroundColor: "#673ab7",
            }}
          />
        );
      default:
        return null;
    }
  };

  _renderPage = (props) => (
    <TabViewPage {...props} renderScene={this._renderScene} />
  );

  // This allows this page to refresh when you come back from
  // edit routines, which allows it to display any changes made
  async componentDidMount() {
    await this.props.navigation.addListener("didFocus", (payload) => {
      console.log("reloading items");
      this.setState({ routinesLoaded: false });
      this.setState({ activitiesLoaded: false });
      this.getRoutines();
      this.getAllActivitiesForUser();
      this.getAllRewardsForUser();
      if (this.state.activitiesLoaded) {
        this.displayActivities();
      }
      if (this.state.routinesLoaded) {
        this.displayRoutines();
      }
    });
  }

  getRoutines() {
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
        this.setState({ routines: routineResults });
        this.setState({ routinesLoaded: true });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  checkActivityAmount(routineId, amountOfActivities) {
    console.log("routine id is " + routineId);
    fetch(Environment + "/getAmountOfActivitiesInRoutine/" + routineId, {
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((activities) => {
        console.log(activities);
        if (activities === []) {
          console.log("returning 0");
          return 0;
        }
        console.log("LENGTH IS " + Object.keys(activities).length);
        if (activities.length !== amountOfActivities) {
          this.updateRoutine(
            routineId,
            "amount_of_activities",
            activities.length
          );
          console.log("returning activities.length " + activities.length);
          return activities.length;
        } else {
          console.log("returning amount of activities " + amountOfActivities);
          return amountOfActivities;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // Having issues with this. might move to on login.
  confirmAmountOfActivities(routineId, amountOfActivities) {
    return this.checkActivityAmount(routineId, amountOfActivities);
  }

  updateRoutine(routineId, tag, value) {
    console.log("updating " + tag + " for id " + routineId + " to " + value);
    var data = {
      [tag]: value,
    };
     {
      let response = fetch(Environment + "/updateRoutine/" + routineId, {
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
      .then((routineResults) => {

        console.log("SUCCESS: updated amount of activities");
        this.setState({ routinesLoaded: false });

        console.log("duplicate worked");
        this.getRoutines();

        if (this.state.routinesLoaded) {
          console.log("routines loaded again");
          this.displayRoutines();
        }
      })
      // if (response.status >= 200 && response.status < 300) {
        
        // return value;
      // }
    // } catch (errors) {
    //   console.log(errors);
    }
  }

  async updateActivityRelationship(routine_activity_id, tag, value) {
    console.log(
      "TAG IS " +
        tag +
        " ROUTINE_ACTIVITY_ID IS " +
        routine_activity_id +
        " VALUE IS " +
        value
    );
    var data = {
      [tag]: value,
    };
    try {
      let response = await fetch(
        Environment + "/updateActivityRelationship/" + routine_activity_id,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      console.log(response.status);
      if (response.status >= 200 && response.status < 300) {
        console.log("status is 200");
      }
    } catch (errors) {
      console.log(errors);
    }
  }

  // TODO: get each activity, sum the reward_id != null
  getTotalRewardsInRoutine(routineId) {
    fetch(Environment + "/getActivitiesWithRewardsPerRoutine/" + routineId)
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((rewards) => {})
      .catch((error) => {
        console.error(error);
      });
  }

  getAllRewardsForUser() {
    fetch(Environment + "/getAllRewards/" + userId, {
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((rewardsResults) => {
        this.createRewardDictionary(rewardsResults);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  createRewardDictionary(rewardsResults) {
    var tempDict = {};
    rewardsResults.map((item) => {
      tempDict[item.reward_id] = item;
    });

    this.setState({ allRewardsByIdDictionary: tempDict });
  }

  createActivityDictionary() {
    var tempDict = {};
    if (this.state.allActivities) {
      this.state.allActivities.map((item) => {
        tempDict[item.activity_id] = item;
      });
      this.setState({ allActivitiesDictionary: tempDict });
      this.setState({ activitiesLoaded: true });
    }
  }

  getAllActivitiesForUser() {
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
        this.createActivityDictionary();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // This is how you update a column in the routines table
  async changeActiveStatus(routineId, tag, value) {
    if (value === 1) {
      value = 0;
    } else {
      value = 1;
    }
    var data = {
      [tag]: value,
    };
    try {
      let response = await fetch(Environment + "/updateRoutine/" + routineId, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.status >= 200 && response.status < 300) {
        this.getRoutines();
        this.displayRoutines();
      }
    } catch (errors) {
      console.log(errors);
    }
  }

  tabIsRoutines() {
    if (this.state.selectedTab === 0) {
      return true;
    }
    return false;
  }

  // This changes the menu text to active or inactive
  setActiveText(activeStatus, currentRoutineId) {
    if (activeStatus === 1) {
      return "Set Inactive";
    }
    return "Set Active";
  }

  duplicateActivity(item) {
    let data = {
      user_id: userId,
      activity_name: item.activity_name + " (copy)",
      tags: item.tags,
      image_path: item.image_path,
      activity_description: item.activity_description,
      audio_path: item.audio_path,
      video_path: item.video_path,
      reward_id: item.reward_id,
      is_public: item.is_public,
      deleted: 0,
    };
    let response = fetch(Environment + "/insertActivity", {
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
        console.log("new insert!!!");
        this.setState({ activitiesLoaded: false });

        this.getAllActivitiesForUser();

        if (this.state.activitiesLoaded) {
          console.log("activities loaded again");
          this.displayActivities();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  duplicateRoutine(item) {
    let data = {
      parent_id: parentId,
      child_id: childId,
      user_id: userId,
      routine_name: item.routine_name + " (copy)",
      start_time: item.start_time,
      end_time: item.end_time,
      requires_approval: item.requires_approval,
      monday: item.monday,
      tuesday: item.tuesday,
      wednesday: item.wednesday,
      thursday: item.thursday,
      friday: item.friday,
      saturday: item.saturday,
      sunday: item.sunday,
      amount_of_activities: item.amount_of_activities,
      amount_of_rewards: item.amount_of_rewards,
      reward_id: item.reward_id,
      skip_once: 0,
      is_active: 0,
      deleted: 0,
    };
    let response = fetch(Environment + "/insertRoutine", {
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
        // Set the activities inside the new routine
        this.addActivityRelationshipsToDuplicateRoutine(
          item.routine_id,
          results.insertId
        );
        this.setState({ routinesLoaded: false });

        console.log("duplicate worked");
        this.getRoutines();

        if (this.state.routinesLoaded) {
          console.log("routines loaded again");
          this.displayRoutines();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  addActivityRelationshipsToDuplicateRoutine(oldId, newId) {
    console.log(
      "addActivityRelationshipsToDuplicateRoutine  old id is " + oldId
    );

    fetch(Environment + "/joinRoutineActivityTableByRoutineId/" + oldId)
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((activities) => {
        this.copyActivityDataForDuplicates(activities, newId);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  copyActivityDataForDuplicates(activities, newId) {
    activities.map((item) => {
      this.insertActivityRelationship(item.activity_id, item.order, newId);
    });
  }

  getActivityRelationshipsForDeletion(activityId) {
    console.log("getActivityRelationshipsForDeletion id is " + activityId);

    fetch(Environment + "/getAllRelationshipsForActivity/" + activityId)
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((activityRoutineItems) => {
        console.log();
        this.removeActivityOrders(activityRoutineItems);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  removeActivityOrders(activityRoutineItems) {
    for (var i = 0; i < activityRoutineItems.length; i++) {
      this.updateActivityRelationship(
        activityRoutineItems[i].routine_activity_id,
        "order",
        -1
      );
      this.updateActivityRelationship(
        activityRoutineItems[i].routine_activity_id,
        "deleted",
        1
      );
    }
    this.setState({ typeToDelete: null });
    this.setState({ itemToDelete: null });
  }

  async insertActivityRelationship(activityId, order, routineId) {
    var data = {
      routine_id: routineId,
      activity_id: activityId,
      order: order,
    };
    try {
      let response = await fetch(
        Environment + "/insertRoutineActivityRelationship/",
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
      console.log(errors);
    }
  }

  itemDeletionModal(item, type) {
    this.setState({ itemToDelete: item });
    this.setState({ typeToDelete: type });
    this.setState({ deleteModalVisible: true });
  }

  deleteItem() {
    console.log("deleteItem()");
    this.setState({ deleteModalVisible: false });
    if (this.state.typeToDelete === "activity") {
      this.getActivityRelationshipsForDeletion(
        this.state.itemToDelete.activity_id
      );
    }
    if (this.state.typeToDelete === "routine") {
      this.updateRoutine(this.state.itemToDelete.routine_id, "deleted", 1);
    }
  }

  cancelDelete() {
    this.setState({ deleteModalVisible: false });
    this.setState({ typeToDelete: null });
    this.setState({ itemToDelete: null });
  }

  displayLibraryContainer() {
    let ripple = { id: "addButton" };
    return (
      <View style={styles.routineContainer}>
        <RaisedTextButton
          style={styles.roundAddButton}
          title="+"
          color="#FF6978"
          onSelect={() =>
            this.props.navigation.navigate("PublicActivities", {
              prevScreenTitle: "Routines",
            })
          }
          ripple={ripple}
        />

        <Text style={styles.routineTitle}>Add a Public Activity</Text>
      </View>
    );
  }

  displayNewActivityContainer() {
    let ripple = { id: "addButton" };

    return (
      <View style={styles.routineContainer}>
        <RaisedTextButton
          style={styles.roundAddButton}
          title="+"
          color="#FF6978"
          onPress={
            (this._onPress,
            () =>
              this.props.navigation.navigate("EditActivity", {
                prevScreenTitle: "Routines",
                activityName: null,
                activityId: null,
                activityImagePath: null,
                activityDescription: null,
                activityAudioPath: null,
                activityVideoPath: null,
                rewardId: null,
                activityTags: [],
                isPublic: 0,
                deletingRoutine: null,
                allRewardsByIdDictionary: this.state.allRewardsByIdDictionary,
              }))
          }
          ripple={ripple}
        />
        <Text style={styles.routineTitle}>Create a New Activity</Text>
      </View>
    );
  }

  displayNewRoutineContainer() {
    let ripple = { id: "addButton" };

    return (
      <View style={styles.routineContainer}>
        <RaisedTextButton
          style={styles.roundAddButton}
          title="+"
          color="#FF6978"
          onPress={
            (this._onPress,
            () =>
              this.props.navigation.navigate("EditRoutine", {
                prevScreenTitle: "Routines",
                routineId: null,
                routineName: null,
                startTime: "00:00",
                endTime: "00:00",
                requiresApproval: 0,
                amount_of_activities: 0,
                amount_of_rewards: 0,
                monday: 0,
                tuesday: 0,
                wednesday: 0,
                thursday: 0,
                friday: 0,
                saturday: 0,
                sunday: 0,
                rewardId: 0,
                allActivities: this.state.allActivities,
                allActivitiesDictionary: this.state.allActivitiesDictionary,
                allRewardsByIdDictionary: this.state.allRewardsByIdDictionary,
              }))
          }
          ripple={ripple}
        />

        <Text style={styles.routineTitle}>New Routine</Text>
      </View>
    );
  }

  displayActivities() {
    let ripple = { id: "addButton" };

    return this.state.allActivities.map((item) => {
      return (
        <View style={styles.routineContainer}>
          <View style={styles.routineTitleAndMenu}>
            <Text style={styles.routineTitle}> {item.activity_name}</Text>
            <MenuProvider>
              <View style={styles.routineTitleAndMenu}>
                <Text style={styles.routineTitle}> {item.routine_name}</Text>
                <Menu style={styles.routineMenuStyling}>
                  <MenuTrigger style={styles.ellipsis} text="..." />
                  <MenuOptions>
                    <MenuOption
                      onSelect={() =>
                        this.props.navigation.navigate("EditActivity", {
                          prevScreenTitle: "Routines",
                          activityName: item.activity_name,
                          activityId: item.activity_id,
                          activityTags: item.tags.split(","),
                          activityImagePath: item.image_path,
                          activityDescription: item.activity_description,
                          activityAudioPath: item.audio_path,
                          activityVideoPath: item.video_path,
                          activityIsPublic: item.is_public,
                          rewardId: item.reward_id,
                          allRewardsByIdDictionary: this.state
                            .allRewardsByIdDictionary,
                        })
                      }
                      ripple={ripple}
                    >
                      <Text style={{ color: "black" }}>Edit</Text>
                    </MenuOption>
                    <MenuOption
                      onSelect={() => console.log("quick start")}
                      text="Quick Start"
                    />
                    <MenuOption
                      onSelect={() => this.duplicateActivity(item)}
                      text="Duplicate"
                    />
                    {/* TODO: set up delete activity method */}
                    <MenuOption
                      onSelect={() => this.itemDeletionModal(item, "activity")}
                    >
                      <Text style={{ color: "red" }}>Delete</Text>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              </View>
            </MenuProvider>
          </View>
        </View>
      );
    });
  }

  displayRoutines() {
    var containerName;

    // parse out the db objects returned from the routines call
    return this.state.routines.routines.map((item) => {
      if (item.is_active === 0) {
        containerName = "inactiveRoutineContainer";
      } else {
        containerName = "routineContainer";
      }

      return (
        <View style={styles[containerName]}>
          <MenuProvider>
            <View style={styles.routineTitleAndMenu}>
              <Text style={styles.routineTitle}> {item.routine_name}</Text>
              <Menu style={styles.routineMenuStyling}>
                <MenuTrigger style={styles.ellipsis} text="..." />
                <MenuOptions>
                  <MenuOption
                    onSelect={() =>
                      this.props.navigation.navigate("EditRoutine", {
                        prevScreenTitle: "Routines",
                        routineName: item.routine_name,
                        routineId: item.routine_id,
                        startTime: item.start_time,
                        endTime: item.end_time,
                        requiresApproval: item.requires_approval,
                        monday: item.monday,
                        tuesday: item.tuesday,
                        wednesday: item.wednesday,
                        thursday: item.thursday,
                        friday: item.friday,
                        saturday: item.saturday,
                        sunday: item.sunday,
                        amount_of_activities: item.amount_of_activities,
                        amount_of_rewards: item.amount_of_rewards,
                        allActivities: this.state.allActivities,
                        rewardId: item.reward_id,
                        allRewardsByIdDictionary: this.state
                          .allRewardsByIdDictionary,
                        allActivitiesDictionary: this.state
                          .allActivitiesDictionary,
                      })
                    }
                  >
                    <Text style={{ color: "black" }}>Edit</Text>
                  </MenuOption>
                  <MenuOption
                    onSelect={() =>
                      this.changeActiveStatus(
                        item.routine_id,
                        "is_active",
                        item.is_active
                      )
                    }
                    text={this.setActiveText(item.is_active, item.routine_id)}
                  />
                  <MenuOption
                    onSelect={() => this.duplicateRoutine(item)}
                    text="Duplicate"
                  />
                  <MenuOption
                    onSelect={() => alert("QuickStart")}
                    text="Quick Start"
                  />
                  {/* <MenuOption
                    onSelect={() => alert("Add Tag")}
                    text="Add Tag"
                  /> */}

                  <MenuOption
                    onSelect={() => this.itemDeletionModal(item, "routine")}
                  >
                    <Text style={{ color: "red" }}>Delete</Text>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            </View>

            {/* Deletion modal */}
            <Dialog
              style={styles.deletionModal}
              hasOverlay={true}
              overlayOpacity={0.1}
              visible={this.state.deleteModalVisible}
              onTouchOutside={() => {
                this.cancelDelete();
              }}
            >
              <Text style={styles.dialogTitle}>Delete Routine</Text>
              <Text style={styles.dialogSubtext}>
                Are you sure you would like to delete this {this.state.typeToDelete}?
              </Text>
              <DialogFooter style={styles.deletionFooter}>
                <Button
                  onPress={() => {
                    this.deleteItem();
                  }}
                  title="Yes, Delete it"
                  color="red"
                  accessibilityLabel="Yes Button"
                />
                <Button
                  onPress={() => {
                    this.cancelDelete();
                  }}
                  title="No, Cancel"
                  // color="#841584"
                  accessibilityLabel="Cancel Button"
                />
              </DialogFooter>
            </Dialog>

            <View style={styles.routineDetailsPreview}>
              <Text style={styles.routineDetails}>
                <Icon name="playlist-check" style={styles.routineDetailsIcon} />{" "}
                {/* TODO: move the routines activity amount check somewhere else */}
                {/* {console.log("ITS " + this.confirmAmountOfActivities(item.routine_id, item.amount_of_activities))} */}
                {/* Activities:{" "}{this.confirmAmountOfActivities(item.routine_id, item.amount_of_activities)}{" "} */}
                Activities: {item.amount_of_activities}{" "}
              </Text>
              <Text style={styles.routineDetails}>
                <Icon name="gift" style={styles.routineDetailsIcon} /> Rewards:{" "}
                {item.amount_of_rewards}{" "}
              </Text>
            </View>
          </MenuProvider>
        </View>
      );
    });
  }

  render() {
    if (this.state.routines !== null) {
    } else {
      console.log("this.state.routines is null :( ");
    }

    let ripple = { id: "addButton" };

    return (
      <View>
        {/* Routines and Activities tabs */}
        <SafeAreaView>
          <MaterialTabs
            items={["Routines", "Activities"]}
            selectedIndex={this.state.selectedTab}
            barColor="white"
            // barColor="#D7CBD2"
            indicatorColor="#B1EDE8"
            activeTextColor="black"
            inactiveTextColor="grey"
            onChange={(index) =>
              this.setState({
                selectedTab: index,
              })
            }
          />
        </SafeAreaView>

        <ScrollView>
          {this.state.routinesLoaded && (
            <View>
              {this.tabIsRoutines() && (
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                >
                  {this.displayRoutines()}
                  {this.displayNewRoutineContainer()}
                </View>
              )}
            </View>
          )}

          {this.state.activitiesLoaded && (
            <View>
              <ScrollView>
                {!this.tabIsRoutines() && (
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    {this.displayActivities()}
                    {this.displayNewActivityContainer()}
                    {this.displayLibraryContainer()}
                  </View>
                )}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // RoutinesPage
  topContainer: {
    zIndex: 999,
  },
  dialogTitle: {
    marginTop: 14,
    fontSize: 20,
    textAlign: "center",
    height: 100,
  },
  dialogSubtext: {
    marginTop: -45,
    fontSize: 16,
    textAlignVertical: "auto",
    width: 220,
    marginBottom: 10,
    marginLeft: 18,
    marginRight: 18,
  },
  deletionModal: {
    margin: 12,
    backgroundColor: "#f7f7f7",
    padding: 28,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.65,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deletionFooter: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 14,
    paddingTop: 8,
    marginLeft: 10, 
    marginRight: 10,
  },
  routineTitleAndMenu: {
    flexDirection: "row",
    flex: 1,
    overflow: "visible",
  },
  ellipsis: {
    flexDirection: "row",
    alignSelf: "flex-end",
    fontSize: 30,
    marginRight: 10,
    overflow: "visible",
  },
  routineTitle: {
    marginLeft: 4,
    marginTop: 2,
    fontSize: 14,
    textAlign: "center",
    flex: 1,
  },
  routineMenuStyling: {
    overflow: "visible",
    zIndex: 999,
  },
  routineDetailsIcon: {
    color: "#355C7D",
    fontSize: 14,
  },
  routineDetails: {
    fontSize: 12,
    zIndex: 2,
  },
  routineDetailsPreview: {
    zIndex: 2,
    marginBottom: 10,
    marginLeft: 5,
  },
  routineContainer: {
    width: WIDTH * 0.3,
    height: 150,
    marginTop: 20,
    marginBottom: 5,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "black",
    shadowOpacity: 0.1,
    borderWidth: 0,
    paddingTop: 10,
    overflow: "visible",
    marginLeft: 10,
    marginRight: 10,
  },
  inactiveRoutineContainer: {
    width: WIDTH * 0.3,
    height: 150,
    marginTop: 20,
    marginBottom: 5,
    justifyContent: "space-around",
    borderRadius: 10,
    backgroundColor: "#d3d3d3",
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "black",
    shadowOpacity: 0.1,
    borderWidth: 0,
    paddingTop: 10,
    overflow: "visible",
    marginLeft: 10,
    marginRight: 10,
  },
  roundAddButton: {
    marginLeft: 6,
    fontSize: 30,
    height: 50,
    minWidth: 50,
    width: 50,
    borderRadius: 50,
    color: "#FFFFFF",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
