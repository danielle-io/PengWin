// import React, { Component } from 'react';
// import { Dimensions, StyleSheet, ScrollView, View, Text } from 'react-native';
// import { TextField, FilledTextField } from 'react-native-material-textfield';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

//From Parents Routines
import React, { Component } from 'react';
import { ScrollView, Dimensions, StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RaisedTextButton } from 'react-native-material-buttons';
import { MenuProvider, Menu, MenuOption, MenuOptions, MenuTrigger, optionsRenderer, Popover } from 'react-native-popup-menu';
import Environment from "../../../database/sqlEnv";
const { width: WIDTH } = Dimensions.get('window')


export default class ParentRewards extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Rewards',
        prevScreenTitle: 'Testing Home Page',
    });


    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            secondLoaded: false,
            userId: 1,
            allRewards: null,
            // allRewardNames: null,
            allActivities: null,
            allActivitiesDictionary: null,
            //don't know if need this
            reward_name: null,
            routine_name: null,
            rewardToDelete: null
            // selectedDeletion: null
            // reward1: null,
            // reward2: null,
            // reward3: null,
            // reward4: null,
            //prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
        };
    }


    _renderPage = (props) => (
        <TabViewPage {...props} renderScene={this._renderScene} />
    );





    // fieldRef = React.createRef();

    async componentDidMount() {
        this.props.navigation.addListener("didFocus", (payload) => {
            // this.getRoutines();
            // this.getAllActivitiesForUser();
            this.getAllRewardsForUser();
            // this.getAllRewardNames();
        });
    }


    getRoutines() {
        fetch(Environment + "/getRoutinesByUser/" + this.state.userId, {
            headers: {
                "Cache-Control": "no-cache",
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .then((routines) => {
                this.setState({ results: routines });
                this.setState({ loaded: true });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    //gets all the rewards for a possible user
    getAllRewardsForUser() {
        fetch(Environment + "/getAllRewards/" + this.state.userId, {
            headers: {
                "Cache-Control": "no-cache",
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .then((results) => {
                this.setState({ allRewards: results });
                this.setState({ loaded: true });
            })
            .catch((error) => {
                console.error(error);
            });
    }


    // getAllRewardNames() {
    //     var tempArray = [];
    //     this.state.allRewards.map((item) => {
    //         tempArray.push({ id: item.reward_id, name: item.reward_name });
    //     });
    //     this.setState({ allRewardNames: tempArray });
    // }


    getAllActivitiesForUser() {
        fetch(Environment + "/getActivities/" + this.state.userId, {
            headers: {
                "Cache-Control": "no-cache",
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .then((results) => {
                this.setState({ allActivities: results });
                this.createActivityDictionary();
            })
            .catch((error) => {
                console.error(error);
            });
    }


    createActivityDictionary() {
        var tempDict = {};
        this.state.allActivities.map((item) => {
            tempDict[item.activity_id] = item;
        });
        console.log("TEMP DICT BELOW");
        console.log(tempDict);

        this.setState({ allActivitiesDictionary: tempDict });
        console.log("the all activities dictionary is below");
        console.log(this.state.allActivitiesDictionary);
        this.setState({ secondLoaded: true });

    }

    // selectDeletion(id){
    //     this.setState({selectedDeletion: id})
    // }

    // selectedReward(id){
    //     this.setState({selectedReward: id});
    // }

    deleteItem(r){
        // this.setState({rewardToDelete: item});
        // this.deleteReward();
        this.updateReward(r, "deleted", 1)
    }

    // deleteReward() {
         
    //     console.log("deleteReward function");
        
    //     this.updateReward(this.state.rewardToDelete.rewardId, "deleted", 1);
        // if (this.state.allRewards !== null) {
        //     //   if (this.state.selectedDeletion) {
        //     this.updateReward("deleted", 1);
            // return Object.keys(this.state.allRewards).map((item) => {
            //   if (
            //     this.state.containerRoutineDict[item].containerId ===
            //     this.state.selectedDeletion
            //   ) {
            // this.setState({ loaded: false });            
            //   }
            // });
        // }

    // }

    updateReward(rewardId, tag, value) {
        // console.log("in fetch tag is and value is " + tag + " ")
        // console.log("updating reward field");
        console.log("Deleted reward id " + rewardId);
        var data = {
            [tag]: value,
        };

        let response = fetch(
            Environment + "/updateReward" + rewardId,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }).then((results) => {
                console.log("SUCCESS: updated amount of rewards");
                this.setState({ loaded: false });
          
                console.log("delete worked");
                this.getAllRewardsForUser();
          
                if (this.state.loaded) {
                  console.log("rewards loaded again");
                  this.displayRewards();
                }
            });
          }

    displayRewards() {
        const { navigate } = this.props.navigation;

        // var tempArray = [];
        // console.log("LOOK HERE");
        // console.log(this.state.allRewards);
        // this.state.allRewards.map((item) => {
        //     tempArray.push({ id: item.reward_id, name: item.reward_name });
        // });
        // this.setState({ allRewardNames: tempArray });
        // console.log("ALL THE REWARD NAMES WOAH")
        // console.log(this.state.allRewardNames);
        // parse out the db objects returned from the routines call
        return this.state.allRewards.map((item) => {
            //want to map across each reward name in allRewardNames


            return (
                <View style={styles["routineContainer"]}>
                    <MenuProvider>
                        <View style={styles.routineTitleAndMenu}>
                            <Text style={styles.routineTitle}> {item.reward_name}</Text>
                            <Menu style={styles.routineMenuStyling}>
                                <MenuTrigger style={styles.ellipsis} text="..." />
                                <MenuOptions>
                                    <MenuOption
                                        onSelect={() =>
                                            this.props.navigation.navigate("EditReward", {
                                                // allRoutines: null,
                                                // allActivities: null,
                                                // currentRoutine: null,
                                                // currentActivity: null,
                                                //            routineData: null,
                                                // activityData: null,
                                                prevScreenTitle: "Rewards",
                                                rewardId: item.reward_id,
                                                rewardName: item.reward_name,
                                                rewardImage: item.reward_image,
                                                rewardVideo: item.reward_video,
                                                rewardDescription: item.reward_description,
                                                deleted: 0

                                            })
                                        }
                                    >
                                        <Text style={{ color: "black" }}>Edit</Text>
                                    </MenuOption>


                                    <MenuOption onSelect={() => this.deleteItem(item.reward_id)}>
                                        <Text style={{ color: "red" }}>Delete</Text>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
                        </View>


                    </MenuProvider>
                </View>
            );
        });
    }

    render() {
        // if (this.state.results !== null) {
        //     console.log(this.state.results);
        // } else {
        //     return null;
        // }

        let ripple = { id: 'addButton' };
        const { navigate } = this.props.navigation

        return (
            <ScrollView style={{ backgroundColor: "#FFFCF9", padding: 10 }}>
                <View>

                    {this.state.loaded && (
                        <View
                            style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                            }}
                        >
                            {this.displayRewards()}
                            {/* {this.displayNewRoutineContainer()} */}
                        </View>
                    )}



                    {/* New Rewards Container */}
                    <View style={styles.routineContainer}>
                        <View style={{ flex: 1 }} >
                            <RaisedTextButton style={styles.roundAddButton}
                                title='+'
                                color='#FF6978'
                                onPress={this._onPress, () =>

                                    navigate('EditReward', {
                                        prevScreenTitle: 'Rewards',
                                        currentRoutineName: null,
                                        currentRoutineId: null,
                                        currentRoutineStartTime: null,
                                        currentRoutineEndTime: null,
                                        currentRoutineApproval: 0,
                                        rewardId: null,
                                        rewardName: null,
                                        rewardDescription: null,
                                        rewardImage: null,
                                        rewardVideo: null,


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

                    {/* <View style={styles.pageFormat}>
                    <Text style={styles.pageDescription}>
                        Rewards are a great way to not only make your child happy but also have them complete daily tasks and routines!
                    </Text>
                </View> */}



                    {/* {this.state.loaded &&
                    <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-around' }}>

                        {this.
                            displayRoutines()}
                    </View>
                } */}
                </View>
            </ScrollView>
        );
    }
}




//Routines style sheet
const styles = StyleSheet.create({

    pageFormat: {
        marginTop: -10
    },
    pageDescription: {
        marginTop: 30,
        fontSize: 20,
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
    text: {
        marginTop: 7,
        fontSize: 24,
        textAlign: "center",
        height: 100,
    },
    subtext: {
        marginTop: -40,
        fontSize: 20,
        textAlign: "center",
        textAlignVertical: "auto",
        width: 220,
        marginBottom: 25,
    },
    dialog: {
        backgroundColor: "#e1d8ff",
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
    },
});