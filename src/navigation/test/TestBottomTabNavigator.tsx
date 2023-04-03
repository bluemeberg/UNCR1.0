import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {HomeScreen} from '../../screens/test/HomeScreen';
import {MyPageScreen} from '../../screens/test/MyPageScreen';

export type BottomTypeParamList = {
  Home: undefined;
  MyPage: undefined;
};

const BottomTab = createBottomTabNavigator<BottomTypeParamList>();

export const BottomTabNavigator = () => {
  return (
    <BottomTab.Navigator screenOptions={{headerShown: false}}>
      <BottomTab.Screen name="Home" component={HomeScreen} />
      <BottomTab.Screen name="MyPage" component={MyPageScreen} />
    </BottomTab.Navigator>
  );
};
