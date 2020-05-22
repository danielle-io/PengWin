import React, { Component } from 'react';
import {
  Alert,
  Text,
  View,
  Image,
  TextInput,
  Dimensions,
  StyleSheet,
} from 'react-native';

import Logo from '../assets/images/penguin.png/';
import { RaisedTextButton } from 'react-native-material-buttons';

const { width: WIDTH } = Dimensions.get('window')

export default class Login extends Component {
  state = { email: '', password: '', errorMessage: null }
  handleLogin = () => {
    console.log('handleLogin')
  }
  constructor(props) {
    super(props)
    this.login = () => this.login();
    this.SignUp = () => this.SignUp();
    this.state = {
      Username: "",
      password: "",
    }

    const { navigate } = this.props.navigation;
    this.navigate = navigate;
  }

  // login(e) {
  //   e.preventDefault();
  //   fire.auth().signInWithEmailAndPassword(this.state.Username.trim(), this.state.password.trim()).then((u) => {
  //     console.log(u)
  //     this.navigate('ParentRoutines', { prevScreenTitle: 'Login' });
  //   }).catch((err) => {
  //     console.log('WE HAD AN ERROR: ', err);
  //   })
  // }
  
login(e){
   const { Username, password} = this.state
   //console.warn(Username, password)
   if(login.Username == "myuserid" && login.password == "mypswrd")
    {
     this.props.navigation.navigate('ChildRoutines')
     // static navigationOptions = ({ navigation: { navigate } }) => 
    }
   else
   {
     Alert.alert('Error', 'Username/password', [{
     text: 'Okay'
  }])
    }
   // const { navigate } = this.props.navigation;
    // this.navigate = navigate;
  }
  SignUp(e) {
    e.preventDefault();
    fire.auth().createUserWithEmailAndPassword(this.state.Username, this.state.password).then((u) => {
      console.log(u)
    }).catch((err) => {
      console.log(err);
    })
  }

  static navigationOptions = {
    title: 'Login',
    headerShown: false,
    headerVisible: false,
  };


  render() {
    let ripple = { id: 'submitButton' };
    return (

<View>
        <View style={styles.logoContainer}>
          <Image source={Logo}
            style={styles.logo}>
          </Image>
        </View>

        <View style={styles.loginContainer}>

          <View style={styles.userLoginForm}>
            <Image
              source={require('../assets/icons/user.png')}
              style={styles.loginIcons}
            />

            <TextInput
              style={{ flex: 1 }}
              placeholder="Username"
              name="Username"
              value={this.state.Username}
              placeholderTextColor="black"
              underlineColorAndroid="transparent"
              onChangeText={Username => this.setState({ Username })}
            />
          </View>

          {/* Password form */}
          <View style={styles.userLoginForm}>
            <Image
              source={require('../assets/icons/password.png')}
              style={styles.loginIcons}
            />

            <TextInput
              style={{ flex: 1 }}
              placeholder="Password"
              name="password"
              value={this.state.password}
              placeholderTextColor="black"
              underlineColorAndroid="transparent"
              onChangeText={password => this.setState({ password })}
            />
          </View>


          {/* Login button */}
          <View style={styles.loginButton}>
            <View style={styles.buttonContainer}>
              <RaisedTextButton
                title="Login"
                onPress={this._onPress, () => 
                  navigate('ParentRoutines', { prevScreenTitle: 'Login' })}
                ripple={ripple}
              />
            </View>
          </View>

          <Text style={styles.generalText}>
            Don't have an account?
          </Text>

          <Text style={styles.createAccount}
            onPress={() => this.navigate('SignUp', { prevScreenTitle: 'Login' })}>
            Sign Up
          </Text>

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
    borderWidth: 2,
    fontSize: 10,
    marginBottom: 20,
    color: 'black',
    marginBottom: 5,
    overflow: 'hidden',
    flexDirection: 'row',
    alignSelf: 'center',
  },

  /* @font-face {
    font-family: 'Roboto';
    src: local('Roboto'), ur;('../fonts/Roboto/Roboto-Black.ttf) format('truetype');
} */

  placeholder: {
    color: 'white'
  },
  logo:{
    alignContent: 'center'
  },
  buttonContainer: {
  },
  loginButton: {
    marginTop: 20,
    width: 50,
    alignSelf: 'center'
  },
  loginContainer: {
    marginBottom: 40,
    marginTop: 20,
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
    marginTop: 100,
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
  createAccount: {
    fontSize: 16,
    lineHeight: 38,
    textAlign: 'center',
    color: '#223a7a',
    textDecorationLine: 'underline',
  },
});