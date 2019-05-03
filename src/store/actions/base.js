import * as actionTypes from './actionTypes';


export const loadKGs = () => ({ type: actionTypes.BASE_LOAD_KGS })
export const setKGs = (data) => ({ type: actionTypes.BASE_SET_KGS, data: data})
export const checkKFSAlive = response => ({ type: actionTypes.BASE_CHECK_KFS_ALIVE, response: response})
export const setResType = resType => ({ type: actionTypes.BASE_SET_RES_TYPE, resType: resType })





export const baseSetProgress = (value) => ({ type: actionTypes.BASE_SET_PROGRESS, value: value, })
export const updateKeyValue = (key, value) => ({ type: key, value: value })
