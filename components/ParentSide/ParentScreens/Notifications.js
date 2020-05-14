import React, { Component } from "react";
import { View, Dimensions, StyleSheet, Text, PickerIOSComponent, TouchableOpacity } from "react-native";
import { TextField } from "react-native-material-textfield";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Environment from "../../../database/sqlEnv";
import UserInfo from "../../../state/UserInfo";
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
      icon: 'check-all',
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
        //this.setState({ childsName: results[0].first_name });
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
              <Icon  name={this.state.icon} color="#848484" style={{left:1}}color="#F32D2D" size={25} />
              <Text style={styles.text}>Check Off Routine</Text>
              <Text style={styles.routineTitle}>{this.state.childsName} has marked his {item.routine_name} complete.</Text>
              <Text style={styles.routineTitle}>Would you like to approve the routine to let {this.state.childsName} claim his reward?</Text>
              <Text style={styles.routineTitle}> claim his reward?</Text>

              <TouchableOpacity style={styles.button}>
              <Icon  name="check" color="#FF6978" size={33}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button2}>
              <Icon  name="window-close" color="#FF6978" size={33}/>
            </TouchableOpacity>
            </View>
          
      );
    });
  }

  fieldRef = React.createRef();

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View>
        
        {this.state.childLoaded && this.state.notificationsLoaded && (
          <View style={styles.textfields}>{this.displayRoutines()} 
          </View>
        )}
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
    margin: 5,
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
  icon:{
    fontSize: 20
  },
  text: {
    marginLeft: 30,
    fontSize: 24,
    marginTop: -28,
  },
  textFields: {
    padding: 5,
    margin: 2,
    marginLeft: 45,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 50,
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
    marginLeft: 33,
    fontSize: 20,
    textAlignVertical: "center",
  },
});
