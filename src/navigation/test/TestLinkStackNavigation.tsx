import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import LinkListScreen from '../../screens/test/LinkListScreen';
import LinkListScreenDetail from '../../screens/test/LinkListScreenDetail';

const Stack = createNativeStackNavigator();

export const LinkStackNavigation: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="LinkList"
      screenOptions={{
        presentation: 'card',
        headerShown: false,
      }}>
      <Stack.Screen name="LinkList" component={LinkListScreen} />
      <Stack.Screen name="LinkDetail" component={LinkListScreenDetail} />
    </Stack.Navigator>
  );
};
