import React, { Component } from 'react';
import { Button, Dimensions, StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { TextField, FilledTextField } from 'react-native-material-textfield';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-material-dropdown';
// import YouTube from 'react-native-youtube';
import { Video } from "expo-av";
import { Image } from "react-native";
import * as ImagePicker from "expo-image-picker";

const { width: WIDTH } = Dimensions.get('window')

export const App = () => (
    <MenuProvider>
        <YourApp />
    </MenuProvider>
);


export default class ParentRewards extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Edit Reward',
        prevScreenTitle: 'Parent Routines',
    });


    constructor(props) {
        super(props)
        this.state = {
            photos: null,
            video: null
            // reward1: null,
            // reward2: null,
            // reward3: null,
            // reward4: null,
            //prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
        };
    }

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

        let routineData = [
            {
                value: 'Morning Routieeee',
            },

            {
                value: 'After School Routine',
            },

            {
                value: 'Summer Morning Routine',
            },

            {
                value: 'Pear',
            }

        ];

        let activityData = [
            {
                value: 'Brush Teeth',
            },

            {
                value: 'Get Dressed',
            },

            {
                value: 'Wash Hands',
            },

            {
                value: 'Eat Snack ',
            },

            {
                value: 'Brush Hair ',
            }

        ];

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

                        <Text style={styles.textFields}>
                            Select Routine
                    </Text>

                        <Dropdown
                            label="Select Routine"
                            data={routineData}
                        />


                        <Text style={styles.textFields}>
                            Select Activity
                    </Text>

                        <Dropdown
                            label="Select Activity"
                            data={activityData}
                        />




                        <View style={styles.editRoutineIconAndTitle}>
                            < Text style={styles.textFields}>
                                Add Image
                            </Text>
                            <View style={{ margin: 20, alignItems: "center" }}>
                                <TouchableOpacity
                                    style={styles.camerabutton}
                                    onPress={this._handleButtonPress}
                                >
                                    {this.returnImage()}
                                </TouchableOpacity>
                            </View>

                        </View>
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

            </View>

            //  <View style={styles.textFields}>
            //     <View>
            //         <View style={styles.editRoutineIconAndTitle}>
            //             <Icon style={styles.routineDetailsIcon} name="gift" />
            //             <Text style={styles.editRoutineSectionName}>Rewards</Text>
            //         </View>

            //         <Text style={styles.editRoutinesInstructionsText}>
            //             {/* TO DO: only say routine in the text string if the word isnt in the routine title */}
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
      }
});

