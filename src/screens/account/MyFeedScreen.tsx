import MetaMaskSDK from '@metamask/sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useWalletConnect} from '@walletconnect/react-native-dapp';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  AppState,
  Linking,
  Platform,
  Text,
  TouchableOpacityComponent,
} from 'react-native';
import {Image, ImageBackground, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {AgentAccountInfo} from '../../@types/AgentAccountInfo';
import {MainFeedInfo} from '../../@types/MainFeedInfo';
import {
  connectAgentAccount,
  TypeAgentAccountDispatch,
} from '../../actions/agentAccount';
import {
  getMainFeedList,
  TypeMainFeedListDispatch,
} from '../../actions/mainFeed';
import {Button} from '../../components/Button';
import {Header} from '../../components/Header/Header';
import {Spacer} from '../../components/Spacer';
import {Typography} from '../../components/Typography';
import {useRootNavigation} from '../../navigation/RootStackNavigation';
import {UncrRootReducer} from '../../uncrStore';
import {Color} from '../../utils/ColorStyle';
import {Font} from '../../utils/FontStyle';
import {sleep} from '../../utils/sleep';
import SelectedAccountsScreen from '../AgentFeed/SelectedAccountsScreen';
import MyFeedComponentScreen from './MyFeedComponentScreen';
import BackgroundTimer from 'react-native-background-timer';
import {ethers} from 'ethers';
const sdk = new MetaMaskSDK({
  openDeeplink: link => {
    Linking.openURL(link);
  },
  timer: BackgroundTimer,
  dappMetadata: {
    name: 'Undercover Creators',
    url: 'https://uncr.io ',
  },
});
const MyFeedScreen: React.FC = () => {
  // agenetinfo 가져오기
  const agentInfo = useSelector<UncrRootReducer, AgentAccountInfo | null>(
    state => {
      return state.accountInfo.accountInfo;
    },
  );
  // null 이면 login
  // null 아니라면 myFeedScreen 표출
  const connector = useWalletConnect();
  const rootNavigation = useRootNavigation<'Main'>();

  const [isLoginedOpen, setIsLoginedOpen] = useState<boolean>(false);
  const onPressAgentLogin = async () => {
    if (isLoginedOpen) {
      setIsLoginedOpen(false);
      return;
    }
    setIsLoginedOpen(true);
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
    setIsLoginedOpen(false);
    feedDispatch(getMainFeedList('null'));
  };
  // 로그인 통해 지갑 연결 시키고,
  // 웹 소켓 연결해서 balance가 1보다 크면 계정 선택해서 고르게 하고
  // balance가 1이면 바로 로그인 끝 마이 페이지 네비게이션
  // balance가 0이면 회원 가입 페이지로 이동시켜 민트 딥링크 연결
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
      //   if (connector.connected || loginInfo !== null) {
      //     console.log('login');
      //     return;
      //   }
      //   const doConnect = await connector.connect();
      //   console.log(doConnect.accounts[0]);
      await Linking.openURL(
        'https://metamask.app.link/dapp/main--deluxe-moonbeam-cb4221.netlify.app/',
      );
      Linking.addEventListener('url', event => {
        console.log('Received deep link:', event.url);

        // Check if the deep link is from the MetaMask app
        if (
          event.url.startsWith(
            'https://metamask.app.link/dapp/main--deluxe-moonbeam-cb4221.netlify.app/',
          )
        ) {
          console.log('Returned from MetaMask app');

          // Do something here when the user returns from the MetaMask app
        }
      });

      //   const accounts = await ethereum.request({
      //     method: 'eth_requestAccounts',
      //   });
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
      //   rootNavigation.push('WalletConnect', {
      //     screen: 'SignIn',
      //     params: {
      //       // 연결된 지갑 주소 전달 (서버)
      //       walletAddress: doConnect.accounts[0],
      //       //   // 로컬
      //       //   walletAddress: '0x10aa522db145917c2a40bfef17ed9b9d10cdc7d1',
      //     },
      //   });
    }
  }, []);
  const safeArea = useSafeAreaInsets();
  const [appState, setAppState] = useState(AppState.currentState);
  const handleAppStateChange = newAppState => {
    setAppState(newAppState);
    console.log('App state changed:', newAppState);
    if (newAppState === 'active') {
      console.log('mint complete?');
      // contact websocket 연결을 통해 mint balance 가져오기
      // 이전 보다 +1 되어있으면
    }
  };
  useEffect(() => {
    // Add the event listener for app state changes
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
          source={require('../../assests/HeaderLogo1.png')}
          style={{width: 72, height: 21.53}}
        />
        {agentInfo != null && agentInfo.agentNumber !== 0 ? (
          <Header.Icon size={24} name="menu" onPress={onPressAgentLogin} />
        ) : (
          <></>
        )}
      </Header>
      {isLoginedOpen && (
        <View
          style={[
            {
              backgroundColor: '#7400DB',
              position: 'absolute',
              right: 10,
              top: safeArea.top + 50,
              width: 160,
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
              Add a account
            </Text>
          </Button>
        </View>
      )}
      {agentInfo != null && agentInfo.agentNumber !== 0 ? (
        <>
          <Spacer space={12} />
          <MyFeedComponentScreen />
        </>
      ) : (
        <ImageBackground
          source={require('../../assests/MyPageBG.png')}
          style={{width: '100%', height: '100%'}}>
          <View
            style={{
              justifyContent: 'center',
              flex: 1,
            }}>
            <Text
              style={[
                Font.Title01_28_M,
                Color.White100,
                {textAlign: 'center'},
              ]}>
              Enter The Hideout
            </Text>
            <Spacer space={12} />
            <Text
              style={[Font.Body_14_R, Color.White066, {textAlign: 'center'}]}>
              Login to start posting
            </Text>
            <Spacer space={4} />
            <Text
              style={[Font.Body_14_R, Color.White066, {textAlign: 'center'}]}>
              your favorite Youtube videos
            </Text>
            <Spacer space={40} />
            <Button onPress={onPressWalletConnect}>
              <View
                style={{
                  marginHorizontal: 16,
                  height: 52,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#7400DB',
                  borderRadius: 10,
                }}>
                <Typography fontSize={16} color="white">
                  Log in
                </Typography>
              </View>
            </Button>
          </View>
        </ImageBackground>
      )}
    </View>
  );
};

export default MyFeedScreen;
