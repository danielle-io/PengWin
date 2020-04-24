import React, {Component} from 'react';
import {Text, View, Image, Dimensions} from 'react-native';

export default class ChildRewards extends Component {
  render() {
    //TODO: Figure out how this page looks
    return (
      <View style={{alignItems: 'center'}}>
        <Image
          source={{uri: 'http://cliparts.co/cliparts/j5c/Rkg/j5cRkgzTa.png'}}
          style={{width: 400, height: 400, marginTop: 100}}
        />
        <Text>This page is being built!</Text>
      </View>
    );
  }
}
