import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigator from './components/pages/AppNavigator';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import friendReducer from './components/data/FriendReducer';
const store = createStore(friendReducer);

export default class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    );
  }
}