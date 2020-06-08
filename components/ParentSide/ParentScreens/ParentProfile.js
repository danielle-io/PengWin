import React, {Component} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {TextField} from 'react-native-material-textfield';
import UserAvatar from 'react-native-user-avatar';
import Environment from '../../../database/sqlEnv';
import UserInfo from "../../../state/UserInfo";

const {width: WIDTH} = Dimensions.get('window');
const parentId = UserInfo.parent_id;
const childId = UserInfo.child_id;
const userId = UserInfo.user_id;

export default class ParentProfile extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Profile",
    activeTab: 4,
  });

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
          placeholder="Your Child's First Name"
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
            placeholder="First Name"
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
            placeholder="Last Name"
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
            id="parentEmail"
            placeholder="Email"
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  routines: {
    paddingLeft: 3,
    textAlignVertical: 'center',
    width: WIDTH * 0.3,
    height: 100,
    marginTop: 5,
    marginBottom: 5,
    borderWidth: 3,
    borderRadius: 15,
    backgroundColor: 'white',
    shadowOffset: {width: 5, height: 5},
    shadowColor: 'black',
    shadowOpacity: 0.1,
  },
  routineTitle: {
    fontSize: 14,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
