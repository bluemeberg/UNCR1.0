import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import React, {useCallback, useEffect, useState} from 'react';
import {Image, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {TypeUserDispatch} from './actions/test/user';
import {signIn, TypeUserRRDispatch} from './actions/test/userFeed';
import {LocalImage} from './components/LocalImage';
import {RemoteImage} from './components/RemoteImage';
import {Typography} from './components/Typography';

export const SplashViewUNCR: React.FC<{
  onFinished: () => void;
}> = props => {
  useEffect(() => {
    setTimeout(() => {
      props.onFinished();
    }, 1000);
  }, []);
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#7400DB',
      }}>
      <Image source={require('./assests/SplashLogo.png')} />
    </View>
  );
};
