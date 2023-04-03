import {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {GoogleUser} from '../@types/GoogleUser';
import {UncrRootReducer} from '../uncrStore';
import {sleep} from '../utils/sleep';

export const SET_GOOGLE_USER_INFO = 'SET_GOOGLE_USER_INFO' as const;

export const setGoogleUserInfo = (google: GoogleUser) => {
  return {
    type: SET_GOOGLE_USER_INFO,
    google,
  };
};

export const connectGoogleUser =
  (email: string, accessToken: string): TypeGoogleUserThunkAction =>
  async dispatch => {
    await sleep(1000);
    dispatch(
      setGoogleUserInfo({
        userEmail: email,
        accessToken: accessToken,
      }),
    );
  };

export type TypeGoogleUserDispatch = ThunkDispatch<
  UncrRootReducer,
  undefined,
  TypeGoogleUserInfoActions
>;

export type TypeGoogleUserThunkAction = ThunkAction<
  Promise<void>,
  UncrRootReducer,
  undefined,
  TypeGoogleUserInfoActions
>;

export type TypeGoogleUserInfoActions = ReturnType<typeof setGoogleUserInfo>;
