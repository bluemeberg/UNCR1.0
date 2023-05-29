import React, {useCallback} from 'react';
import {Text, View} from 'react-native';
import {Button} from './Button';
import {Spacer} from './Spacer';

const RecommendHashtag: React.FC = () => {
  const onPressHashtag = useCallback(() => {
    console.log('press hastag');
  }, []);
  return (
    <>
      <View style={{paddingHorizontal: 16, flexDirection: 'row'}}>
        <Button onPress={onPressHashtag}>
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.05)',
              borderRadius: 10,
              paddingHorizontal: 20,
              paddingVertical: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text># Fun</Text>
          </View>
        </Button>
        <Spacer space={8} horizontal />
        <Button onPress={onPressHashtag}>
          <View
            style={{
              backgroundColor: '#D9D9D9',
              borderRadius: 10,
              paddingHorizontal: 20,
              paddingVertical: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text># Interesting</Text>
            {/* 흥미롭다 */}
            {/* 이쁘다 */}
            {/*  */}
          </View>
        </Button>
        <Spacer space={8} horizontal />
        <Button onPress={onPressHashtag}>
          <View
            style={{
              backgroundColor: '#D9D9D9',
              borderRadius: 10,
              paddingHorizontal: 20,
              paddingVertical: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text># Impressed</Text>
            {/* 흥미롭다 */}
            {/* 이쁘다 */}
            {/*  */}
          </View>
        </Button>
      </View>
      <Spacer space={10} />
      <View style={{paddingHorizontal: 16, flexDirection: 'row'}}>
        <Button onPress={onPressHashtag}>
          <View
            style={{
              backgroundColor: '#D9D9D9',
              borderRadius: 10,
              paddingHorizontal: 20,
              paddingVertical: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text># Fullfillment</Text>
          </View>
        </Button>
        <Spacer space={8} horizontal />
        <Button onPress={onPressHashtag}>
          <View
            style={{
              backgroundColor: '#D9D9D9',
              borderRadius: 10,
              paddingHorizontal: 20,
              paddingVertical: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text># Newest</Text>
            {/* 흥미롭다 */}
            {/* 이쁘다 */}
            {/*  */}
          </View>
        </Button>
        <Spacer space={8} horizontal />
        <Button onPress={onPressHashtag}>
          <View
            style={{
              backgroundColor: '#D9D9D9',
              borderRadius: 10,
              paddingHorizontal: 20,
              paddingVertical: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text># Impressed</Text>
            {/* 흥미롭다 */}
            {/* 이쁘다 */}
            {/*  */}
          </View>
        </Button>
      </View>
    </>
  );
};

export default RecommendHashtag;
