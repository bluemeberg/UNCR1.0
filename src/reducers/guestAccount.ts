import {GuestAccountInfo} from '../@types/GuestAccountInfo';
import {MainFeedInfo} from '../@types/MainFeedInfo';

import {
  SET_GUEST_ACCOUNT_INFO,
  TypeGuestAccountInfoActions,
} from '../actions/guestAccount';

export type TypeGuestAccountReducer = {
  guestInfo: GuestAccountInfo | null;
  guestFeedList: MainFeedInfo[];
};

const defaultGuestAccountInfoState: TypeGuestAccountReducer = {
  guestInfo: null,
  guestFeedList: [],
};

export const guestInfoReducer = (
  state: TypeGuestAccountReducer = defaultGuestAccountInfoState,
  action: TypeGuestAccountInfoActions,
) => {
  switch (action.type) {
    case SET_GUEST_ACCOUNT_INFO: {
      return {
        ...state,
        guestInfo: action.guest,
      };
    }
  }
  return {
    ...state,
  };
};
