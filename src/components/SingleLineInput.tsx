import React, {useState} from 'react';
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
} from 'react-native';

export const SingleLineInput: React.FC<{
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmitEditing?: () => void;
  fontSize?: number;
  keyboardType?: TextInputProps['keyboardType'];
  style?: StyleProp<TextStyle>;
}> = props => {
  const [focused, setFocused] = useState(false);
  return (
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
        value={props.value}
        // chage가 발생했을 때
        onChangeText={props.onChangeText}
        keyboardType={props.keyboardType}
        placeholder={props.placeholder}
        placeholderTextColor="gray"
        onSubmitEditing={props.onSubmitEditing}
        style={[props.style, {fontSize: props.fontSize ?? 20, color: 'black'}]}
        onFocus={() => setFocused(true)}
        // focus에서 나왔을 때
        onBlur={() => setFocused(false)}
      />
    </View>
  );
};
