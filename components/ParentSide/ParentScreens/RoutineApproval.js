import React, { Component } from "react";
import {
  View,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { RaisedTextButton } from "react-native-material-buttons";
import { TextField } from "react-native-material-textfield";
import Environment from "../../../database/sqlEnv";
import Carousel from "react-native-carousel-view";
import { Video } from "expo-av";

import Star from "../../../assets/images/Star.png";
import StarFill from "../../../assets/images/fillstar.png";

import UserInfo from "../../../state/UserInfo";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
const childId = UserInfo.child_id;

export default class RoutineApproval extends Component {

  constructor(props) {
    super(props);
    const { navigate } = this.props.navigation;
    this.navigate = navigate;
    this.state = {
      currentRoutine: this.props.navigation.state.params.currentRoutine,
      routineId: this.props.navigation.state.params.routineId,
      rewardId: this.props.navigation.state.params.rewardId,
      routineName: this.props.navigation.state.params.routineName,
      prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
      childsName: this.props.navigation.state.params.childsName,
      finalRewardId: this.props.navigation.state.params.finalRewardId,
      currentNotification: this.props.navigation.state.params
        .currentNotification,
      activities: null,
      activitiesLoaded: false,
    };
  }

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.routineName}`,
  });

  getRoutineActivities() {
    fetch(
      Environment +
        "/joinRoutineActivityTableByRoutineId/" +
        this.state.routineId
    )
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((results) => {
        this.setState({ activities: results });
        this.setState({ activitiesLoaded: true });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  renderStars(key) {
    let star = [];

    for (let i = 0; i < this.state.activities.length; i++) {
      if (i < key) {
        star.push(<Image source={StarFill} style={{ margin: 10 }} />);
      } else {
        star.push(<Image source={Star} style={{ margin: 10 }} />);
      }
    }
    return star;
  }

  _onNext = () => {
    this.child._animateNextPage();
  };

  componentDidMount() {
    this.props.navigation.addListener("didFocus", (payload) => {
      this.getRoutineActivities();
    });
  }

  getImage(key) {
    var images = this.state.currentNotification.image_path_array;
    var imageArray = images.split(",");
    if (key > imageArray.length - 1) {
      // Put something here for when they didnt take an image
      return "";
    } else {
      return imageArray[key];
    }
  }

  displayActivities() {
    const { navigate } = this.props.navigation;
    let ripple = { id: "addButton" };

    return (
      <View style={{backgroundColor: "#FFFCF9",}}>
        {this.state.activitiesLoaded && (
          <Carousel
            height={HEIGHT}
            hideIndicators={true}
            indicatorSize={12}
            animate={false}
            onRef={(ref) => (this.child = ref)}
          >
            {/* Loop over each activity */}
            {this.state.activities.map((item, key) => (
             
             <View style={styles.carouselContainer}>
                <ScrollView>
                  <Text style={styles.activityName}>
                    {key + 1}
                    {". "}
                    {item.activity_name}
                  </Text>

                  <Text style={styles.subtext}>
                    Image taken by {this.state.childsName}
                  </Text>

                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <View style={styles.imageContainer}>
                      <Image
                        source={{ uri: this.getImage(key) }}
                        style={{
                          width: 350,
                          height: 250,
                          margin: 5,
                          borderRadius: 15,
                          resizeMode: "contain",
                        }}
                      />
                    </View>
                  </View>

                  <Text style={styles.subtitle}>Rewards Recevied</Text>
                  {/* <Text style={styles.subtext}>
                    {key + 1}
                    {"/"}
                    {this.state.activities.length}
                    {" stars"}
                  </Text> */}

                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 20,
                    }}
                  >
                    <View style={styles.image}>
                      {this.renderStars(key + 1)}
                    </View>
                  </View>

                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 100,
                    }}
                  >

                  {item.reward_image && (
                    <View style={styles.rewardImageContainer}>
                      <Image
                        source={{ uri: item.reward_image }}
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

                  {item.reward_description && (
                    
                    <View style={styles.rewardImageContainer}>
                      <Text style={styles.rewardDescriptionText}>
                        {item.reward_description}
                      </Text>
                    </View>
                  )}

                  {item.reward_video && (
                    <View>
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 15,
                        }}
                      >
                        <Video
                          useNativeControls={true}
                          source={{ uri: item.reward_video }}
                          rate={1.0}
                          volume={1.0}
                          isMuted={false}
                          resizeMode="contain"
                          isLooping
                          style={{ width: WIDTH * 0.7, height: WIDTH * 0.3 }}
                        />
                      </View>
                    </View>
                  )}

                </View>

                  <View
                    style={{
                      marginRight: 60,
                      alignSelf: "flex-end",
                      marginBottom: 50,
                    }}
                  >
                    <RaisedTextButton
                      style={styles.roundAddButton}
                      title=">"
                      titleColor="white"
                      titleStyle={{ fontSize: 18 }}
                      color="#FF6978"
                      onPress={() => {
                        if (key + 1 === this.state.activities.length) {
                          this.props.navigation.navigate("CheckOffRoutine", {
                            prevScreenTitle: "Notifications",
                            routineId: this.state.routineId,
                            childsName: this.state.childsName,
                            routineName: this.state.routineName,
                            finalRewardId: this.state.finalRewardId,
                            currentNotification: this.state.currentNotification,
                          });
                        } else {
                          this._onNext();
                        }
                      }}
                      ripple={ripple}
                    />
                  </View>
                </ScrollView>
              </View>
            ))}
          </Carousel>
        )}
      </View>
    );
  }

  render() {
    if (this.state.notificationsLoaded !== null) {
      return (<View>{this.displayActivities()}</View>);

    } else {
    }
  }
}

const styles = StyleSheet.create({
  carouselContainer: {
    backgroundColor: "#FFFCF9",
    paddingBottom:30,
  },
  next: {
    fontSize: 20,
    textAlign: "center",
  },
  text: {
    marginTop: 7,
    fontSize: 24,
    textAlign: "center",
    height: 100,
  },
  activityName: {
    marginTop: 20,
    marginBottom: 14,
    fontSize: 24,
    fontWeight: "700",
    paddingHorizontal: 20,
  },
  subtitle:{
    marginTop: 8,
    fontSize: 20,
    fontWeight: "500",
    marginLeft: 25,
  },
  subtext: {
    fontSize: 20,
    marginLeft: 25,
    marginTop: 8,
  },
  image: {
    flexDirection: "row",
    flexWrap: "wrap",
    margin: 30,
  },
  buttonStyle: {
    width: 100,
    padding: 11,
    marginBottom: 90,
    marginTop: 80,
    marginLeft: 365,
    backgroundColor: "#FF6978",
    borderRadius: 5,
    textAlign: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    height: HEIGHT,
    top: -20,
  },
  imageContainer: {
    marginRight: 44,
    marginTop: 30,
    width: 290,
    height: 290,
    backgroundColor: "white",
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  
  rewardImageContainer: {
    marginTop: 15,
    width: 250,
    height: 250,
    backgroundColor: "white",
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  roundAddButton: {
    marginRight: 10,
    marginLeft: 6,
    fontSize: 35,
    height: 50,
    minWidth: 50,
    width: 50,
    borderRadius: 50,
    color: "#FFFFFF",
  },
  rewardDescriptionText: {
    fontSize: 22,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    margin: 30,
  },
});
