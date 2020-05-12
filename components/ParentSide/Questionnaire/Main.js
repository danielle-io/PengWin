import React, { Component } from "react";
import { View, Button, StyleSheet, Text, TouchableOpacity} from 'react-native';
// import MobileStepper from "@bit/mui-org.material-ui.mobile-stepper";
// import * as Font from "expo-font";
import StepIndicator from 'react-native-step-indicator';
import Carousel from "react-native-carousel-view";
import { AppLoading } from "expo";
import Environment from "../../../database/sqlEnv";


import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import Question1 from './Question1';
import Question2 from './Question2';

export default class Questionnaire extends Component {
    constructor(props) {
        super(props);

        // this.postPreference("gender", 2);

        const { navigate } = this.props.navigation;
        this.navigate = navigate;
        this.state = {
            prevScreenTitle: this.props.navigation.state.params.prevScreenTitle}
      }

    static navigationOptions = ({ navigation }) => ({
        title: 'Questionnaire',
        prevScreenTitle: 'Back'
    });

    

    render () {
        return (
            <View>
            <Question1/>

            {/* <TouchableOpacity
                style= {Question1.state.selected
                        ? styles.buttonPrimary
                        : styles.buttonSecondary}

                // onPress={() => { this.navigation.navigate("Question2"); console.log("valueee", this.state.value); console.log("clickkk")}}
                >
                <View>
                <Text style={Question1.state.selected
                        ? styles.buttonPrimaryText
                        : styles.buttonSecondaryText}>Continue</Text>
                </View>
                
            </TouchableOpacity> */}

            <Question2/>

            </View>
            
        )
    }

}

const pastelRed = '#FF6978';
const spaceBlack = '#352D39';

const styles = StyleSheet.create({
    pageHeader: {
        // fontFamily: 'SF',
        fontSize: 32,
        color: spaceBlack,
        textAlign: 'center',
        margin: 30,
        textTransform: 'uppercase'
    },

    pageBodyText: {
        // fontFamily: 'SF-Pro-Rounded-Medium',
        color: spaceBlack,
        fontSize: 24,
        textAlign: 'center',
    },

    pageBodyContainer: {
        marginTop: '15%'
    },
    
    radioButtons: {
        // fontFamily: 'SF-Pro-Rounded-Regular',
        fontSize: 24,
        textAlign: 'center',
        marginLeft: '40%',
        marginTop: '5%'
    },

    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        display: "flex",
        marginBottom: 800
    },

    buttonSecondary: {
        alignContent: 'center',
        borderRadius: 30,
        width: 290,
        height: 60,
        paddingVertical: 10,
        paddingHorizontal: 76,
        borderWidth: 2,
        borderColor: pastelRed,
        backgroundColor: 'white',
        marginTop: '45%'
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
        alignContent: 'center',
        marginTop: '45%'
      },
    
      buttonSecondaryText: {
        // fontFamily: 'SF-Pro-Rounded-Semibold',
        fontSize: 30,
        fontWeight: "600",
        textAlign: 'center',
        color: pastelRed
      },
    
      buttonPrimaryText: {
        // fontFamily: 'SF-Pro-Rounded-Semibold',
        fontSize: 30,
        fontWeight: "600",
        textAlign: 'center',
        color: 'white'
      }
    
})

const customStyles = {
    stepIndicatorSize: 20,
    currentStepIndicatorSize:30,
    separatorStrokeWidth: 0,
    currentStepStrokeWidth: 2,
    stepStrokeCurrentColor: '#FF6978',
    stepStrokeWidth: 1,
    stepStrokeFinishedColor: '#FF6978',
    stepStrokeUnFinishedColor: '#C4C4C4',
    // separatorFinishedColor: '#fe7013',
    // separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#FF6978',
    stepIndicatorUnFinishedColor: '#C4C4C4',
    stepIndicatorCurrentColor: '#FF6978',
    // stepIndicatorLabelFontSize: 13,
    // currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#FF6978',
    stepIndicatorLabelFinishedColor: '#FF6978',
    stepIndicatorLabelUnFinishedColor: '#C4C4C4',
    labelColor: '#999999',
    margin: '50%'
    // labelSize: 13,
    // currentStepLabelColor: '#fe7013'
  }