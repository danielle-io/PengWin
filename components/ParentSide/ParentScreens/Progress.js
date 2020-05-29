import React, { Component } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  Switch,
  StyleSheet,
  View,
} from "react-native";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
import Environment from "../../../database/sqlEnv";
import UserInfo from "../../../state/UserInfo";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import ProgressCircle from "react-native-progress-circle";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
Icon.loadFont();

const userId = UserInfo.user_id;
const data = {
  labels: ["S", "M", "T", "W", "Th", "F", "S"],

  datasets: [
    {
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
      strokeWidth: 2,
      data: [],
    },
  ],
};
const chartConfig = {
  backgroundColor: "red",
  backgroundGradientFrom: "#eff3ff",
  backgroundGradientTo: "#efefef",
  decimalPlaces: 0.1,
  color: (opacity = 1) => `rgba(255, 105, 120, ${opacity})`,
  barPercentage: 1.5,
};

let customFonts = {
  SF: require("../../../assets/fonts/SF/SF-Pro-Rounded-Regular.otf"),
  Black: require("../../../assets/fonts/SF/SF-Pro-Text-Medium.otf"),
};

export default class Progress extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Progress",
    prevScreenTitle: "Login",
  });

  constructor() {
    super();
    this.state = {
      loaded: false,
      results: false,
      child: false,
      fontsLoaded: false,
      actives: 0,
      nonActives: 0,
      days: [],
      loaded: false,
    };

    this.getChild();
    this.getResults();
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  async componentDidMount() {
    this._loadFontsAsync();
  }

  getResults() {
    fetch(Environment + "/getAllRewardsandRoutines/" + userId, {
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
        this.activeRoutines();
        this.days();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getChild() {
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
        results.map((item) => {
          this.setState({ child: item });
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  activeRoutines() {
    let ct = 0;
    let at = 0;
    this.state.results.forEach((item) => {
      if (item.is_active == 1) {
        ct++;
      } else {
        at++;
      }
    });
    this.setState({ actives: ct });
    this.setState({ nonActives: at });
  }

  days() {
    let weeks = [0, 0, 0, 0, 0, 0, 0];

    this.state.results.forEach((item) => {
      if (item.monday === 1) weeks[0]++;
      if (item.tuesday === 1) weeks[1]++;
      if (item.wednesday === 1) weeks[2]++;
      if (item.thursday == 1) weeks[3]++;
      if (item.friday == 1) weeks[4]++;
      if (item.saturday === 1) weeks[5]++;
      if (item.sunday === 1) weeks[6]++;
    });
    data.datasets[0].data = weeks;
  }
  render() {
    if (this.state.fontsLoaded && this.state.loaded) {
      return (
        <View
          style={{
            paddingTop: 20,
            backgroundColor: "#FFFCF9",
            height: HEIGHT,
            width: WIDTH,
          }}
        >
          <View style={styles.partition}>
            <View
              style={{
                borderBottomColor: "white",
                borderBottomWidth: 1,
                width: 500,
                paddingBottom: 10,
                marginBottom: 10,
              }}
            >
              <Text style={styles.partitionTitle}>
                {this.state.child.routines_complete} completed routines
              </Text>
            </View>

            <Text style={styles.partitionText}>
              {this.state.child.first_name} is making progress on routines!
            </Text>
          </View>

          <View style={styles.partitionWhite}>
            <Text style={styles.title2}>
              You have created {this.state.results.length} routines for{" "}
              {this.state.child.first_name}
            </Text>
            <View style={{ flexDirection: "row", paddingTop: 60 }}>
              <View style={styles.progressCircle}>
                <ProgressCircle
                  percent={
                    (this.state.actives / this.state.results.length) * 100
                  }
                  radius={100}
                  borderWidth={8}
                  color="#FF6978"
                  shadowColor="#FFDAB9"
                  bgColor="white"
                >
                  <Text style={{ fontSize: 20, fontFamily: "SF" }}>
                    {(
                      (this.state.actives / this.state.results.length) *
                      100
                    ).toFixed(0)}
                    %
                  </Text>
                </ProgressCircle>
                <Text style={styles.main}>Active Routines</Text>
              </View>
              <View style={styles.progressCircle2}>
                <ProgressCircle
                  percent={
                    (this.state.nonActives / this.state.results.length) * 100
                  }
                  radius={100}
                  borderWidth={8}
                  color="#FF6978"
                  shadowColor="#FFDAB9"
                  bgColor="white"
                >
                  <Text style={{ fontSize: 20, fontFamily: "SF" }}>
                    {(
                      (this.state.nonActives / this.state.results.length) *
                      100
                    ).toFixed(0)}
                    %
                  </Text>
                </ProgressCircle>
                <Text style={styles.main}>Non Active Routines</Text>
              </View>
            </View>
          </View>

          <View style={styles.partitionWhite}>
            <Text style={styles.title2}>Routines for the week</Text>
            <BarChart
              data={data}
              width={WIDTH * 0.8}
              height={300}
              chartConfig={chartConfig}
              verticalLabelRotation={30}
              fromZero={true}
            />
          </View>
        </View>
      );
    } else {
      return <AppLoading />;
    }
  }
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "SF",
    fontSize: 35,
    textAlign: "center",
  },
  main: {
    fontFamily: "SF",
    fontSize: 20,
    textAlign: "center",
    paddingTop: 20,
  },
  partition: {
    paddingLeft: 40,
    marginTop: 10,
    marginLeft: WIDTH * 0.1,
    justifyContent: "center",
    width: WIDTH * 0.8,
    height: 200,
    backgroundColor: "#FF6978",
    borderRadius: 10,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "#c4c4c4",
    shadowOpacity: 0.1,
  },
  partitionWhite: {
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "#c4c4c4",
    shadowOpacity: 0.1,
    marginTop: 20,
    marginLeft: WIDTH * 0.1,
    width: WIDTH * 0.8,
    height: 400,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingTop: 30,
    alignItems: "center",
  },
  partitionText: {
    fontFamily: "SF",
    fontSize: 20,
    color: "white",
  },
  partitionTitle: {
    fontFamily: "Black",
    fontSize: 50,
    color: "white",
  },
  title2: {
    fontFamily: "Black",
    fontSize: 30,
    color: "black",
  },
  progressCircle: {
    paddingRight: 50,
    borderRightWidth: 1,
    borderRightColor: "black",
  },
  progressCircle2: {
    paddingLeft: 50,
    alignItems: "center",
  },
});
