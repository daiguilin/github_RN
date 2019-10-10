/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { MORE_MENU } from '../common/MORE_MENU';
import NavigationBar from '../common/NavigationBar';
import Ionicons from 'react-native-vector-icons/Ionicons'
import GlobalStyles from '../res/style/GlobalStyles';
import ViewUtil from '../util/ViewUtil';
import NavigationUtil from '../navigator/NavigationUtil';
import { FLAG_LANGUAGE } from '../expand/dao/LanguageDao';
import { connect } from 'react-redux';
import actions from '../action';
type Props = {};
class MyPage extends Component<Props> {
    onClick(menu) {
        let RouteName, params = {};
        switch (menu) {
            case MORE_MENU.Tutorial:
                RouteName = 'WebViewPage';
                params.title = '教程';
                params.url = 'https://www.imooc.com/'
                break;
            case MORE_MENU.About:
                RouteName = 'AboutPage';
                break;
            case MORE_MENU.Custom_Theme:
                const { onShowCustomThemeView } = this.props;
                onShowCustomThemeView(true);
                break;
            case MORE_MENU.Sort_Key:
                RouteName = 'SortKeyPage';
                params.flag = FLAG_LANGUAGE.flag_key
                break;
            case MORE_MENU.Sort_Language:
                RouteName = 'SortKeyPage';
                params.flag = FLAG_LANGUAGE.flag_language
                break;
            case MORE_MENU.About_Author:
                RouteName = 'AboutMePage';
                break;
            case MORE_MENU.Custom_Key:
            case MORE_MENU.Custom_Language:
            case MORE_MENU.Remove_Key:
                RouteName = 'CustomKeyPage';
                params.isRemoveKey = menu === MORE_MENU.Remove_Key;
                params.flag = menu !== MORE_MENU.Custom_Language ? FLAG_LANGUAGE.flag_key : FLAG_LANGUAGE.flag_language
                break;
        }

        if (RouteName) {
            NavigationUtil.goPage(params, RouteName)
        }
    }
    getItem(menu) {
        const { theme } = this.props;
        return ViewUtil.getMenuItem(() => this.onClick(menu), menu, theme.themeColor)
    }
    render() {
        const { theme } = this.props;
        return (
            <View style={GlobalStyles.root_container}>
                <NavigationBar
                    title={'我的'}
                    statusBar={theme.styles.navBar}
                    style={theme.styles.navBar}
                />
                <ScrollView>
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => { this.onClick(MORE_MENU.About) }}
                    >
                        <View style={styles.about_left}>
                            <Ionicons
                                name={MORE_MENU.About.icon}
                                size={40}
                                style={{
                                    marginRight: 10,
                                    color: theme.themeColor
                                }}
                            />
                            <Text>Github Popular</Text>
                        </View>
                        <Ionicons
                            name={'ios-arrow-forward'}
                            size={16}
                            style={{
                                marginRight: 10,
                                color: theme.themeColor,
                                alignSelf: 'center'
                            }}
                        />
                    </TouchableOpacity>
                    <View style={GlobalStyles.line}></View>
                    {
                        this.getItem(MORE_MENU.Tutorial)
                    }
                    {/*趋势管理 */}
                    <Text style={styles.groupTitle}>趋势管理</Text>
                    {
                        this.getItem(MORE_MENU.Custom_Language)
                    }
                    <View style={GlobalStyles.line}></View>
                    {
                        this.getItem(MORE_MENU.Sort_Language)
                    }
                    {/*最热管理 */}
                    <Text style={styles.groupTitle}>最热管理</Text>
                    {
                        this.getItem(MORE_MENU.Custom_Key)
                    }
                    <View style={GlobalStyles.line}></View>
                    {
                        this.getItem(MORE_MENU.Sort_Key)
                    }
                    <View style={GlobalStyles.line}></View>
                    {
                        this.getItem(MORE_MENU.Remove_Key)
                    }
                    {/*设置 */}
                    <Text style={styles.groupTitle}>设置</Text>
                    {
                        this.getItem(MORE_MENU.Custom_Theme)
                    }
                    <View style={GlobalStyles.line}></View>
                    {
                        this.getItem(MORE_MENU.About_Author)
                    }
                    <View style={GlobalStyles.line}></View>
                    {
                        this.getItem(MORE_MENU.Feedback)
                    }
                </ScrollView>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    theme: state.theme.theme
});

const mapDispatchToProps = dispatch => ({
    onShowCustomThemeView: (show) => dispatch(actions.onShowCustomTheme(show))
})
export default connect(mapStateToProps, mapDispatchToProps)(MyPage)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    item: {
        backgroundColor: 'white',
        padding: 10,
        height: 90,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    about_left: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    groupTitle: {
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 5,
        fontSize: 12,
        color: 'gray'
    }

});
