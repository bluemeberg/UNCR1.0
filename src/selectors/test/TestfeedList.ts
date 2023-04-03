import {useSelector} from 'react-redux';
import {FeedInfo} from '../../@types/test/TestFeedInfo';
import {RootReducer} from '../../testStore';

export const useTotalFeedList = () =>
  useSelector<RootReducer, FeedInfo[]>(state => state.feedList.list);
