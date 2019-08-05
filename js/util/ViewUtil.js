import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons'
export default class ViewUtil {
    /** 
     * 获取设置页的Item
     * @param callback 单机item的回调
     * @param text 显示的文本
     * @param color 图标着色
     * @param Icons react-native-vector-icons组件
     * @param icon 左侧图标
     * @param expandableIcon
     * @return {XML}
    */
    static getSettingItem(callback, text, color, Icons, icon, expandableIcon) {
        return (
            <TouchableOpacity
                onPress={callback}
                style={styles.setting_item_container}
            >
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    {
                        Icons && icon ? <Icons
                            name={icon}
                            size={16}
                            style={{ color: color, marginRight: 10 }}
                        /> : <View style={{ opacity: 1, width: 16, height: 16, marginRight: 10 }}></View>
                    }
                    <Text>{text}</Text>
                </View>
                <Ionicons
                    name={expandableIcon ? expandableIcon : 'ios-arrow-forward'}
                    size={16}
                    style={{
                        marginRight: 10,
                        color: color || 'black',
                        alignSelf: 'center',
                    }}
                />
            </TouchableOpacity>
        )
    }
    static getMenuItem(callback, menu, color, expandableIcon) {
        return ViewUtil.getSettingItem(callback, menu.name, color, menu.Icons, menu.icon, expandableIcon)
    }
    static getLeftBackButton(callback) {
        return <TouchableOpacity
            style={{ padding: 8, paddingLeft: 12 }}
            onPress={callback}
        >
            <Ionicons
                name={'ios-arrow-back'}
                size={26}
                style={{ color: 'white' }}
            />
        </TouchableOpacity>
    }
    /**
     * 获取右侧文字按钮
     * title
     * callback
     */
    static getRightButton(title, callback) {
        return (
            <TouchableOpacity
                style={{ alignItems: "center" }}
                onPress={() => { callback() }}
            >
                <Text style={{ fontSize: 20, color: '#fff', marginRight: 10 }}>{title}</Text>
            </TouchableOpacity>
        )
    }
    static getShareButton(callback) {
        return (
            <TouchableOpacity
                underlayColor={'transparent'}
                onPress={callback}
            >
                <Ionicons
                    name={'md-share'}
                    size={20}
                    style={{ opacity: 0.9, marginRight: 10, color: 'white' }}
                />
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    setting_item_container: {
        backgroundColor: 'white',
        padding: 10,
        height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    }
})