// import React, { Component } from 'react';
// import { Dimensions, StyleSheet, ScrollView, View, Text } from 'react-native';
// import { TextField, FilledTextField } from 'react-native-material-textfield';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

//From Parents Routines
import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RaisedTextButton } from 'react-native-material-buttons';
import { MenuProvider, Menu, MenuOption, MenuOptions, MenuTrigger, optionsRenderer, Popover } from 'react-native-popup-menu';

const { width: WIDTH } = Dimensions.get('window')

export const App = () => (
    <MenuProvider>
        <YourApp />
    </MenuProvider>
);


export default class ParentRewards extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Rewards',
        prevScreenTitle: 'Testing Home Page',
    });


    constructor(props) {
        super(props)
        this.state = {
            reward1: null,
            reward2: null,
            reward3: null,
            reward4: null,
            //prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
        };
    }
    // From Parent Routines
    // constructor() {
    //     super();
    //     this.state = {
    //         loaded: false,
    //         results: null,
    //     }
    // }


    fieldRef = React.createRef();

    //Databases From Parent Routines
    // This allows this page to refresh when you come back from 
    // edit routines, which allows it to display any changes made 
    // componentDidMount() {
    //     console.log('running component did mount');
    //     this.props.navigation.addListener(
    //         'didFocus',
    //         payload => {
    //             this.getRoutines();
    //         }
    //     );
    // }

    // getRoutines() {
    //     // Get the routines data from the db
    //     fetch('http://localhost:3000/routines/',
    //         {
    //             headers: {
    //                 'Cache-Control': 'no-cache'
    //             }
    //         })
    //         .then((response) => response.json())
    //         .then((responseJson) => {
    //             return responseJson;
    //         })
    //         .then(results => {
    //             this.setState({ results: results });
    //             this.setState({ loaded: true });
    //         })
    //         .catch(error => {
    //             console.error(error);
    //         });
    // }



    //From  Parent Routines
    // This is how you update a column in the routines table
    // async changeActiveStatus(routineId, tag, value) {
    //     if (value === 1) {
    //         value = 0;
    //     }
    //     else {
    //         value = 1;
    //     }
    //     var data = {
    //         [tag]: value,
    //     };
    //     try {
    //         let response = await fetch(
    //             "http://localhost:3000/updateRoutine/" + routineId,
    //             {
    //                 method: "POST",
    //                 headers: {
    //                     "Accept": "application/json",
    //                     "Content-Type": "application/json"
    //                 },
    //                 body: JSON.stringify(data)
    //             }
    //         );
    //         if (response.status >= 200 && response.status < 300) {
    //             this.getRoutines();
    //             this.displayRoutines();
    //         }

    //     } catch (errors) {
    //         alert(errors);
    //     }
    // }

    // setActiveText(activeStatus, currentRoutineId) {

    //     console.log(activeStatus);
    //     if (activeStatus === 1) {
    //         return 'Set Inactive';
    //     }
    //     return 'Set Active';
    // }

    //Parent routines


    //     displayRoutines() {

    //         const { navigate } = this.props.navigation
    //         var containerName;

    //         // parse out the db objects returned from the routines call
    //         return this.state.results.routines.map(item => {

    //             if (item.is_active === 0) {
    //                 containerName = 'inactiveRoutineContainer';
    //             }
    //             else {
    //                 containerName = 'routineContainer';
    //             }

    //             return (
    //                 <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-around' }}>

    //                     {/* // Dynamically loads container name based on active or inactive */}
    //                     <View style={styles[containerName]}>

    //                         <View style={{ flex: 1 }} >
    //                             <View style={styles.routineTitleAndMenu}>
    //                                 <Text style={styles.routineTitle} > {item.routine_name}</Text>


    //                                 <MenuProvider>
    //                                     <Menu style={styles.routineMenuStyling}>
    //                                         <MenuTrigger style={styles.ellipsis} text='...' />
    //                                         <MenuOptions
    //                                         >
    //                                             <MenuOption

    //                                                 onSelect={() =>
    //                                                     navigate('EditRoutine', {
    //                                                         prevScreenTitle: 'Routines',
    //                                                         currentRoutineName: item.routine_name,
    //                                                         currentRoutineId: item.routine_id,
    //                                                         currentRoutineStartTime: item.start_time,
    //                                                         currentRoutineEndTime: item.end_time,
    //                                                         currentRoutineApproval: item.is_approved,

    //                                                         // TO DO: set up rewards
    //                                                         currentRewards: null
    //                                                     })}>

    //                                                 <Text style={{ color: 'black' }}>Edit</Text>
    //                                             </MenuOption>
    //                                             <MenuOption onSelect={() =>
    //                                                 this.changeActiveStatus(item.routine_id, 'is_active', item.is_active)

    //                                             }
    //                                                 text={this.setActiveText(item.is_active, item.routine_id)} />
    //                                             <MenuOption onSelect={() => alert('Duplicate')} text='Duplicate' />
    //                                             <MenuOption onSelect={() => alert('Delete')} >
    //                                                 <Text style={{ color: 'red' }}>Delete</Text>
    //                                             </MenuOption>
    //                                         </MenuOptions>

    //                                     </Menu>
    //                                 </MenuProvider>


    //                             </View>


    //                             <View
    //                                 style={styles.routineDetailsPreview}
    //                             >
    //                                 <Text style={styles.routineDetails}>
    //                                     <Icon name="playlist-check" style={styles.routineDetailsIcon} />  Activities: {item.amount_of_activities} </Text>
    //                                 <Text style={styles.routineDetails}>
    //                                     <Icon name="gift" style={styles.routineDetailsIcon} />  Rewards: {item.amount_of_rewards} </Text>
    //                             </View>

    //                         </View>
    //                     </View>
    //                 </View>
    //             );
    //         })
    //     }

    render() {
        if (this.state.results !== null) {
            console.log(this.state.results);
        } else {
            return null;
        }

        let ripple = { id: 'addButton' };
        const { navigate } = this.props.navigation

        return (
           
            
            <View>


                {/* New Routine Container */}
                <View style={styles.routineContainer}>
                    <View style={{ flex: 1 }} >
                        <RaisedTextButton style={styles.roundAddButton}
                            title='+'
                            color='#FF6978'
                            onPress={this._onPress, () =>

                                navigate('EditReward', {
                                    prevScreenTitle: 'Routines',
                                    currentRoutineName: null,
                                    currentRoutineId: null,
                                    currentRoutineStartTime: null,
                                    currentRoutineEndTime: null,
                                    currentRoutineApproval: 0,

                                    // TO DO: set up rewards
                                    currentRewards: null
                                })}
                            ripple={ripple}
                        />

                        <Text style={styles.routineTitle} >
                            Add a Reward
                        </Text>

                    </View>
                </View>
                
                <View style = {styles.pageFormat}>   
                    <Text style = {styles.pageDescription}> 
                    Rewards are a great way to not only make your child happy but also have them complete daily tasks and routines!
                    </Text>
            </View>
               
                

                {this.state.loaded &&
                    <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-around' }}>

                        {this.
                            displayRoutines()}
                    </View>
                }
            </View>

        );
    }
}


//     render() {

//         const { navigate } = this.props.navigation


//         return (
//             <View>

//                 <View style={styles.rewardsContainer}>


//                     <View>

//                     <View style={styles.editRoutineIconAndTitle}>
//                         <Icon style={styles.routineDetailsIcon} name="gift" />
//                         <Text style={styles.editRoutineSectionName}>Rewards</Text>
//                      </View>

//                         <Text>
//                             Rewards are a great way to not only make your child happy but also have them complete daily tasks and routines!
//                     </Text>

//                         < TextField
//                             id="reward1"
//                             placeholder="Task 1 rewards"
//                             value={this.state.reward1}
//                             style={styles.textfieldWithFloatingLabel, styles.textFields}
//                             textInputStyle={{ flex: 1 }}
//                             onFocus={e => console.log('Focus', !!e)}
//                             onBlur={e => console.log('Blur', !!e)}
//                             // onEndEditing={e => { this.PUT THE STATE VAR NAME HERE WE R CHANGING('parent_first_name', this.state.parent_first_name) }
//                             // }
//                             onSubmitEditing={e => console.log('SubmitEditing', !!e)}
//                             onTextChange={s => console.log('TextChange', s)}
//                             onChangeText={s => console.log('ChangeText', s)}
//                         // onChangeText={(text) => this.setState({ currentRoutineName: text })}
//                         ></TextField>

//                         < TextField
//                             id="reward2"
//                             placeholder="Task 2 rewards"
//                             value={this.state.reward2}
//                             style={styles.textfieldWithFloatingLabel, styles.textFields}
//                             textInputStyle={{ flex: 1 }}
//                             onFocus={e => console.log('Focus', !!e)}
//                             onBlur={e => console.log('Blur', !!e)}
//                             // onEndEditing={e => { this.PUT THE STATE VAR NAME HERE WE R CHANGING('parent_first_name', this.state.parent_first_name) }
//                             // }
//                             onSubmitEditing={e => console.log('SubmitEditing', !!e)}
//                             onTextChange={s => console.log('TextChange', s)}
//                             onChangeText={s => console.log('ChangeText', s)}
//                         // onChangeText={(text) => this.setState({ currentRoutineName: text })}
//                         ></TextField>

//                         < TextField
//                             id="reward3"
//                             placeholder="Task 3 rewards"
//                             value={this.state.reward3}
//                             style={styles.textfieldWithFloatingLabel, styles.textFields}
//                             textInputStyle={{ flex: 1 }}
//                             onFocus={e => console.log('Focus', !!e)}
//                             onBlur={e => console.log('Blur', !!e)}
//                             // onEndEditing={e => { this.PUT THE STATE VAR NAME HERE WE R CHANGING('parent_first_name', this.state.parent_first_name) }
//                             // }
//                             onSubmitEditing={e => console.log('SubmitEditing', !!e)}
//                             onTextChange={s => console.log('TextChange', s)}
//                             onChangeText={s => console.log('ChangeText', s)}
//                         // onChangeText={(text) => this.setState({ currentRoutineName: text })}
//                         ></TextField>

//                         < TextField
//                             // textInputStyle="number"
//                             id="Reward4"
//                             placeholder="Add Reward"
//                             value={this.state.reward4}
//                             style={styles.textfieldWithFloatingLabel,
//                                 styles.textFields}
//                             textInputStyle={{ flex: 1 }}
//                             onFocus={e => console.log('Focus', !!e)}
//                             onBlur={e => console.log('Blur', !!e)}
//                             // onEndEditing={e => { this.PUT THE STATE VAR NAME HERE WE R CHANGING('parent_first_name', this.state.parent_first_name) }
//                             // }
//                             onSubmitEditing={e => console.log('SubmitEditing', !!e)}
//                             onTextChange={s => console.log('TextChange', s)}
//                             onChangeText={s => console.log('ChangeText', s)}
//                         // onChangeText={(text) => this.setState({ currentRoutineName: text })}
//                         ></TextField>

//                     </View>

//                 </View>

//             </View>        

//         );



//     }
// }

//Routines style sheet
const styles = StyleSheet.create({

    // RoutinesPage
    pageFormat:{
        marginTop: -240
    },
    pageDescription: {
        marginTop: 30,
        fontSize: 20 ,
        textAlign: 'center'
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
        width: WIDTH * .3,
        height: 150,
        marginTop: 70,
        marginBottom: 5,
        justifyContent: 'space-around',
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        shadowOffset: { width: 5, height: 5, },
        shadowColor: 'black',
        shadowOpacity: .1,
        borderWidth: 0,
        paddingTop: 10,
        overflow: 'visible',
        marginLeft: 10,
        marginRight: 10,
    },
    
    inactiveRoutineContainer: {
        width: WIDTH * .3,
        height: 150,
        marginTop: 20,
        marginBottom: 5,
        justifyContent: 'space-around',
        borderRadius: 10,
        backgroundColor: '#d3d3d3',
        shadowOffset: { width: 5, height: 5, },
        shadowColor: 'black',
        shadowOpacity: .1,
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

