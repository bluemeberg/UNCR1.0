// 현재 보여지고 있는 강아지 사진을 보여주기 위한 reducer

import {UserAction} from '../../actions/test/user';
import {TypeDog} from '../../data/test/TypeDog';
import {TypeUser} from '../../data/test/TypeUser';

export type TypeUserReducer = {
  user: TypeUser | null;
  history: TypeDog[];
};

const initialState: TypeUserReducer = {
  user: null,
  history: [],
};

export const userReducer = (state = initialState, action: UserAction) => {
  if (action.type === 'SET_USER_INFO') {
    return {
      ...state,
      user: action.user,
    };
  }
  if (action.type === 'GET_USER_LIKED_HISTORY_SUCCESS') {
    return {
      ...state,
      history: action.history,
    };
  }
  return {
    ...state,
  };
};
