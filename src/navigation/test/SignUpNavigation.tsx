import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React from 'react';
import {InputEmailScreen} from '../../screens/test/InputEmailScreen';
import {InputNameScreen} from '../../screens/test/InputNameScreen';

export type TypeSignupNavigation = {
  InputEmail: {
    uid: string;
    preInput: {
      email: string;
      name: string;
      profileImage: string;
    };
    accssToken: string;
  };
  InputName: {
    uid: string;
    preInput: {
      email: string;
      name: string;
      profileImage: string;
    };
    inputEmail: string;
  };
};

const Stack = createNativeStackNavigator<TypeSignupNavigation>();

export const SignUpNavigation: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="InputEmail" component={InputEmailScreen} />
      <Stack.Screen name="InputName" component={InputNameScreen} />
    </Stack.Navigator>
  );
};

export const useSignupNavigation = <
  RouteName extends keyof TypeSignupNavigation,
>() =>
  useNavigation<NativeStackNavigationProp<TypeSignupNavigation, RouteName>>();

export const useSignupRoute = <
  RouteName extends keyof TypeSignupNavigation,
>() => useRoute<RouteProp<TypeSignupNavigation, RouteName>>();