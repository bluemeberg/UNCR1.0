import React from 'react';
import {View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Icon: React.FC<{
  name: string;
  size?: number;
  color?: string;
}> = props => {
  return <Ionicons name={props.name} size={props.size} color={props.color} />;
};
