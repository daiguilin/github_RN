
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import BackPressComponent from '../common/BackPressComponent'
import NavigationUtil from '../navigator/NavigationUtil'
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';
import CustomTheme from './CustomTheme'
import actions from '../action';
type Props = {};
class HomePage extends Component<Props> {
    constructor(props) {
        super(props);
        this.backPress = new BackPressComponent({ backPress: this.onBackPress });
    }
    componentDidMount() {
        this.backPress.componentDidMount();
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    /**
     * 处理 Android 中的物理返回键
     * https://reactnavigation.org/docs/en/redux-integration.html#handling-the-hardware-back-button-in-android
     * @returns {boolean}
     */
    onBackPress = () => {
        const { dispatch, nav } = this.props;
        //if (nav.index === 0) {
        if (nav.routes[1].index === 0) {//如果RootNavigator中的MainNavigator的index为0，则不处理返回事件
            return false;
        }
        dispatch(NavigationActions.back());
        return true;
    };
    renderCustomThemeView() {
        const { onShowCustomThemeView, customThemeViewVisible } = this.props;
        return (
            <CustomTheme
                visible={customThemeViewVisible}
                {...this.props}
                onClose={() => onShowCustomThemeView(false)}
            />
        )
    }
    render() {
        NavigationUtil.navigation = this.props.navigation;
        return <View style={{ flex: 1 }}>
            <DynamicTabNavigator />
            {this.renderCustomThemeView()}
        </View>
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
    bottom: {
        height: 50
    },
});
const mapStateToProps = state => ({
    nav: state.nav,
    customThemeViewVisible: state.theme.customThemeViewVisible
});

const mapDispatchToProps = dispatch => ({
    onShowCustomThemeView: (show) => dispatch(actions.onShowCustomTheme(show))
})

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);