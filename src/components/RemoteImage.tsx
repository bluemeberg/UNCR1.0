import React from 'react';
import {
  Image as RNImage,
  ImageProps,
  ImagePropsBase,
  StyleProp,
} from 'react-native';

export const RemoteImage: React.FC<{
  url: string;
  style?: StyleProp<ImagePropsBase>;
  width: number;
  height: number;
}> = props => {
  return (
    <RNImage
      source={{uri: props.url}}
      style={[props.style, {width: props.width, height: props.height}]}
    />
  );
};
