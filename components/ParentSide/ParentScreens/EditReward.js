import React, { Component } from 'react';
import { Button, Dimensions, StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { TextField, FilledTextField } from 'react-native-material-textfield';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-material-dropdown';
// import YouTube from 'react-native-youtube';
import { Video } from "expo-av";
import { Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import SearchableDropdown from "react-native-searchable-dropdown";
import { RaisedTextButton } from "react-native-material-buttons";

import Environment from "../../../database/sqlEnv";
import UserInfo from "../../../state/UserInfo";


const { width: WIDTH } = Dimensions.get('window')

export default class ParentRewards extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Edit Reward',
        prevScreenTitle: 'Rewards',
    });

    constructor(props) {
        super(props)
        const { navigate } = this.props.navigation;
        this.navigate = navigate;
        this.state = {
            prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
            rewardId: this.props.navigation.state.params.rewardId,
            rewardName: this.props.navigation.state.params.rewardName,
            rewardDescription: this.props.navigation.state.params.rewardDescription,
            rewardImage: this.props.navigation.state.params.rewardImage,
            rewardVideo: this.props.navigation.state.params.rewardVideo,
            //remove userID 1
            userId: 1,
            photos: null,
            video: null,
            routinesLoaded: false,
            // activities: null,
            allRoutines: null,
            allActivities: null,
            currentRoutine: null,
            activitiesLoaded: false,
            currentActivity: null,
            routineData: null,
            activityData: null,
            changedRewardFields: []


            //prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
        };
    }

    // //from ChildActivity
    // //Header titles for routines
    // static navigationOptions = ({ navigation }) => ({
    //     title: `${navigation.state.params.currentReward}`,
    // });
    // _onNext = () => {
    //     this.child._animateNextPage(); // do stuff
    // };

    componentDidMount() {
        console.log('running component did mount for rewards');
        this.props.navigation.addListener(
            'didFocus',
            (payload) => {
                this.getRoutines();
                // this.getActivitiesForRoutine();
            }
        )
    }


    //onsubmit: call createRewards done
    //post call 
    //create Rewards funciton()

    createNewReward() {
        const parentId = UserInfo.parent_id;
        const childId = UserInfo.child_id;
        const userId = UserInfo.user_id
        // console.log("Environment :: " + Environment);
        // console.log("rewardName :: " + this.state.rewardName);
        // console.log("rewardDescription :: " + this.state.rewardDescription);
        // console.log("userId :: " + this.state.userId);

        data = {
            reward_name: this.state.rewardName,
            reward_description: this.state.rewardDescription,
            reward_image: this.state.rewardImage,
            reward_video: this.state.rewardVideo,
            user_id: userId,
            deleted: 0,
        };
        let response = fetch(
            Environment + "/insertRewards",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        )
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .then((results) => {
                // console.log(results);
                // console.log("worked for rewards!");

                // Set the new routineId
                this.setState({ rewardId: results.insertId });
                // this.saveAnyChanges();
            })
            .catch((error) => {
                console.error(error);
            });
    }


    getAllActivitiesForRoutine() {
        // console.log("WE ARE IN GET ALL ACTIVITIES FOR ROUTINE");
        // console.log(this.state.currentRoutine)
        var routineId = this.state.currentRoutine.id;
        // console.log("CURRENT ROUTINE ID");
        // console.log(routineId);
        fetch(Environment + "/joinRoutineActivityTableByRoutineId/" + routineId, {
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
                this.setState({ activitiesLoaded: true });
                this.storeActivites();
            })
            .catch((error) => {
                console.error(error);
            });
    }


    //Get the routines data from teh db
    getRoutines() {
        // fetch(Environment + '/routines/', {
        // console.log(this.state.userId);
        fetch(Environment + "/getRoutinesByUser/" + this.state.userId, {
            headers: {
                "Cache-Control": "no-cache",
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .then((results) => {
                this.setState({ allRoutines: results });
                // console.log("WHAT ARE ALL THE ROUTINESSSSS")
                // console.log(this.state.allRoutines);
                this.setState({ routinesLoaded: true });
                this.storeRoutines();
                // this.storeRoutines();
            })
            .catch((error) => {
                // console.log("AH");
                console.error(error);
            });
    }

    async updateRewardField(tag, value) {
        // console.log("in fetch tag is and value is " + tag + " ")
        // console.log("updating reward field");
        var data = {
            [tag]: value,
        };
        try {
            let response = await fetch(
                Environment + "/updateReward/" + this.state.rewardId,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );
            if (response.status >= 200 && response.status < 300) {
                console.log("SUCCESS");
            }
        } catch (errors) {
            console.log(errors);
        }
    }

    //come back
    storeRoutines() {
        var temprArray = [];
        // console.log("AY");
        // console.log(this.state.allRoutines);
        this.state.allRoutines["routines"].map(item =>
            temprArray.push({ id: item.routine_id, name: item.routine_name })
        )
        this.setState({ routineData: temprArray });
        // console.log("HEYO in store routines");
        // console.log(this.state.routineData);

    }

    storeActivites() {
        // console.log("WE ARE IN  store activities");

        var tempArray = [];
        this.state.allActivities.map(item =>
            tempArray.push({ id: item.activity_id, name: item.activity_name })
        )
        this.setState({ activityData: tempArray });
    }

    pushToChangedRewardsFields(tag, value) {
        Object.keys(this.state.changedRewardFields).map(function (keyName, keyIndex) {
            if (keyName === tag) {
                return;
            }
        });
        // console.log("TAG " + tag + " VALUE " + value)

        let tempArray = this.state.changedRewardFields;
        tempArray.push({ [tag]: value });
        this.setState({ changedRewardFields: tempArray });
        // console.log("MADE A REWARDS ARRAY " + tempArray);
    }


    updateExistingRewardChanges() {
        // console.log("CHANGED REWARD FIELDS " + this.state.changedRewardFields);
        for (const keyValuePair of this.state.changedRewardFields) {
            Object.entries(keyValuePair).map(([key, val]) => {
                this.updateRewardField(key, val);
            });
        }
    }


    displayForm(currentList) {
        var stateName = "";
        var placeholder = "";
        var displayItems = [];

        if (currentList === "activites") {
            placeholder = "Select an activity"
            displayItems = this.state.activityData;
        }
        else {
            placeholder = "Select an routine";
            // displayItems = this.state.allRoutines["routines"];
            displayItems = this.state.routineData;
            // console.log("all the routines inside items!");
            // console.log(displayItems);



        }
        // const routineData = this.state.routinesArray;

        return (
            <View style={styles.drop}>
                <ScrollView keyboardShouldPersistTaps="handled">
                <SearchableDropdown
                    onItemSelect={(item) => {
                        if (currentList === "activity") {
                            this.setState({ currentActivity: item });
                        }
                        else {     
                            this.setState({ currentRoutine: item });
                        }
                    }}
                    containerStyle={{ padding: 5 }}
                    itemStyle={styles.dropDownItem}
                    itemTextStyle={{ color: "#222" }}
                    itemsContainerStyle={{ maxHeight: 140 }}
                    items={displayItems}
                    resetValue={false}
                    textInputProps={{
                        placeholder: placeholder,
                        underlineColorAndroid: "transparent",
                        style: {
                            padding: 12,
                            borderWidth: 1,
                            borderColor: "#ccc",
                            borderRadius: 5,
                        },
                    }}
                    // value={this.state.currentlySelectedActivity}
                    listProps={{
                        nestedScrollEnabled: true,
                    }}
                />             
                </ScrollView>
            </View>
        )
    }

    //From ChildActivity
    _onNext = () => {
        this.child._animateNextPage(); // do stuff
    };

    //from EditActivity
    _handleButtonPress = async () => {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });

        this.setState({ photos: pickerResult });
    };

    videoPicker = async () => {
        let vid = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        });

        this.setState({ video: vid });
        
    };

    returnImage = () => {
        if (this.state.photos) {
            return (
                <Image
                    style={{ width: 300, height: 200, borderRadius: 15 }}
                    source={{ uri: this.state.photos.uri }}
                />
            );
        } else {
            return <Icon name="camera-enhance" color="#DADADA" size={100} />;
        }
    };


    returnVideo = () => {
       
        if (this.state.video) {
            return (
                <Video
                    source={{ uri: this.state.video.uri }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="stretch"
                    shouldPlay
                    isLooping
                    style={{ width: 300, height: 300 }}
                />
            );
        } else {
            return <Icon name="video" color="#DADADA" size={100} />;
        }
    };

    fieldRef = React.createRef();
    onSubmit = () => {
        let { current: field } = this.fieldRef;
        // console.log(field.value());
    };

    _onSubmit = () => {
        // console.log("rewardId " + this.state.rewardId);
        if (this.state.rewardId) {
            // console.log("existing reward edits");
            this.updateExistingRewardChanges();
            //   this.saveAnyChanges();
            //   var alr = "";

            // this.
        }
        else {
            // console.log("new reward");
            this.createNewReward();
        }
    }


    render() {

        const { navigate } = this.props.navigation

        return (
            
            // <ScrollView style={{ backgroundColor: "#FFFCF9", padding: 20 }}>
            <ScrollView keyboardShouldPersistTaps="always">
                <View>
                    
                    <View style={styles.rewardsContainer}>
                        <View>

                            <Text style={styles.textFields}>
                                Reward Name
                        </Text>

                            < TextField
                                id="reward_name"
                                placeholder="What's the Reward?"
                                value={this.state.rewardName}
                                style={styles.textfieldWithFloatingLabel, styles.textFields}
                                textInputStyle={{ flex: 1 }}
                                onChangeText={(text) => this.setState({ rewardName: text })}
                                onEndEditing={(e) => {
                                    this.pushToChangedRewardsFields(
                                        "reward_name",
                                        this.state.rewardName
                                    );
                                }}

                            // onChangeText={(text) => this.setState({ currentRoutineName: text })}
                            ></TextField>

                            <Text style={styles.textFields}>
                                Reward Description
                        </Text>

                            < TextField
                                id="reward_description"
                                placeholder="Describe the Reward"
                                value={this.state.rewardDescription}
                                style={styles.textfieldWithFloatingLabel, styles.textFields}
                                textInputStyle={{ flex: 1 }}
                                onChangeText={(text) => this.setState({ rewardDescription: text })}
                                onEndEditing={(e) => {
                                    this.pushToChangedRewardsFields(
                                        "reward_description",
                                        this.state.rewardDescription
                                    );
                                }}
                            ></TextField>

                            {this.state.routinesLoaded &&
                                <View>
                                    <Text style={styles.textFields}>
                                        Select Routine
                                    </Text>
                                    {this.displayForm("routine")}
                                </View>
                            }

                            {this.state.currentRoutine !== null &&
                                <View>
                                    {this.getAllActivitiesForRoutine()}
                                </View>
                            }

                            {this.state.activitiesLoaded &&
                                <View>
                                    <Text style={styles.textFields}>
                                        Select Activity
                                </Text>
                                    {this.displayForm("activites")}
                                </View>
                            }


                            <View style={styles.editRoutineIconAndTitle}>
                                <Text style={styles.textFields}>Add Image</Text>
                                <View style={{
                                    alignItems: "center",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    margin: 70,

                                }}>


                                    <TouchableOpacity
                                        style={styles.camerabutton}
                                        onPress={this._handleButtonPress}
                                    >
                                        {/* onPress={() => {
                                        this.navigate('Camera', {prevScreenTitle: 'EditReward' });
                                        this._onNext();
                                    }}> */}
                                        {this.returnImage()}

                                    </TouchableOpacity>

                                </View>

                            </View>

                            {/* <TouchableOpacity
                            style={styles.buttonStyle}
                            onPress={() => {
                                this.navigate('Camera', { prevScreenTitle: 'EditReward' });
                                this._onNext();
                            }}>
                            <Text style={styles.textStyle}>Take A Picture!</Text>
                        </TouchableOpacity> */}

                            {/* //insert image  */}

                            {/* <Text style = {styles.textFields}>
                        Video 
                    </Text> */}
                            {/* //insert vieo 
                    */}

                            <View style={styles.editRoutineIconAndTitle}>
                                < Text style={styles.textFields}>
                                    Add Video
                             </Text>
                                <View style={{
                                    alignItems: "center",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    margin: 70,
                                    // marginBottom: 100
                                }}>
                                    <TouchableOpacity
                                        style={styles.camerabutton}
                                        onPress={() => this.videoPicker()}
                                    >
                                        {this.returnVideo()}
                                    </TouchableOpacity>
                                </View>

                            </View>

                            {/* <Button
                            title="Save"
                            type="outline"
                            color='#FF6978'
                        /> */}



                            {/* <TouchableOpacity style={styles.button}>
                            <Icon
                                name="camera"
                                color="#FF6978"
                                size={30}
                                style={{ marginRight: 10 }}
                            />
                            <Text>Image</Text>
                        </TouchableOpacity> */}

                            {/* <TouchableOpacity style={styles.button}>
                            <Icon
                                name="video"
                                color="#FF6978"
                                size={30}
                                style={{ marginRight: 10 }}
                            />
                            <Text>Video</Text>
                        </TouchableOpacity> */}
                        </View>

                        <View
                            style={{
                                alignItems: "center",
                                flexDirection: "row",
                                justifyContent: "center",
                                margin: 15,
                                marginBottom: 100,
                            }}
                        >

                            <RaisedTextButton
                                onPress={() => this._onSubmit()}
                                style={{ width: 150 }}
                                titleStyle={styles.buttonstyle}
                                title="Save Reward"
                                titleColor={"#FF6978"}
                                color={"white"}
                            />

                        </View>

                    </View>

                </View >

            
             </ScrollView> 
        );



    }
}



const styles = StyleSheet.create({
    //From edit routines
    editRoutineIconAndTitle: {
        flexDirection: 'row',
        marginTop: 10,
    },
    drop: {
        marginTop: 10,
        marginLeft: 30,
        marginRight: 100,
        marginBottom: 50,
    },
    // Derived from Parent Profile
    rewardsContainer: {
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
        padding: 2,
        margin: 2,
        marginLeft: 10,
        marginTop: 5,
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
        marginTop: 10
    },
    routineDetails: {
        fontSize: 150,
        paddingTop: 15,
        paddingLeft: 135
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
        paddingBottom: 15
    },
    routines: {
        paddingLeft: 3,
        textAlignVertical: 'center',
        width: WIDTH * .3,
        height: 100,
        marginTop: 5,
        marginBottom: 5,
        borderWidth: 3,
        borderRadius: 15,
        backgroundColor: 'white',
        shadowOffset: { width: 5, height: 5, },
        shadowColor: 'black',
        shadowOpacity: .1,
        borderWidth: 0
    },
    routineTitle: {
        fontSize: 14,
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    saveButton: {
        marginLeft: 6,
        fontSize: 50,
        height: 50,
        minWidth: 50,
        width: 50,
        borderRadius: 50,
        color: '#FFFFFF',
    },
    camerabutton: {
        fontSize: 30,
        height: 150,
        width: 250,
        borderRadius: 12,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        margin: 5,
        shadowColor: "grey",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
    },
    savebutton: {
        fontSize: 30,
        minWidth: 150,
        minHeight: 40,
        borderRadius: 20,
        backgroundColor: "#fff",
        borderColor: "#FF6978",
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        margin: 5,
        padding: 2,
    },
    dropDownItem: {
        padding: 10,
        marginTop: 2,
        backgroundColor: "#ddd",
        borderColor: "#bbb",
        borderWidth: 1,
        borderRadius: 5,
    },
    buttonstyle: {
        fontSize: 15,
        padding: 0,
        margin: 0,
        fontWeight: "bold",
    },
});

