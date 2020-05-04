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
            routinesLoaded: false,
            activities: null,
            allRoutines: null,
            allActivities: null,
            allActivityNames: [],
            routinesArray: [],
            currentRoutine: null,
            activitiesLoaded: false,
            currentActivity: null,
            routineData: null,
            activityData: null

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

    getAllActivitiesForRoutine() {
        console.log("WE ARE IN GET ALL ACTIVITIES FOR ROUTINE");
        console.log(this.state.currentRoutine);
        var routineId = this.state.currentRoutine.id;
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
                console.log(this.state.results);
                this.setState({ routinesLoaded: true });
                this.storeRoutines();
            })
            .catch((error) => {
                // console.log("AH");
                console.error(error);
            });
    }

    storeActivites() {
        console.log("WE ARE IN  store activities");

        var tempArray = [];
        this.state.allActivities.map(item => 
            tempArray.push({ id: item.activity_id, name: item.activity_name })
        )
        this.setState({ activityData: tempArray });
    }


    storeRoutines() {
        var tempArray = [];
        this.state.allRoutines.routines.map(item => 
            tempArray.push({ id: item.routine_id, name: item.routine_name })
        )
        this.setState({ routineData: tempArray });
    }

    displayForm(currentList) {
        var stateName = "";
        var placeholder = "";
        var items = [];
        if (currentList === "activites"){
            placeholder = "Select an activity"
            items = this.state.activityData;
        }
        else{
            placeholder = "Select an routine";
            items = this.state.routineData;

        }
        // const routineData = this.state.routinesArray;
        // console.log(routineData);
        return (
            <View style={styles.drop}>
               
                <SearchableDropdown
                onItemSelect={(item) => {
                    if (currentList === "activity"){
                        this.setState({ currentActivity : item });
                    }
                    else {
                        this.setState({ currentRoutine: item });
                    }
                }}
                containerStyle={{ padding: 5 }}
                itemStyle={styles.dropDownItem}
                itemTextStyle={{ color: "#222" }}
                itemsContainerStyle={{ maxHeight: 140 }}
                items={items}
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

                {/* <Dropdown
                    label="Select Routine"
                    data={data}
                    onChangeText ={(item) => {
                     this.setState({ currentRoutine: item });
                    }}
                /> */}
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

        return (
            <View>

              <View style={styles.rewardsContainer}>
                    <View>

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
    dropDownItem: {
        padding: 10,
        marginTop: 2,
        backgroundColor: "#ddd",
        borderColor: "#bbb",
        borderWidth: 1,
        borderRadius: 5,
      }
});

