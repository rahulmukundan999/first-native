import { ADD_FRIEND } from './Types';

export const addFriend = friendIndex => (
    {
        type: ADD_FRIEND,
        payload: friendIndex,
    }
);