import React, { Component } from "react";
import { Dimensions, Text, View, Vibration, Platform, Button } from "react-native";
import { ScrollView, PinchGestureHandler } from "react-native-gesture-handler";
const { width: WIDTH } = Dimensions.get("window");

// import {Notifications} from 'react-native-notifications';
import { Notifications } from "expo";

import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

import Environment from "../../database/sqlEnv";
import UserInfo from "../../state/UserInfo";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
Icon.loadFont();

console.disableYellowBox = true;

export default class ChildRoutines extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      expoPushToken: '',
      notification: {},
      loaded: false,
      results: null,
      activities: null,
      routines: null,
    };

    const { navigate } = this.props.navigation;
    this.navigate = navigate;

    this.notif = false;


    // this.getRoutines();
    // this.parseRoutines();
    // Notifications.registerRemoteNotifications();

    // Notifications.events().registerNotificationReceivedForeground(
    //   (notification, completion) => {
    //     console.log(
    //       `Notification received in foreground: ${notification.title} : ${
    //         notification.body
    //       }`,
    //     );
    //     completion({alert: true, sound: true, badge: true});
    //     this.notif = true;
    //   },
    // );

    //   Notifications.events().registerNotificationOpened(
    //     (notification, completion) => {
    //       console.log(`Notification opened: ${notification.payload}`);
    //       this.navigate('ChildNotifScreen', {prevScreenTitle: 'TestingHomePage'});
    //       completion({alert: true, sound: true, badge: true});
    //     },
    //   );

    // }

    // parseRoutines() {
    //   console.log('ACTIVITIES' + this.state.results);
    //   if (this.state.results) {
    //     this.state.results.routines.forEach(element => {

    //       console.log(element.start_time);
    //       var today = new Date();
    //       var time = element.start_time.split(":");
    //       const dt = new Date(today.getFullYear(), today.getMonth(), today.getDate(), time[0], time[1]);
    //       const body = 'Its time to complete your ' + element.routine_name + '!';

    //       const fireDate = dt.toISOString();

    //       console.log(element.monday + " " + today.getDay() + fireDate);

    //       if (element.sunday == 1 && today.getDay() == 0) {
    //         console.log("TODAY IS SUN");
    //         Notifications.postLocalNotification({
    //           fireDate: fireDate,
    //           body: body,
    //           title: element.routine_name,
    //           sound: 'chime.aiff',
    //           silent: false,
    //           category: 'Child',
    //           userInfo: {},
    //         });
    //       }

    //       if (element.monday == 1 && today.getDay() == 1) {
    //         console.log("TODAY IS MON");
    //         Notifications.postLocalNotification({
    //           fireDate: fireDate,
    //           body: body,
    //           title: element.routine_name,
    //           sound: 'chime.aiff',
    //           silent: false,
    //           category: 'Child',
    //           userInfo: {},
    //         });
    //       }
    //       if (element.tuesday == 1 && today.getDay() == 2) {
    //         console.log("TODAY IS TUE");
    //         Notifications.postLocalNotification({
    //           fireDate: fireDate,
    //           body: body,
    //           title: element.routine_name,
    //           sound: 'chime.aiff',
    //           silent: false,
    //           category: 'Child',
    //           userInfo: {},
    //         });
    //       }
    //       if (element.wednesday == 1 && today.getDay() == 3) {
    //         console.log("TODAY IS WED");
    //         Notifications.postLocalNotification({
    //           fireDate: fireDate,
    //           body: body,
    //           title: element.routine_name,
    //           sound: 'chime.aiff',
    //           silent: false,
    //           category: 'Child',
    //           userInfo: {},
    //         });
    //       }
    //       if (element.thursday == 1 && today.getDay() == 4) {
    //         console.log("TODAY IS THUR");
    //         Notifications.postLocalNotification({
    //           fireDate: fireDate,
    //           body: body,
    //           title: element.routine_name,
    //           sound: 'chime.aiff',
    //           silent: false,
    //           category: 'Child',
    //           userInfo: {},
    //         });
    //       }
    //       if (element.friday == 1 && today.getDay() == 5) {
    //         console.log("TODAY IS FRI");
    //         Notifications.postLocalNotification({
    //           fireDate: fireDate,
    //           body: body,
    //           title: element.routine_name,
    //           sound: 'chime.aiff',
    //           silent: false,
    //           category: 'Child',
    //           userInfo: {},
    //         });
    //       }
    //       if (element.saturday == 1 && today.getDay() == 6) {
    //         console.log("TODAY IS SAT");
    //         Notifications.postLocalNotification({
    //           fireDate: fireDate,
    //           body: body,
    //           title: element.routine_name,
    //           sound: 'chime.aiff',
    //           silent: false,
    //           category: 'Child',
    //           userInfo: {},
    //         });
    //       }
    // });
    // }

    this.sendPushNotification()
  }
  
  // Get the routines data from the db
  getRoutines() {
    const parentId = UserInfo.parent_id;
    const childId = UserInfo.child_id;
    const userId = UserInfo.user_id;
    
    fetch( Environment + "/getRoutinesByUser/" + userId, {
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
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentDidMount() {
    this.registerForPushNotificationsAsync();

    // Handle notifications that are received or selected while the app
    // is open. If the app was closed and then opened by tapping the
    // notification (rather than just tapping the app icon to open it),
    // this function will fire on the next tick after the app starts
    // with the notification data.
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
    this.props.navigation.addListener("didFocus", (payload) => {
      this.getRoutines();
    });

  }

  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = await Notifications.getExpoPushTokenAsync();
      console.log(token);
      this.setState({ expoPushToken: token });
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      });
    }
  };


  _handleNotification = notification => {
    Vibration.vibrate();
    console.log(notification);
    this.setState({ notification: notification });
  };

  // Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/dashboard/notifications
  sendPushNotification = async () => {
    const message = {
      to: this.state.expoPushToken,
      sound: 'default',
      title: 'Original Title',
      body: 'And here is the body!',
      data: { data: 'goes here' },
      _displayInForeground: true,
    };
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
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
                <Icon name="playlist-check" color="#B1EDE8" size={20} /> Activities:{" "}
                {item.amount_of_activities}
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

    <Button title={'Press to Send Notification'} onPress={() => this.sendPushNotification()} />
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
