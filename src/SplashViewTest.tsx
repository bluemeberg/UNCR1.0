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

export const SplashView: React.FC<{
  onFinished: () => void;
}> = props => {
  const [showLoginButton, setShowLoginButton] = useState(false);
  const dispatch = useDispatch<TypeUserRRDispatch>();
  const appInit = useCallback(async () => {
    try {
      const {idToken} = await GoogleSignin.signInSilently();
      if (idToken !== null) {
        await dispatch(signIn(idToken));
        props.onFinished();
      }
    } catch (ex) {
      setShowLoginButton(true);
    }
  }, []);
  const onPressSignIn = useCallback(async () => {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
    const {idToken} = await GoogleSignin.signIn();
    if (idToken !== null) {
      await dispatch(signIn(idToken));

      props.onFinished();
    }
  }, []);
  useEffect(() => {
    appInit();
    // setTimeout(() => {
    //   props.onFinished();
    // }, 1000);
  }, []);
  return (
    // <View
    //   style={{
    //     flex: 1,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     backgroundColor: '#7400DB',
    //   }}>
    //   <Image source={require('./assests/SplashLogo.png')} />
    // </View>
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {showLoginButton && <GoogleSigninButton onPress={onPressSignIn} />}
    </View>
  );
};
