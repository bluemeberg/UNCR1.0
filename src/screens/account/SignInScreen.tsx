import {useWalletConnect} from '@walletconnect/react-native-dapp';
import WalletConnectProvider from '@walletconnect/web3-provider';

import axios from 'axios';
import {ethers} from 'ethers';
import React, {useCallback, useEffect} from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
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
import {sleep} from '../../utils/sleep';
export const SignInScreen = () => {
  const rootNavigation = useRootNavigation();
  const connector = useWalletConnect();
  const onPressClose = useCallback(() => {
    rootNavigation.goBack();
  }, []);
  const navigation = useWalletConnectNavigation();
  const guestNavigation = useMainNavigation<'MainFeed'>();
  const route = useWalletConnectRoute();

  //Agent 계정 생성
  const onPressCreateAccount = useCallback(() => {
    navigation.push('Mint', {walletAddress: route.params.walletAddress});
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
  useEffect(() => {
    // if (agentInfo !== null) {
    //   navigation.goBack();
    //   return;
    // }
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
      let AgentIDs = [];
      if (AgentNumber > 0) {
        console.log('hi Agent');
        for (let i = 0; i < AgentNumber; i++) {
          const AgentID = await contract.tokenOfOwnerByIndex(
            route.params.walletAddress,
            i,
          );
          AgentIDs.push(AgentID.toString());
        }
        console.log(AgentIDs);
        // navigation.push('Selected', {
        //   walletAddress: route.params.walletAddress,
        //   AgentIDs: AgentIDs,
        // });
      } else {
        console.log('please buy new account');
      }
    }
    sleep(10000);
    fetch();
  }, [route.params.walletAddress]);
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ImageBackground
        source={require('../../assests/singInBG1.png')}
        style={{width: '100%', height: '100%'}}>
        <Header>
          <Header.Icon
            name="arrow-back"
            onPress={onPressClose}
            size={20}
            color="white"></Header.Icon>
        </Header>
        <Spacer space={12} />
        <View style={{flex: 1, marginHorizontal: 16}}>
          <Typography color="white" fontSize={22}>
            Welcome to UNCR
          </Typography>
          <Spacer space={10} />
          <Typography fontSize={16} color="gray">
            In order to use our app,
          </Typography>
          <Typography fontSize={16} color="gray">
            please choose a way to Login
          </Typography>
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
        <Button onPress={onPressGuestMode}>
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
        </Button>
        <Spacer space={safeArea.bottom + 12} />
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};
