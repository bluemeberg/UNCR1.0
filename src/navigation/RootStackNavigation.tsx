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
import {HistoryListScreen} from '../screens/test/HistoryListScreen';
import {IntroScreen} from '../screens/post/IntroScreen';
import {WatchingVideoScreen} from '../screens/WatchingVideoScreen';
import {BottomTabNavigation} from './BottomTabNavigation';
import {PostNavigation, TypePostNavigation} from './PostNavigation';
import {SignUpNavigation, TypeSignupNavigation} from './test/SignUpNavigation';
import {
  TypeWalletConnectNavigation,
  WalletConnectNavigation,
} from './WalletConnectNavigation';
import CommentScreen from '../screens/CommentScreen';
import {CommentNavigation, TypeCommentNavigation} from './CommentNavigation';
import SelectedAccountsScreen from '../screens/AgentFeed/SelectedAccountsScreen';

export type TypeRootStackNavigationParams = {
  Intro: undefined;
  Main: {AgentID?: number; GuestID?: number; walletAddress?: string};
  Post: NavigatorScreenParams<TypePostNavigation>;
  WatchingVideo: {
    videoId: string;
    myDuration: number | null;
    boardID: number;
    totalDuration: number;
    totalWatchers: number;
    totalComments: number;
    totalLikes: number;
    isLiked: boolean;
    boardContent: string;
    boardTime: string;
    agentNickName: string;
    channelThumnail: string;
    channelTitle: string;
    boardAgnetID: string;
  };
  WalletConnect: NavigatorScreenParams<TypeWalletConnectNavigation>;
  Comment: NavigatorScreenParams<TypeCommentNavigation>;
  CommentScreen: {
    boardContent: string;
    boardID: number;
    agentNickName: string;
    channelThumbnail: string;
    channelTitle: string;
    boardAgentID: string;
  };
  AgentFeed: {
    AgentID: number;
  };
};

const Stack = createNativeStackNavigator<TypeRootStackNavigationParams>();

// PostNavigation 필요
// BottomTabNavigation의 post stack 에서
export const RootStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Main" component={BottomTabNavigation} />
      <Stack.Screen name="Post" component={PostNavigation} />
      {/* <Stack.Screen name="Signup" component={SignUpNavigation} /> */}
      <Stack.Screen name="WatchingVideo" component={WatchingVideoScreen} />
      <Stack.Screen name="WalletConnect" component={WalletConnectNavigation} />
      <Stack.Screen name="Comment" component={CommentNavigation} />
      <Stack.Screen name="CommentScreen" component={CommentScreen} />
      <Stack.Screen name="AgentFeed" component={SelectedAccountsScreen} />
    </Stack.Navigator>
  );
};

export const useRootNavigation = <
  RouteName extends keyof TypeRootStackNavigationParams,
>() =>
  useNavigation<
    NativeStackNavigationProp<TypeRootStackNavigationParams, RouteName>
  >();

export const useRootRoute = <
  RouteName extends keyof TypeRootStackNavigationParams,
>() => useRoute<RouteProp<TypeRootStackNavigationParams, RouteName>>();
