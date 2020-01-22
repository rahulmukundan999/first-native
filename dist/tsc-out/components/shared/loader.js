import { Placeholder, PlaceholderMedia, PlaceholderLine, ShineOverlay, } from 'rn-placeholder';
import { Dimensions, View } from 'react-native';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
import React from 'react';
export default class Loader extends React.Component {
    render() {
        const temp = [1, 1, 1, 1, 1, 1, 1];
        return (React.createElement(View, null, temp.map(value => (React.createElement(View, { style: { marginTop: 20 } },
            React.createElement(Placeholder, { Left: PlaceholderMedia, 
                // Right={PlaceholderMedia}
                Animation: ShineOverlay },
                React.createElement(PlaceholderLine, { width: WIDTH, height: HEIGHT / 40 }),
                React.createElement(PlaceholderLine, null),
                React.createElement(PlaceholderLine, { width: WIDTH, height: HEIGHT / 40 })))))));
    }
}
//# sourceMappingURL=loader.js.map