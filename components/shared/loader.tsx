import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade,
    Shine,
    ShineOverlay,
} from 'rn-placeholder';

import { Dimensions, View } from 'react-native';


const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

import React, { Component } from 'react';


export default class Loader extends React.Component<any, any> {


    render() {

        const temp = [1, 2, 3, 4, 5, 6, 7];
        return (
            <View>
                {temp.map(value => (
                    <View style={{ marginTop: 20 }} key={value}>
                        <Placeholder
                            Left={PlaceholderMedia}
                            // Right={PlaceholderMedia}
                            Animation={ShineOverlay}>
                            <PlaceholderLine width={WIDTH} height={HEIGHT / 40} />
                            <PlaceholderLine />
                            <PlaceholderLine width={WIDTH} height={HEIGHT / 40} />
                        </Placeholder>
                    </View>
                ))}
            </View>
        )
    }
}