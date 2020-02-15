import React, { Component } from 'react';
import {
    Animated,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    View,
    RefreshControl,
} from 'react-native';
// import React, { Component } from 'react';
import { Dimensions, FlatList, Alert, Image, SectionList, Button } from 'react-native';
import { Header } from 'react-native-elements';
import MaterialIcons
    from 'react-native-vector-icons/MaterialIcons';
import { MenuService } from '../../services/menu';
import Loader from '../../shared/loader'
import PopupLoader from '../../shared/popup';
import MenuIcons from './MenuIcons';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import SelectableItem from './Item';
import { bindActionCreators } from 'redux';
import { orderDetails } from '../../data/FriendAction';
import { showOrder } from '../../data/FriendAction';
import Constants from 'expo-constants';
const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 60 : 73;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

class Menu extends Component<any, any> {

    menuService: MenuService = new MenuService();

    constructor(props) {
        super(props);

        this.state = {
            scrollY: new Animated.Value(
                // iOS has negative initial scroll value because content inset...
                Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
            ),
            refreshing: false,
            menu: [],
            loading: true,
            temp: [],
            selected: new Map(),
            items: {},
            data: {},
            details: {},
            pLoading: false,
            orderDetails: {},
            // scrollY: new Animated.Value(0),

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
        let temp = this.props.order;
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
                this.setState({ menu: result.categories, details: temp, orderDetails: temp1 });
                setTimeout(() => {
                    this.setState({ loading: false })
                });
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

    _renderScrollViewContent() {
        const data = Array.from({ length: 500 });
        return (
            <View style={styles.scrollViewContent}>
                {data.map((_, i) => (
                    <View key={i} style={styles.row}>
                        <Text>{i}</Text>
                    </View>
                ))}
            </View>
        );
    }

    render() {
        // Because of content inset the scroll value will be negative on iOS so bring
        // it back to 0.
        const scrollY = Animated.add(
            this.state.scrollY,
            Platform.OS === 'ios' ? HEADER_MAX_HEIGHT : 0,
        );
        const headerTranslate = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, -HEADER_SCROLL_DISTANCE],
            extrapolate: 'clamp',
        });

        const imageOpacity = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            outputRange: [1, 1, 0],
            extrapolate: 'clamp',
        });
        const imageTranslate = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, 100],
            extrapolate: 'clamp',
        });


        const titleScale = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            outputRange: [1, 1, 0.8],
            extrapolate: 'clamp',
        });
        const titleTranslate = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            outputRange: [0, 0, -8],
            extrapolate: 'clamp',
        });

        return (
            <View style={{ flex: 1 }}>
                <Header
                    placement="left"
                    leftComponent={{ text: 'Please choose from menu', style: { color: 'black', fontSize: 20 } }}
                    rightComponent={{ icon: 'close', color: 'orange', onPress: () => { this.closeOrder() } }}
                    containerStyle={{
                        backgroundColor: 'white',
                        height: 80,
                        borderBottomColor: 'black',
                        zIndex: 10
                    }}
                />
                <View style={styles.fill}>

                    {this.state.pLoading ? (
                        <PopupLoader />
                    ) : (<View></View>)}
                    {/* <StatusBar
                    translucent
                    barStyle="light-content"
                    backgroundColor="rgba(0, 0, 0, 0.251)"
                /> */}
                    {/* <Animated.ScrollView
                    style={styles.fill}
                    scrollEventThrottle={1}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
                        { useNativeDriver: true },
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={() => {
                                this.setState({ refreshing: true });
                                setTimeout(() => this.setState({ refreshing: false }), 1000);
                            }}
                            // Android offset for RefreshControl
                            progressViewOffset={HEADER_MAX_HEIGHT}
                        />
                    }
                    // iOS offset for RefreshControl
                    contentInset={{
                        top: HEADER_MAX_HEIGHT,
                    }}
                    contentOffset={{
                        y: -HEADER_MAX_HEIGHT,
                    }}
                > */}
                    {/* {this._renderScrollViewContent()} */}
                    <Animated.createAnimatedComponent
                        style={{ top: 200, zIndex: 15 }}
                        scrollEventThrottle={1}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
                            { useNativeDriver: true },
                        )}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={() => {
                                    this.setState({ refreshing: true });
                                    setTimeout(() => this.setState({ refreshing: false }), 1000);
                                }}
                                // Android offset for RefreshControl
                                progressViewOffset={HEADER_MAX_HEIGHT}
                            />
                        }
                        // iOS offset for RefreshControl
                        contentInset={{
                            top: HEADER_MAX_HEIGHT,
                        }}>
                        <FlatList

                            //  contentOffset={{
                            //      y: -HEADER_MAX_HEIGHT,
                            //  }}
                            // ListHeaderComponent={this.renderHeader}
                            data={this.state.menu}
                            extraData={this.state.selected}
                            keyExtractor={item => item._id}
                            renderItem={this.renderItem}
                            removeClippedSubviews={true} // Unmount components when outside of window 
                            initialNumToRender={4} // Reduce initial render amount
                            maxToRenderPerBatch={4} // Reduce number in each render batch
                            windowSize={10} // Reduce the window size
                            updateCellsBatchingPeriod={7}

                        />
                    </Animated.createAnimatedComponent>
                    {/* </Animated.ScrollView> */}
                    <Animated.View
                        pointerEvents="none"
                        style={[
                            styles.header,
                            { transform: [{ translateY: headerTranslate }] },
                        ]}
                    >
                        {this.renderHeader()}
                        {/* <Animated.Image
                        style={[
                            styles.backgroundImage,
                            {
                                opacity: imageOpacity,
                                transform: [{ translateY: imageTranslate }],
                            },
                        ]}
                        source={{ uri: 'https://i2.wp.com/beebom.com/wp-content/uploads/2016/01/Reverse-Image-Search-Engines-Apps-And-Its-Uses-2016.jpg?resize=640%2C426' }}
                    /> */}
                    </Animated.View>
                    {/* <Animated.View
                        style={[
                            styles.bar,
                            {
                                transform: [
                                    { scale: titleScale },
                                    { translateY: titleTranslate },
                                ],
                            },
                        ]}
                    > */}
                    {/* <Text style={styles.title}>Title</Text> */}

                    {/* </Animated.View> */}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    fill: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        // backgroundColor: '#03A9F4',
        // overflow: 'hidden',
        // height: HEADER_MAX_HEIGHT,
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: null,
        height: HEADER_MAX_HEIGHT,
        resizeMode: 'cover',
    },
    bar: {
        backgroundColor: 'transparent',
        marginTop: Platform.OS === 'ios' ? 28 : 38,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    title: {
        color: 'white',
        fontSize: 18,
    },
    scrollViewContent: {
        // iOS uses content inset, which acts like padding.
        paddingTop: Platform.OS !== 'ios' ? HEADER_MAX_HEIGHT : 0,
    },
    row: {
        height: 40,
        margin: 16,
        backgroundColor: '#D3D3D3',
        alignItems: 'center',
        justifyContent: 'center',
    },
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
    },
    headerContainer: {
        position: 'absolute',
        top: 80,
        left: 0,
        overflow: 'hidden',
        // backgroundColor: 'green',
    },
    innerScrollContainer: {

        position: 'relative',
        backgroundColor: 'white',
    },
    innerContainerText: { color: 'black' },
    testingText: { color: 'black' },
});





const mapStateToProps = (state) => {
    const { order } = state
    return { order }
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        orderDetails,
        showOrder
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Menu);






