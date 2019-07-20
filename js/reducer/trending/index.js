import Types from '../../action/types'
const defaultState = {};
/**
 * trending:{
 *      java:{
 *          items:[],
 *          isLoading:false     
 *      },
 *      ios:{
 *          items:[],
 *          isLoading:false     
 *      }
 * }
 * @description: 
 * @param {type} 
 * @return: 
 */
export default function onAction(state = defaultState, action) {
    switch (action.type) {
        case Types.TRENDING_REFRESH:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: true,
                    hideLoadingMore: true,
                }

            }
        case Types.TRENDING_REFRESH_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    items: action.items,
                    projectModels: action.projectModels,
                    isLoading: false,
                    hideLoadingMore: false,
                    pageIndex: action.pageIndex
                }

            }
        case Types.TRENDING_REFRESH_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false,
                }

            }
        case Types.TRENDING_LOAD_MORE_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModels: action.projectModels,
                    pageIndex: action.pageIndex,
                    hideLoadingMore: false
                }
            }
        case Types.TRENDING_LOAD_MORE_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    pageIndex: action.pageIndex,
                    hideLoadingMore: true
                }

            }
        case Types.TRENDING_FLUSH_FAVORITE:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModels: action.projectModels,
                }
            }
        default:
            return state;
    }
}
