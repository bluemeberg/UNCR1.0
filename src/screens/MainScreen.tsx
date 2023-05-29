import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useNavigationState,
  useRoute,
  useScrollToTop,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Alert,
  AppState,
  FlatList,
  Image,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button} from '../components/Button';
import FeedListItem from '../components/FeedListItem';
import {Header} from '../components/Header/Header';
import {LocalImage} from '../components/LocalImage';
import {Spacer} from '../components/Spacer';
import {Typography} from '../components/Typography';
import data from '../FeedMock.json';
import {
  useMainNavigation,
  useMainRoute,
} from '../navigation/MainFeedNavigation';
import {
  useRootNavigation,
  useRootRoute,
} from '../navigation/RootStackNavigation';
import '@ethersproject/shims';
import {ethers} from 'ethers';
import {useWalletConnect} from '@walletconnect/react-native-dapp';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Contract from '../UNCRAgent.json';
import {parseEther} from 'ethers/lib/utils';
import {sleep} from '../utils/sleep';
import {useWalletConnectNavigation} from '../navigation/WalletConnectNavigation';
import {RemoteImage} from '../components/RemoteImage';
import {useDispatch, useSelector} from 'react-redux';
import {connectGuestAccount, TypeGuestDispatch} from '../actions/guestAccount';
import {UncrRootReducer} from '../uncrStore';
import {GuestAccountInfo} from '../@types/GuestAccountInfo';
import {getMainFeedList, TypeMainFeedListDispatch} from '../actions/mainFeed';
import {MainFeedInfo} from '../@types/MainFeedInfo';
import axios from 'axios';
import {
  createAxiosLocalServerInstance,
  createAxiosServerInstance,
} from '../utils/AxiosUtils';
import MetaMaskSDK from '@metamask/sdk';
import BackgroundTimer from 'react-native-background-timer';
import {
  connectAgentAccount,
  getAccountFeedList,
  TypeAgentAccountDispatch,
} from '../actions/agentAccount';
import {AgentAccountInfo} from '../@types/AgentAccountInfo';
import {getData, removeData} from '../utils/AsyncStorageUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Font} from '../utils/FontStyle';
import {Color} from '../utils/ColorStyle';
import {getAgentFeedList} from '../actions/agentFeed';
import {
  useBottomTabNavigation,
  useBottomTabRoute,
} from '../navigation/BottomTabNavigation';
import EventEmitter from 'events';
import {TypeMyAccountDispatch} from '../actions/myFeed';

const sdk = new MetaMaskSDK({
  openDeeplink: link => {
    Linking.openURL(link);
  },
  timer: BackgroundTimer,
  dappMetadata: {
    name: 'React Native Test Dapp',
    url: 'example.com',
  },
});

const ethereum = sdk.getProvider();

const provider = new ethers.providers.Web3Provider(ethereum);

export const MainScreen: React.FC = ({}) => {
  const isFoucsed = useIsFocused();
  console.log('focued main', isFoucsed);
  const connector = useWalletConnect();
  // const navigation = useMainNavigation<'MainFeed'>();
  const rootNavigation = useRootNavigation<'Main'>();
  const walletNavigation = useWalletConnectNavigation();
  const bottomTabNavigation = useBottomTabNavigation<'Home'>();
  const [GuestID, setGuestID] = useState<number>(0);
  const [AgentID, setAgentID] = useState<number>(0);
  const route = useMainRoute<'MainFeed'>();
  const routes = useBottomTabRoute<'Home'>();
  const [walletAddress, setWalletAddress] = useState<string>('');

  // 게스트 계정 정보 가져오기
  const guestInfo = useSelector<UncrRootReducer, GuestAccountInfo | null>(
    state => {
      return state.guestInfo.guestInfo;
    },
  );
  // Agent 계정 정보 가져오기
  console.log('route', routes);
  const agentInfo = useSelector<UncrRootReducer, AgentAccountInfo | null>(
    state => {
      return state.accountInfo.accountInfo;
    },
  );

  const onPressWalletConnect = useCallback(async () => {
    if (Platform.OS === 'android') {
      const loginInfo = await AsyncStorage.getItem('agentInfo');
      if (connector.connected || loginInfo !== null) {
        console.log('login');
        return;
      }
      // const index = useNavigationState(state => state.index);
      // console.log(index);
      // const state = useNavigationState(state => state);
      // console.log(state);
      Alert.alert(
        'Guide',
        'We might be installed Metamask APP in our mobile.',
        [
          {
            text: 'Already done',
            onPress: async () => {
              const doConnect = await connector.connect();
              rootNavigation.navigate('WalletConnect', {
                screen: 'SignIn',
                params: {
                  // 연결된 지갑 주소 전달 (서버)
                  walletAddress: doConnect.accounts[0],
                  // walletAddress: '0x10aa522db145917c2a40bfef17ed9b9d10cdc7d1',
                },
              });
            },
          },
          {
            text: 'Need to install',
            onPress: async () => {
              await Linking.openURL('market://details?id=io.metamask');
            },
          },
          // 한개의 선택지를 더 추가해 줬다
        ],
        {cancelable: false},
      );
    } else if (Platform.OS === 'ios') {
      const loginInfo = await AsyncStorage.getItem('agentInfo');
      if (connector.connected || loginInfo !== null) {
        console.log('login');
        return;
      }
      const doConnect = await connector.connect();
      // rootNavigation.reset({
      //   index: 0,
      //   routes: [
      //     {
      //       name: 'WalletConnect',
      //       params: {
      //         walletAddress: '0x10aa522db145917c2a40bfef17ed9b9d10cdc7d1',
      //       },
      //     },
      //   ],
      // });
      rootNavigation.push('WalletConnect', {
        screen: 'SignIn',
        params: {
          // 연결된 지갑 주소 전달 (서버)
          walletAddress: doConnect.accounts[0],
          // // 로컬
          // walletAddress: '0x10aa522db145917c2a40bfef17ed9b9d10cdc7d1',
        },
      });
    }
  }, []);

  const [isLoginedOpen, setIsLoginedOpen] = useState<boolean>(false);
  const onPressAgentLogin = async () => {
    if (isLoginedOpen) {
      setIsLoginedOpen(false);
      return;
    }
    setIsLoginedOpen(true);
  };

  // for DEMO
  const onReadyDemo = async () => {
    // // agent/add 호출
    console.log('add agent');
    const result = await createAxiosServerInstance().post('/agent/add', {
      agentID: 46,
      agentNickname: 'yeorae',
      agentURI: `https://uncr.io/46.png`,
    });
    console.log(result);
    // agent dispatch 생성 정보
  };
  const onReadyWalletPairDemo = async () => {
    console.log('wallet');
    const result = await createAxiosServerInstance().post('/wallet/pair', {
      walletAddress: '0x3f06b3c8d89E557650BF19940F3Bc33D460b0D39',
      agentID: '46',
    });
    console.log(result);
  };

  const onReadyWalletGETDemo = async () => {
    console.log('wallet');
    const result = await createAxiosServerInstance().get('/wallet/get', {
      params: {
        walletAddress: '0x3f06b3c8d89E557650BF19940F3Bc33D460b0D39',
      },
    });
    console.log(result.data.agentID);
  };

  const agentDispatch = useDispatch<TypeAgentAccountDispatch>();
  const feedDispatch = useDispatch<TypeMainFeedListDispatch>();
  const myPageDispatch = useDispatch<TypeMyAccountDispatch>();
  const feedList = useSelector<UncrRootReducer, MainFeedInfo[]>(
    state => state.mainFeedList.list,
  );

  // const onPressLogout = async () => {
  //   await connector.killSession();
  //   agentDispatch(connectAgentAccount(null, 0, null));
  //   await sleep(1000);
  //   await AsyncStorage.removeItem('agentInfo');
  //   setAgentID(0);
  //   setIsLoginedOpen(false);
  //   feedDispatch(getMainFeedList('null'));
  // };

  // 로그인 됐을 때 function
  async function getLoginedAgnetID() {
    const result = await AsyncStorage.getItem('agentInfo');
    if (result != null) {
      const data = JSON.parse(result ?? '');
      // console.log('storage', JSON.parse(result ?? ''));
      setAgentID(data[1].agentNumber);
      feedDispatch(
        connectAgentAccount(
          data[0].walletAddress,
          data[1].agentNumber,
          data[2].agentName,
        ),
      );
      feedDispatch(getMainFeedList(data[1].agentNumber.toString()));
      // 나의 페이지 불러오기
      agentDispatch(getMainFeedList(data[1].agentNumber.toString()));
      return result;
    } else {
      feedDispatch(getMainFeedList('null'));
    }
  }

  useEffect(() => {
    getLoginedAgnetID();
  }, []);

  // 앱을 다시 스타트했을 때 이전 화면으로 이동시키는 effect 필요
  // useEffect(() => {
  //   rootNavigation.push('WatchingVideo', {
  //     boardID: 20,
  //     videoId: 'xcv',
  //     myDuration: 234,
  //     totalDuration: 23,
  //     totalWatchers: 23,
  //     totalComments: 23,
  //     totalLikes: 23,
  //     isLiked: true,
  //     boardContent: '"sdf',
  //     boardTime: 'sdf',
  //     agentNickName: 'sdf',
  //     channelThumnail: 'sdfas',
  //     channelTitle: 'sdf',
  //     boardAgnetID: '23',
  //     index: 4,
  //   });
  // }, []);

  // agent 계정 로그인 여부 확인
  console.log('login status main screen', agentInfo);

  useEffect(() => {
    if (agentInfo !== null) {
      console.log('agent login');
      setAgentID(agentInfo.agentNumber);
      setWalletAddress(agentInfo.walletAddress ?? '');
      feedDispatch(getMainFeedList(agentInfo.agentNumber.toString()));
      return;
    }
    console.log('agent not login');
    console.log(route.params?.AgentID);
  }, [agentInfo]);

  // guest 계정로그인 여부 확인
  useEffect(() => {
    if (route.params?.GuestID) {
      console.log('hi3');
      console.log(route.params?.GuestID);
      setGuestID(route.params?.GuestID);
      setWalletAddress(route.params?.walletAddress ?? '');
      return;
    }
    console.log('hi4');
    console.log(route.params?.GuestID);
  }, [route.params?.GuestID]);

  const flatlistRef = useRef<FlatList>(null);

  const focused = useIsFocused();
  console.log('main', focused);
  let [tabPressCount, setTabPressCount] = useState(0);

  // useEffect(() => {
  //   if (focused) {
  //     setTabPressCount(true);
  //     console.log('mainTab', tabPressCount);
  //   }
  // }, [routes]);

  // bottom tab 이동 시 기존 스크린 유지 후 한번 더 탭했을 때 스크롤 초기화 되는 기능 구현
  useEffect(() => {
    setTabPressCount(0);
    console.log(tabPressCount);
  }, [focused]);
  console.log('hi', routes);

  useEffect(() => {
    // flatlistRef.current?.scrollToOffset({animated: true, offset: 0});
    setTabPressCount(prev => prev + 1);
    if (tabPressCount > 0) {
      flatlistRef.current?.scrollToOffset({animated: true, offset: 0});
      // if (flatlistRef.current) {
      //   flatlistRef.current?.scrollToIndex({index: 0});
      // }
    }
    // setTimeout(() => {
    //   if (tabPressCount > 0) {
    //     if (flatlistRef.current) {
    //       flatlistRef.current?.scrollToOffset({animated: true, offset: 0});
    //     }
    //   }
    // }, 10);
  }, [routes]);

  // useScrollToTop(flatlistRef);
  const onPressFunction = () => {
    flatlistRef.current?.scrollToIndex({index: 0});
  };

  const safeArea = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    console.log('agent info', agentInfo);
    try {
      let loginInfo = await AsyncStorage.getItem('agentInfo');
      loginInfo = JSON.parse(loginInfo);
      console.log('login info', loginInfo[1].agentNumber);
      if (loginInfo === null) {
        feedDispatch(getMainFeedList('null'));
      } else if (loginInfo != null) {
        feedDispatch(getMainFeedList(loginInfo[1].agentNumber));
      }
    } catch (e) {
      console.log(e);
      feedDispatch(getMainFeedList('null'));
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  const [appState, setAppState] = useState(AppState.currentState);
  const handleAppStateChange = async newAppState => {
    setAppState(newAppState);
    console.log('App state changed:', newAppState);
    if (newAppState === 'active') {
    } else if (newAppState === 'inactive') {
      await AsyncStorage.removeItem('initial');
    } else if (newAppState === 'background') {
      await AsyncStorage.setItem('initial', '0');
    }
  };
  useEffect(() => {
    Linking.getInitialURL() // 최초 실행 시에 Universal link 또는 URL scheme요청이 있었을 때 여기서 찾을 수 있음
      .then(value => {
        // Alert.alert('getInitialURL', value);
        const regex = /\/(\d+)$/;
        const match = value.match(regex);
        if (match) {
          const number = parseInt(match[1], 10);
          console.log(number);
          setTimeout(() => {
            flatlistRef.current?.scrollToIndex({index: number});
          }, 100);
        }
        const route = value.replace(/.*?:\/\//g, '');
        console.log('deep link', route);
      });
    Linking.addEventListener('url', e => {
      // 앱이 실행되어있는 상태에서 요청이 왔을 때 처리하는 이벤트 등록
      const regex = /\/(\d+)$/;
      const match = e.url.match(regex);
      if (match) {
        const number = parseInt(match[1], 10);
        console.log(number);
        setTimeout(() => {
          flatlistRef.current?.scrollToIndex({index: number});
        }, 100);
      }
      const route = e.url.replace(/.*?:\/\//g, '');
      console.log('deep link external', route);
    });
    const listener = AppState.addEventListener('change', handleAppStateChange);
    // Remove the event listener on unmount
    return () => {
      listener.remove();
    };
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Header>
        <Image
          source={require('../assests/HeaderLogo1.png')}
          style={{width: 72, height: 21.53}}
        />
        {/* {connector.connected && GuestID !== 0 ? (
          <Header.Icon
            name="person-circle"
            onPress={onPressWalletConnect}
            size={24}
            color="black"
          />
        ) : AgentID != 0 ? (
          <Button onPress={onPressAgentLogin}>
            <Image
              source={{uri: `https://uncr.io/${AgentID}.png`}}
              style={{width: 32, height: 32, borderRadius: 8}}
            />
          </Button>
        ) : (
          <Header.Icon
            name="wallet-outline"
            color="black"
            onPress={onPressWalletConnect}
            size={20}
          />
        )} */}
        <Header.Icon
          name="notifications-outline"
          onPress={() => {
            rootNavigation.push('Alarm');
          }}
          size={20}
          color="black"
        />
      </Header>
      {isFoucsed === false ? (
        <Pressable
          style={[
            StyleSheet.absoluteFill,
            {backgroundColor: 'rgba(0, 0, 0, 0.3)', zIndex: 1},
          ]}
        />
      ) : (
        <></>
      )}

      {/* {isLoginedOpen && (
        <View
          style={[
            {
              backgroundColor: '#7400DB',
              position: 'absolute',
              right: 10,
              top: safeArea.top + 50,
              width: 100,
              height: 80,
              zIndex: 1,
              borderRadius: 10,
            },
          ]}>
          <Spacer space={10} />

          <Button onPress={onPressLogout}>
            <Text
              style={[
                Font.Headline_20_SM,
                {color: 'white', textAlign: 'center'},
              ]}>
              Logout
            </Text>
          </Button>
          <Spacer space={10} />
          <Button onPress={() => {}}>
            <Text
              style={[
                Font.Headline_20_SM,
                {color: 'white', textAlign: 'center'},
              ]}>
              Rewards
            </Text>
          </Button>
        </View>
      )} */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View
            style={{borderWidth: 1, borderColor: '#DDDDDD', borderRadius: 4}}>
            <Image
              style={{width: 16, height: 16, margin: 6}}
              source={require('../assests/NationFitlerBF.png')}
            />
          </View>
          <Spacer horizontal space={12} />
          <View
            style={{
              borderWidth: 1,
              borderColor: '#DDDDDD',
              borderRadius: 4,
              backgroundColor: '#7400DB',
            }}>
            <Text
              style={[
                Font.Body_14_R,
                Color.White100,
                {marginHorizontal: 12, marginVertical: 5},
              ]}>
              All
            </Text>
          </View>
          <Spacer horizontal space={8} />
          <View
            style={{borderWidth: 1, borderColor: '#DDDDDD', borderRadius: 4}}>
            <Text
              style={[
                Font.Body_14_R,
                Color.Black100,
                {marginHorizontal: 12, marginVertical: 5},
              ]}>
              Daily Trend
            </Text>
          </View>
          <Spacer horizontal space={8} />
          <View
            style={{borderWidth: 1, borderColor: '#DDDDDD', borderRadius: 4}}>
            <Text
              style={[
                Font.Body_14_R,
                Color.Black100,
                {marginHorizontal: 12, marginVertical: 5},
              ]}>
              Weekly Trend
            </Text>
          </View>
          <Spacer horizontal space={8} />
          <View
            style={{borderWidth: 1, borderColor: '#DDDDDD', borderRadius: 4}}>
            <Text
              style={[
                Font.Body_14_R,
                Color.Black100,
                {marginHorizontal: 12, marginVertical: 5},
              ]}>
              Montly Trend
            </Text>
          </View>
        </ScrollView>
      </View>
      <Spacer space={10} />

      <FlatList
        data={feedList}
        // data={data.items}
        ref={flatlistRef}
        // onContentSizeChange={() =>
        //   flatlistRef.current?.scrollToOffset({offset: 0})
        // }
        keyExtractor={item => item.boardID.toString()}
        refreshControl={
          <RefreshControl
            tintColor="black"
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
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
              hashtags={item.hashtags}
              index={index}
            />
          );
        }}
      />
    </View>
  );
};
