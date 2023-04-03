import React, {useEffect, useMemo} from 'react';
import {FlatList, useWindowDimensions, View} from 'react-native';
import {Header} from '../../components/Header/Header';
import {useMyFeedList} from '../../selectors/test/TestuserInfo';
import {FeedInfo} from '../../@types/test/TestFeedInfo';
import {Button} from '../../components/Button';
import {RemoteImage} from '../../components/RemoteImage';
import {useRootNavigation} from '../../navigation/test/TestRootStackNavigator';
import {useDispatch} from 'react-redux';
import {TypeUserDispatch} from '../../actions/test/user';
import {getMyFeedList, TypeUserRRDispatch} from '../../actions/test/userFeed';
export const MyPageScreen: React.FC = () => {
  const data = useMyFeedList();
  const rootNavigation = useRootNavigation();
  const {width} = useWindowDimensions();
  const dispatch = useDispatch<TypeUserRRDispatch>();
  const photoSize = useMemo(() => {
    return width / 3;
  }, [width]);

  useEffect(() => {
    dispatch(getMyFeedList());
  }, []);

  return (
    <View style={{flex: 1}}>
      <Header>
        <Header.Title title="My Page"></Header.Title>
      </Header>
      <FlatList<FeedInfo>
        data={data}
        numColumns={3}
        renderItem={({item}) => {
          return (
            <Button
              onPress={() => {
                rootNavigation.push('FeedList', {list: data});
              }}>
              <RemoteImage
                url={item.imageUrl}
                width={photoSize}
                height={photoSize}
              />
            </Button>
          );
        }}
      />
    </View>
  );
};
