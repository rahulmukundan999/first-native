import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { AsyncStorage } from 'react-native';
interface Props {
    navigation: any
}




export default class Home extends React.Component<Props> {


    async componentDidMount() {
        try {
            const value = await AsyncStorage.getItem('customer');
            console.log('gregreg', value);
            if (value !== null) {
                setTimeout(() => {
                    this.props.navigation.navigate('Dashboard')
                }, 1000); console.log(value);
            } else {
                setTimeout(() => {
                    this.props.navigation.navigate('Login')
                }, 1000);
            }
        } catch (error) {
            alert('home' + error);
        }
    }

    render() {

        return (
            <View style={styles.container}>
                <Image
                    source={require('./mynu.png')}
                    style={{ width: 500, height: 400 }}
                />
            </View>
        );
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