import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';




const initialState = {
    title: 'Dashboard',
    progress: false,
    kgs: [], 
    kfsAlive: true,
}



const reducer = ( state = initialState, action) => {
    switch ( action.type ) {
        case actionTypes.BASE_SET_KGS: return updateObject(state, { kgs: action.data});
        case actionTypes.BASE_SET_RES_TYPE: return updateObject(state, { resType: action.resType });
        case actionTypes.BASE_SET_PROGRESS: return updateObject( state, { value: {...action.value} } );
        case actionTypes.BASE_CHECK_KFS_ALIVE:
            let kfs = true;
            console.log("action.response.headers.kfs");
            console.log(action.response.headers.kfs)
            if (action.response.headers.kfs === "False") {
                kfs = false
            }
            return updateObject( state, { kfsAlive: kfs })

        default:
            return state;
    }
}

export default reducer;
