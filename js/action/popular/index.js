import Types from '../types';
import DataStore from '../../expand/dao/DataStore';
import { _projectModels, handleData } from '../ActionUtil'
/**
 * @description: 获取最热数据的异步action
 * @param storeName
 * @param url
 * @return: 
 */
export function onRefreshPopular(storeName, url, pageSize) {
    return dispatch => {
        dispatch({
            type: Types.POPULAR_REFRESH,
            storeName: storeName
        });
        let dataStore = new DataStore();
        dataStore.fetchData(url, "popular")//异步action与数据流
            .then(data => {
                handleData(Types.POPULAR_REFRESH_SUCCESS, dispatch, storeName, data, pageSize)
            }).catch(error => {
                dispatch({
                    type: Types.POPULAR_REFRESH_FAIL,
                    storeName,
                    error
                })
            })

    }
}
/**
 * @description: 上拉加载更多
 * @param storeName
 * @param pageIndex 第几页
 * @param pageSize 每页展示条数
 * @param dataArray 原始数据
 * @param callBack 回调函数，可以通过回调函数来向调用页面通信：比如异常信息的展示，没有更多等待
 * @param favoriteDao
 * @returns {function(*)} 
 */
export function onLoadMorePopular(storeName, pageIndex, pageSize, dataArray = [], callBack) {
    return dispatch => {
        setTimeout(() => {
            if ((pageIndex - 1) * pageSize >= dataArray.length) {
                if (typeof callBack === 'function') {
                    callBack('no more')
                }
                dispatch({
                    type: Types.POPULAR_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName: storeName,
                    pageIndex: --pageIndex
                })

            } else {
                let max = pageIndex * pageSize > dataArray.length ? dataArray.length : pageIndex * pageSize
                _projectModels(dataArray.slice(0, max), data => {
                    dispatch({
                        type: Types.POPULAR_LOAD_MORE_SUCCESS,
                        storeName: storeName,
                        pageIndex: pageIndex,
                        projectModels: data
                    })
                })
            }
        }, 1000)
    }
}