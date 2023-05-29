import AsyncStorage from '@react-native-async-storage/async-storage';
import {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {AgentAccountInfo} from '../@types/AgentAccountInfo';
import {MainFeedInfo} from '../@types/MainFeedInfo';
import {UncrRootReducer} from '../uncrStore';
import {
  createAxiosServerInstance,
  createAxiosYoutubeDataAPIInstance,
  youtubeGeneralAPI,
} from '../utils/AxiosUtils';
import {sleep} from '../utils/sleep';
import {TypeMainFeedListActions} from './mainFeed';

export const SET_AGENT_ACCOUNT_INFO = 'SET_AGENT_ACCOUNT_INFO' as const;

export const GET_AGENT_ACCOUNT_FEED_LIST_REQEUST =
  'GET_AGENT_ACCOUNT_FEED_LIST_REQEUST' as const;
export const GET_AGENT_ACCOUNT_FEED_LIST_SUCCESS =
  'GET_AGENT_ACCOUNT_FEED_LIST_SUCCESS' as const;
export const GET_AGENT_ACCOUNT_FEED_LIST_FAILURE =
  'GET_AGENT_ACCOUNT_FEED_LIST_FAILURE' as const;

export const setAgentAccountInfo = (account: AgentAccountInfo) => {
  return {
    type: SET_AGENT_ACCOUNT_INFO,
    account,
  };
};

export const getAgentAccountFeedListRequest = () => {
  return {
    type: GET_AGENT_ACCOUNT_FEED_LIST_REQEUST,
  };
};

export const getAgentAccountFeedListSuccess = (list: MainFeedInfo[]) => {
  return {
    type: GET_AGENT_ACCOUNT_FEED_LIST_SUCCESS,
    list,
  };
};

export const getAgentAccountFeedListFailure = () => {
  return {
    type: GET_AGENT_ACCOUNT_FEED_LIST_FAILURE,
  };
};

export const getAccountFeedList =
  (agentId: string, myId: string): TypeAgentAccountThunkAction =>
  async dispatch => {
    dispatch(getAgentAccountFeedListRequest());
    await sleep(500);
    try {
      const result = await createAxiosServerInstance().get('/agent/get', {
        params: {
          agentID: agentId,
          myAgentID: myId,
        },
      });
      result.data.boardVOS
        .sort((a: any, b: any) => a.boardID - b.boardID)
        .reverse();
      // console.log(result.data.boardVOS);
      for (let i = 0; i < result.data.boardVOS.length; i++) {
        //   console.log(result.data.boardVOS[i].videoID);
        const videoResult = await createAxiosYoutubeDataAPIInstance().get(
          '/videos',
          {
            params: {
              part: 'snippet',
              key: youtubeGeneralAPI,
              id: result.data.boardVOS[i].videoID,
            },
          },
        );
        result.data.boardVOS[i] = Object.assign(result.data.boardVOS[i], {
          videoThumbnail:
            videoResult.data.items[0].snippet.thumbnails.medium.url,
        });
        //   console.log(a);
      }
      console.log('result', result.data.boardVOS);
      dispatch(getAgentAccountFeedListSuccess(result.data));
    } catch (error) {
      console.log(error);
    }
  };

export const connectAgentAccount =
  (
    walletAddress: string | null,
    agentNumber: number,
    agentName: string | null,
  ): TypeAgentAccountThunkAction =>
  async dispatch => {
    // await sleep(1000);
    const agent = [
      {walletAddress: walletAddress},
      {agentNumber: agentNumber.toString()},
      {agentName: agentName},
    ];
    // keep in login
    AsyncStorage.setItem('agentInfo', JSON.stringify(agent));
    dispatch(
      setAgentAccountInfo({
        walletAddress: walletAddress,
        agentNumber: agentNumber,
        agentName: agentName,
      }),
    );
    await sleep(1000);
  };

export type TypeAgentAccountDispatch = ThunkDispatch<
  UncrRootReducer,
  undefined,
  TypeAgentAccountInfoActions
>;

export type TypeAgentAccountThunkAction = ThunkAction<
  Promise<void>,
  UncrRootReducer,
  undefined,
  TypeAgentAccountInfoActions
>;

export type TypeAgentAccountInfoActions =
  | ReturnType<typeof setAgentAccountInfo>
  | ReturnType<typeof getAgentAccountFeedListRequest>
  | ReturnType<typeof getAgentAccountFeedListFailure>
  | ReturnType<typeof getAgentAccountFeedListSuccess>;
