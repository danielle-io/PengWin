import React, {Component} from 'react';
import {View, Dimensions, StyleSheet, Text} from 'react-native';
import {TextField} from 'react-native-material-textfield';
import UserAvatar from 'react-native-user-avatar';
import Environment from '../database/sqlEnv';
import UserInfo from "../state/UserInfo";
import { ScrollView } from "react-native-gesture-handler";


const {width: WIDTH} = Dimensions.get('window');
const parentId = UserInfo.parent_id;
const childId = UserInfo.child_id;
const userId = UserInfo.user_id;

export default class SignUp extends Component {
  

  constructor(props) {
    super(props);
    const {navigate} = this.props.navigation;
    this.state = {
      firstLoaded: false,
      loaded: false,
      childResults: null,
      results: null,
      parentFirstName: null,
      parentLastName: null,
      email: null,
      childFirstName: null,
      prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
    };
  }

  async changeUserComponent(tag, value, id) {
    console.log('routine id below');
    var data = {
      [tag]: value,
    };
    try {
      let response = await fetch(Environment + '/updateUser/' + id, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.status >= 200 && response.status < 300) {
        console.log('SUCCESSFUL CALL');
      }
    } catch (errors) {
      alert(errors);
    }
  }

  // This allows this page to refresh when you come back from
  // edit routines, which allows it to display any changes made
  componentDidMount() {
    this.props.navigation.addListener('didFocus', payload => {
      this.getUserInfo(), this.getChildInfo();
    });
  }

  getChildInfo() {
    // Get the routines data from the db
    fetch(Environment + '/getChildFromParent/' + userId, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        return responseJson;
      })
      .then(results => {
        this.setState({childResults: results});
        console.log(this.state.childResults);
        this.setState({loaded: true});
      })
      .catch(error => {
        console.error(error);
      });
  }

  getUserInfo() {
    // Get the routines data from the db
    fetch(Environment + '/getUser/' + userId, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        return responseJson;
      })
      .then(results => {
        this.setState({results: results});
        console.log(this.state.results);
        this.setState({firstLoaded: true});
      })
      .catch(error => {
        console.error(error);
      });
  }

  getChildsName() {
    return this.state.childResults.map(itemValue => {
      return (
        <TextField
          id="childFirstName"
          placeholder="Verify Password"
          value={itemValue.first_name}
          style={(styles.textfieldWithFloatingLabel, styles.textFields)}
          textInputStyle={{flex: 1}}
          onFocus={e => console.log('Focus', !!e)}
          onBlur={e => console.log('Blur', !!e)}
          onEndEditing={e => {
            this.changeUserComponent(
              'first_name',
              this.state.childFirstName,
              itemValue.user_id,
            );
          }}
          onSubmitEditing={e => console.log('SubmitEditing', !!e)}
          onChangeText={text => this.setState({childFirstName: text})}
        />
      );
    });
  }

  displayUserData() {
    return this.state.results.map(item => {
      var fullName = item.first_name + ' ' + item.last_name;

      return (
        <View style={styles.parentProfileFormContainer}>
          <View style={styles.avatarContainer}>
            <UserAvatar size={100} name={fullName} />
          </View>

          <TextField
            id="parentFirstName"
            placeholder="Username"
            value={item.first_name}
            style={(styles.textfieldWithFloatingLabel, styles.textFields)}
            textInputStyle={{flex: 1}}
            onFocus={e => console.log('Focus', !!e)}
            onBlur={e => console.log('Blur', !!e)}
            onEndEditing={e => {
              this.changeUserComponent(
                'first_name',
                this.state.parentFirstName,
                userId,
              );
            }}
            onSubmitEditing={e => console.log('SubmitEditing', !!e)}
            onTextChange={s => console.log('TextChange', s)}
            onChangeText={text => this.setState({parentFirstName: text})}
          />

          <TextField
            id="parentLastName"
            placeholder="Email ID"
            value={item.last_name}
            style={(styles.textfieldWithFloatingLabel, styles.textFields)}
            textInputStyle={{flex: 1}}
            onFocus={e => console.log('Focus', !!e)}
            onBlur={e => console.log('Blur', !!e)}
            onEndEditing={e => {
              this.changeUserComponent(
                'last_name',
                this.state.parentLastName,
                userId,
              );
            }}
            onSubmitEditing={e => console.log('SubmitEditing', !!e)}
            onChangeText={text => this.setState({parentLastName: text})}
          />

          <TextField
            // textInputStyle="number"
            id="parentEmail"
            placeholder="Password"
            value={item.email}
            style={(styles.textfieldWithFloatingLabel, styles.textFields)}
            textInputStyle={{flex: 1}}
            onFocus={e => console.log('Focus', !!e)}
            onBlur={e => console.log('Blur', !!e)}
            onEndEditing={e => {
              this.changeUserComponent(
                'email',
                this.state.email,
                userId,
              );
            }}
            onSubmitEditing={e => console.log('SubmitEditing', !!e)}
            onChangeText={text => this.setState({email: text})}
          />

          {this.getChildsName()}
        </View>
      );
    });
  }

  fieldRef = React.createRef();

  render() {

    return (
      <View>
        {this.state.loaded && this.state.firstLoaded && (
          <View>{this.displayUserData()}</View>
        )}


   <View style={styles.loginButton}>
                <View style={ {flex: 1}, styles.routines}
                    onStartShouldSetResponder={() =>this.props.navigation.navigate('Pincode',{
                                }) } >
           <ScrollView>
           <Text style={styles.routineTitle}>Next</Text>
           </ScrollView>
           </View>
  
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // Parent Profile
  parentProfileFormContainer: {
    marginTop: 10,
    marginLeft: 100,
    marginRight: 100,
    marginBottom: 50,
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 50,
  },
  buttonContainer: {
    marginTop: 100,
    fontSize: 200,
    width: 200,
    height: 200
    
  },
  loginButton: {
    marginTop: 90,
    width: 90,
    height: 200,
    alignSelf: 'center'
  
  },
  routineTitle: {
    fontSize: 30,
    textAlign: 'center',

  },
  routines: {
    width: WIDTH * .18,
    height: 39,
    borderRadius: 8,
    backgroundColor: 'pink',
    shadowOffset:{  width: 5,  height: 5,  },
    shadowOpacity: .1,
    borderWidth: 0,
    marginLeft: -25
},

  textFields: {
    padding: 5,
    margin: 2,
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 20,
  },
  formIndent: {
    marginLeft: 30,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 200,
  },
  imageButton: {
    marginTop: 50,
    marginLeft: 100,
  },
  descriptionBox: {
    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 15,
  },
  descriptionLines: {
    marginBottom: 4,
    marginLeft: 8,
    marginRight: 8,
    marginTop: 10,
  },
  routineDetails: {
    fontSize: 10,
    paddingTop: 15,
    paddingLeft: 15,
  },
 
  detailsContainer: {
    padding: 2,
    paddingTop: 10,
    paddingBottom: 15,
  },
  
});


