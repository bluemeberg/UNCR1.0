import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React from 'react';
import {FeedInfo} from '../../@types/test/TestFeedInfo';
import {AddFeedScreen} from '../../screens/test/AddFeedScreen';
import {FeedListScreen} from '../../screens/test/FeedListScreen';
import {BottomTabNavigation} from '../BottomTabNavigation';
import {BottomTabNavigator} from './TestBottomTabNavigator';

export type RootStackParamList = {
  BottomTab: undefined;
  FeedList: {
    list: FeedInfo[];
  };
  AddFeed: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'containedModal',
      }}>
      <Stack.Screen name="BottomTab" component={BottomTabNavigator} />
      <Stack.Screen name="AddFeed" component={AddFeedScreen} />
      <Stack.Screen name="FeedList" component={FeedListScreen} />
    </Stack.Navigator>
  );
};

export const useRootNavigation = <
  RouteName extends keyof RootStackParamList,
>() => {
  return useNavigation<
    NativeStackNavigationProp<RootStackParamList, RouteName>
  >();
};

export const useRootRoute = <RouteName extends keyof RootStackParamList>() => {
  return useRoute<RouteProp<RootStackParamList, RouteName>>();
};
