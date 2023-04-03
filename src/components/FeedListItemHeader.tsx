import React from 'react';
import {Image} from 'react-native';
import {Text, View} from 'react-native';
import {Button} from './Button';
import {Font} from '../utils/FontStyle';
import {RemoteImage} from './RemoteImage';
import {Spacer} from './Spacer';
import {Typography} from './Typography';

const FeedListItemHeader: React.FC<{
  agentURI: string;
  agentNickname: string;
  agentID: number;
  channelThumbnail: string;
  channelTitle: string;
  onPressAent: () => void;
}> = props => {
  return (
    <View style={{flexDirection: 'row', paddingHorizontal: 16}}>
      <Button onPress={props.onPressAent}>
        <Image
          source={{uri: `https://uncr.io/${props.agentID}.png`}}
          style={{borderRadius: 8, width: 48, height: 48}}
        />
      </Button>
      <Spacer horizontal space={8} />
      <View style={{justifyContent: 'center'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={[Font.Body_16_R, {color: 'black'}]}>
            {props.agentNickname}
          </Text>
          <Spacer horizontal space={6} />
          <Text style={Font.Fontnote_14_R}>
            Agent #{props.agentID.toString()}
          </Text>
        </View>
        <Spacer space={4} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
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
            style={{borderRadius: 5, width: 20, height: 20}}
          />
          <Spacer horizontal space={2} />
          <Text style={[Font.Caption01_14_R, {color: 'black'}]}>
            {props.channelTitle}'s content
          </Text>
        </View>
      </View>
    </View>
  );
};

export default FeedListItemHeader;
