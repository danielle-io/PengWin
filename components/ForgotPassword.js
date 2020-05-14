// TODO: move activitites page and tab over to allActivitiesDictionary
// rather than allActivities
import React, { Component } from "react";
import {
  Button,
  Dimensions,
  Picker,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RaisedTextButton } from "react-native-material-buttons";
import { OutlinedTextField, TextField } from "react-native-material-textfield";
import {
  MenuProvider,
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import MaterialTabs from "react-native-material-tabs";
import { Dropdown } from "react-native-material-dropdown";
import Dialog, { DialogContent, DialogFooter } from "react-native-popup-dialog";
import SearchableDropdown from "react-native-searchable-dropdown";
import { AppLoading } from "expo";
import Tags from "react-native-tags";

import Environment from "../database/sqlEnv";
import UserInfo from "../state/UserInfo";

const { width: WIDTH } = Dimensions.get("window");
const parentId = UserInfo.parent_id;
const childId = UserInfo.child_id;
const userId = UserInfo.user_id;
const pincode = UserInfo.pincode;

Icon.loadFont();

export default class ForgotPassword extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Routines",
    prevScreenTitle: "Routines",
    activeTab: 2,
  });

  constructor() {
    super();
    this.state = {
      containerNames: null,
      containerDict: null,
      containerRoutineDict: null,
      selectedColor: null,
      newContainerName: null,
      routines: null,
      routinesLoaded: false,
      selectedContainer: null,
    };
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
        this.setState({ routines: routineResults });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getContainersPerRoutines() {
    fetch(Environment + "/getContainersPerRoutines/" + userId, {
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((containerRoutineResults) => {
        console.log(containerRoutineResults);
        this.storeContainerRoutineInfo(containerRoutineResults);
        this.displayRoutines();

      })
      .catch((error) => {
        console.error(error);
      });
  }

  getContainers() {
    fetch(Environment + "/getContainers/" + userId, {
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((containerResults) => {
        console.log(containerResults);
        this.storeContainerInfo(containerResults);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  updateRoutineTagRelationship(containerRoutineId, tag, value) {
    var data = {
        [tag]: value,
    };
    {
      let response = fetch(Environment + "/updateRoutineTagTable/" + containerRoutineId, {
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
        .then((results) => {
            this.setState({ routinesLoaded: false });
            this.getContainers();
            this.getRoutines();
        });
    }
  }

  insertToRoutineContainerTable(routineId) {
    var data = {
      container_id: this.state.selectedContainer,
      routine_id: routineId,
      deleted: 0,
      user_id: userId,
    };

    let response = fetch(
      Environment + "/insertContainerRoutineRelationship/",
      {
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
        .then((routineResults) => {
          this.setState({ routinesLoaded: false });
          this.getContainers();
          this.getRoutines();
        })
        .catch((error) => {
          console.error(error);
        });
  }

  insertNewContainer() {
    var data = {
      container_name: this.state.newContainerName.toLowerCase(),
      color: this.state.selectedColor,
      deleted: 0,
      user_id: userId,
    };

    let response = fetch(
      Environment + "/insertNewContainer/",
      {
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
        .then((routineResults) => {
          this.setState({ routinesLoaded: false });
          this.getContainers();
          this.getRoutines();
        })
        .catch((error) => {
          console.error(error);
        })
  }

//   Dictionary of key as routine id, then valie contains all the details
  storeContainerRoutineInfo(containerRoutineResults) {
    var tempContainerRoutineDict = {};
   
    for (var i = 0; i < containerRoutineResults.length; i++) {
      var containerId = containerRoutineResults[i].container_id;
      var contRoutineId = containerRoutineResults[i].conatiner_routine_id

      tempContainerRoutineDict[containerRoutineResults[i].routine_id] = {
        color: this.state.containerDict[containerId].color,
        name: this.state.containerDict[containerId].name,
        containerId: containerId,
        containerRoutineId: contRoutineId
      }
    }
    console.log("containerRoutineDict");
    console.log(tempContainerRoutineDict);

    this.setState({ containerRoutineDict: tempContainerRoutineDict });
    this.setState({ routinesLoaded: true });
  }

  setContainer(routineId) {
    console.log("IN SET CONTAINER " + routineId);

    if (this.state.selectedContainer) {
      this.insertToRoutineContainerTable(routineId);
    }
  }

  storeContainerInfo(containerResults) {
    var tempContainerDict = {};
    var tempContainerNamesArray = [];
    for (var i = 0; i < containerResults.length; i++) {
      tempContainerDict[containerResults[i].container_id] = {
        color: containerResults[i].color,
        name: containerResults[i].container_name,
      };
      tempContainerNamesArray.push({
        label: containerResults[i].container_name,
        value: containerResults[i].container_id,
      });
    }

    console.log("containerNames " + tempContainerNamesArray)
    this.setState({ containerNames: tempContainerNamesArray });
    this.setState({ containerDict: tempContainerDict });
    this.getContainersPerRoutines();
  }

  async componentDidMount() {
    await this.props.navigation.addListener("didFocus", (payload) => {
      this.getContainers();
      this.getRoutines();
    });
  }

  displayRoutines() {
    var containerName;

    return this.state.routines.routines.map((item) => {
      if (item.is_active === 0) {
        containerName = "inactiveRoutineContainer";
      } else {
        containerName = "routineContainer";
      }

      return (
        <View
          onStartShouldSetResponder={() => this.setContainer(item.routine_id)}
          style={styles[containerName]}
        >
          <View style={styles.routineTitleAndMenu}>
            <Text style={styles.routineTitle}> {item.routine_name}</Text>
          </View>

          <View style={styles.routineDetailsPreview}>
                       
            <View style={{ alignItems: "left" }}>
              <Text style={styles.routineDetails}>
                <Icon name="playlist-check" style={styles.routineDetailsIcon} />{" "}
                Activities: {item.amount_of_activities}{" "}
              </Text>
              <Text style={styles.routineDetails}>
                <Icon name="gift" style={styles.routineDetailsIcon} /> Rewards:{" "}
                {item.amount_of_rewards}{" "}
              </Text>
            </View>

            <View
            >
              {this.getRoutineTags(item)}
            </View>
          </View>
        </View>
      );
    });
  }

  deleteTag(routineId){
    var containerRoutineId = this.state.containerRoutineDict[routineId].containerRoutineId;
    this.updateRoutineTagRelationship(containerRoutineId, "deleted", 1)
  }

  selectedContainer(id){
      console.log(id);
      this.setState({ selectedContainer: id })
  }

  getRoutineTags(item) {
    if (item.routine_id in this.state.containerRoutineDict) {
      var colorClass =
        this.state.containerRoutineDict[item.routine_id].color + "Tag";

      return (
        <View
          style={{
            textAlign: "right",
            flexDirection: "row",
            alignSelf: "flex-end",
            alignItems: "flex-end",
            right: 0,
            justifyContent: 'flex-end'
            // position: "absolute",
          }}
        >
        <Tags
          textInputProps={{
            placeholder: "?TAGS",
          }}
          readonly={true}
          containerStyle={{ justifyContent: "center" }}
          inputStyle={{
            backgroundColor: "#FFFCF9",
            borderBottomColor: "#c4c4c4",
            borderBottomWidth: 1,
          }}
          initialTags={[this.state.containerRoutineDict[item.routine_id].name]}
          renderTag={({ tag, index, onPress, deleteTagOnPress, readonly }) => (
            <View style={styles[colorClass]}>
              <Text style={styles.text}>{tag} </Text>
              <TouchableOpacity
                onPress={() => {
                  this.deleteTag(item.routine_id)
                }}
                
                
                key={`${tag}-${index}`}
              />
            </View>
          )}
        />
        </View>
      );
    } else {
      return;
    }
  }

  saveNewContainer() {
      console.log(this.state.newContainerName);
      console.log(this.state.selectedColor);
        
    if (
      this.state.selectedColor !== null &&
      this.state.newContainerName !== null
    ) {
      this.insertNewContainer();
    }
  }

  renderPage() {
    let colors = [
      {
        value: "grey",
      },
      {
        value: "blue",
      },
      {
        value: "orange",
      },
    ];
    return (
      <View>
        <View>
          {this.state.routinesLoaded && (
            <View>
              <ScrollView>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                >
                  {this.displayRoutines()}
                </View>
              </ScrollView>
            </View>
          )}
        </View>

        <View style={(styles.descriptionBox, styles.textFields)}>
          <Text style={styles.titles}>Apply Routine Tags</Text>
          <Text style={styles.description}>
            To add a tag to a routine for easier organization, select the tag then click the
            container to apply it. Tags can be created below.
          </Text>

          <View style={{ flexDirection: "row" }}>
            <View style={styles.tagsContainer}>
              <Dropdown
                containerStyle={{ padding: 1, width: "60%" }}
                label="Select a Container Tag"
                data={this.state.containerNames}
                onChangeText={(id) =>
                    this.selectedContainer(id)
               }
              />
            </View>
          </View>

          <Text style={styles.titles}>Create New Container Tags</Text>
          <Text style={styles.description}>
            Enter a container name, select a color, and click the add button to
            create a new container tag.
          </Text>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={styles.tagNameContainer}
              placeholder="Container Name"
              onChangeText={(text) => this.setState({ newContainerName: text })}
              //   onSubmitEditing={this.onSubmit}
              //   ref={this.fieldRef}
            />

            <Dropdown
              containerStyle={{ padding: 1, width: "20%" }}
              label="Select a color"
              data={colors}
              onChangeText={(value) => this.selectedColor(value)}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => this.saveNewContainer()}
            >
              <Text style={{ color: "#fff" }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  selectedColor(value) {
    this.setState({ selectedColor: value});
  }

  render() {
    let ripple = { id: "addButton" };

    return (
      <View>
        {this.state.routinesLoaded && <View>{this.renderPage()}</View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // RoutinesPage
  saveButton: {
    marginLeft: 24,
    fontSize: 14,
    // minWidth: 8,
    // minHeight: 20,
    height: 38,
    borderRadius: 8,
    backgroundColor: "#FF6978",
    borderColor: "#fff",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 30,
    paddingLeft: 8,
    paddingRight: 8,
  },
  tagNameContainer: {
    padding: 12,
    height: "45%",
    width: "30%",
    fontSize: 12,
    marginTop: 35,
    borderColor: "#d3d3d3",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 20,
  },
  colorSelectionContainer: {
    // width: "100%",
    borderColor: "#d3d3d3",
    borderStyle: "solid",
    borderWidth: 1,
    // paddingLeft: 20,
    // paddingRight: 20,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 30,

    // margin: 0,
  },
  tagsContainer: {
    // flexWrap: 'wrap',
    flexDirection: "row",
    // width: "100%",
    // marginTop: 10,
    // marginLeft: 8,
    // marginRight: 10,
    // flexDirection: "row",
    // justifyContent: "space-around",
  },
  dropDownItem: {
    padding: 5,
    marginTop: 2,
    backgroundColor: "#ddd",
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 5,
  },
  topContainer: {
    zIndex: 999,
  },
  dialogTitle: {
    marginTop: 14,
    fontSize: 20,
    textAlign: "center",
    height: 100,
  },
  dialogSubtext: {
    marginTop: -45,
    fontSize: 16,
    textAlignVertical: "auto",
    width: 220,
    marginBottom: 10,
    marginLeft: 18,
    marginRight: 18,
  },
  deletionModal: {
    margin: 12,
    backgroundColor: "#f7f7f7",
    padding: 28,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.65,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deletionFooter: {
    fontSize: 14,
    marginBottom: 6,
    marginTop: 12,
    paddingTop: 4,
    marginLeft: 10,
    marginRight: 10,
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
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 2,
    marginBottom: 10,
    marginLeft: 5,
  },
  greyTag: {
    fontSize: 8,
    height: 25,
    minWidth: 50,
    width: 100,
    borderRadius: 20,
    backgroundColor: "#d7cbd2",
    borderColor: "#d7cbd2",
    borderWidth: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginRight: 6,
    opacity: .5,

  },
  blueTag: {
    color: "white",
    fontSize: 8,
    height: 25,
    minWidth: 50,
    width: 100,
    borderRadius: 20,
    backgroundColor: "#B1EDE8",
    borderColor: "#B1EDE8",
    borderWidth: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginRight: 6,
    opacity: .5,
  },
  orangeTag:{
    color: "white",
    fontSize: 8,
    height: 25,
    minWidth: 50,
    width: 100,
    borderRadius: 20,
    backgroundColor: "#FF7F50",
    borderColor: "#B1EDE8",
    borderWidth: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginRight: 6,
    opacity: .5,

  },
  tagsbutton: {
    fontSize: 10,
    height: 25,
    minWidth: 50,
    width: 100,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderColor: "#FF6978",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    // margin: 5,
  },
  tagContainer: {
    marginTop: 15,
    flexDirection: "row",
    zIndex: 999,
    justifyContent: "flex-end",
  },
  routineContainer: {
    width: WIDTH * 0.3,
    height: 150,
    marginTop: 20,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "black",
    shadowOpacity: 0.1,
    borderWidth: 0,
    paddingTop: 10,
    overflow: "visible",
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
  titles: {
    fontSize: 18,
    padding: 5,
    marginTop: 12,
  },
  textFields: {
    padding: 2,
    margin: 2,
    marginLeft: 15,
  },
  description: {
    fontSize: 14,
    padding: 5,
  },
});
