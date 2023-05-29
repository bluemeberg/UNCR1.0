import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import React, {useCallback, useEffect} from 'react';
import {Image, Platform, Text, useWindowDimensions, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '../../components/Button';
import {Header} from '../../components/Header/Header';
import {Typography} from '../../components/Typography';
import {useRootNavigation} from '../../navigation/RootStackNavigation';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import {usePostNavigation} from '../../navigation/PostNavigation';
import {useDispatch, useSelector} from 'react-redux';
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
import {UncrRootReducer} from '../../uncrStore';
import {AgentAccountInfo} from '../../@types/AgentAccountInfo';
import {Color} from '../../utils/ColorStyle';
import {doesNotThrow} from 'assert';
import {constSelector} from 'recoil';
import {useNavigation} from '@react-navigation/native';
export const IntroScreen: React.FC = () => {
  const rootNavigation = useRootNavigation<'Intro'>();
  const safeArea = useSafeAreaInsets();
  const navigation = usePostNavigation<'GoogleAuth'>();
  const googleUserDispatch = useDispatch<TypeGoogleUserDispatch>();
  const agentInfo = useSelector<UncrRootReducer, AgentAccountInfo | null>(
    state => {
      return state.accountInfo.accountInfo;
    },
  );
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
              part: 'snippet, statistics, status',
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
      let lessThan500CommentsVideo = [];
      videoResults.data.items = videoResults.data.items.filter(
        item => item.status.embeddable === true,
      );
      videoResults.data.items = videoResults.data.items.filter(
        item => item.status.privacyStatus !== 'unlisted',
      );
      for (let i = 0; i < videoResults.data.items.length; i++) {
        if (Number(videoResults.data.items[i].statistics.commentCount) < 500) {
          // console.log(videoResults.data.items[i].statistics);
          lessThan500CommentsVideo.push(videoResults.data.items[i]);
        }
      }
      await AsyncStorage.setItem(
        'likedVideoData',
        JSON.stringify(videoResults.data.items),
      );
      await AsyncStorage.setItem(
        'lessThan500CommentsVideos',
        JSON.stringify(lessThan500CommentsVideo),
      );
      // console.log(lessThan500CommentsVideo);
      result = [...result, ...videoResults.data.items];
      // console.log('check double', i);
      // console.log('count ', i);
      // console.log(result);
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
        forceCodeForRefreshToken: true,
      });
      const isSignIn = await GoogleSignin.isSignedIn();
      if (isSignIn) {
        await GoogleSignin.signOut();
      }
      const result = await GoogleSignin.signIn({});
      console.log(result);
      await AsyncStorage.setItem('googleAccount', result.user.email);
      const accessToken = await GoogleSignin.getTokens();
      const alreadyToken = await AsyncStorage.setItem(
        'accessToken',
        accessToken.accessToken,
      );
      console.log(accessToken);
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
        forceCodeForRefreshToken: true,
      });
      const isSignIn = await GoogleSignin.isSignedIn();
      console.log(isSignIn);
      if (isSignIn) {
        await GoogleSignin.signOut();
      }
      // result.user.email
      const result = await GoogleSignin.signIn({});
      console.log('get token', result);

      await AsyncStorage.setItem('googleAccount', result.user.email);

      // const refresh = await fetch('https://oauth2.googleapis.com/token', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     refresh_token:
      //       '1//0epCW71e8QGNzCgYIARAAGA4SNwF-L9IrqZoLoCM_uJDFrJCKPCSjLg3xUfEKpS7JXW8pWhcJ6QCrtIBefbCHOvOEjvQET_HGkjM',
      //     client_id:
      //       '482024341954-l0afc4nb14g92btcha9rqkdftja0cv8e.apps.googleusercontent.com',
      //     client_secret: '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',
      //     grant_type: 'refresh_token',
      //   }),
      // }).then(res => {
      //   return res.json();
      // });
      // console.log('refresh refresh', refresh);

      // access token, refresh token 저장 하기
      const result1 = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        body: JSON.stringify({
          code: result.serverAuthCode,
          client_id:
            '482024341954-l0afc4nb14g92btcha9rqkdftja0cv8e.apps.googleusercontent.com',
          client_secret: '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',
          grant_type: 'authorization_code',
          redirect_uri: 'https://uncrcbt.firebaseapp.com/__/auth/handler',
        }),
      }).then(res => {
        return res.json();
      });
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
      }
      const user = await GoogleSignin.getCurrentUser();
      const accessToken = await GoogleSignin.getTokens();
      console.log('token', accessToken);
      const mineResult = await createAxiosYoutubeDataAPIInstance().get(
        '/channels',
        {
          params: {
            key: youtubeOauthAPI,
            part: 'snippet',
            mine: true,
          },
          headers: {
            Authorization: `Bearer ${accessToken.accessToken}`,
          },
        },
      );
      console.log('mine', mineResult.data.items[0].snippet.title);
      await AsyncStorage.setItem(
        'youtubeChannel',
        mineResult.data.items[0].snippet.title,
      );
      // accessToken 디바이스 내 저장
      const alreadyToken = await AsyncStorage.setItem(
        'accessToken',
        accessToken.accessToken,
      );

      googleUserDispatch(
        connectGoogleUser(result.user.email, accessToken.accessToken),
      );
      const likeVideos = await getLikeVideo(result1.access_token);
      const googleCredential = auth.GoogleAuthProvider.credential(
        result.idToken,
      );
      // console.log('google auth', googleCredential);
      const authReuslt = await auth().signInWithCredential(googleCredential);
      // console.log('google auth', authReuslt);
      // console.log('user', auth().currentUser.refreshToken);
      // const refresh = await authReuslt.user.getIdToken(true);
      // console.log('refresh token', refresh);
      // const googleCredentialRefresh =
      //   auth.GoogleAuthProvider.credential(refresh);
      // const refreshToken =
      //   await auth().currentUser?.reauthenticateWithCredential(
      //     googleCredentialRefresh,
      //   );
      // console.log('refresh',refreshToken);
      navigation.push('FeedWrite', {
        likeVideos: likeVideos,
        screenName: 'GoogleAuth',
      });
    }
  }, []);
  const {height, width} = useWindowDimensions();
  const onPressClose = useCallback(() => {
    navigation.goBack();
  }, []);
  const navigation1 = useNavigation();

  return (
    <View style={{flex: 1}}>
      <Header>
        <Header.Icon
          name="arrow-back"
          onPress={onPressClose}
          size={20}
          color="black"
        />
        <Header.Title title="Authorization" />
        <Header.Title title="" />
      </Header>
      <View style={{flex: 1, paddingHorizontal: 16}}>
        <Text style={[Font.Headline_20_SM, Color.Black100]}>
          Hi {agentInfo?.agentName},
        </Text>
        <Spacer space={8} />
        <Text style={[Font.Body_16_R, Color.Black075]}>
          We need to put on your liked video lists from youtube.
        </Text>
        <Text style={[Font.Body_16_R, Color.Black075]}>
          So please, connect your google account.
        </Text>
        <Spacer space={16} />
        <Text style={[Font.Body_16_R, {color: 'black', fontStyle: 'italic'}]}>
          ‼️ UNCR do not store your liked contents information if you don't
          agree.
        </Text>
      </View>
      <Spacer space={140} />
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={require('../../assests/NPC1.png')}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 20,
            width: (height / 2.3) * 0.68,
            height: height / 2.3,
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
