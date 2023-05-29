import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React from 'react';
import CreatePost from '../components/CreatePost';
import EditAccountScreen from '../screens/account/EditAccountScreen';
import MyFeedDetail from '../screens/account/MyFeedDetailScreen';
import MyFeedScreen from '../screens/account/MyFeedScreen';

export type TypeMyFeedNavigation = {
  MyFeed: undefined;
  MyFeedDetail: {
    MyID: number;
    MyFeedData: [];
    index: number;
  };
  Edit: undefined;
  CreatePost3: undefined;
};

const Stack = createNativeStackNavigator();

export const MyFeedNavigation: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="MyFeed"
        component={MyFeedScreen}
        options={{presentation: 'transparentModal'}}
      />
      <Stack.Screen
        name="MyFeedDetail"
        component={MyFeedDetail}
        options={{presentation: 'transparentModal'}}
      />
      <Stack.Screen name="Edit" component={EditAccountScreen} />
      <Stack.Screen
        name="CreatePost3"
        component={CreatePost}
        options={{presentation: 'transparentModal'}}
      />
    </Stack.Navigator>
  );
};

export const useMyFeedNavigation = <
  RouteName extends keyof TypeMyFeedNavigation,
>() =>
  useNavigation<NativeStackNavigationProp<TypeMyFeedNavigation, RouteName>>();

export const useMyFeedRoute = <
  RouteName extends keyof TypeMyFeedNavigation,
>() => useRoute<RouteProp<TypeMyFeedNavigation, RouteName>>();
