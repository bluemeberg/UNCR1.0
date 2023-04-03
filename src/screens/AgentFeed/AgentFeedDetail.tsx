import React, {useEffect, useRef, useState} from 'react';
import {FlatList, View} from 'react-native';
import FeedListItem from '../../components/FeedListItem';
import {Header} from '../../components/Header/Header';
import {
  useAgentFeedNavigation,
  useAgentFeedRoute,
} from '../../navigation/AgentFeedNavigation';
import {createAxiosServerInstance} from '../../utils/AxiosUtils';

const AgentFeedDetail: React.FC = () => {
  const agentRoutes = useAgentFeedRoute<'AgentFeedDetail'>();
  console.log(agentRoutes.params);
  const navigation = useAgentFeedNavigation();
  const onPressClose = () => {
    navigation.goBack();
  };
  const flatlistRef = useRef<FlatList>(null);
  useEffect(() => {
    setTimeout(() => {
      if (flatlistRef.current) {
        flatlistRef.current?.scrollToIndex({index: agentRoutes.params.index});
      }
    }, 200);
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
        data={agentRoutes.params.AgentFeedData}
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

export default AgentFeedDetail;
