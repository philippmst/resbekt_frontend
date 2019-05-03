import { takeEvery, put, select } from 'redux-saga/effects';
import * as actionTypes from '../actions/actionTypes';

import * as auth from './auth';
import * as base from './base';


export const getToken = state => state.auth.userToken;

export function* watchAuth() {

    yield takeEvery(actionTypes.BASE_LOAD_KGS, base.loadKG);

    /*
    yield takeEvery(actionTypes.AUTH_LOAD_USER, auth.loadUser);
    yield takeEvery(actionTypes.AUTH_LOGIN_USER, auth.login);
    yield takeEvery(actionTypes.AUTH_LOGOUT_USER, auth.logout);
*/


}


