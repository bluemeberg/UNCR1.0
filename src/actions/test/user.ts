import {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {TypeDog} from '../../data/test/TypeDog';
import {TypeUser} from '../../data/test/TypeUser';
import {TypeRootReducer} from '../../store';
import database from '@react-native-firebase/database';
export const SET_USER_INFO = 'SET_USER_INFO' as const;

export const GET_USER_LIKED_HISTORY_REQUEST =
  'GET_USER_LIKED_HISTORY_REQUEST' as const;
export const GET_USER_LIKED_HISTORY_SUCCESS =
  'GET_USER_LIKED_HISTORY_SUCCESS' as const;
export const GET_USER_LIKED_HISTORY_FAILURE =
  'GET_USER_LIKED_HISTORY_FAILURE' as const;

export const setUser = (user: TypeUser) => {
  return {
    type: SET_USER_INFO,
    user: user,
  };
};
export const getUserLikedHistoryRequest = () => {
  return {
    type: GET_USER_LIKED_HISTORY_REQUEST,
  };
};

export const getUserLikedHistorySuccess = (history: TypeDog[]) => {
  return {
    type: GET_USER_LIKED_HISTORY_SUCCESS,
    history: history,
  };
};

export const getUserLikedHistoryFailure = () => {
  return {
    type: GET_USER_LIKED_HISTORY_FAILURE,
  };
};

export const getUserLikedHistory =
  (): TypeUserThunkAction => async (dispatch, getState) => {
    dispatch(getUserLikedHistoryRequest());
    const user = getState().user.user;

    if (user === null) {
      dispatch(getUserLikedHistoryFailure());
      return;
    }
    const ref = `history/${user.uid}`;
    console.log('ref hello', ref);
    const currentHistory = await database()
      .ref(ref)
      .once('value')
      .then(snapshot => snapshot.val());
    console.log('current Hiostyr', currentHistory);
    const doglist = Object.keys(currentHistory).map(key => {
      const item = currentHistory[key];
      console.log('item', item);
      return {
        photoUrl: item.url,
      } as TypeDog;
    });

    dispatch(getUserLikedHistorySuccess(doglist));
  };

// rootreducer를 통한 thunk action 선언
export type TypeUserThunkAction = ThunkAction<
  void,
  TypeRootReducer,
  undefined,
  UserAction
>;

export type TypeUserDispatch = ThunkDispatch<
  TypeRootReducer,
  undefined,
  UserAction
>;

export type UserAction =
  | ReturnType<typeof setUser>
  | ReturnType<typeof getUserLikedHistoryRequest>
  | ReturnType<typeof getUserLikedHistorySuccess>
  | ReturnType<typeof getUserLikedHistoryFailure>;
