import React, {useCallback, useEffect, useState} from 'react';
import {Image, View} from 'react-native';

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
