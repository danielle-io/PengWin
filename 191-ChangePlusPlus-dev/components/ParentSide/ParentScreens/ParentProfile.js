import React, {Component} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {TextField} from 'react-native-material-textfield';
import UserAvatar from 'react-native-user-avatar';

const {width: WIDTH} = Dimensions.get('window');

export default class ParentProfile extends Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Parent Profile',
    prevScreenTitle: 'Testing Home Page',
  });

  constructor(props) {
    super(props);
    this.state = {
      userId: 1,
      firstLoaded: false,
      loaded: false,
      childResults: null,
      results: null,
      parentFirstName: null,
      parentLastName: null,
      email: null,
      childFirstName: null,
      childUserId: null,
      prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
    };
  }

  async changeUserComponent(tag, value, id) {
    console.log('routine id below');
    var data = {
      [tag]: value,
    };
    try {
      let response = await fetch('http://localhost:3000/updateUser/' + id, {
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
    console.log('running component did mount');
    this.props.navigation.addListener('didFocus', payload => {
      this.getUserInfo(), this.getChildInfo();
    });
  }

  getChildInfo() {
    // Get the routines data from the db
    fetch('http://localhost:3000/getChildFromParent/' + this.state.userId, {
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
    fetch('http://localhost:3000/getUsers/' + this.state.userId, {
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
            <UserAvatar size="100" name={fullName} />
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
                this.state.userId,
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
                this.state.userId,
              );
            }}
            onSubmitEditing={e => console.log('SubmitEditing', !!e)}
            onChangeText={text => this.setState({parentLastName: text})}
          />

          <TextField
            // textInputStyle="number"
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
                this.state.userId,
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
    const {navigate} = this.props.navigation;

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
  // routineTitle: {
  //     paddingLeft: 15,
  //     paddingTop: 12,
  //     marginTop: 15,
  //     fontSize: 10,
  //     marginLeft: 10,
  //     textAlign: 'left',
  //     textAlignVertical: 'center'
  // },
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
