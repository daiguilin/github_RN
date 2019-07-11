
import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import NavigationUtil from '../navigator/NavigationUtil'
const TRENDING_URL = 'https://github.com';
const THEME_COLOR = '#678'
type Props = {};
export default class DetailPage extends Component<Props> {
    constructor(props) {
        super(props)
        this.params = this.props.navigation.state.params;
        const { projectModel } = this.params;
        this.url = projectModel.html_url || TRENDING_URL + projectModel.fullName;
        const title = projectModel.fullName || projectModel.full_name;
        this.state = {
            title: title,
            url: this.url,
            canGoBack: false
        }
    }
    renderRightButton() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    onPress={() => { }}
                >
                    <FontAwesome
                        name={'star-o'}
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
