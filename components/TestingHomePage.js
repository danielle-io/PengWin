// This page is esentially our Link Tree to test pages
import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default class TestingHomePage extends Component {
  constructor(props) {
    super(props)
    const { navigate } = this.props.navigation;
    this.navigate = navigate;
  }

  static navigationOptions = {
    title: 'TestingHomePage',
    headerShown: false,
    headerVisible: false,
  };

  render() {
    let ripple = { id: 'submitButton' };
    return (

      <View style={styles.container}>
        <View style={styles.textWrapper}>

          {/* <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <Text style={styles.testingh2}>PARENT SCREENS</Text>
          </View> */}

          <View style={{ flex: 1, justifyContent: 'space-around', flexDirection: 'row', flexWrap: 'wrap' }}>

            <TouchableOpacity style={styles.parentContainer}>
              <Text style={styles.linkText}
                onPress={() => this.navigate('ParentRoutines', { prevScreenTitle: 'TestingHomePage' })}>
                Parent / Routines Page
            </Text>
            </TouchableOpacity>

            <View style={styles.parentContainer}>
              <Text style={styles.linkText}
                onPress={() => this.navigate('ParentNavigation', {
                  prevScreenTitle: 'TestingHomePage',
                  initialRouteName: 'ParentRoutines'
                })}>
                Parent Navigation Page
            </Text>
            </View>

            <TouchableOpacity style={styles.parentContainer}>
              <Text style={styles.linkText}
                onPress={() => this.navigate('ParentProfile', { prevScreenTitle: 'TestingHomePage' })}>
                Parent's Profile
            </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.parentContainer}>
              <Text style={styles.linkText}
                onPress={() => this.navigate('ParentRewards', { prevScreenTitle: 'TestingHomePage' })}>

                Parent Rewards Page
            </Text>
            </TouchableOpacity>

            < TouchableOpacity style={styles.parentContainer}>
              <Text style={styles.linkText}
                onPress={() => this.navigate('Progress', { prevScreenTitle: 'TestingHomePage' })}>

                Parent Progress Page
            </Text>
            </TouchableOpacity>
          </View>


          {/* <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }}> */}
          {/* <Text style={styles.testingh2}>CHILD SCREENS</Text> */}
          {/* </View> */}

          <View style={{ flex: 1, justifyContent: 'space-around', flexDirection: 'row', flexWrap: 'wrap' }}>

            <TouchableOpacity style={styles.childContainer}
              onPress={() => this.navigate(
                'ChildRoutines',
                { prevScreenTitle: 'Login' })}>

              <Text style={styles.linkText}>
                Child Routines
          </Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.childContainer}
              onPress={() => this.navigate('ChildActivity', { prevScreenTitle: 'ChildRoutine' })}>
              <Text style={styles.linkText}>
                Child Activity
            </Text>
            </TouchableOpacity>

          </View>

          {/* <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>

            <Text style={styles.testingh2}>LOGIN + OTHER SCREENS</Text>

          </View> */}

          <View style={{ flex: 1, justifyContent: 'space-around', flexDirection: 'row', flexWrap: 'wrap' }}>

          <TouchableOpacity onPress={() => this.navigate('irDemo', { prevScreenTitle: 'irDemo' })}
              style={styles.otherContainer}>
              <Text style={styles.linkText}>
                irDemo
           </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.navigate('Login', { prevScreenTitle: 'TestingHomePage' })}
              style={styles.otherContainer}>
              <Text style={styles.linkText}>
                Login Page
           </Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.otherContainer}
              onPress={() => this.navigate('SignUp', { prevScreenTitle: 'Login' })}>

              <Text style={styles.linkText}>
                Sign Up Page
              </Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.otherContainer}
              onPress={() => this.navigate('ForgotPassword', { prevScreenTitle: 'TestingHomePage' })}>


              <Text style={styles.linkText}>
                Forgot Password does not exist
          </Text>
            </TouchableOpacity>

            <View style={styles.otherContainer}>

              <Text style={styles.linkText}
                onPress={() => this.navigate('Camera', { prevScreenTitle: 'TestingHomePage' })}>
                Camera
              </Text>
            </View>
          </View>

        </View>
      </View >


    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1 ,
    marginTop: '15%',
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto',
  },
  textWrapper: {
    height: hp('70%'), // 70% of height device screen
    width: wp('70%')   // 80% of width device screen
  },
  myText: {
    fontSize: hp('5%') // End result looks like the provided UI mockup
  },
  parentContainer: {
    width: 180,
    height: 80,
    backgroundColor: 'powderblue',
    marginLeft: 30,
    marginRight: 30,
    borderWidth: 2,
    borderRadius: 20,
    marginBottom: '5%',
  },
  childContainer: {
    textAlign: 'center',
    backgroundColor: '#fef3bd',
    width: 180,
    height: 80,
    marginLeft: 30,
    marginRight: 30,
    borderWidth: 2,
    borderRadius: 20,
    marginBottom: '5%',
    marginTop: '5%',
  },
  otherContainer: {
    backgroundColor: '#dba9d7',
    width: 180,
    height: 80,
    marginLeft: 30,
    marginRight: 30,
    borderWidth: 2,
    borderRadius: 20,
    marginBottom: '5%',
  },
  testingh1: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 20,
    marginBottom: 40,
    paddingTop: 40,
  },
  testingh2: {
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 25,
    fontWeight: 'bold',
  },
  linkText: {
    fontSize: 20,
    alignContent: 'center',
    textAlignVertical: 'center',
    textAlign: 'center',
    color: 'black',
    marginBottom: 5,
    marginTop: 5,
  },
});