import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Image, Text, View} from 'react-native';
import {usePostNavigation} from '../navigation/PostNavigation';
import {
  createAxiosLocalServerInstance,
  createAxiosYoutubeDataAPIInstance,
  youtubeGeneralAPI,
} from '../utils/AxiosUtils';
import {Button} from './Button';
import {Color} from '../utils/ColorStyle';
import {Font} from '../utils/FontStyle';
import {RemoteImage} from './RemoteImage';
import {Spacer} from './Spacer';
import {Typography} from './Typography';
import {TypeLikedVideoItem} from './type/TypeLikedVideoItem';

const LikedVideoListItem: React.FC<{
  item: TypeLikedVideoItem;
}> = props => {
  const navigation = usePostNavigation<'FeedWrite'>();
  const onRecommend = () => {
    navigation.push('FeedWriteDetailScreen', {
      likeVideoID: props.item.id,
      channelTitle: props.item.channelTitle,
      title: props.item.title,
      channelID: props.item.channelId,
      videoThumbnail: props.item.thumbnailUpload,
      category: props.item.categoryId,
      commentCount: props.item.commentCount,
    });
  };
  const [viewCount, setViewCount] = useState();
  // useEffect(() => {
  //   async function videoResult() {
  //     try {
  //       const result = await createAxiosYoutubeDataAPIInstance().get(
  //         '/videos',
  //         {
  //           params: {
  //             key: youtubeGeneralAPI,
  //             part: 'statistics',
  //             id: props.videoID,
  //           },
  //         },
  //       );
  //       setViewCount(result.data.items[0].statistics.viewCount);
  //       // 댓글 카운트도 넘기기
  //       return result;
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   videoResult();
  // });
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image
        source={{uri: props.item.thumbnail}}
        style={{borderRadius: 10, width: 120, height: 67.5}}
      />
      <Spacer horizontal space={8} />
      <View style={{flex: 1.5}}>
        <Text style={[Font.Body_16_R, {color: 'black'}]}>
          {props.item.title.slice(0, 30)} ...
        </Text>
        <Spacer space={4} />
        <Text style={Font.Caption01_12_R}>{props.item.channelTitle}</Text>
        <Text style={Font.Caption01_12_R}>{props.item.viewCount} views</Text>
      </View>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Button onPress={onRecommend}>
          <View
            style={[
              {
                backgroundColor: '#7400DB',
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 40,
              },
            ]}>
            <Text style={Font.Footnote_14_R}>Share</Text>
          </View>
        </Button>
      </View>
    </View>
  );
};

export default LikedVideoListItem;