import React, {useCallback, useMemo, useState} from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {createFeed, TypeFeedListDispatch} from '../../actions/test/feedList';
import {Button} from '../../components/Button';
import {Header} from '../../components/Header/Header';
import {Icon} from '../../components/Icon';
import {MultiLineInput} from '../../components/MultiLineInput';
import {Spacer} from '../../components/Spacer';
import {Typography} from '../../components/Typography';
import {useRootNavigation} from '../../navigation/test/TestRootStackNavigator';

export const AddFeedScreen: React.FC = () => {
  const rootNavigation = useRootNavigation();
  const SafeAreaInsets = useSafeAreaInsets();
  const onPressBack = useCallback(() => {
    rootNavigation.goBack();
  }, []);
  const dispatch = useDispatch<TypeFeedListDispatch>();
  
  const [inputMessage, setInputMessage] = useState('');
  const canSave = useMemo(() => {
    if (inputMessage === '') return false;
    return true;
  }, [inputMessage]);
  const onPressSave = useCallback(async () => {
    if (!canSave) return;
    await dispatch(
      createFeed({
        imageUrl:
          'https://docs.expo.dev/static/images/tutorial/background-image.png',
        content: inputMessage,
      }),
    );
    rootNavigation.goBack();
  }, [canSave, inputMessage]);
  return (
    <View style={{flex: 1}}>
      <Header>
        <Header.Title title="ADD FEED"></Header.Title>
        <Header.Icon name="close" onPress={onPressBack}></Header.Icon>
      </Header>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Button onPress={() => {}}>
            <View
              style={{
                width: 100,
                height: 100,
                backgroundColor: 'lightgray',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
              }}>
              <Icon name="add" size={36} color="gray" />
            </View>
          </Button>
          <View style={{flex: 1}}>
            <MultiLineInput
              value={inputMessage}
              onChangeText={setInputMessage}
              onSubmitEditing={onPressSave}
              placeholder="입력해주세요"
              height={80}
              fontSize={16}
            />
          </View>
        </View>
      </View>
      <Button onPress={onPressSave}>
        <View style={{backgroundColor: canSave ? 'black' : 'gray'}}>
          <View
            style={{
              height: 52,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Typography color={canSave ? 'white' : 'lightgray'} fontSize={18}>
              저장하기
            </Typography>
          </View>
          <Spacer space={SafeAreaInsets.bottom} />
        </View>
      </Button>
    </View>
  );
};
