import React, { Component } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
Icon.loadFont();

import Star from "../../assets/images/Star.png";
import Wave from "../../assets/images/wave.gif";

import Environment from "../../database/sqlEnv";
import UserInfo from "../../state/UserInfo";
import { AppLoading } from "expo";

export default class ChildNotifScreen extends Component {
  //Header titles for routine notif
  static navigationOptions = ({ navigation }) => ({
    title: "Routines",
    headerRight: () => (
      <Icon
        style={{ padding: 15, color: "#848484" }}
        name={"account-circle"}
        size={25}
        onPress={() => {
          navigation.navigate("ChildPincode", {
            prevScreenTitle: "My Routines",
          });
        }}
      />
    ),
  });

  constructor(props) {
    super(props);
    const { navigate } = this.props.navigation;
    this.navigate = navigate;
    this.state = {
      child: null,
      loaded: false,
      routineId: this.props.navigation.state.params.routineId,
      routineTime: this.props.navigation.state.params.routineTime,
      routineName: this.props.navigation.state.params.routineName,
      activities: this.props.navigation.state.params.activities,
      rewards: this.props.navigation.state.params.rewards,
    };

    this.getChild();
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

  renderStars() {
    let star = [];

    for (let i = 0; i < this.state.activities; i++) {
      star.push(<Image source={Star} style={{ margin: 10 }} />);
    }
    return star;
  }

  render() {
    let time = this.state.routineTime.split(":");
    let hours = time[0];
    console.log(hours);
    let ampm = "AM";
    if (hours > 11) ampm = "PM";
    hours = hours % 12 || 12;

    if (this.state.loaded) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}> Start {this.state.routineName}</Text>
          <Text style={styles.section}>
            {" "}
            Good morning, {this.state.child.first_name}! It’s{" "}
            {hours + ":" + time[1] + " " + ampm} and that means it’s time to
            start your {this.state.routineName}! Complete the routine to earn{" "}
            {this.state.activities} stars and win {this.state.rewards} exciting
            rewards :){" "}
          </Text>
          <View style={styles.image}>{this.renderStars()}</View>
          <Image source={Wave} style={{ margin: 10, marginLeft: 50 }} />
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => {
              this.navigate("ChildActivity", {
                prevScreenTitle: "My Routines",
                currentRoutine: this.state.routineName,
                routineId: this.state.routineId,
              });
            }}
          >
            <Text style={styles.textStyle}>Start Routine!</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return <AppLoading />;
    }
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
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
  title: {
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 8,
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
};
