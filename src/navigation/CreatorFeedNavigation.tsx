import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React from 'react';
import CreatorFeed from '../components/Creator/CreatorFeed';
import CreatorFeedDetail from '../screens/creator/CreatorFeedDetail';
import CreatorFeedScreen from '../screens/creator/CreatorFeedScreen';

export type TypeCreatorFeedNavigationParams = {
  CreatorFeed: {
    channelID: string;
    channelDesc: string;
  };
  CreatorFeedDetailScreen: {
    channelID: string;
    agentID: string;
    channelTitle: string;
    index: number;
  };
};

const Stack = createNativeStackNavigator<TypeCreatorFeedNavigationParams>();
export const CreatorFeedNavigation: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="CreatorFeed" component={CreatorFeedScreen} />
      <Stack.Screen
        name="CreatorFeedDetailScreen"
        component={CreatorFeedDetail}
      />
    </Stack.Navigator>
  );
};

export const useCreatorFeedNavigation = <
  RouteName extends keyof TypeCreatorFeedNavigationParams,
>() =>
  useNavigation<
    NativeStackNavigationProp<TypeCreatorFeedNavigationParams, RouteName>
  >();

export const useCreatorFeedRoute = <
  RouteName extends keyof TypeCreatorFeedNavigationParams,
>() => useRoute<RouteProp<TypeCreatorFeedNavigationParams, RouteName>>();
