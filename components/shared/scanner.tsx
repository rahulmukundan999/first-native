import React, { Component } from "react";
import { Text, View, StyleSheet, Button, Dimensions, AsyncStorage, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import Entypo from 'react-native-vector-icons/Entypo';

export default class Scanner extends Component<any, any> {


    willFocus: any;
    willBlur: any;

    constructor(props) {
        super(props);
        this.state = {
            hasCameraPermission: null,
            scanned: false,
            torch: {
                false: Camera.Constants.FlashMode.off,
                true: Camera.Constants.FlashMode.torch
            },
            torchEnabled: false,
            focusedScreen: false
        }
    }

    async componentDidMount() {
        this.getPermissionsAsync();
        const { navigation } = this.props.props;
        console.log('gregerg');
        this.willFocus = navigation.addListener('willFocus', () =>
            this.setState({ focusedScreen: true, scanned: false })
        );
        this.willBlur = navigation.addListener('willBlur', () =>
            this.setState({ focusedScreen: false, scanned: true })
        );
    }

    async componentWillUnmount() {
        this.willFocus.remove();
        this.willBlur.remove();
    }

    torchFlag = () => {
        let temp = this.state.torchEnabled;
        temp = !temp;
        this.setState({ torchEnabled: temp })
    }

    getPermissionsAsync = async () => {
        const { status } = await Permissions.askAsync(
            Permissions.CAMERA
        );
        console.log('stats', status);
        this.setState({ hasCameraPermission: status === 'granted' });
    };



    render() {
        const { hasCameraPermission, scanned } = this.state;

        if (hasCameraPermission === null) {
            return <View style={{ height: '100%', width: '100%', backgroundColor: 'white' }}></View>;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else if (this.state.focusedScreen) {
            return (
                <Camera
                    onBarCodeScanned={this.props.scanned ? undefined : this.props.handleBarCodeScanned}
                    flashMode={this.state.torch[this.state.torchEnabled]}
                    style={[styles.cameraContainer]}>
                    {this.props.torch ? (

                        <View style={[styles.bottomView, { backgroundColor: this.state.torchEnabled ? 'white' : 'grey' }]}>
                            <Entypo style={[styles.torch, { color: this.state.torchEnabled ? 'orange' : 'white' }]} onPress={() => this.torchFlag()} name="flashlight"
                                size={
                                    32
                                }
                            />
                        </View>
                    ) : (<React.Fragment></React.Fragment>)}
                </Camera>
            );
        } else {
            return (
                <React.Fragment></React.Fragment>
            )
        }
    }
}


const styles = StyleSheet.create({

    torch: {
        marginLeft: 14,
        marginTop: 5
    },
    cameraContainer: {
        marginHorizontal: 0, marginLeft: 0, marginStart: 0,
        paddingHorizontal: 0, paddingLeft: 0, paddingStart: 0,
        height: '115%',
        padding: 0
    },
    description: {
        position: 'absolute',
        bottom: '50%',
        right: 0
    },
    bottomView: {
        width: '14%',
        height: 50,
        borderRadius: 300,
        backgroundColor: 'grey',
        position: 'absolute',
        bottom: '15%',
        right: '6%'
    },
    textStyle: {
        color: '#fff',
        fontSize: 18,
    }
});