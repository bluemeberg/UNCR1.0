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
import {Image, Platform, TouchableOpacity, View} from 'react-native';
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
import {ImageURL} from '../utils/ImageUtils';
import {CreatorListNavigation} from './CreatorListNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRootNavigation} from './RootStackNavigation';
import {
  createAxiosServerInstance,
  createAxiosYoutubeDataAPIInstance,
  youtubeOauthAPI,
} from '../utils/AxiosUtils';
import {TypeLikedVideoItem} from '../components/type/TypeLikedVideoItem';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

type TypeBottomTabNavigation = {
  Home: {AgentID?: number; GuestID?: number; walletAddress?: string};
  Creator: undefined;
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
  const rootNavgiation = useRootNavigation();
  async function getLikeVideo(accessToken: string) {
    let result: any = [];
    let nextPageToken = null;
    let i = 0;
    console.log('hello');
    try {
      console.log('hello');
      console.log(accessToken);
      const videoResults: any =
        await createAxiosServerInstance().get<TypeLikedVideoItem>('/videos', {
          params: {
            key: youtubeOauthAPI,
            part: 'snippet, statistics,status',
            myRating: 'like',
            // pageToken: nextPageToken,
            maxResults: 50,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      let lessThan500CommentsVideo = [];
      // console.log(videoResults);
      nextPageToken = videoResults.data.nextPageToken;
      videoResults.data.items = videoResults.data.items.filter(
        item => item.status.embeddable === true,
      );
      videoResults.data.items = videoResults.data.items.filter(
        item => item.status.privacyStatus !== 'unlisted',
      );
      for (let i = 0; i < videoResults.data.items.length; i++) {
        if (Number(videoResults.data.items[i].statistics.commentCount) < 500) {
          lessThan500CommentsVideo.push(videoResults.data.items[i]);
          videoResults.data.items[i].lessThan500Comments = 1;
          console.log(videoResults.data.items[i]);
        }
      }
      console.log('hello no error');
      // if (!nextPageToken) {
      //   break;
      // }
      // // 100개 제한
      // else if (i > 1) {
      //   console.log('check', i);
      //   break;
      // }
      // i += 1;
      // for (let i = 0; i < videoResults.data.items.length; i++) {
      //   // console.log(videoResults.data.items[i].snippet.thumbnails);
      // }
      await AsyncStorage.setItem(
        'likedVideoData',
        JSON.stringify(videoResults.data.items),
      );
      await AsyncStorage.setItem(
        'lessThan500CommentsVideos',
        JSON.stringify(lessThan500CommentsVideo),
      );
      result = [...result, ...videoResults.data.items];
      // console.log('check double', i);
      // console.log('count ', i);
      // console.log(result);
      return result;
    } catch (error) {
      console.log('video', error);
      // const result = await GoogleSignin.getCurrentUser();
      // console.log(result);
      try {
        if (Platform.OS === 'ios') {
          const result = await GoogleSignin.signInSilently();
          console.log('silently', result.user.email);
        }
        const token = await GoogleSignin.getTokens();
        console.log(token);
        const alreadyToken = await AsyncStorage.setItem(
          'accessToken',
          token.accessToken,
        );
        const videoResults: any =
          await createAxiosYoutubeDataAPIInstance().get<TypeLikedVideoItem>(
            '/videos',
            {
              params: {
                key: youtubeOauthAPI,
                part: 'snippet, statistics, status',
                myRating: 'like',
                pageToken: nextPageToken,
                maxResults: 50,
              },
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
              },
            },
          );
        let lessThan500CommentsVideo = [];
        videoResults.data.items = videoResults.data.items.filter(
          item => item.status.embeddable === true,
        );
        videoResults.data.items = videoResults.data.items.filter(
          item => item.status.privacyStatus !== 'unlisted',
        );
        for (let i = 0; i < videoResults.data.items.length; i++) {
          if (
            Number(videoResults.data.items[i].statistics.commentCount) < 500
          ) {
            // console.log(videoResults.data.items[i].statistics);
            lessThan500CommentsVideo.push(videoResults.data.items[i]);
            videoResults.data.items[i].lessThan500Comments = 1;
            console.log(videoResults.data.items[i]);
          }
        }
        // console.log(videoResults.length);
        await AsyncStorage.setItem(
          'likedVideoData',
          JSON.stringify(videoResults.data.items),
        );
        await AsyncStorage.setItem(
          'lessThan500CommentsVideos',
          JSON.stringify(lessThan500CommentsVideo),
        );
        result = [...result, ...videoResults.data.items];
        return result;
      } catch (error) {
        console.log('token', error);
        rootNavgiation.navigate('Post', {
          screen: 'GoogleAuth',
        });
      }
    }
  }
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
            // console.log('ta');
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
      {/* creator list screen */}
      <BottomTab.Screen
        name="Creator"
        component={CreatorListNavigation}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <View style={{marginTop: 5}}>
              <Icon
                name="stats-chart-outline"
                size={20}
                color={focused ? '#7400DB' : 'gray'}
              />
            </View>
          ),
        }}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            navigation.navigate('Creator', {
              screen: 'CreatorListScreen',
              params: {
                counts: 1,
              },
            });
          },
        })}
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
          tabPress: async e => {
            // console.log('tab post', route);
            e.preventDefault();
            // navigation.navigate('Home', {
            //   screen: 'MainFeed',
            //   params: {
            //     count: 1,
            //   },
            // });
            const alreadyToken = await AsyncStorage.getItem('accessToken');
            console.log(alreadyToken);
            if (alreadyToken != null) {
              const likeVideos = await getLikeVideo(alreadyToken);
              rootNavgiation.navigate('Post', {
                screen: 'FeedWrite',
                params: {likeVideos: likeVideos},
              });
            } else {
              navigation.navigate(`CreatePost${navigation.getState().index}`);
            }
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
                  source={{uri: ImageURL + `${agentInfo.agentNumber}.png`}}
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
        listeners={({navigation, route}) => ({
          tabPress: e => {
            console.log('ta');
            navigation.navigate('My', {
              screen: 'MyFeed',
              params: {
                count: 1,
              },
            });
            e.preventDefault();
          },
        })}
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
