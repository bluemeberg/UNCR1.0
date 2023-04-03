import {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {GuestAccountInfo} from '../@types/GuestAccountInfo';
import {UncrRootReducer} from '../uncrStore';
import {sleep} from '../utils/sleep';

export const SET_GUEST_ACCOUNT_INFO = 'SET_GUEST_ACCOUNT_INFO' as const;

export const setGuesAccountInfo = (guest: GuestAccountInfo) => {
  return {
    type: SET_GUEST_ACCOUNT_INFO,
    guest,
  };
};

export const connectGuestAccount =
  (walletAddress: string, guestID: number): TypeGuestThunkAction =>
  async dispatch => {
    await sleep(1000);
    dispatch(
      setGuesAccountInfo({
        walletAddress: walletAddress,
        guestNumber: guestID,
      }),
    );
  };

export type TypeGuestDispatch = ThunkDispatch<
  UncrRootReducer,
  undefined,
  TypeGuestAccountInfoActions
>;

export type TypeGuestThunkAction = ThunkAction<
  Promise<void>,
  UncrRootReducer,
  undefined,
  TypeGuestAccountInfoActions
>;
export type TypeGuestAccountInfoActions = ReturnType<typeof setGuesAccountInfo>;
