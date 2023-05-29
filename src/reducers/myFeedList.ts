import {MainFeedInfo} from '../@types/MainFeedInfo';
import {
  GET_MY_ACCOUNT_FEED_LIST_SUCCESS,
  TypeMyAccountActions,
} from '../actions/myFeed';

export type TypeMyFeedReducer = {
  myFeedList: MainFeedInfo[];
};

const defaultMyFeedState: TypeMyFeedReducer = {
  myFeedList: [],
};

export const myFeedReducer = (
  state: TypeMyFeedReducer = defaultMyFeedState,
  action: TypeMyAccountActions,
) => {
  switch (action.type) {
    case GET_MY_ACCOUNT_FEED_LIST_SUCCESS:
      return {
        ...state,
        myFeedList: action.list,
      };
  }
  return {
    ...state,
  };
};
