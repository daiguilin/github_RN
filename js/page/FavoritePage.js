/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import {
    createAppContainer,
    createMaterialTopTabNavigator
} from 'react-navigation';
import Toast from 'react-native-easy-toast'
import { connect } from 'react-redux';
import EventBus from 'react-native-event-bus'
import actions from '../action/index'
import PopularItem from '../common/PopularItem';
import TrendingItem from '../common/TrendingItem';
import NavigationBar from '../common/NavigationBar';
import NavigationUtil from '../navigator/NavigationUtil';
import FavoriteDao from '../expand/dao/FavoriteDao';
import { FLAG_STORAGE } from '../expand/dao/DataStore';
import FavoriteUtil from '../util/FavoriteUtil';
import EventTypes from '../util/EventTypes';

import ToastExample from "../common/ToastExample";



const URL = 'http://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = '#678';
type Props = {};
export default class FavoritePage extends Component<Props> {
    constructor(props) {
        super(props);
        console.disableYellowBox = true
    }
    render() {
        const TabNav = createMaterialTopTabNavigator({
            'Popular': {
                screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular} />,
                navigationOptions: {
                    title: "最热"
                }
            },
            'Trending': {
                screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending} />,
                navigationOptions: {
                    title: "趋势"
                }
            }
        }, {
                //自定义tabBar的样式
                tabBarOptions: {
                    tabStyle: styles.tabStyle,
                    upperCaseLabel: false,//是否使标签大写，默认为true
                    style: {
                        backgroundColor: THEME_COLOR,//TabBar 的背景颜色
                        height: 30
                    },
                    indicatorStyle: styles.indicatorStyle,//标签指示器的样式
                    labelStyle: styles.labelStyle,//文字样式
                }
            })
        const TabNavigator = createAppContainer(TabNav)
        return (
            <View style={styles.container}>
                <NavigationBar
                    statusBar={{ backgroundColor: THEME_COLOR }}
                    style={{ backgroundColor: THEME_COLOR }}
                    title="收藏"
                />
                <TabNavigator />
            </View>

        );
    }
}
const pageSize = 10;//设为常量，防止修改
class FavoriteTab extends Component<Props> {
    constructor(props) {
        super(props);
        const { flag } = this.props;
        this.storeName = flag;
    }
    componentDidMount() {
        this.loadData(true);
        EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.listener = data => {
            //console.log(data, 'data--')
            if (data.to === 2) {
                this.loadData(false)
            }
        })
    }
    componentWillUnmount() {
        EventBus.getInstance().removeListener(this.listener)
    }
    genFetchUrl(key) {
        return URL + key + QUERY_STR
    }
    onFavorite(item, isFavorite) {
        FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, this.props.flag)
        if (this.storeName === FLAG_STORAGE.flag_popular) {
            EventBus.getInstance().fireEvent(EventTypes.favorite_changed_popular)
        } else {
            EventBus.getInstance().fireEvent(EventTypes.favorite_changed_trending)
        }
    }
    _renderItem({ item }) {
        let Item = this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem;
        this.favoriteDao = new FavoriteDao(this.storeName)
        return (
            <Item
                projectModel={item}
                onSelect={(callback) => {
                    NavigationUtil.goPage({
                        projectModel: item,
                        flag: this.storeName,
                        callback
                    }, 'DetailPage')
                }}
                onFavorite={(item, isFavorite) => { this.onFavorite(item, isFavorite) }}
            />
        )
    }
    /**
   * 获取与当前页面有关的数据
   * @returns {*}
   * @private
   */
    _store() {
        const { favorite } = this.props;
        let store = favorite[this.storeName];
        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModels: [],//要显示的数据
            }
        }
        return store;
    }
    loadData(isShowLoading) {
        const { onLoadFavoriteData } = this.props;
        onLoadFavoriteData(this.storeName, isShowLoading)

    }
    handleClick = () => {
        ToastExample.show("Awesome", ToastExample.SHORT)
    }
    render() {
        const { favorite } = this.props;
        let store = favorite[this.storeName];//动态获取state
        if (!store) {
            store = {
                items: [],
                isLoading: false
            }
        }
        return (
            <View style={styles.container}>
                <FlatList
                    data={store.projectModels}
                    renderItem={data => this._renderItem(data)}
                    keyExtractor={item => "" + (item.item.id || item.item.fullName)}
                    refreshControl={
                        <RefreshControl
                            title={'Loading'}
                            titleColor={THEME_COLOR}
                            color={[THEME_COLOR]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData(true)}
                            tintColor={THEME_COLOR}
                        />
                    }
                    onEndReached={() => {
                        console.log('---onEndReached----');
                        setTimeout(() => {
                            if (this.canLoadMore) {//fix 滚动时两次调用onEndReached https://github.com/facebook/react-native/issues/14015
                                this.loadData(true);
                                this.canLoadMore = false;
                            }
                        }, 100);
                    }}
                    onEndReachedThreshold={0.5}
                    onMomentumScrollBegin={() => {
                        this.canLoadMore = true; //fix 初始化时页调用onEndReached的问题
                        console.log('---onMomentumScrollBegin-----')
                    }}

                />
                <Toast ref="toast"
                    position={'center'}
                />
                {/* <View><Text onPress={this.handleClick}>点击显示</Text></View> */}
            </View>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        favorite: state.favorite
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        onLoadFavoriteData: (storeName, isShowLoading) => dispatch(actions.onLoadFavoriteData(storeName, isShowLoading)),
    }
}
const FavoriteTabPage = connect(mapStateToProps, mapDispatchToProps)(FavoriteTab)
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabStyle: {
        // minWidth: 50
        padding: 0,
    },
    indicatorStyle: {
        height: 2,
        backgroundColor: 'white'
    },
    indicatorContainer: {
        alignItems: "center"
    },
    labelStyle: {
        fontSize: 13,
        margin: 0,
    }
});
