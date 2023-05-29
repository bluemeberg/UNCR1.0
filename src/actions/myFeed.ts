import {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {MainFeedInfo} from '../@types/MainFeedInfo';
import {UncrRootReducer} from '../uncrStore';
import {
  createAxiosServerInstance,
  createAxiosYoutubeDataAPIInstance,
  youtubeGeneralAPI,
} from '../utils/AxiosUtils';
import {sleep} from '../utils/sleep';
import {getAgentAccountFeedListSuccess} from './agentAccount';

export const GET_MY_ACCOUNT_FEED_LIST_REQEUST =
  'GET_MY_ACCOUNT_FEED_LIST_REQEUST' as const;

export const GET_MY_ACCOUNT_FEED_LIST_SUCCESS =
  'GET_MY_ACCOUNT_FEED_LIST_SUCCESS' as const;

export const GET_MY_ACCOUNT_FEED_LIST_FAILURE =
  'GET_MY_ACCOUNT_FEED_LIST_FAILURE' as const;

export const getMyAccountFeedListRequest = () => {
  return {
    type: GET_MY_ACCOUNT_FEED_LIST_REQEUST,
  };
};

export const getMyAccountFeedListSuccess = (list: MainFeedInfo[]) => {
  return {
    type: GET_MY_ACCOUNT_FEED_LIST_SUCCESS,
    list,
  };
};

export const getMyAccountFeedListFailure = () => {
  return {
    type: GET_MY_ACCOUNT_FEED_LIST_FAILURE,
  };
};

export const getMyFeedList =
  (myId: string): TypeMyAccountThunkAction =>
  async dispatch => {
    dispatch(getMyAccountFeedListRequest());
    await sleep(500);
    console.log('my feed attach');
    console.log('myID', myId);
    try {
      const result = await createAxiosServerInstance().get('/mypage/get', {
        params: {
          agentID: myId,
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
      dispatch(getMyAccountFeedListSuccess(result.data.boardVOS));
      return result.data.boardVOS;
    } catch (error) {
      console.log(error);
    }
  };

export type TypeMyAccountDispatch = ThunkDispatch<
  UncrRootReducer,
  undefined,
  TypeMyAccountActions
>;

export type TypeMyAccountThunkAction = ThunkAction<
  Promise<void>,
  UncrRootReducer,
  undefined,
  TypeMyAccountActions
>;

export type TypeMyAccountActions =
  | ReturnType<typeof getMyAccountFeedListFailure>
  | ReturnType<typeof getMyAccountFeedListRequest>
  | ReturnType<typeof getMyAccountFeedListSuccess>;
