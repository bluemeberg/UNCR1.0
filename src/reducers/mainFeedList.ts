import {MainFeedInfo} from '../@types/MainFeedInfo';
import {
  CREATE_AGENT_ACCOUNT_FEED_SUCCESS,
  FAVORITE_AGENT_FEED_SUCCESS,
  GET_MAIN_FEED_LIST_SUCCESS,
  TypeMainFeedListActions,
} from '../actions/mainFeed';

export type TypeMainFeedReducer = {
  list: MainFeedInfo[];
};

const initialState: TypeMainFeedReducer = {
  list: [],
};

export const mainFeedListReducer = (
  state: TypeMainFeedReducer = initialState,
  action: TypeMainFeedListActions,
) => {
  switch (action.type) {
    case GET_MAIN_FEED_LIST_SUCCESS:
      return {
        ...state,
        list: action.list,
      };
    case CREATE_AGENT_ACCOUNT_FEED_SUCCESS:
      state.list.unshift(action.item);
      // console.log(state.list);
      return {
        ...state,
        // list: state.list.concat([action.item]),
        list: state.list,
      };
    // case FAVORITE_AGENT_FEED_SUCCESS:
    //   return {
    //     ...state,
    //     list: state.list.map((item) => {
    //       if (item.id == action.feedID) {
    //         return {
    //           ...item,
    //           likeHistory;
    //         }
    //       }
    //     })
    //   }
  }
  return {
    ...state,
  };
};
