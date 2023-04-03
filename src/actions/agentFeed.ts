import {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {MainFeedInfo} from '../@types/MainFeedInfo';
import {UncrRootReducer} from '../uncrStore';
import {createAxiosServerInstance} from '../utils/AxiosUtils';
import {
  GET_AGENT_ACCOUNT_FEED_LIST_FAILURE,
  GET_AGENT_ACCOUNT_FEED_LIST_REQEUST,
  GET_AGENT_ACCOUNT_FEED_LIST_SUCCESS,
} from './agentAccount';

export const GET_AGNET_FEED_LIST_REQEUST =
  'GET_AGNET_FEED_LIST_REQEUST' as const;
export const GET_AGENT_FEED_LIST_SUCCESS =
  'GET_MAIN_FEED_LIST_SUCCESS' as const;

export const GET_AGNET_FEED_LIST_FAILURE = '';
'GET_AGNET_FEED_LIST_REQEUST' as const;

export const getAgentFeedRequest = () => {
  return {
    type: GET_AGENT_ACCOUNT_FEED_LIST_REQEUST,
  };
};

export const getAgentFeedSuccess = (list: MainFeedInfo[]) => {
  return {
    type: GET_AGENT_ACCOUNT_FEED_LIST_SUCCESS,
    list,
  };
};

export const getAgentFeedFailure = () => {
  return {
    type: GET_AGENT_ACCOUNT_FEED_LIST_FAILURE,
  };
};

export const getAgentFeedList =
  (agentId: string): TypeAgentFeedListThunkAction =>
  async dispatch => {
    dispatch(getAgentFeedRequest());
    try {
      const result = await createAxiosServerInstance().get('/mypage/get', {
        params: {
          agentID: agentId,
        },
      });
      dispatch(getAgentFeedSuccess(result.data));
    } catch (error) {
      console.log(error);
    }
  };

export type TypeAgentFeedListDispatch = ThunkDispatch<
  UncrRootReducer,
  undefined,
  TypeAgentFeedListActions
>;

export type TypeAgentFeedListThunkAction = ThunkAction<
  void,
  UncrRootReducer,
  undefined,
  TypeAgentFeedListActions
>;

export type TypeAgentFeedListActions =
  | ReturnType<typeof getAgentFeedSuccess>
  | ReturnType<typeof getAgentFeedRequest>
  | ReturnType<typeof getAgentFeedFailure>;
