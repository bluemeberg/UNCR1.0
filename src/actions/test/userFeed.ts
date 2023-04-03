import {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {FeedInfo} from '../../@types/test/TestFeedInfo';
import {UserInfo} from '../../@types/test/TestUserInfo';
import {RootReducer} from '../../testStore';
import {sleep} from '../../utils/sleep';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
export const SET_USER_INFO = 'SET_USER_INFO' as const;

export const GET_MY_FEED_LIST_REQUEST = 'GET_MY_FEED_LIST_REQUEST' as const;
export const GET_MY_FEED_LIST_SUCCESS = 'GET_MY_FEED_LIST_SUCCESS' as const;
export const GET_MY_FEED_LIST_FAILURE = 'GET_MY_FEED_LIST_FAILURE' as const;

export const setUserInfo = (useId: UserInfo) => {
  return {
    type: SET_USER_INFO,
    useId,
  };
};

export const getMyFeedListReqeust = () => {
  return {
    type: GET_MY_FEED_LIST_REQUEST,
  };
};

export const getMyFeedListSuccess = (list: FeedInfo[]) => {
  return {
    type: GET_MY_FEED_LIST_SUCCESS,
    list,
  };
};

export const getMyFeedListFailure = () => {
  return {
    type: GET_MY_FEED_LIST_FAILURE,
  };
};

// dispatch에서 thunkAction에 대한 타입정의가 필요
export const getMyFeedList =
  (): TypeUserThunkAction => async (dispatch, getState) => {
    dispatch(getMyFeedListReqeust());
    const lastFeedList = await database()
      .ref('/feed')
      .once('value')
      .then(snapshot => snapshot.val());

    const result = Object.keys(lastFeedList)
      .map(key => {
        return {
          ...lastFeedList[key],
          id: key,
          likeHistory: lastFeedList[key].likeHistory ?? [],
        };
      })
      .filter(item => item.writer.uid === getState().userInfo.userInfo?.uid);
    dispatch(getMyFeedListSuccess(result));
    // await sleep(500);
    // dispatch(
    //   getMyFeedListSuccess([
    //     {
    //       id: 'ID_04',
    //       content: 'CONTENT_01',
    //       writer: {
    //         name: 'WRITER_NAME_01',
    //         uid: 'WRITER_UID_01',
    //       },
    //       imageUrl:
    //         'https://docs.expo.dev/static/images/tutorial/background-image.png',
    //       likeHistory: ['UID_02', 'UID_01'],
    //       createdAt: new Date().getTime(),
    //     },
    //     {
    //       id: 'ID_05',
    //       content: 'CONTENT_02',
    //       writer: {
    //         name: 'WRITER_NAME_02',
    //         uid: 'WRITER_UID_02',
    //       },
    //       imageUrl:
    //         'https://docs.expo.dev/static/images/tutorial/background-image.png',

    //       likeHistory: ['UID_02', 'UID_01'],
    //       createdAt: new Date().getTime(),
    //     },
    //     {
    //       id: 'ID_06',
    //       content: 'CONTENT_03',
    //       writer: {
    //         name: 'WRITER_NAME_03',
    //         uid: 'WRITER_UID_03',
    //       },
    //       imageUrl:
    //         'https://docs.expo.dev/static/images/tutorial/background-image.png',

    //       likeHistory: ['UID_02', 'UID_01'],
    //       createdAt: new Date().getTime(),
    //     },
    //   ]),
    // );
  };

export const signIn =
  (idToken: string): TypeUserThunkAction =>
  async dispatch => {
    // await sleep(1000);
    // dispatch(
    //   setUserInfo({
    //     uid: 'TEST_UID',
    //     name: 'TEST_NAME',
    //     profileImage: 'TEST_PROFILE_IMAGE',
    //   }),
    // );
    const googleSigninCreadential = auth.GoogleAuthProvider.credential(idToken);
    const signinResult = await auth().signInWithCredential(
      googleSigninCreadential,
    );
    const userDB = database().ref(`/users/${signinResult.user.uid}`);
    const user = await userDB.once('value').then(snapshot => snapshot.val());
    const now = new Date().getTime();
    if (user === null) {
      await userDB.set({
        name: signinResult.user.displayName,
        profileImage: signinResult.user.photoURL,
        uid: signinResult.user.uid,
        createdAt: now,
        lastLoginAt: now,
      });
    } else {
      await userDB.update({
        lastLoginAt: now,
      });
    }
    dispatch(
      setUserInfo({
        uid: signinResult.user.uid,
        name: signinResult.user.displayName ?? 'Unkonw',
        profileImage: signinResult.user.photoURL ?? '',
      }),
    );
  };

export type TypeUserRRDispatch = ThunkDispatch<
  RootReducer,
  undefined,
  TypeUserInfoActions
>;

export type TypeUserThunkAction = ThunkAction<
  void,
  RootReducer,
  any,
  TypeUserInfoActions
>;
export type TypeUserInfoActions =
  | ReturnType<typeof setUserInfo>
  | ReturnType<typeof getMyFeedListReqeust>
  | ReturnType<typeof getMyFeedListSuccess>
  | ReturnType<typeof getMyFeedListFailure>;
