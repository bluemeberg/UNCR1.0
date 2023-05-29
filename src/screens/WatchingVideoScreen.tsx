import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Linking,
  StyleSheet,
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
import {Color} from '../utils/ColorStyle';
import {getModel} from 'react-native-device-info';
import {convertSecondsToTime, timeToMetric} from '../utils/MetricUtils';

export const WatchingVideoScreen: React.FC = () => {
  const {width, height} = useWindowDimensions();
  const routes = useRootRoute<'WatchingVideo'>();
  // console.log(routes);
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
  // console.log('watch', agentInfo);
  const valueRef = useRef<number>();
  const playerRef = useRef<any>();
  const playerFullRef = useRef<any>();
  const dispatch = useDispatch<TypeMainFeedListDispatch>();

  useEffect(() => {
    valueRef.current = videoCount;
  }, [videoCount]);

  const flatlistRef = useRef<FlatList>(null);
  // useEffect(() => {
  //   setTimeout(() => {
  //     if (flatlistRef.current) {
  //       flatlistRef.current?.scrollToIndex({index: routes.params.index});
  //     }
  //   }, 1000);
  // }, []);

  const device = getModel();
  console.log(device);

  // console.log('agentNumber', agentInfo?.agentNumber);
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

  const onPlay = () => {
    if (fullScreenPlayToNormal === false) {
      setFullScreenPlayToNormal(true);
    } else {
      setFullScreenPlayToNormal(false);
    }
  };

  const onSeekForward = () => {
    console.log('seek forward');
    {
      fullScreen === true
        ? playerFullRef.current
            ?.getCurrentTime()
            .then((currentTime: number) =>
              playerFullRef.current?.seekTo(5 + currentTime, true),
            )
        : playerRef.current
            ?.getCurrentTime()
            .then((currentTime: number) =>
              playerRef.current?.seekTo(5 + currentTime, true),
            );
    }
    // playerRef.current?.seekTo(5, true);
  };

  const onSeekBackward = () => {
    console.log('seek');
    {
      fullScreen === true
        ? playerFullRef.current
            ?.getCurrentTime()
            .then((currentTime: number) =>
              playerFullRef.current?.seekTo(currentTime - 5, true),
            )
        : playerRef.current
            ?.getCurrentTime()
            .then((currentTime: number) =>
              playerRef.current?.seekTo(currentTime - 5, true),
            );
    }
    // playerRef.current?.seekTo(5, true);
  };

  const onPressYoutube = () => {};
  let feedList = useSelector<UncrRootReducer, MainFeedInfo[]>(
    state => state.mainFeedList.list,
  );

  // feedList = feedList.filter(feed => feed.boardID !== routes.params.boardID);
  const watchFeed = feedList.filter(
    feed => feed.boardID === routes.params.boardID,
  );
  feedList = feedList.filter(feed => feed.boardID < routes.params.boardID);
  // console.log('watchFeed', watchFeed);
  const [fullScreen, setFullScreen] = useState(false);
  const insets = useSafeAreaInsets();
  const [fullScreenLoading, setFullScreenLoading] = useState(false);
  const [fullScreenTime, setFullScreenTime] = useState<number>();
  // console.log('loading', fullScreenLoading);
  let [fullScreenPlayToNormal, setFullScreenPlayToNormal] = useState(false);
  let [screenSaver, setScreenSaver] = useState(false);
  const [duration, setDuration] = useState();
  // console.log('duration', duration);

  const fullScreenWidth =
    device === 'iPhone 14 Pro'
      ? 320 * (height / width)
      : device === 'iPhone 14 Pro Max'
      ? 320 * ((height / width) * 1.14)
      : device === 'iPhone SE'
      ? 320 * (height / width) * 1.135
      : device === 'SM-G965N'
      ? 320 * (height / width) * 1.05
      : device === 'SM-G906'
      ? 320 * (height / width) * 1.45
      : 320 * (height / width);

  const fullScreenHeight =
    device === 'iPhone 14 Pro'
      ? 180 * (height / width)
      : device === 'iPhone 14 Pro Max'
      ? 180 * ((height / width) * 1.14)
      : device === 'iPhone SE'
      ? 180 * (height / width) * 1.135
      : device === 'SM-G965N'
      ? 180 * (height / width) * 1.05
      : device === 'SM-G906'
      ? 180 * (height / width) * 1.45
      : 180 * (height / width);

  //  height={180 * ((height / width) * 1.1)}
  //  width={320 * ((height / width) * 1.1)}

  const fullScreenButtonPosition =
    device === 'iPhone 11 Pro'
      ? 168
      : device === 'iPhone 14 Pro Max'
      ? 200
      : device === 'SM-G965N'
      ? 160
      : device === 'SM-G906'
      ? 260
      : device === 'iPhone 14'
      ? 176
      : 168;

  console.log('full', fullScreenButtonPosition);
  console.log('screen saver', screenSaver);
  const seekForwardButtonHeight =
    device === 'iPhone 11 Pro' ? 40 : device === 'iPhone 14 Pro Max' ? 60 : 40;
  const seekBackwardButtonHeight =
    device === 'iPhone 11 Pro' ? 40 : device === 'iPhone 14 Pro Max' ? 60 : 40;

  const time = timeToMetric(routes.params.boardTime);

  return fullScreen === true ? (
    <View
      style={{
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: insets.top,
      }}>
      <View
        style={{
          width: Dimensions.get('window').height,
          height: Dimensions.get('window').width,
          // borderColor: 'red',
          // borderWidth: 4,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{rotate: '90deg'}],
          // width: Dimensions.get('window').width,
          // height: Dimensions.get('window').height,
          flex: 1,
        }}>
        {fullScreenLoading && (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                zIndex: 1,
                display: 'flex',
              },
            ]}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="large" color="white" />
              <Spacer space={4} />
              <Text
                style={{
                  fontSize: 16,
                  color: 'white',
                }}>
                Convert to full screen
              </Text>
            </View>
          </View>
        )}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: 'rgba(0,0,0,0.15)',
          }}>
          {/* {fullScreenPlayToNormal === true && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                // backgroundColor: 'rgba(0,0,0,0.15)',
                zIndex: 1,
              }}>
              <TouchableOpacity
                onPress={() => {
                  console.log('screen saver', screenSaver);
                  if (screenSaver === false) {
                    setScreenSaver(true);
                  } else {
                    setScreenSaver(false);
                  }
                }}>
                <View
                  style={{
                    width: fullScreenWidth,
                    height: fullScreenHeight - 60,
                  }}></View>
              </TouchableOpacity>
            </View>
          )} */}
          {/* {fullScreenPlayToNormal === true && screenSaver === true && (
            <>
              <View
                style={{
                  position: 'absolute',
                  left: fullScreenWidth / 5 - 40,
                  top: fullScreenHeight / 2 - 40,
                  zIndex: 2,
                }}>
                <TouchableOpacity onPress={onSeekBackward}>
                  <Icon name="play-back-outline" size={60} />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  position: 'absolute',
                  right: fullScreenWidth / 5 - 40,
                  top: fullScreenHeight / 2 - 40,
                  zIndex: 2,
                }}>
                <TouchableOpacity onPress={onSeekForward}>
                  <Icon name="play-forward-outline" size={60} />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  position: 'absolute',
                  right: fullScreenWidth / 2 - 40,
                  top: fullScreenHeight / 2 - 40,
                  zIndex: 2,
                }}>
                <TouchableOpacity onPress={onPlay}>
                  <Icon name="play-outline" size={80} />
                </TouchableOpacity>
              </View>
            </>
          )} */}
          <View
            style={{
              position: 'absolute',
              zIndex: 1,
              top: 0,
              right: 0,
              // backgroundColor: 'gray',
            }}>
            <TouchableOpacity>
              <View style={{width: width, height: 60}} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              position: 'absolute',
              zIndex: 2,
              right: 10,
              bottom: 10,
              // backgroundColor: 'black',
            }}>
            <TouchableOpacity
              onPress={async () => {
                playerFullRef.current
                  ?.getCurrentTime()
                  .then((currentTime: number) =>
                    setFullScreenTime(currentTime),
                  );
                await sleep(500);
                setFullScreen(false);
                setFullScreenPlayToNormal(true);
              }}>
              <View style={{width: 52, height: 32}} />
            </TouchableOpacity>
          </View>
          <YoutubeIframe
            // webViewStyle={{borderColor: 'red', borderWidth: 4}}
            height={fullScreenHeight}
            width={fullScreenWidth}
            videoId={routes.params.videoId}
            ref={playerFullRef}
            initialPlayerParams={{
              loop: false,
              rel: false,
              showClosedCaptions: true,
              modestbranding: true,
              preventFullScreen: false,
            }}
            onReady={() => {
              setFullScreenLoading(false);
              playerFullRef.current?.seekTo(fullScreenTime);
            }}
            play={fullScreenPlayToNormal}
            onChangeState={e => {
              console.log(e);
              if (e === 'playing') {
                setPlaying(true);
                setFullScreenPlayToNormal(true);
              } else if (e === 'paused') {
                setPlaying(false);
                setScreenSaver(false);
              } else if (e === 'buffering') {
                setPlaying(false);
              }
            }}
          />
          {/* <TouchableOpacity
            style={{backgroundColor: 'white'}}
            onPress={() => {
              if (fullScreenPlayToNormal === false) {
                console.log(fullScreenPlayToNormal);
                setFullScreenPlayToNormal(true);
              } else {
                setFullScreenPlayToNormal(false);
              }
            }}>
            <Text>play</Text>
          </TouchableOpacity> */}
          {playing && <VideoTimer setVideoCount={setVideoCount} />}
        </View>
      </View>
    </View>
  ) : (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: 'white',
        },
        fullScreen && {justifyContent: 'center', alignItems: 'center'},
      ]}>
      <Header>
        <View style={{justifyContent: 'center'}}>
          <Header.Icon
            name="arrow-back"
            size={20}
            onPress={onPress}
            color="black"
          />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 40,
          }}>
          <Text style={[Font.Headline_16_SM, {color: 'black'}]}>Watch</Text>
          <Text style={[Font.Caption01_12_R, Color.Neutral50]}>
            {routes.params.agentNickName ?? null}
          </Text>
        </View>
        <Button
          onPress={async () => {
            if (agentInfo?.agentNumber != 0) {
              await createAxiosServerInstance().post('board/surf', {
                agentID: agentInfo?.agentNumber,
                boardID: routes.params.boardID,
              });
            }
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
        style={[
          {
            // width: Dimensions.get('window').height,
            // height: Dimensions.get('window').width,
            // borderColor: 'red',
            // borderWidth: 4,
            // transform: [{rotate: '90deg'}],
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            flex: 1,
          },
          fullScreen && {
            width: Dimensions.get('window').height,
            height: Dimensions.get('window').width,
            borderColor: 'red',
            borderWidth: 4,
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{rotate: '90deg'}],
          },
        ]}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            // borderColor: 'red',
            // borderWidth: 4,
          }}>
          {/* 영상 위에 올리기  */}
          {/* <View
            style={{
              position: 'absolute',
              left: 0,
              top: seekForwardButtonHeight,
              zIndex: 1,
              // backgroundColor: 'gray',
            }}>
            <TouchableOpacity onPress={onSeekBackward}>
              <View style={{width: 80, height: 100}} />
            </TouchableOpacity>
          </View> */}
          {/* <View
            style={{
              position: 'absolute',
              right: 0,
              top: seekBackwardButtonHeight,
              zIndex: 1,
              // backgroundColor: 'gray',
            }}>
            <TouchableOpacity onPress={onSeekForward}>
              <View style={{width: 80, height: 100}} />
            </TouchableOpacity>
          </View> */}
          <View
            style={{
              position: 'absolute',
              zIndex: 1,
              top: 0,
              right: 0,
              // backgroundColor: 'gray',
            }}>
            <TouchableOpacity>
              <View style={{width: width / 3, height: 60}} />
            </TouchableOpacity>
          </View>
          {duration > 60 && (
            <View
              style={{
                position: 'absolute',
                zIndex: 1,
                right: 10,
                top: fullScreenButtonPosition,
                // backgroundColor: 'black',
              }}>
              <TouchableOpacity
                onPress={async () => {
                  playerRef.current
                    ?.getCurrentTime()
                    .then((currentTime: number) =>
                      setFullScreenTime(currentTime),
                    );
                  await sleep(500);
                  setFullScreen(true);
                  setFullScreenLoading(true);
                  setFullScreenPlayToNormal(true);
                }}>
                <View style={{width: 52, height: 40}} />
              </TouchableOpacity>
            </View>
          )}
          {/* {playing && (
            <View
              style={{
                position: 'absolute',
                zIndex: 1,
                top: 60,

                backgroundColor: 'black',
              }}>
              <TouchableOpacity>
                <View style={{width: width / 2, height: 100}} />
              </TouchableOpacity>
            </View>
          )} */}
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
            play={fullScreenPlayToNormal}
            onReady={() => {
              if (fullScreenTime != undefined) {
                playerRef.current?.seekTo(fullScreenTime);
              }
              playerRef.current
                ?.getDuration()
                .then(getDuration => setDuration(getDuration));
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
          {/* <TouchableOpacity
            onPress={() => {
              if (fullScreenPlayToNormal === false) {
                console.log(fullScreenPlayToNormal);
                setFullScreenPlayToNormal(true);
              } else {
                setFullScreenPlayToNormal(false);
              }
            }}>
            <Text>play</Text>
          </TouchableOpacity> */}
        </View>
        <View style={{flex: 1}}>
          <FlatList
            data={feedList}
            ref={flatlistRef}
            onScrollToIndexFailed={info => {
              // console.warn(
              //   `Failed to scroll to index ${info.index} from ${info.averageItemLength}`,
              // );
              const offset = info.averageItemLength * info.index;
              flatlistRef.current?.scrollToOffset({offset});
              setTimeout(() => {
                flatlistRef.current?.scrollToIndex({index: info.index});
              }, 100);
            }}
            ListHeaderComponent={() => {
              return (
                <>
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
                        <Icon
                          name="time-outline"
                          size={14}
                          color="rgba(0,0,0,0.5)"
                        />
                      </View>
                      <Spacer horizontal space={2} />
                      <Text style={Font.Caption01_14_R}>
                        {routes.params.myDuration != null &&
                        agentInfo != null &&
                        agentInfo.agentNumber !== 0
                          ? `${convertSecondsToTime(
                              routes.params.totalDuration + videoCount,
                            )} sec`
                          : `${convertSecondsToTime(
                              routes.params.totalDuration.toString(),
                            )} sec`}
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
                        <Icon
                          name="people-outline"
                          size={16}
                          color="rgba(0,0,0,0.5)"
                        />
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
                        <MaterialCommunityIcons
                          name="account-clock-outline"
                          size={16}
                        />
                      ) : (
                        <></>
                      )}
                      <Spacer horizontal space={4} />
                      <Text style={Font.Caption01_14_B}>
                        {routes.params.myDuration != null &&
                        agentInfo != null &&
                        agentInfo.agentNumber !== 0
                          ? `${convertSecondsToTime(
                              routes.params.myDuration + videoCount,
                            )} sec`
                          : '--:--:--'}
                      </Text>
                    </View>
                  </View>
                  <Spacer space={20} />
                  <View style={{paddingHorizontal: 16}}>
                    <Text style={[Font.Body_16_R, {color: 'black'}]}>
                      {routes.params.boardContent}
                    </Text>
                  </View>
                  <Spacer space={4} />
                  <View style={{flexDirection: 'row', paddingHorizontal: 16}}>
                    {routes.params.hashtags.map(item => (
                      <View style={{marginRight: 4}}>
                        <Text style={Color.Purple_Main}>#{item}</Text>
                      </View>
                    ))}
                  </View>
                  <Spacer space={20} />
                  {/* youtube comment */}
                  {routes.params.youtubeComment !== null ? (
                    <>
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
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Image
                              style={{width: 14, height: 10}}
                              source={require('../assests/YoutubeIcon.png')}
                            />
                            <Spacer horizontal space={4} />
                            <Text
                              style={[Font.Caption01_12_R, Color.Neutral60]}>
                              Youtube verified comment
                            </Text>
                          </View>
                          <Spacer space={4} />
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Text style={[Font.Caption01_12_R, Color.Black100]}>
                              {routes.params.youtubeComment}
                            </Text>
                          </View>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                          <Icon
                            name="thumbs-up-outline"
                            size={12}
                            color="black"
                          />
                          <Spacer space={4} horizontal />
                          <Text style={[Font.Caption01_12_R, Color.Black100]}>
                            {routes.params.youtubeCommentLikes}
                          </Text>
                        </View>
                      </View>
                      <Spacer space={20} />
                    </>
                  ) : (
                    <></>
                  )}
                  <FeedListBottom
                    feedCommentNumber={watchFeed[0].totalComments}
                    feedLikeNumber={watchFeed[0].totalLikes}
                    isLiked={watchFeed[0].myLike}
                    boardID={routes.params.boardID}
                    boardContent={routes.params.boardContent}
                    agentNickName={routes.params.agentNickName}
                    channelThumnaial={routes.params.channelThumnail}
                    channelTitle={routes.params.channelTitle}
                    boardAgnetID={routes.params.boardAgnetID}
                    boardTime={routes.params.boardTime}
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
                    {time}
                  </Text>
                  <Spacer space={15} />
                  <Divider width={6} color="#F2F4F9" />
                </>
              );
            }}
            renderItem={({item, index}) => {
              return (
                <View style={{}}>
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
                    youtubeComment={item.youtubeComment}
                    youtubeCommentLikes={item.youtubeCommentLikes}
                    videoThumbnail={item.videoThumbnail}
                    index={index}
                    hashtags={item.hashtags}
                  />
                </View>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
};
