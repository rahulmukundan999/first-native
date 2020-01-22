import React, { Component } from 'react';
import { Dimensions, Text, View, Image } from 'react-native';
import MaterialIcons
    from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Math.round(Dimensions.get('window').width);


interface Props {
    navigation: any
}


export default class SelectableItem extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.handleOnPress = this.handleOnPress.bind(this);
        this.addItem = this.addItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
    }


    addItem() {
        const { onPressItem, id, items, item } = this.props;
        if (!items[id]) {
            items[id] = {
                quantity: 0,
                name: item.name,
                price: item.price
            }
        }
        items[id].quantity++;
        // console.log('fewfew', item);
        onPressItem(id, items);
    }

    removeItem() {
        const { onPressItem, id, items, item } = this.props;
        if (!items[id]) {
            items[id] = {
                quantity: 0,
                name: item.name,
                price: item.price
            }
        }
        items[id].quantity--;
        if (items[id].quantity == 0) {
            delete items[id];
        }
        // console.log('fewfew', item);
        onPressItem(id, items);
    }

    addRender() {
        const { item, id } = this.state.props;
        if (item[id]) {
            return (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <MaterialIcons name="remove-circle" size={25} onPress={() => this.removeItem()} style={{ marginBottom: 24, color: 'lightgrey' }} />

                    <MaterialIcons name="add-circle" size={25} onPress={() => this.addItem()} style={{ marginLeft: 6, marginRight: 6, marginBottom: 24, color: 'lightgrey' }} />
                    <Text>{this.state.items[item._id].quantity}</Text>
                </View>
            )
        } else {
            return (
                <MaterialIcons name="add-circle" size={25} onPress={() => this.addItem()} style={{ color: 'green', marginBottom: 24 }} />
            )
        }
    }

    shouldComponentUpdate(nextProps) {
        // console.log('fewf', nextProps, this.props);
        const { selected } = this.props;
        // console.log('greg', selected !== nextProps.selected)
        return selected !== nextProps.selected;
    }

    handleOnPress() {
        const { onPressItem, id, items, item } = this.props;
        if (!items[id]) {
            items[id] = {
                quantity: 0,
                name: item.name,
                price: item.price
            }
        }
        items[id].quantity++;
        // console.log('fewfew', item);
        onPressItem(id, items);
    }

    render() {
        const { id, items, item } = this.props;

        return (
            <View>
                <View style={{ marginLeft: 8 }}>
                    <Text style={{ fontSize: 16, fontWeight: '100' }}>{item.name}</Text>
                </View>
                <View style={{ marginLeft: 8 }}>
                    <Text style={{ fontSize: 14, color: 'lightgrey' }}>{item.description}</Text>
                </View>
                <View>
                    <Image
                        style={{ width: screenWidth, height: item && item.images[0] ? item.images[0].height : 300 }}
                        source={{ uri: item.images && item.images[0] ? item.images[0].url : 'https://youmnu-items.s3.amazonaws.com/youmnu/5cac46a1890e1b44b363a71e/main/561034614.png' }} />
                </View>
                <View style={{ width: '100%', height: 50, marginTop: 4 }}>
                    {items[id] ? (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'flex-end' }}>
                            <Text style={{ marginTop: 4 }}>{item.price}</Text>
                            <MaterialIcons name="remove-circle" size={30} onPress={() => this.removeItem()} style={{ marginLeft: 4, marginBottom: 24, color: 'lightgrey' }} />
                            <Text style={{ color: 'black', marginLeft: 6, marginTop: 4 }}>{items[id] ? items[id].quantity : 0}</Text>
                            <MaterialIcons name="add-circle" size={30} onPress={() => this.addItem()} style={{ marginLeft: 6, marginRight: 6, marginBottom: 24, color: 'lightgrey' }} />
                        </View>
                    ) : (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'flex-end' }}>
                                <Text style={{ marginTop: 4 }}>{item.price}</Text>
                                <MaterialIcons name="add-circle" size={30} onPress={() => this.addItem()} style={{ color: 'green', marginLeft: 4, marginBottom: 24 }} />
                            </View>
                        )}
                </View>
                <View
                    style={{
                        borderBottomColor: 'lightgrey',
                        borderBottomWidth: 2,
                        marginTop: 2,
                        marginBottom: 2
                    }}
                />
            </View>
        );
    }
}