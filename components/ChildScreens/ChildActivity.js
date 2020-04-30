import React, { Component } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Video } from "expo-av";
import VideoPlayer from "expo-video-player";

import Carousel from "react-native-carousel-view";
import SmoothPinCodeInput from "react-native-smooth-pincode-input";
import Dialog, { DialogContent } from "react-native-popup-dialog";
import * as Progress from "react-native-progress";
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
import Star from "../../assets/images/fillstar.png";
import Ribbon from "../../assets/images/ribbon.png";
import Head from "../../assets/images/PenguinFace.png";
import Environment from "../../database/sqlEnv";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
Icon.loadFont();

import * as Font from "expo-font";
import { AppLoading } from "expo";
let customFonts = {
  SF: require("../../assets/fonts/SF/SF-Pro-Display-ThinItalic.otf"),
  "Inter-SemiBoldItalic":
    "https://rsms.me/inter/font-files/Inter-SemiBoldItalic.otf?v=3.12",
};

export default class ChildActivity extends Component {
  //Construct header titles
  constructor(props) {
    super(props);
    const { navigate } = this.props.navigation;
    this.navigate = navigate;
    this.state = {
      prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
      currentRoutine: this.props.navigation.state.params.currentRoutine,
      userID: this.props.navigation.state.params.userID,
      visible1: false,
      visible2: false,
      fontsLoaded: false,
      activitiesLoaded: false,
      activities: null,
    };
    ChildActivity.navigationOptions.headerBackTitle = this.props.navigation.state.params.currentRoutine;
  }

  //Header titles for routines
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.currentRoutine}`,
  });
  _onNext = () => {
    this.child._animateNextPage(); // do stuff
  };

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.props.navigation.addListener("didFocus", (payload) => {
      this.getActivities();
    });
  }
  getActivities() {
    fetch(Environment + "/getActivities/" + this.state.userID, {
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((results) => {
        this.setState({ activities: results });
        this.setState({ activitiesLoaded: true });
        console.log(this.state.activities);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  //initial code input value

  pinInput = React.createRef();

  //code is 1234
  //TODO: Navigate to parent, Dynamic Code
  _checkCode = (code) => {
    if (code != "1234") {
      this.pinInput.current.shake();
      this.setState({ code: "" });
    } else {
      this.setState({ visible1: false, visible2: false });
      //nav to parent
      this.navigate("ParentNavigation", { prevScreenTitle: "My Routines" });
    }
  };
  render() {
    state = {
      currentIndex: 0,
      code: "",
    };
    //Array of dummy objects
    let activities = this.state.activities;

    const { code } = this.state;

    if (this.state.fontsLoaded && this.state.activitiesLoaded) {
      return (
        <View>
          <Carousel
            height={HEIGHT * 0.9}
            hideIndicators={true}
            indicatorSize={20}
            animate={false}
            onRef={(ref) => (this.child = ref)}
          >
            {activities.map((item, key) => (
              <View
                key={key}
                style={
                  (styles.activities,
                  {
                    backgroundColor: "#FFFCF9",
                    top: 0,
                    left: 0,
                  })
                }
              >
                <View
                  style={{
                    shadowColor: "grey",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.4,
                    shadowRadius: 2,
                    width: WIDTH,
                    top: 0,
                    left: 0,
                    backgroundColor: "white",
                    paddingBottom: 10,
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      height: 10,
                      paddingRight: 100,
                      marginTop: 50,
                      flexDirection: "row",
                    }}
                  >
                    <View
                      style={{
                        padding: 10,
                        borderRadius: 40,
                        borderWidth: 1,
                        top: -20,
                        right: -15,
                        backgroundColor: "white",
                        borderColor: "#B1EDE8",
                        height: 80,
                        width: 80,
                        zIndex: 99,
                      }}
                    >
                      <Image
                        source={Star}
                        style={{ marginTop: 1, marginLeft: 5 }}
                      />
                    </View>
                    <Text
                      style={{
                        fontFamily: "SF",
                        borderColor: "#B1EDE8",
                        borderWidth: 2,
                        height: 40,
                        width: 100,
                        paddingLeft: 40,
                        paddingTop: 10,
                        alignItems: "center",
                        borderRadius: 20,
                      }}
                    >
                      {key + 1} / {activities.length}
                    </Text>
                  </View>

                  <Image source={Head} style={{ width: 140, height: 115 }} />

                  <View
                    style={{
                      height: 30,
                      paddingLeft: 100,
                      marginTop: 50,
                      flexDirection: "row",
                    }}
                  >
                    <Progress.Bar
                      progress={(key + 1) / activities.length}
                      color={"#B1EDE8"}
                      width={100}
                      height={30}
                      borderWidth={2}
                      borderRadius={20}
                    />
                    <View
                      style={{
                        padding: 10,
                        borderRadius: 40,
                        borderWidth: 1,
                        top: -20,
                        left: -15,
                        backgroundColor: "white",
                        borderColor: "#B1EDE8",
                        height: 80,
                        width: 80,
                      }}
                    >
                      <Image
                        source={Ribbon}
                        style={{
                          height: 50,
                          width: 40,
                          marginTop: 1,
                          marginLeft: 9,
                        }}
                      />
                    </View>
                  </View>
                </View>

                <Text style={styles.actTitle}>
                  {" "}
                  {key + 1 + ". " + item.activity_name}{" "}
                </Text>

                {item.image_path && (
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Image
                      source={{ uri: item.image_path }}
                      style={{
                        width: 300,
                        height: 200,
                        margin: 5,
                        borderRadius: 15,

                        resizeMode: "contain",
                      }}
                    />
                  </View>
                )}
                {item.activity_description && (
                  <View>
                    <Text style={styles.actTitle}>Description</Text>
                    <Text style={styles.desc}>{item.activity_description}</Text>
                  </View>
                )}
                {item.video_path && (
                  <View>
                    <Text style={styles.actTitle}>Watch</Text>
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <VideoPlayer
                        videoProps={{
                          shouldPlay: false,
                          resizeMode: Video.RESIZE_MODE_CONTAIN,
                          source: {
                            uri: item.video_path,
                          },
                        }}
                        inFullscreen={true}
                        width={300}
                        height={200}
                        style={{ borderRadius: 15 }}
                      />
                    </View>
                  </View>
                )}
                {item.audio_path && (
                  <View>
                    <Text style={styles.actTitle}>Listen To Directions</Text>
                    <View
                      style={{
                        flexDirection: "row",
                        margin: 15,
                        justifyContent: "center",
                      }}
                    >
                      <TouchableOpacity style={styles.button}>
                        <Icon
                          name="play-circle"
                          color="#B1EDE8"
                          size={30}
                          style={{ marginRight: 10 }}
                        />
                        <Text>Play</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.button}>
                        <Icon
                          name="stop"
                          color="#B1EDE8"
                          size={30}
                          style={{ marginRight: 10 }}
                        />
                        <Text>Stop</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={() => {
                      this.navigate("Camera", { prevScreenTitle: "ACTIVITY" });
                      this._onNext();
                    }}
                  >
                    <Text style={styles.textStyle}>Take A Picture!</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <View style={styles.container}>
              <Text style={styles.title}>
                Congratulations! You receive a badge!
              </Text>
              <View style={styles.image}>
                {activities.map(() => (
                  <Image source={Star} style={{ margin: 10 }} />
                ))}
              </View>
              <Image
                source={Ribbon}
                style={{
                  margin: 10,
                  flex: 1,
                  width: 300,
                  height: 300,
                  resizeMode: "contain",
                }}
              />
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => {
                  this.setState({ visible1: true });
                }}
              >
                <Text style={styles.textStyle}>Unlock My Reward</Text>
              </TouchableOpacity>
            </View>
          </Carousel>

          <Dialog
            visible={this.state.visible1}
            onTouchOutside={() => {
              this.setState({ visible1: false });
            }}
          >
            <DialogContent>
              <View style={styles.section}>
                <Text style={styles.title}>Ask Parent to Approve</Text>
                <Text style={styles.section}>
                  Your parent wishes to approve this routine. Ask them to check
                  off the routine to claim your reward.
                </Text>
                <TouchableOpacity
                  style={styles.buttonStyle}
                  onPress={() => {
                    this.setState({ visible2: true, visible1: false });
                  }}
                >
                  <Text style={styles.textStyle}>Switch to Parent</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonStyle}
                  onPress={() => {
                    this.setState({ visible1: false });
                  }}
                >
                  <Text style={styles.textStyle}>Remind Parents Later</Text>
                </TouchableOpacity>
              </View>
            </DialogContent>
          </Dialog>

          {/* second dialog - pin enter */}
          <Dialog
            visible={this.state.visible2}
            onTouchOutside={() => {
              this.setState({ visible2: false });
            }}
          >
            <DialogContent>
              <View style={styles.section}>
                <Text style={styles.title}>Parents Only</Text>
                <Text style={styles.section}>
                  Enter your 4 digit passcode to switch to approve a routine
                </Text>
                <SmoothPinCodeInput
                  ref={this.pinInput}
                  keyboardType="number-pad"
                  cellStyle={{
                    borderBottomWidth: 2,
                    borderColor: "gray",
                  }}
                  cellStyleFocused={{
                    borderColor: "black",
                  }}
                  x
                  value={code}
                  onTextChange={(code) => this.setState({ code })}
                  onFulfill={this._checkCode}
                  onBackspace={() => console.log("No more back.")}
                />
              </View>
            </DialogContent>
          </Dialog>
        </View>
      );
    } else {
      return <AppLoading />;
    }
  }
}

const styles = StyleSheet.create({
  activities: {
    backgroundColor: "#FF6978",
    padding: WIDTH * 0.01,
    margin: WIDTH * 0.01,
    borderRadius: 1,
    width: WIDTH * 0.98,
    height: HEIGHT,
  },
  actTitle: {
    fontFamily: "SF",
    fontSize: 25,
    padding: 10,
    marginLeft: 20,
  },
  desc: {
    fontSize: 20,
    padding: 10,
    marginBottom: 10,
  },
  backgroundVideo: {
    position: "relative",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonStyle: {
    padding: 10,
    margin: 10,
    backgroundColor: "#FF6978",
    borderRadius: 5,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flexDirection: "row",
    flexWrap: "wrap",
    margin: 30,
  },
  section: {
    fontSize: 25,
    alignItems: "center",
    margin: 30,
  },
  title: {
    marginTop: 100,
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 8,

    fontFamily: "SF",
  },
  textStyle: {
    fontFamily: "SF",
    fontSize: 20,
    color: "white",
    textAlign: "center",
  },
  buttonStyle: {
    width: 300,
    padding: 10,
    margin: 20,
    backgroundColor: "#B1EDE8",
    borderRadius: 100,
  },
  button: {
    fontSize: 30,
    minWidth: 150,
    minHeight: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    margin: 5,
    padding: 2,
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
});
