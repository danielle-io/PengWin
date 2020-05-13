import React, { Component } from "react";
import { Dimensions,
  View, 
  Button, 
  StyleSheet, 
  Text, 
  TouchableOpacity,
  ScrollView} from 'react-native';
// import MobileStepper from "@bit/mui-org.material-ui.mobile-stepper";
// import * as Font from "expo-font";
import StepIndicator from 'react-native-step-indicator';
import Carousel from "react-native-carousel-view";
import { AppLoading } from "expo";
import Environment from "../../../database/sqlEnv";


import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import Question1 from './Question1';
import Question2 from './Question2';

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
// var questions = ["abc","efg","def"]


var radio_props = [
    {label: 'Male', value: 0 },
    {label: 'Female', value: 1 },
    {label: 'NonBinary', value: 2 },
    {label: 'Other', value: 3 }
  ];

export default class Questionnaire extends Component {
    constructor(props) {
        super(props);
        const { navigate } = this.props.navigation;
        this.navigate = navigate;
        // questions = ["abc","efg","def"]
        this.state = {
            questions: ["1. What is your child's gender?","efg","def"],
            quesComponents:[Question1,Question2],
            questionsLoaded: false,
            prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
            selected: false,
            currentPosition: 0
        };
            
    }

    async postPreference(tag, value){
        var data = {
          [tag]: value,
        };
        try {
          let response = await fetch(Environment + "/updatePreferences/1" , {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          
          if (response.status >= 200 && response.status < 300) {
            console.log("POSTED")
          }
        } catch (errors) {
          alert(errors);
        }
      }

    static navigationOptions = ({ navigation }) => ({
        title: 'Questionnaire',
        prevScreenTitle: 'Back'
    });

    // async componentDidMount() {

    //     this.props.navigation.addListener("didFocus", (payload) => {
    //         this.getQuestions();
    //       });
    //     // this.getQuestions();
    // }

    getQuestions() {
        this.setState({questions: ["abc","efg","def"]});
        this.setState({questionsLoaded: true})
    }

    _onNext = () => {
        // key = key+1
        this.child._animateNextPage();
      };
    
    
    render () {
        // this.getQuestions();
        // if (this.state.questionsLoaded=true) {
            return (

                // console.log("SAWAAL" + this.state.questions),
                // console.log("SAWAAL" + this.state.questionsLoaded),
                console.log("SAWAAL LOAD" + this.state.questions),

                // <View>
                // <Text>HEllo, why aren't you working?</Text>
                //         {/* {this.state.questions.map((key)=>(
                //         <Text key={key} style={styles.pageBodyText}> KYAAA </Text>)
                //         )}
                //     )} */}
                // </View>
                // {this.state.questions.map(key) => (
                //     <Text>{key}</Text>
                // )}
    
                // <View>
                //     <Text>CAN YOU WORK PLEASE</Text>
                // </View>
                <ScrollView style={{backgroundColor:"#FFFCF9"}}>
                <View >
                    <Text style={styles.pageHeader}>Create your child's profile</Text>
                </View>

                <StepIndicator
                        customStyles={customStyles}
                        stepCount= {4}
                        currentPosition={this.state.currentPosition}
                        // labels={labels}
                    />
                <Carousel
                height={HEIGHT * 0.9}
                hideIndicators={true}
                indicatorSize={20}
                animate={false}
                onRef={(ref) => (this.child = ref)}
              >

              {/* <View>
                  <Text key={key}>{this.state.questions[1]}</Text>
              </View>

              <View>
                  <Text>Page 2</Text>
              </View> */}
    
              {this.state.questions.map((item, key) => (
                  console.log("key " + key),
                  <View>
                  {/* <ScrollView> */}
                  <View
                  key={key}>
                  {/* <Question ques={item}/> */}
                  {/* <Question1/> */}
                  <Text style={styles.pageBodyText}>{item}</Text>
                  </View>
                  {/* </ScrollView> */}

                  <View style={styles.radioButtons}>

                  <RadioForm 
                  radio_props={radio_props}
                  initial={0}
                  buttonColor={'#352D39'}
                  labelStyle={{margin: 8, fontSize: 22, color: '#352D39'}}
                  // labelWrapStyle ={{lineHeight: 5}}
                  labelColor={'#352D39'}
                  selectedButtonColor={'#352D39'}
                  onPress={(choice) => {this.setState({value:choice}); this.state.selected = true; this.postPreference("gender",choice)} }
                  //it shows the value of previously selected choice. don't know why¯\_(ツ)_/¯
                  />
                  </View>
                  {/* Continue Button */}
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                    style= {this.state.selected
                            ? styles.buttonPrimary
                            : styles.buttonSecondary}

                    onPress={() => { 
                        console.log("valueee", this.state.value); 
                        console.log("clickkk")
                        key = key + 1;
                        this._onNext();
                        console.log("key changed: " + key)
                        // this.navigation.navigate("Question2"); 
                        
                        }}
                    >
               
                    <Text style={this.state.selected
                            ? styles.buttonPrimaryText
                            : styles.buttonSecondaryText}>Continue</Text>
                    
                    </TouchableOpacity>
                    </View>

                  </View>

                  
                  
                

                
              ))
              }
    
              </Carousel>
              </ScrollView>
    
               
                
            )
        }
        
    }

// }

const Question = (props) => <Text>{props.item}</Text>

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