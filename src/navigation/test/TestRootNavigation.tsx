import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {AddLinkScreen} from '../../screens/test/AddLinkScreen';
import {LinkStackNavigation} from './TestLinkStackNavigation';

const Stack = createNativeStackNavigator();

export const RootNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="LinkStack"
      screenOptions={{
        presentation: 'containedModal',
        headerShown: false,
      }}>
      <Stack.Screen name="LinkNavigation" component={LinkStackNavigation} />
      <Stack.Screen name="AddScreen" component={AddLinkScreen} />
    </Stack.Navigator>
  );
};
