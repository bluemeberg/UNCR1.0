import React, {useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {Icon} from './Icon';

const Drawbar = () => {
  const interpolateAnim = useRef(new Animated.Value(0)).current;
  const width = Dimensions.get('window').width;
  const [flag, setFlag] = useState(false);
  const onOpenPress = () => {
    Animated.timing(interpolateAnim, {
      toValue: 1,
      useNativeDriver: false,
      duration: 500,
      easing: Easing.out(Easing.circle),
    }).start();
    setFlag(true);
  };

  const onHidePress = () => {
    Animated.timing(interpolateAnim, {
      toValue: 0,
      useNativeDriver: false,
      duration: 500,
      easing: Easing.out(Easing.circle),
    }).start();
    setFlag(false);
  };

  return (
    <>
      {/* home */}
      {flag && (
        <Pressable
          onPress={onHidePress}
          style={[
            StyleSheet.absoluteFill,
            {backgroundColor: 'rgba(0, 0, 0, 0.3)', zIndex: 1},
          ]}
        />
      )}
      <View style={{backgroundColor: 'white'}}>
        <SafeAreaView style={{alignItems: 'flex-end'}}>
          <TouchableHighlight onPress={onOpenPress} style={{borderRadius: 100}}>
            <View style={{padding: 14}}>
              <Icon name="menu" size={20} color="#222" />
            </View>
          </TouchableHighlight>
        </SafeAreaView>
      </View>
      {/* MENU BG */}
      {/* <TouchableWithoutFeedback onPress={onHidePress}>
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            width: interpolateAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '300%'],
            }),
            height: '100%',
            backgroundColor: interpolateAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['#00000000', '#00000090'],
            }),
            // zIndex: interpolateAnim.interpolate({
            //   inputRange: [0, 1],
            //   outputRange: [0, 2],
            // }),
          }}
        />
      </TouchableWithoutFeedback> */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          width: '60%',
          height: '100%',
          backgroundColor: '#ffffff',
          zIndex: 10,
          transform: [
            {
              translateX: interpolateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [width, width * 0.4],
              }),
            },
          ],
        }}>
        <SafeAreaView style={{margin: 10, flexDirection: 'row'}}>
          <View>
            <Text style={{padding: 10, fontSize: 22}}>menu</Text>
            <Text style={{padding: 10, fontSize: 22}}>menu</Text>
            <Text style={{padding: 10, fontSize: 22}}>menu</Text>
          </View>
          {/* <View>
            <TouchableHighlight
              underlayColor={'#aff10050'}
              onPress={onHidePress}
              style={{borderRadius: 100}}>
              <View style={{padding: 14}}>
                <Icon name="menu" size={20} color="#222" />
              </View>
            </TouchableHighlight>
          </View> */}
        </SafeAreaView>
      </Animated.View>
    </>
  );
};

export default Drawbar;
