import React, { Component } from "react";
import {
  ScrollView,
  Text,
  View,
  Image,
  SafeAreaView,
  Dimensions,
} from "react-native";
import Head from "../../assets/images/rewardPenguin.png";
import Ribbon from "../../assets/images/ribbon.png";
import Ribbon2 from "../../assets/images/ribbon2.png";
import Ribbon3 from "../../assets/images/ribbon3.png";
import Ribbon4 from "../../assets/images/ribbon4.png";
import Star from "../../assets/images/fillstar.png";
import UnfilledStar from "../../assets/images/Star.png";
import MaterialTabs from "react-native-material-tabs";
const { width: WIDTH } = Dimensions.get("window");
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
Icon.loadFont();

import Environment from "../../database/sqlEnv";

export default class ChildRewards extends Component {
  constructor() {
    super();
    this.state = {
      index: 0,
      selectedTab: 0,

      loaded: false,
      results: false,
      child: false,
      star: null,
      
    };
    this.getResults();
    this.getChild();
  }
  static navigationOptions = ({ navigation }) => ({
    title: "My Rewards",
  });

  getResults() {
    fetch(Environment + "/getAllRewardsandRoutines/" + 1, {
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
        this.setState({ loaded: true });
        console.log(this.state.results);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getChild(){
    fetch(Environment + "/getChildFromParent/" + 1, {
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then((results) => {
        results.map(item => {
          this.setState({ child: item });
        })
        console.log(this.state.child);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  displayStars(activities, star) {
    var stars = [];

    for (let i = 0; i < activities; i++) {
      stars.push(<Image source={star} style={{ width: 20, height: 20 }} />);
    }

    return stars;
  }

  tokens(){
    const Ribbon = {
      Ribbon: 1,
      Ribbon2: 2,
      Ribbon3: 3,
      Ribbon4: 4
   };
    return (
    <Text>{this.state.child.routines_complete} + {Ribbon[1]}</Text>
    )
  }

  displayTab1() {
    return (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {this.tokens()}
        <View style={styles.imageContainer}>
          <Image source={Ribbon} style={styles.imagesActive} />
        </View>
        <View style={styles.imageContainer}>
          <Image source={Ribbon2} style={styles.imagesActive} />
        </View>
        <View style={styles.imageContainer}>
          <Image source={Ribbon3} style={styles.imagesActive} />
        </View>
        <View style={styles.imageContainer}>
          <Image source={Ribbon4} style={styles.imagesInactive} />
        </View>
      </View>
    );
  }

  displayTab2() {
    return (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          margin: 0,
        }}
      >
        {this.state.results.map((item) => {
          if (item.requires_approval == 1)
            return (
              <View style={({ flex: 1 }, styles.routines)}>
                <ScrollView>
                  <Text style={styles.routineTitle}>{item.reward_name}</Text>
                </ScrollView>
                <View style={styles.detailsContainer}>
                  <Text style={styles.routineDetails}>
                    <Icon name="playlist-check" color="#B1EDE8" size={20} />{" "}
                    Activities: {item.amount_of_activities}
                  </Text>
                </View>

                <View style={{ flexDirection: "row", margin: 10 }}>
                  {this.displayStars(item.amount_of_activities, Star)}
                </View>
              </View>
            );
        })}
      </View>
    );
  }

  displayTab3() {
    return (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          margin: 0,
        }}
      >
        {this.state.results.map((item) => {
          if (item.requires_approval == 0)
            return (
              <View
                style={({ flex: 1 }, styles.routines)}
                onStartShouldSetResponder={() =>
                  this.props.navigation.navigate("ChildMap", {
                    prevScreenTitle: "Login",
                    title: item.routine_name
                  })
                }
              >
                <ScrollView>
                  <Text style={styles.routineTitle}>{item.reward_name}</Text>
                </ScrollView>
                <View style={styles.detailsContainer}>
                  <Text style={styles.routineDetails}>
                    <Icon name="playlist-check" color="#B1EDE8" size={20} />{" "}
                    Activities: {item.amount_of_activities}
                  </Text>
                </View>

                <View style={{ flexDirection: "row", margin: 10 }}>
                  {this.displayStars(item.amount_of_activities, UnfilledStar)}
                </View>
              </View>
            );
        })}
      </View>
    );
  }
  render() {
    return (
      <View>
        <View>
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
            <Image source={Head} style={{ width: 140, height: 115 }} />
          </View>

          <SafeAreaView style={styles.container}>
            <MaterialTabs
              items={["Tokens", "Earned", "Upcoming"]}
              selectedIndex={this.state.selectedTab}
              barColor="white"
              indicatorColor="#B1EDE8"
              activeTextColor="#B1EDE8"
              inactiveTextColor="black"
              onChange={(index) => {
                this.setState({
                  selectedTab: index,
                });
                console.log(this.state.selectedTab);
              }}
            />
          </SafeAreaView>

          <ScrollView style={{ margin: 50 }}>
            {this.state.loaded &&
              ((this.state.selectedTab === 0 && this.displayTab1()) ||
                (this.state.selectedTab === 1 && this.displayTab2()) ||
                (this.state.selectedTab === 2 && this.displayTab3()))}
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
  },
  imagesActive: {
    width: 150,
    height: 200,
    resizeMode: "contain",
  },
  imagesInactive: {
    width: 150,
    height: 200,
    resizeMode: "contain",
    opacity: 0.6,
  },
  imageContainer: {
    marginRight: 44,
    marginTop: 30,
    width: 200,
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
  detailsContainer: {
    padding: 2,
  },
  routineDetails: {
    fontSize: 15,
    paddingTop: 10,
    paddingLeft: 2,
  },
  routines: {
    paddingLeft: 3,
    textAlignVertical: "center",
    width: WIDTH * 0.25,
    height: 120,
    margin: 10,
    borderWidth: 3,
    borderRadius: 15,
    backgroundColor: "white",
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "black",
    shadowOpacity: 0.1,
    borderWidth: 0,
  },

  routineTitle: {
    paddingLeft: 5,
    paddingTop: 5,
    fontSize: 16,
    marginLeft: 10,
    textAlign: "left",
    textAlignVertical: "center",
  },
};
