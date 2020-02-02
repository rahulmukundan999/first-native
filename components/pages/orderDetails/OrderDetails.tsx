import { Component } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, BackHandler, Image } from 'react-native';
import React from "react";
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import MenuIcons from '../menu/MenuIcons';
import { OrderService } from '../../services/order';
import PopupLoader from '../../shared/popup';

class OrderDetails extends Component<any, any> {

    backHandler: any;
    orderService: OrderService = new OrderService();
    constructor(props) {
        super(props)
        this.state = {
            details: {},
            loading: false,
            mainLoader: true
        }
    };


    checkout = () => {
        this.setState({ loading: true });
        let temp = {
            orderId: this.props.order.orderId,
            uuid: this.props.order.uuid,
            orderType: this.props.order.orderType
        }
        this.orderService.checkOut(temp, result => {
            console.log('result', result);
            this.setState({ loading: false })
            if (result.status == 200) {
                // this.setState({details : result});
                this.props.navigation.navigate('Checkout', {
                    details: result
                });
            } else {
                alert(result.msg);
            }
        })
    }


    handleBackPress = () => {
        // navigation.state.params.updateItem({ items: temp });
        this.props.navigation.navigate('Orders');
        // this.props.navigation.goBack();
        return true;
    }


    componentDidMount() {
        console.log('feww', this.props.order);
        let temp = {
            ...this.props.order,
            totalAmount: this.props.order.totalAmount ? parseFloat(this.props.order.totalAmount).toFixed(2) : 0
        }
        this.setState({ details: temp });
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        let request = {
            orderId: this.props.order.orderId,
            "orderType": this.props.order.orderType,
        };
        this.orderService.checkOrder(request, result => {
            if (result.status == 200) {
                if (result.orderStatus == 'unpaid') {
                    this.props.navigation.navigate('Order');
                } else if (result.orderStatus == 'accepted') {
                    result.totalAmount = result.totalAmount ? parseFloat(result.totalAmount).toFixed(2) : 0;
                    temp = {
                        // ...this.props.order,
                        ...temp,
                        orderStatus: result.orderStatus,
                        totalAmount: result.totalAmount
                        // ...result
                    }
                    console.log('tewytwe', temp);
                    this.setState({ details: temp, mainLoader: false });
                }
            } else {
                alert(result.msg);
            }
        })
    }


    render() {
        if (this.state.mainLoader) {
            return (
                <PopupLoader></PopupLoader>
            )
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, marginLeft: 10, marginTop: 5, color: 'rgb(114, 108, 108);' }}>{this.state.details.streetName}, {this.state.details.city}, {this.state.details.country}, {this.state.details.zipCode}</Text>
                    <View style={styles.main}>
                        <Image
                            style={{ width: 90, height: 70, borderRadius: 10, borderWidth: 1, borderColor: 'black' }}
                            source={{ uri: this.state.details.logo ? this.state.details.logo : 'https://youmnu-items.s3.amazonaws.com/youmnu/5cac46a1890e1b44b363a71e/main/561034614.png' }}
                        />
                        <View style={[{ flexDirection: 'column' }, styles.space]}>
                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'orange' }}>{this.state.details.name}</Text>
                            <Text style={{ fontSize: 14, color: 'grey' }}>{this.state.details.tableName}, OID : {this.state.details.orderId}</Text>

                        </View>
                    </View>
                    {this.state.loading ? (
                        <PopupLoader />
                    ) : (<View></View>)}
                    <View>
                        <MenuIcons details={this.state.details} />
                    </View>
                    <View style={{ marginTop: 10, height: 40, width: '100%', backgroundColor: '#F8F8F8' }}>
                        <Text style={{ color: '#606060', marginTop: 5, fontSize: 18, marginLeft: 6 }}>Your Order Status</Text>
                    </View>
                    <View style={{ marginTop: 32 }}>
                        <View style={{ alignItems: 'center', flexDirection: 'row', marginLeft: 10, marginTop: 10, marginBottom: 10 }}>
                            <Image resizeMode="contain" style={{ height: 60, width: 60 }} source={require('../../../assets/icons/ordersent.png')} />
                            <Text style={{ fontSize: 22, marginLeft: 32, color: 'yellowgreen' }}>Order Sent</Text>
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <TouchableOpacity style={{ width: '100%', height: '100%', alignItems: 'center' }} onPress={() => this.checkout()}>
                            <Text style={{ fontSize: 20, color: 'white', marginTop: 20, justifyContent: 'center' }}>Go To Payment {this.state.details.totalAmount}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    category: {
        width: '100%',
        height: 50,
        backgroundColor: 'green',
        marginBottom: 2,
        // flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
        // flex: 1, flexDirection: 'row'
        flexDirection: 'row', justifyContent: 'flex-end'
    },
    group: {
        width: '100%',
        height: 40,
        backgroundColor: 'orange',
        marginBottom: 4
    },
    main: {
        marginLeft: 15,
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row'
    },
    space: {
        marginLeft: 20
    },
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





const mapStateToProps = (state) => {
    const { order } = state
    return { order };
};



export default connect(mapStateToProps, null)(OrderDetails);