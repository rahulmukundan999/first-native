import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, YellowBox, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import MaterialIcons
    from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'react-native-gesture-handler';

interface Props {
    navigation: any
}

class ItemDetails extends React.Component<any, any> {


    backHandler: any;

    constructor(props) {
        super(props);
        this.state = {
            items: []
        }
        this.removeItem = this.removeItem.bind(this)
        this.addItem = this.addItem.bind(this);
        this.getTotal = this.getTotal.bind(this);
        this.handleBackPress = this.handleBackPress.bind(this);

    }


    handleBackPress = () => {
        // this.props.navigation.goBack({
        //     item : 'hello'
        // }); // works best when the goBack is async
        // return true;

        let temp = {};
        for (let index in this.state.items) {
            for (let i = 0; i < this.state.items[index].length; i++) {
                temp[this.state.items[index][i].id] = {
                    course: index,
                    name: this.state.items[index][i].name,
                    price: this.state.items[index][i].price,
                    quantity: this.state.items[index][i].quantity
                }
            }
        }

        const { navigation } = this.props;
        navigation.goBack();
        // navigation.state.params.updateItem({ items: temp });
        return true;
    }

    getTotal() {
        let temp = 0;
        for (let index in this.state.items) {
            for (let i = 0; i < this.state.items[index].length; i++) {
                temp += this.state.items[index][i].quantity * this.state.items[index][i].price;
            }
        }

        // alert(temp);
        return temp.toFixed(2);
    }

    removeItem(course, item, index) {
        item.quantity--;
        let temp = this.state.items;
        if (item.quantity == 0) {
            temp[course].splice(index, 1);
        } else {
            temp[course][index] = item;
        }
        this.setState({ items: temp })
        const { navigation } = this.props;
        let temp1 = {};
        for (let index in temp) {
            for (let i = 0; i < temp[index].length; i++) {
                temp1[temp[index][i].id] = {
                    course: index,
                    name: temp[index][i].name,
                    price: temp[index][i].price,
                    quantity: temp[index][i].quantity
                }
            }
        }
        navigation.state.params.handleOnPressItem(item.id, temp1);

    }

    addItem(course, item, index) {
        item.quantity++;
        let temp = this.state.items;
        temp[course][index] = item;
        this.setState({ items: temp })
        const { navigation } = this.props;
        let temp1 = {};
        for (let index in temp) {
            for (let i = 0; i < temp[index].length; i++) {
                temp1[temp[index][i].id] = {
                    course: index,
                    name: temp[index][i].name,
                    price: temp[index][i].price,
                    quantity: temp[index][i].quantity
                }
            }
        }
        navigation.state.params.handleOnPressItem(item.id, temp1);
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        this.props.navigation.setParams({ handleBackPress: this.handleBackPress });

        // let temp = this.props.items;
        let temp = this.props.navigation.getParam('details');
        let items = [], course: any = {};
        for (let index in temp) {
            if (!course[temp[index].course]) {
                course[temp[index].course] = []
            }
            course[temp[index].course].push({
                name: temp[index].name,
                quantity: temp[index].quantity,
                price: temp[index].price,
                id: index
            })
        }
        this.setState({ items: course });
        console.log('123456', course);

    }

    componentWillUnmount() {
        this.backHandler.remove();
    }


    render() {
        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={{ marginBottom: 70 }}>
                    {Object.keys(this.state.items).map(course => (
                        <React.Fragment key={course}>

                            <View style={{ backgroundColor: '#F8F8F8', height: 42 }}>
                                <Text style={{ fontSize: 18, marginTop: 8, marginLeft: 6, color: '#606060' }}>{course}</Text>
                            </View>
                            {this.state.items[course].map((item, index) => (

                                <View style={{
                                    paddingVertical: 5,
                                    paddingHorizontal: 10,
                                    flexDirection: "row",
                                    alignItems: "center"
                                }}
                                    key={item.id}>
                                    <MaterialIcons name="remove-circle" size={30} style={{ color: 'lightgrey' }} onPress={() => this.removeItem(course, item, index)} />
                                    <Text style={{ marginLeft: 11 ,width : 22,alignContent:'center',justifyContent:'center'}}>{item.quantity}</Text>
                                    <MaterialIcons name="add-circle" size={30} style={{ marginLeft: 4, color: 'lightgrey' }} onPress={() => this.addItem(course, item, index)} />
                                    <Text style={{ marginLeft: 10 }}>{item.name}</Text>
                                    <Text style={{ position: 'absolute', right: 5, color: '#303030' }}>{item.price}</Text>
                                </View>
                            ))}
                        </React.Fragment>

                    ))}
                </ScrollView>


                <View style={styles.footer}>
                    <Text style={{ fontSize: 20, color: 'white', marginTop: 20 }}>ORDER NOW {this.getTotal()}</Text>
                </View>
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
    },
    orders: {
        // marginLeft: 5,
        // marginTop: 2
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
    const { items } = state
    return { items }
};

export default connect(mapStateToProps)(ItemDetails);