
import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import NavigationUtil from '../navigator/NavigationUtil'
import BackPressComponent from '../common/BackPressComponent'
import FavoriteDao from '../expand/dao/FavoriteDao';
const TRENDING_URL = 'https://github.com/';
const THEME_COLOR = '#678'
type Props = {};
export default class DetailPage extends Component<Props> {
    constructor(props) {
        super(props)
        this.params = this.props.navigation.state.params;
        const { projectModel, flag } = this.params;
        this.favoriteDao = new FavoriteDao(flag);
        this.url = projectModel.item.html_url || TRENDING_URL + projectModel.item.fullName;
        const title = projectModel.item.fullName || projectModel.item.full_name;
        this.state = {
            title: title,
            url: this.url,
            canGoBack: false,
            isFavorite: projectModel.isFavorite
        }
        this.backPress = new BackPressComponent({ backPress: () => this.onBackPress() })
    }
    componentDidMount() {
        this.backPress.componentDidMount()
    }
    onFavoriteButtonClick() {
        const { projectModel, callback } = this.params;
        const isFavorite = projectModel.isFavorite = !projectModel.isFavorite;
        callback(isFavorite);//更新Item的收藏状态
        this.setState({
            isFavorite: isFavorite
        })
        let key = projectModel.item.fullName ? projectModel.item.fullName : projectModel.item.id.toString()
        if (projectModel.isFavorite) {
            this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel.item))
        } else {
            this.favoriteDao.removeFavoriteItem(key)
        }
    }
    renderRightButton() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    onPress={() => { this.onFavoriteButtonClick() }}
                >
                    <FontAwesome
                        name={this.state.isFavorite ? 'star' : 'star-o'}
                        size={20}
                        style={{ color: 'white', marginRight: 10 }}
                    />
                </TouchableOpacity>
                {
                    ViewUtil.getShareButton(() => { })
                }
            </View>
        )
    }
    onBackPress() {
        this.onBack()
        return true;
    }
    onBack() {
        if (this.state.canGoBack) {
            this.webView.goBack()
        } else {
            NavigationUtil.goBack(this.props)
        }
    }
    onNavigationStateChange(navState) {
        this.setState({
            canGoBack: navState.canGoBack,
            url: navState.url
        })
    }
    componentWillUnmount() {
        this.backPress.componentWillUnmount()
    }
    render() {
        const titleLayoutStyle = this.state.title.length > 20 ? { paddingRight: 30 } : null
        let navigationBar = <NavigationBar
            titleLayoutStyle={titleLayoutStyle}
            leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
            rightButton={this.renderRightButton()}
            style={{ backgroundColor: THEME_COLOR }}
            title={this.state.title}
        />
        console.log(this.props.navigation, 'navigation')
        return (
            <View style={styles.container}>
                {navigationBar}
                <WebView
                    ref={webView => this.webView = webView}
                    startInLoadingState={true}
                    onNavigationStateChange={e => this.onNavigationStateChange(e)}
                    source={{ uri: this.state.url }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
