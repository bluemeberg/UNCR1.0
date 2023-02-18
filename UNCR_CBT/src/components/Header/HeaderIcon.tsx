import React from 'react';
import {Button} from '../Button';
import {Icon} from '../Icon';

export const HeaderIcon: React.FC<{
  onPress: () => void;
  name: string;
}> = props => {
  return (
    <Button onPress={props.onPress}>
      <Icon name={props.name} size={20} color="black" />
    </Button>
  );
};
