import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import {Image, View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {AgentAccountInfo} from '../../@types/AgentAccountInfo';
import {GoogleUser} from '../../@types/GoogleUser';
import {
  createAgentAccountFeed,
  TypeMainFeedListDispatch,
} from '../../actions/mainFeed';
import {Button} from '../../components/Button';
import {Color} from '../../utils/ColorStyle';
import {Divider} from '../../components/Divider';
import {Font} from '../../utils/FontStyle';
import {Header} from '../../components/Header/Header';
import {MultiLineInput} from '../../components/MultiLineInput';
import RecommendHashtag from '../../components/RecommendHashtag';
import {RemoteImage} from '../../components/RemoteImage';
import {Spacer} from '../../components/Spacer';
import {Typography} from '../../components/Typography';
import {useMainNavigation} from '../../navigation/MainFeedNavigation';
import {usePostRoute} from '../../navigation/PostNavigation';
import {useRootNavigation} from '../../navigation/RootStackNavigation';
import {UncrRootReducer} from '../../uncrStore';
import {
  createAxiosLocalServerInstance,
  createAxiosYoutubeDataAPIInstance,
  youtubeGeneralAPI,
  youtubeOauthAPI,
} from '../../utils/AxiosUtils';

export const FeedWriteDetailScreen: React.FC = () => {
  const navigation = useMainNavigation<'MainFeed'>();
  const routes = usePostRoute<'FeedWriteDetailScreen'>();
  const rootNavigation = useRootNavigation<'Main'>();
  const dispatch = useDispatch<TypeMainFeedListDispatch>();
  const closePress = useCallback(() => {
    navigation.goBack();
  }, []);
  const [comment, setComment] = useState<string>('');
  // console.log(comment);
  // console.log('videoThumbnail', routes.params);
  const onPressSubmit = useCallback(async () => {
    dispatch(
      createAgentAccountFeed(
        routes.params.channelID,
        routes.params.title,
        comment,
        routes.params.likeVideoID,
        routes.params.videoThumbnail,
        routes.params.category,
      ),
    );
    navigation.navigate('MainFeed', {
      walletAddress: agentUserInfo?.walletAddress,
      AgentID: agentUserInfo?.agentNumber,
    });
  }, [comment]);
  const safeArea = useSafeAreaInsets();
  const googleUserInfo = useSelector<UncrRootReducer, GoogleUser | null>(
    state => {
      return state.googleUser.google;
    },
  );
  const agentUserInfo = useSelector<UncrRootReducer, AgentAccountInfo | null>(
    state => {
      return state.accountInfo.accountInfo;
    },
  );

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [items, setItems] = useState([{label: 'no coments', value: ''}]);

  // const getCommentNumber = useCallback(async () => {
  //   const result = await createAxiosYoutubeDataAPIInstance().get('/videos', {
  //     params: {
  //       key: youtubeGeneralAPI,
  //       part: 'statistics',
  //       id: routes.params.likeVideoID,
  //     },
  //   });
  //   console.log('comment number', result.data.items[0].statistics.commentCount);
  //   return result.data.items[0].statistics.commentCount;
  // }, []);

  const getYoutubeComment = useCallback(async () => {
    if (Number(routes.params.commentCount) > 500) {
      console.log('famous');
      return;
    }
    let nextPageToken = null;
    let commentsTotal: any = [];
    let i = 0;
    const result = await createAxiosYoutubeDataAPIInstance().get('/channels', {
      params: {
        key: youtubeOauthAPI,
        part: 'snippet',
        mine: true,
      },
      headers: {
        Authorization: `Bearer ${googleUserInfo?.accessToken}`,
      },
    });
    console.log('mine', result.data.items[0].id);
    while (true) {
      const comments: any = await createAxiosYoutubeDataAPIInstance().get(
        '/commentThreads',
        {
          params: {
            key: youtubeGeneralAPI,
            part: 'snippet',
            videoId: routes.params.likeVideoID,
            maxResults: 100,
            pageToken: nextPageToken,
          },
        },
      );
      commentsTotal = [...commentsTotal, comments.data.items];
      i += 1;
      nextPageToken = comments.data.nextPageToken;
      if (!nextPageToken) {
        break;
      } else if (i > 4) {
        break;
      }
    }
    for (let i = 0; i < commentsTotal.length; i++) {
      for (let j = 0; j < commentsTotal[i].length; j++) {
        console.log(
          commentsTotal[i][j].snippet.topLevelComment.snippet.textOriginal,
        );
        if (
          commentsTotal[i][j].snippet.topLevelComment.snippet.authorChannelId
            .value === result.data.items[0].id
        ) {
          setItems([
            {
              label:
                commentsTotal[i][j].snippet.topLevelComment.snippet
                  .textOriginal,
              value:
                commentsTotal[i][j].snippet.topLevelComment.snippet
                  .textOriginal,
            },
          ]);
          return;
        }
      }
    }
    // console.log(result1);
    // for (let i = 0; i < comments.data.items.length; i++) {
    //   console.log(
    //     comments.data.items[i].snippet.topLevelComment.snippet.authorChannelId
    //       .value,
    //   );
    //   if (
    //     comments.data.items[i].snippet.topLevelComment.snippet.authorChannelId
    //       .value === myYoutubeID
    //   ) {
    //     console.log('hi');
    //     console.log(
    //       comments.data.items[i].snippet.topLevelComment.snippet.textDisplay,
    //     );
    //     setItems([
    //       {
    //         label:
    //           comments.data.items[i].snippet.topLevelComment.snippet
    //             .textDisplay,
    //         value:
    //           comments.data.items[i].snippet.topLevelComment.snippet
    //             .textDisplay,
    //       },
    //     ]);
    //     return;
    //   }
    // }
  }, []);
  const [focused, setFocused] = useState(true);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <Header>
          <Header.Icon
            name="arrow-back"
            onPress={closePress}
            size={20}
            color="black"
          />
          <Header.Title title="Recommend" />
          <Header.Title title="" />
        </Header>
        <Spacer space={10} />
        <View style={{paddingHorizontal: 16, flexDirection: 'row'}}>
          <Image
            source={{uri: routes.params.videoThumbnail}}
            style={{borderRadius: 10, width: 160, height: 90}}
          />
          <Spacer horizontal space={8} />
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
            <Text style={[Font.Body_16_R, {color: 'black'}]}>
              {routes.params.title}
            </Text>
            <Spacer space={10} />
            <Text style={Font.Caption01_12_R}>
              {' '}
              {routes.params.channelTitle}
            </Text>
          </View>
        </View>
        <Spacer space={20} />
        <Divider width={1} color="rgba(0,0,0,0.1)" />
        <Spacer space={20} />
        <View style={{flex: 1}}>
          <Text
            style={[Font.Body_14_R, {paddingHorizontal: 16, color: 'black'}]}>
            Recommended Comments
          </Text>
          <Spacer space={10} />
          {/* drop box  */}
          <View style={{paddingHorizontal: 16}}>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setComment}
              setItems={setItems}
              placeholder="Put on your Youtube comment"
              modalTitle="Your youtube comments."
              listMode="MODAL"
              modalProps={{
                animationType: 'fade',
              }}
              style={{
                backgroundColor: 'rgba(0,0,0,0.05)',
                borderColor: 'rgba(0,0,0,0.25)',
              }}
              onPress={getYoutubeComment}
            />
          </View>

          <Spacer space={8} />
          <View
            style={{
              alignSelf: 'stretch',
              marginHorizontal: 16,
              paddingVertical: 8,
              paddingHorizontal: 8,
              borderRadius: 10,
              borderWidth: 0.4,
              borderColor: 'gray',
            }}>
            <TextInput
              autoCorrect={false}
              autoCapitalize={'none'}
              autoFocus
              value={comment}
              onChangeText={setComment}
              placeholder="Or write on comments for contents"
              placeholderTextColor="gray"
              // onSubmitEditing={props.onSubmitEditing}
              style={{
                fontSize: 14,
                height: 100,
                flexShrink: 1,
                color: 'black',
              }}
              multiline={true}
              numberOfLines={10}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </View>

          {/* <MultiLineInput
            value={comment}
            onChangeText={setComment}
            placeholder="Or write on comments for contents"
            height={60}
            fontSize={14}
          /> */}
          <Spacer space={20} />

          <Divider width={1} color="rgba(0,0,0,0.1)" />
          <Spacer space={20} />
          <Text
            style={[Font.Body_14_R, {paddingHorizontal: 16, color: 'black'}]}>
            Related Keywords (Not yet)
          </Text>
          <Spacer space={10} />
          <RecommendHashtag />
          <Spacer space={20} />
          <Button onPress={onPressSubmit}>
            <View
              style={[
                {
                  backgroundColor: '#7400DB',
                  borderRadius: 10,
                  height: 52,
                  justifyContent: 'center',
                  marginBottom: safeArea.bottom + 32,
                  marginHorizontal: 16,
                },
              ]}>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text style={[Font.Body_16_R, {color: 'white'}]}>Upload</Text>
              </View>
            </View>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};
