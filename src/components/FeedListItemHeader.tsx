import React from 'react';
import {Image} from 'react-native';
import {Text, View} from 'react-native';
import {Button} from './Button';
import {Font} from '../utils/FontStyle';
import {RemoteImage} from './RemoteImage';
import {Spacer} from './Spacer';
import {Typography} from './Typography';
import {TouchableOpacity} from 'react-native';
import {ImageURL} from '../utils/ImageUtils';
import {timeToMetric} from '../utils/MetricUtils';
import {useCreatorFeedNavigation} from '../navigation/CreatorFeedNavigation';

const FeedListItemHeader: React.FC<{
  agentURI: string;
  agentNickname: string;
  agentID: number;
  channelThumbnail: string;
  channelTitle: string;
  onPressAent: () => void;
  boardTime: string;
}> = props => {
  const time = timeToMetric(props.boardTime);
  // console.log('tiem', time);
  const creatorNavigation = useCreatorFeedNavigation();
  return (
    <>
      <View style={{flexDirection: 'row', paddingHorizontal: 16}}>
        <TouchableOpacity onPress={props.onPressAent}>
          <Image
            source={{uri: ImageURL + `${props.agentID}.png`}}
            style={{borderRadius: 8, width: 48, height: 48}}
          />
        </TouchableOpacity>
        <Spacer horizontal space={8} />
        <View style={{justifyContent: 'center', flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={[Font.Body_16_R, {color: 'black'}]}>
              {props.agentNickname}
            </Text>
            <Spacer horizontal space={6} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={[
                {
                  fontFamily: 'System',
                  fontSize: 12,
                  fontStyle: 'normal',
                  fontWeight: '400',
                  lineHeight: 22,
                  letterSpacing: 0.01,
                  color: 'rgba(0,0,0,0.33)',
                },
              ]}>
              Agent #{props.agentID.toString()} •
            </Text>
            <Text
              style={[
                {
                  marginHorizontal: 4,
                  fontFamily: 'System',
                  fontSize: 12,
                  fontStyle: 'normal',
                  fontWeight: '400',
                  lineHeight: 22,
                  letterSpacing: 0.01,
                  color: 'rgba(0,0,0,0.33)',
                },
              ]}>
              {time}
            </Text>
          </View>
        </View>
      </View>
      <Spacer space={8} />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          flexWrap: 'wrap',
        }}>
        <Text style={Font.Caption01_14_R}>Shared</Text>
        <Spacer horizontal space={4} />
        <Image
          // url={props.channelThumbnail}
          source={{
            uri:
              props.channelThumbnail != ''
                ? props.channelThumbnail
                : 'https://i.ytimg.com/vi/kX9wm5MhF6M/hqdefault.jpg',
          }}
          style={{borderRadius: 10, width: 20, height: 20}}
        />
        <Spacer horizontal space={2} />
        <Text style={[Font.Caption01_14_R, {color: '#777777'}]}>
          {props.channelTitle}'s content
        </Text>
      </View>
    </>
  );
};

export default FeedListItemHeader;
