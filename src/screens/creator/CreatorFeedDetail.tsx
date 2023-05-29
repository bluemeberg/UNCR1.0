import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, Pressable, StyleSheet} from 'react-native';
import {View} from 'react-native';
import FeedListItem from '../../components/FeedListItem';
import {Header} from '../../components/Header/Header';
import {
  useCreatorListNavigation,
  useCreatorListRoute,
} from '../../navigation/CreatorListNavigation';
import {createAxiosServerInstance} from '../../utils/AxiosUtils';

const CreatorFeedDetail: React.FC = () => {
  const route = useCreatorListRoute();
  console.log('route', route.params);
  const navigation = useCreatorListNavigation();
  const [data, setData] = useState();
  // creator/get api 불러오기
  const getCreatorInfo = async () => {
    const result = await createAxiosServerInstance().get('/creator/get', {
      params: {
        agentID: route.params.agentID,
        channelID: route.params.channelID,
      },
    });
    console.log('result', result.data.boards);
    setData(result.data.boards);
  };
  const isFocused = useIsFocused();
  const flatlistRef = useRef();
  useEffect(() => {
    getCreatorInfo();
  }, []);
  useEffect(() => {
    setTimeout(() => {
      if (flatlistRef.current) {
        flatlistRef.current?.scrollToIndex({index: route.params.index});
      }
    }, 500);
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Header>
        <Header.Icon
          name="arrow-back"
          onPress={() => {
            navigation.goBack();
          }}
          color="black"
          size={20}
        />
        <Header.Title title={route.params.channelTitle} />
        <Header.Title title="" />
      </Header>
      {/* Flatlist 피드 렌더링 */}
      {isFocused === false ? (
        <Pressable
          style={[
            StyleSheet.absoluteFill,
            {backgroundColor: 'rgba(0, 0, 0, 0.3)', zIndex: 1},
          ]}
        />
      ) : (
        <></>
      )}
      <FlatList
        data={data}
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
              youtubeComment={item.youtubeComment}
              youtubeCommentLikes={item.youtubeCommentLikes}
              index={index}
              hashtags={item.hashtags}
            />
          );
        }}
      />
    </View>
  );
};

export default CreatorFeedDetail;
