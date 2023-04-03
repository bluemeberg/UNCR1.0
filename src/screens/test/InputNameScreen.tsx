import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useId, useMemo, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {Button} from '../../components/Button';
import {Header} from '../../components/Header/Header';
import {Icon} from '../../components/Icon';
import {RemoteImage} from '../../components/RemoteImage';
import {SingleLineInput} from '../../components/SingleLineInput';
import {Typography} from '../../components/Typography';
import {useRootNavigation} from '../../navigation/RootStackNavigation';
import {
  useSignupNavigation,
  useSignupRoute,
} from '../../navigation/test/SignUpNavigation';
import database from '@react-native-firebase/database';
import {setUser} from '../../actions/test/user';

export const InputNameScreen: React.FC = () => {
  const rootNavigation = useRootNavigation<'Signup'>();
  const navigation = useSignupNavigation<'InputName'>();
  const routes = useSignupRoute<'InputName'>();
  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState(
    routes.params.preInput.profileImage,
  );
  const [inputName, setInputName] = useState(routes.params.inputEmail);

  const isValid = useMemo(() => {
    return true;
  }, []);

  const onPressSubmit = useCallback(async () => {
    const currentTime = new Date();
    const reference = database().ref(`member/${routes.params.uid}`);
    console.log('hello', reference);
    await reference.set({
      name: inputName,
      email: routes.params.inputEmail,
      profile: profileImage,
      regeditAt: currentTime.toISOString(),
      lastLoginAt: currentTime.toISOString(),
    });
    const userInfo = await reference
      .once('value')
      .then(snapshot => snapshot.val());
    dispatch(
      setUser({
        uid: routes.params.uid,
        userEmail: userInfo.email,
        userName: userInfo.name,
        profileImage: userInfo.profile,
      }),
    );
    rootNavigation.reset({
      routes: [{name: 'Main'}],
    });
  }, [
    dispatch,
    inputName,
    profileImage,
    rootNavigation,
    routes.params.inputEmail,
    routes.params.uid,
  ]);
  return (
    <View style={{flex: 1}}>
      <Header>
        <Header.Group>
          <Header.Icon name="arrow-back" onPress={navigation.goBack} />
          <Header.Title title="InputNameScreen" />
        </Header.Group>
      </Header>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 24,
          position: 'relative',
        }}>
        {profileImage !== ' ' ? (
          <>
            <Image
              source={{uri: profileImage}}
              style={{width: 100, height: 100, borderRadius: 50}}
            />
            <View style={{position: 'absolute', right: 160}}>
              <View
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: 'gray',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                }}>
                <Icon name="add" size={16} color="white" />
              </View>
            </View>
          </>
        ) : (
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: 'gray',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name="add" size={32} color="black" />
          </View>
        )}
        <SingleLineInput
          value={inputName}
          onChangeText={setInputName}
          placeholder="이름을 입력해주세요"
          onSubmitEditing={onPressSubmit}
        />
      </View>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Button onPress={onPressSubmit}>
          <Typography fontSize={16}>회원 가입 완료</Typography>
        </Button>
      </View>
    </View>
  );
};
