import React, { Component } from 'react';
import { View } from 'react-native';


export default class Notifications extends Component {

    constructor(props) {
        super(props)
        this.state = {
            prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
        };
    }

    fieldRef = React.createRef();

    render() {
        
        const { navigate } = this.props.navigation
        return (

            <View style={{ flex: 1 }}>
                {/* <ScrollView >
                <Text>My Notifications</Text>
                </ScrollView> */}
            </View>
        );

    }
}

