import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {View} from 'react-native';
import {Button} from '../../components/Button';
import {Header} from '../../components/Header/Header';

export const LinkListScreenDetail: React.FC = () => {
  const navigation = useNavigation();
  const onPressGoBack = useCallback(() => {
    navigation.goBack();
  }, []);
  return (
    <View style={{flex: 1}}>
      <Header>
        <Header.Group>
          <Header.Icon name="arrow-back" onPress={onPressGoBack} />
          <Header.Title title="LINK DETAIL"></Header.Title>
        </Header.Group>
      </Header>
    </View>
  );
};

export default LinkListScreenDetail;
