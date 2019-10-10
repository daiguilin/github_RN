/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, ScrollView, View, Alert, TouchableHighlight, RefreshControl, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import SortableListView from 'react-native-sortable-listview'
import actions from '../action/index'
import PopularItem from '../common/PopularItem';
import NavigationBar from '../common/NavigationBar';
import NavigationUtil from '../navigator/NavigationUtil';
import FavoriteDao from '../expand/dao/FavoriteDao';
import { FLAG_STORAGE } from '../expand/dao/DataStore';
import BackPressComponent from '../common/BackPressComponent'
import LanguageDao, { FLAG_LANGUAGE } from '../expand/dao/LanguageDao';
import ViewUtil from '../util/ViewUtil';
import CheckBox from 'react-native-check-box';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import ArrayUtil from '../util/ArrayUtil';
const THEME_COLOR = '#678';
type Props = {};
class SortKeyPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        // const { onLoadLanguage } = this.props;
        // onLoadLanguage(FLAG_LANGUAGE.flag_key)
        this.backPress = new BackPressComponent({ backPress: () => this.onBackPress() })
        this.languageDao = new LanguageDao(this.params.flag)
        this.state = {
            checkedArray: SortKeyPage._keys(this.props)
        }
    }
    onBackPress() {
        this.onBack()
        return true;
    }
    onBack() {
        if (this.changeValues.length > 0) {
            Alert.alert('提示', '要保存修改吗？',
                [
                    {
                        text: '否', onPress: () => {
                            NavigationUtil.goBack(this.props)
                        }
                    },
                    {
                        text: '是', onPress: () => {
                            this.onSave();
                        }
                    }
                ]
            )
        } else {
            NavigationUtil.goBack(this.props)
        }

    }
    static getDerivedStateFromProps(nextProps, prevState) {
        const checkedArray = SortKeyPage._keys(nextProps, null, prevState);

        if (prevState.checkedArray !== checkedArray) {
            return {
                checkedArray
            }
        }
        return null;
    }
    componentDidMount() {
        this.backPress.componentDidMount()
        //如果props中标签为空，则从本地存储中获取标签
        if (SortKeyPage._keys(this.props).length === 0) {
            let { onLoadLanguage } = this.props;
            onLoadLanguage(this.params.flag);
        }
    }

    /**
     * @description: 获取标签
     * @param props
     * @param state 
     * @return: 
     */
    static _keys(props, state) {
        //如果state中有checkedArray则使用state中的checkedArray
        if (state && state.checkedArray && state.checkedArray.length) {
            return state.checkedArray
        }
        //否则从原始数据中获取checkedArray
        const flag = SortKeyPage._flag(props);
        let dataArray = props.language[flag] || [];
        let keys = [];
        for (let i = 0, j = dataArray.length; i < j; i++) {
            let data = dataArray[i];
            if (data.checked) keys.push(data)
        }
        return keys;

    }
    static _flag(props) {
        const { flag } = props.navigation.state.params;
        return flag === FLAG_LANGUAGE.flag_key ? "keys" : "languages";
    }
    /**
     * 获取排序后的标签结果
     * @return {Array} 
     */
    getSortResult() {
        const flag = SortKeyPage._flag(this.props);
        //从原始数据中复制一份数据出来，以便对这份数据进行排序
        let sortResultArray = ArrayUtil.clone(this.props.language[flag]);
        //获取排序之前的排列顺序
        const originalCheckedArray = SortKeyPage._keys(this.props);
        //遍历排序之前的数据，用排序后的数据checkedArray进行替换
        for (let i = 0, j = originalCheckedArray.length; i < j; i++) {
            let item = originalCheckedArray[i];
            //找到要替换的元素所在位置
            let index = this.props.language[flag].indexOf(item);
            //进行替换
            sortResultArray.splice(index, 1, this.state.checkedArray[i])
        }
        return sortResultArray;
    }
    onSave(hasChecked) {
        if (!hasChecked) {
            //如果没有排序则直接返回
            if (ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
                NavigationUtil.goBack(this.props);
                return;
            }
        }
        //保存排序后的数据
        //获取排序后的数据
        //更新本地数据
        console.log('originData', SortKeyPage._keys(this.props))
        console.log('getSortResult', this.getSortResult())
        this.languageDao.save(this.getSortResult())

        //重新加载排序后的标签，以便其他页面能够及时更新
        const { onLoadLanguage } = this.props;
        //更新store
        onLoadLanguage(this.params.flag);
        NavigationUtil.goBack(this.props)
    }
    componentWillUnmount() {
        this.backPress.componentWillUnmount()
    }
    render() {
        let title = this.params.flag === FLAG_LANGUAGE.flag_language ? "语言排序" : "标签排序";
        const order = Object.keys(this.state.checkedArray)
        return (
            <View style={styles.container}>
                <NavigationBar
                    statusBar={{ backgroundColor: THEME_COLOR }}
                    style={{ backgroundColor: THEME_COLOR }}
                    title={title}
                    leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
                    rightButton={ViewUtil.getRightButton('保存', () => this.onSave())}
                />
                <SortableListView
                    data={this.state.checkedArray}
                    order={order}
                    onRowMoved={e => {
                        this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0])
                        this.forceUpdate()
                    }}
                    renderRow={row => <SortCell data={row} {...this.params} />}
                />
            </View>

        );
    }
}
class SortCell extends React.Component {
    render() {
        return (
            <TouchableHighlight
                underlayColor={'#eee'}
                style={this.props.data.checked ? styles.item : styles.hidden}
                {...this.props.sortHandlers}
            >
                <View style={{ marginLeft: 10, flexDirection: 'row' }}>
                    <MaterialCommunityIcons
                        name={'sort'}
                        size={16}
                        style={{ marginRight: 10, color: THEME_COLOR }}
                    />
                    <Text>{this.props.data.name}</Text>
                </View>
            </TouchableHighlight>
        )
    }
}

const mapPopularStateToProps = state => {
    return {
        language: state.language
    }
}
const mapPopularDispatchToProps = dispatch => {
    return {
        onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
    }
}
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(SortKeyPage)

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    line: {
        flex: 1,
        height: 0.3,
        backgroundColor: 'darkgray',
    },
    hidden: {
        height: 0
    },
    item: {
        backgroundColor: "#F8F8F8",
        borderBottomWidth: 1,
        borderColor: '#eee',
        height: 50,
        justifyContent: 'center'
    },
});
