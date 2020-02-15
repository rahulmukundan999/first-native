import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { OrderService } from '../../services/order';
import Constants from 'expo-constants';
import { Image, Platform } from 'react-native';
import { Header } from 'react-native-elements';
import * as moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';
import Loader from '../../shared/loader';
export default class Order extends React.Component {
    constructor(props) {
        super(props);
        this.orderService = new OrderService();
        this.state = {
            loading: true,
            orderHistory: [],
            openOrders: [],
            orderType: {
                'scanned': {
                    color: 'orange',
                    name: 'Checked in'
                },
                "cancelled": {
                    color: 'black',
                    name: 'Cancelled'
                },
                "paid": {
                    color: 'orange',
                    name: 'Order sent'
                }
            }
        };
    }
    async componentDidMount() {
        // try {
        // let details = JSON.parse(await AsyncStorage.getItem('customer'));
        let data = {
        // versionNumber: Constants.systemVersion,
        // appBuildNumber: Constants.expoVersion,
        // deviceType: 'android',
        // language: "en",
        // manufacturer: Constants.deviceName,
        // deviceModel: Constants.deviceName,
        // osVersion: '28',
        // deviceId: Constants.deviceId,
        // "isDevComponent": true,
        // "isoCountryCode": "IN",
        // "customerId": details.customerId,
        };
        this.orderService.fetchOrders(data, (result) => {
            console.log('result orders', result);
            if (result.status == 200) {
                for (let i = 0; i < result.orders.length; i++) {
                    result.orders[i].date = moment.unix(result.orders[i].date).format('MM-DD-YYYY');
                }
                this.setState({ openOrders: result.orders });
            }
        });
        this.orderService.fetchOrderHistory(data, (result) => {
            console.log('result orders history', result);
            if (result.status == 200) {
                for (let i = 0; i < result.orders.length; i++) {
                    result.orders[i].date = moment.unix(result.orders[i].date).format('MM-DD-YYYY');
                }
                this.setState({
                    orderHistory: result.orders,
                    loading: false
                });
            }
        });
        // } catch (error) {
        //     alert(error);
        // }
    }
    async checkOrder(order) {
        let temp = {
            name: 'gghh',
            ...order
        };
        if (order.orderStatus == "scanned") {
            this.props.navigation.navigate('Menu', {
                details: JSON.stringify(temp)
            });
        }
    }
    render() {
        return (React.createElement(View, { style: styles.container }, this.state.loading ? (React.createElement(View, { style: styles.load },
            React.createElement(Loader, null))) : (React.createElement(ScrollView, null,
            this.state.openOrders.length > 0 ? (React.createElement(View, null,
                React.createElement(Header, { placement: "left", leftComponent: { text: 'Open orders', style: { color: 'black', fontSize: 20 } }, containerStyle: {
                        backgroundColor: 'white',
                        height: 80,
                        borderBottomColor: 'black',
                        marginBottom: 10
                    } }),
                this.state.openOrders.map(order => (React.createElement(TouchableOpacity, { onPress: () => this.checkOrder(order) },
                    React.createElement(View, null,
                        React.createElement(View, { style: styles.order, key: order.orderId },
                            React.createElement(View, { style: styles.logo },
                                React.createElement(Image, { style: { width: '95%', height: '100%', resizeMode: 'center', flex: 1 }, source: { uri: order.logo } })),
                            React.createElement(View, { style: styles.orderDetails },
                                React.createElement(Text, { style: { fontSize: 15, color: 'black', fontWeight: '400' } }, order.city),
                                React.createElement(Text, { style: { fontSize: 12, color: 'grey', fontWeight: '200' } },
                                    order.streetName,
                                    " ",
                                    order.city,
                                    " ",
                                    order.country),
                                React.createElement(Text, null,
                                    React.createElement(Text, { style: { fontSize: 14, fontWeight: '300' } },
                                        order.billedAmount,
                                        "$  "),
                                    React.createElement(Text, { style: { fontSize: 12, fontWeight: '200', color: 'grey' } },
                                        " , ",
                                        order.date,
                                        " , ID:",
                                        order.orderId)),
                                React.createElement(Text, { style: { color: this.state.orderType[order.orderStatus].color, fontSize: 12, marginTop: 10 } }, this.state.orderType[order.orderStatus].name))),
                        React.createElement(View, { style: {
                                borderBottomColor: '#F0F0F0',
                                borderBottomWidth: 1,
                                marginTop: 10,
                                marginBottom: 10,
                                width: '100%'
                            } }))))))) : (React.createElement(View, null)),
            this.state.orderHistory.length > 0 ? (React.createElement(View, null,
                React.createElement(Header, { placement: "left", leftComponent: { text: 'Order History', style: { color: 'black', fontSize: 20 } }, containerStyle: {
                        backgroundColor: 'white',
                        height: 80,
                        borderBottomColor: 'black',
                        marginBottom: 10
                    } }),
                this.state.orderHistory.map(order => (React.createElement(View, null,
                    React.createElement(View, { style: styles.order, key: order.orderId },
                        React.createElement(View, { style: styles.logo },
                            React.createElement(Image, { style: { width: '95%', height: '100%', resizeMode: 'center', flex: 1 }, source: { uri: order.logo } })),
                        React.createElement(View, { style: styles.orderDetails },
                            React.createElement(Text, { style: { fontSize: 15, color: 'black', fontWeight: '400' } }, order.city),
                            React.createElement(Text, { style: { fontSize: 12, color: 'grey', fontWeight: '200' } },
                                order.streetName,
                                " ",
                                order.city,
                                " ",
                                order.country),
                            React.createElement(Text, null,
                                React.createElement(Text, { style: { fontSize: 14, fontWeight: '300' } },
                                    order.billedAmount,
                                    "$  "),
                                React.createElement(Text, { style: { fontSize: 12, fontWeight: '200', color: 'grey' } },
                                    " , ",
                                    order.date,
                                    " , ID:",
                                    order.orderId)),
                            React.createElement(Text, { style: { color: this.state.orderType[order.orderStatus].color, fontSize: 12, marginTop: 10 } }, this.state.orderType[order.orderStatus].name))),
                    React.createElement(View, { style: {
                            borderBottomColor: '#F0F0F0',
                            borderBottomWidth: 1,
                            marginTop: 10,
                            marginBottom: 10,
                            width: '100%'
                        } })))))) : (React.createElement(View, null))))));
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
        // marginBottom: 75
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    load: {
        marginTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight
    },
    logo: {
        // padding: 20,
        width: 100,
        height: 65,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'lightgrey'
    },
    order: {
        marginLeft: 16,
        marginTop: 5,
        flexDirection: 'row', textAlign: 'left'
    },
    orderDetails: {
        marginLeft: 10
    }
});
//# sourceMappingURL=Order.js.map