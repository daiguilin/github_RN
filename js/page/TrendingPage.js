/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import {
    createAppContainer,
    createMaterialTopTabNavigator
} from 'react-navigation';
import Toast from 'react-native-easy-toast'
import { connect } from 'react-redux';
import actions from '../action/index'
import TrendingItem from '../common/TrendingItem';
import NavigationBar from '../common/NavigationBar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import TrendingDialog, { TimeSpans } from '../common/TrendingDialog';
const URL = 'https://github.com/trending/';
const THEME_COLOR = '#678';
const EVENT_TYPE_TIME_SPAN_CHANGE = "EVENT_TYPE_TIME_SPAN_CHANGE"
type Props = {};
export default class TrendingPage extends Component<Props> {
    constructor(props) {
        super(props);
        console.disableYellowBox = true
        this.tabNames = ['JavaScript', 'c', 'python', 'vue', 'c#']
        this.state = {
            timeSpan: TimeSpans[0]
        }
    }
    //动态生成TopTabNavigator
    _genTabs() {
        const tabs = {};
        this.tabNames.forEach((item, index) => {
            tabs[`tab${index}`] = {
                screen: props => <TrendingTabPage timeSpan={this.state.timeSpan} {...props} tabLabel={item} />,
                navigationOptions: {
                    title: item
                }
            }
        })
        return tabs;
    }
    renderTitleView() {
        return (
            <View>
                <TouchableOpacity
                    ref='button'
                    underlayColor='transparent'
                    onPress={() => this.dialog.show()}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                            style={{
                                fontSize: 18,
                                color: '#ffffff',
                                fontWeight: '400'
                            }}
                        >趋势{" "}{this.state.timeSpan.showText}</Text>
                        <MaterialIcons
                            name={'arrow-drop-down'}
                            size={22}
                            style={{ color: 'white' }}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    onSelectTimeSpan(tab) {
        this.dialog.dismiss();
        DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab);
        this.setState({
            timeSpan: tab
        })
    }
    renderTrendingDialog() {
        return <TrendingDialog
            ref={dialog => this.dialog = dialog}
            onSelect={tab => this.onSelectTimeSpan(tab)}
        />
    }
    _tabNav() {
        if (!this.TabNav) {
            this.TabNav = createAppContainer(createMaterialTopTabNavigator(this._genTabs(), {
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
            }))
        }
        return this.TabNav;
    }
    render() {
        const TabNavigator = this._tabNav();
        return (
            <View style={styles.container}>
                <NavigationBar
                    titleView={this.renderTitleView()}
                    statusBar={{ backgroundColor: THEME_COLOR }}
                    style={{ backgroundColor: THEME_COLOR }}
                    title="趋势"
                />
                {this.renderTrendingDialog()}
                <TabNavigator />
            </View>

        );
    }
}
const pageSize = 10;//设为常量，防止修改
class TrendingTab extends Component<Props> {
    constructor(props) {
        super(props);
        const { tabLabel, timeSpan } = this.props;
        this.storeName = tabLabel;
        this.timeSpan = timeSpan
    }
    componentDidMount() {
        this.loadData();
        this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
            this.timeSpan = timeSpan
            this.loadData();
        })

    }
    componentWillUnmount() {
        if (this.timeSpanChangeListener) {
            this.timeSpanChangeListener.remove()
        }
    }
    genFetchUrl(key) {
        return URL + key + '?' + this.timeSpan.searchText;
    }
    _renderItem({ item }) {
        return (
            <TrendingItem
                item={item}
                onSelect={() => { }}
            />
        )
    }
    /**
   * 获取与当前页面有关的数据
   * @returns {*}
   * @private
   */
    _store() {
        const { trending } = this.props;
        let store = trending[this.storeName];
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
        const { onRefreshTrending, onLoadMoreTrending } = this.props;
        const store = this._store();
        const url = this.genFetchUrl(this.storeName);
        if (loadMore) {
            onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, callback => {
                this.refs.toast.show('没有更多了');
            })
        } else {
            onRefreshTrending(this.storeName, url, pageSize)
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
        const { trending } = this.props;
        let store = trending[this.storeName];//动态获取state
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
                    keyExtractor={item => item.id ? "" + item.id : item.fullName}
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
        trending: state.trending
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        onRefreshTrending: (storeName, url, pageSize) => dispatch(actions.onRefreshTrending(storeName, url, pageSize)),
        onLoadMoreTrending: (storeName, pageIndex, pageSize, items, callBack) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, callBack)),
    }
}
const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab)
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
