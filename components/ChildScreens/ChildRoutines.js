import React, { Component } from "react";
import {
  Dimensions,
  Text,
  View,
  Vibration,
  Platform,
  Button,
} from "react-native";
import { ScrollView, PinchGestureHandler } from "react-native-gesture-handler";
const { width: WIDTH } = Dimensions.get("window");

// import {Notifications} from 'react-native-notifications';
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
    this.getChild();
  
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
        console.log(this.state.routines)
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getChild() {
    const parentId = UserInfo.parent_id;
    const childId = UserInfo.child_id;
    const userId = UserInfo.user_id;

    fetch(Environment + "/getChildFromParent/" + parentId, {
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((results) => { 
        results.map(item => {
          this.setState({ child: item });
        });

        console.log(this.state.child.first_name)
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentDidMount() {
    this.registerForPushNotificationsAsync();

    this.props.navigation.addListener("didFocus", (payload) => {
      this.getRoutines();
      this.getChild();
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
      token = await Notifications.getExpoPushTokenAsync();
      console.log(token);
      this.setState({ expoPushToken: token });
    } else {
      alert("Must use physical device for Push Notifications");
    }
  };

  _handleNotification = (notification) => {
    Vibration.vibrate();
    console.log(notification);
    this.setState({ notification: notification });

    if (notification.origin === "received") {
      // after receive push notification code
    } else if (notification.origin === "selected") {
      // after click code
      this.props.navigation.navigate("ChildNotifScreen", {
        prevScreenTitle: "My Routines"
      })
    }
  };

  message() {
    return message = {
      to: this.state.expoPushToken,
      sound: "default",
      title: this.state.child.first_name,
      body: "And here is the body!",
      data: { data: "goes here" },
      _displayInForeground: true,
    };
  }
  // Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/dashboard/notifications
  sendPushNotification = async () => {
   
    const message = {
      to: this.state.expoPushToken,
      sound: "default",
      title: "Hello",
      body: "It's time to start your routine!",
      data: { data: "goes here" },
      _displayInForeground: true,
    };
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  };

  renderRoutines() {
    return this.state.routines.routines.map((item) => {
      // console.log(item);
      if (item.is_active == 1) {
        return (
          <View
            style={({ flex: 1 }, styles.routines)}
            onStartShouldSetResponder={() =>
              this.props.navigation.navigate("ChildStartActivity", {
                prevScreenTitle: "My Routines",
                currentRoutine: item.routine_name,
                routineId: item.routine_id,
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
        <Button title = {"HELLO"}onPress={() => this.sendPushNotification()}/>
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
    paddingLeft: 3,
    textAlignVertical: "center",
    width: WIDTH * 0.3,
    height: 120,
    margin: 10,
    borderWidth: 3,
    borderRadius: 15,
    backgroundColor: "white",
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "black",
    shadowOpacity: 0.1,
    borderWidth: 0,
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
