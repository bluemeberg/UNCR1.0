import React, {useEffect, useRef} from 'react';
import {FlatList, View} from 'react-native';
import FeedListItem from '../../components/FeedListItem';
import {Header} from '../../components/Header/Header';
import {
  useMyFeedNavigation,
  useMyFeedRoute,
} from '../../navigation/MyFeedNavigation';

const MyFeedDetail: React.FC = () => {
  const myRoutes = useMyFeedRoute<'MyFeedDetail'>();
  console.log(myRoutes.params);
  const navigation = useMyFeedNavigation();
  const onPressClose = () => {
    navigation.goBack();
  };
  const flatlistRef = useRef<FlatList>(null);
  useEffect(() => {
    setTimeout(() => {
      if (flatlistRef.current) {
        flatlistRef.current?.scrollToIndex({index: myRoutes.params.index});
      }
    }, 500);
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Header>
        <Header.Icon
          name="arrow-back"
          onPress={onPressClose}
          color="black"
          size={20}
        />
        <Header.Title title="Posts" />
        <Header.Title title="" />
      </Header>
      <FlatList
        data={myRoutes.params.MyFeedData}
        ref={flatlistRef}
        renderItem={({item, index}) => {
          return (
            <FeedListItem
              boardID={item.boardID}
              agentURI={item.agentURI}
              agentNickname={item.agentNickname}
              agentID={item.agentID}
              channelThumbnail={item.channelThumbnail}
              channelTitle={item.channelTitle}
              channelID={item.channelID}
              boardContent={item.boardContent}
              totalDuration={item.totalDuration}
              totalWatchers={item.totalWatchers}
              totalComments={item.totalComments}
              myDuration={item.myDuration ?? null}
              myLike={item.myLike}
              videoID={item.videoID}
              totalLikes={item.totalLikes}
              boardTime={item.boardTime}
              boardTitle={item.boardTitle}
              videoThumbnail={item.videoThumbnail}
              index={index}
            />
          );
        }}
      />
    </View>
  );
};

export default MyFeedDetail;
