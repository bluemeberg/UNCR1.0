import {useSelector} from 'react-redux';
import {FeedInfo} from '../../@types/test/TestFeedInfo';
import {UserInfo} from '../../@types/test/TestUserInfo';
import {RootReducer} from '../../testStore';

export const useMyInfo = () =>
  useSelector<RootReducer, UserInfo | null>(state => {
    return state.userInfo.userInfo;
  });

export const useMyFeedList = () =>
  useSelector<RootReducer, FeedInfo[]>(state => {
    return state.userInfo.myFeedList;
  });
