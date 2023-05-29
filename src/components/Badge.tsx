import React, {ReactElement} from 'react';
import {View} from 'react-native';
import {Typography} from './Typography';

export const Badge: React.FC<{
  children: ReactElement;
  count?: number;
}> = props => {
  return (
    <View>
      {props.children}
      <View
        style={[
          {
            width: 12,
            height: 12,
            borderRadius: 4,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 0.5,
          },
          {
            position: 'absolute',
            right: -12,
            top: -12,
          },
        ]}>
        {props.count && (
          <Typography fontSize={8} color="black">
            {props.count.toString()}
          </Typography>
        )}
      </View>
    </View>
  );
};
