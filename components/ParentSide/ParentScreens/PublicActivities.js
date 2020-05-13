// TODO: move activitites page and tab over to allActivitiesDictionary
// rather than allActivities
import React, { Component } from "react";
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RaisedTextButton } from "react-native-material-buttons";
import {
  MenuProvider,
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import MaterialTabs from "react-native-material-tabs";
import Dialog, { DialogContent } from "react-native-popup-dialog";
import SearchableDropdown from "react-native-searchable-dropdown";
import { AppLoading } from "expo";

import Environment from "../../../database/sqlEnv";
import UserInfo from "../../../state/UserInfo";

const { width: WIDTH } = Dimensions.get("window");
const parentId = UserInfo.parent_id;
const childId = UserInfo.child_id;
const userId = UserInfo.user_id;
const pincode = UserInfo.pincode;

Icon.loadFont();

export default class PublicActivities extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Routines",
    prevScreenTitle: "Routines",
    activeTab: 2,
  });

  constructor() {
    super();
    this.state = {
      activitiesLoaded: false,
    };
  }

  async componentDidMount() {
    await this.props.navigation.addListener("didFocus", (payload) => {
      this.getAllPublicActivities();
    });
  }

  getAllPublicActivities() {
    fetch(Environment + "/getAllPublicActivities/" + userId, {
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((results) => {
        this.setState({ allActivities: results });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  displayActivities() {
    const { navigate } = this.props.navigation;

    return this.state.allActivities.map((item) => {
      return (
        <View style={styles.routineContainer}>
          <View style={styles.routineTitleAndMenu}>
            <Text style={styles.routineTitle}> {item.activity_name}</Text>
            <MenuProvider>
              <Menu style={styles.routineMenuStyling}>
                <MenuTrigger style={styles.ellipsis} text="..." />
                <MenuOptions>
                  <MenuOption
                    onSelect={() =>
                      navigate("ViewPublicActivity", {
                        prevScreenTitle: "PublicActivities",
                        activityName: item.activity_name,
                        activityId: item.activity_id,
                        activityTags: eval(item.tags),
                        activityImagePath: item.image_path,
                        activityDescription: item.activity_description,
                        activityAudioPath: item.audio_path,
                        activityVideoPath: item.video_path,
                      })
                    }
                  >
                    <Text style={{ color: "black" }}>Edit</Text>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            </MenuProvider>
          </View>
        </View>
      );
    });
  }

  render() {
    if (this.state.results !== null) {
      //  console.log(this.state.results);
    } else {
      console.log("this.state.results is null :( ");
    }

    let ripple = { id: "addButton" };
    const { navigate } = this.props.navigation;

    return (
      <View>
        {this.state.activitiesLoaded && (
          <View>
            <ScrollView>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {this.displayActivities()}
              </View>
            </ScrollView>
          </View>
        )}
        <View>
          <View style={{ marginTop: 100 }} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // RoutinesPage
  topContainer: {
    zIndex: 999,
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
  dialog: {
    backgroundColor: "#e1d8ff",
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
  routineDetailsIcon: {
    color: "#355C7D",
    fontSize: 14,
  },
  routineDetails: {
    fontSize: 12,
    zIndex: 2,
  },
  routineDetailsPreview: {
    zIndex: 2,
    marginBottom: 10,
    marginLeft: 5,
  },
  routineContainer: {
    width: WIDTH * 0.3,
    height: 150,
    marginTop: 20,
    marginBottom: 5,
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
  inactiveRoutineContainer: {
    width: WIDTH * 0.3,
    height: 150,
    marginTop: 20,
    marginBottom: 5,
    justifyContent: "space-around",
    borderRadius: 10,
    backgroundColor: "#d3d3d3",
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
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
