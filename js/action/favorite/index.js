import Types from '../types';
import FavoriteDao from '../../expand/dao/FavoriteDao';
import ProjectModel from '../../model/ProjectModel';
import types from '../types';
/**
 * @description: 获取最热数据的异步action
 * @param storeName
 * @param url
 * @param pageSize
 * @param favoriteDao
 * @return: 
 */
export function onLoadFavoriteData(flag, isShowLoading) {
    return dispatch => {
        if (isShowLoading) {
            dispatch({
                type: Types.FAVORITE_LOAD_DATA,
                storeName: flag
            });
        }

        new FavoriteDao(flag).getAllItems().then(items => {
            let resultData = [];
            for (let i = 0, len = items.length; i < len; i++) {
                resultData.push(new ProjectModel(items[i], true))
            }
            dispatch({ type: types.FAVORITE_LOAD_SUCCESS, projectModels: resultData, storeName: flag })
        }).catch(e => {
            console.log(e);
            dispatch({ type: Types.FAVORITE_LOAD_FAIL, error: e, storeName: flag })
        })
    }
}
