import {
    createStackNavigator,
    createMaterialTopTabNavigator,
    createBottomTabNavigator,
    createSwitchNavigator
} from 'react-navigation';
import WelcomePage from '../page/WelcomePage';
import HomePage from '../page/HomePage';
import DetailPage from '../page/DetailPage';
const InitNavigator = createStackNavigator({
    WelcomePage: {
        screen: WelcomePage,
        navigationOptions: {
            header: null,// 可以通过将header设为null 来禁用stackNavigator的navigation Bar
        }
    }
})

const MainNavigator = createStackNavigator({
    HomePage: {
        screen: HomePage,
        navigationOptions: {
            header: null,
        },

    },
    DetailPage: {
        screen: DetailPage,
        navigationOptions: {
            // header: null,
        }
    }
})

export default createSwitchNavigator({
    Init: InitNavigator,
    Main: MainNavigator,

}, {
        navigationOptions: {
            header: null,// 可以通过将header设为null 来禁用stackNavigator的navigation Bar
        }
    })