import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '../../components/Button';
import {Header} from '../../components/Header/Header';
import {SingleLineInput} from '../../components/SingleLineInput';
import {Spacer} from '../../components/Spacer';
import {Typography} from '../../components/Typography';

export const AddLinkScreen: React.FC = () => {
  const navigation = useNavigation();
  const onPressGoBack = useCallback(() => {
    navigation.goBack();
  }, []);
  const [url, setUrl] = useState('');
  const safeAreaInset = useSafeAreaInsets();
  return (
    <View style={{flex: 1}}>
      <Header>
        <Header.Group>
          <Header.Title title="ADDLINK"></Header.Title>
        </Header.Group>
        <Header.Icon name="close" onPress={onPressGoBack} />
      </Header>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 24,
        }}>
        <SingleLineInput
          value={url}
          onChangeText={setUrl}
          placeholder="https://example.com"
        />
      </View>
      <Button onPress={() => {}}>
        <View style={{backgroundColor: url === '' ? 'gray' : 'black'}}>
          <View
            style={{
              height: 52,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Typography fontSize={18} color="white">
              저장하기
            </Typography>
          </View>
          <Spacer space={safeAreaInset.bottom} />
        </View>
      </Button>
    </View>
  );
};
