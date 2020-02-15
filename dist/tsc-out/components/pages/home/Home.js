import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { AsyncStorage } from 'react-native';
export default class Home extends React.Component {
    async componentDidMount() {
        try {
            const value = await AsyncStorage.getItem('customer');
            console.log('gregreg', value);
            if (value !== null) {
                setTimeout(() => {
                    this.props.navigation.navigate('Dashboard');
                }, 1000);
                console.log(value);
            }
            else {
                setTimeout(() => {
                    this.props.navigation.navigate('Login');
                }, 1000);
            }
        }
        catch (error) {
            alert('home' + error);
        }
    }
    render() {
        return (React.createElement(View, { style: styles.container },
            React.createElement(Image, { source: require('./mynu.png'), style: { width: 500, height: 400 } })));
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
//# sourceMappingURL=Home.js.map