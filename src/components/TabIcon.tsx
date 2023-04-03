import React from 'react';
import {Badge} from './Badge';
import {Icon} from './Icon';

export const TabIcon: React.FC<{
  visibleBadge: boolean;
  name: string;
  color: string;
}> = props => {
  if (props.visibleBadge) {
    return (
      <Badge>
        <Icon name={props.name} size={20} color={props.color} />
      </Badge>
    );
  }
  return <Icon name={props.name} size={20} color={props.color} />;
};
