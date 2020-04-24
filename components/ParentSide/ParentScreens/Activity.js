import React, { Component } from 'react';
import CameraRoll from "@react-native-community/cameraroll";
import { Dimensions, StyleSheet, ScrollView, View, TouchableOpacity, Text } from 'react-native';
import ImagePlaceholder from '../../../assets/images/empty-image.png';
import { TextField, FilledTextField } from 'react-native-material-textfield';
import Container from '@material-ui/core/Container';
import { RaisedTextButton } from 'react-native-material-buttons';
import { Image } from 'react-native'

const { width: WIDTH } = Dimensions.get('window')

_handleButtonPress = () => {
    CameraRoll.getPhotos({
        first: 20,
        assetType: 'Photos',
    })
        .then(r => {
            this.setState({ photos: r.edges });
        })
        .catch((err) => {
            //Error Loading Images
        });
};

export default class Activity extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.currentRoutine}`,
        prevScreenTitle: 'Activities',
        headerTitleStyle: { textAlign: 'center', alignSelf: 'center' },
        headerStyle: {
            backgroundColor: 'white',
        },
    });

    constructor(props) {
        super(props)
        this.state = {
            photos: [],
            prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
        };
    }

    fieldRef = React.createRef();

    onSubmit = () => {
        let { current: field } = this.fieldRef;
        console.log(field.value());
    };

    formatText = (text) => {
        return text.replace(/[^+\d]/g, '');
    };

    render() {
        
        const { navigate } = this.props.navigation
        return (

            <View style={{ flex: 1 }}>
                <ScrollView >
                    <View style={styles.textFields}>
                        <TextField
                             placeholder="Activity Name"
                            // // defaultValue="!123"
                            // style={styles.textfieldWithFloatingLabel,
                            //     styles.textFields}
                            // textInputStyle={{ flex: 1 }}
                            // onFocus={e => console.log('Focus', !!e)}
                            // onBlur={e => console.log('Blur', !!e)}
                            // onEndEditing={e => console.log('EndEditing', !!e)}
                            // onSubmitEditing={e => console.log('SubmitEditing', !!e)}
                            // onTextChange={s => console.log('TextChange', s)}
                            // onChangeText={s => console.log('ChangeText', s)}

                            
                            // onChangeText = { (text) => this.setState({activityName : text})}
                        />
                    </View>

                    <View style={styles.descriptionBox, styles.textFields}>
                        <TextField
                            placeholder="Description"
                            // defaultValue="!123"
                            // labelOffset={10}
                            style={styles.textfieldWithFloatingLabel,
                                styles.textFields, styles.descriptionLines}
                            textInputStyle={{ flex: 1 }}
                            onFocus={e => console.log('Focus', !!e)}
                            onBlur={e => console.log('Blur', !!e)}
                            onEndEditing={e => console.log('EndEditing', !!e)}
                            onSubmitEditing={e => console.log('SubmitEditing', !!e)}
                            onTextChange={s => console.log('TextChange', s)}
                            onChangeText={s => console.log('ChangeText', s)}
                            multiline={true}
                        />

                    </View>
                </ScrollView>


                <ScrollView>
                    <View style={styles.imageContainer}>
                       
                        <View style={styles.imageButton}>
                            <TouchableOpacity
                                onPress={this._handleButtonPress}>
                                <Text style={{ fontSize: 32, color: 'grey' }}>+</Text>
                            </TouchableOpacity>
                            {/* <Button 
            color='grey'
            fontSize='30'
            
            title="+" onPress={this._handleButtonPress}>
                <Text style={{fontSize:32,}}>Some Text</Text>
                </Button>   */}
                        </View>
                        {this.state.photos.map((p, i) => {
                            return (
                                <Image
                                    key={i}
                                    style={{
                                        width: 300,
                                        height: 100,
                                    }}
                                    source={{ uri: p.node.image.uri }}
                                />
                            );
                        })}
                    </View>
                </ScrollView>

            </View>
            
        );

    }
}

const styles = StyleSheet.create({
    addImageButton: {
        color: 'grey',
        fontSize: 65,
    },
    activityImage: {
        position: 'absolute',
        paddingHorizontal: 50,
        height: 200,
        width: 200,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 200,
    },
    imageButton: {
        marginTop: 50,
        marginLeft: 100,
    },
    textFields: {
        padding: 2,
        margin: 2,
        marginLeft: 10,
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
    lowerCorner: {
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'flex-end',
        marginRight: 20,
    },
    footer: {
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderTopWidth: 1,
        borderTopColor: '#e8e8e8',
        backgroundColor: '#e8e8e8'
    },
    roundButton: {
        fontSize: 30,
        height: 50,
        minWidth: 50,
        width: 50,
        borderRadius: 50,
        color: '#40b6ac',
    },
});