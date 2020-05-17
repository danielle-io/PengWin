import React, { Component } from "react";
import { Dimensions, Text, View, TouchableOpacity, Image } from "react-native";

import { Video } from "expo-av";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
Icon.loadFont();

import Star from "../../assets/images/Star.png";
import StarFill from "../../assets/images/fillstar.png";

import Environment from "../../database/sqlEnv";
import UserInfo from "../../state/UserInfo";
import { AppLoading } from "expo";
import { ScrollView } from "react-native-gesture-handler";

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
      key: this.props.navigation.state.params.key + 1,
      activity: null,
      loaded: false,
    };
    this.getActivity();
  }

  getActivity() {
    const parentId = UserInfo.parent_id;
    const childId = UserInfo.child_id;
    const userId = UserInfo.user_id;

    fetch(Environment + "/getActivityById/" + this.state.activityId, {
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
          this.setState({ activity: item });
          this.setState({ loaded: true });
          console.log("MY ACTIVITY ")
          console.log(item);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  renderStars() {
    let star = [];

    for (let i = 0; i < this.state.length; i++) {
      if (i < this.state.key) {
        star.push(<Image source={StarFill} style={{ margin: 10 }} />);
      } else {
        star.push(<Image source={Star} style={{ margin: 10 }} />);
      }
    }

    return star;
  }

  renderText() {
    if(this.state.key === this.state.length)
    {
      return (
        <Text style={styles.title}>
        Wow you just completed your routine!!
      </Text>
      )
    }
    else if(this.state.key == 1)
    {
      return (
        <Text style={styles.title}>
        You got a star for completing your activity!
      </Text>
      )
    }
    else
    {
      return (
        <Text style={styles.title}>
        You got {(this.state.key)} stars for completing your activity!
      </Text>
      )
    }
  }

  renderButton() {
    if(this.state.key === this.state.length)
    {
      return (
        <Text style={styles.textStyle}>What's My Reward?</Text>
      )
    }
    else
    {
      return (
        <Text style={styles.textStyle}>Next Task!</Text>
      )
    }
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
              <View style={styles.image}>{this.renderStars()}</View>
          {this.renderText()}
            </View>
            {this.state.activity.reward_image && (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: this.state.activity.reward_image }}
                  style={{
                    width: WIDTH * 0.6,
                    height: WIDTH * 0.3,
                    marginBottom: 50,
                    borderRadius: 15,
                    resizeMode: "contain",
                  }}
                />
              </View>
            )}

            {this.state.activity.reward_video && (
              <View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Video
                    useNativeControls={true}
                    source={{ uri: this.state.activity.reward_video }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="contain"
                    isLooping
                    style={{ width: WIDTH * 0.7, height: WIDTH * 0.3 }}
                  />
                </View>
              </View>
            )}

            {this.state.activity.reward_description && (
              <View>
                <Text style={styles.section}>
                  {this.state.activity.reward_description}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => {
                this.navigate("ChildActivity", {});
              }}
            >
              {this.renderButton()}
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
