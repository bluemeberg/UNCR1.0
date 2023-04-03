import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import React, {useCallback} from 'react';
import {Image, Platform, Text, useWindowDimensions, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '../../components/Button';
import {Header} from '../../components/Header/Header';
import {Typography} from '../../components/Typography';
import {useRootNavigation} from '../../navigation/RootStackNavigation';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import {usePostNavigation} from '../../navigation/PostNavigation';
import {useDispatch} from 'react-redux';
import {
  connectGoogleUser,
  TypeGoogleUserDispatch,
} from '../../actions/googleUser';
import {
  createAxiosYoutubeDataAPIInstance,
  youtubeOauthAPI,
} from '../../utils/AxiosUtils';
import {Font} from '../../utils/FontStyle';
import {Spacer} from '../../components/Spacer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TypeVieoListReponse} from '../../youtube/TypeVideoListReponse';
export const IntroScreen: React.FC = () => {
  const rootNavigation = useRootNavigation<'Intro'>();
  const safeArea = useSafeAreaInsets();
  const navigation = usePostNavigation<'GoogleAuth'>();
  const googleUserDispatch = useDispatch<TypeGoogleUserDispatch>();

  async function getLikeVideo(accessToken: string) {
    let result: any = [];
    let nextPageToken = null;
    let i = 0;
    try {
      const videoResults: any =
        await createAxiosYoutubeDataAPIInstance().get<TypeVieoListReponse>(
          '/videos',
          {
            params: {
              key: youtubeOauthAPI,
              part: 'snippet, statistics',
              myRating: 'like',
              // pageToken: nextPageToken,
              maxResults: 50,
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
      nextPageToken = videoResults.data.nextPageToken;
      // if (!nextPageToken) {
      //   break;
      // }
      // // 100개 제한
      // else if (i > 1) {
      //   console.log('check', i);
      //   break;
      // }
      i += 1;
      for (let i = 0; i < videoResults.data.items.length; i++) {
        console.log(videoResults.data.items[i].snippet.thumbnails);
      }
      await AsyncStorage.setItem(
        'likedVideoData',
        JSON.stringify(videoResults.data.items),
      );
      result = [...result, ...videoResults.data.items];
      // console.log('check double', i);
      // console.log('count ', i);
      console.log(result);
      return result;
    } catch (error) {
      console.log('video', error);
    }
  }

  const onPressGoogleSignin = useCallback(async () => {
    if (Platform.OS === 'android') {
      GoogleSignin.configure({
        webClientId:
          '482024341954-l0afc4nb14g92btcha9rqkdftja0cv8e.apps.googleusercontent.com',
        scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
      });
      const isSignIn = await GoogleSignin.isSignedIn();
      if (isSignIn) {
        await GoogleSignin.signOut();
      }
      const result = await GoogleSignin.signIn({});
      // console.log(result);
      const accessToken = await GoogleSignin.getTokens();
      googleUserDispatch(
        connectGoogleUser(result.user.email, accessToken.accessToken),
      );
      const likeVideos = await getLikeVideo(accessToken.accessToken);
      const googleCredential = auth.GoogleAuthProvider.credential(
        result.idToken,
      );
      const authReuslt = await auth().signInWithCredential(googleCredential);

      navigation.push('FeedWrite', likeVideos);
    } else if (Platform.OS === 'ios') {
      GoogleSignin.configure({
        webClientId:
          '482024341954-l0afc4nb14g92btcha9rqkdftja0cv8e.apps.googleusercontent.com',
      });
      const isSignIn = await GoogleSignin.isSignedIn();
      console.log(isSignIn);
      if (isSignIn) {
        await GoogleSignin.signOut();
      }
      // result.user.email
      const result = await GoogleSignin.signIn({});
      console.log(result);
      let flag = false;
      for (let i = 0; i < result.scopes?.length; i++) {
        if (
          result.scopes[i] ===
          'https://www.googleapis.com/auth/youtube.readonly'
        ) {
          console.log('youtube hi');
          flag = true;
        }
      }
      if (!flag) {
        console.log('not youtube');
        const user = await GoogleSignin.addScopes({
          scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
        });
        console.log(user);
      }
      const accessToken = await GoogleSignin.getTokens();
      googleUserDispatch(
        connectGoogleUser(result.user.email, accessToken.accessToken),
      );
      const likeVideos = await getLikeVideo(accessToken.accessToken);
      const googleCredential = auth.GoogleAuthProvider.credential(
        result.idToken,
      );
      const authReuslt = await auth().signInWithCredential(googleCredential);
      // console.log(authReuslt);
      navigation.push('FeedWrite', likeVideos);
    }
  }, []);
  const {height, width} = useWindowDimensions();
  const onPressClose = useCallback(() => {
    navigation.goBack();
  }, []);
  return (
    <View style={{flex: 1}}>
      <Header>
        <Image
          source={require('../../assests/HeaderLogo.png')}
          style={{width: 72, height: 21.53}}
        />
        <Header.Icon
          name="close"
          onPress={onPressClose}
          size={20}
          color="black"
        />
      </Header>
      <View style={{flex: 1, paddingHorizontal: 16}}>
        <Text style={[Font.Body_16_R, {color: 'black'}]}>
          We need to put on your liked video lists from youtube.
        </Text>
        <Spacer space={10} />
        <Text style={[Font.Body_16_R, {color: 'black'}]}>
          So please, connect your google account.
        </Text>
        <Spacer space={10} />
        <Text style={[Font.Title02_22_R, {color: 'black'}]}>Caution.</Text>
        <Text style={[Font.Body_16_R, {color: 'black'}]}>
          UNCR do not store your liked contents information if you don't agree.
        </Text>
      </View>
      <Spacer space={100} />
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={require('../../assests/NPC1.png')}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 20,
            width: (height / 2.5) * 0.68,
            height: height / 2.5,
          }}
        />
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: 32 + safeArea.bottom,
        }}>
        <GoogleSigninButton
          style={{width: (width * 2) / 3, height: 52, borderRadius: 10}}
          size={GoogleSigninButton.Size.Wide}
          onPress={onPressGoogleSignin}
        />
      </View>
    </View>
  );
};
