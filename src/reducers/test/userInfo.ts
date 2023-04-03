import {FeedInfo} from '../../@types/test/TestFeedInfo';
import {UserInfo} from '../../@types/test/TestUserInfo';
import {SET_USER_INFO} from '../../actions/test/user';
import {
  GET_MY_FEED_LIST_SUCCESS,
  TypeUserInfoActions,
} from '../../actions/test/userFeed';

export type TypeUserInfoReducer = {
  userInfo: UserInfo | null;
  myFeedList: FeedInfo[];
};

const defaultUserInfoState: TypeUserInfoReducer = {
  userInfo: null, 
  myFeedList: [],
};

export const userInfoReducer = (
  state: TypeUserInfoReducer = defaultUserInfoState,
  action: TypeUserInfoActions,
) => {
  switch (action.type) {
    case SET_USER_INFO: {
      return {
        ...state,
        userInfo: action.useId,
      };
    }
    case GET_MY_FEED_LIST_SUCCESS: {
      return {
        ...state,
        myFeedList: action.list,
      };
    }
  }
  return {
    ...state,
  };
};
