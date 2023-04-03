import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '../../components/Button';
import {Header} from '../../components/Header/Header';
import {SingleLineInput} from '../../components/SingleLineInput';
import {Spacer} from '../../components/Spacer';
import {Typography} from '../../components/Typography';
import {
  useSignupNavigation,
  useSignupRoute,
} from '../../navigation/test/SignUpNavigation';
import EmailValidator from 'email-validator';
import axios from 'axios';
import {TypeListItem} from '../../youtube/TypeListItem';

export const InputEmailScreen: React.FC = () => {
  const navigation = useSignupNavigation<'InputEmail'>();
  const routes = useSignupRoute<'InputEmail'>();
  const safeArea = useSafeAreaInsets();
  const [inputEmail, setInputEmail] = useState<string>(
    routes.params.preInput.email,
  );

  const onPressSubmit = useCallback(() => {
    if (!isValid) {
      return;
    }
    navigation.push('InputName', {
      preInput: routes.params.preInput,
      uid: routes.params.uid,
      inputEmail: inputEmail,
    });
  }, []);

  const isValid = useMemo(() => {
    if (inputEmail.length === 0) {
      return false;
    }
    return EmailValidator.validate(inputEmail);
  }, [inputEmail]);

  return (
    <View style={{flex: 1}}>
      <Header>
        <Header.Group>
          <Header.Title title="InputEmailScreen" />
        </Header.Group>
        <Header.Icon name="close" onPress={navigation.goBack} />
      </Header>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 20,
        }}>
        <SingleLineInput
          value={inputEmail}
          onChangeText={setInputEmail}
          placeholder="put your email"
          onSubmitEditing={onPressSubmit}
          keyboardType="email-address"
        />
      </View>
      <Button onPress={onPressSubmit}>
        <View style={{backgroundColor: isValid ? 'black' : 'lightgray'}}>
          <Spacer space={16} />
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Typography fontSize={20} color="white">
              Next
            </Typography>
          </View>
          <Spacer space={safeArea.bottom + 12} />
        </View>
      </Button>
    </View>
  );
};
