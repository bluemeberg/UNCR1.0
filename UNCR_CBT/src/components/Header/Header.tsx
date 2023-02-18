import React, {ReactElement} from 'react';
import {useWindowDimensions, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Spacer} from '../Spacer';
import {HeaderGroup} from './HeaderGroup';
import {HeaderIcon} from './HeaderIcon';
import {HeaderTitle} from './HeaderTitle';

type CompoundComposition = {
  Title?: React.FC<{title: string}>;
  Icon?: React.FC<{onPress: () => void; name: string}>;
  Group?: React.FC<{children: ReactElement[]}>;
};

export const Header: React.FC<{
  children: ReactElement[];
}> &
  CompoundComposition = props => {
  const insets = useSafeAreaInsets();
  const {width} = useWindowDimensions();
  return (
    <View style={{paddingTop: insets.top}}>
      <View
        style={{
          width: width,
          flexDirection: 'row',
          height: 56,
          borderBottomColor: 'gray',
          borderBottomWidth: 1,
          alignItems: 'center',
        }}>
        <Spacer horizontal={true} space={12} />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {props.children}
        </View>
        <Spacer horizontal={true} space={12} />
      </View>
    </View>
  );
};

Header.Group = HeaderGroup;
Header.Title = HeaderTitle;
Header.Icon = HeaderIcon;
