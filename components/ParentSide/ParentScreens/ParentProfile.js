import React, { Component } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { TextField } from "react-native-material-textfield";
import UserAvatar from "react-native-user-avatar";
import Environment from "../../../database/sqlEnv";
import UserInfo from "../../../state/UserInfo";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
Icon.loadFont();

const { width: WIDTH } = Dimensions.get("window");
const parentId = UserInfo.parent_id;
const childId = UserInfo.child_id;
const userId = UserInfo.user_id;

export default class ParentProfile extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Profile",
    activeTab: 4,
  });

  constructor(props) {
    super(props);
    const { navigate } = this.props.navigation;
    this.navigate = navigate;
    this.state = {
      prevScreenTitle: "Profile",
      firstLoaded: false,
      loaded: false,
      childResults: null,
      results: null,
      parentFirstName: null,
      parentLastName: null,
      email: null,
      childFirstName: null,
    };
  }

  async changeUserComponent(tag, value, id) {
    var data = {
      [tag]: value,
    };
    try {
      let response = await fetch(Environment + "/updateUser/" + id, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (errors) {
      alert(errors);
    }
  }


  componentDidMount() {
    this.props.navigation.addListener("didFocus", (payload) => {
      this.getUserInfo(), this.getChildInfo();
    });
  }

  getChildInfo() {
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
        this.setState({ loaded: true });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getUserInfo() {
    fetch(Environment + "/getUser/" + userId, {
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((results) => {
        this.setState({ results: results });
        this.setState({ firstLoaded: true });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getChildsName() {
    return this.state.childResults.map((itemValue) => {
      return (
        <TextField
          id="childFirstName"
          placeholder="Your Child's First Name"
          value={itemValue.first_name}
          style={(styles.textfieldWithFloatingLabel, styles.textFields)}
          textInputStyle={{ flex: 1 }}
          onEndEditing={(e) => {
            this.changeUserComponent(
              "first_name",
              this.state.childFirstName,
              itemValue.user_id
            );
          }}
          onChangeText={(text) => this.setState({ childFirstName: text })}
        />
      );
    });
  }

  displayUserData() {
    return this.state.results.map((item) => {
      var fullName = item.first_name + " " + item.last_name;

      return (
        <View style={styles.parentProfileFormContainer}>
          <View style={styles.avatarContainer}>
            <UserAvatar size={100} name={fullName} />
          </View>

          <TextField
            id="parentFirstName"
            placeholder="First Name"
            value={item.first_name}
            style={(styles.textfieldWithFloatingLabel, styles.textFields)}
            textInputStyle={{ flex: 1 }}
            onEndEditing={(e) => {
              this.changeUserComponent(
                "first_name",
                this.state.parentFirstName,
                userId
              );
            }}
            onChangeText={(text) => this.setState({ parentFirstName: text })}
          />

          <TextField
            id="parentLastName"
            placeholder="Last Name"
            value={item.last_name}
            style={(styles.textfieldWithFloatingLabel, styles.textFields)}
            textInputStyle={{ flex: 1 }}
            onEndEditing={(e) => {
              this.changeUserComponent(
                "last_name",
                this.state.parentLastName,
                userId
              );
            }}
            onChangeText={(text) => this.setState({ parentLastName: text })}
          />

          <TextField
            id="parentEmail"
            placeholder="Email"
            value={item.email}
            style={(styles.textfieldWithFloatingLabel, styles.textFields)}
            textInputStyle={{ flex: 1 }}
            onEndEditing={(e) => {
              this.changeUserComponent("email", this.state.email, userId);
            }}
            onChangeText={(text) => this.setState({ email: text })}
          />

          {this.getChildsName()}
        </View>
      );
    });
  }

  displayQuestionnaire() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.navigate("Questionnaire");
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginLeft: 100,
            marginRight: 100,
            marginBottom: 50,
          }}
        >
            <Text style={styles.tagMenuIconText}>
              Create Child's Profile
            </Text>

          <View
            stlye={{
              textAlign: "right",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              marginTop: 20,
            }}
          >
            <Icon style={styles.tagMenuIcons} name="chevron-right" />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  fieldRef = React.createRef();

  render() {
    return (
      <View>
        {this.state.loaded && this.state.firstLoaded && (
          <View>{this.displayUserData()}</View>
        )}

        {this.displayQuestionnaire()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  parentProfileFormContainer: {
    marginTop: 10,
    marginLeft: 100,
    marginRight: 100,
    marginBottom: 15,
  },
  createProfile: {
    marginLeft: 100,
    marginRight: 100,
    marginBottom: 50,
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    marginTop: 50,
  },
  linkColor: {
    color: "#FF6978",
    fontSize: 20,
    paddingTop: 5,
    marginLeft: 10,
    marginTop: 10,
    flexDirection: "row",
  },
  textFields: {
    padding: 5,
    margin: 2,
    marginLeft: 0,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 20,
  },
  tagMenuIconText: {
    flexDirection: "row",
    fontSize: 20,
    fontSize: 18,
    paddingTop: 5,
    marginTop: 8,
  },
  tagMenuIcons: {
    flexDirection: "row",
    color: "#FF6978",
    fontSize: 22,
    paddingTop: 5,
    marginLeft: 30,
    marginTop: 8,
    fontWeight: "bold",
    alignSelf: "flex-end",
    textAlign: "right",
    justifyContent: "flex-end",
  },
});
