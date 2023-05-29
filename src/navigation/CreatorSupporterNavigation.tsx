import {
  NavigatorScreenParams,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React from 'react';
import CreatorSupporterList from '../screens/creator/CreatorSupporterList';
import {
  AgentFeedNavigation,
  TypeAgentFeedNavigation,
} from './AgentFeedNavigation';

export type TypeCreatorSupporterNavigationParams = {
  CreatorSupportList: [];
  Agent: NavigatorScreenParams<TypeAgentFeedNavigation>;
};

const Stack =
  createNativeStackNavigator<TypeCreatorSupporterNavigationParams>();

export const CreatorSupporterNavigation: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="CreatorSupportList"
        component={CreatorSupporterList}
      />
      <Stack.Screen name="Agent" component={AgentFeedNavigation} />
    </Stack.Navigator>
  );
};

export const useCreatorSupportNavigation = <
  RouteName extends keyof TypeCreatorSupporterNavigationParams,
>() =>
  useNavigation<
    NativeStackNavigationProp<TypeCreatorSupporterNavigationParams, RouteName>
  >();

export const useCreatorSupportRoute = <
  RouteName extends keyof TypeCreatorSupporterNavigationParams,
>() => useRoute<RouteProp<TypeCreatorSupporterNavigationParams, RouteName>>();
