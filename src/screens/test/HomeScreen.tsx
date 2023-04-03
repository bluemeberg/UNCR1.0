import React, {useCallback, useEffect} from 'react';
import {FlatList, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {UserInfo} from '../../@types/test/TestUserInfo';
import {
  favoriteFeed,
  getFeedList,
  TypeFeedListDispatch,
} from '../../actions/test/feedList';
import {Header} from '../../components/Header/Header';
import {FeedListItem} from '../../components/test/FeedListItem';
import {TypeUser} from '../../data/test/TypeUser';
import {useRootNavigation} from '../../navigation/test/TestRootStackNavigator';
import {useTotalFeedList} from '../../selectors/test/TestfeedList';
import {useMyInfo} from '../../selectors/test/TestuserInfo';
import {RootReducer} from '../../testStore';

export const HomeScreen: React.FC = () => {
  const feedList = useTotalFeedList();
  const dispatch = useDispatch<TypeFeedListDispatch>();
  const rootNavigation = useRootNavigation();
  const onPressHome = useCallback(() => {
    rootNavigation.navigate('AddFeed');
  }, []);
  const userInfo = useMyInfo();
  console.log(userInfo);
  useEffect(() => {
    dispatch(getFeedList());
  }, []);
  return (
    <View style={{flex: 1}}>
      <Header>
        <Header.Title title="HOME"></Header.Title>
        <Header.Icon name="add" onPress={onPressHome}></Header.Icon>
      </Header>
      <FlatList
        data={feedList}
        renderItem={({item}) => {
          return (
            <FeedListItem
              image={item.imageUrl}
              comment={item.content}
              isLiked={item.likeHistory[0] === userInfo?.uid ?? 'Unkonwn'}
              likeCount={item.likeHistory.length}
              writer={item.writer.name}
              onPressFeed={() => {}}
              onPressFavorite={() => {
                dispatch(favoriteFeed(item));
              }}
            />
          );
        }}
      />
    </View>
  );
};
