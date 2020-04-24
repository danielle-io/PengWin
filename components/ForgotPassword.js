
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

export default class ForgotPassword extends Component {


    constructor(props) {
        super(props)
        this.state = {
            prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
        };
    }

    render() {

        const { navigate } = this.props.navigation
        return (

            <View>
       
            </View>
        );
    }
}

const styles = StyleSheet.create({

});
