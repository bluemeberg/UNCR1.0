import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import CommentScreen from '../screens/CommentScreen';
import SelectedAccountsScreen from '../screens/AgentFeed/SelectedAccountsScreen';

export type TypeCommentNavigation = {
  Comment: {
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
};

const Stack = createNativeStackNavigator<TypeCommentNavigation>();

export const CommentNavigation: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Comment" component={CommentScreen} />
      <Stack.Screen name="AgentFeed" component={SelectedAccountsScreen} />
    </Stack.Navigator>
  );
};

export const useCommentNavigation = <
  RouteName extends keyof TypeCommentNavigation,
>() =>
  useNavigation<NativeStackNavigationProp<TypeCommentNavigation, RouteName>>();

export const useCommentRoute = <
  RouteName extends keyof TypeCommentNavigation,
>() => useRoute<RouteProp<TypeCommentNavigation, RouteName>>();
