import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, YellowBox } from 'react-native';
import { OrderService } from '../../services/order';
import Constants from 'expo-constants';
import { AsyncStorage, Image, Platform } from 'react-native';
import { Header } from 'react-native-elements';
import * as moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';
import Loader from '../../shared/loader'
import { bindActionCreators } from 'redux';
import { orderDetails, showOrder } from '../../data/FriendAction';
import { connect } from 'react-redux';

interface Props {
    navigation: any
}

class Order extends React.Component<any, any> {

    orderService: OrderService = new OrderService();
    constructor(props) {
        super(props);
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
                },
                'accepted': {
                    color: 'orange',
                    name: 'Preparing Meal'
                },
                'unpaid': {
                    color: 'orange',
                    name: 'Waiter called for payment'
                },
                "served": {
                    color: 'yellowgreen',
                    name: 'Paid'
                }
            }
        }
        this.fetchOrders = this.fetchOrders.bind(this);
        this.fetchOrderHistory = this.fetchOrderHistory.bind(this);
    }

    async fetchOrders() {
        return new Promise((resolve) => {
            this.orderService.fetchOrders({}, (result) => {
                console.log('result orders', result);

                if (result.status == 200) {

                    for (let i = 0; i < result.orders.length; i++) {
                        result.orders[i].date = moment.unix(result.orders[i].date).format('MM-DD-YYYY');
                    }
                    this.setState({ openOrders: result.orders });
                }
                resolve();
            })
        })

    }
    async fetchOrderHistory() {
        return new Promise((resolve) => {
            this.orderService.fetchOrderHistory({}, (result) => {
                console.log('result orders history', result);
                if (result.status == 200) {
                    for (let i = 0; i < result.orders.length; i++) {
                        result.orders[i].date = moment.unix(result.orders[i].date).format('MM-DD-YYYY');
                    }
                    this.setState({
                        orderHistory: result.orders
                    });
                }
                resolve();
            })
        })
    }

    async componentDidMount() {

        await this.fetchOrders();
        await this.fetchOrderHistory();
        this.setState({ loading: false })
    }

    async checkOrder(order) {
        let temp: any = {
            name: 'gghh',
            ...order
        }
        this.props.orderDetails(temp);
        if (order.orderStatus == "scanned") {
            this.props.navigation.navigate('Menu');
        } else if (order.orderStatus == 'accepted') {
            this.props.navigation.navigate('OrderDetails');
        }
    }



    render() {
        return (
            <View style={{ flex: 1 }}>
                {(!this.state.loading && this.state.openOrders.length == 0 && this.state.orderHistory.length == 0) ? (
                    <View style={styles.container}>
                        <Text style={{ color: '#606060', fontSize: 20 }}>No orders</Text>
                    </View>
                ) : null}
                {this.state.loading ? (
                    <View style={styles.load}>
                        <Loader />
                    </View>
                ) : (
                        <ScrollView>
                            {this.state.openOrders.length > 0 ? (
                                <View>
                                    <Header
                                        placement="left"
                                        leftComponent={{ text: 'Open orders', style: { color: 'black', fontSize: 20 } }}
                                        containerStyle={{
                                            backgroundColor: 'white',
                                            height: 80,
                                            borderBottomColor: 'black',
                                            marginBottom: 10
                                        }}
                                    />
                                    {this.state.openOrders.map(order => (
                                        <TouchableOpacity onPress={() => this.checkOrder(order)} key={order.orderId}>
                                            <View>
                                                <View style={styles.order} key={order.orderId}>
                                                    <View style={styles.logo}>
                                                        <Image
                                                            style={{ width: '95%', height: '100%', resizeMode: 'center', flex: 1 }}
                                                            source={{ uri: order.logo }} />
                                                    </View>
                                                    <View style={styles.orderDetails}>
                                                        <Text style={{ fontSize: 15, color: 'black', fontWeight: '400' }}>{order.city}</Text>
                                                        <Text style={{ fontSize: 12, color: 'grey', fontWeight: '200' }}>{order.streetName} {order.city} {order.country}</Text>
                                                        <Text><Text style={{ fontSize: 14, fontWeight: '300' }}>{order.billedAmount ? order.billedAmount.toFixed(2) : 0}$  </Text>
                                                            <Text style={{ fontSize: 12, fontWeight: '200', color: 'grey' }}> , {order.date} , ID:{order.orderId}</Text></Text>
                                                        <Text style={{ color: this.state.orderType[order.orderStatus].color, fontSize: 12, marginTop: 10 }}>{this.state.orderType[order.orderStatus].name}</Text>
                                                    </View>
                                                </View>
                                                <View
                                                    style={{
                                                        borderBottomColor: '#F0F0F0',
                                                        borderBottomWidth: 1,
                                                        marginTop: 10,
                                                        marginBottom: 10,
                                                        width: '100%'
                                                    }}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            ) : null}
                            {this.state.orderHistory.length > 0 ? (
                                <View>
                                    <Header
                                        placement="left"
                                        leftComponent={{ text: 'Order History', style: { color: 'black', fontSize: 20 } }}
                                        containerStyle={{
                                            backgroundColor: 'white',
                                            height: 80,
                                            borderBottomColor: 'black',
                                            marginBottom: 10
                                        }}
                                    />
                                    {this.state.orderHistory.map(order => (
                                        <View key={order.orderId}>
                                            <View style={styles.order}>
                                                <View style={styles.logo}>
                                                    <Image
                                                        style={{ width: '95%', height: '100%', resizeMode: 'center', flex: 1 }}
                                                        source={{ uri: order.logo }} />
                                                </View>
                                                <View style={styles.orderDetails}>
                                                    <Text style={{ fontSize: 15, color: 'black', fontWeight: '400' }}>{order.city}</Text>
                                                    <Text style={{ fontSize: 12, color: 'grey', fontWeight: '200' }}>{order.streetName} {order.city} {order.country}</Text>
                                                    <Text><Text style={{ fontSize: 14, fontWeight: '300' }}>{order.billedAmount}$  </Text>
                                                        <Text style={{ fontSize: 12, fontWeight: '200', color: 'grey' }}> , {order.date} , ID:{order.orderId}</Text></Text>
                                                    <Text style={{ color: this.state.orderType[order.orderStatus].color, fontSize: 12, marginTop: 10 }}>{this.state.orderType[order.orderStatus].name}</Text>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    borderBottomColor: '#F0F0F0',
                                                    borderBottomWidth: 1,
                                                    marginTop: 10,
                                                    marginBottom: 10,
                                                    width: '100%'
                                                }}
                                            />
                                        </View>
                                    ))}
                                </View>
                            ) : null}
                        </ScrollView>
                    )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#fff',
        // marginBottom: 75
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '45%'
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


const mapDispatchToProps = dispatch => (
    bindActionCreators({
        orderDetails,
        showOrder
    }, dispatch)
);


export default connect(null, mapDispatchToProps)(Order);