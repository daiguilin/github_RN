
import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import NavigationUtil from '../navigator/NavigationUtil'
import BackPressComponent from '../common/BackPressComponent'
const THEME_COLOR = '#678'
type Props = {};
export default class WebViewPage extends Component<Props> {
    constructor(props) {
        super(props)
        this.params = this.props.navigation.state.params;

        const { title, url } = this.params;
        this.state = {
            title: title,
            url: url,
            canGoBack: false,
        }
        this.backPress = new BackPressComponent({ backPress: () => this.onBackPress() })
    }
    componentDidMount() {
        this.backPress.componentDidMount()
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
        let navigationBar = <NavigationBar
            leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
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
