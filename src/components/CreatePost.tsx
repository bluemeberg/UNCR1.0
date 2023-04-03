import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AgentAccountInfo} from '../@types/AgentAccountInfo';
import {GuestAccountInfo} from '../@types/GuestAccountInfo';
import {TypeGuestDispatch} from '../actions/guestAccount';
import {useMainRoute} from '../navigation/MainFeedNavigation';
import {useRootNavigation} from '../navigation/RootStackNavigation';
import {UncrRootReducer} from '../uncrStore';
import {Button} from './Button';
import {Font} from '../utils/FontStyle';
import {Header} from './Header/Header';
import {Icon} from './Icon';
import {Typography} from './Typography';

export const CreatePost: React.FC = () => {
  const rootNavigation = useRootNavigation();
  const navigation = useNavigation();

  const onPress = () => {
    setFlag(false);
    setTimeout(() => {
      navigation.goBack();
    }, 100);
    setTimeout(() => {
      rootNavigation.push('Post', {
        screen: 'GoogleAuth',
      });
    }, 200);
  };

  const onCancel = () => {
    setFlag(false);
    setTimeout(() => {
      navigation.goBack();
    }, 100);
  };

  const [flag, setFlag] = useState<boolean>(false);
  const guestInfo = useSelector<UncrRootReducer, GuestAccountInfo | null>(
    state => {
      return state.guestInfo.guestInfo;
    },
  );
  const agentInfo = useSelector<UncrRootReducer, AgentAccountInfo | null>(
    state => {
      return state.accountInfo.accountInfo;
    },
  );

  useEffect(() => {
    if (
      (agentInfo !== null && agentInfo.agentNumber !== 0) ||
      guestInfo !== null
    ) {
      setTimeout(() => {
        setFlag(true);
      }, 300);
      return;
    }
    Alert.alert(
      'Alert',
      'Please login',
      [
        {
          text: 'Okay',
          onPress: () => {
            setFlag(false);
            setTimeout(() => {
              navigation.goBack();
            }, 100);
          },
        },
      ],
      {cancelable: false},
    );
    setTimeout(() => {
      setFlag(true);
    }, 300);
  }, []);

  return (
    <View style={{flex: 1, borderRadius: 10}}>
      <Pressable
        style={[
          StyleSheet.absoluteFill,
          flag && {backgroundColor: 'rgba(0, 0, 0, 0.3)'},
        ]}
        onPress={onCancel}
      />
      <View
        style={{
          width: '100%',
          height: '20%',
          position: 'absolute',
          bottom: 0,
          backgroundColor: 'white',
          borderRadius: 10,
        }}>
        <Text
          style={[Font.Headline_20_SM, {marginHorizontal: 16, marginTop: 16}]}>
          Post
        </Text>
        <Button onPress={onPress}>
          <View
            style={{
              backgroundColor: 'white',
              paddingVertical: 34,
              paddingHorizontal: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="heart-outline" size={16} color="gray" />
              <View style={{marginLeft: 20}}>
                <Text style={[Font.Body_16_R, {color: 'black'}]}>
                  Recommend your liked contents
                </Text>
                <Text style={Font.Caption01_12_R}>
                  Share contents your like from Youtube
                </Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={16} color="gray" />
          </View>
        </Button>
      </View>
    </View>
  );
};

export default CreatePost;
