import React, {Component} from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
Icon.loadFont();

import Star from '../../assets/images/Star.png';
import Wave from '../../assets/images/wave.gif';
//Array of dummy objects
var activities = [
  {
    activityName: 'Clean Your Bedroom',
    userDescription:
      'Thoroughly clean and organize the inside of your drawers and closet. Reorganize and fold clothes. \nVacuum and sweep. This time, clean under your furniture — especially your bed — and in any hard to reach places.',
    imageDesc:
      'https://clipartstation.com/wp-content/uploads/2017/11/clean-room-clipart-11.jpg',
    videoid: 'S8wp_plgkv4',
  },
  {
    activityName: 'Meal Time',
    userDescription:
      'Help with preparing meals, under supervision. Help put clean clothes into piles for each family member, ready to fold. Help with grocery shopping and putting away groceries.',
    imageDesc:
      'https://s28194.pcdn.co/wp-content/uploads/2019/07/calm-mealtime.jpg',
    videoid: 'qpYD_nCo-AU',
  },
  {
    activityName: 'Meal Time',
    userDescription:
      'Help with preparing meals, under supervision. Help put clean clothes into piles for each family member, ready to fold. Help with grocery shopping and putting away groceries.',
    imageDesc:
      'https://s28194.pcdn.co/wp-content/uploads/2019/07/calm-mealtime.jpg',
    videoid: 'qpYD_nCo-AU',
  },
];
export default class ChildNotifScreen extends Component {
  //Header titles for routine notif
  static navigationOptions = ({navigation}) => ({
    title: 'Routines',
    headerRight: () => (
      <Icon
        style={{padding: 15, color: '#848484'}}
        name={'account-circle'}
        size={25}
        onPress={() => {
          navigation.navigate('ChildPincode', {
            prevScreenTitle: 'My Routines',
          });
        }}
      />
    ),
  });

  constructor(props) {
    super(props);
    const {navigate} = this.props.navigation;
    this.navigate = navigate;
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}> Start Before School Routine</Text>
        <Text style={styles.section}>
          {' '}
          Good morning, Alex! It’s 7:00am and that means it’s time to start your
          Before School Routine! Complete the routine to earn your stars and win
          exciting rewards :){' '}
        </Text>
        <View style={styles.image}>
          {activities.map(() => (
            <Image source={Star} style={{margin: 10}} />
          ))}
        </View>
        <Image source={Wave} style={{margin: 10, marginLeft: 50}} />
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => {
            this.navigate('ChildActivity', {
              prevScreenTitle: 'My Routines',
              currentRoutine: 'Morning Routine',
            });
          }}>
          <Text style={styles.textStyle}>Start Routine!</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 30,
  },
  section: {
    fontSize: 25,
    alignItems: 'center',
    margin: 30,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textStyle: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  buttonStyle: {
    width: 300,
    padding: 10,
    margin: 20,
    backgroundColor: '#B1EDE8',
    borderRadius: 100,
  },
};
