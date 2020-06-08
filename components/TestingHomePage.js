// This page is esentially our Link Tree to test pages
import React, { Component } from "react";
import { Text, View, ScrollView, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Dimensions } from "react-native";

import UserInfo from "../state/UserInfo";

const { width: WIDTH } = Dimensions.get("window");
const parentId = UserInfo.parent_id;
const childId = UserInfo.child_id;
const userId = UserInfo.user_id;
const pincode = UserInfo.pincode;

export default class TestingHomePage extends Component {
  constructor(props) {
    super(props);
    const { navigate } = this.props.navigation;
    this.navigate = navigate;
  }

  static navigationOptions = {
    title: "TestingHomePage",
    headerShown: false,
    headerVisible: false,
  };

  async componentDidMount() {
    this.getRoutines();
  }

  checkAmounts(routines) {
    routines.routines.map((item) => {
      this.getRewardAmount(
        item.routine_id,
        item.amount_of_rewards,
        item.reward_id
      );
      this.checkActivityAmount(item.routine_id, item.amount_of_activities);
    });
  }

  getRewardAmount(routineId, rewardAmount, rewardId) {
    fetch(Environment + "/joinRoutineActivityTableByRoutineId/" + routineId)
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((activities) => {
        this.compareRewardAmount(routineId, rewardAmount, rewardId, activities);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  compareRewardAmount(routineId, rewardAmount, rewardId, activities) {
    var rewardCount = 0;
    for (var i = 0; i < activities.length; i++) {
      if (
        activities[i].reward_image ||
        activities[i].reward_video ||
        activities[i].reward_description
      ) {
        rewardCount += 1;
      }
    }
    if (rewardId) {
      rewardCount += 1;
    }
    if (rewardCount !== rewardAmount) {
      this.updateRoutineWithoutReload(
        routineId,
        "amount_of_rewards",
        rewardCount
      );
      this.state.routineRewardAmountDict[routineId] = rewardCount;
    } else {
      this.state.routineRewardAmountDict[routineId] = rewardAmount;
    }
  }

  updateRoutine(routineId, tag, value) {
    var data = {
      [tag]: value,
    };
    {
      let response = fetch(Environment + "/updateRoutine/" + routineId, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          return responseJson;
        })
        .then((routineResults) => {});
    }
  }

  getRoutines() {
    fetch(Environment + "/getRoutinesByUser/" + userId, {
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((routineResults) => {
        this.checkAmounts(routineResults);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const chartConfig = {
      backgroundGradientFrom: "#1E2923",
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: "#08130D",
      backgroundGradientToOpacity: 0.5,
      color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
      strokeWidth: 2, // optional, default 3
      barPercentage: 0.5,
      useShadowColorFromDataset: false, // optional
    };

    let ripple = { id: "submitButton" };
    return (
      <View>
        <ScrollView>
          <View style={styles.containerFull}>
            <View
              style={{
                flex: 1,
                justifyContent: "space-around",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              <TouchableOpacity
                style={styles.parentContainer}
                onPress={() =>
                  this.navigate("ParentNavigation", {
                    initialRouteName: "ParentRoutines",
                  })
                }
              >
                <Text style={styles.linkText}>Parent Navigation Page</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.parentContainer}
                onPress={() =>
                  this.navigate("PublicActivities", {
                    prevScreenTitle: "ParentNavigation",
                    initialRouteName: "PublicActivities",
                  })
                }
              >
                <Text style={styles.linkText}>Public Activities</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.parentContainer}
                onPress={() =>
                  this.navigate("Notifications", {
                    prevScreenTitle: "TestingHomePage",
                    initialRouteName: "Notifications",
                  })
                }
              >
                <Text style={styles.linkText}>Notifications</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.parentContainer}
                onPress={() =>
                  this.navigate("ParentProfile", {
                    prevScreenTitle: "TestingHomePage",
                  })
                }
              >
                <Text style={styles.linkText}>Parent's Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.parentContainer}
                onPress={() =>
                  this.navigate("ParentRewards", {
                    prevScreenTitle: "TestingHomePage",
                  })
                }
              >
                <Text style={styles.linkText}>Parent Rewards Page</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.parentContainer}
                onPress={() =>
                  this.navigate("Questionnaire", {
                    prevScreenTitle: "TestingHomePage",
                  })
                }
              >
                <Text style={styles.linkText}>Parent Questionnaire</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.parentContainer}
                onPress={() =>
                  this.navigate("Progress", {
                    prevScreenTitle: "TestingHomePage",
                  })
                }
              >
                <Text style={styles.linkText}>Parent Progress Page</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flex: 1,
                justifyContent: "space-around",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              <TouchableOpacity
                style={styles.childContainer}
                onPress={() =>
                  this.navigate("ChildRoutines", { prevScreenTitle: "Login" })
                }
              >
                <Text style={styles.linkText}>Child Routines</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.childContainer}
                onPress={() =>
                  this.navigate("ChildRewards", { prevScreenTitle: "Login" })
                }
              >
                <Text style={styles.linkText}>Child Reward</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.childContainer}
                onPress={() =>
                  this.navigate("ChildHurray", {
                    activityId: 1,
                    key: 2,
                    length: 3,
                  })
                }
              >
                <Text style={styles.linkText}>Child Activity Reward</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.childContainer}
                onPress={() =>
                  this.navigate("ChildNotifScreen", {
                    prevScreenTitle: "Login",
                  })
                }
              >
                <Text style={styles.linkText}>Child Push Notif</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flex: 1,
                justifyContent: "space-around",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  this.navigate("Login", { prevScreenTitle: "TestingHomePage" })
                }
                style={styles.otherContainer}
              >
                <Text style={styles.linkText}>Login Page</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.otherContainer}
                onPress={() =>
                  this.navigate("SignUp", { prevScreenTitle: "Login" })
                }
              >
                <Text style={styles.linkText}>Sign Up Page</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: "15%",
    textAlign: "center",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
  },
  myText: {
    fontSize: hp("5%"), 
  },
  containerFull: {
    marginTop: 200,
    marginLeft: 50,
    marginRight: 50,
  },
  parentContainer: {
    width: 180,
    height: 80,
    backgroundColor: "powderblue",
    marginLeft: 30,
    marginRight: 30,
    borderWidth: 2,
    borderRadius: 20,
    marginBottom: "10%",
  },
  childContainer: {
    textAlign: "center",
    backgroundColor: "#fef3bd",
    width: 180,
    height: 80,
    marginLeft: 30,
    marginRight: 30,
    borderWidth: 2,
    borderRadius: 20,
    marginBottom: "5%",
    marginTop: "10%",
  },
  otherContainer: {
    backgroundColor: "#dba9d7",
    width: 180,
    height: 80,
    marginLeft: 30,
    marginRight: 30,
    borderWidth: 2,
    borderRadius: 20,
    marginBottom: "10%",
  },
  testingh1: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 20,
    marginBottom: 40,
    paddingTop: 40,
  },
  testingh2: {
    textAlign: "center",
    justifyContent: "center",
    fontSize: 25,
    fontWeight: "bold",
  },
  linkText: {
    fontSize: 20,
    alignContent: "center",
    textAlignVertical: "center",
    textAlign: "center",
    color: "black",
    marginBottom: 5,
    marginTop: 5,
  },
});
