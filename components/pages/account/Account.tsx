import React, { Component } from "react";
import { TouchableOpacity, Text, View, AsyncStorage } from "react-native";

export default class Account extends Component<any, any> {
    constructor(props) {
        super(props);
    }

    logOut = async () => {
        alert('Logged out')
        await AsyncStorage.removeItem('customer');
        this.props.navigation.navigate('Login');
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={this.logOut}>
                    <Text>Logout</Text>
                </TouchableOpacity>
            </View>
        )
    }
}