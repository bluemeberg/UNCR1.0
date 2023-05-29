import React from 'react';
import {TouchableOpacity, useWindowDimensions, View} from 'react-native';
import {useCreatorListNavigation} from '../../navigation/CreatorListNavigation';
import {useCreatorSupportNavigation} from '../../navigation/CreatorSupporterNavigation';
import {Spacer} from '../Spacer';

const CreatorListComponentBF: React.FC = () => {
  const {width, height} = useWindowDimensions();
  const navigation = useCreatorListNavigation();
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 16,
        maxHeight: 260,
        maxWidth: '100%',
      }}>
      <View
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          width: '100%',
          height: '100%',
          borderRadius: 10,
          padding: 20,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.push('CreatorFeed', {
              screen: 'CreatorFeed',
              params: {channelID: ''},
            });
          }}>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.11)',
                width: width / 9,
                height: width / 9,
                borderRadius: 10,
                padding: 20,
              }}></View>
            <Spacer space={8} horizontal={true} />
            <View style={{flexDirection: 'column', marginTop: 4}}>
              <View
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.11)',
                  width: width - 32 - width / 9 - 50,
                  height: width / 9 / 3,
                  borderRadius: 4,
                }}></View>
              <Spacer space={4} />
              <View
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.11)',
                  width: width - 32 - width / 9 - 50,
                  height: width / 9 / 3,
                  borderRadius: 4,
                }}></View>
            </View>
          </View>
        </TouchableOpacity>
        <Spacer space={12} />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View
            style={{
              width: width / 2.5,
              height: 24,
              backgroundColor: 'rgba(0, 0, 0, 0.11)',
              borderRadius: 10,
            }}></View>
          <View
            style={{
              width: width / 2.5,
              height: 24,
              backgroundColor: 'rgba(0, 0, 0, 0.11)',
              borderRadius: 10,
            }}></View>
        </View>
        <Spacer space={16} />
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              width: 120,
              height: 68,
              borderRadius: 10,
              backgroundColor: 'rgba(0, 0, 0, 0.11)',
            }}></View>
          <Spacer space={4} horizontal={true} />
          <View
            style={{
              width: 120,
              height: 68,
              borderRadius: 10,
              backgroundColor: 'rgba(0, 0, 0, 0.11)',
            }}></View>
          <Spacer space={4} horizontal={true} />
          <View
            style={{
              width: width - 120 - 120 - 32 - 30,
              height: 68,
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
              backgroundColor: 'rgba(0, 0, 0, 0.11)',
            }}></View>
        </View>
        <Spacer space={16} />
        <TouchableOpacity
          onPress={() => {
            navigation.push('CreatorSupportScreen', {
              screen: 'CreatorSupportList',
            });
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                width: 80,
                height: 32,
                backgroundColor: 'rgba(0,0,0,0.1)',
                borderRadius: 4,
              }}></View>
            <Spacer space={4} horizontal />
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              }}></View>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              }}></View>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              }}></View>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              }}></View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreatorListComponentBF;
