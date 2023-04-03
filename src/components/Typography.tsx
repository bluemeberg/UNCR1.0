import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text as RNText,
  TextProps,
  ViewStyle,
} from 'react-native';

export const Typography: React.FC<{
  color?: string;
  fontSize?: number;
  numberOfLines?: number;
  children: React.ReactElement | string | React.ReactElement[] | string[];
  style?: StyleProp<ViewStyle>;
}> = props => {
  return (
    <RNText
      style={[
        {
          color: props.color ?? 'black',
          fontSize: props.fontSize ?? 10,
          fontFamily: 'System',
        },
        props.style,
      ]}
      numberOfLines={props.numberOfLines}>
      {props.children}
    </RNText>
  );
};
