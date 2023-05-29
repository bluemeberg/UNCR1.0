import React from 'react';
import {View} from 'react-native';
import {Header} from '../components/Header/Header';
import {useRootNavigation} from '../navigation/RootStackNavigation';

const AlarmScreen: React.FC = () => {
  const rootNavigation = useRootNavigation();
  return (
    <View>
      <Header>
        <Header.Icon
          name="arrow-back"
          onPress={() => {
            rootNavigation.goBack();
          }}
          size={20}
          color="black"
        />
        <Header.Title title="Alarm" />
        <Header.Title title="" />
      </Header>
    </View>
  );
};

export default AlarmScreen;
