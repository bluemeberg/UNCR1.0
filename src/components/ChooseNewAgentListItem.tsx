import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {Color} from '../utils/ColorStyle';
import {Font} from '../utils/FontStyle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Spacer} from './Spacer';
import {ChooseAgentInfo} from '../@types/ChooseAgentInfo';
import {useWalletConnectNavigation} from '../navigation/WalletConnectNavigation';

const ChooseNewAgentListItem: React.FC<ChooseAgentInfo> = props => {
  const navigation = useWalletConnectNavigation();
  const onPressAgentNaming = () => {
    navigation.push('Naming', {
      walletAddress: props.walletAddress,
      AgentID: props.agentNumber,
    });
  };

  return (
    <TouchableOpacity onPress={onPressAgentNaming}>
      <View
        style={{
          backgroundColor: '#F7F8FC',
          borderColor: '#F2F4F9',
          borderWidth: 1,
          borderRadius: 10,
          flexDirection: 'row',
          marginHorizontal: 16,
        }}>
        <Image
          style={{width: 80, height: 80, borderRadius: 10, margin: 16}}
          source={{uri: props.agentURI}}
        />
        <View style={{justifyContent: 'center', flex: 1}}>
          <Text style={[Font.Headline_16_SM, {color: 'black'}]}>
            Agent # {props.agentNumber}
          </Text>
          <Spacer space={4} />
          <Text
            style={[
              {
                fontFamily: 'System',
                fontSize: 14,
                fontStyle: 'normal',
                fontWeight: '400',
                lineHeight: 16,
                letterSpacing: 0.01,
                color: '#ffffff',
              },
              Color.Neutral60,
            ]}>
            Please finish naming the agent.
          </Text>
        </View>
        <Spacer horizontal space={8} />
        {/* <TouchableOpacity style={{justifyContent: 'center'}}>
          <View style={{justifyContent: 'center'}}>
            <MaterialCommunityIcons
              name="chevron-right"
              size={40}
              style={Color.Neutral60}
            />
          </View>
        </TouchableOpacity> */}
      </View>
    </TouchableOpacity>
  );
};

export default ChooseNewAgentListItem;
