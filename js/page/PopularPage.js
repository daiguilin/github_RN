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
import actions from '../action/index'
import PopularItem from '../common/PopularItem';
import NavigationBar from '../common/NavigationBar';
import NavigationUtil from '../navigator/NavigationUtil';
import FavoriteDao from '../expand/dao/FavoriteDao';
import { FLAG_STORAGE } from '../expand/dao/DataStore';
import FavoriteUtil from '../util/FavoriteUtil';
import EventBus from 'react-native-event-bus';
import EventTypes from '../util/EventTypes';
import { FLAG_LANGUAGE } from '../expand/dao/LanguageDao';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)
const URL = 'http://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = '#678';
type Props = {};
class PopularPage extends Component<Props> {
    constructor(props) {
        super(props);
        console.disableYellowBox = true;//消除页面警告
        const { onLoadLanguage } = this.props;
        onLoadLanguage(FLAG_LANGUAGE.flag_key)
        // this.tabNames = ['Java', 'Android', 'ios', 'React', 'React Native', 'Php']
    }
    //动态生成TopTabNavigator
    _genTabs() {
        const tabs = {};
        const { keys } = this.props;
        keys.forEach((item, index) => {
            if (item.checked) {
                tabs[`tab${index}`] = {
                    screen: props => <PopularTabPage {...props} tabLabel={item.name} />,
                    navigationOptions: {
                        title: item.name
                    }
                }
            }

        })
        return tabs;
    }
    render() {
        const { keys } = this.props;
        const TabNav = keys.length ? createMaterialTopTabNavigator(this._genTabs(), {
            //自定义tabBar的样式
            tabBarOptions: {
                tabStyle: styles.tabStyle,
                upperCaseLabel: false,//是否使标签大写，默认为true
                scrollEnabled: true,//是否支持 选项卡滚动，默认false
                style: {
                    backgroundColor: THEME_COLOR,//TabBar 的背景颜色
                    alignItems: 'center',
                    height: 30
                },
                indicatorStyle: styles.indicatorStyle,//标签指示器的样式
                labelStyle: styles.labelStyle,//文字样式
            },
            lazy: true
        }) : null
        if (!TabNav) return <Text>加载中</Text>;
        const TabNavigator = createAppContainer(TabNav)
        return (
            <View style={styles.container}>
                <NavigationBar
                    statusBar={{ backgroundColor: THEME_COLOR }}
                    style={{ backgroundColor: THEME_COLOR }}
                    title="最热"
                />
                {TabNav && <TabNavigator />}
            </View>

        );
    }
}
const mapPopularStateToProps = state => {
    return {
        keys: state.language.keys
    }
}
const mapPopularDispatchToProps = dispatch => {
    return {
        onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
    }
}
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(PopularPage)
const pageSize = 10;//设为常量，防止修改
class PopularTab extends Component<Props> {
    constructor(props) {
        super(props);
        const { tabLabel } = this.props;
        this.storeName = tabLabel;
        this.isFavoriteChanged = false;
    }
    componentDidMount() {
        this.loadData();
        EventBus.getInstance().addListener(EventTypes.favorite_changed_popular, this.favoriteChangeListener = () => {
            this.isFavoriteChanged = true;
        })
        EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomChangeListener = (data) => {
            if (data.to === 0 && this.isFavoriteChanged) {
                this.loadData(null, true)
            }
        })
    }
    componentWillUnmount() {
        EventBus.getInstance().removeListener(this.favoriteChangeListener);
        EventBus.getInstance().removeListener(this.bottomChangeListener);
    }
    genFetchUrl(key) {
        return URL + key + QUERY_STR
    }
    _renderItem({ item }) {
        return (
            <PopularItem
                projectModel={item}
                onSelect={(callback) => {
                    NavigationUtil.goPage({
                        projectModel: item,
                        flag: FLAG_STORAGE.flag_popular,
                        callback
                    }, 'DetailPage')
                }}
                onFavorite={(item, isFavorite) => { FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular) }}
            />
        )
    }
    /**
   * 获取与当前页面有关的数据
   * @returns {*}
   * @private
   */
    _store() {
        const { popular } = this.props;
        let store = popular[this.storeName];
        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModels: [],//要显示的数据
                hideLoadingMore: true,//默认隐藏加载更多
            }
        }
        return store;
    }
    loadData(loadMore, refreshFavorite) {
        const { onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite } = this.props;
        const store = this._store();
        const url = this.genFetchUrl(this.storeName);
        if (loadMore) {
            onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callback => {
                this.refs.toast.show('没有更多了');
            })
        } else if (refreshFavorite) {
            onFlushPopularFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao)
        }
        else {
            onRefreshPopular(this.storeName, url, pageSize, favoriteDao)
        }
    }
    genIndicator() {
        return this._store().hideLoadingMore ? null :
            <View style={styles.indicatorContainer}>
                <ActivityIndicator
                    style={styles.indicator}
                />
                <Text>正在加载更多</Text>
            </View>
    }
    render() {
        const { popular } = this.props;
        let store = popular[this.storeName];//动态获取state
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
                    keyExtractor={item => "" + item.item.id}
                    refreshControl={
                        <RefreshControl
                            title={'Loading'}
                            titleColor={THEME_COLOR}
                            color={[THEME_COLOR]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData()}
                            tintColor={THEME_COLOR}
                        />
                    }
                    ListFooterComponent={() => this.genIndicator()}
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
            </View>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        popular: state.popular
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        onRefreshPopular: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshPopular(storeName, url, pageSize, favoriteDao)),
        onLoadMorePopular: (storeName, pageIndex, pageSize, items, favoriteDao, callBack) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, favoriteDao, callBack)),
        onFlushPopularFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, pageSize, items, favoriteDao)),
    }
}
const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab)
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
