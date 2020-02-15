import { Modal, Text, TouchableHighlight, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import React, { Component } from 'react';

export default class DialogBox extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: true
        }
    }

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => this.setState({ modalVisible: true })}
            // presentationStyle="overFullScreen"
            >
                <View style={{
                    flex: 1,
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center'
                }} >
                    <TouchableOpacity onPress={() => {
                        this.setState({ modalVisible: false })
                        console.log('grger', this.state.modalVisible)
                    }}>
                        <Text>tetewtwet</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }
}