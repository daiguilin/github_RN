/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import {
    createAppContainer,
    createMaterialTopTabNavigator
} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil'
type Props = {};
export default class PopularPage extends Component<Props> {
    constructor(props) {
        super(props);
        console.disableYellowBox = true
        this.tabNames = ['Java', 'Android', 'ios', 'React', 'React Native', 'Php']
    }
    //动态生成TopTabNavigator
    _genTabs() {
        const tabs = {};
        this.tabNames.forEach((item, index) => {
            tabs[`tab${index}`] = {
                screen: props => <PopularTab {...props} tabLabel={item} />,
                navigationOptions: {
                    title: item
                }
            }
        })
        return tabs;
    }
    render() {
        const TabNav = createMaterialTopTabNavigator(this._genTabs(), {
            //自定义tabBar的样式
            tabBarOptions: {
                tabStyle: styles.tabStyle,
                upperCaseLabel: false,//是否使标签大写，默认为true
                scrollEnabled: true,//是否支持 选项卡滚动，默认false
                style: {
                    backgroundColor: '#678',//TabBar 的背景颜色
                },
                indicatorStyle: styles.indicatorStyle,//标签指示器的样式
                labelStyle: styles.labelStyle,//文字样式
            }
        })
        const TabNavigator = createAppContainer(TabNav)
        return (
            <TabNavigator />
        );
    }
}

class PopularTab extends Component<Props> {
    render() {
        const { tabLabel } = this.props;
        return (
            <View style={styles.container}>
                <Text>{tabLabel}</Text>
                <Text onPress={() => {
                    NavigationUtil.goPage({}, "DetailPage")
                }}>跳转到详情页</Text>
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
    tabStyle: {
        minWidth: 50
    },
    indicatorStyle: {
        height: 2,
        backgroundColor: 'white'
    },
    labelStyle: {
        fontSize: 13,
        marginTop: 6,
        marginBottom: 6
    }
});
