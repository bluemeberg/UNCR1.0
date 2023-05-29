import MetaMaskSDK from '@metamask/sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useWalletConnect} from '@walletconnect/react-native-dapp';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  AppState,
  Dimensions,
  Easing,
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableOpacityComponent,
} from 'react-native';
import {Image, ImageBackground, View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
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
import Contract from '../../UNCRAgent.json';
import {createAxiosServerInstance} from '../../utils/AxiosUtils';
import MyPosts from '../../components/MyFeed/MyPosts';
import {useMyFeedNavigation} from '../../navigation/MyFeedNavigation';
import {useIsFocused} from '@react-navigation/native';
import {ImageURL} from '../../utils/ImageUtils';
import Drawbar from '../../components/Drawbar';
import {Icon} from '../../components/Icon';
import {Divider} from '../../components/Divider';
import WebView from 'react-native-webview';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

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

    // await GoogleSignin.signOut();

    // await AsyncStorage.removeItem('accessToken');

    agentDispatch(connectAgentAccount(null, 0, null));
    await sleep(1000);
    await AsyncStorage.removeItem('agentInfo');
    setIsLoginedOpen(false);
    feedDispatch(getMainFeedList('null'));
  };

  const myFeedData = useSelector<UncrRootReducer, MainFeedInfo[]>(
    state => state.agentFeedList.list,
  );

  const onPressAddAccounts = async () => {
    const wsProvider = new ethers.providers.WebSocketProvider(
      'wss://sepolia.infura.io/ws/v3/3ebf9ab81238402fb50d3dba748fd948',
      'sepolia',
    );

    // const signer = wsProvider.getSigner(doConnect.accounts[0]);
    const signer = wsProvider.getSigner(
      '0x64d35934896f6e2ccE6afD9B030C8E2fD9C91a61',
    );

    const contract = new ethers.Contract(
      '0xee001aC0A6Ac57ddB6442dEf4aA6CE9f92D05869',
      Contract.abi,
      signer,
    );

    const result1 = await contract.name();
    console.log('result1', result1);
    let AgentNumber = await contract.balanceOf(
      '0x64d35934896f6e2ccE6afD9B030C8E2fD9C91a61',
    );

    console.log('number', AgentNumber);
  };

  const [walletAddress, setWalletAddress] = useState<string>();
  // 로그인 통해 지갑 연결 시키고,
  // 웹 소켓 연결해서 balance가 1보다 크면 계정 선택해서 고르게 하고
  // balance가 1이면 바로 로그인 끝 마이 페이지 네비게이션
  // balance가 0이면 회원 가입 페이지로 이동시켜 민트 딥링크 연결
  const onPressWalletConnect = useCallback(async () => {
    if (Platform.OS === 'android') {
      // const loginInfo = await AsyncStorage.getItem('agentInfo');
      // if (connector.connected || loginInfo !== null) {
      //   console.log('login');
      //   return;
      // }
      Alert.alert(
        'Guide',
        'You have to install a Metamask APP.',
        [
          {
            text: 'Already done',
            onPress: async () => {
              const doConnect = await connector.connect();
              // rootNavigation.navigate('WalletConnect', {
              //   screen: 'SignIn',
              //   params: {
              //     // 연결된 지갑 주소 전달 (서버)
              //     // walletAddress: doConnect.accounts[0],
              //     walletAddress: '0x64d35934896f6e2ccE6afD9B030C8E2fD9C91a61',
              //   },
              // });
              setFlag(true);
              console.log(doConnect.accounts[0]);
              setWalletAddress(doConnect.accounts[0]);
              const wsProvider = new ethers.providers.WebSocketProvider(
                'wss://sepolia.infura.io/ws/v3/3ebf9ab81238402fb50d3dba748fd948',
                'sepolia',
              );
              const signer = wsProvider.getSigner(doConnect.accounts[0]);
              // const signer = wsProvider.getSigner(
              //   '0xb72Cc1b4B2299fE3dbD08B3fd9af509Be3BeA576',
              // );

              const contract = new ethers.Contract(
                '0xee001aC0A6Ac57ddB6442dEf4aA6CE9f92D05869',
                Contract.abi,
                signer,
              );
              const result1 = await contract.name();
              console.log('result1', result1);
              const AgentNumber = await contract.balanceOf(
                doConnect.accounts[0],
              );
              // let AgentNumber = await contract.balanceOf(
              //   '0x64d35934896f6e2ccE6afD9B030C8E2fD9C91a61',
              // );

              console.log('number', AgentNumber);
              if (AgentNumber == 0) {
                // await Linking.openURL(
                //   'https://metamask.app.link/dapp/main--deluxe-moonbeam-cb4221.netlify.app/',
                // );
                setFlag(false);
                rootNavigation.push('WalletConnect', {
                  screen: 'SignIn',
                  params: {
                    // // 연결된 지갑 주소 전달 (서버)
                    // walletAddress: doConnect.accounts[0],
                    // 로컬
                    walletAddress: doConnect.accounts[0],
                  },
                });
              } else if (AgentNumber > 0) {
                // 확인 필요
                // const AgentID = await contract.tokenOfOwnerByIndex(
                //   doConnect.accounts[0],
                //   AgentNumber - 1,
                // );
                let ChooseAgentInfos = [];
                let ChooseNewAgentInfos = [];

                for (let i = 0; i < AgentNumber; i++) {
                  const AgentID = await contract.tokenOfOwnerByIndex(
                    // '0x64d35934896f6e2ccE6afD9B030C8E2fD9C91a61',
                    doConnect.accounts[0],
                    i,
                  );
                  console.log('id', AgentID);
                  console.log(Number(AgentID.toString()));
                  const result = await createAxiosServerInstance().get(
                    '/mypage/get',
                    {
                      params: {agentID: Number(AgentID.toString())},
                    },
                  );
                  console.log(result.data);
                  if (result.data.agentVO === null) {
                    let AgentInfo = {
                      agentURI: ImageURL + `${Number(AgentID.toString())}.png`,
                      agentNumber: Number(AgentID.toString()),
                      agentName: null,
                      postNumber: null,
                      walletAddress: walletAddress,
                    };
                    ChooseNewAgentInfos.push(AgentInfo);
                  } else {
                    let AgentInfo = {
                      agentURI: ImageURL + `${Number(AgentID.toString())}.png`,
                      agentNumber: Number(AgentID.toString()),
                      agentName: result.data.agentVO.agentNickname,
                      postNumber: result.data.boardVOS.length,
                      walletAddress: walletAddress,
                    };
                    ChooseAgentInfos.push(AgentInfo);
                  }
                }
                await sleep(1000);
                console.log(ChooseAgentInfos);
                setFlag(false);
                rootNavigation.push('WalletConnect', {
                  screen: 'Selected',
                  params: {
                    walletAddress: walletAddress,
                    AgentInfos: ChooseAgentInfos,
                    NewAgentInfos: ChooseNewAgentInfos,
                  },
                });
                return;
              }
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
      // rootNavigation.push('WalletConnect', {
      //   screen: 'SignIn',
      //   params: {
      //     // // 연결된 지갑 주소 전달 (서버)
      //     // walletAddress: doConnect.accounts[0],
      //     // 로컬
      //     walletAddress: '0xb72Cc1b4B2299fE3dbD08B3fd9af509Be3BeA576',
      //   },
      // });
      const loginInfo = await AsyncStorage.getItem('agentInfo');
      //   if (connector.connected || loginInfo !== null) {
      //     console.log('login');
      //     return;
      //   }
      const doConnect = await connector.connect();
      console.log(doConnect.accounts[0]);
      setWalletAddress(doConnect.accounts[0]);
      setFlag(true);

      const wsProvider = new ethers.providers.WebSocketProvider(
        'wss://sepolia.infura.io/ws/v3/3ebf9ab81238402fb50d3dba748fd948',
        'sepolia',
      );

      // const signer = wsProvider.getSigner(doConnect.accounts[0]);
      const signer = wsProvider.getSigner(
        '0x64d35934896f6e2ccE6afD9B030C8E2fD9C91a61',
      );

      const contract = new ethers.Contract(
        '0xee001aC0A6Ac57ddB6442dEf4aA6CE9f92D05869',
        Contract.abi,
        signer,
      );

      const result1 = await contract.name();
      console.log('result1', result1);
      let AgentNumber = await contract.balanceOf(doConnect.accounts[0]);
      // let AgentNumber = await contract.balanceOf(
      //   '0x64d35934896f6e2ccE6afD9B030C8E2fD9C91a61',
      // );

      console.log('number', AgentNumber);
      if (AgentNumber == 0) {
        // await Linking.openURL(
        //   'https://metamask.app.link/dapp/main--deluxe-moonbeam-cb4221.netlify.app/',
        // );
        setFlag(false);
        rootNavigation.push('WalletConnect', {
          screen: 'SignIn',
          params: {
            // 연결된 지갑 주소 전달 (서버)
            walletAddress: doConnect.accounts[0],
            // // 로컬
            // walletAddress: '0x64d35934896f6e2ccE6afD9B030C8E2fD9C91a61',
          },
        });
      } else if (AgentNumber > 0) {
        // 확인 필요
        // const AgentID = await contract.tokenOfOwnerByIndex(
        //   doConnect.accounts[0],
        //   AgentNumber - 1,
        // );
        let ChooseAgentInfos = [];
        let ChooseNewAgentInfos = [];
        for (let i = 0; i < AgentNumber; i++) {
          const AgentID = await contract.tokenOfOwnerByIndex(
            // '0x64d35934896f6e2ccE6afD9B030C8E2fD9C91a61',
            doConnect.accounts[0],
            i,
          );
          console.log('id', AgentID);
          console.log(Number(AgentID.toString()));
          let result;
          try {
            result = await createAxiosServerInstance().get('/mypage/get', {
              params: {agentID: Number(AgentID.toString())},
            });
            console.log(result.data);
            if (result.data.agentVO === null) {
              let AgentInfo = {
                agentURI: ImageURL + `${Number(AgentID.toString())}.png`,
                agentNumber: Number(AgentID.toString()),
                agentName: null,
                postNumber: null,
                walletAddress: walletAddress,
              };
              ChooseNewAgentInfos.push(AgentInfo);
            } else {
              let AgentInfo = {
                agentURI: ImageURL + `${Number(AgentID.toString())}.png`,
                agentNumber: Number(AgentID.toString()),
                agentName: result.data.agentVO.agentNickname,
                postNumber: result.data.boardVOS.length,
                walletAddress: walletAddress,
              };
              ChooseAgentInfos.push(AgentInfo);
            }
          } catch (e) {
            console.log(e);
            let AgentInfo = {
              agentURI: ImageURL + `${Number(AgentID.toString())}.png`,
              agentNumber: Number(AgentID.toString()),
              agentName: null,
              postNumber: null,
              walletAddress: walletAddress,
            };
            ChooseNewAgentInfos.push(AgentInfo);
          }
        }
        await sleep(1000);
        console.log(ChooseAgentInfos);
        setFlag(false);
        rootNavigation.push('WalletConnect', {
          screen: 'Selected',
          params: {
            walletAddress: walletAddress,
            AgentInfos: ChooseAgentInfos,
            NewAgentInfos: ChooseNewAgentInfos,
          },
        });
        return;
        // name 없을때 naming 스크린으로 이동 검토
        // agentDispatch(
        //   connectAgentAccount(
        //     '0x64d35934896f6e2ccE6afD9B030C8E2fD9C91a61',
        //     Number(AgentID.toString()),
        //     result.data.agentVO.agentNickname,
        //   ),
        // );
      }

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
      // rootNavigation.push('WalletConnect', {
      //   screen: 'SignIn',
      //   params: {
      //     // // 연결된 지갑 주소 전달 (서버)
      //     // walletAddress: doConnect.accounts[0],
      //     // 로컬
      //     walletAddress: '0x10aa522db145917c2a40bfef17ed9b9d10cdc7d1',
      //   },
      // });
    }
  }, []);
  const safeArea = useSafeAreaInsets();
  const [appState, setAppState] = useState(AppState.currentState);
  // const handleAppStateChange = async newAppState => {
  //   setAppState(newAppState);
  //   console.log('App state changed:', newAppState);
  //   if (newAppState === 'active') {
  //     console.log('mint complete?');
  //     // contact websocket 연결을 통해 mint balance 가져오기
  //     // 이전 보다 +1 되어있으면
  //     const wsProvider = new ethers.providers.WebSocketProvider(
  //       'wss://goerli.infura.io/ws/v3/3ebf9ab81238402fb50d3dba748fd948',
  //       'goerli',
  //     );
  //     const doConnect = await connector.connect();
  //     console.log(doConnect.accounts[0]);
  //     console.log('walletAddress', doConnect.accounts[0]);
  //     const signer = wsProvider.getSigner(doConnect.accounts[0]);
  //     const contract = new ethers.Contract(
  //       '0x5BF471e55474fe1bcc0ACE26f65FB13278156b32',
  //       Contract.abi,
  //       signer,
  //     );
  //     const result1 = await contract.name();
  //     console.log('result1', result1);
  //     // const AgentNumber = await contract.balanceOf(doConnect.accounts[0]);
  //     let AgentNumber = await contract.balanceOf(doConnect.accounts[0]);
  //     console.log('number', AgentNumber);
  //     if (AgentNumber > 0) {
  //       console.log('hi');

  //       // rootNavigation.push('WalletConnect', {
  //       //   screen: 'SignIn',
  //       //   params: {
  //       //     // // 연결된 지갑 주소 전달 (서버)
  //       //     // walletAddress: doConnect.accounts[0],
  //       //     // 로컬
  //       //     walletAddress: doConnect.accounts[0],
  //       //   },
  //       // });
  //     }
  //   }
  // };
  // useEffect(() => {
  //   // Add the event listener for app state changes
  //   const listener = AppState.addEventListener('change', handleAppStateChange);
  //   // Remove the event listener on unmount
  //   Linking.addEventListener('url', event => {
  //     console.log('Received deep link:', event.url);
  //     // Check if the deep link is from the MetaMask app
  //     if (
  //       event.url.startsWith(
  //         'https://metamask.app.link/dapp/main--deluxe-moonbeam-cb4221.netlify.app/',
  //       )
  //     ) {
  //       console.log('Returned from MetaMask app');
  //       // Do something here when the user returns from the MetaMask app
  //     }
  //   });
  //   return () => {
  //     listener.remove();
  //   };
  // }, []);
  const handleAppStateChange = async newAppState => {
    setAppState(newAppState);
    console.log('App state changed:', newAppState);
    if (newAppState === 'active') {
      console.log('mint complete?');
      console.log(connector.accounts[0]);
      console.log(walletAddress);
      if (connector.accounts[0] != undefined) {
        setWalletFlag(true);
        // contact websocket 연결을 통해 mint balance 가져오기
        // 이전 보다 +1 되어있으면
        const doConnect = await connector.connect();
        console.log(doConnect.accounts[0]);
        setWalletAddress(doConnect.accounts[0]);
      }
    } else if (newAppState === 'inactive') {
      await AsyncStorage.removeItem('initial');
    } else if (newAppState === 'background') {
      await AsyncStorage.setItem('initial', '0');
    }
    setWalletFlag(false);
  };
  useEffect(() => {
    // Add the event listener for app state changes
    getAccountInfo();
    const listener = AppState.addEventListener('change', handleAppStateChange);
    // Remove the event listener on unmount
    return () => {
      listener.remove();
    };
  }, []);

  const [drawFlag, setDrawFlag] = useState(false);
  const [flag, setFlag] = useState<boolean>(false);
  const [walletFlag, setWalletFlag] = useState<boolean>(false);
  const isFoucsed = useIsFocused();
  const interpolateAnim = useRef(new Animated.Value(0)).current;
  const width = Dimensions.get('window').width;
  const onOpenPress = () => {
    Animated.timing(interpolateAnim, {
      toValue: 1,
      useNativeDriver: false,
      duration: 500,
      easing: Easing.out(Easing.circle),
    }).start();
    setDrawFlag(true);
  };

  const onHidePress = () => {
    Animated.timing(interpolateAnim, {
      toValue: 0,
      useNativeDriver: false,
      duration: 500,
      easing: Easing.out(Easing.circle),
    }).start();
    setDrawFlag(false);
  };
  const insets = useSafeAreaInsets();
  const [googleAccountEmail, setGoogleAccountEmail] = useState();
  const [connectYoutubeChannel, setConnectYoutubeChannel] = useState();
  const getAccountInfo = async () => {
    const info = await AsyncStorage.getAllKeys();
    console.log(info);
    let agentInfo = await AsyncStorage.getItem('agentInfo');
    const result = await AsyncStorage.getItem('googleAccount');
    agentInfo = JSON.parse(agentInfo);
    console.log('wallet', agentInfo[0].walletAddress);
    setWalletAddress(agentInfo[0].walletAddress);
    // console.log(connector.connected);
    // if (connector.connected === true) {
    //   const doConnect = await connector.connect();
    //   setWalletAddress(doConnect.accounts[0]);
    // }
    console.log(result);
    setGoogleAccountEmail(result);
    const result1 = await AsyncStorage.getItem('youtubeChannel');
    console.log(result1);
    setConnectYoutubeChannel(result1);
  };

  const [visible, setVisible] = useState(false);

  const onPressGoogleAccount = () => {
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        paddingTop: insets.top,
      }}>
      <View
        style={{
          height: 56,
          justifyContent: 'center',
          marginHorizontal: 12,
        }}>
        {agentInfo != null && agentInfo.agentNumber !== 0 ? (
          <Text style={[Font.Headline_20_SM, Color.Black100]}>My</Text>
        ) : (
          <Image
            source={require('../../assests/HeaderLogo1.png')}
            style={{width: 72, height: 21.53}}
          />
        )}
      </View>
      {agentInfo != null && agentInfo.agentNumber !== 0 ? (
        <>
          {/* home */}
          {drawFlag && (
            <Pressable
              onPress={onHidePress}
              style={[
                StyleSheet.absoluteFill,
                {backgroundColor: 'rgba(0, 0, 0, 0.3)', zIndex: 1},
              ]}
            />
          )}
          <View
            style={{
              backgroundColor: 'white',
              position: 'absolute',
              top: insets.top + 4,
              right: 0,
            }}>
            <TouchableOpacity onPress={onOpenPress} style={{borderRadius: 100}}>
              <View style={{padding: 14}}>
                <Icon name="menu" size={20} color="black" />
              </View>
            </TouchableOpacity>
          </View>
          {/* MENU BG */}
          {/* <TouchableWithoutFeedback onPress={onHidePress}>
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            width: interpolateAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '300%'],
            }),
            height: '100%',
            backgroundColor: interpolateAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['#00000000', '#00000090'],
            }),
            // zIndex: interpolateAnim.interpolate({
            //   inputRange: [0, 1],
            //   outputRange: [0, 2],
            // }),
          }}
        />
      </TouchableWithoutFeedback> */}
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              width: '100%',
              height: '120%',
              backgroundColor: '#ffffff',
              zIndex: 10,
              transform: [
                {
                  translateX: interpolateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [width, width * 0.01],
                  }),
                },
              ],
            }}>
            <SafeAreaView
              style={{flex: 1, margin: 10, flexDirection: 'column'}}>
              <View style={{alignItems: 'flex-end'}}>
                <TouchableOpacity
                  onPress={onHidePress}
                  style={{borderRadius: 100}}>
                  <View style={{padding: 12}}>
                    <Icon name="close" size={20} color="#222" />
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    marginRight: 8,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      source={require('../../assests/WalletLogo.png')}
                      style={{width: 24, height: 24}}
                    />
                    <Spacer space={4} horizontal />
                    <Text
                      style={[
                        {
                          fontSize: 16,
                          fontStyle: 'normal',
                          fontWeight: '400',
                          lineHeight: 22,
                        },
                        Color.Neutral60,
                      ]}>
                      Wallet
                    </Text>
                  </View>
                  <View>
                    <Text style={[Font.Caption01_12_R, Color.Black100]}>
                      {walletAddress?.slice(0, 30) + '...'}
                    </Text>
                  </View>
                </View>
                <Spacer space={18} />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    marginRight: 8,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      source={require('../../assests/GoogleLogo.png')}
                      style={{width: 20, height: 20}}
                    />
                    <Spacer space={8} horizontal />
                    <Text
                      style={[
                        {
                          fontSize: 16,
                          fontStyle: 'normal',
                          fontWeight: '400',
                          lineHeight: 22,
                        },
                        Color.Neutral60,
                      ]}>
                      Google Account
                    </Text>
                  </View>
                  <Text style={[Font.Caption01_12_R, Color.Black100]}>
                    {googleAccountEmail}
                  </Text>
                </View>
                <Spacer space={18} />
                <Modal
                  visible={visible}
                  onRequestClose={handleClose}
                  style={{height: '80%'}}>
                  <SafeAreaView
                    style={{
                      width: width,
                      height: '100%',
                      backgroundColor: 'white',
                      justifyContent: 'center',
                      paddingTop: insets.top,
                    }}>
                    <TouchableOpacity
                      onPress={handleClose}
                      style={{marginLeft: 16}}>
                      <Icon name="arrow-back" size={20} />
                    </TouchableOpacity>
                    <WebView
                      source={{uri: 'https://myaccount.google.com/permissions'}}
                      style={{width: width, height: '80%'}}
                    />
                  </SafeAreaView>
                </Modal>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    marginRight: 8,
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={require('../../assests/YoutubeIcon.png')}
                      style={{width: 20, height: 16}}
                    />
                    <Spacer space={8} horizontal />
                    <Text
                      style={[
                        {
                          fontSize: 16,
                          fontStyle: 'normal',
                          fontWeight: '400',
                          lineHeight: 22,
                        },
                        Color.Neutral60,
                      ]}>
                      Youtube Channel
                    </Text>
                  </View>
                  <Text style={[Font.Caption01_12_R, Color.Black100]}>
                    {connectYoutubeChannel}
                  </Text>
                </View>
                <Spacer space={18} />
                <Divider width={1} color="#eeeeee" />
                <Spacer space={18} />
                <TouchableOpacity onPress={onPressGoogleAccount}>
                  <Text style={[Font.Headline_20_SM, Color.Black100]}>
                    Change Connected Channel
                  </Text>
                </TouchableOpacity>
                <Spacer space={18} />
                <Text style={[Font.Headline_20_SM, Color.Black100]}>
                  Add Accounts
                </Text>
                <Spacer space={18} />

                <Text style={[Font.Headline_20_SM, Color.Black100]}>
                  Reward
                </Text>
                <Spacer space={18} />
                <TouchableOpacity onPress={onPressLogout}>
                  <Text style={[Font.Headline_20_SM, {color: '#FF5674'}]}>
                    Logout
                  </Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </Animated.View>
        </>
      ) : connector.accounts[0] !== undefined ? (
        <View
          style={{
            backgroundColor: 'white',
            position: 'absolute',
            top: insets.top + 16,
            right: 0,
          }}>
          <Header.Title
            title={connector.accounts[0].slice(0, 10) + '...'}></Header.Title>
        </View>
      ) : (
        <></>
      )}
      {walletFlag && (
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
              Check the wallet connecting status
            </Text>
          </View>
        </View>
      )}
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
      {/* <Drawbar /> */}
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
          <Button onPress={onPressAddAccounts}>
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
          {flag && (
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
                  Loading data from the blockchain.
                </Text>
              </View>
            </View>
          )}
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
            <TouchableOpacity onPress={onPressWalletConnect}>
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
            </TouchableOpacity>
          </View>
        </ImageBackground>
      )}
    </View>
  );
};

export default MyFeedScreen;
