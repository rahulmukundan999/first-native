import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, FlatList, Alert, Image, SectionList, Button } from 'react-native';
import { Header } from 'react-native-elements';
import MaterialIcons
    from 'react-native-vector-icons/MaterialIcons';
import { MenuService } from '../../services/menu';
import Loader from '../../shared/loader'
import PopupLoader from '../../shared/popup';
import MenuIcons from './MenuIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import SelectableItem from './Item';
import { bindActionCreators } from 'redux';
import { addItem } from '../../data/FriendAction';

const screenWidth = Math.round(Dimensions.get('window').width);


interface Props {
    navigation: any
}




class Menu extends React.Component<any, any> {

    menuService: MenuService = new MenuService();
    constructor(props) {
        super(props);
        this.state = {
            menu: [],
            loading: true,
            temp: [],
            selected: new Map(),
            items: {},
            data: {},
            details: {},
            pLoading: false
        }

        this.handleOnPressItem = this.handleOnPressItem.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.closeOrder = this.closeOrder.bind(this);
        this.totalItems = this.totalItems.bind(this);
        this.totalAmount = this.totalAmount.bind(this);
        this.updateItem = this.updateItem.bind(this);
    }

    updateItem(data) {
        // console.log('hello world', data);
        // let temp = new Map(this.state.selected);
        for (let index in data.items) {
            this.setState((state) => {
                const selected = new Map(state.selected);
                selected.set(index, !selected.get(index));
                return { selected };
            });
        }
        this.setState({ items: data.items });
    }

    totalItems() {
        let temp = 0;
        for (let index in this.state.items) {
            temp += this.state.items[index].quantity
        }

        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 18 }}>
                <Text style={{ color: 'black', fontSize: 18 }}>{temp}</Text>
            </View>
        )
    }

    totalAmount() {
        let temp: any = 0;
        for (let index in this.state.items) {
            temp += this.state.items[index].quantity * this.state.items[index].price
        }
        temp = temp.toFixed(2);

        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 18 }}>
                <Text style={{ color: 'white', fontSize: 18 }}>Next {temp}</Text>
            </View>
        )
    }


    componentDidMount() {
        let temp = this.props.friends.current[this.props.friends.current.length - 1];
        // console.log('temptemp', temp)
        // let temp = JSON.parse(this.props.navigation.getParam('details'));
        console.log('gregergregre', temp);
        let temp1 = {
            orderId: temp.orderId,
            uuid: temp.uuid,
            orderType: temp.orderType,
            restaurantId: temp.restaurantId,
        }
        this.menuService.fetchMenu(temp1, (result: any) => {
            // console.log('gewgew', result)
            if (result.status == 200) {
                this.setState({ menu: result.categories, loading: false, details: temp });
            }
        })
    }

    handleOnPressItem(id, items) {
        console.log('fewfew', id);
        this.setState((state) => {
            const selected = new Map(state.selected);
            selected.set(id, !selected.get(id));
            return { selected };
        });
        this.setState({ items: items })
    }

    renderItem({ item }) {
        // console.log('cacaitem', item);
        const { selected } = this.state;
        // console.log('fewfe', selected)
        return (
            <View>
                <View style={{ backgroundColor: '#059905', width: '100%', height: 55, marginBottom: 5 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'flex-end' }}>
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 8 }}>{item.name}   </Text>
                        <Image resizeMode="contain" style={{ width: 25, height: 40, marginLeft: 10, marginRight: 5 }} source={{ uri: item.icon }} />
                    </View>
                </View>
                {item.groups && item.groups.length > 0 ? item.groups.map(group => (
                    <View key={group._id}>
                        <View style={styles.group}>
                            <Text style={{ color: 'white', fontSize: 18, marginTop: 2, fontWeight: '600', marginLeft: 10 }}>{group.name}</Text>
                        </View>
                        {group.items && group.items.length > 0 ? group.items.map(it => (
                            <SelectableItem
                                id={it._id}
                                onPressItem={this.handleOnPressItem}
                                selected={!selected.get(it._id)}
                                title={it.name}
                                items={this.state.items}
                                item={it}
                                key={it._id}
                            />
                        )) : (<View></View>)}
                    </View>
                )) : (<View></View>)}

            </View>

        );
    }
    renderHeader() {
        const { data } = this.state;
        return (
            <View>
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
                <View>
                    <MenuIcons details={this.state.details} />
                </View>
            </View>
        )
    }

    closeOrder() {
        Alert.alert(
            'Confirmation',
            'Are you sure you want to cancel the order',
            [
                {
                    text: 'Yes',
                    onPress: () => {
                        this.setState({ pLoading: true })
                        let temp = {
                            orderId: this.state.details.orderId,
                            uuid: this.state.details.uuid,
                            orderType: this.state.details.orderType,
                            restaurantId: this.state.details.restaurantId,
                        }
                        this.menuService.cancelOrder(temp, (result) => {
                            this.setState({ pLoading: false })
                            if (result.status == 200) {
                                this.props.navigation.navigate('Orders');
                            } else {
                                alert(result.msg)
                            }
                        })
                    },
                },
                {
                    text: 'No', onPress: () => console.log('OK Pressed'),
                    style: 'cancel',
                },
            ],
            { cancelable: false },
        );
        // this.props.navigation.navigate('Orders');
    }
    render() {
        if (this.state.loading) {
            return (<View>
                <Loader />
            </View>)
        } else {
            return (
                <View style={styles.container}>
                    <Header
                        placement="left"
                        leftComponent={{ text: 'Please choose from menu', style: { color: 'black', fontSize: 20 } }}
                        rightComponent={{ icon: 'close', color: 'orange', onPress: () => { this.closeOrder() } }}
                        containerStyle={{
                            backgroundColor: 'white',
                            height: 80,
                            borderBottomColor: 'black'
                        }}
                    />
                    {this.state.pLoading ? (
                        <PopupLoader />
                    ) : (<View></View>)}
                    <View style={{ flex: 1 }}>
                        <FlatList
                            ListHeaderComponent={this.renderHeader}
                            data={this.state.menu}
                            extraData={this.state.selected}
                            keyExtractor={item => item._id}
                            renderItem={this.renderItem}
                            removeClippedSubviews={true} // Unmount components when outside of window 
                            initialNumToRender={2} // Reduce initial render amount
                            maxToRenderPerBatch={2} // Reduce number in each render batch
                            windowSize={7} // Reduce the window size
                        // updateCellsBatchingPeriod={25}
                        />
                        {Object.keys(this.state.items).length > 0 ? (
                            <View style={styles.footer}>
                                <View style={{ width: '40%', height: 70, backgroundColor: 'white' }}>
                                    {this.totalItems()}
                                </View>
                                <View style={{ width: '60%', height: 70, backgroundColor: 'orange' }}>
                                    <TouchableOpacity onPress={() => {
                                        console.log('gewrger', this.state.items);
                                        this.props.addItem(this.state.items);
                                        this.props.navigation.push('ItemDetails', {
                                            details: this.state.items,
                                            updateItem: this.updateItem,
                                            handleOnPressItem: this.handleOnPressItem
                                        })

                                    }}
                                        style={{ width: '100%' }}>
                                        {this.totalAmount()}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (<View></View>)}
                    </View>


                </View>
            );
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
        height: 70,
        flexDirection: 'row'
    }
});




const mapStateToProps = (state) => {
    const { friends } = state
    return { friends }
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        addItem,
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Menu);