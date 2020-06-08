import React, { Component } from "react";
import {
  View,
  Dimensions,
  Image,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { RaisedTextButton } from "react-native-material-buttons";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// Icon.loadFont();

import Environment from "../../../database/sqlEnv";
import Star from "../../../assets/images/Star.png";
import StarFill from "../../../assets/images/fillstar.png";

import UserInfo from "../../../state/UserInfo";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
const childId = UserInfo.child_id;

export default class CheckOffRoutine extends Component {
  constructor(props) {
    super(props);
    const { navigate } = this.props.navigation;
    this.navigate = navigate;
    this.state = {
      currentRoutine: this.props.navigation.state.params.currentRoutine,
      routineId: this.props.navigation.state.params.routineId,
      rewardId: this.props.navigation.state.params.rewardId,
      routineName: this.props.navigation.state.params.routineName,
      prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
      childsName: this.props.navigation.state.params.childsName,
      finalRewardId: this.props.navigation.state.params.finalRewardId,
      currentNotification: this.props.navigation.state.params
        .currentNotification,
      rewardLoaded: false,
      reward: null,
    };
    CheckOffRoutine.navigationOptions.headerBackTitle = "Notifications"

  }

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.routineName}`,
    prevScreenTitle: "Notifications",
    headerBackTitle:  "Notifications",
    routerBack: "Notifications", 
  });

  componentDidMount() {
    if (this.state.finalRewardId) {
      this.getFinalReward();
    } else {
      this.setState({ rewardLoaded: true });
    }
  }

  getFinalReward() {
    fetch(Environment + "/getRewardById/" + this.state.finalRewardId, {
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((rewardResult) => {
        this.setState({ reward: rewardResult[0] });
        console.log("reward is below");
        console.log(rewardResult);
        this.setState({ rewardLoaded: true });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  evaluateRoutineNotification(value) {
    var data = {
      is_approved: value,
      is_evaluated: 1,
    };
    this.updateChildNotification(data);
  }

  updateChildNotification(data) {
    const { navigate } = this.props.navigation;
    let response = fetch(
      Environment +
        "/updateChildNotificationsTable/" +
        this.state.currentNotification.child_notifications_id,
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
        console.log(results);
         this.props.navigation.navigate("Notifications", {
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  displayPage() {
    let ripple = { id: "addButton" };

    return (
      <View style={{backgroundColor: "#FFFCF9", height: "100%"}}>
        <ScrollView style={{backgroundColor: "#FFFCF9"}}>
          <View
            style={{
              justifyContent: "center",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            <Text style={styles.titles}>Check Off Routine? </Text>
          </View>

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              paddingLeft: "15%",
              paddingRight: "15%",
            }}
          >
            <Text style={styles.subtext}>
              {"Would you like to approve "}
              {this.state.childsName}
              {"'s "}
              {this.state.routineName}
              {" completion to let them claim their reward?"}
            </Text>
          </View>

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                marginTop: 30,
                marginBottom: 10,
              }}
            >
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => {
                  this.evaluateRoutineNotification(1);
                }}
              >
                <Text style={styles.buttonText}>Approve</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => {
                  this.evaluateRoutineNotification(0);
                }}
              >
                <Text style={styles.buttonText}>Deny</Text>
              </TouchableOpacity>
            </View>

            {/* Show final reward */}
            {this.state.finalRewardId && (
              <View
                style={{
                  justifyContent: "center",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.titleSubtext}>Final Reward</Text>

                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    paddingLeft: "15%",
                    paddingRight: "15%",
                    marginBottom: 12,
                  }}
                >
                  <Text style={styles.subtext}>
                    {this.state.childsName}
                    {
                      "  will receive the reward chosen by you for completing the "
                    }
                    {this.state.routineName}
                    {" routine"}
                  </Text>
                </View>

                {this.state.reward.reward_image && (
                 
                 <View style={styles.rewardImageContainer}>
                    <Image
                      source={{ uri: this.state.reward.reward_image }}
                      style={{
                        width: 350,
                        height: 250,
                        margin: 5,
                        borderRadius: 15,
                        resizeMode: "contain",
                      }}
                    />
                  </View>
                )}
                {this.state.reward.reward_description && (
                  <View style={styles.rewardImageContainer}>
                    <Text style={styles.rewardDescriptionText}>
                      {this.state.reward.reward_description}
                    </Text>
                  </View>
                )}
                {this.state.reward.reward_video && (
                  <View>
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 15,
                      }}
                    >
                      <Video
                        useNativeControls={true}
                        source={{ uri: this.state.reward.reward_video }}
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
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  render() {
    return (
      <View style={{backgroundColor: "#FFFCF9"}}>
        {this.state.rewardLoaded && <View>{this.displayPage()}</View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonText: {
    color: "#FF6978",
    textAlign: "center",
    fontWeight: "500",
    fontSize: 16,
  },
  text: {
    marginTop: 7,
    fontSize: 24,
    textAlign: "center",
    height: 100,
  },
  activityName: {
    marginTop: 20,
    marginBottom: 14,
    fontSize: 24,
    fontWeight: "700",
    paddingHorizontal: 20,
  },
  rewardDescriptionText: {
    fontSize: 18,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    margin: 30,
  },
  image: {
    flexDirection: "row",
    flexWrap: "wrap",
    margin: 30,
  },
  subtext: {
    fontSize: 22,
    marginTop: 8,
  },
  titleSubtext:{
    fontSize: 22,
    marginTop: 8,
    marginBottom: 12,
    fontWeight: "bold",

  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  buttonStyle: {
    marginLeft: "5%",
    marginRight: "5%",
    width: 200,
    padding: 10,
    margin: 20,
    backgroundColor: "#ffffff",
    borderRadius: 100,
    textAlign: "center",
    borderColor: "#FF6978",
    borderWidth: 1,
  },
  imageContainer: {
    marginRight: 44,
    marginTop: 30,
    width: 290,
    height: 290,
    backgroundColor: "white",
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  titles: {
    // fontWeight: "bold",
    fontSize: 24,
    padding: 5,
    textAlign: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 14,
    fontWeight: "500",
    paddingHorizontal: 20,
  },
  rewardImageContainer: {
    marginTop: 30,
    width: 250,
    height: 250,
    backgroundColor: "white",
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
});
