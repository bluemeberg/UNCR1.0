import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Linking,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import YoutubeIframe from 'react-native-youtube-iframe';
import {useDispatch, useSelector} from 'react-redux';
import {transformer} from '../../metro.config';
import {AgentAccountInfo} from '../@types/AgentAccountInfo';
import {MainFeedInfo} from '../@types/MainFeedInfo';
import {
  getMainFeedList,
  TypeMainFeedListActions,
  TypeMainFeedListDispatch,
} from '../actions/mainFeed';
import {Button} from '../components/Button';
import {Divider} from '../components/Divider';
import FeedListItem from '../components/FeedListItem';
import {Font} from '../utils/FontStyle';
import {Header} from '../components/Header/Header';
import {Icon} from '../components/Icon';
import {Spacer} from '../components/Spacer';
import {Typography} from '../components/Typography';
import {VideoTimer} from '../components/VideoTimer';
import {
  useRootNavigation,
  useRootRoute,
} from '../navigation/RootStackNavigation';
import {UncrRootReducer} from '../uncrStore';
import {
  createAxiosLocalServerInstance,
  createAxiosServerInstance,
} from '../utils/AxiosUtils';
import {sleep} from '../utils/sleep';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FeedListBottom} from '../components/FeedListBottom';

export const WatchingVideoScreen: React.FC = () => {
  const {width, height} = useWindowDimensions();
  const routes = useRootRoute<'WatchingVideo'>();
  console.log(routes);
  const rootNavigation = useRootNavigation<'WatchingVideo'>();
  const navigation = useNavigation();
  const onPress = useCallback(() => {
    rootNavigation.popToTop();
  }, []);
  const safeArea = useSafeAreaInsets();
  const [playing, setPlaying] = useState(false);
  const [videoCount, setVideoCount] = useState<number>(0);
  const updateTime = useMemo(() => {
    return videoCount;
  }, [videoCount]);
  // componentWillMount와 유사한 기능
  const agentInfo = useSelector<UncrRootReducer, AgentAccountInfo | null>(
    state => {
      return state.accountInfo.accountInfo;
    },
  );
  const valueRef = useRef<number>();
  const playerRef = useRef<any>();
  const dispatch = useDispatch<TypeMainFeedListDispatch>();

  useEffect(() => {
    valueRef.current = videoCount;
  }, [videoCount]);

  const flatlistRef = useRef<FlatList>(null);
  useEffect(() => {
    setTimeout(() => {
      if (flatlistRef.current) {
        flatlistRef.current?.scrollToIndex({index: routes.params.index});
      }
    }, 500);
  }, []);
  useEffect(() => {
    return () => {
      // watching duration time post
      const fetchWatchingTime = async () => {
        console.log(valueRef.current);
        try {
          // // 서버
          // await createAxiosServerInstance().post('/feed/watch', {
          //   agentID: agentInfo?.agentNumber,
          //   boardID: routes.params.boardID,
          //   duration: valueRef.current,
          // });
          // 로컬
          await createAxiosServerInstance().post('/feed/watch', {
            agentID: agentInfo?.agentNumber,
            boardID: routes.params.boardID,
            duration: valueRef.current,
          });
        } catch (error) {
          console.log(error);
        }
      };
      if (agentInfo != null && agentInfo.agentNumber !== 0) {
        console.log('upload watching time');
        fetchWatchingTime();
        setTimeout(() => {
          dispatch(
            getMainFeedList(agentInfo?.agentNumber.toString() ?? 'null'),
          );
        }, 500);
      }
    };
    // main feed 다시 불러오기?
  }, []);
  const onSeekForward = () => {
    console.log('seek');
    playerRef.current
      ?.getCurrentTime()
      .then((currentTime: number) =>
        playerRef.current?.seekTo(5 + currentTime, true),
      );
    // playerRef.current?.seekTo(5, true);
  };

  const onSeekBackward = () => {
    console.log('seek');
    playerRef.current
      ?.getCurrentTime()
      .then((currentTime: number) =>
        playerRef.current?.seekTo(currentTime - 5, true),
      );
    // playerRef.current?.seekTo(5, true);
  };

  const onPressYoutube = () => {};
  let feedList = useSelector<UncrRootReducer, MainFeedInfo[]>(
    state => state.mainFeedList.list,
  );

  feedList = feedList.filter(feed => feed.boardID !== routes.params.boardID);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <Header>
        <Header.Icon
          name="arrow-back"
          size={20}
          onPress={onPress}
          color="black"
        />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 40,
          }}>
          <Text style={[Font.Body_16_R, {color: 'black'}]}>Watch</Text>
          <Text style={[Font.Body_16_R, {color: 'black'}]}>
            {agentInfo?.agentName ?? null}
          </Text>
        </View>
        <Button
          onPress={() => {
            Linking.openURL(`vnd.youtube://watch?v=${routes.params.videoId}`);
          }}>
          <View
            style={{
              borderColor: '#CCD4DF',
              borderWidth: 1,
              width: 80,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
            }}>
            <Text style={[Font.Caption01_12_R, {color: 'black'}]}>
              To Youtube
            </Text>
          </View>
        </Button>
      </Header>
      <View
        style={{
          // width: Dimensions.get('window').height,
          // height: Dimensions.get('window').width,
          // borderColor: 'red',
          // borderWidth: 4,
          // transform: [{rotate: '90deg'}],
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            // borderColor: 'red',
            // borderWidth: 4,
          }}>
          {/* 영상 위에 올리기  */}
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 60,
              zIndex: 1,
            }}>
            <TouchableOpacity onPress={onSeekBackward}>
              <View style={{width: 80, height: 100}} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              position: 'absolute',
              right: 0,
              top: 60,
              zIndex: 1,
            }}>
            <TouchableOpacity onPress={onSeekForward}>
              <View style={{width: 80, height: 100}} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              position: 'absolute',
              zIndex: 1,
              top: 0,
            }}>
            <TouchableOpacity>
              <View style={{width: width, height: 60}} />
            </TouchableOpacity>
          </View>
          <YoutubeIframe
            // webViewStyle={{borderColor: 'red', borderWidth: 4}}
            // height={180 * (height / width)}
            // width={320 * (height / width)}
            height={(width * 180) / 320}
            width={width}
            videoId={routes.params.videoId}
            ref={playerRef}
            initialPlayerParams={{
              loop: true,
              rel: true,
              showClosedCaptions: true,
              modestbranding: true,
            }}
            onChangeState={e => {
              console.log(e);
              if (e === 'playing') {
                setPlaying(true);
              } else if (e === 'paused') {
                setPlaying(false);
              } else if (e === 'buffering') {
                setPlaying(false);
              }
            }}
          />
        </View>
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
              {routes.params.totalDuration.toString()} sec
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
              {routes.params.totalWatchers.toString()}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {agentInfo != null && agentInfo.agentNumber !== 0 ? (
              <MaterialCommunityIcons name="account-clock-outline" size={16} />
            ) : (
              <></>
            )}
            <Spacer horizontal space={4} />
            <Text style={Font.Caption01_14_B}>
              {routes.params.myDuration != null &&
              agentInfo != null &&
              agentInfo.agentNumber !== 0
                ? `${routes.params.myDuration + videoCount} sec`
                : '--:--:--'}
            </Text>
          </View>
        </View>
        <Spacer space={20} />
        <FeedListBottom
          feedCommentNumber={routes.params.totalComments}
          feedLikeNumber={routes.params.totalLikes}
          isLiked={routes.params.isLiked}
          boardID={routes.params.boardID}
          boardContent={routes.params.boardContent}
          agentNickName={routes.params.agentNickName}
          channelThumnaial={routes.params.channelThumnail}
          channelTitle={routes.params.channelTitle}
          boardAgnetID={routes.params.boardAgnetID}
        />
        {playing && <VideoTimer setVideoCount={setVideoCount} />}
        {/* <Typography fontSize={20}>{videoCount.toString()}</Typography>

        <Typography fontSize={20}>
          {routes.params.myDuration != null
            ? (routes.params.myDuration + videoCount).toString()
            : '--:--:--'}
        </Typography> */}
        <Spacer space={15} />
        <Text style={[Font.Caption01_12_R, {marginHorizontal: 16}]}>
          {routes.params.boardTime}
        </Text>
        <Spacer space={15} />
        <Divider width={6} color="#F2F4F9" />
        <FlatList
          data={feedList}
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
    </View>
  );
};
