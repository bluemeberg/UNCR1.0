import React from 'react';
import {Text, useWindowDimensions} from 'react-native';
import {FlatList, View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import ChooseAgentListItem from '../../components/ChooseAgentListItem';
import ChooseNewAgentListItem from '../../components/ChooseNewAgentListItem';
import {Header} from '../../components/Header/Header';
import {Spacer} from '../../components/Spacer';
import {
  useWalletConnectNavigation,
  useWalletConnectRoute,
} from '../../navigation/WalletConnectNavigation';
import {Color} from '../../utils/ColorStyle';
import {Font} from '../../utils/FontStyle';

const ChooseAccountsScreen: React.FC = () => {
  const navigation = useWalletConnectNavigation();
  const route = useWalletConnectRoute();
  console.log(route.params.AgentInfos);
  console.log(route.params.NewAgentInfos);
  const onPressClose = () => {
    navigation.goBack();
  };
  const safeAreaInset = useSafeAreaInsets();
  const {height, width} = useWindowDimensions();
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <Header>
        <Header.Icon
          name="arrow-back"
          onPress={onPressClose}
          size={20}
          color="black"
        />
        <Header.Title title="Select an account" />
        <Header.Title title="" />
      </Header>
      <Spacer space={4} />
      <View style={{maxHeight: height / 2 - 32}}>
        <Text style={[Font.Body_16_R, Color.Black075, {marginHorizontal: 16}]}>
          Continuing from creating accounts
        </Text>
        <Spacer space={8} />
        <FlatList
          data={route.params.NewAgentInfos}
          renderItem={({item}) => {
            return (
              <>
                <ChooseNewAgentListItem
                  agentURI={item.agentURI}
                  agentName={item.agentName}
                  postNumber={item.postNumber}
                  agentNumber={item.agentNumber}
                  walletAddress={item.walletAddress}
                />
                <Spacer space={10} />
              </>
            );
          }}
        />
      </View>
      <Spacer space={12} />
      <View
        style={{
          marginBottom: safeAreaInset.bottom,
          maxHeight: height / 2 - 32,
        }}>
        <Text style={[Font.Body_16_R, Color.Black075, {marginHorizontal: 16}]}>
          Available accounts
        </Text>
        <Spacer space={8} />
        <FlatList
          data={route.params.AgentInfos}
          renderItem={({item}) => {
            return (
              <>
                <ChooseAgentListItem
                  agentURI={item.agentURI}
                  agentName={item.agentName}
                  postNumber={item.postNumber}
                  agentNumber={item.agentNumber}
                  walletAddress={item.walletAddress}
                />
                <Spacer space={10} />
              </>
            );
          }}
        />
        <Spacer space={safeAreaInset.bottom + 32} />
      </View>
    </View>
  );
};

export default ChooseAccountsScreen;
