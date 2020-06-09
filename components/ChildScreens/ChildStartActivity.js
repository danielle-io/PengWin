import React, { Component } from "react";
import {
  Dimensions,
  StyleSheet,
  Image,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { AppLoading } from "expo";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import Star from "../../assets/images/Star.png";
import Wave from "../../assets/images/wave.gif";

import Environment from "../../database/sqlEnv";
import UserInfo from "../../state/UserInfo";

Icon.loadFont();

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

export default class ChildStartActivity extends Component {
  constructor(props) {
    super(props);
    const { navigate } = this.props.navigation;
    this.navigate = navigate;
    this.state = {
      prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
      currentRoutine: this.props.navigation.state.params.currentRoutine,
      routineId: this.props.navigation.state.params.routineId,
      rewardId: this.props.navigation.state.params.rewardId,
      requiresApproval: this.props.navigation.state.params.requiresApproval,
      amountOfActivities: this.props.navigation.state.params.amountOfActivities,
      child: null,
      loaded: false,
      routineName: this.props.navigation.state.params.routineName,
      activities: this.props.navigation.state.params.activities,
      rewards: this.props.navigation.state.params.rewards,
      routineTime: this.props.navigation.state.params.routineTime,
    };
    ChildStartActivity.navigationOptions.headerBackTitle = this.props.navigation.state.params.currentRoutine;
    this.getChild();
  }

  //Header titles for routines
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.currentRoutine}`,
  });

  renderStars() {
    let star = [];

    for (let i = 0; i < this.state.activities; i++) {
      star.push(<Image source={Star} style={{ margin: 10 }} />);
    }
    return star;
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
        results.map((item) => {
          this.setState({ child: item });
          this.setState({ loaded: true });
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async insertChildNotification() {
    const parentId = UserInfo.parent_id;
    const childId = UserInfo.child_id;
    const userId = UserInfo.user_id;

    var data = {
      child_id: childId,
      routine_id: this.state.routineId,
      parent_id: parentId,
      is_attempted: 1,
      is_approved: 0,
      in_progress: 1,
      is_evaluated: 0,
      requires_approval: this.state.requiresApproval,
      amount_of_activities: this.state.amountOfActivities,
      reward_id: this.state.rewardId,
      activities_complete: 0,
      quick_start_activity_id: 0,
    };
    let response = await fetch(
      Environment + "/insertChildRoutineNotifications",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((results) => {
        this.navigate("ChildActivity", {
          prevScreenTitle: "My Routines",
          currentRoutine: this.state.currentRoutine,
          routineId: this.state.routineId,
          rewardId: this.state.rewardId,
          requiresApproval: this.state.requiresApproval,
          childNotificationsId: results.insertId,
          image_path_array: " ",
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    let time = this.state.routineTime.split(":");
    let hours = time[0];
    let ampm = "AM";
    if (hours > 11) ampm = "PM";
    hours = hours % 12 || 12;

    if (this.state.loaded) {
      return (
        <View style={styles.container}>
          <ScrollView>
            <Text style={styles.title}> Start {this.state.routineName}</Text>
            <Text style={styles.section}>
              {" "}
              Hi, {this.state.child.first_name}! It’s{" "}
              {hours + ":" + time[1] + " " + ampm} and that means it’s time to
              start your {this.state.routineName} Routine! Complete the routine
              to earn {this.state.activities} stars and win {this.state.rewards}{" "}
              exciting rewards :){" "}
            </Text>
            <View style={styles.image}>{this.renderStars()}</View>
            <Image source={Wave} style={{ margin: 10, marginLeft: 50 }} />
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => {
                this.insertChildNotification();
              }}
            >
              <Text style={styles.textStyle}>Start Routine!</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
    } else {
      return <AppLoading />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 80,
  },
  image: {
    flexDirection: "row",
    flexWrap: "wrap",
    margin: 30,
  },
  section: {
    fontSize: 25,
    alignItems: "center",
    margin: 30,
  },
  activities: {
    backgroundColor: "#FF6978",
    padding: WIDTH * 0.01,
    margin: WIDTH * 0.01,
    borderRadius: 1,
    width: WIDTH * 0.98,
    height: HEIGHT,
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 8,
  },
  actTitle: {
    fontSize: 25,
    padding: 10,
    marginLeft: 20,
  },
  textStyle: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
  },
  buttonStyle: {
    width: 300,
    padding: 10,
    margin: 20,
    backgroundColor: "#B1EDE8",
    borderRadius: 100,
  },
  desc: {
    fontSize: 20,
    padding: 10,
    marginBottom: 10,
  },
  backgroundVideo: {
    position: "relative",
  },
  badgeContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#fff",
  },
  buttonStyle: {
    width: 300,
    padding: 10,
    margin: 20,
    backgroundColor: "#B1EDE8",
    borderRadius: 100,
  },
});
