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
import React, {useEffect} from 'react';
import CreatePost from '../components/CreatePost';
import CreatorFeedDetail from '../screens/creator/CreatorFeedDetail';
import CreatorFeedScreen from '../screens/creator/CreatorFeedScreen';
import CreatorListScreen from '../screens/creator/CreatorListScreen';
import CreatorSupporterList from '../screens/creator/CreatorSupporterList';
import {
  CreatorFeedNavigation,
  TypeCreatorFeedNavigationParams,
} from './CreatorFeedNavigation';
import {
  CreatorSupporterNavigation,
  TypeCreatorSupporterNavigationParams,
} from './CreatorSupporterNavigation';

// CreatorListScreen
// CreatorFeedScreen
// CreatorFeedDetailScreen
// CreatorSupporterScreen
export type TypeCreatorListNavigationParams = {
  CreatorListScreen: {};
  CreatorFeed: NavigatorScreenParams<TypeCreatorFeedNavigationParams>;
  CreatorFeedDetailScreen: {
    channelID: string;
    agentID: string;
    channelTitle: string;
    index: number;
  };
  CreatorSupportScreen: NavigatorScreenParams<TypeCreatorSupporterNavigationParams>;
  CreatePost1: undefined;
  // channel id
  // CreatorFeedDetailScreen
  // board id
  // CreatorSupporterScreen
  // support list
};
const Stack = createNativeStackNavigator<TypeCreatorListNavigationParams>();
export const CreatorListNavigation: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="CreatorListScreen" component={CreatorListScreen} />
      <Stack.Screen name="CreatorFeed" component={CreatorFeedNavigation} />
      <Stack.Screen
        name="CreatorFeedDetailScreen"
        component={CreatorFeedDetail}
      />
      <Stack.Screen
        name="CreatorSupportScreen"
        component={CreatorSupporterNavigation}
      />
      <Stack.Screen
        name="CreatePost1"
        component={CreatePost}
        options={{presentation: 'transparentModal'}}
      />
    </Stack.Navigator>
  );
};

export const useCreatorListNavigation = <
  RouteName extends keyof TypeCreatorListNavigationParams,
>() =>
  useNavigation<
    NativeStackNavigationProp<TypeCreatorListNavigationParams, RouteName>
  >();

export const useCreatorListRoute = <
  RouteName extends keyof TypeCreatorListNavigationParams,
>() => useRoute<RouteProp<TypeCreatorListNavigationParams, RouteName>>();
