import React, { Component } from "react";
import {
  View,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { TextField } from "react-native-material-textfield";
import Environment from "../../../database/sqlEnv";
import Carousel from "react-native-carousel-view";

import UserInfo from "../../../state/UserInfo";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
const childId = UserInfo.child_id;

export default class RoutineApproval extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Approve Routine",
  });

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
      currentNotification: this.props.navigation.state.params
        .currentNotification,
      activities: null,
      activitiesLoaded: false,
    };
  }

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
        console.log(results);
      })
      .catch((error) => {
        console.error(error);
      });
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
    console.log("KEY " + key);
    var images = this.state.currentNotification.image_path_array;
    var imageArray = images.split(',');

    console.log("imagearray " + imageArray);
    console.log("at key " + imageArray);

    if (key > imageArray.length - 1) {
      // Put something here for when they didnt take an image
      return "";
    } else {
      console.log(imageArray[key]);
      return imageArray[key];
    }
  }

  displayActivities() {
    const { navigate } = this.props.navigation;
    return (
      <View>
        {this.state.activitiesLoaded && (
          <Carousel
            height={HEIGHT * 0.9}
            hideIndicators={false}
            indicatorSize={12}
            animate={false}
            onRef={(ref) => (this.child = ref)}
          >
            {this.state.activities.map((item, key) => (
              <View style={styles.carouselContainer}>
                <Text style={styles.activityName}>{item.activity_name}</Text>
                <Text style={styles.subtext}>
                  Image taken by {this.state.childsName}
                </Text>

                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Image
                    source={{ uri: this.getImage(key) }}
                    style={{
                      width: 300,
                      height: 200,
                      margin: 5,
                      borderRadius: 15,
                      resizeMode: "contain",
                    }}
                  />
                </View>
                <TouchableOpacity
                  style={styles.buttonStyle}
                  onPress={() => {
                    this._onNext();
                  }}
                >
                  <Text>Next</Text>
                </TouchableOpacity>
              </View>
            ))}
          </Carousel>
        )}
      </View>
    );
  }

  render() {
    if (this.state.notificationsLoaded !== null) {
      console.log(this.state.notificationsLoaded);
    } else {
      console.log("null below");
    }
    return (
      <View>
        <View>{this.displayActivities()}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topContainer: {
    zIndex: 999,
  },
  carouselContainer: {
    backgroundColor: "#E5E5E5",
  },
  activitiesStyling: {
    backgroundColor: "#FF6978",
    padding: WIDTH * 0.01,
    margin: WIDTH * 0.01,
    borderRadius: 1,
    width: WIDTH * 0.98,
    height: HEIGHT,
  },
  text: {
    marginTop: 7,
    fontSize: 24,
    textAlign: "center",
    height: 100,
  },
  activityName: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: "700",
    paddingHorizontal: 20,
  },
  buttonStyle: {
    padding: 10,
    marginBottom: 50,
    margin: 50,
    backgroundColor: "#FF6978",
    borderRadius: 5,
  },
  subtext: {
    marginTop: 0,
    fontSize: 20,
    textAlign: "center",
    textAlignVertical: "auto",
    width: 220,
    marginBottom: 25,
  },
  dialog: {
    backgroundColor: "#e1d8ff",
  },
  selectText: {
    fontSize: 15,
    padding: 5,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
