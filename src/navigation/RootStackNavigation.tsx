import {
  NavigatorScreenParams,
  RouteProp,
  useNavigation,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
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
import {MyFeedNavigation, TypeMyFeedNavigation} from './MyFeedNavigation';
import {
  AgentFeedNavigation,
  TypeAgentFeedNavigation,
} from './AgentFeedNavigation';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Platform} from 'react-native';
import AlarmScreen from '../screens/AlarmScreen';

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
    index: number;
    hashtags: [];
    youtubeComment: string;
    youtubeCommentLikes: string;
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
    boardTime: string;
  };
  AgentFeed: {
    AgentID: number;
  };
  My: NavigatorScreenParams<TypeMyFeedNavigation>;
  Agent: NavigatorScreenParams<TypeAgentFeedNavigation>;
  Alarm: undefined;
};

const Stack = createNativeStackNavigator<TypeRootStackNavigationParams>();
// const Drawer = createDrawerNavigator();
// useEffect(() => {
//   const state = useNavigationState(state => state);
//   const currentScreen = state.routes[state.index].name;
//   console.log(currentScreen);
// }, []);
// PostNavigation 필요
// BottomTabNavigation의 post stack 에서
const animationSetup = Platform.OS === 'android' ? 'none' : 'default';
export const RootStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Main" component={BottomTabNavigation} />
      <Stack.Screen name="Post" component={PostNavigation} />
      {/* <Stack.Screen name="Signup" component={SignUpNavigation} /> */}
      <Stack.Screen name="WatchingVideo" component={WatchingVideoScreen} />
      <Stack.Screen name="WalletConnect" component={WalletConnectNavigation} />
      <Stack.Screen name="Comment" component={CommentNavigation} />
      <Stack.Screen
        options={{animation: animationSetup}}
        name="CommentScreen"
        component={CommentScreen}
      />
      <Stack.Screen name="AgentFeed" component={SelectedAccountsScreen} />
      <Stack.Screen name="My" component={MyFeedNavigation} />
      <Stack.Screen name="Agent" component={AgentFeedNavigation} />
      <Stack.Screen name="Alarm" component={AlarmScreen} />
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
