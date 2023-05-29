import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React from 'react';
import {FeedWriteDetailScreen} from '../screens/post/FeedWriteDetailScreen';
import {FeedWriteScreen} from '../screens/post/FeedWriteScreen';
import {IntroScreen} from '../screens/post/IntroScreen';

export type TypePostNavigation = {
  GoogleAuth: undefined;
  FeedWrite: {
    likeVideos: [];
    screenName: string;
  };
  FeedWriteDetailScreen: {
    likeVideoID: string;
    channelTitle: string;
    title: string;
    channelID: string;
    videoThumbnail: string;
    category: string;
    commentCount: string;
  };
};

const Stack = createNativeStackNavigator<TypePostNavigation>();

export const PostNavigation: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="GoogleAuth" component={IntroScreen} />
      <Stack.Screen
        name="FeedWriteDetailScreen"
        component={FeedWriteDetailScreen}
      />
      <Stack.Screen name="FeedWrite" component={FeedWriteScreen} />
    </Stack.Navigator>
  );
};

export const usePostNavigation = <
  RouteName extends keyof TypePostNavigation,
>() =>
  useNavigation<NativeStackNavigationProp<TypePostNavigation, RouteName>>();

export const usePostRoute = <RouteName extends keyof TypePostNavigation>() =>
  useRoute<RouteProp<TypePostNavigation, RouteName>>();
