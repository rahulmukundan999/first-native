import React from 'react';
import { StyleSheet, Dimensions, Text, View, FlatList, Image } from 'react-native';
import { Header } from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/FontAwesome';
import { MenuService } from '../../services/menu';
import Loader from '../../shared/loader';
const screenWidth = Math.round(Dimensions.get('window').width);
class SelectableItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleOnPress = this.handleOnPress.bind(this);
        this.addItem = this.addItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
    }
    addItem() {
        const { onPressItem, id, items, item } = this.props;
        if (!items[id]) {
            items[id] = 0;
        }
        items[id]++;
        // console.log('fewfew', item);
        onPressItem(id, items);
    }
    removeItem() {
        const { onPressItem, id, items, item } = this.props;
        if (!items[id]) {
            items[id] = 0;
        }
        items[id]--;
        if (items[id] == 0) {
            delete items[id];
        }
        // console.log('fewfew', item);
        onPressItem(id, items);
    }
    addRender() {
        const { item, id } = this.state.props;
        if (item[id]) {
            return (React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'space-between' } },
                React.createElement(MaterialIcons, { name: "remove-circle", size: 25, onPress: () => this.removeItem(), style: { marginBottom: 24, color: 'lightgrey' } }),
                React.createElement(MaterialIcons, { name: "add-circle", size: 25, onPress: () => this.addItem(), style: { marginLeft: 6, marginRight: 6, marginBottom: 24, color: 'lightgrey' } }),
                React.createElement(Text, null, this.state.items[item._id].quantity)));
        }
        else {
            return (React.createElement(MaterialIcons, { name: "add-circle", size: 25, onPress: () => this.addItem(), style: { color: 'green', marginBottom: 24 } }));
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
            items[id] = 0;
        }
        items[id]++;
        // console.log('fewfew', item);
        onPressItem(id, items);
    }
    render() {
        const { id, items, item } = this.props;
        return (React.createElement(View, null,
            React.createElement(View, { style: { marginLeft: 8 } },
                React.createElement(Text, { style: { fontSize: 16, fontWeight: '100' } }, item.name)),
            React.createElement(View, { style: { marginLeft: 8 } },
                React.createElement(Text, { style: { fontSize: 14, color: 'lightgrey' } }, item.description)),
            React.createElement(View, null,
                React.createElement(Image, { style: { width: screenWidth, height: item && item.images[0] ? item.images[0].height : 300 }, source: { uri: item.images && item.images[0] ? item.images[0].url : 'https://youmnu-items.s3.amazonaws.com/youmnu/5cac46a1890e1b44b363a71e/main/561034614.png' } })),
            React.createElement(View, { style: { width: '100%', height: 50, marginTop: 4 } }, items[id] ? (React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'flex-end' } },
                React.createElement(Text, { style: { marginTop: 4 } }, item.price),
                React.createElement(MaterialIcons, { name: "remove-circle", size: 30, onPress: () => this.removeItem(), style: { marginLeft: 4, marginBottom: 24, color: 'lightgrey' } }),
                React.createElement(Text, { style: { color: 'black', marginLeft: 6, marginTop: 4 } }, items[id] ? items[id] : 0),
                React.createElement(MaterialIcons, { name: "add-circle", size: 30, onPress: () => this.addItem(), style: { marginLeft: 6, marginRight: 6, marginBottom: 24, color: 'lightgrey' } }))) : (React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'flex-end' } },
                React.createElement(Text, { style: { marginTop: 4 } }, item.price),
                React.createElement(MaterialIcons, { name: "add-circle", size: 30, onPress: () => this.addItem(), style: { color: 'green', marginLeft: 4, marginBottom: 24 } })))),
            React.createElement(View, { style: {
                    borderBottomColor: 'lightgrey',
                    borderBottomWidth: 2,
                    marginTop: 2,
                    marginBottom: 2
                } })));
    }
}
export default class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.menuService = new MenuService();
        this.state = {
            menu: [],
            loading: true,
            temp: [],
            selected: new Map(),
            items: {},
            data: {},
            details: {}
        };
        this.handleOnPressItem = this.handleOnPressItem.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.closeOrder = this.closeOrder.bind(this);
    }
    componentDidMount() {
        let temp = JSON.parse(this.props.navigation.getParam('details'));
        let temp1 = {
            orderId: temp.orderId,
            uuid: temp.uuid,
            orderType: temp.orderType,
            restaurantId: temp.restaurantId,
        };
        this.menuService.fetchMenu(temp1, (result) => {
            // console.log('gewgew', result)
            if (result.status == 200) {
                this.setState({ menu: result.categories, loading: false, details: temp });
            }
        });
    }
    handleOnPressItem(id, items) {
        console.log('fewfew', id);
        this.setState((state) => {
            const selected = new Map(state.selected);
            selected.set(id, !selected.get(id));
            return { selected };
        });
        this.setState({ items: items });
    }
    renderItem({ item }) {
        // console.log('cacaitem', item);
        const { selected } = this.state;
        // console.log('fewfe', selected)
        return (React.createElement(View, null,
            React.createElement(View, { style: { backgroundColor: '#059905', width: '100%', height: 55, marginBottom: 5 } },
                React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'flex-end' } },
                    React.createElement(Text, { style: { color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 8 } },
                        item.name,
                        "   "),
                    React.createElement(Image, { style: { width: 25, height: 40, marginLeft: 10, marginRight: 5 }, source: { uri: item.icon } }))),
            item.groups && item.groups.length > 0 ? item.groups.map(group => (React.createElement(View, null,
                React.createElement(View, { style: styles.group },
                    React.createElement(Text, { style: { color: 'white', fontSize: 18, marginTop: 2, fontWeight: '600', marginLeft: 10 } }, group.name)),
                group.items && group.items.length > 0 ? group.items.map(it => (React.createElement(SelectableItem, { id: it._id, onPressItem: this.handleOnPressItem, selected: !selected.get(it._id), title: it.name, items: this.state.items, item: it }))) : (React.createElement(View, null))))) : (React.createElement(View, null))));
    }
    renderHeader() {
        const { data } = this.state;
        return (React.createElement(View, null,
            React.createElement(Text, { style: { fontSize: 12, marginLeft: 10, marginTop: 5, color: 'rgb(114, 108, 108);' } },
                this.state.details.streetName,
                ", ",
                this.state.details.city,
                ", ",
                this.state.details.country,
                ", ",
                this.state.details.zipCode),
            React.createElement(View, { style: styles.main },
                React.createElement(Image, { style: { width: 90, height: 70, borderRadius: 10, borderWidth: 1, borderColor: 'black' }, source: { uri: 'https://youmnu-items.s3.amazonaws.com/youmnu/5cac46a1890e1b44b363a71e/main/561034614.png' } }),
                React.createElement(View, { style: [{ flexDirection: 'column' }, styles.space] },
                    React.createElement(Text, { style: { fontSize: 14, fontWeight: 'bold', color: 'orange' } }, this.state.details.name),
                    React.createElement(Text, { style: { fontSize: 14, color: 'grey' } },
                        this.state.details.tableName,
                        ", OID : ",
                        this.state.details.orderId)))));
    }
    closeOrder() {
        this.props.navigation.navigate('Orders');
    }
    render() {
        if (this.state.loading) {
            return (React.createElement(View, null,
                React.createElement(Loader, null)));
        }
        else {
            return (React.createElement(View, { style: styles.container },
                React.createElement(Header, { placement: "left", leftComponent: { text: 'Please choose from menu', style: { color: 'black', fontSize: 20 } }, rightComponent: { icon: 'close', color: 'orange', onPress: () => { this.closeOrder(); } }, containerStyle: {
                        backgroundColor: 'white',
                        height: 80,
                        borderBottomColor: 'black'
                    } }),
                React.createElement(View, { style: { flex: 1 } },
                    React.createElement(FlatList, { ListHeaderComponent: this.renderHeader, data: this.state.menu, extraData: this.state.selected, keyExtractor: item => item._id, renderItem: this.renderItem, removeClippedSubviews: true, initialNumToRender: 2, maxToRenderPerBatch: 1, windowSize: 7 }),
                    Object.keys(this.state.items).length > 0 ? (React.createElement(View, { style: styles.footer },
                        React.createElement(View, { style: { width: '40%', height: 70, backgroundColor: 'white' } }),
                        React.createElement(View, { style: { width: '60%', height: 70, backgroundColor: 'orange' } }))) : (React.createElement(View, null)))));
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
//# sourceMappingURL=Menu.js.map