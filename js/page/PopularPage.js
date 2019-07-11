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
import NavigationUtil from '../navigator/NavigationUtil'
const URL = 'http://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = '#678';
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
                screen: props => <PopularTabPage {...props} tabLabel={item} />,
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
                    backgroundColor: THEME_COLOR,//TabBar 的背景颜色
                    alignItems: 'center',
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
                    title="最热"
                />
                <TabNavigator />
            </View>

        );
    }
}
const pageSize = 10;//设为常量，防止修改
class PopularTab extends Component<Props> {
    constructor(props) {
        super(props);
        const { tabLabel } = this.props;
        this.storeName = tabLabel;
    }
    componentDidMount() {
        this.loadData();
    }
    genFetchUrl(key) {
        return URL + key + QUERY_STR
    }
    _renderItem({ item }) {
        return (
            <PopularItem
                item={item}
                onSelect={() => {
                    NavigationUtil.goPage({
                        projectModel: item
                    }, 'DetailPage')
                }}
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
    loadData(loadMore) {
        const { onRefreshPopular, onLoadMorePopular } = this.props;
        const store = this._store();
        const url = this.genFetchUrl(this.storeName);
        if (loadMore) {
            onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, callback => {
                this.refs.toast.show('没有更多了');
            })
        } else {
            onRefreshPopular(this.storeName, url, pageSize)
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
                    keyExtractor={item => "" + item.id}
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
        onRefreshPopular: (storeName, url, pageSize) => dispatch(actions.onRefreshPopular(storeName, url, pageSize)),
        onLoadMorePopular: (storeName, pageIndex, pageSize, items, callBack) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, callBack)),
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
