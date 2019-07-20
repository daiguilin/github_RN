import AsyncStorage from '@react-native-community/async-storage';
const FAVORITE_KEY_PREFIX = 'favorite_';
export default class FavoriteDao {
    constructor(flag) {
        this.favoriteKey = FAVORITE_KEY_PREFIX + flag;
    }
    /**
     * @description:收藏项目，保存收藏的项目 
     * @param {key,value,callback} 项目id，收藏的项目，callback 
     * @return: 
     */
    saveFavoriteItem(key, value, callback) {
        console.log(key, value, 'test')
        AsyncStorage.setItem(key, value, (error, result) => {
            if (!error) {//更新favorite的key
                this.updateFavoriteKeys(key, true)
            }
        })
    }
    /**
     * @description: 更新Favorite key集合
     * @param key
     * @param isAdd true 添加 false 删除
     * @return: 
     */
    updateFavoriteKeys(key, isAdd) {
        AsyncStorage.getItem(this.favoriteKey, (error, result) => {
            if (!error) {
                let favoriteKeys = [];
                if (result) {
                    favoriteKeys = JSON.parse(result);
                }
                let index = favoriteKeys.indexOf(key);
                if (isAdd) { //如果是添加且key不在存在则添加到数组中去
                    if (index === -1) {
                        favoriteKeys.push(key)
                    }
                } else { //如果是删除且key存在则将其从数值中移除
                    if (index !== -1) {
                        favoriteKeys.splice(index, 1)
                    }
                }
                AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys))
            }
        })
    }
    /**
     * @description: 获取收藏的Repository对应的key
     * @param {} 
     * @return: Promise
     */
    getFavoriteKeys() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.favoriteKey, (error, result) => {
                if (!error) {
                    try {
                        resolve(JSON.parse(result))
                    } catch{
                        reject(error)
                    }
                } else {
                    reject(error)
                }
            })
        })
    }
    /**
     * @description: 取消收藏，移除已经收藏的项目
     * @param key 项目 id 
     * @return: 
     */
    removeFavoriteItem(key) {
        AsyncStorage.removeItem(key, (error, result) => {
            if (!error) {
                this.updateFavoriteKeys(key, false);
            }
        })
    }
    /**
     * @description: 获取所有收藏的项目
     * @param {type} 
     * @return: Promise
     */
    getAllItems() {
        return new Promise((resolve, reject) => {
            this.getFavoriteKeys().then((keys) => {
                let items = [];
                if (keys) {
                    AsyncStorage.multiGet(keys, (err, stores) => {
                        try {
                            stores.map((result, i, stores) => {
                                let value = stores[i][1]
                                if (value) items.push(JSON.parse(value));
                            })
                            resolve(items);
                        } catch (e) {
                            reject(e)
                        }
                    })
                } else {
                    resolve(items)
                }
            }).catch((e) => {
                reject(e)
            })
        })
    }
}