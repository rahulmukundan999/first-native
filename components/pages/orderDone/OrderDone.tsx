import React, { Component } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity, TextInput, Keyboard } from "react-native";
import { Rating } from 'react-native-elements';
import { ScrollView } from "react-native-gesture-handler";

export default class OrderDone extends Component<any, any> {
    keyboardDidShowListener: any;
    keyboardDidHideListener: any;
    constructor(props) {
        super(props);
        this.state = {
            rating: 0,
            keyboardOffset: 0,

        }
    }


    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );
    }


    _keyboardDidShow = (event) => {
        this.setState({
            keyboardOffset: event.endCoordinates.height,
        })
    }

    _keyboardDidHide = () => {
        this.setState({
            keyboardOffset: 0,
        })
    }

    ratingCompleted = (rating) => {
        console.log('rating', rating);
        this.setState({ rating: rating })
    }

    render() {
        return (
            <View style={{ flex: 1, bottom: this.state.keyboardOffset }}>
                <View style={{ flexDirection: "row", marginLeft: 20 }}>
                    <Image resizeMode="contain" style={{ height: 110, width: 95 }} source={require(`../../../assets/anim/bell_ring.gif`)} />
                    <Text style={{ color: 'yellowgreen', marginLeft: 10, marginTop: 40, fontSize: 25 }}>Cashier Called</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                    <Text style={{ color: "dimgrey", fontSize: 15, marginLeft: 25, marginRight: 25 }}>Thank you! We informed the restaurant about your wish to pay and a cashier will come shortly</Text>
                </View>
                <View style={{ marginTop: 20, height: 35, backgroundColor: '#F8F8F8' }}>
                    <Text style={{ fontSize: 15, marginLeft: 15, color: 'grey', marginTop: 6 }}>HOW WAS YOUR EXPERIENCE?</Text>
                </View>

                <Text style={{ marginTop: 25, marginLeft: 25, fontSize: 15, color: "dimgrey" }}>Plese rate the mynu App to improve our service</Text>
                <View style={{ marginTop: 30, marginLeft: -160, paddingVertical: 10 }}>
                    <Rating fractions={1} startingValue={5} onFinishRating={this.ratingCompleted} imageSize={40} />
                </View>
                <TextInput
                    style={{ marginLeft: 25, textAlignVertical: 'top', marginRight: 25, borderColor: 'gray', borderWidth: 1 }}
                    placeholder="We love to hear your opinion"
                    numberOfLines={12}
                    multiline={true}
                />

                <View style={styles.footer}>
                    <TouchableOpacity style={{ width: '100%', height: '100%', alignItems: 'center' }} onPress={() => this.props.navigation.navigate('Order')}>
                        <Text style={{ fontSize: 20, color: 'white', marginTop: 20, justifyContent: 'center' }}>FINISH</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}



const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        flex: 0.1,
        left: 0,
        right: 0,
        bottom: -10,
        backgroundColor: 'orange',
        flexDirection: 'row',
        height: 80,
        // alignItems: 'center',
        justifyContent: 'center'
    }
});