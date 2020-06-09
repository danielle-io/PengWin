import React, { Component } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import Mamanbaby from "../assets/images/mamanbaby.png";
import { LinearGradient } from "expo-linear-gradient";
import { AppLoading } from "expo";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

export default class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <LinearGradient
          colors={["#D7CBD2", "#FFFCF9"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: screenHeight,
          }}
        />
        {/* <LinearGradient colors={['#D7CBD2','#FFFCF9']}> </LinearGradient> */}
        <Text style={styles.titleText}>PengWin</Text>

        <Image
          source={Mamanbaby}
          style={{
            alignSelf: "center",
            justifyContent: "center",
            marginTop: "20%",
          }}
        />

        <Text style={styles.pageBodyText}>Are you a</Text>

        <View style={{ alignItems: "flex-end", flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() => {
              this.navigate("SignUp", { prevScreenTitle: "Back" });
            }}
          >
            <View>
              <Text style={styles.buttonPrimaryText}>Parent</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.buttonPrimary,
              {
                backgroundColor: "#B1EDE8",
                borderColor: "#B1EDE8",
                marginRight: 80,
              },
            ]}
            onPress={() => {
              this.navigate("SignUp", { prevScreenTitle: "Back" });
            }}
          >
            <View>
              <Text style={[styles.buttonPrimaryText, { color: "#5A5A5A" }]}>
                Child
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const pastelRed = "#FF6978";
const spaceBlack = "#352D39";

const styles = StyleSheet.create({
  titleText: {
    fontSize: 40,
    fontWeight: "800",
    color: spaceBlack,
    textAlign: "center",
    marginTop: "20%",
  },
  pageBodyText: {
    fontSize: 28,
    color: spaceBlack,
    textAlign: "center",
    margin: 30,
    textTransform: "uppercase",
  },
  buttonPrimary: {
    backgroundColor: pastelRed,
    borderRadius: 30,
    width: 290,
    height: 60,
    paddingVertical: 10,
    paddingHorizontal: 76,
    borderWidth: 2,
    borderColor: pastelRed,
    alignContent: "center",
    marginLeft: 80,
  },
  buttonPrimaryText: {
    fontSize: 30,
    fontWeight: "600",
    textAlign: "center",
    color: "white",
  },
});
