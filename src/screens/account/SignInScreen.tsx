import {useWalletConnect} from '@walletconnect/react-native-dapp';
import WalletConnectProvider from '@walletconnect/web3-provider';

import axios from 'axios';
import {ethers} from 'ethers';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {AgentAccountInfo} from '../../@types/AgentAccountInfo';
import {
  connectGuestAccount,
  TypeGuestDispatch,
} from '../../actions/guestAccount';
import {Button} from '../../components/Button';
import {Header} from '../../components/Header/Header';
import {Spacer} from '../../components/Spacer';
import {Typography} from '../../components/Typography';
import {useMainNavigation} from '../../navigation/MainFeedNavigation';
import {useRootNavigation} from '../../navigation/RootStackNavigation';
import {useSignupNavigation} from '../../navigation/test/SignUpNavigation';
import {
  useWalletConnectNavigation,
  useWalletConnectRoute,
} from '../../navigation/WalletConnectNavigation';
import Contract from '../../UNCRAgent.json';
import {UncrRootReducer} from '../../uncrStore';
import {createAxiosLocalServerInstance} from '../../utils/AxiosUtils';
import {Color} from '../../utils/ColorStyle';
import {Font} from '../../utils/FontStyle';
import {sleep} from '../../utils/sleep';
export const SignInScreen = () => {
  const rootNavigation = useRootNavigation();
  const connector = useWalletConnect();
  const onPressClose = useCallback(() => {
    rootNavigation.goBack();
  }, []);
  const navigation = useWalletConnectNavigation<'SignIn'>();
  const guestNavigation = useMainNavigation<'MainFeed'>();
  const route = useWalletConnectRoute();
  const [NewAgentIDs, setNewAgentIDs] = useState([]);
  //Agent 계정 생성
  const onPressCreateAccount = useCallback(async () => {
    await Linking.openURL(
      'https://metamask.app.link/dapp/main--deluxe-moonbeam-cb4221.netlify.app/',
    );
    // navigation.push('Mint', {walletAddress: route.params.walletAddress});
  }, []);
  const guestDispatch = useDispatch<TypeGuestDispatch>();

  // Guest 계정 접속
  const onPressGuestMode = useCallback(async () => {
    //  guestID 생성하기 (서버 호출)

    console.log('hi');
    guestDispatch(connectGuestAccount(route.params?.walletAddress ?? '', 1));
    guestNavigation.navigate('MainFeed', {
      walletAddress: route.params.walletAddress,
      GuestID: 1,
    });
  }, []);
  // Agent 계정 정보 가져오기
  const agentInfo = useSelector<UncrRootReducer, AgentAccountInfo | null>(
    state => {
      return state.accountInfo.accountInfo;
    },
  );
  const safeArea = useSafeAreaInsets();

  const [appState, setAppState] = useState(AppState.currentState);
  async function fetch() {
    const wsProvider = new ethers.providers.WebSocketProvider(
      'wss://goerli.infura.io/ws/v3/3ebf9ab81238402fb50d3dba748fd948',
      'goerli',
    );
    const signer = wsProvider.getSigner(route.params.walletAddress);
    const contract = new ethers.Contract(
      '0x5BF471e55474fe1bcc0ACE26f65FB13278156b32',
      Contract.abi,
      signer,
    );
    const result1 = await contract.name();
    console.log('result1', result1);
    const AgentNumber = await contract.balanceOf(route.params.walletAddress);
    console.log('number', AgentNumber);
    let AgentIDs: any = [];
    if (AgentNumber > 0) {
      console.log('hi Agent');
      for (let i = 0; i < AgentNumber; i++) {
        const AgentID = await contract.tokenOfOwnerByIndex(
          route.params.walletAddress,
          i,
        );
        AgentIDs.push(AgentID.toString());
      }
      console.log;
      console.log('NewAgentIDs', NewAgentIDs.length);
      console.log('minted', AgentIDs.length);
      if (AgentIDs.length > NewAgentIDs.length) {
        setNewAgentIDs(AgentIDs);
        console.log('new mint');
      }
      // navigation.push('Selected', {
      //   walletAddress: route.params.walletAddress,
      //   AgentIDs: AgentIDs,
      // });
    } else {
      console.log('please buy new account');
    }
  }
  console.log('mint', NewAgentIDs.length);
  const handleAppStateChange = async newAppState => {
    setAppState(newAppState);
    console.log('App state changed:', newAppState);
    if (newAppState === 'active') {
      console.log('mint complete?');
      setFlag(true);
      // contact websocket 연결을 통해 mint balance 가져오기
      // 이전 보다 +1 되어있으면
      const doConnect = await connector.connect();
      console.log(doConnect.accounts[0]);
      const wsProvider = new ethers.providers.WebSocketProvider(
        'wss://sepolia.infura.io/ws/v3/3ebf9ab81238402fb50d3dba748fd948',
        'sepolia',
      );
      const signer = wsProvider.getSigner(doConnect.accounts[0]);
      const contract = new ethers.Contract(
        '0xee001aC0A6Ac57ddB6442dEf4aA6CE9f92D05869',
        Contract.abi,
        signer,
      );
      const result1 = await contract.name();
      const AgentNumber = await contract.balanceOf(doConnect.accounts[0]);
      // let AgentNumber = await contract.balanceOf(
      //   '0xb72Cc1b4B2299fE3dbD08B3fd9af509Be3BeA576',
      // );

      if (AgentNumber > 0) {
        const AgentID = await contract.tokenOfOwnerByIndex(
          doConnect.accounts[0],
          AgentNumber - 1,
        );
        console.log('id', AgentID);
        console.log(Number(AgentID.toString()));
        navigation.push('Naming', {
          walletAddress: doConnect.accounts[0],
          AgentID: Number(AgentID.toString()),
        });
      } else {
        Alert.alert(
          '',
          'Please create account again',
          [
            {
              text: 'Okay',
              onPress: () => {
                return;
              },
            },
          ],
          {cancelable: false},
        );
      }
      console.log('number', AgentNumber);
    }
    setFlag(false);
  };
  useEffect(() => {
    // Add the event listener for app state changes
    const listener = AppState.addEventListener('change', handleAppStateChange);
    // Remove the event listener on unmount
    return () => {
      listener.remove();
    };
  }, []);
  // useEffect(() => {
  //   // if (agentInfo !== null) {
  //   //   navigation.goBack();
  //   //   return;
  //   // }

  //   sleep(10000);
  //   fetch();
  // }, [route.params.walletAddress]);
  const {width, height} = useWindowDimensions();
  const [flag, setFlag] = useState<boolean>(false);

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ImageBackground
        source={require('../../assests/MintBG.png')}
        style={{width: '100%', height: '100%'}}>
        <Header>
          <Header.Icon
            name="arrow-back"
            onPress={onPressClose}
            size={20}
            color="white"></Header.Icon>
          {connector.accounts[0] != undefined ? (
            <View style={{alignItems: 'center'}}>
              <Text style={{fontSize: 16, color: 'white'}}>
                {connector.accounts[0].slice(0, 10) + '...'}
              </Text>
            </View>
          ) : (
            <></>
          )}
        </Header>
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
        <Spacer space={12} />
        <View style={{flex: 1, marginHorizontal: 16}}>
          <Text style={[Font.Title02_22_R, Color.White100]}>
            Welcome to UNCR,
          </Text>
          <Spacer space={10} />
          <Text style={[Font.Body_16_R, Color.White075]}>
            This is your first time here.
          </Text>
          <Text style={[Font.Body_16_R, Color.White075]}>
            Please go to UNCR Account Center
          </Text>
          <Text style={[Font.Body_16_R, Color.White075]}>
            to create an account.
          </Text>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          {Platform.OS === 'ios' ? (
            <Image
              source={require('../../assests/AgentNPC.png')}
              style={{
                width: width / 2.5,
                height: (width / 2.5) * (362 / 131),
                marginBottom: 28,
              }}
            />
          ) : (
            <Image
              source={require('../../assests/AgentNPC.png')}
              style={{
                width: width / 3,
                height: (width / 3) * (362 / 131),
                marginBottom: 28,
              }}
            />
          )}
        </View>
        <View style={{marginHorizontal: 16}}></View>
        <Button onPress={onPressCreateAccount}>
          <View
            style={{
              marginHorizontal: 16,
              height: 52,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#7400DB',
              borderRadius: 10,
            }}>
            <Typography fontSize={14} color="white">
              Create new account
            </Typography>
          </View>
        </Button>
        <Spacer space={10} />
        {/* <Button onPress={onPressGuestMode}>
          <View
            style={{
              marginHorizontal: 16,
              height: 52,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: 10,
            }}>
            <Typography fontSize={14}>Continue as guest</Typography>
          </View>
        </Button> */}
        <Spacer space={safeArea.bottom + 12} />
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};
