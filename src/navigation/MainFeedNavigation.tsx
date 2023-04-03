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
import {AgentFeed} from '../components/AgentFeed/AgentFeed';
import CreatePost from '../components/CreatePost';
import CommentScreen from '../screens/CommentScreen';
import {MainScreen} from '../screens/MainScreen';
import SelectedAccountsScreen from '../screens/AgentFeed/SelectedAccountsScreen';
import {WatchingVideoScreen} from '../screens/WatchingVideoScreen';
import {useBottomTabNavigation} from './BottomTabNavigation';
import {
  AgentFeedNavigation,
  TypeAgentFeedNavigation,
} from './AgentFeedNavigation';

export type TypeMainFeedNavigation = {
  MainFeed: {
    AgentID?: number;
    GuestID?: number;
    walletAddress?: string;
  };
  AgentFeedNavigation: {
    AgentID: NavigatorScreenParams<TypeAgentFeedNavigation>;
  };
  CreatePost0: undefined;
  // Comment: {
  //   boardContent: string;
  //   boardID: number;
  //   agentNickName: string;
  //   channelThumbnail: string;
  //   channelTitle: string;
  //   boardAgentID: string;
  // };
};

const Stack = createNativeStackNavigator<TypeMainFeedNavigation>();
const navigation = useBottomTabNavigation();
export const MainFeedNavigation: React.FC = () => {
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      e.preventDefault();
      console.log('Tab navigation pressedd', e);
    });
    return unsubscribe;
  }, [navigation]);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="MainFeed" component={MainScreen} />
      <Stack.Screen
        name="AgentFeedNavigation"
        component={AgentFeedNavigation}
      />
      <Stack.Screen
        name="CreatePost0"
        component={CreatePost}
        options={{presentation: 'transparentModal'}}
      />
      {/* <Stack.Screen name="Comment" component={CommentScreen} /> */}
    </Stack.Navigator>
  );
};

export const useMainNavigation = <
  RouteName extends keyof TypeMainFeedNavigation,
>() =>
  useNavigation<NativeStackNavigationProp<TypeMainFeedNavigation, RouteName>>();

export const useMainRoute = <
  RouteName extends keyof TypeMainFeedNavigation,
>() => useRoute<RouteProp<TypeMainFeedNavigation, RouteName>>();
