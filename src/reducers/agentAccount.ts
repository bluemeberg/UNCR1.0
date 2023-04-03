import {AgentAccountInfo} from '../@types/AgentAccountInfo';
import {MainFeedInfo} from '../@types/MainFeedInfo';
import {
  GET_AGENT_ACCOUNT_FEED_LIST_SUCCESS,
  SET_AGENT_ACCOUNT_INFO,
  TypeAgentAccountInfoActions,
} from '../actions/agentAccount';

export type TypeAgentAccountReducer = {
  accountInfo: AgentAccountInfo | null;
  accountFeedList: MainFeedInfo[];
};
// 유저가 좋아요한 hitory 저장
// 유저 작성한 포스팅 글
// 유저가 작성한 피드 댓글 history 저장

const defaultAgentAccountInfoState: TypeAgentAccountReducer = {
  accountInfo: null,
  accountFeedList: [],
};

export const accountInfoReducer = (
  state: TypeAgentAccountReducer = defaultAgentAccountInfoState,
  action: TypeAgentAccountInfoActions,
) => {
  switch (action.type) {
    case SET_AGENT_ACCOUNT_INFO:
      return {
        ...state,
        accountInfo: action.account,
      };
    case GET_AGENT_ACCOUNT_FEED_LIST_SUCCESS:
      return {
        ...state,
        agentAccountList: action.list,
      };
  }
  return {
    ...state,
  };
};
