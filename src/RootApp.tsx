import {NavigationContainer} from '@react-navigation/native';
import React, {useState} from 'react';
import {RootStackNavigation} from './navigation/RootStackNavigation';
import {RootStackNavigator} from './navigation/test/TestRootStackNavigator';
import {SplashView} from './SplashViewTest';
import {SplashViewUNCR} from './SplashViewUNCR';

export const RootApp: React.FC = () => {
  const [initialize, setInitialize] = useState(false);
  if (!initialize)
    return <SplashViewUNCR onFinished={() => setInitialize(true)} />;
  return (
    <NavigationContainer>
      <RootStackNavigation />
    </NavigationContainer>
  );
};
