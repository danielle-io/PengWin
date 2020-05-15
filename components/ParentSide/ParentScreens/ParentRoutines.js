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
  TextInput,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RaisedTextButton } from "react-native-material-buttons";
import { TextField } from "react-native-material-textfield";
import {
  MenuProvider,
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import Tags from "react-native-tags";
import MaterialTabs from "react-native-material-tabs";
import { Dropdown } from "react-native-material-dropdown";
import Dialog, { DialogContent, DialogFooter } from "react-native-popup-dialog";
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
      itemToDelete: null,

      containerNames: null,
      containerDict: null,
      containerRoutineDict: null,
      selectedColor: null,
      newContainerName: null,
      selectedContainer: null,
      selectedDeletion: null,
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
    console.log("in mount");
    this.setState({ containersLoaded: false });

    this.getAllRewardsForUser();
    this.getContainers();

    await this.props.navigation.addListener("didFocus", (payload) => {
      console.log("reloading items");
      this.setState({ routinesLoaded: false });
      this.setState({ activitiesLoaded: false });

      this.getRoutines();
      this.getAllActivitiesForUser();
      if (this.state.activitiesLoaded) {
        this.displayActivities();
      }
      if (this.state.routinesLoaded) {
        this.displayRoutines();
      }
    });
  }

  getRoutines() {
    console.log("get routines");
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

  getContainersPerRoutines() {
    fetch(Environment + "/getContainersPerRoutines/" + userId, {
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((containerRoutineResults) => {
        console.log(containerRoutineResults);
        this.storeContainerRoutineInfo(containerRoutineResults);
        // this.displayRoutines();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getContainers() {
    fetch(Environment + "/getContainers/" + userId, {
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((containerResults) => {
        console.log(containerResults);
        this.storeContainerInfo(containerResults);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  updateRoutineTagRelationship(containerRoutineId, tag, value) {
    var data = {
      [tag]: value,
    };
    {
      let response = fetch(
        Environment + "/updateRoutineTagTable/" + containerRoutineId,
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
          this.getContainers();
          this.displayRoutines();
        });
    }
  }

  updateContainer(containerRoutineId, tag, value) {
    var data = {
      [tag]: value,
    };
    {
      let response = fetch(
        Environment + "/updateContainer/" + containerRoutineId,
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
        .then((results) => {});
    }
  }

  insertToRoutineContainerTable(routineId) {
    var data = {
      container_id: this.state.selectedContainer,
      routine_id: routineId,
      deleted: 0,
      user_id: userId,
    };

    let response = fetch(Environment + "/insertContainerRoutineRelationship/", {
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
        this.getContainers();
        this.getRoutines();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  insertNewContainer() {
    var data = {
      container_name: this.state.newContainerName.toLowerCase(),
      color: this.state.selectedColor,
      deleted: 0,
      user_id: userId,
    };

    let response = fetch(Environment + "/insertNewContainer/", {
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
        this.getContainers();
        this.setState({ routinesLoaded: false });
        this.getRoutines();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //   Dictionary of key as routine id, then valie contains all the details
  storeContainerRoutineInfo(containerRoutineResults) {
    var tempContainerRoutineDict = {};

    for (var i = 0; i < containerRoutineResults.length; i++) {
      var containerId = containerRoutineResults[i].container_id;
      var contRoutineId = containerRoutineResults[i].container_routine_id;

      tempContainerRoutineDict[containerRoutineResults[i].routine_id] = {
        color: this.state.containerDict[containerId].color,
        name: this.state.containerDict[containerId].name,
        containerId: containerId,
        containerRoutineId: contRoutineId,
      };
    }
    console.log("containerRoutineDict");
    console.log(tempContainerRoutineDict);

    this.setState({ containerRoutineDict: tempContainerRoutineDict });
    this.setState({ containersLoaded: true });
  }

  setContainer(routineId) {
    console.log("IN SET CONTAINER " + routineId);

    if (this.state.selectedContainer) {
      this.setState({ containersLoaded: false });
      this.insertToRoutineContainerTable(routineId);
    }
  }

  deleteContainer() {
    if (this.state.containerRoutineDict !== null) {
      if (this.state.selectedDeletion) {
        this.updateContainer(this.state.selectedDeletion, "deleted", 1);

        return Object.keys(this.state.containerRoutineDict).map((item) => {
          console.log(
            "ITEM " + this.state.containerRoutineDict[item].containerId
          );
          console.log(
            "this.state.selectedDeletion " + this.state.selectedDeletion
          );

          if (
            this.state.containerRoutineDict[item].containerId ===
            this.state.selectedDeletion
          ) {
            this.setState({ routinesLoaded: false });
            this.updateRoutineTagRelationship(
              this.state.containerRoutineDict[item].containerRoutineId,
              "deleted",
              1
            );
          }
        });
      }
    }
  }

  storeContainerInfo(containerResults) {
    var tempContainerDict = {};
    var tempContainerNamesArray = [];
    for (var i = 0; i < containerResults.length; i++) {
      tempContainerDict[containerResults[i].container_id] = {
        color: containerResults[i].color,
        name: containerResults[i].container_name,
      };
      tempContainerNamesArray.push({
        label: containerResults[i].container_name,
        value: containerResults[i].container_id,
      });
    }

    console.log("containerNames " + tempContainerNamesArray);
    this.setState({ containerNames: tempContainerNamesArray });
    this.setState({ containerDict: tempContainerDict });
    this.getContainersPerRoutines();
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
        });
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

  updateActivity(tag, value, activityId) {
    var data = {
      [tag]: value,
    };
    let response = fetch(Environment + "/updateActivity/" + activityId, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((results) => {
      console.log("SUCCESS: updated amount of activities");
      this.setState({ activitiesLoaded: false });

      console.log("delete worked");
      this.getAllActivitiesForUser();

      if (this.state.activitiesLoaded) {
        console.log("routines loaded again");
        this.displayActivities();
      }
    });
  }

  createRewardDictionary(rewardsResults) {
    var tempDict = {};
    rewardsResults.map((item) => {
      tempDict[item.reward_id] = item;
    });

    this.setState({ allRewardsByIdDictionary: tempDict });
    console.log("on parent routine, rewards dict is below");
    console.log(this.state.allRewardsByIdDictionary);
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
    console.log("duplicating " + item);

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
    this.updateActivity("deleted", 1, this.state.itemToDelete.activity_id);
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
          onPress={
            (this._onPress,
            () =>
              this.props.navigation.navigate("PublicActivities", {
                prevScreenTitle: "Routines",
              }))
          }
          ripple={ripple}
        />

        <Text style={styles.routineTitle}>Add From Public Activities</Text>
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
                containersLoaded: null,
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

  deleteTag(routineId) {
    console.log(
      "deleting tag from routine id " +
        routineId +
        " and tag id is " +
        this.state.containerRoutineDict[routineId]
    );
    var containerRoutineId = this.state.containerRoutineDict[routineId]
      .containerRoutineId;
    this.updateRoutineTagRelationship(containerRoutineId, "deleted", 1);
  }

  selectedContainer(id) {
    console.log(id);
    this.setState({ selectedContainer: id });
  }

  getRoutineTags(item) {
    if (item.routine_id in this.state.containerRoutineDict) {
      var colorClass =
        this.state.containerRoutineDict[item.routine_id].color + "Tag";

      return (
        <View
          style={{
            textAlign: "right",
            flexDirection: "row",
            alignSelf: "flex-end",
            alignItems: "flex-end",
            right: 0,
            justifyContent: "flex-end",
            // position: "absolute",
          }}
        >
          <Tags
            readonly={true}
            containerStyle={{ justifyContent: "center" }}
            inputStyle={{
              backgroundColor: "none",
              borderWidth: "none",
              borderStyle: "none",
            }}
            initialTags={[
              this.state.containerRoutineDict[item.routine_id].name,
            ]}
            renderTag={({ tag, index }) => (
              <TouchableOpacity
                onPress={() => {
                  this.deleteTag(item.routine_id);
                }}
                style={styles[colorClass]}
              >
                <Text style={styles.text}>{tag} </Text>

                <TouchableOpacity key={`${tag}-${index}`} />
              </TouchableOpacity>
            )}
          />
        </View>
      );
    } else {
      return;
    }
  }

  saveNewContainer() {
    console.log(this.state.newContainerName);
    console.log(this.state.selectedColor);

    if (
      this.state.selectedColor !== null &&
      this.state.newContainerName !== null
    ) {
      this.insertNewContainer();
    }
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
        <View
          onStartShouldSetResponder={() => this.setContainer(item.routine_id)}
          style={styles[containerName]}
        >
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

            <View style={styles.routineDetailsPreview}>
              <View style={{ float: "left" }}>
                <Text style={styles.routineDetails}>
                  <Icon
                    name="playlist-check"
                    style={styles.routineDetailsIcon}></Icon>
    
                  {/* TODO: move the routines activity amount check somewhere else */}
                  {/* {console.log("ITS " + this.confirmAmountOfActivities(item.routine_id, item.amount_of_activities))} */}
                  {/* Activities:{" "}{this.confirmAmountOfActivities(item.routine_id, item.amount_of_activities)}{" "} */}
                  Activities: {item.amount_of_activities}{" "}
                </Text>
                <Text style={styles.routineDetails}>
                  <Icon name="gift" style={styles.routineDetailsIcon} />{" "}
                  Rewards: {item.amount_of_rewards}{" "}
                </Text>
              </View>

              <View>{this.getRoutineTags(item)}</View>
            </View>
          </MenuProvider>
        </View>
      );
    });
  }

  selectedColor(value) {
    this.setState({ selectedColor: value });
  }

  selectDeletion(id) {
    this.setState({ selectedDeletion: id });
  }

  render() {
    
    if (this.state.routines !== null) {
    } else {
      console.log("this.state.routines is null :( ");
    }

    let colors = [
      {
        value: "green",
      },
      {
        value: "blue",
      },
      {
        value: "orange",
      },
      {
        value: "purple",
      },
    ];

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

        <ScrollView keyboardShouldPersistTaps="always">
          {this.tabIsRoutines() &&
            this.state.routinesLoaded &&
            this.state.containersLoaded && (
              <View>
                {/* <Icon name="tag" style={styles.tagMenuIcons}><Text>Apply Tags</Text></Icon> */}
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginLeft: 8,
                    marginRight: 8,
                  }}
                >
                  {this.displayRoutines()}
                  {this.displayNewRoutineContainer()}
                </View>
                {/* Tag options */}
                <View style={styles.textFields}>
                  <Text style={styles.titles}>Apply a Routine Tag</Text>
                  <View style={{ width: "80%" }}>
                    {/* <Text style={styles.description}>
              Select a tag then click a routine to apply it.
            </Text> */}
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    {/* <View style={styles.tagsContainer}> */}
                    <Dropdown
                      containerStyle={{ width: "42%" }}
                      label="Select a tag then click a routine to apply it"
                      data={this.state.containerNames}
                      onChangeText={(id) => this.selectedContainer(id)}
                    />
                    {/* </View> */}
                  </View>

                  <Text style={styles.titles}>Create New Routine Tags</Text>
                  <View style={{ width: "80%" }}>
                    {/* <Text style={styles.description}>
              Enter a container name, select a color, and click the add button
              to create a new container tag.
            </Text> */}
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    <TextInput
                      inputStyle={{ paddingLeft: 4, fontSize: 12 }}
                      style={styles.tagNameContainer}
                      placeholder="Container Name"
                      onChangeText={(text) =>
                        this.setState({ newContainerName: text })
                      }
                    />

                    <Dropdown
                      containerStyle={{ padding: 1, width: "20%" }}
                      label="Select a color"
                      data={colors}
                      onChangeText={(value) => this.selectedColor(value)}
                    />

                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={() => this.saveNewContainer()}
                    >
                      <Text style={{ color: "#fff" }}>Save</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.titles}>Delete Routine Tags</Text>
                  <View style={{ width: "80%" }}>
                    <Text style={styles.description}>
                      To remove a tag from a single routine, just click the tag.
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", marginTop: 0 }}>
                    <Dropdown
                      containerStyle={{ padding: 1, width: "30%" }}
                      label="Select a Container to Delete"
                      data={this.state.containerNames}
                      onChangeText={(id) => this.selectDeletion(id)}
                    />

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => this.deleteContainer()}
                    >
                      <Text style={{ color: "#fff" }}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
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
              Are you sure you would like to delete this{" "}
              {this.state.typeToDelete}?
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
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // RoutinesPage
  tagNameContainer: {
    padding: 0,
    marginTop: 0,
    // margin:0,
    width: "100%",
    borderColor: "grey",
    borderStyle: "solid",
    borderWidth: 1,
  },
  colorSelectionContainer: {
    // padding: 1,
    marginTop: 0,
    width: "100%",
    borderColor: "grey",
    borderStyle: "solid",
    borderWidth: 1,
    // margin: 0,
  },
  tagsContainer: {
    marginTop: 10,
    marginLeft: 8,
    marginRight: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  dropDownItem: {
    padding: 5,
    marginTop: 2,
    backgroundColor: "#ddd",
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 5,
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
    fontSize: 14,
    marginBottom: 6,
    marginTop: 12,
    paddingTop: 4,
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
  tagMenuIcons: {
    color: "#FF6978",
    fontSize: 18,
    paddingTop: 5,
    marginLeft: 30,
    marginTop: 10,
  },
  routineDetails: {
    fontSize: 12,
    zIndex: 2,
  },
  routineDetailsPreview: {
    flexDirection: "row",
    zIndex: 2,
    marginBottom: 10,
    marginLeft: 5,
  },
  tagContainer: {
    flexDirection: "row",
    zIndex: 999,
    justifyContent: "flex-end",
  },
  routineContainer: {
    width: WIDTH * 0.3,
    height: 150,
    marginTop: 20,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "black",
    shadowOpacity: 0.1,
    borderWidth: 0,
    paddingTop: 10,
    overflow: "visible",
  },

  saveButton: {
    marginLeft: 24,
    fontSize: 14,
    // minWidth: 8,
    // minHeight: 20,
    height: 38,
    borderRadius: 8,
    backgroundColor: "#FF6978",
    borderColor: "#fff",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 30,
    paddingLeft: 8,
    paddingRight: 8,
  },
  deleteButton: {
    marginLeft: 14,
    fontSize: 14,
    height: 38,
    borderRadius: 8,
    backgroundColor: "#FF6978",
    borderColor: "#fff",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    // flexDirection: "row",
    marginTop: 30,
    paddingLeft: 8,
    paddingRight: 8,
  },
  tagNameContainer: {
    // padding: 12,
    paddingLeft: 6,
    height: "45%",
    width: "30%",
    fontSize: 12,
    marginTop: 35,
    borderColor: "#d3d3d3",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 20,
  },
  colorSelectionContainer: {
    // width: "100%",
    borderColor: "#d3d3d3",
    borderStyle: "solid",
    borderWidth: 1,
    // paddingLeft: 20,
    // paddingRight: 20,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 30,

    // margin: 0,
  },
  tagsContainer: {
    marginTop: 0,
    // flexWrap: 'wrap',
    flexDirection: "row",
    // width: "100%",
    // marginTop: 10,
    // marginLeft: 8,
    // marginRight: 10,
    // flexDirection: "row",
    // justifyContent: "space-around",
  },
  dropDownItem: {
    padding: 5,
    marginTop: 2,
    backgroundColor: "#ddd",
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 5,
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
    fontSize: 14,
    marginBottom: 6,
    marginTop: 12,
    paddingTop: 4,
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
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 2,
    marginBottom: 10,
    marginLeft: 5,
  },
  greenTag: {
    fontSize: 8,
    height: 25,
    minWidth: 50,
    width: 100,
    borderRadius: 20,
    backgroundColor: "#8dd993",
    borderWidth: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginRight: 6,
    opacity: 0.5,
  },
  blueTag: {
    color: "white",
    fontSize: 8,
    height: 25,
    minWidth: 50,
    width: 100,
    borderRadius: 20,
    backgroundColor: "#B1EDE8",
    // borderWidth: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginRight: 6,
    opacity: 0.5,
  },
  purpleTag: {
    fontSize: 8,
    height: 25,
    minWidth: 50,
    width: 100,
    borderRadius: 20,
    backgroundColor: "#d7b9f0",
    // borderWidth: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginRight: 6,
    opacity: 0.5,
  },
  orangeTag: {
    color: "white",
    fontSize: 8,
    height: 25,
    minWidth: 50,
    width: 100,
    borderRadius: 20,
    backgroundColor: "#fce2b8",
    // borderWidth: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginRight: 6,
    opacity: 0.4,
  },
  tagsbutton: {
    fontSize: 10,
    height: 25,
    minWidth: 50,
    width: 100,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderColor: "#FF6978",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    // margin: 5,
  },
  tagContainer: {
    marginTop: 15,
    flexDirection: "row",
    zIndex: 999,
    justifyContent: "flex-end",
  },
  routineContainer: {
    width: WIDTH * 0.3,
    height: 150,
    marginTop: 20,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "black",
    shadowOpacity: 0.1,
    borderWidth: 0,
    paddingTop: 10,
    overflow: "visible",
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
  titles: {
    // fontWeight: "bold",
    fontSize: 15,
    padding: 5,
    marginTop: 15,
  },
  textFields: {
    padding: 2,
    marginLeft: 15,
  },
  description: {
    fontSize: 12,
    padding: 5,
    marginBottom: 0,
    paddingBottom: 0,
  },
});
