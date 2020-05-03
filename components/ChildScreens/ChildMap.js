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
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
Icon.loadFont();
export default class ChildMap extends Component {
  constructor() {
    // User ID hard coded for now
    super();
    this.state = {};
  }

  render() {
    //TODO: Figure out how this page looks
    return (
      <View>
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
          <TouchableOpacity style={styles.titles}>
            <Text>Donuts</Text>
          </TouchableOpacity>

          <Image
            source={Road}
            style={{
              width: WIDTH * 0.5,
              height: HEIGHT * 0.7,
              resizeMode: "contain",
            }}
          />

          <Image
            source={Star}
            style={{
              width: 100,
              height: 100,
              top: -180,
              right: -200,
              resizeMode: "contain",
            }}
          />

          <Image
            source={Star}
            style={{
              width: 100,
              height: 100,
              top: -500,
              right: 200,
              resizeMode: "contain",
            }}
          />

          <Image
            source={Star}
            style={{
              width: 100,
              height: 100,
              top: -750,
              right: -200,
              resizeMode: "contain",
            }}
          />

          <Image
            source={Star}
            style={{
              width: 100,
              height: 100,
              top: -975,
              right: 190,
              resizeMode: "contain",
            }}
          />

          <TouchableOpacity style={styles.titles2}>
            <Text>Morning Routine</Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity style={styles.button}>
              <Text>Back To Rewards</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
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
    top: 20,
    zIndex: 1,
  },
  titles2: {
    height: 60,
    width: 300,
    backgroundColor: "white",
    borderColor: "blue",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    top: -450,
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