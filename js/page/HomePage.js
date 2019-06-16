/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
// import {
//     createAppContainer,
//     createBottomTabNavigator
// } from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil'
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
// import Ionicons from 'react-native-vector-icons/Ionicons'
// import Entypo from 'react-native-vector-icons/Entypo'

// import FavoritePage from './FavoritePage';
// import TrendingPage from './TrendingPage';
// import PopularPage from './PopularPage';
// import MyPage from './MyPage';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';
type Props = {};
export default class HomePage extends Component<Props> {
    render() {
        NavigationUtil.navigation = this.props.navigation;
        return <DynamicTabNavigator />
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    bottom: {
        height: 50
    },
});
