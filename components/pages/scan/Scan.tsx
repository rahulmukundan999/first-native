import React from 'react';
import { Text, View, StyleSheet, Button, Dimensions, AsyncStorage } from 'react-native';
import { Camera } from 'expo-camera';
import PopupLoader from '../../shared/popup';
import * as Permissions from 'expo-permissions';
import Entypo from 'react-native-vector-icons/Entypo';
import { ScanService } from '../../services/scan';
import Constants from 'expo-constants';
import { bindActionCreators } from 'redux';
import { addFriend } from '../../data/FriendAction';
import { connect } from 'react-redux';


class Scan extends React.Component<any, any> {


    willFocus: any;
    willBlur: any;

    scanService: ScanService = new ScanService();


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
            focusedScreen: false,
            loading: false
        }
    }

    async componentDidMount() {
        this.getPermissionsAsync();
        const { navigation } = this.props;
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
        // navigation.removeListener('willFocus');
        // navigation.removeListener('willBlur');
    }

    torchFlag = () => {
        let temp = this.state.torchEnabled;
        temp = !temp;
        this.setState({ torchEnabled: temp })
    }

    getPermissionsAsync = async () => {
        // const { status } = await Permissions.askAsync(Permissions.CAMERA);
        const { status, expires, permissions } = await Permissions.getAsync(
            Permissions.CAMERA,
            // Permissions.CONTACTS
        );
        this.setState({ hasCameraPermission: status === 'granted' });
    };

    render() {
        const { hasCameraPermission, scanned } = this.state;

        if (hasCameraPermission === null) {
            return <Text>Requesting for camera permission</Text>;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else if (this.state.focusedScreen) {
            return (
                <Camera
                    onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
                    flashMode={this.state.torch[this.state.torchEnabled]}
                    style={[StyleSheet.absoluteFill, styles.cameraContainer]}>
                    <View style={[styles.bottomView, { backgroundColor: this.state.torchEnabled ? 'white' : 'grey' }]}>
                        <Entypo style={[styles.torch, { color: this.state.torchEnabled ? 'orange' : 'white' }]} onPress={() => this.torchFlag()} name="flashlight"
                            size={
                                32
                            }
                        />
                    </View>
                    {this.state.loading ? (
                        <PopupLoader sound="true" />
                    ) : (<View></View>)}
                </Camera>
            );
        } else {
            return (
                <View></View>
            )
        }
    }
    handleBarCodeScanned = async ({ type, data }) => {
        this.setState({ scanned: true, loading: true });
        let temp: any = {
            code: data,
            name: 'gghh'
        }
        this.scanService.scanTable(temp, (result: any) => {
            console.log('fwefwegwe', result);
            // this.setState({ scanned: false });
            this.setState({ loading: false, scanned: false })

            temp = {
                ...result
            }
            if (result.status == 401) {
                alert('You have already scanned');
            } else {
                this.props.addFriend(temp);
                this.props.navigation.navigate('Menu');
            }
        })
    }

    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
}
// onPress={() => this.props.navigation.navigate('Details')}>

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        addFriend,
    }, dispatch)
);

export default connect(null, mapDispatchToProps)(Scan);


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
        position: 'absolute', //Here is the trick
        bottom: '15%', //Here is the trick
        right: '6%'
    },
    textStyle: {
        color: '#fff',
        fontSize: 18,
    }
});