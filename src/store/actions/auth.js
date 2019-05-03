import store from '../../store';
import * as actionTypes from './actionTypes';


export const hasPermission = groupname => {
  let auth = store.getState().auth
  if (auth.user.groups.indexOf(groupname) > -1 ) { return true }
  if (auth.user.is_superuser) { return true }
  return false
}


export const loadUser  = () => ({ type: actionTypes.AUTH_LOAD_USER })
export const user_loading  = () => ({ type: actionTypes.AUTH_USER_LOADING })
export const user_loaded = (data) => ({ type: actionTypes.AUTH_USER_LOADED, user: data })
export const login = (username, password) => ({ type: actionTypes.AUTH_LOGIN_USER, username, password, })
export const logout  = () => ({ type: actionTypes.AUTH_LOGOUT_USER })

export const login_successful = (data) => ({ type: actionTypes.AUTH_LOGIN_SUCCESSFUL, data: data})


export const logout_successful = () => ({ type: actionTypes.AUTH_LOGOUT_SUCCESSFUL, data: {}})

