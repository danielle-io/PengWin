import React, { Component } from 'react';
import Logo from '../assets/images/poop.png/';
import { ScrollView } from "react-native-gesture-handler";
import {
  Alert,
  Button,
  View,
  Text,
  heading,
  ImageBackground,
  Image,
  TextInput,
  Dimensions,
  StyleSheet,

} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const { width: WIDTH } = Dimensions.get('window')


// import Background from '../images/background.png'

export default class SignUp extends Component {


  render() {
    return (
     
      <View>
      
        <View style={{marginTop: 50}}></View>
        <View style={styles.headingContainer}></View>
        <Text style={styles.headingContainer}>PengWin</Text>
        <View style={{marginBottom: 0}}></View>

        <View style={styles.logoContainer}>
          <Image source={Logo}
          style={styles.logo}>
          </Image>
        </View>



        {/* Container for username and password form */}
        <View style={styles.loginContainer}>

          {/* Username form */}
          <View style={styles.userLoginForm}>
            <Image
              source={require('../assets/icons/user.png')} //Change your icon image here
              style={styles.loginIcons}
            />

            <TextInput 
              style={{ flex: 1 }}
              borderColor='transparent'
              placeholder="First Name or Username"
              underlineColorAndroid='transparent'

            />
         </View>

          <View style={styles.userLoginForm}>
          <Image
              source={require('../assets/icons/user.png')} //Change your icon image here
              style={styles.loginIcons}
          />

            <TextInput
              style={{ flex: 1 }}
              placeholder="Email ID"
            />
            </View>

          {/* Password form */}
          <View style={styles.userLoginForm}>
            <Image
              source={require('../assets/icons/password.png')} //Change your icon image here
              style={styles.loginIcons}
            />

            <TextInput
              style={{ flex: 1 }}
              placeholder="Please choose a password"
             
            // underlineColorAndroid="transparent"
            />
          </View>

          {/* Re-enter password form */}
          <View style={styles.userLoginForm}>
          <Image
              source={require('../assets/icons/password.png')} //Change your icon image here
              style={styles.loginIcons}
          />

            <TextInput
              style={{ flex: 1 }}
              placeholder="Please re-enter your password"
            />
            </View>
            

            <View style={styles.loginButton}>

            <View style={styles.buttonContainer}>
            <View style={
                { flex: 1, flexDirection: 'row', justifyContent: 'space-around' }
            } >
                <View style={ {flex: 1},
                    styles.routines
                }
                    onStartShouldSetResponder={() =>this.props.navigation.navigate('Pincode',{
                                })
                    } >
                    <ScrollView>
                        <Text style={styles.routineTitle} >Next</Text>
                    </ScrollView>
                </View>
              </View>
      </View>
      </View>
      </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  userLoginForm: {
    width: WIDTH - 300,
    height: 45,
    borderRadius: 15,
    borderStyle: 'solid',
    borderColor: '#d6d7da',
    borderWidth: 5,
    fontSize: 12,
    color: 'black',
    marginBottom: 45,
    overflow: 'hidden',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  placeholder: {
    color: 'black'
  },
  logo: {
    alignContent: 'center'
  },
  buttonContainer: {
    marginTop: 100,
    fontSize: 200,
  },
  loginButton: {
    marginTop: 20,
    width: 50,
    alignSelf: 'center'
  },
  loginContainer: {
    marginBottom: 90,
    marginTop: 20,
  },
  headingContainer: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
  },
  loginIcons: {
    padding: 12,
    margin: 5,
    height: 20,
    width: 20,
    opacity: .2,
    alignItems: 'center',
  },
  backgroundContainer: {
    flex: 1,
    width: null,
    height: null,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: WIDTH - 110,
    height: 35,
    borderRadius: 5,
    fontSize: 10,
    paddingLeft: 45,
    borderWidth: 0.5,
    color: 'black',
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderColor: '#d6d7da',
    borderWidth: 4,
    marginBottom: 6,
    overflow: 'hidden',
  },
  logoContainer: {
    marginTop: 30,
    marginBottom: 80,
    alignItems: 'center'
    
  },
  forgotPassword: {
    fontSize: 16,
    letterSpacing: .3,
    lineHeight: 38,
    alignSelf: 'center',
    color: 'blue',
  },
  generalText: {
    paddingTop: 30,
    fontSize: 16,
    lineHeight: 38,
    textAlign: 'center',
    color: 'black',
  },
  logo:{
    height: 200,
     width: 200,
    alignContent: 'center'
    
  },
  routines: {
    paddingLeft: 29,
    textAlignVertical: 'center',
    width: WIDTH * .18,
    height: 45,
    marginTop: 20 ,
    marginBottom: 5,
    borderWidth: 2,
    borderRadius: 5,
    backgroundColor: 'pink',
    shadowOffset:{  width: 5,  height: 5,  },
    shadowColor: 'black',
    shadowOpacity: .1,
    borderWidth: 0
},
routineTitle: {
  paddingLeft: 5,
  paddingTop: 5,
  fontSize: 30,
  marginLeft: 10,
  textAlign: 'left',
  textAlignVertical: 'center'
},
  createAccount: {
    fontSize: 16,
    lineHeight: 38,
    textAlign: 'center',
    color: '#223a7a',
    textDecorationLine: 'underline',
  },
});
