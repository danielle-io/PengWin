import React, { Component } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { TextField } from "react-native-material-textfield";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RaisedTextButton } from "react-native-material-buttons";
import { AppLoading } from "expo";
import DatePicker from "react-native-datepicker";

import SearchableDropdown from "react-native-searchable-dropdown";

import Environment from "../../../database/sqlEnv";
import UserInfo from "../../../state/UserInfo";

const { width: WIDTH } = Dimensions.get("window");
const changedDates = {};

Icon.loadFont();

export default class EditRoutine extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Edit Routine",
  });

  constructor(props) {
    super(props);

    const { navigate } = this.props.navigation;
    this.navigate = navigate;

    this.state = {
      prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
      routineName: this.props.navigation.state.params.routineName,
      routineId: this.props.navigation.state.params.routineId,
      startTime: this.props.navigation.state.params.startTime,
      endTime: this.props.navigation.state.params.endTime,
      requiresApproval: this.props.navigation.state.params.requiresApproval,
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
      rewardId: this.props.navigation.state.params.rewardId,
      allRewardsByIdDictionary: this.props.navigation.state.params
        .allRewardsByIdDictionary,
      allActivitiesDictionary: this.props.navigation.state.params
        .allActivitiesDictionary,
      filteredActivities: null,
      allRewardNames: [],
      changedValues: [],
      routineActivitiesByOrder: null,
      routineActivitiesById: null,
      activitiesLoaded: false,
      date: "2016-05-15",
      newReward: null,
      currentlySelectedActivity: null,
      currentlySelectedReward: null,
      activityChangeLoad: true,
      rewardLoaded: false,
      addActivityButtonClicked: false,
      addRewardButtonClicked: false,
      loadedAfterDeletion: true,
      saveClicked: false,
    };
  }

  // Update the routines in the tb by the table
  // name and the value being inserted
  async changeRoutineComponent(tag, value) {
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
        if (tag === "reward_id") {
          this.setState({ rewardLoaded: true });
          this.displayList("reward");
          this.addRow(1, "reward");
        }
      }
    } catch (errors) {
      console.log(errors);
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
        this.getActivityRoutineJoinTable();
        this.setState({
          amount_of_activities: this.state.amount_of_activities + 1,
        });
        this.setState({ currentlySelectedActivity: null });
      }
    } catch (errors) {
      console.log(errors);
    }
  }

  // Update the activity routine db table w/ changes
  async updateActivityRelationship(routine_activity_id, tag, value) {
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
      if (response.status >= 200 && response.status < 300) {

        if (tag === "deleted") {
          // Re-fetch the activities, set up by order & id, then
          // remove used ones from all activities (all in one call)
          this.getActivityRoutineJoinTable();
        }
      }
    } catch (errors) {
      console.log(errors);
    }
  }

  updateRoutineActivityAmount() {
    if (
      this.state.routineActivitiesByOrder.length !==
      this.state.amount_of_activities
    ) {
      this.pushToUpdateRoutineArray(
        "amount_of_activities",
        Object.keys(this.state.routineActivitiesByOrder).length
      );
    }
  }

  // Update the DB
  updateRoutineData() {
    // Make sure the activity amount is correct, and if not, update it as well
    console.log("changes of routine state" + this.state.changedValues);
    if (this.state.routineActivitiesByOrder) {
      this.updateRoutineActivityAmount();
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
    this.props.navigation.navigate("ParentRoutines");
  }

  createNewRoutine() {
    if (this.state.routineName) {
      const parentId = UserInfo.parent_id;
      const childId = UserInfo.child_id;
      const userId = UserInfo.user_id;
      data = {
        routine_name: this.state.routineName,
        start_time: this.state.startTime,
        end_time: this.state.endTime,
        requires_approval: this.state.requires_approval,
        user_id: userId,
        amount_of_activities: Object.keys(this.state.routineActivitiesByOrder)
          .length,
        amount_of_rewards: this.state.amount_of_rewards,
        is_active: 1,
        skip_once: 0,
        monday: this.state.monday,
        tuesday: this.state.tuesday,
        wednesday: this.state.wednesday,
        thursday: this.state.thursday,
        friday: this.state.friday,
        saturday: this.state.saturday,
        sunday: this.state.sunday,
        reward_id: this.state.reward_id,
        parent_id: parentId,
        child_id: childId,
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
          console.log("worked!!!");

          // Set the new routineId
          this.setState({ routineId: results.insertId });
          this.saveAnyChanges();
        })
        .catch((error) => {
          console.error(error);
        });
    }
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

  trackDateChanges(date, state) {
    changedDates[date] = state;
    this.setState({ [date]: state });
    this.addCalendar();
  }

  updateDateChanges() {
    Object.entries(changedDates).map(([key, val]) => {
      this.changeRoutineComponent(key, val);
    });
  }

  // Add a dropdown item in a new row for activities
  addRow(rowNum, listName) {
    var dropdownItems = null;
    var placeholderText = "";
    var clicked = true;

    if (listName === "activity") {
      clicked = this.state.addActivityButtonClicked;
      placeholderText = "Select an activity";
      dropdownItems = this.state.filteredActivities;
    } else {
      clicked = this.state.addRewardButtonClicked;
      placeholderText = "Select a reward";
      dropdownItems = this.state.allRewardNames;
    }
    return (
      <View>
        {clicked && (
          <View style={styles.formIndent}>
            <View style={styles.editRoutineButtonAndList}>
              <Text style={styles.redNumbers}>{rowNum}</Text>

              <SearchableDropdown
                onItemSelect={(item) => {
                  if (listName === "activity") {
                    this.setState({ currentlySelectedActivity: item });
                  } else {
                    this.setState({ newReward: item });
                  }
                }}
                containerStyle={{ padding: 5 }}
                itemStyle={styles.dropDownItem}
                itemTextStyle={{ color: "#222" }}
                itemsContainerStyle={{ maxHeight: 140 }}
                items={dropdownItems}
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

  // Verify the number of rewards in a routine
  compareRewardAmount() {
    var rewardCount = 0;
    for (
      var i = 0;
      i < Object.keys(this.state.routineActivitiesByOrder).length;
      i++
    ) {
      if (
        this.state.routineActivitiesByOrder[i].reward_image ||
        this.state.routineActivitiesByOrder[i].reward_video ||
        this.state.routineActivitiesByOrder[i].reward_description
      ) {
        rewardCount += 1;
      }
    }
    if (this.state.rewardId) {
      rewardCount += 1;
    }
    if (rewardCount !== this.state.amount_of_rewards) {
      this.changeRoutineComponent("amount_of_rewards", rewardCount);
    }
  }

  getRoutineReward() {
    if (this.state.rewardId !== 0 && this.state.allRewardsByIdDictionary) {
      this.setState({
        currentlySelectedReward: this.state.allRewardsByIdDictionary[
          this.state.rewardId
        ],
      });
    }
    console.log("currentlySelectedReward below");
    console.log(this.state.currentlySelectedReward);

    this.setState({ rewardLoaded: true });
  }

  removeItem(routineActivityId, order, itemId, listName) {
    this.setState({ loadedAfterDeletion: false });
    if (listName === "activity") {
      this.setState({
        amount_of_activities: this.state.amount_of_activities - 1,
      });
      this.updateActivityOrders(order, listName, routineActivityId);
    }

    else {
      this.setState({
        amount_of_rewards: 0,
      });
      this.setState({ rewardId: 0 });
      this.setState({ currentlySelectedReward: null });
      this.changeRoutineComponent("reward_id", 0);
    }
  }

  updateActivityOrders(order, listName, routineActivityId) {
    if (
      this.state.routineActivitiesByOrder !== null &&
      this.state.routineActivitiesByOrder !== []
    ) {
      console.log("this.state.routineActivitiesByOrder");
      console.log(this.state.routineActivitiesByOrder);

      var arrLength = Object.keys(this.state.routineActivitiesByOrder).length;
      for (var i = order; i < arrLength; i++) {
        var currentActivity = this.state.routineActivitiesByOrder[i];

        this.updateActivityRelationship(
          currentActivity.routine_activity_id,
          "order",
          i - 1
        );
      }
    }
    this.updateActivityRelationship(routineActivityId, "deleted", 1);
  }

  async componentDidMount() {
    await this.props.navigation.addListener("didFocus", (payload) => {
      // If there is a reward for the routine, store it
      if (this.routineId !== null) {
        this.getRoutineReward();
        this.getActivityRoutineJoinTable();
      } else {
        this.setState({ activitiesLoaded: true });
        this.setState({ rewardLoaded: true });
      }

      // Put all the reward names in an array since those
      // will be displayed in the dropdown
      if (this.state.allRewardsByIdDictionary) {
        this.getAllRewardNames();
      }
    });
  }

  getActivityRoutineJoinTable() {
    fetch(
      Environment +
        "/joinRoutineActivityTableByRoutineId/" +
        this.state.routineId
    )
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((activities) => {
        this.setUpActivitiesDictionaryByOrderAndId(activities);

        // Remove all the activities in this routine
        // from the potential options for the dropdown
        this.removeAlreadyAddedActivitiesFromOptions();
        this.setState({ activityChangeLoad: true });
        console.log("loadedAfterDeletion is " + this.state.loadedAfterDeletion);

        if (!this.state.loadedAfterDeletion) {
          this.displayList("activities");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // Make a dictionary of activities by their order
  // to easily change & display in order, & by ID
  // to easily figure out what to omit from the drop down
  setUpActivitiesDictionaryByOrderAndId(activitiesFromDb) {
    console.log("set up activities by order and id");
    console.log(activitiesFromDb);
    var tempOrderDict = {};
    var tempIdDict = {};
    var counter = 0;

    activitiesFromDb.map((item) => {
      // Make sure the order numbers are in order and correct
      if (item.order !== counter) {
        tempOrderDict[counter] = item;
        this.updateActivityRelationship(
          item.routine_activity_id,
          "order",
          counter
        );
      } else {
        tempOrderDict[item.order] = item;
      }
      tempIdDict[item.activity_id] = item;
      counter += 1;
    });
    this.setState({ routineActivitiesByOrder: tempOrderDict });
    this.setState({ routineActivitiesById: tempIdDict });
    this.setState({ activitiesLoaded: true });
  }

  swapDateValue(tag, value) {
    if (value === 1) {
      this.setState({ [tag]: 0 });
      return 0;
    }
    this.setState({ [tag]: 1 });
    return 1;
  }

  displayList(listName) {
    var itemNumCounter = 0;
    var mappingVal = [];

    // If no reward, nothing to display
    if (listName === "reward") {
      if (this.state.rewardId === 0) {
        return;
      } else {
        mappingVal = [];
        mappingVal.push(this.state.currentlySelectedReward);
      }
    } else if (this.state.routineActivitiesByOrder !== null) {
      // Put ordered activities an array to loop over them
      for (
        var i = 0;
        i < Object.keys(this.state.routineActivitiesByOrder).length;
        i++
      ) {
        mappingVal.push(this.state.routineActivitiesByOrder[i]);
      }
    } else {
      return;
    }

    var item_name = "";

    //  this is the loop where activities populate and rewards populate
    if (mappingVal !== null) {
      return mappingVal.map((item) => {
        if (listName === "activity") {
          item_name = item.activity_name;
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

  // This removes activities from a list so that they dont show up
  // in the dropdown if they are already in the routine
  removeAlreadyAddedActivitiesFromOptions() {
    let tempArray = [];

    for (var key in this.state.allActivitiesDictionary) {
      if (!(key in this.state.routineActivitiesById)) {
        tempArray.push({
          id: key,
          name: this.state.allActivitiesDictionary[key].activity_name,
        });
      }
    }
    this.setState({ filteredActivities: tempArray });
  }

  getAllRewardNames() {
    var tempArray = [];

    for (var key in this.state.allRewardsByIdDictionary) {
      var rewardName = this.state.allRewardsByIdDictionary[key].reward_name;
      tempArray.push({ id: key, name: rewardName });
    }
    this.setState({ allRewardNames: tempArray });
  }

  clickedAddReward() {
    this.setState({
      addRewardButtonClicked: true,
    });
    this.addRow(1, "reward");
  }

  clickedAddActivity() {
    this.setState({
      addActivityButtonClicked: true,
    });
    this.reRenderList("activity");
  }

  getCurrentSwitchState() {
    console.log("THIS REQUIRES APPROVAL" + this.state.requiresApproval)
    if (this.state.requiresApproval === 1) {
      return true;
    }
    return false;
  }

  handleApprovalSwitchChange() {
    var newSwitchValue = 1;

    if (this.state.requiresApproval === 0) {
      this.setState({ requiresApproval: 1 });
    } 
    else {
      this.setState({ requiresApproval: 0 });
      newSwitchValue = 0;
    }

    this.pushToUpdateRoutineArray("requires_approval", newSwitchValue);
  }

  // ReRender the components on the click of the new button
  reRenderList(listName) {
    this.setState({ activityChangeLoad: false });

    if (listName === "activity") {
      // This is to save the previously added activity if they
      // already added one and now clicked add again
      if (this.state.currentlySelectedActivity != null) {
        this.addNewActivityToState();
      }

      // Display everything once the activity is loaded
      {
        this.state.activityChangeLoad && this.displayList(listName);
        this.addRow(
          Object.keys(this.state.routineActivitiesByOrder).length + 1,
          "activity"
        );
      }
    }

    // Re-Load Rewards
    if (listName === "reward") {
      this.changeRoutineComponent("reward_id", this.state.newReward.id);

      this.setState({
        currentlySelectedReward: this.state.allRewardsByIdDictionary[
          this.state.newReward.id
        ],
      });
    }
  }

  addNewActivityToState() {
    var order = Object.keys(this.state.routineActivitiesByOrder).length;

    var activity = this.state.allActivitiesDictionary[
      this.state.currentlySelectedActivity.id
    ];

    this.insertActivityRelationship(activity.activity_id, order);
  }

  getAddButtonClickAction(listName) {
    if (this.state.filteredActivities === [] && listName === "activity") {
      this.reRenderList(listName);
    }
    listName === "activity"
      ? this.clickedAddActivity(listName)
      : this.clickedAddReward(listName);
  }

  addNewItemButtonToList(listName) {
    var textfield = "";
    listName === "activity"
      ? (textfield = "Add an activity")
      : (textfield = "Add a reward");

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
    else if (this.state.filteredActivities === []) {
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
            receives their final reward?
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Switch
            style={{ padding: 10 }}
            trackColor={{ false: "#767577", true: "#FF6978" }}
            value={this.getCurrentSwitchState()}
            onValueChange={() => this.handleApprovalSwitchChange()}
          />
        </View>
      </View>
    );
  }

  defineTimeText(text) {
    if (text === "Start") {
      if (this.state.startTime === "00:00") {
        return "Select a Start Time";
      }
      return "Start Time";
    }
    if (text === "End") {
      if (this.state.endTime === "00:00") {
        return "Select an End Time";
      }
      return "End Time";
    }
  }

  AddMinutesToDate() {
    let date = new Date();
    return new Date(date.getTime() + 2 * 60000);
  }

  defineTime(text) {
    let date = new Date();
    date.setHours(0, 0);

    if (text === "Start") {
      if (this.state.startTime === "00:00") {
        return date;
      }

      let start = this.state.startTime.split(":");
      date.setHours(start[0], start[1]);
      return date;
    }

    if (text === "End") {
      if (this.state.endTime === "00:00") {
        return date;
      }
      let end = this.state.endTime.split(":");
      date.setHours(end[0], end[1]);
      return date;
    }
  }

  timeMarginDefinition(text) {
    if (text === "Start") {
      if (this.state.startTime === "00:00") {
        return 260;
      }
      return 320;
    } else {
      if (this.state.endTime === "00:00") {
        return 260;
      }
      return 330;
    }
  }

  getDateButtonTextColor(value) {
    if (value === 1 || value === true) {
      return "white";
    } else {
      return "#FF6978";
    }
  }

  getDateButtonColor(value) {
    if (value === 0) {
      return "#FFFFFF";
    } else {
      return "#FF6978";
    }
  }

  addCalendar() {
    const dates = [
      { date: "monday", initial: "M", status: this.state.monday },
      { date: "tuesday", initial: "T", status: this.state.tuesday },
      { date: "wednesday", initial: "W", status: this.state.wednesday },
      { date: "thursday", initial: "Th", status: this.state.thursday },
      { date: "friday", initial: "F", status: this.state.friday },
      { date: "saturday", initial: "Sa", status: this.state.saturday },
      { date: "sunday", initial: "Su", status: this.state.sunday },
    ];
    return dates.map((item) => {
      return (
        <View>
          <RaisedTextButton
            style={styles.roundDateButton}
            titleStyle={styles.buttonstyle}
            title={item.initial}
            titleColor={this.getDateButtonTextColor(item.status)}
            onPress={
              (this._onPress,
              () => {
                this.trackDateChanges(item.date, !item.status);
              })
            }
            color={this.getDateButtonColor(item.status)}
          />
        </View>
      );
    });
  }

  // They can't add or list rewards if they haven't made any yet
  checkThatListItemsExist(listName) {
    if (listName === "reward") {
      if (this.state.allRewardsByIdDictionary === null) {
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
    } else {
      if (this.state.allActivitiesDictionary === null) {
        return (
          <View style={styles.formIndent}>
            <View style={styles.editRoutineButtonAndList}>
              <Text style={styles.activityText}>
                You must add activities in the activities tab before you can add
                them to a routine.
              </Text>
            </View>
          </View>
        );
      }
    }
  }

  // Should run on hitting the back button
  componentWillUnmount() {
    this.updateRoutineData();
    this.updateDateChanges();
  }

  saveAnyChanges() {
    if (!this.saveClicked) {
      this.setState({ addActivityButtonClicked: false });
      this.setState({ addRewardButtonClicked: false });
    }

    this.updateDateChanges();

    // This means an item was selected but the add button wasnt pressed
    if (this.state.currentlySelectedActivity != null) {
      this.addNewActivityToState();
    }

    if (this.state.newReward !== null) {
      if (!this.saveClicked) {
        this.setState({ rewardLoaded: false });
        this.setState({ rewardId: this.state.newReward.id });

        this.setState({
          currentlySelectedReward: this.state.allRewardsByIdDictionary[
            this.state.newReward.id
          ],
        });
      }
      this.pushToUpdateRoutineArray("reward_id", this.state.newReward.id);

      this.pushToUpdateRoutineArray(
        "amount_of_rewards",
        this.state.amount_of_rewards + 1
      );
    }
    this.compareRewardAmount();
    this.updateRoutineData();
  }

  fieldRef = React.createRef();
  onSubmit = () => {
    let { current: field } = this.fieldRef;
  };

  formatText = (text) => {
    return text.replace(/[^+\d]/g, "");
  };

  _onSubmit = () => {
    this.setState({ saveClicked: true });
    if (this.state.routineId !== null) {
      this.saveAnyChanges();
      var alr = "";
    } else {
      console.log("new routine");
      this.createNewRoutine();
    }

      this.navigate("ParentNavigation", {
        prevScreenTitle: "Routines",
      });
  };

  render() {
    if (this.state.activitiesLoaded && this.state.rewardLoaded) {
    } else {
      console.log("RETURNING NULL");
      return null;
    }
    let ripple = { id: "addButton" };

    return (
      <View style={styles.textFields}>
        <ScrollView keyboardShouldPersistTaps="always">
          <View style={styles.editRoutineFormContainer}>
            {this.state.activitiesLoaded && this.state.rewardLoaded && (
              <View>
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

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <Icon
                      style={styles.routineDetailsIcon}
                      name="playlist-check"
                    />
                    <Text style={styles.editRoutineSectionName}>
                      Activities
                    </Text>
                  </View>

                  <View
                    stlye={{
                      textAlign: "right",
                      alignItems: "flex-end",
                      justifyContent: "flex-end",
                      marginTop: 20,
                    }}
                  >
                    <TouchableOpacity
                    onPress={
                      (this._onPress,
                      () =>
                        this.props.navigation.navigate("EditActivity", {
                          activityName: null,
                          activityId: null,
                          activityImagePath: null,
                          activityDescription: null,
                          activityAudioPath: null,
                          activityVideoPath: null,
                          activityTags: [],
                          isPublic: 0,
                          deletingRoutine: null,
                          containersLoaded: null,
                          rewardImage: null,
                          rewardVideo: null,
                          rewardDescription: null,
                          previousPage: "Edit Routine",
                          allActivitiesDictionary: this.state.allActivitiesDictionary,
                        }))
                    }
                    ripple={ripple}
                      style={{ flexDirection: "row" }}
                    >
                      <Icon name="plus" style={styles.tagMenuIcons} />
                      <Text style={styles.tagMenuIconText}>
                        Create New Activity
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.editRoutinesInstructionsText}>
                  Add existing activities that you want your child to complete
                  for this routine.
                </Text>

                {/* Call the displayActivities function to loop over the returned activities */}
                {this.displayList("activity")}
                {this.addRow(
                  Object.keys(this.state.routineActivitiesByOrder).length + 1,
                  "activity"
                )}
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
              {this.displayList("reward")}
              {this.addRow(1, "reward")}
              {this.addNewItemButtonToList("reward")}
            </View>

            <View>
              <View style={styles.editRoutineIconAndTitle}>
                <Icon style={styles.routineDetailsIcon} name="clock-outline" />
                <Text style={styles.editRoutineSectionName}>Set Deadlines</Text>
              </View>

              <Text style={styles.editRoutinesInstructionsText}>
                Add deadlines for the given routine by selecting what days the
                routine must be completed and the frequency of the routine.
              </Text>
              <Text style={{ fontSize: 15, marginTop: 10 }}>Select Days</Text>
              <View style={styles.routinesCalendar}>{this.addCalendar()}</View>
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
                  this.setState({ startTime: date });
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

                  this.setState({ endTime: date });
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
              style={{ width: 100, borderRadius: 40}}
              titleStyle={styles.buttonstyle}
              title="Save"
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
  dropDownItem: {
    padding: 10,
    marginTop: 2,
    backgroundColor: "#ddd",
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 5,
  },
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
    marginRight: 25,
    fontSize: 20,
    marginTop: 0,
    marginLeft: 10,
    marginBottom: 10,
  },
  addText: {
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
  deleteItemIcon: {
    color: "#FF6978",
    fontSize: 16,
    paddingTop: 5,
  },
  routineDetailsIcon: {
    color: "#FF6978",
    fontSize: 30,
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
    // width: 600,
  },
  formIndent: {
    marginLeft: 30,
  },
  routineDetails: {
    fontSize: 10,
    paddingTop: 15,
    paddingLeft: 15,
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
  tagMenuIconText: {
    // color: "#FF6978",
    fontSize: 18,
    paddingTop: 5,
    marginLeft: 8,
    marginTop: 8,
  },
  tagMenuIcons: {
    color: "#FF6978",
    fontSize: 18,
    paddingTop: 5,
    marginLeft: 30,
    marginTop: 10,
    flexDirection: "row",
    fontWeight: "bold",
  },
});
