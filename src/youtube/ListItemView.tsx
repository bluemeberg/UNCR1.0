import React from 'react';
import {Image, useWindowDimensions, View} from 'react-native';
import {RemoteImage} from '../components/RemoteImage';
import {Typography} from '../components/Typography';
import {TypeListItem} from './TypeListItem';
import YouTube from 'react-native-youtube';
import {ANDROID_API_KEY, API_KEY} from './useYoutubeData';
export const ListItemView: React.FC<{
  item: TypeListItem;
}> = props => {
  const {width} = useWindowDimensions();
  return (
    <View>
      <YouTube
        videoId={props.item.id}
        apiKey={ANDROID_API_KEY}
        style={{alignSelf: 'stretch', height: 300}}
        
      />
      <View
        style={{
          paddingHorizontal: 12,
          paddingVertical: 12,
          flexDirection: 'column',
        }}>
        <Typography fontSize={16}>{props.item.title}</Typography>
        <Typography fontSize={12}>
          {props.item.channelTitle} / {props.item.publishedAt}
        </Typography>
      </View>
    </View>
  );
};
