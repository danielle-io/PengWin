// TODO: fix switch bug
// TODO: create reward dictionary to lessen db calls
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
      requiresApproval: this.props.navigation.state.params.requires_approval,
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
      // TODO: hardcoded date
      date: "2016-05-15",
      newActivities: [],
      newReward: null,
      currentlySelectedActivity: null,
      currentlySelectedReward: null,

      activityChangeLoad: true,
      rewardLoaded: false,
      addToActivityRoutineTbl: [],

      activityInserted: false,

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
        if (tag === "reward_id"){
          this.setState({ rewardLoaded: true });
          this.displayList("reward");
          this.addRewardRow(1);
        }
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
        this.setState({ activityInserted: true });
        this.getActivityRoutineJoinTable();
        this.setState({
          amount_of_activities: this.state.amount_of_activities + 1,
        });
        this.setState({ currentlySelectedActivity: null });
      }
    } catch (errors) {
      alert(errors);
    }
  }

  // Update the activity routine db table w/ changes
  async updateActivityRelationship(routine_activity_id, tag, value) {
    var data = {
      [tag]: value,
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
        this.setState({ activityInserted: true });
      }
    } catch (errors) {
      alert(errors);
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
      requiresApproval: this.state.requires_approval,
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
                items={this.state.filteredActivities}
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

  // TODO: combine this menu with activity menu just make it dynamic  
  addRewardRow(rowNum) {
    return (
      <View>
        {this.state.addRewardButtonClicked && (
          <View style={styles.formIndent}>
            <View style={styles.editRoutineButtonAndList}>
              <Text style={styles.redNumbers}>{rowNum}</Text>
              <SearchableDropdown
                onItemSelect={(item) => {
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
                // value={this.state.newReward}
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

  getRoutineReward(){
    if (this.state.rewardId !== 0) {
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


  componentDidMount() {

    // If there is a reward for the routine, store it
    this.getRoutineReward();
  
    // Put all the reward names in an array since those
    // will be displayed in the dropdown
    if (this.allRewardsByIdDictionary !== null) {
      this.getAllRewardNames();
    }

    // Fetche routine data only if editing an existing routine
    if (this.state.routineId !== null) {
      this.getActivityRoutineJoinTable();
    }
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
    var tempOrderDict = {};
    var tempIdDict = {};
    activitiesFromDb.map((item) => {
      tempOrderDict[item.order] = item;
      tempIdDict[item.activity_id] = item;
    });
    this.setState({ routineActivitiesByOrder: tempOrderDict });
    this.setState({ routineActivitiesById: tempIdDict });
    this.setState({ activitiesLoaded: true });
  }

  swapDateValue(value, tag) {
    if (value === 1) {
      this.setState({ [tag]: 0 });
      return 0;
    }
    this.setState({ [tag]: 1 });
    return 1;
  }

  getCurrentSwitchState() {
    if (this.state.routineApproval === 1) {
      return true;
    }
    return false;
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
    } else {
      // Put ordered activities an array to loop over them
      for (
        var i = 0;
        i < Object.keys(this.state.routineActivitiesByOrder).length;
        i++
      ) {
        mappingVal.push(this.state.routineActivitiesByOrder[i]);
      }
 
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
    this.addRewardRow(1);
  }

  clickedAddActivity() {
    this.setState({
      addActivityButtonClicked: true,
    });
    this.reRenderList("activity");
  }

  handleApprovalSwitchChange() {
    this.setState({ requiresApproval: !this.state.requiresApproval });

    this.pushToUpdateRoutineArray(
      "requires_approval",
      this.state.requiresApproval
    );
  }

  // ReRender the components on the click of the new button
  reRenderList(listName) {
    if (listName === "activity") {

      // This is to save the previously added activity if they
      // already added one and now clicked add again
      if (this.state.currentlySelectedActivity != null) {

        this.addNewActivityToState();
      }

      // Display everything once the activity is loaded
      {
        this.state.activityChangeLoad && this.displayList(listName);
        this.addActivityRow(this.state.amount_of_activities);
      }
    }

    // Re-Load Rewards
    else {
      this.changeRoutineComponent("reward_id", this.state.newReward.id);

      // Display everything once the activity is loaded
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

    this.pushToUpdateRoutineArray(
      "routine_name",
      this.state.routineName
    );

    // Insert a new activity into the relationship table
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
          console.log("are we in the reward dont add button thing")
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
            receives their final reward?
          </Text>
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
    console.log("checing items exist");

    // TODO: write this for activities too

    // They can't add or list rewards if they haven't made any yet
    if (listName === "reward") {
      if (this.state.allRewardsByIdDictionary !== null) {
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
    this.updateRoutineData();
  }

  saveAnyChanges() {
    this.setState({ addActivityButtonClicked: false });
    this.setState({ addRewardButtonClicked: false });

    // This means an item was selected but the add button wasnt pressed
    if (this.state.currentlySelectedActivity != null) {
      this.addNewActivityToState();
      // this.getActivityById(this.state.currentlySelectedActivity.id);
      // console.log("saved activity");
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
      this.setState({ rewardId: this.state.newReward.id });

      this.setState({
        currentlySelectedReward: this.state.allRewardsByIdDictionary[
          this.state.newReward.id
        ],
      });
      this.pushToUpdateRoutineArray("reward_id", this.state.newReward.id);

      this.pushToUpdateRoutineArray(
        "amount_of_rewards",
        this.state.amount_of_rewards + 1
      );
    }

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
    if (this.state.routineActivitiesById !== null && this.state.rewardLoaded) {
    } else {
      console.log("RETURNING NULL");
      console.log("this.state.routineActivitiesById :: " + this.state.routineActivitiesById);
      console.log("this.state.rewardLoaded :: " + this.state.rewardLoaded);
      
      return null;
    }

    return (
      <View style={styles.textFields}>
        <ScrollView keyboardShouldPersistTaps="always">
          <View style={styles.editRoutineFormContainer}>
            {/* TESTING CONTAINER */}
            {!this.state.activitiesLoaded && (
              <View>
                <Text>:( activies not loaded</Text>
              </View>
            )}

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
});
