import axios from 'axios';
import React from 'react';
import {Alert, Image, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {
  getAccountFeedList,
  TypeAgentAccountDispatch,
} from '../actions/agentAccount';
import {
  getMainFeedList,
  TypeMainFeedListActions,
  TypeMainFeedListDispatch,
} from '../actions/mainFeed';
import {getMyFeedList, TypeMyAccountDispatch} from '../actions/myFeed';
import {useCommentNavigation} from '../navigation/CommentNavigation';
import {useMainNavigation} from '../navigation/MainFeedNavigation';
import {useRootNavigation} from '../navigation/RootStackNavigation';
import {useAgentInfo} from '../selectors/agnetInfo';
import {createAxiosServerInstance} from '../utils/AxiosUtils';
import {sleep} from '../utils/sleep';
import {Button} from './Button';
import {Icon} from './Icon';
import {Spacer} from './Spacer';
import {Typography} from './Typography';

export const FeedListBottom: React.FC<{
  boardID: number;
  feedCommentNumber: number;
  feedLikeNumber: number;
  isLiked: boolean;
  boardContent: string;
  agentNickName: string;
  channelThumnaial: string;
  channelTitle: string;
  boardAgnetID: string;
  boardTime: string;
  onPressShare: () => {};
}> = props => {
  const feedDispatch = useDispatch<TypeMainFeedListDispatch>();
  const myDispatch = useDispatch<TypeMyAccountDispatch>();
  const agentDispatch = useDispatch<TypeAgentAccountDispatch>();
  const rootNavigation = useRootNavigation<'CommentScreen'>();
  const commentNavigation = useCommentNavigation<'Comment'>();
  const onPressHeart = async () => {
    if (agentInfo === null) {
      Alert.alert(
        'Guide',
        'Please login',
        [
          {
            text: 'Okay',
          },
        ],
        {cancelable: true},
      );
    } else if (agentInfo != null && props.isLiked != true) {
      const result = await createAxiosServerInstance().post('/board/like', {
        boardID: props.boardID,
        agentID: agentInfo?.agentNumber,
      });
      console.log(result);
      // await sleep(500);
      feedDispatch(getMainFeedList(agentInfo.agentNumber.toString()));
      myDispatch(getMyFeedList(agentInfo.agentNumber.toString()));
      agentDispatch(
        getAccountFeedList(
          props.boardAgnetID,
          agentInfo.agentNumber.toString(),
        ),
      );
      // agentDispatch(getAccountFeedList())
    } else if (agentInfo != null && props.isLiked) {
      const result = await createAxiosServerInstance().delete('/board/unlike', {
        data: {
          boardID: props.boardID,
          agentID: agentInfo?.agentNumber,
        },
      });
      console.log(result);
      // await sleep(1000);
      feedDispatch(getMainFeedList(agentInfo.agentNumber.toString()));
      myDispatch(getMyFeedList(agentInfo.agentNumber.toString()));
      agentDispatch(
        getAccountFeedList(
          props.boardAgnetID,
          agentInfo.agentNumber.toString(),
        ),
      );
    }
  };
  const onPressComment = async () => {
    // rootNavigation.push('CommentScreen', {
    //   boardID: props.boardID,
    //   boardContent: props.boardContent,
    //   agentNickName: props.agentNickName,
    //   channelThumbnail: props.channelThumnaial,
    //   channelTitle: props.channelTitle,
    //   boardAgentID: props.boardAgnetID,
    // });
    rootNavigation.push('CommentScreen', {
      boardID: props.boardID,
      boardContent: props.boardContent,
      agentNickName: props.agentNickName,
      channelThumbnail: props.channelThumnaial,
      channelTitle: props.channelTitle,
      boardAgentID: props.boardAgnetID,
      boardTime: props.boardTime,
    });
  };

  const agentInfo = useAgentInfo();
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          onPress={onPressHeart}
          hitSlop={{top: 32, bottom: 32, left: 16, right: 16}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name={props.isLiked ? 'heart' : 'heart-outline'}
              size={16}
              color={props.isLiked ? '#ED0C0C' : 'black'}
            />
            <Spacer horizontal space={5} />
            <Typography fontSize={14} color="gray">
              {props.feedLikeNumber.toString()}
            </Typography>
          </View>
        </TouchableOpacity>
        <Spacer horizontal space={15} />
        <TouchableOpacity
          onPress={onPressComment}
          hitSlop={{top: 32, bottom: 32, left: 16, right: 16}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="chatbubble-outline" size={16} color="black" />
            <Spacer horizontal space={5} />
            <Typography fontSize={14} color="gray">
              {props.feedCommentNumber.toString()}
            </Typography>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity
          onPress={props.onPressShare}
          hitSlop={{top: 32, bottom: 32, left: 16, right: 16}}>
          <Icon name="share-outline" size={18} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
