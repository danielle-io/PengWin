import React, { Component } from "react";
import {
  Dimensions,
  View,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  DatePickerIOS,
  ScrollView,
} from "react-native";
// import MobileStepper from "@bit/mui-org.material-ui.mobile-stepper";
// import * as Font from "expo-font";
import StepIndicator from "react-native-step-indicator";
import Carousel from "react-native-carousel-view";
import { AppLoading } from "expo";
import Environment from "../../../database/sqlEnv";

import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button";

import UserInfo from "../../../state/UserInfo";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
const parentId = UserInfo.parent_id;
const childId = UserInfo.child_id;
const userId = UserInfo.user_id;
const pincode = UserInfo.pincode;

export default class Questionnaire extends Component {
  constructor(props) {
    super(props);
    const { navigate } = this.props.navigation;
    this.navigate = navigate;
    this.state = {
      questions: [
        {
          question: "2. What is your child's gender?",
          radio_props: [
            { label: "Male", value: 0 },
            { label: "Female", value: 1 },
            { label: "NonBinary", value: 2 },
            { label: "Other", value: 3 },
          ],
          tag: "gender",
        },
        {
          question: "3. How would you describe your child's reading ability?",
          radio_props: [
            { label: "Reads well", value: 0 },
            {
              label: "Can read but needs visuals for better understanding",
              value: 1,
            },
            { label: "Cannot read", value: 2 },
          ],
          tag: "reading_ability",
        },
        {
          question: "4. How would you describe your child's language ability?",
          radio_props: [
            { label: "Verbal", value: 0 },
            { label: "Non-verbal but can say Yes/No", value: 1 },
            { label: "Can speak but not everyone understands", value: 2 },
            { label: "Cannot speak but knows words", value: 3 },
            { label: "Non verbal", value: 4 },
          ],
          tag: "language_ability",
        },
      ],
      questionsLoaded: false,
      prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
      selected: false,
      datepicker_visible: false,
      chosenDate: new Date(),
      bdaySelected: false,
    };
    this.setDate = this.setDate.bind(this);
  }

  setDate(newDate) {
    this.setState({ chosenDate: newDate, selected: true });
  }

  getButtonColor(buttonValue) {
    console.log("getting button color");
    if (buttonValue) {
      console.log("returning primary");
      return styles.buttonPrimary;
    }
    return styles.buttonSecondary;
  }

  async postPreference(tag, value) {
    var data = {
      [tag]: value,
    };
    fetch(Environment + "/updatePreferences/" + userId, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("success");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  static navigationOptions = ({ navigation }) => ({
    title: "Questionnaire",
    prevScreenTitle: "Back",
  });

  _onNext = () => {
    console.log("CHILD" + this.child);
    this.setState({ selected: false });
    this.child._animateNextPage();
  };

  makedatevisible(key) {
    if (key == 1) {
      this.setState({ datepicker_visible: true });
    }
  }

  changeState(choice, item) {
    console.log("selected is: " + this.state.selected);
    this.setState({ value: choice });
    this.setState({ selected: true });
    this.postPreference(item.tag, choice);
    this.loadButton(true);
  }

  askBday() {
    return (
      <View style={{ backgroundColor: "#FFFCF9" }}>
        <Text style={styles.pageHeader}>Create your child's profile</Text>

        <StepIndicator
          customStyles={customStyles}
          stepCount={4}
          currentPosition={0}
          // labels={labels}
        />

        <Text style={styles.pageBodyText}>
          1. What is your child's birthday?
        </Text>

        <DatePickerIOS
          date={this.state.chosenDate}
          onDateChange={this.setDate}
          mode={"date"}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={
              this.state.selected
                ? styles.buttonPrimary
                : styles.buttonSecondary
            }
            onPress={() => {
              this.setState({
                bdaySelected: true,
                selected: false,
              });
              console.log("type", typeof this.state.chosenDate);
              console.log(
                "valueee",
                String(Number(this.state.chosenDate.getMonth() + 1))
              );
              this.postPreference(
                "birthdate",
                this.state.chosenDate.getFullYear() +
                  "-" +
                  String(Number(this.state.chosenDate.getMonth() + 1)) +
                  "-" +
                  this.state.chosenDate.getDate()
              );
            }}
          >
            <View>
              <Text
                style={
                  this.state.selected
                    ? styles.buttonPrimaryText
                    : styles.buttonSecondaryText
                }
              >
                Continue
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  loadButton(buttonValue) {
    console.log("selected is " + this.state.selected);
    return (
      <TouchableOpacity
        style={this.getButtonColor(buttonValue)}
        onPress={() => {
          console.log("value", this.state.value);
          // this.setState({ selected: false });
          this._onNext();
        }}
      >
        <Text
          style={
            this.state.selected
              ? styles.buttonPrimaryText
              : styles.buttonSecondaryText
          }
        >
          Continue
        </Text>
      </TouchableOpacity>
    );
  }

  displayQuestions() {
    if (this.state.questions) {
      return (
        <View>
          <Carousel
            height={HEIGHT * 0.9}
            hideIndicators={true}
            indicatorSize={20}
            animate={false}
            onRef={(ref) => (this.child = ref)}
          >
            {this.state.questions.map(
              (item, key) => (
                console.log("key " + key),
                (
                  <View>
                    <StepIndicator
                      customStyles={customStyles}
                      stepCount={4}
                      currentPosition={key + 1}
                      // labels={labels}
                    />
                    <View key={key}>
                      <Text style={styles.pageBodyText}>{item.question}</Text>
                    </View>

                    <View style={styles.radioButtons}>
                      <RadioForm
                        onChange={() => {
                          this.setState({ selected: true });
                        }}
                        radio_props={item.radio_props}
                        initial={-1}
                        value={this.state.choice}
                        buttonColor={"#352D39"}
                        labelStyle={{
                          margin: 8,
                          fontSize: 22,
                          color: "#352D39",
                        }}
                        // labelWrapStyle ={{lineHeight: 5}}
                        labelColor={"#352D39"}
                        selectedButtonColor={"#352D39"}
                        onPress={(choice) => {
                          this.changeState(choice, item);
                        }}
                      />
                    </View>

                    {/* Continue Button */}
                    <View style={styles.buttonContainer}>
                      {this.loadButton(this.state.selected)}
                    </View>
                  </View>
                )
              )
            )}
          </Carousel>
        </View>
      );
    }
  }

  render() {
    // this.getQuestions();
    // if (this.state.questionsLoaded=true) {
    if (this.state.bdaySelected == false) {
      return <View>{this.askBday()}</View>;
    }

    return (
      console.log("LOAD " + this.state.questions),
      (
        <ScrollView style={{ backgroundColor: "#FFFCF9" }}>
          <View>
            <Text style={styles.pageHeader}>Create your child's profile</Text>
          </View>

          <View>{this.displayQuestions()}</View>
        </ScrollView>
      )
    );
  }
}

// }

const pastelRed = "#FF6978";
const spaceBlack = "#352D39";

const styles = StyleSheet.create({
  pageHeader: {
    // fontFamily: 'SF',
    fontSize: 32,
    color: spaceBlack,
    textAlign: "center",
    margin: 30,
    textTransform: "uppercase",
  },

  pageBodyText: {
    // fontFamily: 'SF-Pro-Rounded-Medium',
    marginTop: "15%",
    color: spaceBlack,
    fontSize: 24,
    textAlign: "center",
  },

  pageBodyContainer: {
    marginTop: "15%",
  },

  radioButtons: {
    // fontFamily: 'SF-Pro-Rounded-Regular',
    fontSize: 24,
    textAlign: "center",
    marginLeft: "20%",
    marginTop: "5%",
  },

  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    marginBottom: 800,
  },

  buttonSecondary: {
    alignContent: "center",
    borderRadius: 30,
    width: 290,
    height: 60,
    paddingVertical: 10,
    paddingHorizontal: 76,
    borderWidth: 2,
    borderColor: pastelRed,
    backgroundColor: "white",
    marginTop: "45%",
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
    marginTop: "45%",
  },

  buttonSecondaryText: {
    // fontFamily: 'SF-Pro-Rounded-Semibold',
    fontSize: 30,
    fontWeight: "600",
    textAlign: "center",
    color: pastelRed,
  },

  buttonPrimaryText: {
    // fontFamily: 'SF-Pro-Rounded-Semibold',
    fontSize: 30,
    fontWeight: "600",
    textAlign: "center",
    color: "white",
  },
});

const customStyles = {
  stepIndicatorSize: 20,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 0,
  currentStepStrokeWidth: 2,
  stepStrokeCurrentColor: "#FF6978",
  stepStrokeWidth: 1,
  stepStrokeFinishedColor: "#FF6978",
  stepStrokeUnFinishedColor: "#C4C4C4",
  // separatorFinishedColor: '#fe7013',
  // separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: "#FF6978",
  stepIndicatorUnFinishedColor: "#C4C4C4",
  stepIndicatorCurrentColor: "#FF6978",
  // stepIndicatorLabelFontSize: 13,
  // currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: "#FF6978",
  stepIndicatorLabelFinishedColor: "#FF6978",
  stepIndicatorLabelUnFinishedColor: "#C4C4C4",
  labelColor: "#999999",
  margin: "50%",
  // labelSize: 13,
  // currentStepLabelColor: '#fe7013'
};
