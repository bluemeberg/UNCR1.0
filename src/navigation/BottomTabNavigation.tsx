import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {AgentFeed} from '../components/AgentFeed/AgentFeed';
import {Icon} from '../components/Icon';
import {TabIcon} from '../components/TabIcon';
import {FeedWriteScreen} from '../screens/post/FeedWriteScreen';
import {MainScreen} from '../screens/MainScreen';
import {MainFeedNavigation} from './MainFeedNavigation';
import {MyFeedNavigation} from './MyFeedNavigation';
import {Text} from 'react-native';
import {Color} from '../utils/ColorStyle';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {UncrRootReducer} from '../uncrStore';
import {AgentAccountInfo} from '../@types/AgentAccountInfo';

type TypeBottomTabNavigation = {
  Home: {AgentID?: number; GuestID?: number; walletAddress?: string};
  My: undefined;
  Post: {AgentID?: number; GuestID?: number; walletAddress?: string};
};

const BottomTab = createBottomTabNavigator<TypeBottomTabNavigation>();
const safeInset = useSafeAreaInsets();
export const BottomTabNavigation: React.FC = () => {
  const agentInfo = useSelector<UncrRootReducer, AgentAccountInfo | null>(
    state => {
      return state.accountInfo.accountInfo;
    },
  );
  console.log('bottom', agentInfo);

  return (
    <BottomTab.Navigator
      // tabBar={props => <MyTabBar {...props} />}
      screenOptions={({route}) => {
        return {
          headerShown: false,
          tabBarActiveTintColor: '#7400DB',
          tabBarInactiveTintColor: 'rgba(0,0,0,0.75)',
          tabBarStyle: {height: safeInset.bottom + 60},
          tabBarLabelStyle: {marginBottom: 8},
        };
      }}>
      <BottomTab.Screen
        name="Home"
        component={MainFeedNavigation}
        options={{
          // tabBarButton: props => (
          //   <TouchableOpacity {...props} onPress={() => {}} />
          // ),
          tabBarIcon: ({focused, color, size}) => (
            <Image
              source={
                focused
                  ? require('../assests/tabBar/BottomTabHomeActive.png')
                  : require('../assests/tabBar/BottomTabHomeInActive.png')
              }
              style={{
                marginTop: 8,
                justifyContent: 'center',
                alignItems: 'center',
                width: 24,
                height: 24,
              }}
            />
          ),
          // tabBarButton: props => (
          //   <TouchableOpacity
          //     {...props}
          //     onPress={() => {
          //       console.log('Tab pressed');
          //     }}
          //   />
          // ),
        }}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            console.log('ta');
            navigation.navigate('Home', {
              screen: 'MainFeed',
              params: {
                count: 1,
              },
            });
            e.preventDefault();
          },
        })}
        initialParams={{AgentID: 0, walletAddress: ''}}
      />
      <BottomTab.Screen
        name="Post"
        component={FeedWriteScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{marginTop: 5}}>
              <Icon name="add" size={30} color={focused ? '#7400DB' : 'gray'} />
            </View>
          ),
        }}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            console.log('tab post', route);
            e.preventDefault();
            navigation.navigate(`CreatePost${navigation.getState().index}`);
          },
        })}
      />
      <BottomTab.Screen
        name="My"
        component={MyFeedNavigation}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{marginTop: 5}}>
              {agentInfo != null && agentInfo.agentNumber !== 0 ? (
                <Image
                  source={{uri: `https://uncr.io/${agentInfo.agentNumber}.png`}}
                  style={{width: 28, height: 28, borderRadius: 8}}
                />
              ) : (
                <Icon
                  name="person-circle-outline"
                  size={30}
                  color={focused ? '#7400DB' : 'gray'}
                />
              )}
            </View>
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};

export const useBottomTabNavigation = <
  RouteName extends keyof TypeBottomTabNavigation,
>() =>
  useNavigation<BottomTabNavigationProp<TypeBottomTabNavigation, RouteName>>();

export const useBottomTabRoute = <
  RouteName extends keyof TypeBottomTabNavigation,
>() => useRoute<RouteProp<TypeBottomTabNavigation, RouteName>>();
