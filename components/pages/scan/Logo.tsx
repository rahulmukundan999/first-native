import React, { Component } from 'react';
import ReactNative from 'react-native';
import { Image, Dimensions } from 'react-native';

const {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Animated
} = ReactNative;
var isHidden = false;
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class Logo extends Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            bounceValue: new Animated.Value(0),  //This is the initial position of the subview
            buttonText: "Show Subview",
            logo: '',
            showName: false,
            fadeAnim: new Animated.Value(0)
        };
    }

    componentDidMount() {
        let logo = this.props.navigation.getParam('logo');
        // setTimeout(() => {
        //     this.setState({ showName: true })
        // }, 1000);;
        this.setState({ fadeAnim: new Animated.Value(0) },
            () => {
                Animated.timing(          // Animate over time
                    this.state.fadeAnim, // The animated value to drive
                    {
                        toValue: 1,           // Animate to opacity: 1 (opaque)
                        duration: 2000,       // 2000ms
                    }
                ).start();
            })
        console.log('logo image', logo)
        this.setState({
            buttonText: "Hide Subview",
            logo: logo
        });

        var toValue = height / 2 - 200;

        if (isHidden) {
            toValue = 0;
        }

        //This will animate the transalteY of the subview between 0 & 100 depending on its current state
        //100 comes from the style below, which is the height of the subview.
        Animated.spring(
            this.state.bounceValue,
            {
                toValue: toValue,
                velocity: 1,
                tension: 10,
                friction: 11,
            }
        ).start();

        isHidden = !isHidden;
        setTimeout(() => {
            this.props.navigation.navigate('Menu');
        }, 3000);
    }


    _toggleSubview() {
    }

    render() {
        return (
            <View style={styles.container}>
                <Animated.View
                    style={[styles.subView,
                    { transform: [{ translateY: this.state.bounceValue }] }]}>
                    <Image
                        resizeMode="contain"
                        style={{ width: width, height: 300 }}
                        source={{ uri: this.state.logo ? this.state.logo : 'https://youmnu-items.s3.amazonaws.com/youmnu/5c6e5d743c30fa3c6e9c8300/items/166037411.jpeg' }} />
                    <Animated.View style={{ opacity: this.state.fadeAnim }} >
                        <View style={{ width: '100%', height: '100%', alignItems: 'center' }}>
                            <Text style={{ fontSize: 22, justifyContent: 'center' }}>Welcome</Text>
                        </View>
                    </Animated.View>
                </Animated.View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#F5FCFF',
        // marginTop: 66
    },
    button: {
        padding: 8,
    },
    subView: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0
    }
});
