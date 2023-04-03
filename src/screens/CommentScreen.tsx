import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import {Header} from '../components/Header/Header';
import {
  useMainNavigation,
  useMainRoute,
} from '../navigation/MainFeedNavigation';
import {useAgentInfo} from '../selectors/agnetInfo';
import FeedListItemHeader from '../components/FeedListItemHeader';
import {useDispatch} from 'react-redux';
import {
  getAgentFeedList,
  TypeAgentFeedListDispatch,
} from '../actions/agentFeed';
import {sleep} from '../utils/sleep';
import {Font} from '../utils/FontStyle';
import {Spacer} from '../components/Spacer';
import {Divider} from '../components/Divider';
import {Button} from '../components/Button';
import {createAxiosServerInstance} from '../utils/AxiosUtils';
import {Icon} from '../components/Icon';
import {MultiLineInput} from '../components/MultiLineInput';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getMainFeedList, TypeMainFeedListDispatch} from '../actions/mainFeed';
import {
  useCommentNavigation,
  useCommentRoute,
} from '../navigation/CommentNavigation';
import {useRootNavigation} from '../navigation/RootStackNavigation';

const CommentScreen: React.FC = () => {
  const navigation = useRootNavigation<'Comment'>();
  const commentNavigation = useCommentNavigation<'AgentFeed'>();
  const onPressClose = () => {
    commentNavigation.goBack();
  };
  const route = useCommentRoute<'Comment'>();
  console.log('comment', route);
  const agnetInfo = useAgentInfo();
  // console.log(route.params);
  const agentFeedDispatch = useDispatch<TypeAgentFeedListDispatch>();
  const onPressAgentFeed = useCallback(async (agentNumber: number) => {
    agentFeedDispatch(getAgentFeedList(agentNumber.toString()));
    await sleep(500);
    navigation.push('AgentFeed', {AgentID: agentNumber});
  }, []);
  const feedDispatch = useDispatch<TypeMainFeedListDispatch>();

  const onPressAddComment = async () => {
    const result = await createAxiosServerInstance().post('/comment/add', {
      boardID: route.params.boardID,
      commentContent: comment,
      agentID: agnetInfo?.agentNumber,
    });
    // console.log(result);
    getComment();
  };
  // 코멘트 받아오기
  const {width, height} = useWindowDimensions();
  const [comment, setComment] = useState<string>('');
  console.log(comment);
  const [commentList, setCommentList] = useState([]);
  const safeAreaInsets = useSafeAreaInsets();
  async function getComment() {
    const result = await createAxiosServerInstance().get('/comment/get', {
      params: {
        boardID: route.params.boardID,
      },
    });
    // console.log('comment', result.data);
    result.data.sort((a: any, b: any) => a.commentID - b.commentID).reverse();
    setCommentList(result.data);
  }
  const [focused, setFocused] = useState(true);

  useEffect(() => {
    getComment();
  }, []);
  useEffect(() => {
    return () => {
      feedDispatch(
        getMainFeedList(agnetInfo?.agentNumber.toString() ?? 'null'),
      );
    };
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Header>
        <Header.Icon
          name="arrow-back"
          onPress={onPressClose}
          size={20}
          color="black"
        />
      </Header>
      <FeedListItemHeader
        agentURI={`https://uncr.io/${route.params.boardAgentID}.png`}
        agentNickname={route.params.agentNickName}
        agentID={Number(route.params.boardAgentID)}
        channelThumbnail={route.params.channelThumbnail}
        channelTitle={route.params.channelTitle}
        onPressAent={() => onPressAgentFeed(Number(route.params.boardAgentID))}
      />
      <Spacer space={16} />
      <View style={{paddingHorizontal: 16}}>
        <Text style={Font.Body_16_R}>{route.params.boardContent}</Text>
      </View>
      <Spacer space={16} />
      <Divider width={0.5} color="#F2F4F9" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <FlatList
          data={commentList}
          renderItem={({item}) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  marginVertical: 10,
                  marginHorizontal: 16,
                  alignItems: 'center',
                }}>
                <Button onPress={() => onPressAgentFeed(Number(item.agentID))}>
                  <Image
                    source={{uri: `https://uncr.io/${item.agentID}.png`}}
                    style={{width: 40, height: 40, borderRadius: 10}}
                  />
                </Button>
                <Spacer horizontal space={10} />
                <View style={{justifyContent: 'center', width: width - 72}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text style={[Font.Caption01_14_B, {color: 'black'}]}>
                      {item.agentNickname}
                    </Text>
                    <Spacer space={4} horizontal />
                    <Text style={Font.Caption01_12_R}>
                      Agent #{item.agentID}
                    </Text>
                    <Spacer space={4} horizontal />
                    <Text style={{fontSize: 10, color: 'gray'}}>·</Text>
                    <Spacer space={4} horizontal />
                    <Text
                      style={{fontSize: 10, color: 'gray', marginRight: 16}}>
                      {item.commentTime}
                    </Text>
                  </View>
                  <Spacer space={8} />
                  <Text style={Font.Caption01_14_B}>{item.commentContent}</Text>
                </View>
              </View>
            );
          }}
        />
        <Spacer space={8} />
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            alignItems: 'center',
            marginBottom: Platform.OS === 'android' && focused ? 20 : 0,
            marginTop: Platform.OS === 'android' ? 10 : 0,
          }}>
          {agnetInfo != null ? (
            <>
              <Image
                source={{
                  uri: `https://uncr.io/${agnetInfo?.agentNumber}.png`,
                  height: 40,
                  width: 40,
                }}
                style={{borderRadius: 10}}
              />
              <View style={{flex: 1}}>
                <View
                  style={{
                    alignSelf: 'stretch',
                    marginHorizontal: 8,
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
                    placeholder=""
                    placeholderTextColor="gray"
                    // onSubmitEditing={props.onSubmitEditing}
                    style={{
                      fontSize: 14,
                      height: 40,
                      flexShrink: 1,
                      color: 'black',
                    }}
                    multiline={true}
                    numberOfLines={4}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                  />
                </View>
              </View>
              <Button onPress={onPressAddComment}>
                <Icon name="add" size={20} color="black" />
              </Button>
            </>
          ) : (
            <>
              <Text
                style={[
                  Font.Body_14_R,
                  {
                    paddingHorizontal: 16,
                    marginBottom: safeAreaInsets.bottom + 8,
                    color: 'black',
                    borderWidth: 1,
                    width: width - 32,
                    borderColor: 'gray',
                    borderRadius: 10,
                    paddingVertical: 16,
                  },
                ]}>
                Please Login first
              </Text>
            </>
          )}
        </View>
        <Spacer space={focused ? 8 : safeAreaInsets.bottom + 8} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default CommentScreen;
