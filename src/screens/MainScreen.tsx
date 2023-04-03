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
  FlatList,
  Image,
  Linking,
  Platform,
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
  const feedList = useSelector<UncrRootReducer, MainFeedInfo[]>(
    state => state.mainFeedList.list,
  );

  const onPressLogout = async () => {
    await connector.killSession();
    agentDispatch(connectAgentAccount(null, 0, null));
    await sleep(1000);
    await AsyncStorage.removeItem('agentInfo');
    setAgentID(0);
    setIsLoginedOpen(false);
    feedDispatch(getMainFeedList('null'));
  };

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
      agentDispatch(getAccountFeedList(data[1].agentNumber.toString()));
      return result;
    } else {
      feedDispatch(getMainFeedList('null'));
    }
  }

  useEffect(() => {
    getLoginedAgnetID();
  }, []);

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

  useEffect(() => {
    setTabPressCount(prev => prev + 1);
    setTimeout(() => {
      if (tabPressCount > 0) {
        if (flatlistRef.current) {
          flatlistRef.current?.scrollToIndex({index: 0});
        }
      }
    }, 500);
  }, [routes]);

  // useScrollToTop(flatlistRef);
  const onPressFunction = () => {
    flatlistRef.current?.scrollToIndex({index: 0});
  };

  const safeArea = useSafeAreaInsets();

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
          onPress={() => {}}
          size={20}
        />
      </Header>

      {isLoginedOpen && (
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
      )}
      <View
        style={{
          flexDirection: 'row',
          height: 40,
          backgroundColor: 'gray',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Typography fontSize={14}>Filter zone</Typography>
      </View>
      <Spacer space={10} />
      <FlatList
        data={feedList}
        ref={flatlistRef}
        // onContentSizeChange={() =>
        //   flatlistRef.current?.scrollToOffset({offset: 0})
        // }
        keyExtractor={item => item.boardID.toString()}
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
