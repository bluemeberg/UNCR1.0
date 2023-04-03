import {FeedInfo} from '../../@types/test/TestFeedInfo';
import {
  CREATE_FEED_SUCCESS,
  FAVORITE_FEED_SUCCESS,
  GET_FEED_LIST_SUCCESS,
  TypeFeedListActions,
} from '../../actions/test/feedList';

export type TypeFeedListReducer = {
  list: FeedInfo[];
};

const defaultFeedListState: TypeFeedListReducer = {
  list: [],
};

export const feedListReducer = (
  state: TypeFeedListReducer = defaultFeedListState,
  action: TypeFeedListActions,
) => {
  switch (action.type) {
    case GET_FEED_LIST_SUCCESS:
      return {
        ...state,
        list: action.list,
      };
    case CREATE_FEED_SUCCESS:
      return {
        ...state,
        list: state.list.concat([action.list]),
      };
    case FAVORITE_FEED_SUCCESS:
      return {
        ...state,
        list: state.list.map(item => {
          if (item.id == action.feedId) {
            return {
              ...item,
              likeHistory:
                action.action === 'add'
                  ? item.likeHistory.concat([action.myId])
                  : item.likeHistory.filter(item => item !== action.myId),
            };
          }
          return {...item};
        }),
      };
  }
  return {
    ...state,
  };
};
