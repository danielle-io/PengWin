import React, { Component } from "react";
import { Text, View, Button, Alert, Image } from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import Logo from '../assets/images/pip.png/';
import { ScrollView } from "react-native-gesture-handler";


export default class ChildPincode extends Component {

  constructor(props) {
    super(props)
    const { navigate } = this.props.navigation;
    this.navigate = navigate;
    
    this.state = {
        prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
        
        //initialize visibility of both dialogs
        visible1: false, visible2: false
    }
   ChildPincode.navigationOptions.headerBackTitle = this.props.navigation.state.params.prevScreenTitle
}

//Header titles for pincode
static navigationOptions = ({ navigation }) => ({
    title: 'Pincode',
  });


  //initial code input value
  state = {
    code: '',
  };
  pinInput = React.createRef();

  //code is 1234
  //TODO: Navigate to parent, Dynamic Code
  _checkCode = (code) => {
    if (code != '12345') {
      this.pinInput.current.shake()
      Alert.alert('PinCode Created!');
      this.setState({ code: '' })
      
    }
    else
    {
      this.setState({ visible1: false, visible2: false});
        //nav to parent
        this.navigate('ParentRoutines', { prevScreenTitle: 'My Routines' });
    }
  }

  render() {
    const { code } = this.state;
    return (
        
            
      <View style={styles.container}>
          <Text style={styles.headingContainer}>PengWin</Text>
          <View style={styles.logoContainer}>
          <Image source={Logo}
          style={styles.logo}>
          </Image>
        </View>
        
           <View style={{marginTop: -600}}></View>
           <ScrollView>
                        <Text style={styles.routineTitle} >                             Hello Parents,</Text>
                        <Text style={styles.routineTitle} >             Please create a 4 digit pincode</Text>
<Text style={styles.routineTitle} >A passcode is required to switch from child </Text>
<Text style={styles.routineTitle} >to parent mode of the app. Please enter a 4</Text>
<Text style={styles.routineTitle} >digit passcode below. This can be changed</Text>
<Text style={styles.routineTitle} >danytime in your settings later on.</Text>



                    </ScrollView>
          <Button
            title="Create Pincode"
            onPress={() => {
              this.setState( {visible1: true });
            }}
          />
        <View style={{marginTop: 100}}></View>
           {/* first dialog - yes/cancel */}
          <Dialog
            visible={this.state.visible1}
            onTouchOutside={() => {
              this.setState({ visible1: false });
            }}
          >
            <DialogContent>

              <Text style={styles.title}>Create Pincode?</Text>
              {/* <Text>This will log you out of the child mode. If you wish to switch from child to parent mode, you will need to enter your 4 digit passcode. Do you wish to continue the switch to parent mode of the app?</Text> */}
              <Button
                onPress={() => {
                  this.setState( {visible2: true });
                }}
                title="Yes"
                color="#841584"
                accessibilityLabel="Yes Button"
              />

              <Button
                onPress={() => {
                  this.setState({ visible1: false });
                }}
                title="Cancel"
                color="#841584"
                accessibilityLabel="Cancel Button"
              />
             

              
            </DialogContent>
          </Dialog>


           {/* second dialog - pin enter */}
          <Dialog
            visible={this.state.visible2}
            onTouchOutside={() => {
              this.setState({ visible2: false });
            }}
          >
            <DialogContent>

              <View style={styles.section}>
                <Text style={styles.title}>Parents Only</Text>
                <Text>Create your 4 digit passcode to switch to parent mode</Text>
                
                
                <SmoothPinCodeInput
                  ref={this.pinInput}
                  keyboardType = 'number-pad'
                  cellStyle={{
                    borderBottomWidth: 2,
                    borderColor: 'gray',
                  }}
                  cellStyleFocused={{
                    borderColor: 'black',
                  }}x
                  value={code}
                  onTextChange={code => this.setState({ code })}
                  onFulfill={this._checkCode}
                  onBackspace={() => console.log('No more back.')}
                  
                />
                <View style={{marginTop: 30}}></View>
                <Text>Next</Text>
              </View>
            </DialogContent>
          </Dialog>
      </View>
      
    );
  }
}

const styles =
{
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    alignItems: 'center',
    margin: 16,
  },
 
  logo:{
    height: 400,
     width: 400,
    alignContent: 'center'
    
  },
  routineTitle: {
    paddingLeft: 5,
    paddingTop: 5,
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
    textAlign: 'left',
    textAlignVertical: 'center'
  },
  headingContainer: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 30,
  },
  logoContainer: {
    marginTop: 100,
    marginBottom: 700,
    alignItems: 'center'
    
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    
  },
};
