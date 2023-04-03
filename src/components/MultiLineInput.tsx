import React, {useState} from 'react';
import {TextInput, View} from 'react-native';

export const MultiLineInput: React.FC<{
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  height?: number;
  onSubmitEditing?: () => void;
  fontSize?: number;
}> = props => {
  const [focused, setFocused] = useState(false);
  return (
    <View
      style={{
        alignSelf: 'stretch',
        paddingHorizontal: 8,
        marginHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: focused ? 'black' : 'gray',
      }}>
      <TextInput
        autoCorrect={false}
        autoCapitalize={'none'}
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderTextColor="gray"
        onSubmitEditing={props.onSubmitEditing}
        style={{
          fontSize: props.fontSize ?? 20,
          height: props.height ?? 200,
          flexShrink: 1,
          color: 'black',
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
};
