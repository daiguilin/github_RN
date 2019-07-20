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
    createBottomTabNavigator
} from 'react-navigation';
import { connect } from 'react-redux';
import EventBus from 'react-native-event-bus'
import { BottomTabBar } from 'react-navigation-tabs';//用BottomTabBar自定义底部Tab
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'

import FavoritePage from '../page/FavoritePage';
import TrendingPage from '../page/TrendingPage';
import PopularPage from '../page/PopularPage';
import MyPage from '../page/MyPage';
import EventTypes from '../util/EventTypes';
type Props = {};
const TABS = {
    PopularPage: {
        screen: PopularPage,
        navigationOptions: {
            tabBarLabel: '最热',
            tabBarIcon: ({ tintColor, focused }) => {
                return <MaterialIcons
                    name={'whatshot'}
                    size={26}
                    style={{ color: tintColor }}
                />
            }
        }
    },
    TrendingPage: {
        screen: TrendingPage,
        navigationOptions: {
            tabBarLabel: '趋势',
            tabBarIcon: ({ tintColor, focused }) => {
                return <Ionicons
                    name={'md-trending-up'}
                    size={26}
                    style={{ color: tintColor }}
                />
            }
        }
    },
    FavoritePage: {
        screen: FavoritePage,
        navigationOptions: {
            tabBarLabel: '收藏',
            tabBarIcon: ({ tintColor, focused }) => {
                return <MaterialIcons
                    name={'favorite'}
                    size={26}
                    style={{ color: tintColor }}
                />
            }
        }
    },
    MyPage: {
        screen: MyPage,
        navigationOptions: {
            tabBarLabel: '我的',
            tabBarIcon: ({ tintColor, focused }) => {
                return <Entypo
                    name={'user'}
                    size={26}
                    style={{ color: tintColor }}
                />
            }
        }
    }
}
class DynamicTabNavigator extends Component<Props> {
    constructor(props) {
        super(props)
        // console.disableYellowBox = true;
    }
    _tabNavigator() {
        if (this.TabNav) {
            return this.TabNav;
        }
        const { PopularPage, TrendingPage, FavoritePage, MyPage } = TABS;
        const tabs = { PopularPage, TrendingPage, FavoritePage, MyPage };//根据需要动态配置底部导航
        PopularPage.navigationOptions.tabBarLabel = "最热";//动态配置Tab属性
        const BottomTabNav = createBottomTabNavigator(tabs, {
            tabBarComponent: props => <TabBarComponent theme={this.props.theme} {...props} />
        })
        return this.TabNav = createAppContainer(BottomTabNav)

    }
    render() {
        const Tab = this._tabNavigator();
        return <Tab
            onNavigationStateChange={(prevState, newState, action) => {
                EventBus.getInstance().fireEvent(EventTypes.bottom_tab_select, {//发送底部tab切换事件
                    from: prevState.index,
                    to: newState.index
                })
            }}
        />
    }
}
//通过BottomTabBar动态设置TabBarComponent 
class TabBarComponent extends Component {
    constructor(props) {
        super(props);
        this.theme = {
            tintColor: props.activeTintColor,
            updateTime: new Date().getTime(),
        }
    }
    render() {
        // const { routes, index } = this.props.navigation.state;
        // if (routes[index].params) {
        //     const { theme } = routes[index].params;
        //     if (theme && theme.updateTime > this.theme.updateTime) {
        //         this.theme = theme;
        //     }
        // }
        return <BottomTabBar
            {...this.props}
            // activeTintColor={this.theme.tintColor || this.props.activeTintColor}
            activeTintColor={this.props.theme}
        />
    }
}
const mapStateToProps = state => ({
    theme: state.theme.theme
})
export default connect(mapStateToProps)(DynamicTabNavigator)