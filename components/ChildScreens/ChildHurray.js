import React, { Component } from "react";
import { Dimensions, Text, View, TouchableOpacity, Image } from "react-native";

import { Video } from "expo-av";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
Icon.loadFont();

import Hurray from "../../assets/images/hurray.gif";

import Environment from "../../database/sqlEnv";
import UserInfo from "../../state/UserInfo";
import { AppLoading } from "expo";
import { ScrollView } from "react-native-gesture-handler";
import { throwIfAudioIsDisabled } from "expo-av/build/Audio/AudioAvailability";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

export default class ChildActivityReward extends Component {
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
      activityId: this.props.navigation.state.params.activityId,
      length: this.props.navigation.state.params.length,
      key: this.props.navigation.state.params.key,
      child: null,
      loaded: false,
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

  render() {
    if (this.state.loaded) {
      return (
        <ScrollView>
          <View style={styles.container}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 100,
              }}
            >
              <Text style={{ fontSize: 40 }}>
                Good job {this.state.child.first_name}! You did it!
              </Text>

              <Image source={Hurray} style={{ margin: 10, marginLeft: 50 }} />
            </View>

            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => {
                this.navigate("ChildActivityReward", {
                  activityId: this.state.activityId,
                  length: this.state.length,
                  key: this.state.key,
                });
              }}
            >
              <Text style={styles.textStyle}>What's My Reward?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    height: HEIGHT,

    top: -20,
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
