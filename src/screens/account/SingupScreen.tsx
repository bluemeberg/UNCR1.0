import {useWalletConnect} from '@walletconnect/react-native-dapp';
import WalletConnectProvider from '@walletconnect/web3-provider';
import {ethers} from 'ethers';
import {parseEther} from 'ethers/lib/utils';
import React, {useCallback} from 'react';
import {ImageBackground, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '../../components/Button';
import {Font} from '../../utils/FontStyle';
import {Header} from '../../components/Header/Header';
import {Spacer} from '../../components/Spacer';
import {Typography} from '../../components/Typography';
import {useRootNavigation} from '../../navigation/RootStackNavigation';
import {
  useWalletConnectNavigation,
  useWalletConnectRoute,
} from '../../navigation/WalletConnectNavigation';
import Contract from '../../UNCRAgent.json';
import {createAxiosServerInstance} from '../../utils/AxiosUtils';
import {sleep} from '../../utils/sleep';

export const SingupScreen = () => {
  // connect 선언 후
  // provider 선언을 통해 네트워크 연결 후
  // Mint 함수 호출
  // 이름 생성 스크린으로 이동
  const rootNavigation = useRootNavigation();
  const navigation = useWalletConnectNavigation();
  const route = useWalletConnectRoute();
  const onPressClose = () => {
    rootNavigation.goBack();
  };
  const connector = useWalletConnect();
  const onPressMint = useCallback(async () => {
    console.log('hello');
    const provider = new WalletConnectProvider({
      // rpc: {
      //   5: 'https://goerli.infura.io/v3/3ebf9ab81238402fb50d3dba748fd948',
      // },
      chainId: 5,
      connector: connector,
      infuraId: '3ebf9ab81238402fb50d3dba748fd948',
      qrcode: false,
    });
    await provider.enable();
    const ethers_provider = new ethers.providers.Web3Provider(provider);
    const signer = ethers_provider.getSigner(route.params.walletAddress);
    const wsProvider = new ethers.providers.WebSocketProvider(
      'wss://goerli.infura.io/ws/v3/3ebf9ab81238402fb50d3dba748fd948',
      'goerli',
    );
    const wsSigner = wsProvider.getSigner(route.params.walletAddress);
    const contract = new ethers.Contract(
      '0x5BF471e55474fe1bcc0ACE26f65FB13278156b32',
      Contract.abi,
      signer,
    );
    try {
      const result = await contract.accountCreation(1);
      // const result = await contract.purchase(1, {value: parseEther('0.05')});

      await provider.close();
      await result.wait();
      sleep(10000);
      // await result.wait();
      // await provider.close();
    } catch (e) {
      console.log('error', e);
      // await result.wait();
      // console.error(e);
    } finally {
      const wsContract = new ethers.Contract(
        '0x5BF471e55474fe1bcc0ACE26f65FB13278156b32',
        Contract.abi,
        wsSigner,
      );
      const AgentNumber = await wsContract.balanceOf(
        route.params.walletAddress,
      );
      console.log('number', AgentNumber);
      const AgentID = await wsContract.tokenOfOwnerByIndex(
        route.params.walletAddress,
        AgentNumber - 1,
      );
      console.log(AgentID);
      sleep(5000);
      navigation.push('Naming', {
        walletAddress: route.params.walletAddress,
        AgentID: AgentID,
      });
    }
  }, []);
  const onPressDemo = useCallback(async () => {
    // /agentID/post 호출을 통해 agenID를 가져온다
    const result = await createAxiosServerInstance().get('/wallet/get', {
      params: {
        walletAddress: route.params.walletAddress,
      },
    });
    navigation.push('Naming', {
      walletAddress: route.params.walletAddress,
      AgentID: result.data.agentID,
    });
  }, []);
  const safeAreaInsets = useSafeAreaInsets();
  return (
    <View style={{flex: 1}}>
      <ImageBackground
        source={require('../../assests/singInBG1.png')}
        style={{width: '100%', height: '100%'}}>
        <Header>
          <Header.Icon
            name="arrow-back"
            onPress={onPressClose}
            color="white"
            size={24}
          />
        </Header>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={[Font.Title02_22_R, {color: 'white'}]}>MINT PAGE</Text>
        </View>
        <Button onPress={onPressDemo}>
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
              MINT Now
            </Typography>
          </View>
        </Button>
        <Spacer space={safeAreaInsets.bottom + 12} />
      </ImageBackground>
    </View>
  );
};
