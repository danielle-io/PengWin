// This page is esentially our Link Tree to test pages
import React, { Component } from "react";
import { Text, View, ScrollView, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

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

  render() {
    let ripple = { id: "submitButton" };
    return (
      <View>
        <ScrollView>
          <View style={styles.containerFull}>
            {/* <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <Text style={styles.testingh2}>PARENT SCREENS</Text>
          </View> */}

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
                  this.navigate("ParentRoutines", {
                    prevScreenTitle: "TestingHomePage",
                  })
                }
              >
                <Text style={styles.linkText}>Parent / Routines Page</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.parentContainer}
                onPress={() =>
                  this.navigate("ParentNavigation", {
                    prevScreenTitle: "TestingHomePage",
                    initialRouteName: "ParentRoutines",
                  })
                }
              >
                <Text style={styles.linkText}>Parent Navigation Page</Text>
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
                  this.navigate("EditActivity", {
                    prevScreenTitle: "TestingHomePage",
                  })
                }
              >
                <Text style={styles.linkText}>Parent Activity</Text>
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

            {/* <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }}> */}
            {/* <Text style={styles.testingh2}>CHILD SCREENS</Text> */}
            {/* </View> */}

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
                  this.navigate("ChildMap", { prevScreenTitle: "Login" })
                }
              >
                <Text style={styles.linkText}>Child Map</Text>
              </TouchableOpacity>

            </View>

            {/* <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>

            <Text style={styles.testingh2}>LOGIN + OTHER SCREENS</Text>

          </View> */}

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
                  this.navigate("ChildCamera", { prevScreenTitle: "ChildCamera" })
                }
                style={styles.otherContainer}
              >
                <Text style={styles.linkText}>ChildCamera</Text>
              </TouchableOpacity>

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

              <TouchableOpacity
                style={styles.otherContainer}
                onPress={() =>
                  this.navigate("ForgotPassword", {
                    prevScreenTitle: "TestingHomePage",
                  })
                }
              >
                <Text style={styles.linkText}>
                  Forgot Password does not exist
                </Text>
              </TouchableOpacity>

              <View style={styles.otherContainer}>
                <Text
                  style={styles.linkText}
                  onPress={() =>
                    this.navigate("Camera", {
                      prevScreenTitle: "TestingHomePage",
                    })
                  }
                >
                  Camera
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1 ,
    marginTop: "15%",
    textAlign: "center",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
  },
  // textWrapper: {
  //   height: hp("100%"), // 70% of height device screen
  //   width: wp("190%"), // 80% of width device screen
  // },
  myText: {
    fontSize: hp("5%"), // End result looks like the provided UI mockup
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
