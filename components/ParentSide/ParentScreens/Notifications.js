import React, { Component } from "react";
import { View, Dimensions, StyleSheet, Text } from "react-native";
import { TextField } from "react-native-material-textfield";

import Environment from "../../../database/sqlEnv";
import UserInfo from "../../../state/UserInfo";

const { width: WIDTH } = Dimensions.get("window");

export default class Notifications extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Notifications",
    prevScreenTitle: "Testing Home Page",
  });

  constructor(props) {
    super(props);
    this.state = {
      prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
      childNotifications: null,
      childLoaded: false,
      childResults: null,
      childsName: null,
      notificationsLoaded: false,
      routines: [],
    };
  }

  componentDidMount() {
    this.props.navigation.addListener("didFocus", (payload) => {
      this.getChildInfo();
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
        var tempRoutines = [];

        if (this.state.routines !== []) {
          tempRoutines = this.state.routines;
        }

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
        this.loopOverNotificationRoutines();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getChildInfo() {
    const userId = UserInfo.user_id;
    fetch(Environment + "/getChildFromParent/" + userId, {
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

  loopOverNotificationRoutines() {
    this.state.childNotifications.map((item) => {
      var id = item.routine_id;
      this.getRoutineById(id);
    });
    this.setState({ notificationsLoaded: true });
  }

  getCurrentNotification(key){
    console.log("KEY " + key);
    console.log("CHILD NOTIFS BELOW");
    console.log(this.state.childNotifications);
    console.log("this.state.childNotifications[key];" + this.state.childNotifications[key])
    return this.state.childNotifications[key];
  }

  displayRoutines() {

    return this.state.routines.map((item, key) => {
      return (
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
              <Text style={styles.routineTitle}>{item.routine_name}</Text>
            </View>
          
      );
    });
  }

  fieldRef = React.createRef();

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View>
        <Text style={styles.text}>Check Off Routine</Text>
        {this.state.childLoaded && this.state.notificationsLoaded && (
          <View>{this.displayRoutines()}</View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  notificationContainer: {
    backgroundColor: "rgba(255, 105, 120, 0.13)",
    padding: 5,
    margin: 5,
  },

  text: {
    marginLeft: 48,
    fontSize: 24,
    marginBottom: 1,
    marginTop: 1,
  },

  textFields: {
    padding: 5,
    margin: 2,
    marginLeft: 45,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 20,
    marginRight: 170,
  },
  formIndent: {
    marginLeft: 30,
  },

  routineDetails: {
    fontSize: 10,
    paddingTop: 15,
    paddingLeft: 15,
  },

  detailsContainer: {
    padding: 2,
    paddingTop: 10,
    paddingBottom: 15,
  },
  routinesStyling: {
    paddingLeft: 3,
    textAlignVertical: "center",
    width: WIDTH * 0.3,
    height: 100,
    marginTop: 5,
    marginBottom: 5,
    borderWidth: 3,
    borderRadius: 15,
    backgroundColor: "white",
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "black",
    shadowOpacity: 0.1,
  },
  routineTitle: {
    fontSize: 14,
    textAlign: "center",
    textAlignVertical: "center",
  },
});
