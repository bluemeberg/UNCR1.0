import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React from 'react';
import {MainScreen} from '../screens/MainScreen';
import NewNamingScreen from '../screens/account/NewNamingScreen';
import SelectedAccountsScreen from '../screens/AgentFeed/SelectedAccountsScreen';
import {SignInScreen} from '../screens/account/SignInScreen';
import {SingupScreen} from '../screens/account/SingupScreen';
import ChooseAccountsScreen from '../screens/account/ChooseAccountsScreen';

export type TypeWalletConnectNavigation = {
  SignIn: {
    walletAddress: string;
  };
  Mint: {
    walletAddress: string;
  };
  Naming: {
    // 민팅한 NFT 정보
    // tokenID, 지갑 주소, imageURI
    walletAddress: string;
    AgentID: number;
  };
  Selected: {
    walletAddress: string | undefined;
    AgentInfos: {}[];
    NewAgentInfos: {}[];
  };
};

const Stack = createNativeStackNavigator<TypeWalletConnectNavigation>();

export const WalletConnectNavigation: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="Mint" component={SingupScreen} />
      <Stack.Screen name="Naming" component={NewNamingScreen} />
      <Stack.Screen name="Selected" component={ChooseAccountsScreen} />
    </Stack.Navigator>
  );
};

export const useWalletConnectNavigation = <
  RouteName extends keyof TypeWalletConnectNavigation,
>() =>
  useNavigation<
    NativeStackNavigationProp<TypeWalletConnectNavigation, RouteName>
  >();

export const useWalletConnectRoute = <
  RouteName extends keyof TypeWalletConnectNavigation,
>() => useRoute<RouteProp<TypeWalletConnectNavigation, RouteName>>();
