import { combineReducers } from 'redux';
import ItemDetails from 'components/pages/itemDetails/ItemDetails';

let INITIAL_STATE = {
    current: [],
    possible: [
        'Allie',
        'Gator',
        'Lizzie',
        'Reptar',
    ],
    items: []
};

const friendReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'ADD_FRIEND':
            console.log('post data', state, action);
            // console.log('addin friend', state, action)
            // Pulls current and possible out of previous state
            // We do not want to alter state directly in case
            // another action is altering it at the same time
            let {
                current,
                possible,
            } = state;
            console.log('adding data', current, possible);

            // Pull friend out of friends.possible
            // Note that action.payload === friendIndex
            if (!current) {
                current = []
            }
            const addedFriend = action.payload;

            // And put friend in friends.current
            current.push(addedFriend);

            // Finally, update our redux state
            const newState = { current, possible };
            console.log('new state', newState);
            return newState;

        case 'ADD_ITEM':
            console.log('state items', state, action);
            const { items } = INITIAL_STATE;
            items.push(action.payload);
            const newTemp = { items };
            return newTemp
        default:
            return state;
    }
};

export default combineReducers({
    friends: friendReducer,
});