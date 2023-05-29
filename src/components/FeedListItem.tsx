import React, {useCallback, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
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
import {Coder} from '@ethersproject/abi/lib/coders/abstract-coder';
import {Color} from '../utils/ColorStyle';
import {
  getAccountFeedList,
  TypeAgentAccountDispatch,
} from '../actions/agentAccount';
import ViewShot, {captureRef} from 'react-native-view-shot';
import Share from 'react-native-share';
import {
  convertSecondsToTime,
  convertSecondsToTimeAssume,
} from '../utils/MetricUtils';

const FeedListItem: React.FC<MainFeedInfo> = props => {
  const navigation = useMainNavigation<'AgentFeedNavigation'>();
  const rootNavigation = useRootNavigation<'Main'>();
  const {width, height} = useWindowDimensions();
  const agentFeedDispatch = useDispatch<TypeAgentFeedListDispatch>();
  const agentFeedListDispatch = useDispatch<TypeAgentAccountDispatch>();
  const onPressAgentFeed = useCallback(async (agentNumber: number) => {
    agentFeedDispatch(getAgentFeedList(agentNumber.toString()));
    agentFeedListDispatch(
      getAccountFeedList(
        agentNumber.toString(),
        agentInfo?.agentNumber.toString(),
      ),
    );
    await sleep(500);
    rootNavigation.push('Agent', {
      screen: 'AgentFeed',
      params: {
        AgentID: agentNumber,
      },
    });
    // navigation.push('AgentFeedNavigation', {
    //   screen: 'AgentFeed',
    //   params: {
    //     AgentID: agentNumber,
    //   },
    // });
  }, []);
  // console.log('index', props.index);
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
      hashtags: [],
      youtubeComment: string,
      youtubeCommentLikes: string,
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
        hashtags: hashtags,
        youtubeComment: youtubeComment,
        youtubeCommentLikes: youtubeCommentLikes,
      });
    },
    [],
  );
  // console.log('hashTags', props.hashtags);
  const agentInfo = useSelector<UncrRootReducer, AgentAccountInfo | null>(
    state => {
      return state.accountInfo.accountInfo;
    },
  );
  const feedCapture = useRef();
  const onPressShare = async boardID => {
    try {
      const URI = await captureRef(feedCapture, {
        format: 'png',
        quality: 1,
      });
      console.log('uri', URI);
      const uri = await feedCapture.current
        .capture()
        .catch(err => console.log(err));
      console.log('uri2', uri);
      console.log(props.index);
      let deeplink = 'uncr://feed/' + props.index;
      console.log('make deep link', deeplink);
      const shareOptions = {
        title: 'Share',
        message: deeplink,
        url: `file://${uri}`,
        type: 'image/png',
        imageURl: `file://${uri}`,
      };
      const result = await Share.open(shareOptions);
      console.log('Share result:', result);
    } catch (error) {
      // console.error('Error sharing content', error);
    }
  };
  const [isLoading, setIsLoading] = useState(true);
  const handleImageLoad = () => {
    setIsLoading(false);
  };
  return (
    <View>
      <ViewShot ref={feedCapture}>
        <Spacer space={8} />
        <FeedListItemHeader
          agentURI={props.agentURI}
          agentNickname={props.agentNickname}
          agentID={props.agentID}
          channelThumbnail={props.channelThumbnail}
          channelTitle={props.channelTitle}
          onPressAent={() => onPressAgentFeed(props.agentID)}
          boardTime={props.boardTime}
        />
        <Spacer space={16} />
        <View style={{paddingHorizontal: 16}}>
          <Text style={[Font.Body_16_R, {color: 'black'}]}>
            {props.boardContent}
          </Text>
        </View>
        <Spacer space={4} />
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            flexWrap: 'wrap',
          }}>
          {props.hashtags.map(item => (
            <View style={{marginRight: 4}}>
              <Text style={Color.Purple_Main}>#{item}</Text>
            </View>
          ))}
        </View>
        <Spacer space={20} />
        {/* youtube comment */}
        {props.youtubeComment !== null ? (
          <View
            style={{
              marginHorizontal: 16,
              backgroundColor: '#F2F4F9',
              borderRadius: 8,
              paddingVertical: 12,
              paddingHorizontal: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              flex: 1,
            }}>
            <View style={{flexWrap: 'wrap', flex: 1}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  style={{width: 14, height: 10}}
                  source={require('../assests/YoutubeIcon.png')}
                />
                <Spacer horizontal space={4} />
                <Text style={[Font.Caption01_12_R, Color.Neutral60]}>
                  Youtube verified comment
                </Text>
              </View>
              <Spacer space={4} />
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={[Font.Caption01_12_R, Color.Black100]}>
                  {props.youtubeComment}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Icon name="thumbs-up-outline" size={12} color="black" />
              <Spacer space={4} horizontal />
              <Text style={[Font.Caption01_12_R, Color.Black100]}>
                {props.youtubeCommentLikes}
              </Text>
            </View>
          </View>
        ) : (
          <></>
        )}
        <Spacer space={20} />
        {isLoading && <ActivityIndicator size="large" color="black" />}
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
              props.hashtags,
              props.youtubeComment,
              props.youtubeCommentLikes,
            )
          }>
          <Image
            source={{
              uri:
                props.videoThumbnail != null && props.videoThumbnail != ''
                  ? props.videoThumbnail
                  : 'https://i.ytimg.com/vi/iF-oJp4yYY0/mqdefault.jpg',
            }}
            style={{
              width: width,
              height: (width * 180) / 320,
            }}
            onLoad={handleImageLoad}
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
              {convertSecondsToTimeAssume(props.totalDuration.toString())}
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
                ? `${convertSecondsToTime(props.myDuration)}`
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
          boardTime={props.boardTime}
          onPressShare={() => onPressShare(props.boardID)}
        />
        {/* <Spacer space={15} />
      <Text style={[Font.Caption01_12_R, {marginHorizontal: 16}]}>
        {props.boardTime}
      </Text> */}
        <Spacer space={15} />
        <Divider width={6} color="#F2F4F9" />
        <Spacer space={12} />
      </ViewShot>
    </View>
  );
};

export default FeedListItem;
