import {GoogleUser} from '../@types/GoogleUser';
import {
  SET_GOOGLE_USER_INFO,
  TypeGoogleUserInfoActions,
} from '../actions/googleUser';

export type TypeGoogleUserReducer = {
  google: GoogleUser | null;
};

const defaultGoogleUserState: TypeGoogleUserReducer = {
  google: null,
};

export const googleUserReducer = (
  state: TypeGoogleUserReducer = defaultGoogleUserState,
  action: TypeGoogleUserInfoActions,
) => {
  switch (action.type) {
    case SET_GOOGLE_USER_INFO: {
      return {
        ...state,
        google: action.google,
      };
    }
  }
  return {
    ...state,
  };
};
