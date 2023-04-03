// feed list 들을 한번 불러올때 뿌려주는

import {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {FeedInfo} from '../../@types/test/TestFeedInfo';
import {RootReducer} from '../../testStore';
import {sleep} from '../../utils/sleep';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
export const GET_FEED_LIST_REQUEST = 'GET_FEED_LIST_REQUEST' as const;
export const GET_FEED_LIST_SUCCESS = 'GET_FEED_LIST_SUCCESS' as const;
export const GET_FEED_LIST_FAILURE = 'GET_FEED_LIST_FAILURE' as const;

export const CREATE_FEED_REQEUST = 'CREATE_FEED_REQEUST' as const;
export const CREATE_FEED_SUCCESS = 'CREATE_FEED_SUCCESS' as const;
export const CREATE_FEED_FAILURE = 'CREATE_FEED_FAILURE' as const;

export const FAVORITE_FEED_REQEUST = 'FAVORITE_FEED_REQEUST' as const;
export const FAVORITE_FEED_SUCCESS = 'FAVORITE_FEED_SUCCESS' as const;
export const FAVORTIE_FEED_FAILURE = 'FAVORTIE_FEED_FAILURE' as const;

export const getFeedListReqeust = () => {
  return {
    type: GET_FEED_LIST_REQUEST,
  };
};

export const getFeedListSuccess = (list: FeedInfo[]) => {
  return {
    type: GET_FEED_LIST_SUCCESS,
    list,
  };
};

export const getFeedListFailure = () => {
  return {
    type: GET_FEED_LIST_FAILURE,
  };
};

export const createFeedReqeust = () => {
  return {
    type: CREATE_FEED_REQEUST,
  };
};

export const createFeedSuccess = (list: FeedInfo) => {
  return {
    type: CREATE_FEED_SUCCESS,
    list,
  };
};

export const createFeedFailure = () => {
  return {
    type: CREATE_FEED_FAILURE,
  };
};

export const favoriteFeedReqeust = () => {
  return {
    type: FAVORITE_FEED_REQEUST,
  };
};

export const favoriteFeedSuccess = (
  feedId: FeedInfo['id'],
  myId: string,
  action: 'add' | 'del',
) => {
  return {
    type: FAVORITE_FEED_SUCCESS,
    feedId,
    myId,
    action,
  };
};

export const favoriteFeedFailure = () => {
  return {
    type: FAVORTIE_FEED_FAILURE,
  };
};

// dispatch에서 thunkAction에 대한 타입정의가 필요
// feed 가져오는 api 호출 /main/feed
export const getFeedList = (): TypeFeedListThunkAction => async dispatch => {
  dispatch(getFeedListReqeust());
  const lastFeedList = await database()
    .ref('/feed')
    .once('value')
    .then(snapshot => snapshot.val());

  const result = Object.keys(lastFeedList).map(key => {
    return {
      ...lastFeedList[key],
      id: key,
      likeHistory: lastFeedList[key].likeHistory ?? [],
    };
  });
  dispatch(getFeedListSuccess(result));
  //   await sleep(500);
  //   dispatch(
  //     getFeedListSuccess([
  //       {
  //         id: 'ID_01',
  //         content: 'CONTENT_01',
  //         writer: {
  //           name: 'WRITER_NAME_01',
  //           uid: 'WRITER_UID_01',
  //         },
  //         imageUrl: 'IMAGE_URL_01',
  //         likeHistory: ['UID_02', 'UID_01'],
  //         createdAt: new Date().getTime(),
  //       },
  //       {
  //         id: 'ID_02',
  //         content: 'CONTENT_02',
  //         writer: {
  //           name: 'WRITER_NAME_02',
  //           uid: 'WRITER_UID_02',
  //         },
  //         imageUrl: 'IMAGE_URL_02',
  //         likeHistory: ['UID_02', 'UID_01'],
  //         createdAt: new Date().getTime(),
  //       },
  //       {
  //         id: 'ID_01',
  //         content: 'CONTENT_01',
  //         writer: {
  //           name: 'WRITER_NAME_01',
  //           uid: 'WRITER_UID_01',
  //         },
  //         imageUrl: 'IMAGE_URL_02',
  //         likeHistory: ['UID_02', 'UID_01'],
  //         createdAt: new Date().getTime(),
  //       },
  //     ]),
  //   );
};

// 피드 작성하기
export const createFeed =
  (
    item: Omit<FeedInfo, 'id' | 'writer' | 'createdAt' | 'likeHistory'>,
  ): TypeFeedListThunkAction =>
  async (dispatch, getState) => {
    dispatch(createFeedReqeust());
    const createAt = new Date().getTime();
    const user = getState().userInfo.userInfo;
    const feedDB = await database().ref('/feed');
    const saveItem: Omit<FeedInfo, 'id'> = {
      content: item.content,
      writer: {
        name: user?.name || 'Unknown',
        uid: user?.uid || 'Unknwon',
      },
      imageUrl:
        'https://docs.expo.dev/static/images/tutorial/background-image.png',
      likeHistory: [],
      createdAt: new Date().getTime(),
    };
    // 저장하고,
    await feedDB.push().set({
      ...saveItem,
    });
    //   저장한 마지막 상태를 다시 읽어옴
    const lastFeedList = await feedDB
      .once('value')
      .then(snapshot => snapshot.val());

    Object.keys(lastFeedList).forEach(key => {
      const item = lastFeedList[key];

      if (item.createdAt == createAt) {
        dispatch(
          createFeedSuccess({
            id: key,
            content: item.content,
            writer: item.writer,
            imageUrl: item.imageUrl,
            likeHistory: item.likeHistory ?? [],
            createdAt: item.createAt,
          }),
        );
      }
    });
    // await sleep(200);
    // dispatch(
    //   createFeedSuccess({
    //     id: 'ID-010',
    //     content: item.content,
    //     writer: {
    //       name: user?.name ?? 'Unknown',
    //       uid: user?.uid ?? 'Unknown',
    //     },
    //     imageUrl: item.imageUrl,
    //     likeHistory: [],
    //     createdAt: createAt,
    //   }),
    // );
  };

export const favoriteFeed =
  (item: FeedInfo): TypeFeedListThunkAction =>
  async (dispatch, getState) => {
    dispatch(favoriteFeedReqeust());
    const myId = getState().userInfo.userInfo?.uid || null;
    if (myId == null) {
      dispatch(favoriteFeedFailure());
      return;
    }
    const feedDB = database().ref(`/feed/${item.id}`);
    const feedItem = (await feedDB
      .once('value')
      .then(snapshot => snapshot.val())) as FeedInfo;
    if (typeof feedItem.likeHistory === 'undefined') {
      await feedDB.update({
        likeHistory: [myId],
      });
      dispatch(favoriteFeedSuccess(item.id, myId, 'add'));
    } else {
      const hasMyId =
        feedItem.likeHistory.filter(likeUserId => likeUserId === myId).length >
        0;
      if (hasMyId) {
        // 잇을 경우에 빼는 액션
        await feedDB.update({
          likeHistory: feedItem.likeHistory.filter(
            likeUserId => likeUserId !== myId,
          ),
        });
        dispatch(favoriteFeedSuccess(item.id, myId, 'del'));
      } else {
        //   없을 경우에 추가하는 액션
        await feedDB.update({
          likeHistory: feedItem.likeHistory.concat([myId]),
        });
        console.log('add');
        dispatch(favoriteFeedSuccess(item.id, myId, 'add'));
      }
    }
  };

export type TypeFeedListDispatch = ThunkDispatch<
  RootReducer,
  undefined,
  TypeFeedListActions
>;
export type TypeFeedListThunkAction = ThunkAction<
  void,
  RootReducer,
  any,
  TypeFeedListActions
>;
export type TypeFeedListActions =
  | ReturnType<typeof getFeedListReqeust>
  | ReturnType<typeof getFeedListSuccess>
  | ReturnType<typeof getFeedListFailure>
  | ReturnType<typeof createFeedReqeust>
  | ReturnType<typeof createFeedSuccess>
  | ReturnType<typeof createFeedFailure>
  | ReturnType<typeof favoriteFeedReqeust>
  | ReturnType<typeof favoriteFeedSuccess>
  | ReturnType<typeof favoriteFeedFailure>;
