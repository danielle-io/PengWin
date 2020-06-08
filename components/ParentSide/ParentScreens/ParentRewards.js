import React, { Component } from "react";
import { ScrollView, Dimensions, StyleSheet, View, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RaisedTextButton } from "react-native-material-buttons";
import {
  MenuProvider,
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  optionsRenderer,
  Popover,
} from "react-native-popup-menu";
import Environment from "../../../database/sqlEnv";
const { width: WIDTH } = Dimensions.get("window");

export default class ParentRewards extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Rewards",
    prevScreenTitle: "Testing Home Page",
  });

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      secondLoaded: false,
      userId: 1,
      allRewards: null,
      allActivities: null,
      allActivitiesDictionary: null,
      rewardToDelete: null,
    };
  }

  _renderPage = (props) => (
    <TabViewPage {...props} renderScene={this._renderScene} />
  );

  async componentDidMount() {
    this.props.navigation.addListener("didFocus", (payload) => {
      this.getAllRewardsForUser();
    });
  }

  getRoutines() {
    fetch(Environment + "/getRoutinesByUser/" + this.state.userId, {
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((routines) => {
        this.setState({ results: routines });
        this.setState({ loaded: true });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //gets all the rewards for a possible user
  getAllRewardsForUser() {
    fetch(Environment + "/getAllRewards/" + this.state.userId, {
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((results) => {
        this.setState({ allRewards: results });
        this.setState({ loaded: true });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  deleteItem(r) {
    this.updateReward(r, "deleted", 1);
  }

  updateReward(rewardId, tag, value) {
    var data = {
      [tag]: value,
    };
    let response = fetch(Environment + "/updateReward" + rewardId, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((results) => {
      this.setState({ loaded: false });

      this.getAllRewardsForUser();

      if (this.state.loaded) {
        this.displayRewards();
      }
    });
  }

  displayRewards() {
    const { navigate } = this.props.navigation;
    return this.state.allRewards.map((item) => {
      //want to map across each reward name in allRewardNames
      return (
        <View style={styles["routineContainer"]}>
          <MenuProvider>
            <View style={styles.routineTitleAndMenu}>
              <Text style={styles.routineTitle}> {item.reward_name}</Text>
              <Menu style={styles.routineMenuStyling}>
                <MenuTrigger style={styles.ellipsis} text="..." />
                <MenuOptions>
                  <MenuOption
                    onSelect={() =>
                      this.props.navigation.navigate("EditReward", {
                        prevScreenTitle: "Rewards",
                        rewardId: item.reward_id,
                        rewardName: item.reward_name,
                        rewardImage: item.reward_image,
                        rewardVideo: item.reward_video,
                        rewardDescription: item.reward_description,
                        deleted: 0,
                      })
                    }
                  >
                    <Text style={{ color: "black" }}>Edit</Text>
                  </MenuOption>

                  <MenuOption onSelect={() => this.deleteItem(item.reward_id)}>
                    <Text style={{ color: "red" }}>Delete</Text>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            </View>
          </MenuProvider>
        </View>
      );
    });
  }

  render() {
    let ripple = { id: "addButton" };
    const { navigate } = this.props.navigation;

    return (
      <ScrollView style={{ backgroundColor: "#FFFCF9", padding: 10 }}>
        <View>
          {this.state.loaded && (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {this.displayRewards()}
            </View>
          )}

          {/* New Rewards Container */}
          <View style={styles.routineContainer}>
            <View style={{ flex: 1 }}>
              <RaisedTextButton
                style={styles.roundAddButton}
                title="+"
                color="#FF6978"
                onPress={
                  (this._onPress,
                  () =>
                    navigate("EditReward", {
                      prevScreenTitle: "Rewards",
                      currentRoutineName: null,
                      currentRoutineId: null,
                      currentRoutineStartTime: null,
                      currentRoutineEndTime: null,
                      currentRoutineApproval: 0,
                      rewardId: null,
                      rewardName: null,
                      rewardDescription: null,
                      rewardImage: null,
                      rewardVideo: null,
                    }))
                }
                ripple={ripple}
              />

              <Text style={styles.routineTitle}>Add a Reward</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

//Routines style sheet
const styles = StyleSheet.create({
  pageDescription: {
    marginTop: 30,
    fontSize: 20,
    textAlign: "center",
  },
  topContainer: {
    zIndex: 999,
  },
  routineTitleAndMenu: {
    flexDirection: "row",
    flex: 1,
    overflow: "visible",
  },
  ellipsis: {
    flexDirection: "row",
    alignSelf: "flex-end",
    fontSize: 30,
    marginRight: 10,
    overflow: "visible",
  },
  routineTitle: {
    marginLeft: 4,
    marginTop: 2,
    fontSize: 14,
    textAlign: "center",
    flex: 1,
  },
  routineMenuStyling: {
    overflow: "visible",
    zIndex: 999,
  },
  routineContainer: {
    width: WIDTH * 0.3,
    height: 150,
    marginTop: 14,
    marginBottom: 5,
    justifyContent: "space-around",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "black",
    shadowOpacity: 0.1,
    borderWidth: 0,
    paddingTop: 10,
    overflow: "visible",
    marginLeft: 10,
    marginRight: 10,
  },
  roundAddButton: {
    marginLeft: 6,
    fontSize: 30,
    height: 50,
    minWidth: 50,
    width: 50,
    borderRadius: 50,
    color: "#FFFFFF",
  },
  text: {
    marginTop: 7,
    fontSize: 24,
    textAlign: "center",
    height: 100,
  },
  subtext: {
    marginTop: -40,
    fontSize: 20,
    textAlign: "center",
    textAlignVertical: "auto",
    width: 220,
    marginBottom: 25,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
