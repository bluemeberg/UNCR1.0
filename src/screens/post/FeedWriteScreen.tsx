import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {Text} from 'react-native';
import {FlatList, Image, View} from 'react-native';
import {useSelector} from 'react-redux';
import {GoogleUser} from '../../@types/GoogleUser';
import {Button} from '../../components/Button';
import {Header} from '../../components/Header/Header';
import LikedVideoListItem from '../../components/LikedVideoListItem';
import {Spacer} from '../../components/Spacer';
import {Typography} from '../../components/Typography';
import {usePostNavigation, usePostRoute} from '../../navigation/PostNavigation';
import {UncrRootReducer} from '../../uncrStore';
import {useYoutubeData} from '../../youtube/useYoutubeData';

export const FeedWriteScreen: React.FC = () => {
  const navigation = usePostNavigation<'FeedWrite'>();
  const closePress = useCallback(() => {
    navigation.popToTop();
  }, []);
  const route = usePostRoute<'FeedWrite'>();
  // console.log('route', route.params[0]);
  const {data, loadData, loadMoreData} = useYoutubeData();
  useEffect(() => {
    loadData();
  }, []);
  console.log('feed write', data);
  return (
    <View style={{flex: 1}}>
      <Header>
        <Header.Icon
          name="arrow-back"
          onPress={closePress}
          size={20}
          color="black"
        />
        <Header.Title title="Select"></Header.Title>
        <Header.Title title="" />
      </Header>
      <View style={{marginLeft: 16, flex: 1}}>
        <FlatList
          data={data}
          // windowSize={1}
          // initialNumToRender={5}
          // maxToRenderPerBatch={5}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.1}
          renderItem={({item}) => {
            return (
              <>
                <LikedVideoListItem item={item} />
                <Spacer space={20} />
              </>
            );
          }}
        />
      </View>
    </View>
  );
};
