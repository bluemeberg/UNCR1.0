import React from 'react';
import {View} from 'react-native';
import {useMainRoute} from '../../navigation/MainFeedNavigation';
import {Typography} from '../Typography';

export const AgentFeed: React.FC = () => {
  const routes = useMainRoute<'AgentFeed'>();
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Typography fontSize={20}>
        Hello {routes.params.AgentID.toString()}
      </Typography>
    </View>
  );
};
