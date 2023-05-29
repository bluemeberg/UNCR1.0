import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Button} from '../Button';
import {Icon} from '../Icon';

export const HeaderIcon: React.FC<{
  onPress: () => void;
  name: string;
  color?: string;
  size?: number | 20;
}> = props => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      hitSlop={{top: 48, bottom: 48, right: 32, left: 32}}>
      <Icon name={props.name} size={props.size} color={props.color} />
    </TouchableOpacity>
  );
};
