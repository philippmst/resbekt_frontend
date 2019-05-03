import * as actionTypes from '../actions/actionTypes';

const initialState = {
  config: {
    headers: {
      'Content-Type': 'application/json', 
      'Authorization': 'Token ',
      'Event': null,
    }
  },
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  isLoading: true,
  user: {
    groups: [],
  },
  errors: {},
  event: null
};
  

  
export default function auth(state=initialState, action) {

  switch (action.type) {
    
    case actionTypes.AUTH_USER_LOADING:
    return {...state, isLoading: true};
    
    case actionTypes.AUTH_USER_LOADED:
    return {...state, isAuthenticated: true, isLoading: false, user: action.user, errors: null};

   

    case actionTypes.AUTH_LOGIN_SUCCESSFUL:
    return {...state, user: action.data.user, token: action.data.token, isAuthenticated: true, isLoading: false, errors: null};
    
    case actionTypes.AUTH_LOGOUT_SUCCESSFUL:
    return {...state, errors: action.data, token: null, user: null, //event: null,
      isAuthenticated: false,
      isLoading: false, config: { headers: {'Content-Type': 'application/json', 'Authorization': 'Token ', 'Event': null, } }, };
      


    default:
      return state;
  }
}

