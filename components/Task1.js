import React, {Component} from 'react';
import Logo from '../assets/images/toothbrush.png/';
import Pogo from '../assets/images/elephant.gif/';
import {ScrollView} from 'react-native-gesture-handler';
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

const {width: WIDTH} = Dimensions.get('window');

// import Background from '../images/background.png'

export default class Task1 extends Component {
  render() {
    return (
      <View>
        <View style={{marginTop: 50}} />
        <View style={styles.headingContainer} />
        <Text style={styles.headingContainer}>1. Brush Teeth</Text>
        <Text style={styles.smallText}>Image taken by Alex</Text>
        <View style={{marginBottom: 0}} />

        {/* <View style={styles.pogoContainer}>
          <Image source={Pogo}
          style={styles.logo}>
          </Image>
          </View> */}
     
        <View style={styles.logoContainer}>
          <Image source={Logo}
          style={styles.logo}>
          </Image>
          {/* <Text style={styles.rewardsContainer}>Rewards Recieved</Text> */}

        </View>

        <View style={ {flex: 2},styles.routines}
             onStartShouldSetResponder={() =>this.props.navigation.navigate('Task2',{
            })} >
         <ScrollView><Text style={styles.routineTitle} >></Text></ScrollView>
        </View>


        </View>
    )
 }
}

const styles = StyleSheet.create({
  headingContainer: {
    marginRight: 10,
    marginLeft:39,
    fontSize: 25,
    fontWeight: 'bold',
  },
  routineTitle: {
    marginLeft: -39,
    marginTop: -25,
    fontSize: 90,
    color: 'hsl(265, 32%, 57%)',
    textAlign: 'center',
    flex: 2,
  },
  rewardsContainer: {
    marginRight: 10,
    marginLeft:-519,
    fontSize: 25,
    marginTop: 350,
  },
  
  smallText:{
    marginTop: 15,
    fontSize: 19,
    marginLeft:39,
  },
  logoContainer: {
    marginTop: 30,
    marginBottom: 700,
    alignItems: 'center'
  },
  logo:{
    height: 240,
     width: 240,
    alignContent: 'center'
  },
  routines: {
    paddingLeft: 29,
    textAlignVertical: 'center',
    width: 70,
    height: 70,
    marginTop: -70 ,
    marginBottom: 90,
    marginLeft: 700,
    borderWidth: 9,
    borderRadius: 100,
    backgroundColor: 'pink',
    shadowOffset:{  width: 5,  height: 5,  },
    shadowColor: 'black',
    shadowOpacity: .1,
    borderWidth: 1
},
  
});
