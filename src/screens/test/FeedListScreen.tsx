import React from 'react';
import {FlatList, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {favoriteFeed, TypeFeedListDispatch} from '../../actions/test/feedList';
import {Header} from '../../components/Header/Header';
import {FeedListItem} from '../../components/test/FeedListItem';
import {
  useRootNavigation,
  useRootRoute,
} from '../../navigation/test/TestRootStackNavigator';

export const FeedListScreen: React.FC = () => {
  const route = useRootRoute<'FeedList'>();
  const navigation = useRootNavigation<'FeedList'>();
  const dispatch = useDispatch<TypeFeedListDispatch>();
  return (
    <View style={{flex: 1}}>
      <Header>
        <Header.Title title="FEED LIST"></Header.Title>
        <Header.Icon
          name="close"
          onPress={() => {
            navigation.goBack();
          }}></Header.Icon>
      </Header>
      <FlatList
        data={route.params.list}
        renderItem={({item}) => {
          return (
            <FeedListItem
              image={item.imageUrl}
              comment={item.content}
              isLiked={false}
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
