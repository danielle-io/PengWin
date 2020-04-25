import React, {Component} from 'react';
import {Dimensions, StyleSheet, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RaisedTextButton} from 'react-native-material-buttons';
import {
  MenuProvider,
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  optionsRenderer,
  Popover,
} from 'react-native-popup-menu';

const {width: WIDTH} = Dimensions.get('window');

export const App = () => (
  <MenuProvider>
            
    <YourApp />
        
  </MenuProvider>
);

export default class ParentRewards extends Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Rewards',
    prevScreenTitle: 'Testing Home Page',
  });

  constructor(props) {
    super(props);
    this.state = {
      reward1: null,
      reward2: null,
      reward3: null,
      reward4: null, //prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
    };
  }
  fieldRef = React.createRef();

  render() {
    if (this.state.results !== null) {
      console.log(this.state.results);
    } else {
      return null;
    }

    let ripple = {id: 'addButton'};
    const {navigate} = this.props.navigation;

    return (
      <View>
                        {/* New Routine Container */}
                        
        <View style={styles.routineContainer}>
                              
          <View style={{flex: 1}}>
                                    
            <RaisedTextButton
              style={styles.roundAddButton}
              title="+"
              color="#FF6978"
              onPress={
                (this._onPress,
                () =>
                  navigate('EditReward', {
                    prevScreenTitle: 'Routines',
                    currentRoutineName: null,
                    currentRoutineId: null,
                    currentRoutineStartTime: null,
                    currentRoutineEndTime: null,
                    currentRoutineApproval: 0, // TO DO: set up rewards

                    currentRewards: null,
                  }))
              }
              ripple={ripple}
            />
                                    
            <Text style={styles.routineTitle}>
                                          Add a Reward                         
            </Text>
                                
          </View>
                          
        </View>
                                         
        <View style={styles.pageFormat}>
                                  
          <Text style={styles.pageDescription}>
                                Rewards are a great way to not only make your
            child happy but also have them complete daily tasks and routines!
                                
          </Text>
                      
        </View>
                                                         
        {this.state.loaded && (
          <View
            style={{
              flex: 1,
              flexWrap: 'wrap',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
                                    {this.displayRoutines()}
                                
          </View>
        )}
                    
      </View>
    );
  }
}
//Routines style sheet
const styles = StyleSheet.create({
  // RoutinesPage
  pageFormat: {
    marginTop: -240,
  },
  pageDescription: {
    marginTop: 30,
    fontSize: 20,
    textAlign: 'center',
  },
  topContainer: {
    zIndex: 999,
  },
  routineTitleAndMenu: {
    flexDirection: 'row',
    flex: 1,
    overflow: 'visible',
  },
  ellipsis: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    fontSize: 30,
    marginRight: 10,
    overflow: 'visible',
  },
  routineTitle: {
    marginLeft: 4,
    marginTop: 2,
    fontSize: 14,
    textAlign: 'center',
    flex: 1,
  },
  routineContainterOptions: {
    overflow: 'visible',
    zIndex: 999,
  },
  routineOptionsPopout: {
    overflow: 'visible',
    zIndex: 999,
  },
  routineMenuStyling: {
    overflow: 'visible',
    zIndex: 999,
  },
  routineDetailsIcon: {
    color: '#355C7D',
    fontSize: 14,
  },
  routineDetails: {
    fontSize: 10,
    zIndex: 2,
  },
  routineDetailsPreview: {
    zIndex: 2,
    marginBottom: 10,
    marginLeft: 5,
  },
  selectText: {
    fontSize: 15,
    padding: 5,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
  },
  routineContainer: {
    width: WIDTH * 0.3,
    height: 150,
    marginTop: 70,
    marginBottom: 5,
    justifyContent: 'space-around',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowOffset: {width: 5, height: 5},
    shadowColor: 'black',
    shadowOpacity: 0.1,
    borderWidth: 0,
    paddingTop: 10,
    overflow: 'visible',
    marginLeft: 10,
    marginRight: 10,
  },
  inactiveRoutineContainer: {
    width: WIDTH * 0.3,
    height: 150,
    marginTop: 20,
    marginBottom: 5,
    justifyContent: 'space-around',
    borderRadius: 10,
    backgroundColor: '#d3d3d3',
    shadowOffset: {width: 5, height: 5},
    shadowColor: 'black',
    shadowOpacity: 0.1,
    borderWidth: 0,
    paddingTop: 10,
    overflow: 'visible',
    marginLeft: 10,
    marginRight: 10,
  },
  roundAddButton: {
    marginLeft: 6,
    fontSize: 30,
    height: 50,
    minWidth: 50,
    width: 50,
    borderRadius: 50,
    color: '#FFFFFF',
  },
});
