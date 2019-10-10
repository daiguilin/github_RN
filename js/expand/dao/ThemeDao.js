import AsyncStorage from '@react-native-community/async-storage';
import ThemeFactory, { ThemeFlags } from '../../res/style/ThemeFactory';

const THEME_KEY = 'theme_key';
export default class ThemeDao {
    /**
     * @description: 获取当前主题
     * @param {type} 
     * @return: {Promise<any> | Promise}
     */
    getTheme() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(THEME_KEY, (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!result) {
                    this.save(ThemeFlags.Default);
                    result = ThemeFlags.Default
                }
                resolve(ThemeFactory.createTheme(result));
            })
        })
    }
    /**
     * @description: 保存主题
     * @param {type} 
     * @return: 
     */
    save(themeFlag) {
        AsyncStorage.setItem(THEME_KEY, themeFlag, (error, result) => {

        })
    }
}