import React, { Component } from "react";
<<<<<<< HEAD
import { AppRegistry, View, Dimensions, StyleSheet, Text, PickerIOSComponent, TouchableOpacity, Button } from "react-native";
=======
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  PickerIOSComponent,
  TouchableOpacity,
} from "react-native";
>>>>>>> origin/master
import { TextField } from "react-native-material-textfield";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Environment from "../../../database/sqlEnv";
import UserInfo from "../../../state/UserInfo";
import { Dialog } from 'react-native-simple-dialogs';


Icon.loadFont();
const { width: WIDTH } = Dimensions.get("window");

export default class Notifications extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Notifications",
    prevScreenTitle: "Testing Home Page",
  });

  constructor(props) {
    super(props);
    this.state = {
      icon: "check-all",
      childNotifications: null,
      childLoaded: false,
      childResults: null,
      childsName: null,
      notificationsLoaded: false,
      routines: [],
      noNotifications: false,
    };
  }
 
  openDialog(show){
    this.setState({showDialog: show})
  }
  openDialogs(show){
    this.setState({showDialogs: show})
  }

  componentDidMount() {
    this.props.navigation.addListener("didFocus", (payload) => {
      this.getChildInfo();
      this.setState({ routines: [] });
      this.getNotifications();
    });
  }

  getRoutineById(routineId) {
    fetch(Environment + "/getRoutinesByRoutineId/" + routineId)
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((results) => {
        var tempRoutines = this.state.routines;

        tempRoutines.push(results.routines[0]);
        this.setState({ routines: tempRoutines });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getNotifications() {
    const parentId = UserInfo.parent_id;
    fetch(Environment + "/getUnevaluatedRoutines/" + parentId, {
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((results) => {
        this.setState({ childNotifications: results });
        console.log(results);
        if (results.length === 0) {
          console.log("true");
          this.setState({ noNotifications: true });
        } else {
          this.loopOverNotificationRoutines();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getChildInfo() {
    const parentId = UserInfo.parent_id;
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
        this.setState({ childResults: results });
        this.setState({ childLoaded: true });
        this.setState({ childsName: results[0].first_name });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  updateChildNotification(childNotificationId, data) {
    let response = fetch(
      Environment + "/updateChildNotificationsTable/" + childNotificationId,
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
        this.setState({ notificationsLoaded: false });
        this.getNotifications();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  evaluateRoutineNotification(childNotification, value) {
    var data = {
      is_approved: value,
      is_evaluated: 1,
    };
    this.setState({ routines: [] });
    this.updateChildNotification(
      childNotification.child_notifications_id,
      data
    );
  }

  loopOverNotificationRoutines() {
    if (this.state.childNotifications) {
      this.state.childNotifications.map((item) => {
        var id = item.routine_id;
        this.getRoutineById(id);
      });
      this.setState({ childLoaded: true });
      this.setState({ notificationsLoaded: true });
      this.displayNotifications();
    }
  }

  getCurrentNotification(key) {
    return this.state.childNotifications[key];
  }

  displayNotifications() {
    return this.state.routines.map((item, key) => {
      return (
<<<<<<< HEAD
            <View
              style={({ flex: 1 }, styles.notificationContainer)}
              onStartShouldSetResponder={() =>
                this.props.navigation.navigate("RoutineApproval", {
                  prevScreenTitle: "Notifications",
                  routineId: item.routine_id,
                  childsName: this.state.childsName,
                  routineName: item.routine_name,
                  currentNotification: this.getCurrentNotification(key),
                })
              }
            >
              <Icon  name={this.state.icon} color="#848484" style={{left:1}}color="#F32D2D" size={25} />
              <Text style={styles.text}>Check Off Routine</Text>
              <Text style={styles.routineTitle}>{this.state.childsName} has marked his {item.routine_name} complete.</Text>
              <Text style={styles.routineTitle}>Would you like to approve the routine to let {this.state.childsName} claim his reward?</Text>
              <Text style={styles.routineTitle}> claim his reward?</Text>

              <TouchableOpacity style={styles.button}
               onPress={() => this.openDialog(true)} 
               
              >
              <Icon  name="check" color="#FF6978" size={33}/>
              
              </TouchableOpacity>

            <TouchableOpacity style={styles.button2}
            onPress={() => this.openDialogs(true)} 
            >
              <Icon  name="window-close" color="#FF6978" size={33}/>
            </TouchableOpacity>
            </View>

           
=======
        <View
          style={({ flex: 1, marginTop: 10 }, styles.notificationContainer)}
          onStartShouldSetResponder={() =>
            this.props.navigation.navigate("RoutineApproval", {
              prevScreenTitle: "Notifications",
              routineId: item.routine_id,
              childsName: this.state.childsName,
              routineName: item.routine_name,
              finalRewardId: item.reward_id,
              currentNotification: this.getCurrentNotification(key),
            })
          }
        >
          <Icon
            name={this.state.icon}
            color="#848484"
            style={{ left: 1 }}
            color="#F32D2D"
            size={25}
          />
          <Text style={styles.titleText}>Check Off Routine</Text>
          <Text style={styles.routineBodyText}>
            {this.state.childsName} has marked {item.routine_name} complete.
          </Text>
          <Text style={styles.routineBodyText}>
            Would you like to approve the routine to let {this.state.childsName}{" "}
            claim the reward?
          </Text>

          <TouchableOpacity style={styles.button}>
            <Icon
              name="check"
              onPress={() => {
                this.evaluateRoutineNotification(
                  this.getCurrentNotification(key),
                  1
                );
              }}
              color="#FF6978"
              size={33}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button2}>
            <Icon
              name="window-close"
              color="#FF6978"
              onPress={() => {
                this.evaluateRoutineNotification(
                  this.getCurrentNotification(key),
                  0
                );
              }}
              size={33}
            />
          </TouchableOpacity>
        </View>
>>>>>>> origin/master
      );
    });
  }

  fieldRef = React.createRef();

  render() {
    const { navigate } = this.props.navigation;

    return (
<<<<<<< HEAD
      <View >
        {this.state.childLoaded && this.state.notificationsLoaded && (
          <View style={styles.textfields}>{this.displayRoutines()} 
          </View>
        )}
<Dialog style={{backgroundColor: 'blue'}} 

    visible={this.state.showDialog}
    title="Routine has been marked complete"
    onTouchOutside={() => this.openDialog(false)}  >
    <Button onPress ={() => this.openDialog(false)} style={{marginTop: 10}} title="CLOSE"/>
</Dialog>
 


<Dialog
    visible={this.state.showDialogs}
    title="Routine has been marked incomplete"
    onTouchOutside={() => this.openDialogs(false)} 
    >
    <Button onPress ={() => this.openDialogs(false)} style={{marginTop: 10, width: 20}} title="CLOSE"/>
</Dialog>

=======
      <View>
        <View>
          {this.state.childLoaded &&
            this.state.notificationsLoaded &&
            this.state.routines.length > 0 && (
              <View style={styles.textfields}>
                {this.displayNotifications()}
              </View>
            )}
        </View>

        <View>
          {this.state.noNotifications && (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Text style={styles.noNotifText}>
                You have no new notifications.
              </Text>
            </View>
          )}
        </View>
>>>>>>> origin/master
      </View>
    );
  }
}

const styles = StyleSheet.create({
  notificationContainer: {
    backgroundColor: "rgba(255, 105, 120, 0.13)",
    height: 120,
    width: 830,
    fontSize: 70,
    padding: 5,
    marginTop: 10,
    margin: 5,
  },
  box:{
    width: WIDTH * .18,
    height: 300,
    borderRadius: 8,
  },
  button: {
    fontSize: 30,
    width: 40,
    height: 40,
    marginLeft: 660,
    marginTop: -60,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderColor: "#FF6978",
    borderWidth: 1,
    margin: 5,
    padding: 2,
  },
  button2: {
    fontSize: 30,
    width: 40,
    height: 40,
    marginLeft: 715,
    marginTop: -46,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderColor: "#FF6978",
    borderWidth: 1,
    margin: 5,
    padding: 2,
  },
  icon: {
    fontSize: 20,
    marginLeft: 10,
  },
  titleText: {
    marginLeft: 40,
    fontSize: 24,
    marginTop: -28,
  },
  noNotifText: {
    textAlign: "center",
    fontSize: 24,
    marginTop: 30,
  },
  routineBodyText: {
    marginLeft: 45,
    fontSize: 20,
    textAlignVertical: "center",
  },
});

