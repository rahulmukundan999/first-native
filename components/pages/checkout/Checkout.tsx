import React, { Component } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { connect } from 'react-redux';
import { TouchableOpacity } from "react-native-gesture-handler";
import { CheckoutService } from '../../services/checkout'
class Checkout extends Component<any, any> {

    checkoutService: CheckoutService = new CheckoutService();

    constructor(props) {
        super(props)
        this.state = {
            details: {
                paymentOptions: []
            },
            payments: {
                'cash': 'Pay to a waiter who will be called to your table',
                'StripeTest': 'Payment through Credit Card(demo)',
                'sofortTest': 'Payment through Banking',
                'none': ''
            },
            selected: 'none',
            loading: false
        }
    }

    componentDidMount() {
        let details = this.props.navigation.getParam('details');
        console.log('gerger', details);
        this.setState({ details: details });
    }

    renderImage = (id) => {
        if (id == 'cash') {
            return (
                <Image resizeMode="contain" style={{ height: 75, width: 75 }} source={require(`../../../assets/icons/cashon.png`)} />
            )
        } else if (id == 'StripeTest') {
            return (
                <Image resizeMode="contain" style={{ height: 75, width: 75 }} source={require(`../../../assets/icons/cardon.png`)} />
            )
        } else if (id == 'sofortTest') {
            return (
                <Image resizeMode="contain" style={{ height: 75, width: 75 }} source={require(`../../../assets/icons/bankon.png`)} />
            )
        }
    }

    selectPayment = (data) => {
        this.setState({ selected: data.id });
    }

    pay = () => {
        this.setState({ loading: true })
        let temp = this.props.order;
        let orderDetails = {
            orderId: temp.orderId,
            uuid: temp.uuid,
            orderType: temp.orderType,
            paymentMethod: this.state.selected,
            customers: []
        }
        this.checkoutService.checkOut(orderDetails, result => {
            this.setState({ loading: false })
            console.log('restgre', result);
        })
    }

    render() {
        // let paymentMethods = this.state.details.paymentOptions ? this.state.details.paymentOptions : [];
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}>
                    {this.state.details.paymentOptions.map(element => (
                        <TouchableOpacity onPress={() => this.selectPayment(element)} key={element.id} style={{ marginRight: 15 }}>
                            <View style={{ opacity: this.state.selected == element.id ? 1 : 0.4 }}>
                                {this.renderImage(element.id)}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={{
                    marginTop: 20,
                    marginLeft: 18
                }}>
                    <Text style={{ fontSize: 20, color: '#606060' }}>
                        {this.state.payments[this.state.selected]}
                    </Text>
                </View>
                {this.state.selected != 'none' ? (
                    <View style={styles.footer}>
                        <TouchableOpacity style={{ width: '100%', height: '100%', alignItems: 'center' }} onPress={() => this.pay()}>
                            <Text style={{ fontSize: 20, color: 'white', marginTop: 20, justifyContent: 'center' }}>Pay {this.state.details.totalAmount}</Text>
                        </TouchableOpacity>
                    </View>
                ) : (<React.Fragment></React.Fragment>)}
            </View>
        )
    }
}

const styles = StyleSheet.create({
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
    return { order }
};



export default connect(mapStateToProps, null)(Checkout);