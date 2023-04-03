import {MainFeedInfo} from '../@types/MainFeedInfo';
import {GET_AGENT_ACCOUNT_FEED_LIST_SUCCESS} from '../actions/agentAccount';
import {TypeAgentFeedListActions} from '../actions/agentFeed';

export type TypeAgentFeedReducer = {
  list: MainFeedInfo[];
};

const initialState: TypeAgentFeedReducer = {
  list: [],
};

export const agentFeedListReducer = (
  state: TypeAgentFeedReducer = initialState,
  action: TypeAgentFeedListActions,
) => {
  switch (action.type) {
    case GET_AGENT_ACCOUNT_FEED_LIST_SUCCESS:
      return {
        ...state,
        list: action.list,
      };
  }
  return {
    ...state,
  };
};
