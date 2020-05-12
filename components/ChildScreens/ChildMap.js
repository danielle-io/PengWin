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

import UserInfo from "../../state/UserInfo";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
const parentId = UserInfo.parent_id;
const childId = UserInfo.child_id;
const userId = UserInfo.user_id;

Icon.loadFont();

export default class ChildMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.navigation.state.params.title,
      amt: this.props.navigation.state.params.amt,
      reward: this.props.navigation.state.params.reward,
    };
  }
 

  static navigationOptions = ({ navigation }) => ({
    title: "My Rewards",
  });

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
              right: WIDTH * 0.3 + (i*20),
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
              right: WIDTH * 0.6  - (i*20),
              resizeMode: "contain",
            }}
          />
        );
      }
    }

    return star;
  }

  render() {
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
            <Text>{this.state.reward}</Text>
          </View>

          <Image
            source={Road}
            style={{
              top: -200,
              marginTop: 100,
              width: WIDTH ,
              height: HEIGHT ,
              resizeMode: "contain",
              zIndex: -10,
              position:'relative'
              
            }}
          />

          {this.stars()}

          <View style={styles.titles2}>
            <Text>{this.state.title}</Text>
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
              <Text>Back To Rewards</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                this.props.navigation.navigate("ChildActivity", {
                  prevScreenTitle: "My Map",
                  currentRoutine: this.state.title,
                  userID: userId,
                })
              }
            >
              <Text>Start Routine</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
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
};
