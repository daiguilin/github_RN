/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, ScrollView, View, Alert, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
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
import ArrayUtil from '../util/ArrayUtil';
const THEME_COLOR = '#678';
type Props = {};
class CustomKeyPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        // const { onLoadLanguage } = this.props;
        // onLoadLanguage(FLAG_LANGUAGE.flag_key)
        this.changeValues = [];
        this.isRemoveKey = !!this.params.isRemoveKey;
        this.backPress = new BackPressComponent({ backPress: () => this.onBackPress() })
        this.languageDao = new LanguageDao(this.params.flag)
        this.state = {
            keys: []
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
                            NavigationUtil.goBack(this.props.navigation)
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
        if (prevState.keys !== CustomKeyPage._keys(nextProps, null, prevState)) {
            return {
                keys: CustomKeyPage._keys(nextProps, null, prevState)
            }
        }
        return null;
    }
    componentDidMount() {
        this.backPress.componentDidMount()
        //如果props中标签为空，则从本地存储中获取标签
        if (CustomKeyPage._keys(this.props).length === 0) {
            let { onLoadLanguage } = this.props;
            onLoadLanguage(this.params.flag);
        }
        this.setState({
            keys: CustomKeyPage._keys(this.props)
        })
    }

    /**
     * @description: 获取标签
     * @param props
     * @param original 移除标签时使用，是否从props获取原始对的标签
     * @param state 移除标签时使用
     * @return: 
     */
    static _keys(props, original, state) {
        const { flag, isRemoveKey } = props.navigation.state.params;
        let key = flag === FLAG_LANGUAGE.flag_key ? "keys" : "languages";
        if (isRemoveKey && !original) {
            return state && state.keys && state.keys.length !== 0 && state.keys || props.language[key].map(val => {
                //如果state中的keys为空则从props中取
                return {//注意：不要直接修改props，copy一份
                    ...val,
                    checked: false
                }
            })
        } else {
            return props.language[key]
        }
    }
    onSave() {
        if (this.changeValues.length === 0) {
            NavigationUtil.goBack(this.props)
            return;
        }
        let keys;
        if (this.isRemoveKey) {//移除标签的特殊处理 
            for (let i = 0, l = this.changeValues.length; i < l; i++) {
                ArrayUtil.remove(keys = CustomKeyPage._keys(this.props, true), this.changeValues[i], 'name')
            }
        }
        //更新本地数据
        this.languageDao.save(keys || this.state.keys)
        const { onLoadLanguage } = this.props;
        onLoadLanguage(this.params.flag);
        NavigationUtil.goBack(this.props)
    }
    componentWillUnmount() {
        this.backPress.componentWillUnmount()
    }
    renderView() {
        let dataArray = this.state.keys;
        if (!dataArray || dataArray.length === 0) return;
        let len = dataArray.length;
        let views = [];
        for (let i = 0, l = len; i < l; i += 2) {
            views.push(
                <View keys={i}>
                    <View style={styles.item}>
                        {this.renderCheckBox(dataArray[i], i)}
                        {i + 1 < len && this.renderCheckBox(dataArray[i + 1], i + 1)}

                    </View>
                    <View style={styles.line} />
                </View>
            )
        }
        return views;
    }
    onClick(data, index) {
        data.checked = !data.checked;
        ArrayUtil.updateArray(this.changeValues, data);
        this.state.keys[index] = data;//更新state以便于显示选中状态
        this.setState({
            keys: this.state.keys
        })
    }
    _checkedImage(checked) {
        const { theme } = this.params;
        return <Ionicons
            name={checked ? 'ios-checkbox' : 'md-square-outline'}
            size={20}
            style={{
                color: THEME_COLOR
            }}
        />
    }
    renderCheckBox(data, index) {
        return <CheckBox
            style={{ flex: 1, padding: 10 }}
            onClick={() => this.onClick(data, index)}
            isChecked={data.checked}
            leftText={data.name}
            checkedImage={this._checkedImage(true)}
            unCheckedImage={this._checkedImage(false)}
        />
    }
    render() {
        console.log(this.state, 'state')
        let title = this.isRemoveKey ? "标签移除" : "自定义标签";
        title = this.params.flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : title;
        let rightButtonTitle = this.isRemoveKey ? '移除' : '保存';
        return (
            <View style={styles.container}>
                <NavigationBar
                    statusBar={{ backgroundColor: THEME_COLOR }}
                    style={{ backgroundColor: THEME_COLOR }}
                    title={title}
                    leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
                    rightButton={ViewUtil.getRightButton(rightButtonTitle, () => this.onSave())}
                />
                <ScrollView>
                    {this.renderView()}
                </ScrollView>
            </View>

        );
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
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(CustomKeyPage)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        flexDirection: "row"
    },
    line: {
        height: 1,
        backgroundColor: '#eee'
    }
});
