import React from 'react';
import {View} from 'react-native';

export const Divider: React.FC<{
  width: number;
  color: string;
}> = props => {
  return (
    <View
      style={{
        alignSelf: 'stretch',
        borderWidth: props.width,
        borderColor: props.color,
      }}
    />
  );
};
