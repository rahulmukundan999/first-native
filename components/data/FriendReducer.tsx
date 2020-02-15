import { combineReducers } from 'redux';


const orderReducer = (state = {}, action) => {
    switch (action.type) {
        case 'ORDER_DETAILS':
            console.log('post data', state, action);
            // console.log('addin friend', state, action)
            // Pulls current and possible out of previous state
            // We do not want to alter state directly in case
            // another action is altering it at the same time
            state = action.payload;
            return state;

        case 'SHOW_ORDER':
            console.log('twetweytrrtuhjtyu');
            return state
        default:
            return state;
    }
};

export default combineReducers({
    order: orderReducer
});