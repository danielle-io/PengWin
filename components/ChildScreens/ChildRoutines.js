import React, {Component} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
const {width: WIDTH} = Dimensions.get('window');
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

// import {Notifications} from 'react-native-notifications';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
Icon.loadFont();
console.disableYellowBox = true;
export default class ChildRoutines extends Component {
  constructor(props) {
    super(props);
    const {navigate} = this.props.navigation;
    this.navigate = navigate;
    this.notif = false;

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

    // Notifications.events().registerNotificationOpened(
    //   (notification, completion) => {
    //     console.log(`Notification opened: ${notification.payload}`);
    //     this.navigate('ChildNotifScreen', {prevScreenTitle: 'TestingHomePage'});
    //     completion({alert: true, sound: true, badge: true});
    //   },
    // );

    // Notifications.postLocalNotification({
    //   body: 'Its time to complete your morning routine!',
    //   title: 'Good Morning',
    //   sound: 'chime.aiff',
    //   silent: false,
    //   category: 'Child',
    //   userInfo: {},
    // });
  }
  componentDidMount() {
    console.log(this.notif);
  }

  render() {
    return (
      <View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <View
            style={({flex: 1}, styles.routines)}
            onStartShouldSetResponder={() =>
              this.props.navigation.navigate('ChildActivity', {
                prevScreenTitle: 'My Routines',
                currentRoutine: 'Morning Routine',
              })
            }>
            <ScrollView>
              <Text style={styles.routineTitle}>Morning</Text>
            </ScrollView>

            {/* TODO: Change Numerical Value to be dynamic*/}
            <View style={styles.detailsContainer}>
              <Text style={styles.routineDetails}>
                <Icon name="playlist-check" color="#B1EDE8" size={20} /> Tasks:
                2
              </Text>
              <Text style={styles.routineDetails}>
                <Icon name="gift" color="#B1EDE8" size={20} /> Rewards: 1
              </Text>
            </View>
          </View>

          <View
            style={styles.routines}
            onStartShouldSetResponder={() =>
              this.props.navigation.navigate('ChildActivity', {
                prevScreenTitle: 'My Routines',
                currentRoutine: 'After School Routine',
              })
            }>
            <ScrollView>
              <Text style={styles.routineTitle}>After School</Text>
            </ScrollView>

            {/* TODO: Change Numerical Value to be dynamic*/}
            <View style={styles.detailsContainer}>
              <Text style={styles.routineDetails}>
                <Icon name="playlist-check" color="#B1EDE8" size={20} /> Tasks:
                4
              </Text>
              <Text style={styles.routineDetails}>
                <Icon name="gift" color="#B1EDE8" size={20} /> Rewards: 2
              </Text>
            </View>
          </View>

          <View
            style={styles.routines}
            onStartShouldSetResponder={() =>
              this.props.navigation.navigate('ChildActivity', {
                prevScreenTitle: 'My Routines',
                currentRoutine: 'Night Time Routine',
              })
            }>
            <ScrollView>
              <Text style={styles.routineTitle}>Night Time</Text>
            </ScrollView>

            {/* TODO: Change Numerical Value to be dynamic*/}
            <View style={styles.detailsContainer}>
              <Text style={styles.routineDetails}>
                <Icon name="playlist-check" color="#B1EDE8" size={20} /> Tasks:
                3
              </Text>
              <Text style={styles.routineDetails}>
                <Icon name="gift" color="#B1EDE8" size={20} /> Rewards: 2
              </Text>
            </View>
          </View>
        </View>
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
    textAlignVertical: 'center',
    width: WIDTH * 0.25,
    height: 110,
    marginTop: 20,
    marginBottom: 5,
    borderWidth: 3,
    borderRadius: 15,
    backgroundColor: 'white',
    shadowOffset: {width: 5, height: 5},
    shadowColor: 'black',
    shadowOpacity: 0.1,
    borderWidth: 0,
  },
  routineTitle: {
    paddingLeft: 5,
    paddingTop: 5,
    fontSize: 16,
    marginLeft: 10,
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  routineDetails: {
    fontSize: 15,
    paddingTop: 10,
    paddingLeft: 2,
  },
  lowerCorner: {
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'flex-end',
    marginRight: 20,
  },
};
