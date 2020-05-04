import React, { Component } from 'react';
import { Button, Dimensions, StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { TextField, FilledTextField } from 'react-native-material-textfield';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-material-dropdown';
// import YouTube from 'react-native-youtube';
import { Video } from "expo-av";
import { Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Environment from "../../../database/sqlEnv";
import SearchableDropdown from "react-native-searchable-dropdown";

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
            userId: 1,
            photos: null,
            video: null,
            loaded: false,
            secondLoaded: false,
            activities: null,
            results: null,
            allActivityNames: [],
            routinesArray: []
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
                this.getActivities();
            }
        )
    }

    //Get the routines data from teh db
    getRoutines() {
        // fetch(Environment + '/routines/', {
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
                this.setState({ results: results });
                console.log(this.state.results);
                this.setState({ loaded: true });
            })
            .catch((error) => {
                // console.log("AH");
                console.error(error);
            });
    }

    storeRoutines() {
        // return this.state.results.routines.map((item) => {
        //     console.log("ROUTINE NAME for rewards");
        //     console.log(item.routine_name);
        //     this.state.routinesArray.push(item.routine_name);
        // })
        return this.state.results.routines.map(item => ({ value: item.routine_name }));

        //         var joined = this.state.myArray.concat('new value');
        // this.setState({ myArray: joined })

    }

    displayRoutinesForm() {
        // const routineData = this.state.routinesArray;
        const data = this.storeRoutines();
        console.log(data);
        // console.log(routineData);
        return (
            <View style={styles.drop}>
                <Text style={styles.textFields}>
                    Select Routine
                </Text>

                <Dropdown
                    label="Select Routine"
                    // data={routineData}
                    data={data}

                />
            </View>
        )
    }

    getActivities() {
        // fetch(Environment + "/getActivities/" + this.state.userId, {
        fetch( Environment + "/joinRoutineAndActivityTable/" + this.state.routineId, {
            // fetch(Environment + "/joinRoutineAndActivityTable/" + this.state.routineID, {
            headers: {
                "Cache-Control": "no-cache",
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .then((results) => {
                this.setState({ activities: results });
                console.log("act hi");
                console.log(this.state.activities);
                this.setState({ secondLoaded: true });
            })
            .catch((error) => {
                console.error(error);
            });
    }



    displayActivities() {
        const { navigate } = this.props.navigation;

        return this.state.activities.map((item) => {
            return (
                <View>
                    <Text style={styles.activityName}>
                        {item.activity_id}. {item.activity_name}
                    </Text>
                    {/* <Text style={styles.subtext}>
                        Image taken by {this.state.childFirstName}
                    </Text> */}
                </View>
            );
        });
    }

    storeActivities(){
        return this.state.activities.map(item => ({ value: item.activity_name }));
    }


 

    displayActivitiesForm() {
        // const routineData = this.state.routinesArray;
        const dataAct = this.storeActivities();
        console.log(dataAct);
        // console.log(routineData);
        return (
            <View style={styles.drop}>
                <Text style={styles.textFields}>
                    Select Activities
                </Text>

                <Dropdown
                    label="Select Activities"
                    // data={routineData}
                    data={dataAct}

                />
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
        console.log("VIDEO");
        console.log(vid);
    };

    returnImage = () => {
        console.log(this.state.photos);
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
        console.log(this.state.video);
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
        console.log(field.value());
    };


    render() {

        const { navigate } = this.props.navigation

        // let routineData = [
        //     {
        //         value: 'Morning Routieeee',
        //     },

        //     {
        //         value: 'After School Routine',
        //     },

        //     {
        //         value: 'Summer Morning Routine',
        //     },

        //     {
        //         value: 'Pear',
        //     }

        // ];



        // let activityData = [
        //     {
        //         value: 'Brush Teeth',
        //     },

        //     {
        //         value: 'Get Dressed',
        //     },

        //     {
        //         value: 'Wash Hands',
        //     },

        //     {
        //         value: 'Eat Snack ',
        //     },

        //     {
        //         value: 'Brush Dog Hair ',
        //     }

        // ];

        return (


            <View>


                <View style={styles.rewardsContainer}>


                    <View>


                        {/* <View style={styles.editRoutineIconAndTitle}>
                            <Icon style={styles.routineDetailsIcon} name="gift" />
                            <Text style={styles.editRoutineSectionName}>Rewards</Text>
                        </View> */}

                        <Text style={styles.textFields}>
                            Reward Name
                    </Text>

                        < TextField
                            id="reward"
                            placeholder="What's the Reward?"
                            value={this.state.reward1}
                            style={styles.textfieldWithFloatingLabel, styles.textFields}
                            textInputStyle={{ flex: 1 }}
                            onFocus={e => console.log('Focus', !!e)}
                            onBlur={e => console.log('Blur', !!e)}
                            // onEndEditing={e => { this.PUT THE STATE VAR NAME HERE WE R CHANGING('parent_first_name', this.state.parent_first_name) }
                            // }
                            onSubmitEditing={e => console.log('SubmitEditing', !!e)}
                            onTextChange={s => console.log('TextChange', s)}
                            onChangeText={s => console.log('ChangeText', s)}
                        // onChangeText={(text) => this.setState({ currentRoutineName: text })}
                        ></TextField>

                        {/* <Text style={styles.textFields}>
                            Select Routine */}
                        {/* </Text>

                        <Dropdown
                            label="Select Routine"
                            data={routineData}
                           
                        /> */}


                        {this.state.loaded &&
                            <View>
                                {/* {this.storeRoutines()} */}
                                {this.displayRoutinesForm()}

                            </View>
                        }

                        {this.state.secondLoaded &&
                            <View>
                                {/* {this.storeRoutines()} */}
                                {this.displayActivitiesForm()}

                            </View>
                        }
                     

                        {/* <Text style={styles.textFields}>
                            Select Activity
                    </Text>

                        <Dropdown
                            label="Select Activity"
                            data={activityData}
                        /> */}




                        <View style={styles.editRoutineIconAndTitle}>
                            <Text style={styles.textFields}>Add Image</Text>
                            <View style={{ margin: 20, alignItems: "center" }}>


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
                            <View style={{ margin: 20, alignItems: "center" }}>
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

                    <TouchableOpacity style={styles.savebutton}>
                        <Text style={{ color: "#FF6978", fontSize: 20 }}>Save Reward</Text>
                    </TouchableOpacity>

                </View>

            </View >

            //  <View style={styles.textFields}>
            //     <View>
            //         <View style={styles.editRoutineIconAndTitle}>
            //             <Icon style={styles.routineDetailsIcon} name="gift" />
            //             <Text style={styles.editRoutineSectionName}>Rewards</Text>
            //         </View>

            //         <Text style={styles.editRoutinesInstructionsText}>
            //             Add a reward that your child receives when they complete their {this.state.currentRoutine}.
            //         </Text>
            //         {this.displayList()}
            //         {this.addNewItemButtonToList()}

            //     </View>
            //     </View>

        );



    }
}



const styles = StyleSheet.create({
    //From edit routines
    editRoutineIconAndTitle: {
        flexDirection: 'row',
        marginTop: 20,
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
        height: 200,
        width: 300,
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
});

