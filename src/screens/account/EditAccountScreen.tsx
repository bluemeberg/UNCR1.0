import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Header} from '../../components/Header/Header';
import {Spacer} from '../../components/Spacer';
import {useMyFeedNavigation} from '../../navigation/MyFeedNavigation';
import {
  createAxiosLocalServerInstance,
  createAxiosServerInstance,
} from '../../utils/AxiosUtils';
import {Color} from '../../utils/ColorStyle';
import {Font} from '../../utils/FontStyle';
import {ImageURL} from '../../utils/ImageUtils';

const EditAccountScreen: React.FC = () => {
  const [agentID, setAgentID] = useState();
  const [agentName, setAgentName] = useState();
  const getAgentInfo = async () => {
    let loginInfo = await AsyncStorage.getItem('agentInfo');
    loginInfo = JSON.parse(loginInfo);
    console.log(loginInfo);
    setAgentID(loginInfo[1].agentNumber);
    setAgentName(loginInfo[2].agentName);
  };
  const [name, setName] = useState<string>('');
  const [description, setDesciprtion] = useState<string>('');
  const navigaton = useMyFeedNavigation();
  const [nameFocused, setNameFocused] = useState(false);
  const [descFocused, setDescFocused] = useState(false);
  const onPressUpdate = async () => {
    if (name !== '') {
      console.log('push1');
      console.log(name);
      const result = await createAxiosServerInstance().put(
        '/agent/edit/nickname',
        {
          agentID: agentID,
          contents: name,
        },
      );
      console.log(result);
    }
    if (description !== '') {
      console.log('push');
      const result1 = await createAxiosServerInstance().put(
        '/agent/edit/description',
        {
          agentID: agentID,
          contents: description,
        },
      );
      console.log(result1);
    }
  };
  useEffect(() => {
    getAgentInfo();
  }, []);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <Header>
          <Header.Icon
            name="arrow-back"
            size={20}
            color="black"
            onPress={() => {
              navigaton.goBack();
            }}
          />
          <View style={{marginLeft: 20}}>
            <Header.Title title="Edit Profile" />
          </View>
          <View style={{justifyContent: 'center'}}>
            <TouchableOpacity onPress={onPressUpdate}>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text
                  style={[
                    Font.Body_16_R,
                    {
                      color:
                        name != '' || description != '' ? '#7400DB' : '#97A2B6',
                    },
                  ]}>
                  Update
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Header>
        <Spacer space={12} />
        <View style={{flexDirection: 'row', paddingHorizontal: 16}}>
          <Image
            source={{uri: ImageURL + `${agentID}.png`}}
            style={{
              width: 60,
              height: 60,
              borderRadius: 10,
              backgroundColor: 'gray',
            }}
          />
          <Spacer horizontal space={10} />
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[Font.Caption01_12_R, {color: '#ADADAD'}]}>
                Agent #{agentID}
              </Text>
              <Spacer horizontal space={10} />
              <View
                style={[
                  {
                    width: 40,
                    height: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    backgroundColor: '#7400DB',
                  },
                ]}>
                <Text style={[Font.Caption01_12_R, {color: 'white'}]}>
                  Lv. 1
                </Text>
              </View>
            </View>
            <Spacer space={8} />
            <View style={{flex: 1}}>
              <TextInput
                value={name}
                onChangeText={setName}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                style={{
                  borderBottomWidth: 1,
                  borderColor: nameFocused ? 'black' : '#97A2B6',
                  fontSize: 20,
                  flexShrink: 1,
                  color: 'blakc',
                }}
                placeholder={agentName}
                maxLength={20}
              />
            </View>
          </View>
        </View>
        <Spacer space={12} />

        <View style={{borderRadius: 10, marginHorizontal: 16}}>
          <TextInput
            onFocus={() => setDescFocused(true)}
            onBlur={() => setDescFocused(false)}
            value={description}
            onChangeText={setDesciprtion}
            textAlignVertical="top"
            multiline={true}
            placeholder={
              'Please describe your contents personality with Agent#' +
              agentID +
              ' !'
            }
            style={{
              borderWidth: 1,
              borderColor: descFocused ? 'black' : '#97A2B6',
              borderRadius: 4,
              height: 100,
              padding: 12,
              paddingTop: 12,
              flexShrink: 1,
            }}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EditAccountScreen;
