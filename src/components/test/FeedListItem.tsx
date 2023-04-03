import React from 'react';
import {useWindowDimensions, View} from 'react-native';
import {Button} from '../Button';
import {Icon} from '../Icon';
import {RemoteImage} from '../RemoteImage';
import {Spacer} from '../Spacer';
import {Typography} from '../Typography';

export const FeedListItem: React.FC<{
  image: string;
  isLiked: boolean;
  likeCount: number;
  writer: string;
  comment: string;
  onPressFeed: () => void;
  onPressFavorite: () => void;
}> = props => {
  const {width} = useWindowDimensions();
  console.log(props.isLiked);
  return (
    <Button onPress={props.onPressFeed}>
      <View>
        <RemoteImage url={props.image} width={width} height={width} />
        <Button onPress={props.onPressFavorite}>
          <View style={{paddingHorizontal: 12, paddingVertical: 6}}>
            <Icon
              name={props.isLiked ? 'heart' : 'heart-outline'}
              size={20}
              color={props.isLiked ? 'red' : 'black'}
            />
          </View>
        </Button>
        <View style={{paddingHorizontal: 12}}>
          <Typography fontSize={16}>좋아요 {`${props.likeCount}`}개</Typography>
          <Spacer space={4} />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Typography fontSize={16}>{props.writer}</Typography>
            <Spacer space={8} />
            <Typography fontSize={16}>{props.comment}</Typography>
          </View>
        </View>
      </View>
    </Button>
  );
};
