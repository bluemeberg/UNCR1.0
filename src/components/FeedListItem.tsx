import React, {useCallback} from 'react';
import {Text, useWindowDimensions, View} from 'react-native';
import {presets} from '../../babel.config';
import {MainFeedInfo} from '../@types/MainFeedInfo';
import {Button} from './Button';
import {Divider} from './Divider';
import {FeedListBottom} from './FeedListBottom';
import FeedListItemHeader from './FeedListItemHeader';
import {Font} from '../utils/FontStyle';
import {Icon} from './Icon';
import {RemoteImage} from './RemoteImage';
import {Spacer} from './Spacer';
import {Typography} from './Typography';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useMainNavigation} from '../navigation/MainFeedNavigation';
import {useRootNavigation} from '../navigation/RootStackNavigation';
import {useDispatch, useSelector} from 'react-redux';
import {UncrRootReducer} from '../uncrStore';
import {AgentAccountInfo} from '../@types/AgentAccountInfo';
import {
  getAgentFeedList,
  TypeAgentFeedListDispatch,
} from '../actions/agentFeed';
import {sleep} from '../utils/sleep';
const FeedListItem: React.FC<MainFeedInfo> = props => {
  const navigation = useMainNavigation<'AgentFeedNavigation'>();
  const rootNavigation = useRootNavigation<'Main'>();
  const {width} = useWindowDimensions();
  const agentFeedDispatch = useDispatch<TypeAgentFeedListDispatch>();
  const onPressAgentFeed = useCallback(async (agentNumber: number) => {
    agentFeedDispatch(getAgentFeedList(agentNumber.toString()));
    await sleep(500);
    navigation.navigate('AgentFeedNavigation', {
      screen: 'AgentFeed',
      params: {
        AgentID: agentNumber,
      },
    });
  }, []);
  const onPressWatchingVideo = useCallback(
    (
      video: string,
      myDuration: number,
      boardID: number,
      totalDuration: number,
      totalWatchers: number,
      totalComments: number,
      totalLikes: number,
      isLiked: boolean,
      boardTime: string,
      boardContent: string,
      agentNickName: string,
      channelThumnail: string,
      channelTitle: string,
      boardAgnetID: string,
      index: number,
    ) => {
      rootNavigation.push('WatchingVideo', {
        videoId: video,
        myDuration: myDuration,
        boardID: boardID,
        totalDuration: totalDuration,
        totalWatchers: totalWatchers,
        totalComments: totalComments,
        totalLikes: totalLikes,
        isLiked: isLiked,
        boardTime: boardTime,
        boardContent: boardContent,
        agentNickName: agentNickName,
        channelThumnail: channelThumnail,
        channelTitle: channelTitle,
        boardAgnetID: boardAgnetID,
        index: index,
      });
    },
    [],
  );
  const agentInfo = useSelector<UncrRootReducer, AgentAccountInfo | null>(
    state => {
      return state.accountInfo.accountInfo;
    },
  );
  return (
    <View>
      <Spacer space={8} />
      <FeedListItemHeader
        agentURI={props.agentURI}
        agentNickname={props.agentNickname}
        agentID={props.agentID}
        channelThumbnail={props.channelThumbnail}
        channelTitle={props.channelTitle}
        onPressAent={() => onPressAgentFeed(props.agentID)}
      />
      <Spacer space={16} />
      <View style={{paddingHorizontal: 16}}>
        <Text style={[Font.Body_16_R, {color: 'black'}]}>
          {props.boardContent}
        </Text>
      </View>
      <Spacer space={20} />
      <Button
        onPress={() =>
          onPressWatchingVideo(
            props.videoID,
            props?.myDuration ?? 0,
            props.boardID,
            props.totalDuration,
            props.totalWatchers,
            props.totalComments,
            props.totalLikes,
            props.myLike,
            props.boardTime,
            props.boardContent,
            props.agentNickname,
            props.channelThumbnail,
            props.channelTitle,
            props.agentID.toString(),
            props.index,
          )
        }>
        <RemoteImage
          width={width}
          height={(width * 180) / 320}
          url={
            props.videoThumbnail != null && props.videoThumbnail != ''
              ? props.videoThumbnail
              : 'https://i.ytimg.com/vi/iF-oJp4yYY0/mqdefault.jpg'
          }
        />
      </Button>
      <Spacer space={10} />
      <View
        style={{
          paddingHorizontal: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={Font.Caption01_14_R}>Total View</Text>
          <Spacer horizontal space={8} />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 2,
            }}>
            <Icon name="time-outline" size={14} color="rgba(0,0,0,0.5)" />
          </View>
          <Spacer horizontal space={2} />
          <Text style={Font.Caption01_14_R}>
            {props.totalDuration.toString()} sec
          </Text>
          <Spacer horizontal space={5} />
          <View
            style={{
              width: 2,
              height: 2,
              backgroundColor: 'gray',
              borderRadius: 10,
              marginBottom: 2,
            }}
          />
          <Spacer horizontal space={3} />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 2,
            }}>
            <Icon name="people-outline" size={16} color="rgba(0,0,0,0.5)" />
          </View>
          <Spacer horizontal space={4} />
          <Text style={Font.Caption01_14_R}>
            {props.totalWatchers.toString()}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {agentInfo != null && agentInfo.agentNumber !== 0 ? (
            <MaterialCommunityIcons
              name="account-clock-outline"
              size={16}
              color="black"
            />
          ) : (
            ''
          )}
          <Spacer horizontal space={4} />
          <Text style={Font.Caption01_14_B}>
            {props.myDuration != null && agentInfo != null
              ? `${props.myDuration} sec`
              : '--:--:--'}
          </Text>
        </View>
      </View>
      <Spacer space={20} />
      <FeedListBottom
        feedCommentNumber={props.totalComments}
        feedLikeNumber={props.totalLikes}
        isLiked={props.myLike}
        boardID={props.boardID}
        boardContent={props.boardContent}
        agentNickName={props.agentNickname}
        channelThumnaial={props.channelThumbnail}
        channelTitle={props.channelTitle}
        boardAgnetID={props.agentID.toString()}
      />
      <Spacer space={15} />
      <Text style={[Font.Caption01_12_R, {marginHorizontal: 16}]}>
        {props.boardTime}
      </Text>
      <Spacer space={15} />
      <Divider width={6} color="#F2F4F9" />
      <Spacer space={12} />
    </View>
  );
};

export default FeedListItem;
