import React from 'react';
import {Button} from '../Button';
import {Icon} from '../Icon';

export const HeaderIcon: React.FC<{
  onPress: () => void;
  name: string;
  color?: string;
  size?: number | 20;
}> = props => {
  return (
    <Button onPress={props.onPress}>
      <Icon name={props.name} size={props.size} color={props.color} />
    </Button>
  );
};
