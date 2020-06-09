import React, { Component } from "react";
import {
  Dimensions,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  DatePickerIOS,
  ScrollView,
} from "react-native";
import StepIndicator from "react-native-step-indicator";
import Carousel from "react-native-carousel-view";
import { AppLoading } from "expo";
import Environment from "../../../database/sqlEnv";
import RadioForm, {
} from "react-native-simple-radio-button";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

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
        // {"question": "2. What is your child's birthday?"},
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
      datepicker_visible: false,
      chosenDate: new Date(),
      bdaySelected: false,
    };
    this.setDate = this.setDate.bind(this);
  }

  setDate(newDate) {
    this.setState({
      chosenDate: newDate,
      //selected: true
    });
  }

  async postPreference(tag, value) {
    var data = {
      [tag]: value,
    };
    try {
      let response = await fetch(Environment + "/updatePreferences/1", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.status >= 200 && response.status < 300) {
      }
    } catch (errors) {
      alert(errors);
    }
  }

  static navigationOptions = ({ navigation }) => ({
    title: "Questionnaire",
  });

  _onNext = () => {
    this.child._animateNextPage();
  };

  makedatevisible(key) {
    if (key == 1) {
      this.setState({ datepicker_visible: true });
    }
  }

  changeState(choice, item) {
    this.setState({ value: choice });
    this.postPreference(item.tag, choice);
    this.displayQuestions();
  }

  askBday() {
    return (
      <View style={{ backgroundColor: "#FFFCF9" }}>
        <Text style={styles.pageHeader}>Create your child's profile</Text>

        <StepIndicator
          customStyles={customStyles}
          stepCount={4}
          currentPosition={0}
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
            {this.state.questions.map((item, key) => (
              <View>
                <StepIndicator
                  customStyles={customStyles}
                  stepCount={4}
                  currentPosition={key + 1}
                />
                <View key={key}>
                  <Text style={styles.pageBodyText}>{item.question}</Text>
                </View>

                <View style={styles.radioButtons}>
                  <RadioForm
                    radio_props={item.radio_props}
                    initial={-1}
                    buttonColor={"#352D39"}
                    labelStyle={{
                      margin: 8,
                      fontSize: 22,
                      color: "#352D39",
                    }}
                    labelColor={"#352D39"}
                    selectedButtonColor={"#352D39"}
                    onPress={(choice) => {
                      this.changeState(choice, item);
                    }}
                  />
                </View>

                {/* Continue Button */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={
                      this.state.selected
                        ? styles.buttonPrimary
                        : styles.buttonSecondary
                    }
                    onPress={() => {
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
                </View>
              </View>
            ))}
          </Carousel>
        </View>
      );
    }
  }

  render() {
    if (this.state.bdaySelected == false) {
      return <View>{this.askBday()}</View>;
    }

    return (
      <ScrollView style={{ backgroundColor: "#FFFCF9" }}>
        <View>
          <Text style={styles.pageHeader}>Create your child's profile</Text>
        </View>

        <View>{this.displayQuestions()}</View>
      </ScrollView>
    );
  }
}

const pastelRed = "#FF6978";
const spaceBlack = "#352D39";

const styles = StyleSheet.create({
  pageHeader: {
    fontSize: 32,
    color: spaceBlack,
    textAlign: "center",
    margin: 30,
    textTransform: "uppercase",
  },
  pageBodyText: {
    marginTop: "15%",
    color: spaceBlack,
    fontSize: 24,
    textAlign: "center",
  },

  pageBodyContainer: {
    marginTop: "15%",
  },

  radioButtons: {
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
    fontSize: 30,
    fontWeight: "600",
    textAlign: "center",
    color: pastelRed,
  },

  buttonPrimaryText: {
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
  stepIndicatorFinishedColor: "#FF6978",
  stepIndicatorUnFinishedColor: "#C4C4C4",
  stepIndicatorCurrentColor: "#FF6978",
  stepIndicatorLabelCurrentColor: "#FF6978",
  stepIndicatorLabelFinishedColor: "#FF6978",
  stepIndicatorLabelUnFinishedColor: "#C4C4C4",
  labelColor: "#999999",
  margin: "50%",
};
