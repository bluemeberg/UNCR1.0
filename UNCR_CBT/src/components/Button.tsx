import React, {ReactElement} from 'react';
import {Pressable, View} from 'react-native';

export const Button: React.FC<{
  onPress: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  hitSlop?: {left: number; right: number; top: number; bottom: number};
  backgroundColor?: string;
  paddingHorizontal?: number;
  paddingVertical?: number;
  children: ReactElement | ReactElement[];
}> = props => {
  return (
    <Pressable
      {...props}
      onPress={props.onPress}
      onPressIn={props.onPressIn}
      onPressOut={props.onPressOut}
      hitSlop={props.hitSlop ?? {left: 0, right: 0, top: 0, bottom: 0}}
      style={{
        backgroundColor: props.backgroundColor,
        paddingHorizontal: props.paddingHorizontal,
        paddingVertical: props.paddingVertical,
      }}>
      {props.children}
    </Pressable>
  );
};
