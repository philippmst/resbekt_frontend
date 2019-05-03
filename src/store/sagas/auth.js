import { delay } from 'redux-saga';
import { put } from 'redux-saga/effects';
import axios from 'axios';
import store from '../../store';

import * as actions from '../actions/auth';
import { BASE_URL } from '../../common/constants';


/*

export function* loadUser() {
  let auth = yield store.getState().auth;
  console.log(auth);
  let config = {
    headers: {
      "Content-Type": "application/json",
    }
  }
  if (auth.token) {
    config.headers["Authorization"] = 'Token '+auth.token;
  }
  
  yield put(actions.logout_successful());
  yield put(actions.user_loading());
    
  try {
    const res = yield axios.get(BASE_URL + "auth/user/", config);
    if (res.status === 200) {
      yield put(actions.set_token(auth.token));
      yield put(actions.setEvent(auth.event))
      yield put(actions.user_loaded(res.data));
      
    } else if (res.status === 403 || res.status === 401) {
      yield put(actions.authentication_error(res.data))
      
    }
  } catch (err) {
    yield put(actions.logout_successful()); 
  }
}

        
  export function* login({username, password}) {
    let authData = {username: username, password: password}
    let authUrl = BASE_URL + 'auth/login/';

    try {
      const res = yield axios.post(authUrl, authData);
      if (res.status === 200) {
        console.log("status: "+ res.status)
        yield put(actions.set_token(res.data.token));
        yield put(actions.login_successful(res.data));

      } else if (res.status === 403 || res.status === 401) {
        yield put(actions.authentication_error(res.data))
      }
    } catch (err) {
      yield put(actions.logout_successful()); 
    }
  }





  export function* logout() {
    let config = yield store.getState().auth.config;
    
    let url = BASE_URL+"auth/logout/"
    const res = yield axios.post(url, {}, config );
    if (res.status === 204) {
      yield put(actions.logout_successful());
    } else if (res.status === 403 || res.status === 401) {
      yield put(actions.authentication_error(res.data))
    }
  }

  */