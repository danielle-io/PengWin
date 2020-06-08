import React, { Component } from "react";
import {
  ScrollView,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Head from "../../assets/images/rewardPenguin.png";
import Star from "../../assets/images/roadStar.png";
import Road from "../../assets/images/RoadMap.png";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import * as Font from "expo-font";

import { AppLoading } from "expo";

import UserInfo from "../../state/UserInfo";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
const parentId = UserInfo.parent_id;
const childId = UserInfo.child_id;
const userId = UserInfo.user_id;

Icon.loadFont();

let customFonts = {
  Gaegu: require("../../assets/fonts/Gaegu/Gaegu-Bold.ttf"),
};

export default class ChildMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.navigation.state.params.title,
      amt: this.props.navigation.state.params.amt,
      reward: this.props.navigation.state.params.reward,
      routineId: this.props.navigation.state.params.routineId,

      currentRoutine: this.props.navigation.state.params.currentRoutine,
      routineId: this.props.navigation.state.params.routineId,
      rewardId: this.props.navigation.state.params.rewardId,
      requiresApproval: this.props.navigation.state.params.requiresApproval,
      amountOfActivities: this.props.navigation.state.params.amountOfActivities,
      routineName: this.props.navigation.state.params.routineName,
      activities: this.props.navigation.state.params.activities,
      rewards: this.props.navigation.state.params.rewards,
      routineTime: this.props.navigation.state.params.routineTime,
      fontsLoaded: false,
    };
  }

  static navigationOptions = ({ navigation }) => ({
    title: "My Rewards",
  });

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  async componentDidMount() {
    this._loadFontsAsync();
  }

  stars() {
    star = [];
    for (let i = 0; i < this.state.amt; i++) {
      if (i % 2 === 0) {
        star.push(
          <Image
            source={Star}
            style={{
              position: "absolute",
              width: 100,
              height: 100,
              bottom: 500 + HEIGHT * 0.6 * (i / this.state.amt),
              right: WIDTH * 0.3 + i * 20,
              resizeMode: "contain",
            }}
          />
        );
      } else {
        star.push(
          <Image
            source={Star}
            style={{
              position: "absolute",
              width: 100,
              height: 100,
              bottom: 500 + HEIGHT * 0.6 * (i / this.state.amt),
              right: WIDTH * 0.6 - i * 20,
              resizeMode: "contain",
            }}
          />
        );
      }
    }

    return star;
  }

  render() {
    if (this.state.fontsLoaded) {
      return (
        <View style={{ backgroundColor: "#2ca3ca", height: HEIGHT }}>
          <View
            style={{
              shadowColor: "grey",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.4,
              shadowRadius: 2,
              width: WIDTH,
              top: 0,
              left: 0,
              backgroundColor: "white",
              paddingBottom: 10,
              flexDirection: "row",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <Image source={Head} style={{ width: 140, height: 115 }} />
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={styles.titles}>
              <Text style={styles.text}>{this.state.reward}</Text>
            </View>

            <Image
              source={Road}
              style={{
                top: -200,
                marginTop: 100,
                width: WIDTH,
                height: HEIGHT,
                resizeMode: "cover",
                zIndex: -10,
                position: "relative",
              }}
            />

            {this.stars()}

            <View style={styles.titles2}>
              <Text style={styles.text}>{this.state.title}</Text>
            </View>
            <View
              style={{
                bottom: -HEIGHT * 0.08,
                position: "absolute",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  this.props.navigation.navigate("ChildRewards", {
                    prevScreenTitle: "My Map",
                  })
                }
              >
                <Text style={styles.text}>Back To Rewards</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  this.props.navigation.navigate("ChildStartActivity", {
                    prevScreenTitle: "My Routines",
                    currentRoutine: this.state.title,
                    routineId: this.state.routineId,
                    routineName: this.state.routineName,
                    activities: this.state.activities,
                    rewards: this.state.rewards,
                    rewardId: this.state.rewardId,
                    requiresApproval: this.state.requiresApproval,
                    amountOfActivities: this.state.amountOfActivities,
                    routineTime: this.state.routineTime
                  })
                }
              >
                <Text style={styles.text}>Start Routine</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    } else {
      return <AppLoading />;
    }
  }
}

styles = {
  titles: {
    height: 60,
    width: 300,
    backgroundColor: "white",
    borderColor: "blue",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    top: 80,
    zIndex: 1,
  },
  titles2: {
    top: -500,
    height: 60,
    width: 300,
    backgroundColor: "white",
    borderColor: "blue",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    height: 60,
    width: 300,
    backgroundColor: "#B1EDE8",
    borderColor: "blue",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    top: -430,
    marginLeft: 50,
    marginRight: 50,
  },
  text: {
    fontFamily: "Gaegu",
    fontSize: 20,
  },
};
