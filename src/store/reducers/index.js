import { combineReducers } from 'redux';
import authReducer from './auth';
import baseReducer from './base';

const rootReducer = combineReducers({
    base: baseReducer,
    auth: authReducer,
});


export default rootReducer;