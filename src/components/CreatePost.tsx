import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Alert, Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AgentAccountInfo} from '../@types/AgentAccountInfo';
import {GuestAccountInfo} from '../@types/GuestAccountInfo';
import {TypeGuestDispatch} from '../actions/guestAccount';
import {
  useMainNavigation,
  useMainRoute,
} from '../navigation/MainFeedNavigation';
import {useRootNavigation} from '../navigation/RootStackNavigation';
import {UncrRootReducer} from '../uncrStore';
import {Button} from './Button';
import {Font} from '../utils/FontStyle';
import {Header} from './Header/Header';
import {Icon} from './Icon';
import {Typography} from './Typography';
import {
  createAxiosServerInstance,
  createAxiosYoutubeDataAPIInstance,
  youtubeOauthAPI,
} from '../utils/AxiosUtils';
import {TypeLikedVideoItem} from './type/TypeLikedVideoItem';
import {usePostNavigation} from '../navigation/PostNavigation';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {TouchableOpacity} from 'react-native';
import EventEmitter from 'events';
import {getDevice, getModel} from 'react-native-device-info';

export const CreatePost: React.FC = () => {
  const rootNavigation = useRootNavigation();
  const navigation = useNavigation();
  const mainNavigation = useMainNavigation();
  const postVavigation = usePostNavigation();
  async function getLikeVideo(accessToken: string) {
    let result: any = [];
    let nextPageToken = null;
    let i = 0;
    console.log('hello');
    try {
      console.log('hello');
      console.log(accessToken);
      const videoResults: any =
        await createAxiosYoutubeDataAPIInstance().get<TypeLikedVideoItem>(
          '/videos',
          {
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
          },
        );
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
                // pageToken: nextPageToken,
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
        rootNavigation.push('Post', {
          screen: 'GoogleAuth',
        });
      }
    }
  }
  const onPress = () => {
    setFlag(false);
    setTimeout(() => {
      navigation.goBack();
    }, 100);
    setTimeout(async () => {
      const alreadyToken = await AsyncStorage.getItem('accessToken');
      console.log(alreadyToken);
      if (alreadyToken != null) {
        const likeVideos = await getLikeVideo(alreadyToken);
        rootNavigation.push('Post', {screen: 'FeedWrite', params: likeVideos});
        return;
      }
      rootNavigation.push('Post', {
        screen: 'GoogleAuth',
      });
    }, 200);
  };

  const onCancel = () => {
    setFlag(false);
    setTimeout(() => {
      navigation.goBack();
    }, 100);
  };

  const [flag, setFlag] = useState<boolean>(false);
  const guestInfo = useSelector<UncrRootReducer, GuestAccountInfo | null>(
    state => {
      return state.guestInfo.guestInfo;
    },
  );
  const agentInfo = useSelector<UncrRootReducer, AgentAccountInfo | null>(
    state => {
      return state.accountInfo.accountInfo;
    },
  );

  useEffect(() => {
    if (
      (agentInfo !== null && agentInfo.agentNumber !== 0) ||
      guestInfo !== null
    ) {
      setTimeout(() => {
        setFlag(true);
      }, 300);
      return;
    }
    Alert.alert(
      'Guide',
      'Please login',
      [
        {
          text: 'Okay',
          onPress: () => {
            setFlag(false);
            setTimeout(() => {
              navigation.goBack();
            }, 100);
          },
        },
      ],
      {cancelable: false},
    );
    setTimeout(() => {
      setFlag(true);
    }, 300);
  }, []);
  const device = getModel();
  console.log(device);
  const height =
    device === 'SM-S906'
      ? '14%'
      : device === 'iPhone 14 Pro Max'
      ? '18%'
      : '20%';
  return (
    <View style={{flex: 1, borderRadius: 10}}>
      <Pressable style={[StyleSheet.absoluteFill]} onPress={onCancel} />
      <View
        style={{
          width: '100%',
          height: height,
          position: 'absolute',
          bottom: 0,
          backgroundColor: 'white',
          borderRadius: 10,
        }}>
        <Text
          style={[Font.Headline_20_SM, {marginHorizontal: 16, marginTop: 16}]}>
          Post
        </Text>
        <TouchableOpacity onPress={onPress}>
          <View
            style={{
              backgroundColor: 'white',
              paddingVertical: 34,
              paddingHorizontal: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="heart-outline" size={16} color="gray" />
              <View style={{marginLeft: 20}}>
                <Text style={[Font.Body_16_R, {color: 'black'}]}>
                  Recommend your liked contents
                </Text>
                <Text style={Font.Caption01_12_R}>
                  Share contents your like from Youtube
                </Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={16} color="gray" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreatePost;
