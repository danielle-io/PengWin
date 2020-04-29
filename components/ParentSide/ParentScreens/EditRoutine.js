// TO O: fix switch bug
import React, { Component } from "react";
import {
  Alert,
  Dimensions,
  Picker,
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
    /* DONE BUTTON
        
        headerRight: () => <Button onPress={ () => {
           var alr = "";
            if(navigation.state.params.routineName === '' || !navigation.state.params.routineName)
            {
                alr += "Must have a routine name\n"
            }
            if(navigation.state.params.amount_of_activities < 1 || !navigation.state.params.amount_of_activities)
            {
                alr += "Must have more than one activity\n";
            }
            if(navigation.state.params.amount_of_rewards < 1 || !navigation.state.params.amount_of_rewards)
            {
                alr += "Must have more than one reward\n"
            }
            if(alr !== '')
            {
                alert(alr);
            }
            else{
                navigation.navigate('ParentNavigation', {
                    prevScreenTitle: 'Routines'
                });
            }
        }}
        title="Done"
        color="#352D39"
        accessibilityLabel="Done with Routine Button"/>*/
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
      rewards: this.props.navigation.state.params.rewards,
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
      // TODO: hardcoded ID
      userId: 1,
      allActivities: this.props.navigation.state.params.allActivities,
      allActivityNames: [],
      changedValues: [],
      activities: null,
      loaded: false,
      rewardId: this.props.navigation.state.params.rewardId,
      // addNewLine: false,
      // TODO: hardcoded date
      date: "2016-05-15",
      newActivities: [],
      newActivityRows: 0,
      newRewardRows: 0,
      currentlySelectedActivity: null,
      activityChangeLoad: true,
      rewardName: null,
      rewardLoaded: false,
    };
  }

  // // Update the DB
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

  // Update the DB
  updateRoutineData() {
    // This means we are inserting a new item in the db, so we will
    // insert diff than we update
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
    // routine_name: this.props.navigation.state.params.routineName,
    // user_id: this.props.navigation.state.params.routineId,
    // routineStartTime: this.props.navigation.state.params.routineStartTime,
    // routineEndTime: this.props.navigation.state.params.routineEndTime,
    // routineApproval: this.props.navigation.state.params.routineApproval,
    // rewards: this.props.navigation.state.params.rewards,
    // approval: this.props.navigation.state.params.is_approved,
    // amount_of_activities: this.state.activities.length(),
    // amount_of_rewards: this.state.rewards.length(),
    // monday: this.props.navigation.state.params.monday,
    // tuesday: this.props.navigation.state.params.tuesday,
    // wednesday: this.props.navigation.state.params.wednesday,
    // thursday: this.props.navigation.state.params.thursday,
    // friday: this.props.navigation.state.params.friday,
    // saturday: this.props.navigation.state.params.saturday,
    // sunday: this.props.navigation.state.params.sunday,
  }

  // handleSubmit(event) {
  //   alert("A name was submitted: " + this.state.activities.join(", "));
  //   event.preventDefault();
  // }

  // Update the change array
  pushToUpdateArray(tag, value) {
    Object.keys(this.state.changedValues).map(function(keyName, keyIndex) {
      if (keyName === tag) {
        return;
      }
    });

    // TODO: I can't remember why this is here??
    // if (tag === "is_approved") {
    //   this.setState({ routineApproval: !this.state.routineApproval });
    // }

    let tempArray = this.state.changedValues;
    tempArray.push({ [tag]: value });
    this.setState({ changedValues: tempArray });
    // console.log(this.state.changedValues);
  }

  loopOverNewRows(listName) {
    console.log("loop over rows");
    var rowNum = 0;
    var addingRows = 0;
    if (listName == "activity") {
      addingRows = this.state.newActivityRows;
      rowNum = this.state.amount_of_activities;
    } else {
      addingRows = this.state.newRewardRows;
      rowNum = this.state.amount_of_rewards;
    }
    for (let i = 0; i < addingRows; i++) {
      rowNum += 1;
      return [this.addFormRow(rowNum)];
    }
  }

  addFormRow(rowNum) {
    console.log("adding row in add form row");
    return (
      <View style={styles.formIndent}>
        <View style={styles.editRoutineButtonAndList}>
          <Text style={styles.redNumbers}>{rowNum}</Text>
          {/* <Text style={styles.activityText}> */}

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
            itemStyle={{
              padding: 10,
              marginTop: 2,
              backgroundColor: "#ddd",
              borderColor: "#bbb",
              borderWidth: 1,
              borderRadius: 5,
            }}
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
              // onTextChange: text => alert(text)
            }}
            value={this.state.currentlySelectedActivity}
            listProps={{
              nestedScrollEnabled: true,
            }}
          />
        </View>
      </View>
    );
  }

  // TODO: there needs to be a new routine ID for this item before this happens
  componentDidMount() {
    // Get the activities data from the db
    fetch(Environment + "/routine/" + this.state.routineId)
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((activities) => {
        this.setState({ activities: activities });
        this.setState({ loaded: true });
        this.removeAlreadyAddedActivitiesFromOptions();
      })
      .catch((error) => {
        console.error(error);
      });
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

    console.log("ACTIVITY ID");
    console.log(activityId);

    fetch(Environment + "/getActivityById/" + activityId)
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((activity) => {
        var tempArray = this.state.activities;
        tempArray.push(activity);
        console.log("ACTIVITY BELOW");
        console.log(activity);

        this.setState({ activities: tempArray });
        this.removeAlreadyAddedActivitiesFromOptions();
        this.setState({ activityChangeLoad: true });

        console.log(this.state.activityChangeLoad);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getRewardById() {
    console.log("REWARD BY ID");
    console.log(this.state.routineId)
    this.setState({ rewardLoaded: false });

    fetch(Environment + "/getRewardById/" + this.state.rewardId)
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((reward) => {
        this.setState({ rewardName: reward.reward_name });
        this.setState({ rewardLoaded: true });
      })
      .catch((error) => {
        console.error(error);
      });
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
    var mappingVal = this.state.activities;
    if (listName === "reward") {
      if (this.state.rewardId === null || this.state.rewardId === 0) {
        return;
      } else {
        return;
        // TODO: fix the below code it almost werks
        // this.getRewardById();
        // // mappingVal = this.state.reward;
        // return (
        //   <View style={styles.formIndent}>
        //     {this.state.rewardLoaded && (
        //       <View style={styles.editRoutineButtonAndList}>
        //         <Text style={styles.redNumbers}>{1}</Text>
        //         <Text style={styles.activityText}>{this.state.rewardName}</Text>
        //       </View>
        //     )}
        //   </View>
        // );
      }
    }

    //  this is the loop where activities populate and rewards populate
    return mappingVal.map((item) => {
      itemNumCounter += 1;
      return (
        <View style={styles.formIndent}>
          <View style={styles.editRoutineButtonAndList}>
            <Text style={styles.redNumbers}>{itemNumCounter}</Text>
            <Text style={styles.activityText}>{item.activity_name}</Text>
          </View>
        </View>
      );
    });
  }

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
        // itemIdString = JSON.stringify(item.activity_id);
        tempArrayNames.push({ id: item.activity_id, name: item.activity_name });
      }
    }
    this.setState({ allActivities: tempArray });
    this.setState({ allActivityNames: tempArrayNames });
    console.log(this.state.allActivityNames);
  }

  // addNewRewardOrActivity(lns){
  //   if (lns === "reward"){
  //     console.log("rewards code not added yet.")
  //   }
  //   else {
  //     this.setState({ addNewLine: true })
  //   }
  // }

  // onValueChange={() =>
  //
  // }
  reRenderList(lns) {
    if (this.state.currentlySelectedActivity != null) {
      console.log("SELECTED ACTIVITY");
      console.log(this.state.currentlySelectedActivity);

      // TODO :: ADD A CALL TO THE ACTIVITY ROUTINE TABLE TO CONNECT THE ACTIVITY TO THE ROUTINE
      // this.pushToUpdateArray("amount_of_activities", this.state.amount_of_activities + 1)

      // TODO remove this once call to the other table is done and add line 2 lines up
      this.setState({
        amount_of_activities: this.state.amount_of_activities + 1,
      });

      this.getActivityById(this.state.currentlySelectedActivity.id);
    }
    if (lns === "activity") {
      this.setState({ newActivityRows: this.state.newActivityRows + 1 });
    } else {
      this.setState({ newRewardRows: this.state.newRewardRows + 1 });
    }
    console.log(this.state.newActivityRows);
    {
      {this.state.activityChangeLoad && 
        this.displayList(lns) 
        this.loopOverNewRows(lns);
        // this.addNewItemButtonToList(lns);
      }
    }
  }

  addNewItemButtonToList(lns) {
    let textfield = "";
    lns === "activity"
      ? (textfield = "Add an activity")
      : (textfield = "Add a reward");

    return (
      <View style={styles.formIndent}>
        <View style={styles.editRoutineButtonAndList}>
          {this.state.allActivityNames !== [] && (
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
                this.reRenderList(lns);
              }}
              title="+"
              titleColor="white"
              color="#FF6978"
              // onPress={() => this.addNewRewardOrActivity(lns)}
              //  doesnt this go on submit button ?
              // onPress={() => this.naviHelper(lns)}
            />
          )}
          {this.state.allActivityNames === [] && (
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
                this.reRenderList(lns);
              }}
              disabled="true"
              title="+"
              titleColor="white"
              color="#FF6978"
              // onPress={() => this.addNewRewardOrActivity(lns)}
              //  doesnt this go on submit button ?
              // onPress={() => this.naviHelper(lns)}
            />
          )}
          <View
          // style={{
          //   borderBottomColor: "#C4C4C4",
          //   borderBottomWidth: 1,
          //   width: WIDTH * 0.6,
          // }}
          >
            <Text style={styles.activityText}>
              {/* {textfield} */}

              {/* {lns === "activity" && (
                <Picker
                  style={[styles.onePicker]}
                  itemStyle={styles.onePickerItem}
                  placeholder="Select an activity"

                  // selectedValue={this.state.firstLanguage}
                  // onValueChange={(itemValue) =>
                  //   this.setState({ firstLanguage: itemValue })
                  // }
                >
                  {this.state.allActivities.map((item, index) => {
                    return (
                      <Picker.Item
                        // onValueChange={(itemValue, itemIndex) =>
                        //   this.setState({ language: itemValue })
                        // }
                        label={item.activity_name}
                        value={index}
                        key={index}
                      />
                    );
                  })}
                </Picker>
              )} */}
            </Text>
          </View>
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
              this.pushToUpdateArray("is_approved", !this.state.routineApproval)
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
    buttonstyle = {
      fontSize: 10,
      padding: 0,
      margin: 0,
      fontWeight: "bold",
    };
    return (
      <View>
        <Text style={{ fontSize: 15, marginTop: 10 }}>Select Days</Text>

        <View style={styles.routinesCalendar}>
          <RaisedTextButton
            style={styles.roundDateButton}
            titleStyle={buttonstyle}
            title="M"
            titleColor={this.getDateButtonTextColor(this.state.monday)}
            onPress={
              (this._onPress,
              () => {
                this.pushToUpdateArray(
                  "monday",
                  this.swapDateValue(this.state.monday, "monday")
                );
              })
            }
            color={this.getDateButtonColor(this.state.monday)}
          />

          <RaisedTextButton
            style={styles.roundDateButton}
            titleStyle={buttonstyle}
            title="T"
            titleColor={this.getDateButtonTextColor(this.state.tuesday)}
            onPress={
              (this._onPress,
              () => {
                this.pushToUpdateArray(
                  "tuesday",
                  this.swapDateValue(this.state.tuesday, "tuesday")
                );
              })
            }
            color={this.getDateButtonColor(this.state.tuesday)}
          />

          <RaisedTextButton
            style={styles.roundDateButton}
            titleStyle={buttonstyle}
            title="W"
            titleColor={this.getDateButtonTextColor(this.state.wednesday)}
            onPress={
              (this._onPress,
              () => {
                this.pushToUpdateArray(
                  "wednesday",
                  this.swapDateValue(this.state.wednesday, "wednesday")
                );
              })
            }
            color={this.getDateButtonColor(this.state.wednesday)}
          />

          <RaisedTextButton
            style={styles.roundDateButton}
            titleStyle={buttonstyle}
            title="Th"
            titleColor={this.getDateButtonTextColor(this.state.thursday)}
            onPress={
              (this._onPress,
              () => {
                this.pushToUpdateArray(
                  "thursday",
                  this.swapDateValue(this.state.thursday, "thursday")
                );
              })
            }
            color={this.getDateButtonColor(this.state.thursday)}
          />

          <RaisedTextButton
            style={styles.roundDateButton}
            titleStyle={buttonstyle}
            title="F"
            titleColor={this.getDateButtonTextColor(this.state.friday)}
            onPress={
              (this._onPress,
              () => {
                this.pushToUpdateArray(
                  "friday",
                  this.swapDateValue(this.state.friday, "friday")
                );
              })
            }
            color={this.getDateButtonColor(this.state.friday)}
          />

          <RaisedTextButton
            style={styles.roundDateButton}
            titleStyle={buttonstyle}
            title="Sa"
            titleColor={this.getDateButtonTextColor(this.state.saturday)}
            onPress={
              (this._onPress,
              () => {
                this.pushToUpdateArray(
                  "saturday",
                  this.swapDateValue(this.state.saturday, "saturday")
                );
              })
            }
            color={this.getDateButtonColor(this.state.saturday)}
          />

          <RaisedTextButton
            style={styles.roundDateButton}
            titleStyle={buttonstyle}
            title="Su"
            titleColor={this.getDateButtonTextColor(this.state.sunday)}
            onPress={
              (this._onPress,
              () => {
                this.pushToUpdateArray(
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

  // Should run on hitting the back button
  componentWillUnmount() {
    console.log("navigating back now");

    // Update the database
    this.updateRoutineData();
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
    if (this.state.activities !== null) {
    } else {
      return null;
    }
    return (
      <View style={styles.textFields}>
        <ScrollView keyboardShouldPersistTaps="always">
          <View style={styles.editRoutineFormContainer}>
            {this.state.loaded && (
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
                    this.pushToUpdateArray(
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
                {this.displayList("activity")}
                {this.loopOverNewRows("activity")}
                {this.addNewItemButtonToList("activity")}
              </View>
            )}

            {/** REWARDS NAME **/}
            {/*  TODO: if there is a reward for the routine, populate it here, if not, leave empty */}
            <View>
              <View style={styles.editRoutineIconAndTitle}>
                <Icon style={styles.routineDetailsIcon} name="gift" />
                <Text style={styles.editRoutineSectionName}>Rewards</Text>
              </View>

              <Text style={styles.editRoutinesInstructionsText}>
                {/* TODO: only say routine in the text string if the word isnt in the routine title */}
                Add a reward that your child receives when they complete their{" "}
                {this.state.routine}.
              </Text>
              {this.displayList("reward")}
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
                    this.pushToUpdateArray("start_time", date);
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
                  fontSize: 25,
                }}
                date={this.defineTime("End")}
                mode="time"
                showIcon={false}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={(date) => {
                  {
                    this.pushToUpdateArray("end_time", date);
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
              titleStyle={buttonstyle}
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
  // EDIT ROUTINES
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
