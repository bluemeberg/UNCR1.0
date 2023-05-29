import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Pressable, StyleSheet, Text} from 'react-native';
import {FlatList, Image, View} from 'react-native';
import {useSelector} from 'react-redux';
import {AgentAccountInfo} from '../../@types/AgentAccountInfo';
import {GoogleUser} from '../../@types/GoogleUser';
import {Button} from '../../components/Button';
import {Divider} from '../../components/Divider';
import {Header} from '../../components/Header/Header';
import LikedVideoListItem from '../../components/LikedVideoListItem';
import {Spacer} from '../../components/Spacer';
import {Typography} from '../../components/Typography';
import {usePostNavigation, usePostRoute} from '../../navigation/PostNavigation';
import {UncrRootReducer} from '../../uncrStore';
import {Color} from '../../utils/ColorStyle';
import {Font} from '../../utils/FontStyle';
import {useYoutubeData} from '../../youtube/useYoutubeData';

export const FeedWriteScreen: React.FC = () => {
  const navigation = usePostNavigation<'FeedWrite'>();
  const closePress = useCallback(() => {
    navigation.popToTop();
  }, []);
  const onPressGoogle = useCallback(() => {
    navigation.navigate('GoogleAuth');
  }, []);
  const route = usePostRoute<'FeedWrite'>();
  // console.log('route', route.params);
  const {
    data,
    commentData,
    loadData,
    loadMoreData,
    loadCommentVideoData,
    loadMoreCommentData,
  } = useYoutubeData();
  const [alreadyToken, setAlreadyToken] = useState<string | null>();
  const getToken = async () => {
    const alreadyToken = await AsyncStorage.getItem('accessToken');
    setAlreadyToken(alreadyToken);
  };
  const agentInfo = useSelector<UncrRootReducer, AgentAccountInfo | null>(
    state => {
      return state.accountInfo.accountInfo;
    },
  );
  console.log(agentInfo);
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    if (agentInfo === null || agentInfo?.agentNumber === 0) {
      setTimeout(() => {
        setFlag(true);
      }, 300);
      Alert.alert(
        'Guide',
        'Please login',
        [
          {
            text: 'Okay',
            onPress: () => {
              setFlag(false);
              setTimeout(() => {
                navigation.popToTop();
              }, 100);
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      loadData();
      loadCommentVideoData();
      getToken();
    }
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Header>
        <Header.Icon
          name="arrow-back"
          onPress={closePress}
          size={20}
          color="black"
        />
        <Header.Title title="Select"></Header.Title>
        {route.params === undefined || route.params.screenName === undefined ? (
          <Header.Icon
            name="refresh"
            size={20}
            color="black"
            onPress={onPressGoogle}
          />
        ) : (
          <Header.Title title="" />
        )}
      </Header>
      {flag === true ? (
        <Pressable
          style={[
            StyleSheet.absoluteFill,
            {backgroundColor: 'rgba(0, 0, 0, 0.3)'},
          ]}
        />
      ) : (
        <></>
      )}
      {/* <View style={{marginLeft: 16, flex: 1}}>
        <Text style={[Font.Headline_16_SM, Color.Black100]}>
          Contents with less than 500 replies
        </Text>
        <Spacer space={16} />
        <FlatList
          data={commentData}
          // windowSize={1}
          // initialNumToRender={5}
          // maxToRenderPerBatch={5}
          onEndReached={loadMoreCommentData}
          onEndReachedThreshold={0.1}
          renderItem={({item, index}) => {
            return (
              <View key={index}>
                <LikedVideoListItem item={item} />
                <Spacer space={20} />
              </View>
            );
          }}
        />
      </View>
      <Spacer space={20} />
      <Divider color="#EEEEEE" width={8} />
      <Spacer space={20} /> */}
      <View style={{marginLeft: 16, flex: 1}}>
        <Text style={[Font.Caption01_12_R, Color.Purple_Main]}>
          ! Purple text means the contents have less than 500 comments.
        </Text>
        <Spacer space={16} />
        <FlatList
          data={data}
          // windowSize={1}
          // initialNumToRender={5}
          // maxToRenderPerBatch={5}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.1}
          renderItem={({item, index}) => {
            return (
              <View key={index}>
                <LikedVideoListItem item={item} />
                <Spacer space={20} />
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};
