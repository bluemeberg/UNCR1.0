import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '../../components/Button';
import {Header} from '../../components/Header/Header';
import {Icon} from '../../components/Icon';
import {Spacer} from '../../components/Spacer';
import {Typography} from '../../components/Typography';

export const LinkListScreen: React.FC = () => {
  const navigation = useNavigation();
  const onPressLinkDetail = () => {
    navigation.navigate('LinkDetail');
  };
  const onPressAddLink = useCallback(() => {
    navigation.navigate('AddScreen');
  }, []);

  const safeAreaInset = useSafeAreaInsets();
  return (
    <View style={{flex: 1}}>
      <Header>
        <Header.Group>
          <Header.Title title="LINK LIST" />
        </Header.Group>
      </Header>
      <View style={{flex: 1}}>
        <Button onPress={onPressLinkDetail}>
          <Typography>LINK DETAIL로 이동하기</Typography>
        </Button>
        <Spacer space={12} />
        <Button onPress={onPressAddLink}>
          <Typography>링크 등록하기로 이동하기</Typography>
        </Button>
      </View>
      <View
        style={{
          position: 'absolute',
          right: 24,
          bottom: 24 + safeAreaInset.bottom,
        }}>
        <Button onPress={onPressAddLink}>
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'black',
            }}>
            <Icon name="add" color="white" size={32} />
          </View>
        </Button>
      </View>
    </View>
  );
};

export default LinkListScreen;
