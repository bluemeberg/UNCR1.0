import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import './shim';
import {Icon} from './src/components/Icon';
import {RootStackNavigation} from './src/navigation/RootStackNavigation';
import {ListView} from './src/youtube/ListView';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Provider} from 'react-redux';
import {RootNavigation} from './src/navigation/test/TestRootNavigation';
import {RootApp} from './src/RootApp';
import {testStore} from './src/testStore';
import {uncrStore} from './src/uncrStore';
import {WalletConnectProvider} from '@walletconnect/react-native-dapp/dist/providers';
import {Alert, Linking, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCHEME_FROM_APP_JSON = 'walletconnect-example';

export default function App() {
  return (
    <WalletConnectProvider
      bridge="https://bridge.walletconnect.org"
      clientMeta={{
        description: 'Connect with WalletConnect',
        url: 'https://uncr.io',
        icons: ['https://walletconnect.org/walletconnect-logo.png'],
        name: 'UCNR',
      }}
      redirectUrl={
        Platform.OS === 'web'
          ? window.location.origin
          : `${SCHEME_FROM_APP_JSON}://`
      }
      storageOptions={{
        asyncStorage: AsyncStorage,
      }}>
      <SafeAreaProvider>
        <Provider store={uncrStore}>
          <RootApp />
        </Provider>
        {/* <Provider store={testStore}>
        <RootApp />
      </Provider> */}
      </SafeAreaProvider>
    </WalletConnectProvider>
  );
}
