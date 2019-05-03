import * as constants from '../common/constants';

export const loadStateFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem(constants.LOCAL_STORAGE_NAME);
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.log(err);
        return undefined;
    }
}

const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(constants.LOCAL_STORAGE_NAME, serializedState);
    } catch (err) {
        // console.log(err);
    }
}

export const saveToLocalStorageMiddleware = store => next => action => {
    let result = next(action);
    saveState(store.getState())
    return result;
}
