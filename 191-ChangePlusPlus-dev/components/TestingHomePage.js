// This page is esentially our Link Tree to test pages
import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

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

      <View style={{ marginTop: 50 }}>
        <View style={{ justifyContent: 'center', flexDirection: 'row', marginBottom: 30, }}>

          <Text style={styles.testingh2}>PARENT SCREENS</Text>

        </View>
        <View style={{ flex: 1, marginBottom: 100, justifyContent: 'space-around', flexDirection: 'row', flexWrap: 'wrap' }}>


          <View style={styles.parentContainer}>
            <Text style={styles.linkText}
              onPress={() => this.navigate('ParentRoutines', { prevScreenTitle: 'TestingHomePage' })}>
              Parent / Routines Page
            </Text>
          </View>

          <View style={styles.parentContainer}>
            <Text style={styles.linkText}
              onPress={() => this.navigate('ParentNavigation', {
                prevScreenTitle: 'TestingHomePage',
                initialRouteName: 'ParentRoutines'
              })}>
              Parent Navigation Page
            </Text>
          </View>

          <View style={styles.parentContainer}>
            <Text style={styles.linkText}
              onPress={() => this.navigate('Activity', {
                prevScreenTitle: 'TestingHomePage',
                initialRouteName: 'ParentRoutines'
              })}>
              Parent Activity Page
            </Text>
          </View>



          <View style={styles.parentContainer}>
            <Text style={styles.linkText}
              onPress={() => this.navigate('ParentProfile', { prevScreenTitle: 'TestingHomePage' })}>
              Parent's Profile
            </Text>
          </View>

          <View style={styles.parentContainer}>
            <Text style={styles.linkText}
              onPress={() => this.navigate('ParentRewards', { prevScreenTitle: 'TestingHomePage' })}>

              Parent Rewards Page
            </Text>
          </View>

          <View style={styles.parentContainer}>
            <Text style={styles.linkText}
              onPress={() => this.navigate('Progress', { prevScreenTitle: 'TestingHomePage' })}>

              Parent Progress Page
            </Text>
          </View>
        </View>


        <View style={{ flex: 1, marginTop: 200, marginBottom: 50, justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>

          <Text style={styles.testingh2}>CHILD SCREENS</Text>

        </View>

        <View style={{ flex: 1, marginBottom: 100, textAlign: 'center', justifyContent: 'space-around', flexDirection: 'row', flexWrap: 'wrap' }}>

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

        <View style={{ flex: 1, marginTop: 80, justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>

          <Text style={styles.testingh2}>LOGIN + OTHER SCREENS</Text>

        </View>

        <View style={{ flex: 1, marginTop: 60, justifyContent: 'space-between', flexDirection: 'row', flexWrap: 'wrap' }}>

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
    );
  }
}

const styles = StyleSheet.create({
  parentContainer: {
    width: 180,
    height: 80,
    backgroundColor: 'powderblue',
    marginLeft: 30,
    marginRight: 30,
    borderWidth: 2,
    marginBottom: 7,
    marginTop: 10,
    borderRadius: 20,
    marginBottom: 40,
  },
  childContainer: {
    alignContent: 'center',
    textAlignVertical: 'center',
    textAlign: 'center',
    backgroundColor: '#fef3bd',
    width: 180,
    height: 80,
    marginLeft: 30,
    marginRight: 30,
    borderWidth: 2,
    marginBottom: 7,
    marginTop: 10,
    borderRadius: 20,
  },
  otherContainer: {
    backgroundColor: '#dba9d7',
    width: 180,
    height: 80,
    marginLeft: 30,
    marginRight: 30,
    borderWidth: 2,
    marginBottom: 7,
    marginTop: 10,
    borderRadius: 20,
    marginBottom: 40,
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
    // lineHeight: 30,
    textAlign: 'center',
    color: 'black',
    // textDecorationLine: 'underline',
    marginBottom: 5,
    marginTop: 5,
  },
});