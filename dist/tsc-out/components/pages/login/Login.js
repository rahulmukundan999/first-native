import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { LoginService } from '../../services/login';
import { AsyncStorage } from 'react-native';
export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.loginService = new LoginService();
        this.state = {
            name: ''
        };
        this.onChangeText = this.onChangeText.bind(this);
        this.login = this.login.bind(this);
    }
    onChangeText(text) {
        console.log('hello', text);
        this.setState({ name: text });
    }
    login() {
        let data = {
            name: this.state.name,
        };
        this.loginService.getDetails(data, (result) => {
            console.log('fewfwe', result);
            if (result.status == 200) {
                let temp = {
                    customerId: result.customer.id,
                    isVerified: result.customer.isVerified
                };
                try {
                    AsyncStorage.setItem('customer', JSON.stringify(temp));
                    this.props.navigation.navigate('Dashboard');
                }
                catch (error) {
                    alert('Sorry some technical problem');
                }
            }
            else {
                alert('false');
            }
        });
    }
    render() {
        return (React.createElement(View, { style: styles.container },
            React.createElement(TextInput, { style: styles.input, underlineColorAndroid: "transparent", placeholder: "Email", placeholderTextColor: "#9a73ef", autoCapitalize: "none", onChangeText: text => this.onChangeText(text) }),
            React.createElement(TouchableOpacity, { style: styles.submitButton, onPress: () => this.login() },
                React.createElement(Text, { style: styles.submitButtonText }, " Submit "))));
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButton: {
        backgroundColor: '#7a42f4',
        padding: 10,
        margin: 15,
        height: 40,
    },
    submitButtonText: {
        color: 'white'
    },
    input: {
        margin: 15,
        height: 40,
        borderColor: '#7a42f4',
        borderWidth: 1
    }
});
//# sourceMappingURL=Login.js.map