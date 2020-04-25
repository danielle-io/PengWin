import React, {Component} from 'react';
import CameraRoll from '@react-native-community/cameraroll';
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import {TextField} from 'react-native-material-textfield';
import {Image} from 'react-native';
import Tags from 'react-native-tags';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
Icon.loadFont();

const mainColor = '#3ca897';

const {width: WIDTH} = Dimensions.get('window');

_handleButtonPress = () => {
  CameraRoll.getPhotos({
    first: 20,
    assetType: 'Photos',
  })
    .then(r => {
      this.setState({photos: r.edges});
    })
    .catch(err => {
      //Error Loading Images
    });
};

export default class Activity extends Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Add an Activity', //`${navigation.state.params.currentRoutine}`,
    prevScreenTitle: 'Activities',
    headerTitleStyle: {textAlign: 'center', alignSelf: 'center'},
    headerStyle: {
      backgroundColor: 'white',
    },
  });

  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
      tags: {
        tag: '',
        tagsArray: [],
      },
      tagsColor: mainColor,
      tagsText: '#fff',
    };
  }

  updateTagState = state => {
    this.setState({
      tags: state,
    });
  };

  fieldRef = React.createRef();

  onSubmit = () => {
    let {current: field} = this.fieldRef;
    console.log(field.value());
  };

  formatText = text => {
    return text.replace(/[^+\d]/g, '');
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      <ScrollView style = {{backgroundColor: '#FFFCF9'}}>
        <View style={styles.textFields}>
          <Text>What is this activity called?</Text>

          <TextField
            placeholder="(e.g. Wear Shoes)"
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

        <View style={(styles.descriptionBox, styles.textFields)}>
          <Text>Tags</Text>
          <Text>Enter some words that match what this activity entails.</Text>
          <Tags
            initialText="Insert a tag"
            textInputProps={{
              placeholder: 'Activity Tags',
            }}
            initialTags={['Shoes', 'Nike']}
            onChangeTags={tags => console.log(tags)}
            onTagPress={(index, tagLabel, event, deleted) =>
              console.log(
                index,
                tagLabel,
                event,
                deleted ? 'deleted' : 'not deleted',
              )
            }
            containerStyle={{justifyContent: 'center'}}
            inputStyle={{backgroundColor: 'white'}}
            renderTag={({tag, index, onPress, deleteTagOnPress, readonly}) => (
              <View style={styles.tagsbutton}>
                <Text style={styles.text}>{tag} </Text>
                <TouchableOpacity
                  style={{paddingLeft: 19}}
                  key={`${tag}-${index}`}
                  onPress={onPress}>
                  <Text style={styles.text}>X</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        <View style={(styles.descriptionBox, styles.textFields)}>
          <Text>Activity Image</Text>
          <Text>
            Upload an image your child can scan to show activity completion.
          </Text>

          <TouchableOpacity
            style={styles.camerabutton}
            onPress={this._handleButtonPress}>
            <Icon name="camera-enhance" color="#DADADA" size={100} />
          </TouchableOpacity>

          {this.state.photos.map((p, i) => {
            return (
              <Image
                key={i}
                style={{
                  width: 300,
                  height: 100,
                }}
                source={{uri: p.node.image.uri}}
              />
            );
          })}
        </View>

        <View style={(styles.descriptionBox, styles.textFields)}>
          <Text>Description</Text>
          <TextField
            placeholder="Explain steps that would help your child complete the activity."
            // defaultValue="!123"
            // labelOffset={10}
            style={
              (styles.textfieldWithFloatingLabel,
              styles.textFields,
              styles.descriptionLines)
            }
            textInputStyle={{flex: 1}}
            onFocus={e => console.log('Focus', !!e)}
            onBlur={e => console.log('Blur', !!e)}
            onEndEditing={e => console.log('EndEditing', !!e)}
            onSubmitEditing={e => console.log('SubmitEditing', !!e)}
            onTextChange={s => console.log('TextChange', s)}
            onChangeText={s => console.log('ChangeText', s)}
            multiline={true}
          />
        </View>

        <View style={(styles.descriptionBox, styles.textFields)}>
          <Text>Audio</Text>
          <Text>
            Is your child an auditory learner? They might like to hear you
            explain the activity to them.
          </Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={styles.button}>
              <Icon name="microphone" color="#FF6978" size={30} />
              <Text>Record</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <Icon name="upload" color="#FF6978" size={30} />
              <Text>Choose from voice notes</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={(styles.descriptionBox, styles.textFields)}>
          <Text>Video</Text>
          <Text>
            Is your child a visual learner? A video might help your child learn
            how to do the activity step-by-step.
          </Text>

          <TouchableOpacity style={styles.camerabutton}>
            <Icon name="camera-enhance" color="#DADADA" size={100} />
          </TouchableOpacity>
        </View>

        <View style={(styles.descriptionBox, styles.textFields)}>
          <Text>Activity Reward</Text>
          <Text>
            Positive reinforcement is amazing for kids! An image and/or a video
            of the reward (eg: video of baby shark) might get your child pumped
            to perform their activities.
          </Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={styles.button}>
              <Icon name="text" color="#FF6978" size={30} />
              <Text>Description</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <Icon name="camera" color="#FF6978" size={30} />
              <Text>Image</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <Icon name="video" color="#FF6978" size={30} />
              <Text>Video</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text>Save</Text>
        </TouchableOpacity>
      </ScrollView>
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
    marginTop: 10,
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
    backgroundColor: '#e8e8e8',
  },
  roundButton: {
    fontSize: 30,
    height: 50,
    minWidth: 50,
    width: 50,
    borderRadius: 50,
    color: '#40b6ac',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: mainColor,
  },
  textInput: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    marginTop: 8,
    borderRadius: 5,
    padding: 3,
  },
  tag: {
    backgroundColor: '#fff',
  },
  tagText: {
    color: mainColor,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsbutton: {
    fontSize: 30,
    height: 35,
    minWidth: 50,
    width: 100,
    borderRadius: 20,
    backgroundColor: '#FFFCF9',
    borderColor: '#FF6978',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    margin: 5,
  },
  button: {
    fontSize: 30,
    height: 35,
    width: 200,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderColor: '#FF6978',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    margin: 5,
  },
  camerabutton: {
    fontSize: 30,
    height: 200,
    width: 300,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    margin: 5,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  text: {
    color: '#FF6978',
  },
});
