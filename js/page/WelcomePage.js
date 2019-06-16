/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button } from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil';
type Props = {};
export default class WelcomePage extends Component<Props> {
    componentDidMount() {
        this.timer = setTimeout(() => {
            const { navigation } = this.props;
            NavigationUtil.resetToHomePage({ navigation })
        }, 200)
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer)
    }
    render() {
        return (
            <View style={styles.container}>
                <Text>WelcomePage</Text>
            </View>
        );
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
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
