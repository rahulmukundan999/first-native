import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Ionicons from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/FontAwesome';
import Home from './home/Home';
import Menu from './menu/Menu';
import Login from './login/Login';
import Scan from './scan/Scan';
import Order from './order/Order';
import { Dimensions } from 'react-native';
const WIDTH = Dimensions.get('window').width;
const OrderStack = createStackNavigator({
    Order: {
        screen: Order,
        navigationOptions: {
            header: null
        }
    }
});
const LoginStack = createStackNavigator({
    Login: {
        screen: Login,
        navigationOptions: {
            header: null
        }
    }
});
const MenuScreen = createStackNavigator({
    Menu: {
        screen: Menu,
        navigationOptions: {
            header: null
        }
    }
});
const ScanScreen = createStackNavigator({
    scan: {
        screen: Scan
    }
}, {
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: '#f5f5f5',
        },
        headerTintColor: 'black',
        title: 'Please scan the qr code',
        headerTitleStyle: {
            width: WIDTH - 75,
        }
    }
});
const Bottom = createBottomTabNavigator({
    //Defination of Navigaton bottom options
    Scan: {
        screen: ScanScreen
    },
    Orders: {
        screen: OrderStack
    },
    Restaurant: {
        screen: LoginStack
    },
    Account: {
        screen: LoginStack
    }
}, {
    //For React Navigation 2.+ change defaultNavigationOptions->navigationOptions
    defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
            const { routeName } = navigation.state;
            let IconComponent = Ionicons;
            let EntypoComponent = Entypo;
            let MaterialCommunityIconsComponent = MaterialCommunityIcons;
            let iconName;
            if (routeName === 'Scan') {
                iconName = `ios-qr-scanner`;
                return React.createElement(IconComponent, { name: iconName, size: 25, color: tintColor });
                // Sometimes we want to add badges to some icons.
                // You can check the implementation below.
            }
            else if (routeName === 'Orders') {
                iconName = `list`;
                return React.createElement(EntypoComponent, { name: iconName, size: 25, color: tintColor });
            }
            else if (routeName === 'Restaurant') {
                iconName = "location-pin";
                return React.createElement(EntypoComponent, { name: iconName, size: 25, color: tintColor });
            }
            else if (routeName === 'Account') {
                iconName = "account";
                return React.createElement(MaterialCommunityIconsComponent, { name: iconName, size: 25, color: tintColor });
            }
            // You can return any component that you like here!
        },
    }),
    tabBarOptions: {
        activeTintColor: 'orange',
        inactiveTintColor: 'gray'
    },
});
const AppNavigator = createSwitchNavigator({
    Home: {
        screen: Home
    },
    Login: {
        screen: LoginStack
    },
    Dashboard: {
        screen: Bottom
    },
    Menu: {
        screen: Menu
    }
}, {
    initialRouteName: 'Home',
});
const Container = createAppContainer(AppNavigator);
export default Container;
//# sourceMappingURL=AppNavigator.js.map