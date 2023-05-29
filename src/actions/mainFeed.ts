import {ThunkAction, ThunkActionDispatch, ThunkDispatch} from 'redux-thunk';
import {MainFeedInfo} from '../@types/MainFeedInfo';
import {RootReducer} from '../testStore';
import {UncrRootReducer} from '../uncrStore';
import {
  createAxiosLocalServerInstance,
  createAxiosServerInstance,
} from '../utils/AxiosUtils';
import {sleep} from '../utils/sleep';
export const GET_MAIN_FEED_LIST_REQEUST = 'GET_MAIN_FEED_LIST_REQEUST' as const;
export const GET_MAIN_FEED_LIST_SUCCESS = 'GET_MAIN_FEED_LIST_SUCCESS' as const;
export const GET_MAIN_FEED_LIST_FAILURE = 'GET_MAIN_FEED_LIST_FAILURE' as const;
export const CREATE_AGENT_ACCOUNT_FEED_REQEUST =
  'CREATE_AGENT_ACCOUNT_FEED_REQEUST' as const;
export const CREATE_AGENT_ACCOUNT_FEED_SUCCESS =
  'CREATE_AGENT_ACCOUNT_FEED_SUCCESS' as const;
export const CREATE_AGENT_ACCOUNT_FEED_FAILURE =
  'CREATE_AGENT_ACCOUTN_FEED_FAILURE' as const;

export const FAVORITE_AGENT_FEED_REQEUST =
  'FAVORITE_AGENT_FEED_REQEUST' as const;
export const FAVORITE_AGENT_FEED_SUCCESS =
  'FAVORITE_AGENT_FEED_SUCCESS' as const;
export const FAVORTIE_AGENT_FEED_FAILURE =
  'FAVORTIE_AGENT_FEED_FAILURE' as const;

export const getMainFeedRequest = () => {
  return {
    type: GET_MAIN_FEED_LIST_REQEUST,
  };
};

export const getMainFeedSuccess = (list: MainFeedInfo[]) => {
  return {
    type: GET_MAIN_FEED_LIST_SUCCESS,
    list,
  };
};

export const getMainFeedFailure = () => {
  return {
    type: GET_MAIN_FEED_LIST_FAILURE,
  };
};

export const createAgentAccountFeedReqeust = () => {
  return {
    type: CREATE_AGENT_ACCOUNT_FEED_REQEUST,
  };
};

export const createAgentAccountFeedSuccess = (item: MainFeedInfo) => {
  return {
    type: CREATE_AGENT_ACCOUNT_FEED_SUCCESS,
    item,
  };
};

export const createAgentAccountFeedFailure = () => {
  return {
    type: CREATE_AGENT_ACCOUNT_FEED_FAILURE,
  };
};

// omit을 통해 item 지울 것을 정한다.
export const createAgentAccountFeed =
  (
    channelID: string,
    boardTitle: string,
    boardContent: string,
    videoID: string,
    videoThumbnail: string,
    videoCategory: string,
    youtubeComment: string | null,
    youtubeCommentCount: number | null,
    hashtags: [],
  ): TypeMainFeedListThunkAction =>
  async (dispatch, getState) => {
    dispatch(createAgentAccountFeedReqeust());
    await sleep(200);
    const agentUser = getState().accountInfo.accountInfo;
    try {
      console.log('youtubeComment', youtubeComment);
      console.log('youtubeCommentCount', youtubeCommentCount);
      console.log('check', agentUser?.agentNumber);
      console.log('check', boardTitle);
      console.log('check', boardContent);
      console.log('check', videoID);
      console.log('check', videoThumbnail);
      console.log('cehck', videoCategory);
      console.log('hashTags', hashtags);
      const result = await createAxiosServerInstance().post('/board/add', {
        agentID: agentUser?.agentNumber,
        channelID: channelID,
        boardTitle: boardTitle,
        boardContent: boardContent,
        videoID: videoID,
        videoThumbnail: videoThumbnail,
        videoCategory: videoCategory,
        youtubeComment: youtubeComment,
        youtubeCommentLikes: youtubeCommentCount,
        hashtags: hashtags,
      });
    } catch (e) {
      console.error(e);
    }
    //서버
    const latestFeed = await createAxiosServerInstance().get('/feed/get', {
      params: {
        agentID: agentUser?.agentNumber,
      },
    });

    // // 로컬
    // const result = await createAxiosLocalServerInstance().post('/board/add', {
    //   agentID: agentUser?.agentNumber,
    //   channelID: channelID,
    //   boardTitle: boardTitle,
    //   boardContent: boardContent,
    //   videoID: videoID,
    //   videoThumbnail: videoThumbnail,
    //   videoCategory: videoCategory,
    // });

    // console.log(result.data);
    // const latestFeed = await createAxiosLocalServerInstance().get('/feed/get', {
    //   params: {
    //     agentID: agentUser?.agentNumber,
    //   },
    // });
    // 메인피드 다시 불러오기
    dispatch(getMainFeedList(agentUser?.agentNumber.toString() ?? 'null'));
    const item = latestFeed.data[latestFeed.data.length - 1];
    dispatch(
      createAgentAccountFeedSuccess(
        latestFeed.data[latestFeed.data.length - 1],
      ),
    );
  };

export const getMainFeedList =
  (agentId: string): TypeMainFeedListThunkAction =>
  async (dispatch, getState) => {
    // feed 서버로 부터 가져오기 /feed
    // 후 dispatch 통해서 getFeedSuccess로 feed 상태 업데이트
    try {
      // 서버
      const result1 = await createAxiosServerInstance().get('feed/get', {
        params: {
          agentID: agentId,
        },
      });
      // // 로컬
      // const result1 = await createAxiosLocalServerInstance().get('feed/get', {
      //   params: {
      //     agentID: agentId,
      //   },
      // });
      result1.data.sort((a: any, b: any) => a.boardID - b.baordID).reverse();
      dispatch(getMainFeedSuccess(result1.data));
      await sleep(500);
    } catch (error) {
      console.log(error);
    }
  };

// rootReducer combine 필요. 지금은 테스트 설정
// export type TypeFeedThunkAction = ThunkAction<>

export type TypeMainFeedListDispatch = ThunkDispatch<
  UncrRootReducer,
  undefined,
  TypeMainFeedListActions
>;

// return type, redux state, 마지막이 action
export type TypeMainFeedListThunkAction = ThunkAction<
  void,
  UncrRootReducer,
  undefined,
  TypeMainFeedListActions
>;
export type TypeMainFeedListActions =
  // get리스트들의 함수에 있는 리턴값을 나열한다.
  | ReturnType<typeof getMainFeedRequest>
  | ReturnType<typeof getMainFeedSuccess>
  | ReturnType<typeof getMainFeedFailure>
  | ReturnType<typeof createAgentAccountFeedReqeust>
  | ReturnType<typeof createAgentAccountFeedSuccess>
  | ReturnType<typeof createAgentAccountFeedFailure>;
