import { ADD_FRIEND, ADD_ITEM } from './Types';

export const addFriend = friendIndex => (
    {
        type: ADD_FRIEND,
        payload: friendIndex,
    }
);

export const addItem = item => (
    {
        type: ADD_ITEM,
        payload: item
    }
)