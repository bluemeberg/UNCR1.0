import AsyncStorage from '@react-native-async-storage/async-storage';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  NavigationContainer,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import {AppState, View} from 'react-native';
import {useSelector} from 'react-redux';
import {AgentAccountInfo} from './@types/AgentAccountInfo';
import {
  RootStackNavigation,
  useRootNavigation,
} from './navigation/RootStackNavigation';
import {RootStackNavigator} from './navigation/test/TestRootStackNavigator';
import {SplashView} from './SplashViewTest';
import {SplashViewUNCR} from './SplashViewUNCR';
import {UncrRootReducer} from './uncrStore';
import {sleep} from './utils/sleep';

export const RootApp: React.FC = () => {
  const [initialize, setInitialize] = useState(false);

  const agentInfo = useSelector<UncrRootReducer, AgentAccountInfo | null>(
    state => {
      return state.accountInfo.accountInfo;
    },
  );

  useEffect(() => {
    getAsync();
  }, []);
  const [initialFlag, setInitialFlag] = useState();

  const getAsync = async () => {
    const flag = await AsyncStorage.getItem('initial');
    setInitialFlag(flag);
    await sleep(1000);
  };
  function Page1({navigation}) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'steelblue',
        }}>
        <Text>Page1</Text>
      </View>
    );
  }
  // 위에 값들을 불러오는 시간
  const [value, setValue] = useState(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      setValue('Delayed Value');
    }, 500); // 5초 후에 값을 반환하도록 설정

    return () => clearTimeout(timer); // 컴포넌트가 언마운트될 때 타이머를 클리어합니다.
  }, []);
  // const Drawer = createDrawerNavigator();

  if (value === null) {
    return <View></View>;
  } else if (value !== null) {
    return initialize === true || initialFlag === '0' || agentInfo != null ? (
      <NavigationContainer>
        <RootStackNavigation />
        {/* <Drawer.Navigator initialRouteName="P1">
          <Drawer.Screen name="P1" component={Page1} />
        </Drawer.Navigator> */}
      </NavigationContainer>
    ) : (
      <SplashViewUNCR
        onFinished={async () => {
          setInitialize(true);
          // splashview를 한번 겪으면 set을 해줌
          await AsyncStorage.setItem('initial', '0');
        }}
      />
    );
  }

  // }
};
