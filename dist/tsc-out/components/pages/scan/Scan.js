import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import Entypo from 'react-native-vector-icons/FontAwesome';
import { ScanService } from '../../services/scan';
export default class Scan extends React.Component {
    constructor(props) {
        super(props);
        this.scanService = new ScanService();
        this.torchFlag = () => {
            let temp = this.state.torchEnabled;
            temp = !temp;
            this.setState({ torchEnabled: temp });
        };
        this.getPermissionsAsync = async () => {
            const { status } = await Permissions.askAsync(Permissions.CAMERA);
            this.setState({ hasCameraPermission: status === 'granted' });
        };
        this.handleBarCodeScanned = async ({ type, data }) => {
            this.setState({ scanned: true });
            let temp = {
                code: data,
                name: 'gghh'
            };
            this.scanService.scanTable(temp, (result) => {
                console.log('fwefwegwe', result);
                temp = {
                    ...result
                };
                if (result.status == 401) {
                    alert('You have already scanned');
                }
                else {
                    this.props.navigation.navigate('Menu', {
                        details: JSON.stringify(temp)
                    });
                }
            });
        };
        this.state = {
            hasCameraPermission: null,
            scanned: false,
            torch: {
                false: Camera.Constants.FlashMode.off,
                true: Camera.Constants.FlashMode.torch
            },
            torchEnabled: false,
            focusedScreen: false
        };
    }
    async componentDidMount() {
        this.getPermissionsAsync();
        const { navigation } = this.props;
        navigation.addListener('willFocus', () => this.setState({ focusedScreen: true, scanned: false }));
        navigation.addListener('willBlur', () => this.setState({ focusedScreen: false, scanned: true }));
    }
    async componentWillUnmount() {
        const { navigation } = this.props;
        navigation.removeListener('willFocus');
        navigation.removeListener('willBlur');
    }
    render() {
        const { hasCameraPermission, scanned } = this.state;
        if (hasCameraPermission === null) {
            return React.createElement(Text, null, "Requesting for camera permission");
        }
        else if (hasCameraPermission === false) {
            return React.createElement(Text, null, "No access to camera");
        }
        else if (this.state.focusedScreen) {
            return (React.createElement(Camera, { onBarCodeScanned: scanned ? undefined : this.handleBarCodeScanned, flashMode: this.state.torch[this.state.torchEnabled], style: [StyleSheet.absoluteFill, styles.cameraContainer] },
                React.createElement(View, { style: [styles.bottomView, { backgroundColor: this.state.torchEnabled ? 'white' : 'grey' }] },
                    React.createElement(Entypo, { style: [styles.torch, { color: this.state.torchEnabled ? 'orange' : 'white' }], onPress: () => this.torchFlag(), name: "flashlight", size: 32 }))));
        }
        else {
            return (React.createElement(View, null));
        }
    }
}
// onPress={() => this.props.navigation.navigate('Details')}>
const styles = StyleSheet.create({
    torch: {
        // color: 'white',
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
        // borderWidth: 1,
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
//# sourceMappingURL=Scan.js.map