// TODO: fix switch bug
import React, { Component } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  Switch,
  StyleSheet,
  View,
} from "react-native";
import { TextField } from "react-native-material-textfield";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RaisedTextButton } from "react-native-material-buttons";
import DatePicker from "react-native-datepicker";
import Environment from "../../../database/sqlEnv";

import SearchableDropdown from "react-native-searchable-dropdown";

const { width: WIDTH } = Dimensions.get("window");

Icon.loadFont();

export default class EditRoutine extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Edit Routine",
    // headerRight: () => <Button onPress={ () => {
    //    var alr = "";
    //     if(navigation.state.params.routineName === '' || !navigation.state.params.routineName)
    //     {
    //         alr += "Must have a routine name\n"
    //     }
    //     if(navigation.state.params.amount_of_activities < 1 || !navigation.state.params.amount_of_activities)
    //     {
    //         alr += "Must have more than one activity\n";
    //     }
    //     if(navigation.state.params.amount_of_rewards < 1 || !navigation.state.params.amount_of_rewards)
    //     {
    //         alr += "Must have more than one reward\n"
    //     }
    //     if(alr !== '')
    //     {
    //         alert(alr);
    //     }
    //     else{
    //         navigation.navigate('ParentNavigation', {
    //             prevScreenTitle: 'Routines'
    //         });
    //     }
    // }}
    // title="Done"
    // color="#352D39"
    // accessibilityLabel="Done with Routine Button"/>
  });

  constructor(props) {
    super(props);

    const { navigate } = this.props.navigation;
    this.navigate = navigate;

    this.state = {
      prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
      routineName: this.props.navigation.state.params.routineName,
      routineId: this.props.navigation.state.params.routineId,
      routineStartTime: this.props.navigation.state.params.routineStartTime,
      routineEndTime: this.props.navigation.state.params.routineEndTime,
      routineApproval: this.props.navigation.state.params.routineApproval,
      approval: this.props.navigation.state.params.is_approved,
      amount_of_activities: this.props.navigation.state.params
        .amount_of_activities,
      amount_of_rewards: this.props.navigation.state.params.amount_of_rewards,
      monday: this.props.navigation.state.params.monday,
      tuesday: this.props.navigation.state.params.tuesday,
      wednesday: this.props.navigation.state.params.wednesday,
      thursday: this.props.navigation.state.params.thursday,
      friday: this.props.navigation.state.params.friday,
      saturday: this.props.navigation.state.params.saturday,
      sunday: this.props.navigation.state.params.sunday,
      userId: this.props.navigation.state.params.userId,
      allActivities: this.props.navigation.state.params.allActivities,
      rewardId: this.props.navigation.state.params.rewardId,
      allRewards: this.props.navigation.state.params.allRewards,
      allActivityNames: [],
      allRewardNames: [],
      changedValues: [],
      activities: null,
      activitiesLoaded: false,
      // TODO: hardcoded date
      date: "2016-05-15",
      newActivities: [],
      newReward: null,
      currentlySelectedActivity: null,
      currentlySelectedReward: null,
      activityChangeLoad: true,
      rewardLoaded: false,
      activityOrder: [],
      addToActivityRoutineTbl: [],
      addActivityButtonClicked: false,
      addRewardButtonClicked: false,
      // Use this when the order changes
      // once changing order is possible
      changeActivityRelationship: false,
    };
  }

  // Update the routines in the tb by the table
  // name and the value being inserted
  async changeRoutineComponent(tag, value) {
    console.log(tag);
    console.log(value);
    var data = {
      [tag]: value,
    };
    try {
      let response = await fetch(
        Environment + "/updateRoutine/" + this.state.routineId,
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
        console.log("SUCCESSFUL CALL");
        this.addCalendar();
      }
    } catch (errors) {
      alert(errors);
    }
  }

  // Update the activity routine relationship table
  async insertActivityRelationship(activity_id, order) {
    var data = {
      routine_id: this.state.routineId,
      activity_id: activity_id,
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
        console.log("SUCCESSFUL CALL");
        this.addCalendar();
      }
    } catch (errors) {
      alert(errors);
    }
  }

  //
  async updateActivityRelationship(routine_activity_id, activity_id, order) {
    var data = {
      routine_activity_id: routine_activity_id,
      activity_id: activity_id,
      routine_id: this.state.routineId,
      order: order,
    };
    try {
      let response = await fetch(
        Environment + "/updateActivityRelationshipTable/" + routine_activity_id,
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
        console.log("SUCCESSFUL CALL");
        this.addCalendar();
      }
    } catch (errors) {
      alert(errors);
    }
  }

  // Update the DB
  updateRoutineData() {
    // Make sure the activity amount is correct, and if not, update it as well
    if (this.state.activities) {
      if (this.state.activities.length !== this.amount_of_activities) {
        this.pushToUpdateRoutineArray(
          "amount_of_activities",
          this.state.activities.length
        );
      }
    }

    // This means we are inserting a new item in the db, so we will
    // insert differently than we update
    if (this.state.routineId === null) {
      this.createNewRoutine();
    } else {
      for (const keyValuePair of this.state.changedValues) {
        Object.entries(keyValuePair).map(([key, val]) => {
          this.changeRoutineComponent(key, val);
        });
      }
    }
  }

  createNewRoutine() {
    if (this.state.rewards != null) {
      amount_of_rewards = this.state.rewards.length;
    }
    data = {
      routine_name: this.state.routineName,
      user_id: this.state.user_id,
      start_time: this.state.routineStartTime,
      end_time: this.state.routineEndTime,
      routineApproval: this.state.routineApproval,
      approval: this.state.is_approved,
      amount_of_activities: this.state.activities.length,
      amount_of_rewards: this.state.amount_of_rewards,
      monday: this.state.monday,
      tuesday: this.state.tuesday,
      wednesday: this.state.wednesday,
      thursday: this.state.thursday,
      friday: this.state.friday,
      saturday: this.state.saturday,
      sunday: this.state.sunday,
    };
  }

  // Update the array of columns to change and
  // the values to update them with
  pushToUpdateRoutineArray(tag, value) {
    Object.keys(this.state.changedValues).map(function(keyName, keyIndex) {
      if (keyName === tag) {
        return;
      }
    });
    let tempArray = this.state.changedValues;
    tempArray.push({ [tag]: value });
    this.setState({ changedValues: tempArray });
  }

  // Add a dropdown item in a new row for activities
  addActivityRow(rowNum) {
    return (
      <View>
        {this.state.addActivityButtonClicked && (
          <View style={styles.formIndent}>
            <View style={styles.editRoutineButtonAndList}>
              <Text style={styles.redNumbers}>{rowNum}</Text>
              <SearchableDropdown
                onItemSelect={(item) => {
                  const items = this.state.newActivities;
                  items.push(item);
                  this.setState({ newActivities: items });
                  this.setState({ currentlySelectedActivity: item });
                }}
                containerStyle={{ padding: 5 }}
                onRemoveItem={(item, index) => {
                  const items = this.state.newActivities.filter(
                    (sitem) => sitem.id !== item.id
                  );
                  this.setState({ newActivities: items });
                }}
                itemStyle={styles.dropDownItem}
                itemTextStyle={{ color: "#222" }}
                itemsContainerStyle={{ maxHeight: 140 }}
                items={this.state.allActivityNames}
                // defaultIndex={2}
                resetValue={false}
                textInputProps={{
                  placeholder: "Select an activity",
                  underlineColorAndroid: "transparent",
                  style: {
                    padding: 12,
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 5,
                  },
                }}
                value={this.state.currentlySelectedActivity}
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

  addRewardRow(rowNum) {
    return (
      <View>
        {this.state.addRewardButtonClicked && (
          <View style={styles.formIndent}>
            <View style={styles.editRoutineButtonAndList}>
              <Text style={styles.redNumbers}>{rowNum}</Text>
              <SearchableDropdown
                onItemSelect={(item) => {
                  // const items = this.state.currentlySelectedReward;
                  // items.push(item);
                  // this.setState({ newReward : item })
                  this.setState({ newReward: item });
                }}
                containerStyle={{ padding: 5 }}
                onRemoveItem={(item, index) => {
                  const items = this.state.newActivities.filter(
                    (sitem) => sitem.id !== item.id
                  );
                  this.setState({ allRewardNames: items });
                }}
                itemStyle={styles.dropDownItem}
                itemTextStyle={{ color: "#222" }}
                itemsContainerStyle={{ maxHeight: 140 }}
                items={this.state.allRewardNames}
                // defaultIndex={2}
                resetValue={false}
                textInputProps={{
                  placeholder: "Select a reward",
                  underlineColorAndroid: "transparent",
                  style: {
                    padding: 12,
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 5,
                  },
                }}
                value={this.state.newReward}
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

  componentDidMount() {
    // Put all the reward names in an array since those
    // will be displayed in the dropdown
    if (this.state.rewardId !== 0) {
      this.getRewardById();
    } else {
      this.setState({ rewardLoaded: true });
    }

    this.getAllRewardNames();

    // This fetches routine data only if editing an
    // existing routine
    if (this.state.routineId !== null) {
      fetch(
        Environment + "/joinRoutineAndActivityTable/" + this.state.routineId
      )
        .then((response) => response.json())
        .then((responseJson) => {
          return responseJson;
        })
        .then((activities) => {
          this.setState({ activities: activities });
          this.setState({ activitiesLoaded: true });

          // Remove all the activities in this routine
          // from the potential options for the dropdown
          this.removeAlreadyAddedActivitiesFromOptions();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  swapDateValue(value, tag) {
    if (value === 1) {
      this.setState({ [tag]: 0 });
      return 0;
    }
    this.setState({ [tag]: 1 });
    return 1;
  }

  getActivityById(activityId) {
    this.setState({ activityChangeLoad: false });

    fetch(Environment + "/getActivityById/" + activityId)
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((results) => {
        var activityObjtempArray = this.state.activities;
        activityObjtempArray.push(results[0]);
        console.log("ACTIVITY BELOW");
        console.log(results);

        this.setState({ activities: activityObjtempArray });
        this.removeAlreadyAddedActivitiesFromOptions();

        this.setState({ activityChangeLoad: true });

        this.prepareRelationshipTableData(results);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // Fetch a reward from the db based on its ID
  getRewardById() {
    console.log("REWARD BY ID");
    console.log(this.state.rewardId);
    this.setState({ rewardLoaded: false });

    fetch(Environment + "/getRewardById/" + this.state.rewardId)
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((results) => {
        // var rewardItem = results;
        console.log("RESULTS BELOW");
        console.log(results);
        // console.log(rewardItem);
        this.setState({ currentlySelectedReward: results });

        this.setState({ rewardLoaded: true });
        console.log("LOADED REWARD");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // This moves the activities retrieved by ID into an array with the needed
  // information to add them to the table (activity_id and order)
  prepareRelationshipTableData(results) {
    console.log("In prepareRelationshipTableData");

    var newObj = {
      activity_id: results[0].activity_id,
      order: this.state.activities.length - 1,
    };
    var activityObj = this.state.addToActivityRoutineTbl;
    activityObj.push(newObj);

    console.log("NEW ACTIVITIES 4 TABLE BELOW");
    console.log(this.state.addToActivityRoutineTbl);

    console.log(this.state.activityChangeLoad);
    console.log("ACTIVITIES BELOW");
    console.log(this.state.activities);
  }

  getCurrentSwitchState() {
    // console.log(this.state.routineApproval);
    if (this.state.routineApproval === 1) {
      return true;
    }
    return false;
  }

  displayList(listName) {
    var itemNumCounter = 0;
    var mappingVal = null;

    // If no reward, nothing to display
    if (listName === "reward") {
      if (this.state.rewardId === 0) {
        return;
      } else {
        mappingVal = this.state.currentlySelectedReward;
        console.log("MAPPING VAL");
        console.log(mappingVal);
      }
    } else {
      mappingVal = this.state.activities;
    }

    // var status = true;
    var item_name = "";

    //  this is the loop where activities populate and rewards populate
    if (mappingVal !== null) {
      return mappingVal.map((item) => {
        if (listName === "activity") {
          item_name = item.activity_name;
          status = this.state.activityChangeLoad;
        } else {
          console.log("ITEMM");
          console.log(item);
          item_name = item.reward_name;
          // status = this.state.rewardLoaded;
          console.log(item_name);
        }
        itemNumCounter += 1;

        return (
          <View style={styles.formIndent}>
            {/* {status && ( */}
            <View style={styles.editRoutineButtonAndList}>
              <Text style={styles.redNumbers}>{itemNumCounter}</Text>
              <Text style={styles.activityText}>{item_name}</Text>
            </View>
            {/* )} */}
          </View>
        );
      });
    }
  }

  // This removes activities from a list so that they dont show up
  // in the dropdown if they are already in the routine
  removeAlreadyAddedActivitiesFromOptions() {
    let tempArray = [];
    let tempArrayNames = [];

    let currentActivityNames = [];

    this.state.activities.map((item) => {
      currentActivityNames.push(item.activity_name);
    });

    for (const item of this.state.allActivities) {
      if (!currentActivityNames.includes(item.activity_name)) {
        tempArray.push(item);
        tempArrayNames.push({ id: item.activity_id, name: item.activity_name });
      }
    }
    this.setState({ allActivities: tempArray });
    this.setState({ allActivityNames: tempArrayNames });
  }

  getAllRewardNames() {
    console.log("ALL REWARDs");
    console.log(this.state.allRewards);
    var tempArray = [];
    this.state.allRewards.map((item) => {
      console.log("REWARD ID IN GET ALL");
      console.log(item.reward_id);
      tempArray.push({ id: item.reward_id, name: item.reward_name });
    });
    this.setState({ allRewardNames: tempArray });
  }

  clickedAddReward() {
    this.setState({
      addRewardButtonClicked: true,
    });
    this.reRenderList("reward");
  }

  clickedAddActivity() {
    this.setState({
      addActivityButtonClicked: true,
    });
    this.reRenderList("activity");
  }

  // ReRender the components on the click of the new button
  reRenderList(listName) {
    if (listName === "activity") {
      // This is to save the previously added activity if they
      // already added one and now clicked add again
      if (this.state.currentlySelectedActivity != null) {
        this.pushToUpdateRoutineArray(
          "amount_of_activities",
          this.state.amount_of_activities + 1
        );

        this.setState({
          amount_of_activities: this.state.amount_of_activities + 1,
        });

        // Add the activity to activiites array
        this.getActivityById(this.state.currentlySelectedActivity.id);

        // Set currentlySelectedActivity back to null to reset dropdown
        this.setState({ currentlySelectedActivity: null });
      }

      // Display everything once the activity is loaded
      {
        this.state.activityChangeLoad && this.displayList(listName);
        this.addActivityRow(this.state.amount_of_activities);
      }
    }

    // Re-Load Rewards
    else {
    }
  }

  getAddButtonClickAction(listName) {
    // When there are no activites added yet we go to a different function
    // .... i dont remember why ill look into this
    if (this.state.allActivityNames === [] && listName === "activity") {
      this.reRenderList(listName);
    }
    listName === "activity"
      ? this.clickedAddActivity(listName)
      : this.clickedAddReward(listName);
  }

  addNewItemButtonToList(listName) {
    var textfield = "";
    var notEmptyList = true;

    listName === "activity"
      ? (textfield = "Add an activity")
      : (textfield = "Add a reward");

    // Don't include the add button if there's a reward
    // since you can only add one to a routine.
    if (listName === "reward") {
      if (this.state.currentlySelectedReward !== null) {
        if (this.state.rewardId !== 0) {
          return;
        }
      }
    } else if (this.state.allActivityNames === []) {
      {
        /* If there are no un-used activities don't include an add button */
      }
      return (
        <View style={styles.formIndent}>
          <Text style={styles.activityText}>
            You have no un-used activities to add. Activities can be created
            from the activities menu.
          </Text>
        </View>
      );
    }

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

          {/* <View
          style={{
            borderBottomColor: "#C4C4C4",
            borderBottomWidth: 1,
            width: WIDTH * 0.6,
          }}
          >
          </View> */}
          {/* <Text style={styles.addText}>{textfield}</Text> */}
        </View>
      </View>
    );
  }

  naviHelper(lmn) {
    if (!this.state.amount_of_activities) this.state.amount_of_activities = 0;
    if (!this.state.amount_of_rewards) this.state.amount_of_rewards = 0;

    if (lmn === "activity") {
      var ct = this.state.amount_of_activities + 1;
      this.setState({ amount_of_activities: ct });
      this.navigate("Activity", {
        prevScreenTitle: "Edit Routines",
      });
    } else {
      var ct = this.state.amount_of_rewards + 1;
      this.setState({ amount_of_rewards: ct });
      this.navigate("ParentRewards", {
        prevScreenTitle: "Edit Routines",
      });
    }
  }

  displayToggle() {
    return (
      <View>
        <View style={styles.editRoutineIconAndTitle}>
          <Icon style={styles.routineDetailsIcon} name="check-all" />
          <Text style={styles.editRoutineSectionName}>Approve Completion</Text>
        </View>
        <View style={styles.editRoutineIconAndTitle}>
          <Text style={styles.editRoutinesInstructionsText}>
            Would you like to approve routine completion before your child
            receives their final reward?{" "}
          </Text>
          <Switch
            style={{ padding: 10 }}
            trackColor={{ false: "#767577", true: "#FF6978" }}
            value={this.getCurrentSwitchState()}
            onValueChange={() =>
              this.pushToUpdateRoutineArray(
                "is_approved",
                !this.state.routineApproval
              )
            }
          />
        </View>
      </View>
    );
  }

  defineTimeText(text) {
    if (text === "Start") {
      if (this.state.routineStartTime === "00:00") {
        return "Select a Start Time";
      }
      return "Start Time";
    }
    if (text === "End") {
      if (this.state.routineEndTime === "00:00") {
        return "Select an End Time";
      }
      return "End Time";
    }
  }

  defineTime(text) {
    if (text === "Start") {
      if (this.state.routineStartTime === "00:00") {
        return "00:00";
      }
      return this.state.routineStartTime;
    }
    if (text === "End") {
      if (this.state.routineEndTime === "00:00") {
        return "00:00";
      }
      return this.state.routineEndTime;
    }
  }

  timeMarginDefinition(text) {
    if (text === "Start") {
      if (this.state.routineStartTime === "00:00") {
        return 260;
      }
      return 320;
    } else {
      if (this.state.routineEndTime === "00:00") {
        return 260;
      }
      return 330;
    }
  }

  getDateButtonTextColor(value) {
    if (value === 1) {
      return "#FFFFFF";
    } else {
      return "#FF6978";
    }
  }

  getDateButtonColor(value) {
    if (value === 1) {
      return "#FF6978";
    } else {
      return "#FFFFFF";
    }
  }

  addCalendar() {
    // TODO: Loop over these instead
    const dates = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const dateLetters = ["M", "T", "W", "Th", "F", "Sa", "Su"];

    return (
      <View>
        <Text style={{ fontSize: 15, marginTop: 10 }}>Select Days</Text>

        <View style={styles.routinesCalendar}>
          <RaisedTextButton
            style={styles.roundDateButton}
            titleStyle={styles.buttonstyle}
            title="M"
            titleColor={this.getDateButtonTextColor(this.state.monday)}
            onPress={
              (this._onPress,
              () => {
                this.pushToUpdateRoutineArray(
                  "monday",
                  this.swapDateValue(this.state.monday, "monday")
                );
              })
            }
            color={this.getDateButtonColor(this.state.monday)}
          />

          <RaisedTextButton
            style={styles.roundDateButton}
            titleStyle={styles.buttonstyle}
            title="T"
            titleColor={this.getDateButtonTextColor(this.state.tuesday)}
            onPress={
              (this._onPress,
              () => {
                this.pushToUpdateRoutineArray(
                  "tuesday",
                  this.swapDateValue(this.state.tuesday, "tuesday")
                );
              })
            }
            color={this.getDateButtonColor(this.state.tuesday)}
          />

          <RaisedTextButton
            style={styles.roundDateButton}
            titleStyle={styles.buttonstyle}
            title="W"
            titleColor={this.getDateButtonTextColor(this.state.wednesday)}
            onPress={
              (this._onPress,
              () => {
                this.pushToUpdateRoutineArray(
                  "wednesday",
                  this.swapDateValue(this.state.wednesday, "wednesday")
                );
              })
            }
            color={this.getDateButtonColor(this.state.wednesday)}
          />

          <RaisedTextButton
            style={styles.roundDateButton}
            titleStyle={styles.buttonstyle}
            title="Th"
            titleColor={this.getDateButtonTextColor(this.state.thursday)}
            onPress={
              (this._onPress,
              () => {
                this.pushToUpdateRoutineArray(
                  "thursday",
                  this.swapDateValue(this.state.thursday, "thursday")
                );
              })
            }
            color={this.getDateButtonColor(this.state.thursday)}
          />

          <RaisedTextButton
            style={styles.roundDateButton}
            titleStyle={styles.buttonstyle}
            title="F"
            titleColor={this.getDateButtonTextColor(this.state.friday)}
            onPress={
              (this._onPress,
              () => {
                this.pushToUpdateRoutineArray(
                  "friday",
                  this.swapDateValue(this.state.friday, "friday")
                );
              })
            }
            color={this.getDateButtonColor(this.state.friday)}
          />

          <RaisedTextButton
            style={styles.roundDateButton}
            titleStyle={styles.buttonstyle}
            title="Sa"
            titleColor={this.getDateButtonTextColor(this.state.saturday)}
            onPress={
              (this._onPress,
              () => {
                this.pushToUpdateRoutineArray(
                  "saturday",
                  this.swapDateValue(this.state.saturday, "saturday")
                );
              })
            }
            color={this.getDateButtonColor(this.state.saturday)}
          />

          <RaisedTextButton
            style={styles.roundDateButton}
            titleStyle={styles.buttonstyle}
            title="Su"
            titleColor={this.getDateButtonTextColor(this.state.sunday)}
            onPress={
              (this._onPress,
              () => {
                this.pushToUpdateRoutineArray(
                  "sunday",
                  this.swapDateValue(this.state.sunday, "sunday")
                );
              })
            }
            color={this.getDateButtonColor(this.state.sunday)}
          />
        </View>
      </View>
    );
  }

  checkThatListItemsExist(listName) {
    // TODO: write this for activities too

    // They can't add or list rewards if they haven't made any yet
    if (listName === "reward") {
      if (this.state.allRewards !== null) {
        console.log("going to display list");
        // {this.displayList(listName)}
        // {this.addRewardRow(1)}
        // {this.addNewItemButtonToList(listName)}
      } else {
        return (
          <View style={styles.formIndent}>
            <View style={styles.editRoutineButtonAndList}>
              <Text style={styles.activityText}>
                You must add rewards in the rewards tab before you can add them
                to a routine.
              </Text>
            </View>
          </View>
        );
      }
    }
  }

  // Should run on hitting the back button
  componentWillUnmount() {
    this.updateDatabaseChanges();
  }

  updateDatabaseChanges() {
    // Update the database with any changes
    this.updateRoutineData();
  }

  saveAnyChanges() {
    this.setState({ addActivityButtonClicked: false });
    this.setState({ addRewardButtonClicked: false });

    // This means an item was selected but the add button wasnt pressed
    if (this.state.currentlySelectedActivity != null) {
      this.getActivityById(this.state.currentlySelectedActivity.id);
    }

    // This changes the relationship table for activities and routines
    if (this.changeActivityRelationship) {
      // TODO: change existing relationship IDs if order changes
      // this.changeActivityRelationship(activity_id, order)

      // Only deals with new ones (cant change the order of existing relationshiptableIDs)
      for (var i = 0; i < this.state.addToActivityRoutineTbl.length; i++) {
        var currentActivity = this.state.addToActivityRoutineTbl[i];
        var activity_id = currentActivity.activity_id;
        var order = currentActivity.order;

        this.insertActivityRelationship(activity_id, order);
      }
    }

    if (this.state.newReward !== null) {
      this.setState({ rewardLoaded: false });

      console.log("new reward id ");
      console.log(this.state.newReward.id);
      this.setState({ rewardId: this.state.newReward.id });

      this.getRewardById(this.state.newReward.id);

      // console.log("CURR ID IS ");
      // console.log(this.state.currentlySelectedReward.id);
      this.pushToUpdateRoutineArray("reward_id", this.state.newReward.id);
      // this.getRewardById(this.state.currentlySelectedReward.id);

      this.pushToUpdateRoutineArray(
        "amount_of_rewards",
        this.state.amount_of_rewards + 1
      );

      // { this.state.rewardLoaded &&
      //   console.log("going to display reward");
      //   this.displayList("reward");
      // }
    }

    this.updateDatabaseChanges();
  }

  fieldRef = React.createRef();

  onSubmit = () => {
    let { current: field } = this.fieldRef;
    console.log(field.value());
  };

  formatText = (text) => {
    return text.replace(/[^+\d]/g, "");
  };

  _onSubmit = () => {
    this.saveAnyChanges();
    var alr = "";

    // if (this.state.routineName === "" || !this.state.routineName) {
    //   alr += "Must have a routine name\n";
    // }
    // if (
    //   this.state.amount_of_activities < 1 ||
    //   !this.state.amount_of_activities
    // ) {
    //   alr += "Must have more than one activity\n";
    // }
    // if (this.state.amount_of_rewards < 1 || !this.state.amount_of_rewards) {
    //   alr += "Must have more than one reward\n";
    // }
    // if (alr !== "") {
    //   alert(alr);
    // } else {
    //   // Update database
    //   this.updateRoutineData();

    //   this.navigate("ParentNavigation", {
    //     prevScreenTitle: "Routines",
    //   });
    // }
  };

  render() {
    if (this.state.activities !== null && this.state.rewardLoaded) {
    } else {
      return null;
    }
    return (
      <View style={styles.textFields}>
        <ScrollView keyboardShouldPersistTaps="always">
          <View style={styles.editRoutineFormContainer}>
            {this.state.activitiesLoaded && this.state.rewardLoaded && (
              <View>
                {/** ROUTINE NAME **/}
                {/* TODO: fix floating label */}
                <TextField
                  id="routineNameField"
                  placeholder="Routine Name"
                  value={this.state.routineName}
                  style={(styles.textfieldWithFloatingLabel, styles.textFields)}
                  textInputStyle={{ flex: 1 }}
                  onEndEditing={(e) => {
                    this.pushToUpdateRoutineArray(
                      "routine_name",
                      this.state.routineName
                    );
                  }}
                  onChangeText={(text) => this.setState({ routineName: text })}
                />

                <View style={styles.editRoutineIconAndTitle}>
                  <Icon
                    style={styles.routineDetailsIcon}
                    name="playlist-check"
                  />
                  <Text style={styles.editRoutineSectionName}>Activities</Text>
                </View>

                <Text style={styles.editRoutinesInstructionsText}>
                  Add activities that you want your child to complete for this
                  routine.
                </Text>

                {/* Call the displayActivities function to loop over the returned activities */}
                {/* {this.checkThatListItemsExist("activity")} */}

                {this.displayList("activity")}
                {this.addActivityRow(this.state.amount_of_activities + 1)}
                {this.addNewItemButtonToList("activity")}
              </View>
            )}

            <View>
              <View style={styles.editRoutineIconAndTitle}>
                <Icon style={styles.routineDetailsIcon} name="gift" />
                <Text style={styles.editRoutineSectionName}>Rewards</Text>
              </View>

              <Text style={styles.editRoutinesInstructionsText}>
                Add a reward that your child receives when they complete their
                routine.
              </Text>
              {/* {this.checkThatListItemsExist("reward")} */}
              {this.displayList("reward")}
              {this.addRewardRow(1)}
              {this.addNewItemButtonToList("reward")}
            </View>

            {/** DEADLINES **/}
            <View>
              <View style={styles.editRoutineIconAndTitle}>
                <Icon style={styles.routineDetailsIcon} name="clock-outline" />
                <Text style={styles.editRoutineSectionName}>Set Deadlines</Text>
              </View>

              <Text style={styles.editRoutinesInstructionsText}>
                {/* TODO: only say routine in the text string if the word isnt in the routine title */}
                Add deadlines for the given routine by selecting what days the
                routine must be completed and the frequency of the routine.
              </Text>
              {this.addCalendar()}
            </View>

            <View style={styles.timePicker}>
              <Text style={{ fontSize: 18 }}>
                {this.defineTimeText("Start")}
              </Text>
              <DatePicker
                style={{ marginLeft: this.timeMarginDefinition("Start") }}
                date={this.defineTime("Start")}
                mode="time"
                showIcon={false}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={(date) => {
                  {
                    this.pushToUpdateRoutineArray("start_time", date);
                  }
                  this.setState({ routineStartTime: date });
                }}
                customStyles={{
                  dateInput: {
                    borderWidth: 0,
                    fontWeight: 200,
                  },
                }}
              />
            </View>

            <View style={styles.timePicker}>
              <Text style={{ fontSize: 18 }}>{this.defineTimeText("End")}</Text>
              <DatePicker
                style={{
                  marginLeft: this.timeMarginDefinition("End"),
                }}
                date={this.defineTime("End")}
                mode="time"
                showIcon={false}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={(date) => {
                  {
                    this.pushToUpdateRoutineArray("end_time", date);
                  }

                  this.setState({ routineEndTime: date });
                }}
                customStyles={{
                  dateInput: {
                    borderWidth: 0,
                    fontWeight: 200,
                    fontSize: 20,
                  },
                }}
              />
            </View>

            {this.displayToggle()}
          </View>

          <View
            style={{
              alignItems: "center",
            }}
          >
            <RaisedTextButton
              onPress={() => this._onSubmit()}
              style={{ width: 100 }}
              titleStyle={styles.buttonstyle}
              title="Submit"
              titleColor={"white"}
              color={"#FF6978"}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // ROUTINES DROP DOWN
  dropDownItem: {
    padding: 10,
    marginTop: 2,
    backgroundColor: "#ddd",
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 5,
  },
  // EDIT ROUTINES
  buttonstyle: {
    fontSize: 10,
    padding: 0,
    margin: 0,
    fontWeight: "bold",
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
  activityText: {
    fontSize: 20,
    marginTop: 0,
    marginLeft: 10,
    marginBottom: 10,
  },
  addText: {
    // color: '#191a19',
    fontSize: 20,
    marginTop: 5,
    marginLeft: 2,
    marginBottom: 10,
  },
  editRoutineFormContainer: {
    marginLeft: 50,
    marginRight: 50,
    marginBottom: 50,
  },
  editRoutineSectionName: {
    fontSize: 20,
    marginLeft: 15,
    marginTop: 5,
  },
  editRoutineIconAndTitle: {
    flexDirection: "row",
    marginTop: 20,
  },
  routineDetailsIcon: {
    color: "#355C7D",
    fontSize: 30,
    color: "#FF6978",
  },
  textFields: {
    padding: 5,
    margin: 2,
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 20,
  },
  roundDateButton: {
    paddingLeft: 2,
    paddingRight: 2,
    marginLeft: 4,
    marginRight: 4,
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
  routinesCalendar: {
    flexDirection: "row",
    marginLeft: 110,
  },
  timePicker: {
    fontSize: 30,
    marginRight: 200,
    flexDirection: "row",
    marginTop: 20,
    borderBottomColor: "#C4C4C4",
    borderBottomWidth: 1,
    marginBottom: 30,
  },
  editRoutineButtonAndList: {
    flexDirection: "row",
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

  editRoutinesInstructionsText: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
    width: 600,
  },
  formIndent: {
    marginLeft: 30,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 200,
  },
  imageButton: {
    marginTop: 50,
    marginLeft: 100,
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
  routineDetails: {
    fontSize: 10,
    paddingTop: 15,
    paddingLeft: 15,
  },
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

  // Picker
  pickerItem: {
    color: "#FF6978",
  },
  onePicker: {
    width: 150,
    height: 44,
    borderColor: "grey",
    borderWidth: 1,
  },
  onePickerItem: {
    height: 44,
    color: "red",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
});
