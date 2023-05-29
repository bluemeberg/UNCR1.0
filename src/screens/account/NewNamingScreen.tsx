import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {
  connectAgentAccount,
  TypeAgentAccountDispatch,
} from '../../actions/agentAccount';
import {Button} from '../../components/Button';
import {Color} from '../../utils/ColorStyle';
import {Font} from '../../utils/FontStyle';
import {Header} from '../../components/Header/Header';
import {RemoteImage} from '../../components/RemoteImage';
import {SingleLineInput} from '../../components/SingleLineInput';
import {Spacer} from '../../components/Spacer';
import {Typography} from '../../components/Typography';
import {useMainNavigation} from '../../navigation/MainFeedNavigation';
import {useRootNavigation} from '../../navigation/RootStackNavigation';
import {
  useWalletConnectNavigation,
  useWalletConnectRoute,
} from '../../navigation/WalletConnectNavigation';
import {storeData} from '../../utils/AsyncStorageUtils';
import {
  createAxiosLocalServerInstance,
  createAxiosServerInstance,
} from '../../utils/AxiosUtils';
import {sleep} from '../../utils/sleep';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useMyFeedNavigation} from '../../navigation/MyFeedNavigation';
import {ImageURL} from '../../utils/ImageUtils';

const NewNamingScreen = () => {
  const rootNavigation = useRootNavigation<'Main'>();
  const navigation = useMainNavigation<'MainFeed'>();
  const myNavigation = useMyFeedNavigation<'MyFeed'>();
  const walletNavigation = useWalletConnectNavigation();
  const route = useWalletConnectRoute<'Naming'>();
  // // 초기화
  // walletNavigation.replace('Naming', {
  //   walletAddress: route.params.walletAddress,
  //   AgentID: route.params.AgentID,
  // });
  const agentDispatch = useDispatch<TypeAgentAccountDispatch>();
  // console.log(route.params.AgentID);
  // console.log(route.params.walletAddress);

  const [inputName, setInputName] = useState<string>('');

  const isValid = useMemo(() => {
    if (inputName.length === 0) {
      return false;
    }
    // console.log('true');
    return true;
  }, [inputName]);
  console.log('route', route.params.AgentID);
  const {width} = useWindowDimensions();
  const safeAreaInset = useSafeAreaInsets();
  const onPressSubmit = useCallback(async () => {
    if (!isValid) {
      return;
    }
    try {
      // // agent/add 호출 - 서버
      const result = await createAxiosServerInstance().post('/agent/add', {
        agentID: route.params?.AgentID ?? 0,
        agentNickname: inputName,
        agentURI: ImageURL + `${route.params.AgentID}.png`,
        agentDescriptions: null,
      });

      // // // agent/add 호출 - 로컬
      // const result = await createAxiosLocalServerInstance().post('/agent/add', {
      //   agentID: route.params?.AgentID ?? 0,
      //   agentNickname: inputName,
      //   agentURI: `https://uncr.io/${route.params.AgentID}.png`,
      // });
      // console.log(result);
      // console.log('AgnetID', route.params.AgentID);
    } catch (error) {
      console.log(error);
    }
    // agent dispatch 생성 정보
    agentDispatch(
      connectAgentAccount(
        route.params?.walletAddress ?? '',
        route.params?.AgentID ?? 0,
        inputName,
      ),
    );
    await sleep(1000);
    myNavigation.navigate('MyFeed');
  }, [isValid, inputName]);
  const [focused, setFocused] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <Header>
          <Image
            source={require('../../assests/HeaderLogo1.png')}
            style={{width: 72, height: 21.53}}
          />
        </Header>
        <View style={{marginHorizontal: 24}}>
          <Text style={[Font.Title02_22_R, {color: 'black'}]}>
            Create your Agent #{route.params.AgentID}'s name
          </Text>
          <Text style={Font.Fontnote_14_R}>
            Agent name will be used as your username
          </Text>
          <Spacer space={20} />
          <View
            style={{
              alignSelf: 'stretch',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 4,
              borderBottomWidth: 1,
              borderColor: focused ? 'black' : 'gray',
            }}>
            <TextInput
              // 대문자로 바꿔줌
              autoCorrect={false}
              autoCapitalize={'none'}
              value={inputName}
              // chage가 발생했을 때
              onChangeText={setInputName}
              placeholder="Put your agent name"
              placeholderTextColor="gray"
              style={[{fontSize: 20, color: 'black'}]}
              onFocus={() => setFocused(true)}
              // focus에서 나왔을 때
              onBlur={() => setFocused(false)}
            />
          </View>

          <Spacer space={20} />
        </View>
        <Spacer space={20} />
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image
            source={{uri: ImageURL + `${route.params.AgentID}.png`}}
            style={{width: width / 2, height: width / 2, borderRadius: 10}}
          />
        </View>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Button onPress={onPressSubmit}>
            <View
              style={[
                isValid
                  ? {backgroundColor: '#7400DB'}
                  : {backgroundColor: 'lightgray'},
                {
                  borderRadius: 10,
                  height: 52,
                  justifyContent: 'center',
                  marginHorizontal: 16,
                },
              ]}>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text style={[Font.Fontnote_14_R, {color: 'white'}]}>
                  Create
                </Text>
              </View>
            </View>
          </Button>
        </View>
        {focused ? (
          <Spacer space={4} />
        ) : (
          <Spacer space={Platform.OS === 'ios' ? safeAreaInset.bottom : 12} />
        )}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default NewNamingScreen;
