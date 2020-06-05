import React, { Component } from 'react';
import { Button, Modal, Dimensions, StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { TextField, FilledTextField } from 'react-native-material-textfield';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Dialog, { DialogContent } from "react-native-popup-dialog";
import { Video } from "expo-av";
import { Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { RaisedTextButton } from "react-native-material-buttons";
import Environment from "../../../database/sqlEnv";
import UserInfo from "../../../state/UserInfo";
import uuid from "uuid";
import firebase from "../../../database/irDb";

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
            photos: null,
            video: null,
            changedRewardFields: [],
            pictureModal: false,
            visible: false,
            uploading: false,
            googleResponse: null,
        };
    }

    componentDidMount() {
        this.props.navigation.addListener(
            'didFocus',
            (payload) => {
                console.log('running component did mount for rewards');
            }
        )
    }

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


    async updateRewardField(tag, value) {
        // console.log("in fetch tag is and value is " + tag + " ")
        // console.log("updating reward field");
        console.log("Hi I am here");
        var data = {
            [tag]: value,
        };
        try {
            let response = await fetch(
                Environment + "/updateReward" + this.state.rewardId,
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
        }
        catch (errors) {
            console.log(errors);
        }
    }



    pushToChangedRewardsFields(tag, value) {
        Object.keys(this.state.changedRewardFields).map(function (keyName, keyIndex) {
            if (keyName === tag) {
                return;
            }
        });
        console.log("TAG " + tag + " VALUE " + value);

        let tempArray = this.state.changedRewardFields;
        console.log(this.state.changedRewardFields);
        tempArray.push({ [tag]: value });
        console.log("MADE A REWARDS ARRAY " + tempArray);
        this.setState({ changedRewardFields: tempArray });
        // console.log("Changed reward fields state" + this.state.changedRewardFields);

    }


    updateExistingRewardChanges() {
        // console.log("CHANGED REWARD FIELDS " + this.state.changedRewardFields);
        console.log("hello are you there");
        for (const keyValuePair of this.state.changedRewardFields) {
            Object.entries(keyValuePair).map(([key, val]) => {
                this.updateRewardField(key, val);
            });
        }
        this.props.navigation.navigate("ParentRewards");
    }



   
    //from EditActivity
    _handleButtonPress = async () => {
        console.log("Button is pressed!");
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });
        if (pickerResult) {
            console.log("picker result is here " + pickerResult);
            // this._handleImagePicked(pickerResult, imageName);
            this._handleImagePicked(pickerResult);
            // this.setState({ photos: pickerResult });
        }
    };

    videoPicker = async () => {
        let vid = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        });

        // this.setState({ rewardVideo: vid });
        this._handleVideoPicked(vid);

    };
    // Take Photo 
    takePhoto = async () => {
        let pickerResult = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });

        this.setState({ photos: pickerResult });
        this._handleImagePicked(pickerResult);
    };


    _handleImagePicked = async (pickerResult) => {
        try {
            this.setState({ uploading: true });

            if (!pickerResult.cancelled) {
                var uploadUrl = await this.uploadImageAsync(pickerResult.uri);
                console.log("Upload URl is " + uploadUrl);
                this.setState({ rewardImage: uploadUrl });
                // this.submitToGoogle();

            }
        } catch (e) {
            console.log(e);
            alert("Upload failed, sorry :(");
        } finally {
            this.setState({ uploading: false });
        }
    };

    _handleVideoPicked = async (pickerResult) => {
        try {
            this.setState({ uploading: true });

            if (!pickerResult.cancelled) {
                var uploadUrl = await this.uploadImageAsync(pickerResult.uri);
                console.log("Upload URl is " + uploadUrl);
                this.setState({ rewardVideo: uploadUrl });
                // this.submitToGoogle();

            }
        } catch (e) {
            console.log(e);
            alert("Upload failed, sorry :(");
        } finally {
            this.setState({ uploading: false });
        }
    };

    async uploadImageAsync(uri) {
        console.log("uploading reward");
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });

        const ref = firebase
            .storage()
            .ref()
            .child(uuid.v4());
        const snapshot = await ref.put(blob);

        blob.close();

        return await snapshot.ref.getDownloadURL();
    }

    submitToGoogle = async () => {
        try {

            this.setState({ uploading: true });
            let { rewardImage } = this.state;
            let { rewardVideo } = this.state;
            let body = JSON.stringify({
                requests: [
                    {
                        features: [
                            { type: "LABEL_DETECTION", maxResults: 10 },
                            { type: "LANDMARK_DETECTION", maxResults: 5 },
                            { type: "FACE_DETECTION", maxResults: 5 },
                            { type: "LOGO_DETECTION", maxResults: 5 },
                            { type: "TEXT_DETECTION", maxResults: 5 },
                            { type: "DOCUMENT_TEXT_DETECTION", maxResults: 5 },
                            { type: "SAFE_SEARCH_DETECTION", maxResults: 5 },
                            { type: "IMAGE_PROPERTIES", maxResults: 5 },
                            { type: "CROP_HINTS", maxResults: 5 },
                            { type: "WEB_DETECTION", maxResults: 5 },
                        ],
                        image: {
                            source: {
                                imageUri: rewardImage,
                            },
                        },
                        Video: {
                            source: {
                                videoUri: rewardVideo,
                            },
                        },
                    },
                ],
            });
            let response = await fetch(
                "https://vision.googleapis.com/v1/images:annotate?key=" +
                irEnv["GOOGLE_CLOUD_VISION_API_KEY"],
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: body,
                }
            );
            let responseJson = await response.json();
            this.setState({
                googleResponse: responseJson,
                uploading: false,
            });
        } catch (error) {
            console.log(error);
        }
    };


    //Choose Photo or video
    returnImage = () => {
        let { rewardImage, googleResponse } = this.state;
        if (this.state.rewardImage) {
            return (
                <Image
                    style={{ width: 300, height: 200, borderRadius: 15 }}
                    source={{ uri: this.state.rewardImage }}
                />
            );
        }
        else {
            return <Icon name="camera-enhance" color="#DADADA" size={100} />;
        }
    };


    returnVideo = () => {
        let { rewardVideo, googleResponse } = this.state;
        if (this.state.rewardVideo) {
            return (
                <Video
                    source={{ uri: this.state.rewardVideo }}
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


    _onSubmit = () => {
        // console.log("rewardId " + this.state.rewardId);
        if (this.state.rewardId != null) {
            // console.log("existing reward edits");
            console.log("right one");
            this.pushToChangedRewardsFields("reward_image", this.state.rewardImage)
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

    clickedCameraIcon() {
        this.setState({ pictureModal: true });
    }

    cancelCameraIcon() {
        this.setState({ pictureModal: false });
    }


    render() {

        const { navigate } = this.props.navigation

        return (

            <ScrollView style={{ backgroundColor: "#FFFCF9", padding: 20 }}>

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
                                        // onPress={this._handleButtonPress}
                                        onPress={() => {
                                            this.clickedCameraIcon();
                                        }}
                                    >
                                        {this.returnImage()}

                                    </TouchableOpacity>
                                </View>
                            </View>

                            <Dialog
                                style={styles.bottomModal}
                                hasOverlay={true}
                                overlayOpacity={0.1}
                                visible={this.state.pictureModal}
                                onTouchOutside={() => {
                                    this.cancelCameraIcon();
                                }}
                            >



                                <View style={styles.editRoutineIconAndTitle}>

                                    <View style={{
                                        alignItems: "center",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        margin: 70,

                                    }}>



                                        <Button
                                            title="Take a Photo"
                                            onPress={this.takePhoto}

                                        />

                                        <Button
                                            title="Choose from Library"
                                            onPress={this._handleButtonPress}
                                        />


                                    </View>

                                </View>

                            </Dialog>



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
    tagModal: {
        margin: 12,
        backgroundColor: "#f7f7f7",
        padding: 20,
        width: "50%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.65,
        shadowRadius: 3.84,
        elevation: 5,
    },
    bottomModal: {
        fontSize: 30,
        marginRight: 200,
        flexDirection: "row",
        marginTop: 20,
        borderBottomColor: "#C4C4C4",
        borderBottomWidth: 1,
        marginBottom: 30,
    },
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
    buttonstyle: {
        fontSize: 15,
        padding: 0,
        margin: 0,
        fontWeight: "bold",
    },
});

