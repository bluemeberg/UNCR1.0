import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {Color} from '../utils/ColorStyle';
import {Font} from '../utils/FontStyle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Spacer} from './Spacer';
import {ChooseAgentInfo} from '../@types/ChooseAgentInfo';
import {useWalletConnectNavigation} from '../navigation/WalletConnectNavigation';
import {useDispatch} from 'react-redux';
import {
  connectAgentAccount,
  TypeAgentAccountDispatch,
} from '../actions/agentAccount';
import {useMainNavigation} from '../navigation/MainFeedNavigation';

const ChooseAgentListItem: React.FC<ChooseAgentInfo> = props => {
  const navigation = useMainNavigation();
  const agentDispatch = useDispatch<TypeAgentAccountDispatch>();

  const onPressLogin = () => {
    agentDispatch(
      connectAgentAccount(
        props.walletAddress,
        props.agentNumber,
        props.agentName,
      ),
    );
    navigation.navigate('MainFeed', {
      walletAddress: props.walletAddress,
      AgentID: props.agentNumber,
    });
  };

  return (
    <TouchableOpacity onPress={onPressLogin}>
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
            {props.agentName}
          </Text>
          <Text
            style={[
              {
                fontFamily: 'System',
                fontSize: 12,
                fontStyle: 'normal',
                fontWeight: '400',
                lineHeight: 16,
                letterSpacing: 0.01,
                color: '#ffffff',
              },
              Color.Neutral60,
            ]}>
            Agent #{props.agentNumber}
          </Text>
          <Spacer space={12} />
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
            Posts {props.postNumber}
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

export default ChooseAgentListItem;
