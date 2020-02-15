import { View, Text, Image, Animated } from "react-native";
import React from "react";
import { TouchableOpacity } from 'react-native-gesture-handler';


// const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);


export default function MenuIcons(props) {
    //console.log('gregr', props);
    const orderType = props.details.orderType;
    if (orderType == 'dine_in') {
        return (
            <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 10, marginBottom: 10 }}>
                <TouchableOpacity onPress={() => alert("grereghy")}>
                    <View style={{ flexDirection: 'column', marginLeft: 40, height: 60 }}>
                        <Image resizeMode="contain" style={{ height: 45, width: 50, marginLeft: 6, marginBottom: 2 }} source={require('../../../assets/icons/callwaiter.png')} />
                        <Text style={{ fontSize: 12 }}>Call Waiter</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ flexDirection: 'column', marginLeft: 60, height: 60 }}>
                    <Image resizeMode="contain" style={{ height: 45, width: 50, marginLeft: 10, marginBottom: 2 }} source={require('../../../assets/icons/changetable.png')} />
                    <Text style={{ fontSize: 12 }}>Change Table</Text>

                </View>

            </View>
        )
    } else {
        return (
            <View></View>
        )
    }
}