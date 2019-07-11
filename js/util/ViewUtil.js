import React from 'react';
import { TouchableOpacity } from "react-native";
import IonIcons from 'react-native-vector-icons/Ionicons'
export default class ViewUtil {
    static getLeftBackButton(callback) {
        return <TouchableOpacity
            style={{ padding: 8, paddingLeft: 12 }}
            onPress={callback}
        >
            <IonIcons
                name={'ios-arrow-back'}
                size={26}
                style={{ color: 'white' }}
            />
        </TouchableOpacity>
    }
    static getShareButton(callback) {
        return (
            <TouchableOpacity
                underlayColor={'transparent'}
                onPress={callback}
            >
                <IonIcons
                    name={'md-share'}
                    size={20}
                    style={{ opacity: 0.9, marginRight: 10, color: 'white' }}
                />
            </TouchableOpacity>
        )
    }
}