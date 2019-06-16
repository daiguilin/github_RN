
/**
 * 全局导航控制类
 * */
export default class NavigationUtil {
    /**
     * @description: 跳转到指定页面
     * @param {params,page} 
     * @return: 
     */
    static goPage(params, page) {
        const navigation = NavigationUtil.navigation;
        console.log(navigation, 'NavigationUtil.navigation')
        if (!navigation) {
            console.log("NavigationUtil.navigation can not be null")
            return;
        }
        navigation.navigate(
            page,
            {
                ...params
            }
        );
    }
    /**
     * @description: 返回上一页
     * @param navigation
     * @return: 
     */
    static goBack(params) {
        const { navigation } = params;
        navigation.goBack();
    }
    /**
     * @description:返回主页
     * @param  navigation
     * @return: 
     */
    static resetToHomePage(params) {
        const { navigation } = params;
        navigation.navigate("Main");
    }
}