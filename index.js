/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { createAppContainer } from 'react-navigation';
import App from './App';
import AppNavigator from './js/navigator/AppNavigator'
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => createAppContainer(AppNavigator));
