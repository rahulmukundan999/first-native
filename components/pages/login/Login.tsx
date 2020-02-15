import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Picker } from 'react-native';
import { LoginService } from '../../services/login';
import { AsyncStorage } from 'react-native';
import PopupLoader from '../../shared/popup';
import Slideshow from './Slider';
interface Props {
    navigation: any
}

export default class Login extends React.Component<any, any> {

    loginService: LoginService = new LoginService();
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            loading: false,
            country: "india",
            images: true
        }
        this.onChangeText = this.onChangeText.bind(this);
        this.login = this.login.bind(this);
    }


    componentDidMount() {
        console.log('grewg', this.props.navigation.state)
        const { navigation } = this.props;
        if (this.props.navigation.isFirstRouteInParent()) {
            // A previous screen exists
        } else {
            this.setState({ images: false })

            // No previous screen
        }
    }

    onChangeText(text) {
        console.log('hello', text);
        this.setState({ name: text })
    }

    login() {
        this.setState({ loading: true })
        let data = {
            name: this.state.name,
            isoCountryCode: this.state.country
        }
        this.loginService.getDetails(data, (result: any) => {
            this.setState({ loading: false })
            console.log('fewfwe', result);
            if (result.status == 200) {
                let temp = {
                    customerId: result.customer.id,
                    isVerified: result.customer.isVerified,
                    name: this.state.name,
                    isoCountryCode: this.state.country
                };
                try {
                    AsyncStorage.setItem('customer', JSON.stringify(temp));
                    this.loginService.updateDeviceToken({}, () => { });
                    this.props.navigation.navigate('Dashboard');
                } catch (error) {
                    alert('Sorry some technical problem')
                }
            } else {
                alert(result.msg)
            }
        })
    }

    disableImage = () => {
        this.setState({ images: false })
    }

    render() {
        if (this.state.images) {
            return (
                <Slideshow disableImage={this.disableImage}></Slideshow>
            )
        } else {
            return (
                <View style={{ flex: 1 }}>
                    {this.state.loading ? (<PopupLoader></PopupLoader>) : (<React.Fragment></React.Fragment>)}
                    <View style={{ flex: 1, alignItems: 'center', marginTop: 45 }}>
                        <Image source={require(`../../../assets/icons/cartoon_reg.png`)}
                            style={{ width: 200, height: 200, justifyContent: 'center', alignItems: 'center' }}
                        />
                        <Text style={{ marginTop: 20, marginLeft: 14, fontSize: 15, color: '#C0C0C0' }}>Enter your name, to let the waiter know to whom to serve the dish</Text>
                        <View style={styles.input}>
                            <TextInput
                                style={{ marginLeft: 5, borderWidth: 0, color: 'orange' }}
                                underlineColorAndroid="transparent"
                                placeholder="  Choose your public name"
                                placeholderTextColor="orange"
                                autoCapitalize="none"
                                onChangeText={text => this.onChangeText(text)}
                            />
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ color: "#C0C0C0", fontSize: 12 }}>I accept the terms & conditions of mynu</Text>
                            <Text style={{ color: "#C0C0C0", fontSize: 12, marginLeft: 40 }}>I agree to the privacy policy</Text>
                        </View>
                        <TouchableOpacity
                            onPress={
                                () => this.login()
                            }
                            style={{
                                borderWidth: 1,
                                borderColor: 'rgba(0,0,0,0.2)',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 70,
                                height: 70,
                                backgroundColor: 'orange',
                                borderRadius: 50,
                                marginTop: 40
                            }}>
                            <Text style={{ color: 'white' }}>go</Text>
                        </TouchableOpacity>
                        <View style={styles.footer}>
                            {/* <Text>Hello</Text> */}
                            <Picker
                                mode='dropdown'
                                selectedValue={this.state.country}
                                style={{ height: 50, width: 150 }}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({ language: itemValue })
                                }>
                                <Picker.Item color="#C0C0C0" label="India" value="IN" />
                                {/* <Picker.Item color="#C0C0C0" label="JavaScript" value="js" /> */}
                            </Picker>
                        </View>
                    </View>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({

    imageView: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        // backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center',
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
        height: 40,
        // borderColor: 'orange',
        // borderWidth: 1,
        marginTop: 20,
        marginLeft: 5,
        width: '90%'
    },
    footer: {
        position: 'absolute',
        flex: 0.1,
        left: 0,
        right: 0,
        bottom: -10,
        // backgroundColor: 'orange',
        flexDirection: 'row',
        height: 80,
        // alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    }
});