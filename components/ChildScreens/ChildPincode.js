import React, {Component} from 'react';
import {
  Dimensions,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import Dialog, {DialogContent} from 'react-native-popup-dialog';

const {width: WIDTH} = Dimensions.get('window');
export default class ChildPincode extends Component {
  constructor(props) {
    super(props);
    const {navigate} = this.props.navigation;
    this.navigate = navigate;

    this.state = {
      prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,

      //initialize visibility of both dialogs
      visible: false,
    };
    ChildPincode.navigationOptions.headerBackTitle = this.props.navigation.state.params.prevScreenTitle;
  }

  //Header titles for pincode
  static navigationOptions = ({navigation}) => ({
    title: 'PinCode',
  });

  //initial code input value
  state = {
    code: '',
  };
  pinInput = React.createRef();

  //code is 1234
  //TODO: Navigate to parent, Dynamic Code
  _checkCode = code => {
    if (code != '1234') {
      this.pinInput.current.shake();
      this.setState({code: ''});
    } else {
      this.setState({visible: false});
      //nav to parent
      this.navigate('ParentNavigation', {prevScreenTitle: 'My Routines'});
    }
  };

  render() {
    const {code} = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Switch to Parent?</Text>
        <Text style={styles.para}>
          This will log you out of the child mode. If you wish to switch from
          child to parent mode, you will need to enter your 4 digit passcode. Do
          you wish to continue the switch to parent mode of the app?
        </Text>

        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => {
            this.setState({visible: true});
          }}>
          <Text style={styles.textStyle}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => {
            this.navigate('ChildRoutines', {prevScreenTitle: 'My Routines'});
          }}>
          <Text style={styles.textStyle}>Cancel</Text>
        </TouchableOpacity>

        {/* second dialog - pin enter */}
        <Dialog
          visible={this.state.visible}
          onTouchOutside={() => {
            this.setState({visible: false});
          }}>
          <DialogContent>
            <View style={styles.section}>
              <Text style={styles.title}>Parents Only</Text>
              <Text>Enter your 4 digit passcode to switch to parent mode</Text>
              <SmoothPinCodeInput
                ref={this.pinInput}
                keyboardType="number-pad"
                cellStyle={{
                  borderBottomWidth: 2,
                  borderColor: 'gray',
                }}
                cellStyleFocused={{
                  borderColor: 'black',
                }}
                x
                value={code}
                onTextChange={code => this.setState({code})}
                onFulfill={this._checkCode}
              />
            </View>
          </DialogContent>
        </Dialog>
      </View>
    );
  }
}

const styles = {
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
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  para: {
    width: WIDTH * 0.5,
    textAlign: 'center',
  },
  textStyle: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  buttonStyle: {
    width: 300,
    padding: 10,
    margin: 20,
    backgroundColor: '#B1EDE8',
    borderRadius: 100,
  },
};
