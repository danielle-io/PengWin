import React, { Component } from "react";
import { Dimensions, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
const { width: WIDTH } = Dimensions.get("window");

// import {Notifications} from 'react-native-notifications';
import { Notifications } from "expo";

import Environment from "../../database/sqlEnv";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
Icon.loadFont();

console.disableYellowBox = true;
export default class ChildRoutines extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      secondLoaded: false,
      userId: 1,
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
  }

  // Get the routines data from the db
  getRoutines() {
    fetch( Environment + "/routines/", {
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
    this.props.navigation.addListener("didFocus", (payload) => {
      this.getRoutines();
    });
  }

  renderRoutines() {
    console.log("IM RENDER ROUTIMES");
    console.log("THESE ARE MY ROUTINES" + this.state.routines.routines.length);
    return this.state.routines.routines.map((item) => {
      console.log(item);
      if (item.is_active == 1) {
        return (
          <View
            style={({ flex: 1 }, styles.routines)}
            onStartShouldSetResponder={() =>
              this.props.navigation.navigate("ChildActivity", {
                prevScreenTitle: "My Routines",
                currentRoutine: item.routine_name,
                userID: item.user_id,
              })
            }
          >
            <ScrollView>
              <Text style={styles.routineTitle}>{item.routine_name}</Text>
            </ScrollView>

            {/* TODO: Change Numerical Value to be dynamic*/}
            <View style={styles.detailsContainer}>
              <Text style={styles.routineDetails}>
                <Icon name="playlist-check" color="#B1EDE8" size={20} /> Tasks:{" "}
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
  lowerCorner: {
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: "flex-end",
    marginRight: 20,
  },
};
