import React, { Component } from "react";
import { Dimensions, Text, View, Vibration } from "react-native";
import { ScrollView, PinchGestureHandler } from "react-native-gesture-handler";
const { width: WIDTH } = Dimensions.get("window");

import { Notifications } from "expo";

import * as Permissions from "expo-permissions";
import Constants from "expo-constants";

import Environment from "../../database/sqlEnv";
import UserInfo from "../../state/UserInfo";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
Icon.loadFont();

console.disableYellowBox = true;

export default class ChildRoutines extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expoPushToken: "",
      notification: {},
      loaded: false,
      results: null,
      activities: null,
      routines: null,
      child: null,
    };

    const { navigate } = this.props.navigation;
    this.navigate = navigate;

    this.notif = false;
  }

  // Get the routines data from the db
  getRoutines() {
    const parentId = UserInfo.parent_id;
    const childId = UserInfo.child_id;
    const userId = UserInfo.user_id;

    fetch(Environment + "/getRoutinesByUser/" + userId, {
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((results) => {
        this.setState({ routines: results });
        this.setState({ loaded: true });

        this.setNotifs();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  updateRoutine(tag, value, routineId) {
    var data = {
      [tag]: value,
    };
    try {
      let response = fetch(Environment + "/updateRoutine/" + routineId, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.status >= 200 && response.status < 300) {
        console.log("SUCCESS");
      }
    } catch (errors) {
      alert(errors);
    }
  }

  componentDidMount() {
    this.registerForPushNotificationsAsync();

    this.props.navigation.addListener("didFocus", (payload) => {
      this.getRoutines();
    });

    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }

  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = await Notifications.getExpoPushTokenAsync(); //store tokens if needed
      this.setState({ expoPushToken: token });
    } else {
      alert("Must use physical device for Push Notifications");
    }
  };

  _handleNotification = (notification) => {
    Vibration.vibrate();
    this.setState({ notification: notification });

    if (notification.origin === "selected") {
      this.updateRoutine("push_set", 0, notification.data.routine.routine_id);
      this.props.navigation.navigate("ChildNotifScreen", {
        prevScreenTitle: "My Routines",
        routineId: notification.data.routine.routine_id,
        routineTime: notification.data.routine.start_time,
        routineName: notification.data.routine.routine_name,
        activities: notification.data.routine.amount_of_activities,
        rewards: notification.data.routine.amount_of_rewards,
      });
    }
  };

  // Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/dashboard/notifications
  sendPushNotification = async (date, item) => {
    try {
      await Notifications.scheduleLocalNotificationAsync(
        {
          to: this.state.expoPushToken,
          sound: "default",
          title: "Hello",
          body: "It's time to start your routine!",
          data: { routine: item },
          _displayInForeground: true,
        },
        {
          time: date,
        }
      );
      this.updateRoutine("push_set", 1, item.routine_id);
    } catch (e) {
      alert(e);
    }
  };

  setDays(daytoset, date) {
    var currentDay = date.getDay();
    var distance = (daytoset + 7 - currentDay) % 7;
    date.setDate(date.getDate() + distance);
    return date;
  }

  setNotifs() {
    this.state.routines.routines.map((item) => {
      if (item.push_set === 0) {
        let time = item.start_time.split(":");
        console.log(time);
        let date = new Date();
        date.setHours(time[0]);
        date.setMinutes(time[1]);

        if (item.sunday === 1) {
          let newDate = this.setDays(0, date);
          this.sendPushNotification(newDate, item);
        }
        if (item.monday === 1) {
          let newDate = this.setDays(1, date);
          this.sendPushNotification(newDate, item);
        }
        if (item.tuesday === 1) {
          let newDate = this.setDays(2, date);
          this.sendPushNotification(newDate, item);
        }
        if (item.wednesday === 1) {
          let newDate = this.setDays(3, date);
          this.sendPushNotification(newDate, item);
        }
        if (item.thursday === 1) {
          let newDate = this.setDays(4, date);
          this.sendPushNotification(newDate, item);
        }
        if (item.friday === 1) {
          let newDate = this.setDays(5, date);
          this.sendPushNotification(newDate, item);
        }
        if (item.saturday === 1) {
          let newDate = this.setDays(6, date);
          this.sendPushNotification(newDate, item);
        }
      }
    });
  }

  renderRoutines() {
    
    return this.state.routines.routines.map((item) => {
      if (item.is_active == 1) {
        return (
          <View
            style={({ flex: 1 }, styles.routines)}
            onStartShouldSetResponder={() =>
              this.props.navigation.navigate("ChildStartActivity", {
                prevScreenTitle: "My Routines",
                currentRoutine: item.routine_name,
                routineId: item.routine_id,
                routineName: item.routine_name,
                activities: item.amount_of_activities,
                rewards: item.amount_of_rewards,
                rewardId: item.reward_id,
                requiresApproval: item.requires_approval,
                amountOfActivities: item.amount_of_activities,
              })
            }
          >
            <ScrollView>
              <Text style={styles.routineTitle}>{item.routine_name}</Text>
            </ScrollView>

            <View style={styles.detailsContainer}>
              <Text style={styles.routineDetails}>
                <Icon name="playlist-check" color="#B1EDE8" size={20} />{" "}
                Activities: {item.amount_of_activities}
              </Text>
              <Text style={styles.routineDetails}>
                <Icon name="gift" color="#B1EDE8" size={20} /> Rewards:{" "}
                {item.amount_of_rewards}
              </Text>
            </View>
          </View>
        );
      }
    });
  }

  render() {
    return (
      <View>
        {this.state.loaded && (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {this.renderRoutines()}
          </View>
        )}
      </View>
    );
  }
}

const styles = {
  detailsContainer: {
    padding: 2,
    paddingBottom: 15,
  },
  selectText: {
    fontSize: 17,
    padding: 5,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
  },
  routines: {
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
  routineTitle: {
    paddingLeft: 5,
    paddingTop: 5,
    fontSize: 16,
    marginLeft: 10,
    textAlign: "left",
    textAlignVertical: "center",
  },
  routineDetails: {
    fontSize: 15,
    paddingTop: 10,
    paddingLeft: 2,
  },
};
