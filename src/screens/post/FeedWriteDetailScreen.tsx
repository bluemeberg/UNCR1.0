import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from 'react-native';
import {Image, View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {AgentAccountInfo} from '../../@types/AgentAccountInfo';
import {GoogleUser} from '../../@types/GoogleUser';
import {
  createAgentAccountFeed,
  getMainFeedList,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getAccountFeedList,
  TypeAgentAccountDispatch,
} from '../../actions/agentAccount';
import {sleep} from '../../utils/sleep';
import {Badge} from '../../components/Badge';
import CustomDropdown from '../../components/CustomDropdown';
import {getMyFeedList, TypeMyAccountDispatch} from '../../actions/myFeed';

export const FeedWriteDetailScreen = () => {
  const navigation = useMainNavigation<'MainFeed'>();
  const routes = usePostRoute<'FeedWriteDetailScreen'>();
  const rootNavigation = useRootNavigation<'Main'>();
  const dispatch = useDispatch<TypeMainFeedListDispatch>();
  const myFeedDispatch = useDispatch<TypeAgentAccountDispatch>();
  const MyFeedDispatch = useDispatch<TypeMyAccountDispatch>();
  const closePress = useCallback(async () => {
    const result = await AsyncStorage.getItem('chooseComment');
    if (result != null) {
      await AsyncStorage.removeItem('chooseComment');
    }
    navigation.goBack();
  }, []);
  const [comment, setComment] = useState<string>('');
  const [hashTags, setHashTags] = useState<any>([]);
  let [selectedValue, setSelectedValue] = useState<string | null>(prev => prev);
  // console.log('youtube comment', selectedValue);
  // console.log(comment);
  // console.log('videoThumbnail', routes.params);
  const agentUserInfo = useSelector<UncrRootReducer, AgentAccountInfo | null>(
    state => {
      return state.accountInfo.accountInfo;
    },
  );
  // console.log('selected comment', selectedValue);
  const onPressSubmit = useCallback(async () => {
    if (comment === '' || hashTags.length === 0) {
      Alert.alert(
        '',
        'Please put on recommendation and at least one keyword',
        [
          {
            text: 'Okay',
          },
        ],
        {cancelable: true},
      );
      return;
    }
    // if (selectedValue === 'No your comments in this contents') {
    //   selectedValue = null;
    //   setSelectedValue(null);
    // }
    const result = await AsyncStorage.getItem('chooseComment');
    let youtubeComment: string | null = null;
    let youtubeCommentCount: number | null = null;
    if (result != null && result !== 'No your comments in this contents') {
      const parse = JSON.parse(result);
      console.log('commenttttt', parse.text);
      console.log('commmentlikeCOunts', parse.textLikeCounts);
      youtubeComment = parse.text;
      youtubeCommentCount = Number(parse.textLikeCounts);
      await AsyncStorage.removeItem('chooseComment');
    } else if (
      result === 'No your comments in this contents' ||
      result === null
    ) {
      youtubeComment = null;
    }
    console.log('yotuubeCOmment', youtubeComment);
    console.log('hashTags', hashTags);
    dispatch(
      createAgentAccountFeed(
        routes.params.channelID,
        routes.params.title,
        comment,
        routes.params.likeVideoID,
        routes.params.videoThumbnail,
        routes.params.category,
        youtubeComment,
        youtubeCommentCount,
        hashTags,
      ),
    );
    await sleep(1000);
    MyFeedDispatch(getMyFeedList(agentUserInfo?.agentNumber.toString()));
    navigation.navigate('MainFeed', {
      walletAddress: agentUserInfo?.walletAddress,
      AgentID: agentUserInfo?.agentNumber,
    });
  }, [comment, hashTags]);
  const safeArea = useSafeAreaInsets();
  const googleUserInfo = useSelector<UncrRootReducer, GoogleUser | null>(
    state => {
      return state.googleUser.google;
    },
  );

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [items, setItems] = useState([
    {label: 'Verify your comments from Youtube', value: ''},
  ]);

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
  const [myComments, setMycomments] = useState([]);
  const getYoutubeComment = useCallback(async () => {
    if (Number(routes.params.commentCount) > 500) {
      Alert.alert(
        '',
        'This contents have over 500 comments. Already famous, so we do not support verification',
        [
          {
            text: 'Okay',
            onPress: () => {
              return;
            },
          },
        ],
        {cancelable: false},
      );
      return;
    }
    const accessToken = await AsyncStorage.getItem('accessToken');
    console.log(accessToken);
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
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('mine', result.data.items[0].id);
    while (true) {
      // console.log(routes.params.likeVideoID);
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
    let myComments = [];
    for (let i = 0; i < commentsTotal.length; i++) {
      for (let j = 0; j < commentsTotal[i].length; j++) {
        // console.log(
        //   commentsTotal[i][j].snippet.topLevelComment.snippet.textOriginal,
        // );
        if (
          commentsTotal[i][j].snippet.topLevelComment.snippet.authorChannelId
            .value === result.data.items[0].id
        ) {
          myComments.push(
            commentsTotal[i][j].snippet.topLevelComment.snippet.textOriginal,
          );
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
          // return;
        }
      }
    }
    console.log(myComments[0]);
    setMycomments(myComments);
    setItems([{label: 'No comments', value: 'No comments'}]);
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
  const [focused, setFocused] = useState(false);

  let [text, setText] = useState('');
  const handleTextChange = (newText: any) => {
    // if (textWidth + 50 > remainWidth) {
    //   console.log('game over');
    //   // setText(newText);
    //   return;
    // }
    console.log('length', newText.length);
    if (newText.length === 25) {
      Alert.alert('', 'Text limit reached', [
        {
          text: 'Okay',
          onPress: async () => {
            return;
          },
        },
      ]);
      setText(newText);
    } else {
      setText(newText);
    }
    // console.log('hi');
    // return (
    //   <View style={{flexDirection: 'row'}}>
    //     {hashtags.map((hashtag, index) => (
    //       <View
    //         key={index}
    //         style={{
    //           padding: 8,
    //           backgroundColor: '#7400DB',
    //           borderRadius: 10,
    //           marginRight: 4,
    //         }}>
    //         <Text style={{color: 'white'}} key={hashtag}>
    //           {hashtag}
    //         </Text>
    //       </View>
    //     ))}
    //   </View>
    // );
  };
  const detectHashtags = (text: any) => {
    // const regexp = /(?:^|\s)(?:#|＃)([a-zA-Zㄱ-ㅎ가-힣\d]+)/gm;
    // // const regexp = /(?:^|\s)([a-zA-Zㄱ-ㅎ가-힣\d]+)(?:,)/gm;

    // // const hashtags = [];

    // let match;
    // while ((match = regexp.exec(text))) {
    //   hashTags.push(match[1]);
    // }
    // console.log('detect', text);
    if (text === ' ') {
      return hashTags;
    } else if (text === '  ') {
      return hashTags;
    } else if (text === '   ') {
      return hashTags;
    } else if (text === '    ') {
      return hashTags;
    } else if (text === '     ') {
      return hashTags;
    }
    hashTags.push(text);
    return hashTags;
  };

  // console.log(hashtags);
  const {height, width} = useWindowDimensions();
  let wholeWidth = width;
  const [remainWidth, setRemainWidth] = useState<number>();

  const handleKeyPress = async ({nativeEvent}) => {
    if (nativeEvent.key === ' ') {
      // console.log(text);
      if (text === '') {
        // console.log('space');
        return;
      }
      const result = detectHashtags(text);
      setHashTags(result);
      // handleTextChange 와 겹침
      await sleep(10);
      setText('');
      console.log('Space key pressed');
    } else if (nativeEvent.key === 'Tab') {
      console.log('Tab key pressed');
    } else if (nativeEvent.key === 'Backspace') {
      setText(text.slice(0, text.length - 1));
    }
  };
  const [textWidth, setTextWidth] = useState<number>();
  const [keywords, setKeyword] = useState(true);
  // const handleTextLayout = async event => {
  //   const {height} = event.nativeEvent.contentSize;
  //   // setTextWidth(height);
  //   if (remainWidth < 40) {
  //     // 이중 알럿 방지
  //     setRemainWidth(50);
  //     Alert.alert(
  //       '',
  //       'Keywords room is full',
  //       [
  //         {
  //           text: 'Okay',
  //           onPress: () => {
  //             setText('');
  //             if (remainWidth < 40) {
  //               setKeyword(false);
  //             }
  //             return;
  //           },
  //         },
  //       ],
  //       {cancelable: false},
  //     );
  //   } else if (height > textWidth + 10) {
  //     console.log('ooooooppppps');
  //     Alert.alert(
  //       '',
  //       'Keywords overflow',
  //       [
  //         {
  //           text: 'Okay',
  //           onPress: () => {
  //             setText('');
  //             if (remainWidth < 35) {
  //               setKeyword(false);
  //             }
  //             return;
  //           },
  //         },
  //       ],
  //       {cancelable: false},
  //     );
  //     // await sleep(500);
  //     // setText('');
  //     return;
  //   }
  //   setTextWidth(height);
  //   console.log('test1', textWidth);
  // };
  // const [textWidth1, setTextWidth1] = useState<number>(0);

  // const handleContentSizeChange = event => {
  //   const {width} = event.nativeEvent.contentSize;
  //   setTextWidth1(width);
  //   console.log('content size teset', width);
  // };
  // const [textInputWidth, setTextInputWidth] = useState(0);

  // const handleLayout = event => {
  //   const {width} = event.nativeEvent.layout;
  //   setTextInputWidth(width);
  //   console.log('layout', width);
  // };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{flex: 1}}>
          <Header>
            <View style={{justifyContent: 'center'}}>
              <Header.Icon
                name="arrow-back"
                onPress={closePress}
                size={20}
                color="black"
              />
            </View>
            <View style={{justifyContent: 'center', marginLeft: 20}}>
              <Header.Title title="Recommend" />
            </View>
            <View style={{justifyContent: 'center'}}>
              <TouchableOpacity onPress={onPressSubmit}>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Text
                    style={[
                      Font.Body_16_R,
                      {
                        color:
                          comment != '' && hashTags.length > 0
                            ? '#7400DB'
                            : '#97A2B6',
                      },
                    ]}>
                    Upload
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Header>
          <ScrollView style={{flex: 1, height: 100}}>
            <View style={{flex: 1}}>
              <Spacer space={10} />
              <View
                style={{
                  paddingHorizontal: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
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
                    {routes.params.title.length > 60
                      ? routes.params.title.slice(0, 60) + '...'
                      : routes.params.title}
                  </Text>
                  <Spacer space={4} />
                  <Text style={Font.Caption01_12_R}>
                    {' '}
                    {routes.params.channelTitle}
                  </Text>
                </View>
              </View>
              {/* <Spacer space={20} /> */}
              {/* <Divider width={1} color="rgba(0,0,0,0.1)" /> */}
              <Spacer space={20} />
              <Text
                style={[
                  Font.Body_14_R,
                  {paddingHorizontal: 16, color: 'black'},
                ]}>
                Recommendation
              </Text>
              <Spacer space={4} />
              <View
                style={{
                  alignSelf: 'stretch',
                  marginHorizontal: 16,
                  paddingVertical: 8,
                  paddingHorizontal: 8,
                  borderRadius: 10,
                  borderWidth: 0.4,
                  borderColor: focused ? 'black' : 'gray',
                }}>
                <TextInput
                  autoCorrect={true}
                  autoCapitalize={'none'}
                  // autoFocus
                  value={comment}
                  onChangeText={setComment}
                  placeholder="Why do you like this contents?"
                  placeholderTextColor="gray"
                  textAlignVertical="top"
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
              <Spacer space={24} />
              <Text
                style={[
                  Font.Body_14_R,
                  {paddingHorizontal: 16, color: 'black'},
                ]}>
                Related Keywords (separate with a space)
              </Text>
              <Spacer space={12} />
              <View style={{paddingHorizontal: 16}}>
                {/* <View
                style={{flexDirection: 'row'}}
                onLayout={event => {
                  let {x, y, width, height} = event.nativeEvent.layout;
                  console.log('hashtag width', width);
                  // if (width > wholeWidth) {
                  //   console.log('over');
                  // }
                  console.log(wholeWidth - width);
                  setRemainWidth(wholeWidth - width);
                  if (wholeWidth - width > 50) {
                    setKeyword(true);
                  }
                }}></View> */}

                <View style={{justifyContent: 'flex-end'}}>
                  <TextInput
                    value={text}
                    onChangeText={handleTextChange}
                    maxLength={26}
                    style={{
                      borderBottomWidth: 0.5,
                      borderColor: 'gray',
                      color: 'black',
                      padding: 4,
                      flex: 1,
                    }}
                    onKeyPress={handleKeyPress}
                    keyboardType="default"
                    // onEndEditing={() =>
                    //   Alert.alert('', 'Text limit reached', [
                    //     {
                    //       text: 'Okay',
                    //       onPress: async () => {
                    //         return;
                    //       },
                    //     },
                    //   ])
                    // }
                    // multiline={true}
                  />
                  {/* <TextInput
                  onLayout={handleLayout}
                  style={{borderBottomWidth: 1}}
                /> */}
                </View>
                <Spacer space={12} />

                {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}> */}
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}>
                  {/* {hashTags.map((hashtag, index) => (
                  <View
                    key={index}
                    style={{
                      padding: 8,
                      backgroundColor: '#7400DB',
                      borderRadius: 10,
                      marginRight: 4,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 14,
                        fontWeight: '400',
                        lineHeight: 16,
                      }}
                      key={hashtag}>
                      {hashtag}
                    </Text>
                    <Spacer horizontal space={8} />
                    <TouchableOpacity
                      onPress={() => {
                        console.log('hastag', hashtag);
                        if (hashTags.length > 1) {
                          console.log(hashTags[index]);
                          const result = hashTags.filter(
                            item => item !== hashtag,
                          );
                          setHashTags(result);
                        } else {
                          const result = hashTags.filter(
                            item => item !== hashtag,
                          );
                          setHashTags(result);
                        }
                      }}
                      hitSlop={{top: 10, bottom: 40, right: 10, left: 10}}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 16,
                          fontWeight: '300',
                          lineHeight: 16,
                        }}
                        key={hashtag}>
                        X
                      </Text>
                    </TouchableOpacity>
                  </View> */}
                  {hashTags.map((hashtag, index) => (
                    <View
                      key={index}
                      style={{
                        padding: 8,
                        backgroundColor: '#7400DB',
                        borderRadius: 10,
                        marginRight: 4,
                        marginBottom: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text style={{color: 'white'}} key={hashtag}>
                        {hashtag}
                      </Text>
                      <Spacer space={8} horizontal />
                      <TouchableOpacity
                        onPress={() => {
                          // console.log('hastag', hashtag);
                          if (hashTags.length > 1) {
                            // console.log(hashTags[index]);
                            const result = hashTags.filter(
                              item => item !== hashtag,
                            );
                            setHashTags(result);
                          } else {
                            const result = hashTags.filter(
                              item => item !== hashtag,
                            );
                            setHashTags(result);
                          }
                          // console.log(index);
                          // console.log('text', hashTags[index]);
                          // const result = hashTags.filter(
                          //   item => item !== hashTags[index],
                          // );
                          // console.log(result);
                          // setHashTags(result);
                          // console.log('hash', hashTags);
                        }}
                        hitSlop={{top: 10, bottom: 40, right: 10, left: 10}}>
                        <Image
                          style={{width: 11, height: 11}}
                          source={require('../../assests/filterX.png')}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                {/* </ScrollView> */}
              </View>
              <Spacer space={24} />
              <View style={{flex: 1}}>
                {/* <Text
                  style={[
                    Font.Body_14_R,
                    {paddingHorizontal: 16, color: 'black'},
                  ]}>
                  Share a Youtube comment
                </Text>
                <Spacer space={8} />
                <Text
                  style={[
                    Font.Caption01_12_R,
                    Color.Neutral50,
                    {paddingHorizontal: 16},
                  ]}>
                  By verifying comment from Youtube, you can share the comment
                  in this post.
                </Text>
                <Spacer space={4} />
                <Text
                  style={[
                    Font.Caption01_12_R,
                    Color.Neutral50,
                    {paddingHorizontal: 16},
                  ]}>
                  And the post will be more unique in main feed.
                </Text>
                <Spacer space={10} /> */}
                {/* drop box  */}
                {/* <View style={{paddingHorizontal: 16}}>
                  <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    placeholder="Verify it from a Youtube comment"
                    // modalTitle="Your youtube comments."
                    listMode={
                      Number(routes.params.commentCount) > 500
                        ? 'DEFAULT'
                        : 'SCROLLVIEW'
                    }
                    // modalProps={{
                    //   animationType: 'fade',
                    // }}
                    style={{
                      backgroundColor: '#F2F4F9',
                      borderWidth: 2,
                      borderColor: '#E3E7F0',
                    }}
                    // labelStyle={{
                    //   color: 'white',
                    // }}
                    textStyle={{
                      color: '#97A2B6',
                    }}
                    arrowIconStyle={{
                      backgroundColor: '#F2F4F9',
                      borderColor: '#E3E7F0',
                    }}
                    badgeDotStyle={{
                      backgroundColor: '#F2F4F9',
                      borderColor: '#E3E7F0',
                    }}
                    onPress={
                      Number(routes.params.commentCount) > 500
                        ? () => {
                            Alert.alert(
                              '',
                              'This contents have over 500 comments. Already famous, so we do not support verification',
                              [
                                {
                                  text: 'Okay',
                                  onPress: () => {
                                    return;
                                  },
                                },
                              ],
                              {cancelable: false},
                            );
                          }
                        : getYoutubeComment
                    }
                  />
                </View>
                <Spacer space={24} /> */}
                <View style={{paddingHorizontal: 16}}>
                  <Text style={[Font.Body_14_R, {color: 'black'}]}>
                    Share a Youtube Comment
                  </Text>
                  <Spacer space={8} />
                  <Text style={[Font.Caption01_12_R, Color.Neutral50]}>
                    By verifying comment from Youtube, you can share the comment
                    in this post.
                  </Text>
                  <Spacer space={4} />
                  <Text style={[Font.Caption01_12_R, Color.Neutral50]}>
                    And the post will be more unique in main feed.
                  </Text>
                  <Spacer space={16} />
                  <CustomDropdown
                    commentCounts={routes.params.commentCount}
                    selectedValue={selectedValue}
                    onValueChange={setSelectedValue}
                    likeVideoID={routes.params.likeVideoID}
                  />
                </View>
                {/* <MultiLineInput
            value={comment}
            onChangeText={setComment}
            placeholder="Or write on comments for contents"
            height={60}
            fontSize={14}
          /> */}
                {/* <Divider width={1} color="rgba(0,0,0,0.1)" /> */}

                <Spacer space={20} />
              </View>
            </View>
            {/* <View style={{}}>
            <Button onPress={onPressSubmit}>
              <View
                style={[
                  {
                    backgroundColor: comment != '' ? '#7400DB' : '#F2F4F9',
                    borderRadius: 10,
                    height: 52,
                    justifyContent: 'center',
                    marginBottom: safeArea.bottom + 12,
                    marginHorizontal: 16,
                  },
                ]}>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Text
                    style={[
                      Font.Body_16_R,
                      {color: comment != '' ? 'white' : '#97A2B6'},
                    ]}>
                    Upload
                  </Text>
                </View>
              </View>
            </Button>
          </View> */}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    fontSize: 20,
    marginBottom: 10,
  },
  selectedValue: {
    fontSize: 24,
    marginTop: 20,
  },
});
