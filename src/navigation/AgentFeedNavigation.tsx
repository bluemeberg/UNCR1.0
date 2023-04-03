import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React from 'react';
import AgentFeedDetail from '../screens/AgentFeed/AgentFeedDetail';
import SelectedAccountsScreen from '../screens/AgentFeed/SelectedAccountsScreen';

export type TypeAgentFeedNavigation = {
  AgentFeed: {
    AgentID: number;
  };
  AgentFeedDetail: {
    AgentID: number;
    AgentFeedData: [];
    index: number;
  };
};

const Stack = createNativeStackNavigator<TypeAgentFeedNavigation>();
export const AgentFeedNavigation: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="AgentFeed" component={SelectedAccountsScreen} />
      <Stack.Screen name="AgentFeedDetail" component={AgentFeedDetail} />
    </Stack.Navigator>
  );
};

export const useAgentFeedNavigation = <
  RouteName extends keyof TypeAgentFeedNavigation,
>() =>
  useNavigation<
    NativeStackNavigationProp<TypeAgentFeedNavigation, RouteName>
  >();

export const useAgentFeedRoute = <
  RouteName extends keyof TypeAgentFeedNavigation,
>() => useRoute<RouteProp<TypeAgentFeedNavigation, RouteName>>();
