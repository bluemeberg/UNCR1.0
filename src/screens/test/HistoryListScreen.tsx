import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {FlatList, useWindowDimensions, View} from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import {useDispatch, useSelector} from 'react-redux';
import {getUserLikedHistory, TypeUserDispatch} from '../../actions/test/user';
import {Button} from '../../components/Button';
import {Header} from '../../components/Header/Header';
import {RemoteImage} from '../../components/RemoteImage';
import {Spacer} from '../../components/Spacer';
import {Typography} from '../../components/Typography';
import {TypeDog} from '../../data/test/TypeDog';
import {useRootNavigation} from '../../navigation/RootStackNavigation';
import {TypeRootReducer} from '../../store';

export const HistoryListScreen: React.FC = () => {
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const dispatch = useDispatch<TypeUserDispatch>();
  const likedList = useSelector<TypeRootReducer, TypeDog[]>(
    state => state.user.history,
  );
  useEffect(() => {
    dispatch(getUserLikedHistory());
  }, [dispatch]);
  return (
    <View style={{flex: 1}}>
      <Header>
        <Header.Title title="History"></Header.Title>
        <Header.Icon
          name="arrow-back"
          onPress={() => navigation.goBack()}></Header.Icon>
      </Header>
      <FlatList
        data={likedList}
        numColumns={2}
        renderItem={({item}) => {
          return (
            <Button onPress={() => {}}>
              <RemoteImage
                width={width * 0.5}
                height={width * 0.5}
                url={item.photoUrl}
              />
            </Button>
          );
        }}
      />
    </View>
  );
};
