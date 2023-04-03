import React, {useCallback, useEffect} from 'react';
import {useWindowDimensions, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getDog, likeDog, TypeDogDispatch} from '../../actions/test/dog';
import {Button} from '../../components/Button';
import {Header} from '../../components/Header/Header';
import {Icon} from '../../components/Icon';
import {RemoteImage} from '../../components/RemoteImage';
import {Spacer} from '../../components/Spacer';
import {Typography} from '../../components/Typography';
import {TypeDog} from '../../data/test/TypeDog';
import {TypeRootReducer} from '../../store';

export const MainScreen2 = () => {
  // selector : 어떤 state값을 쓰고 싶을 때 사용
  const dog = useSelector<TypeRootReducer, TypeDog | null>(
    state => state.dog.currentDog,
  );
  const {width} = useWindowDimensions();
  // 변하는 데이터를 불러올때
  const dispatch = useDispatch<TypeDogDispatch>();

  // 좋아요 버튼 눌렀을 때 해당 사진 서버로 post thunk action 발생
  const onPressLike = useCallback(() => {
    if (dog === null) {
      return;
    }
    dispatch(likeDog(dog));
  }, [dispatch, dog]);

    // 다음 강아지 사진 서버로 부터 불러오기 (GET)
  const onPressDisLike = useCallback(() => {
    dispatch(getDog());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDog());
  }, [dispatch]);

  console.log('dog!!', dog);
  return (
    <View style={{flex: 1}}>
      <Header>
        <Header.Title title="MainScreen2" />
      </Header>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        {dog !== null && (
          <View style={{width: width * 0.85}}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <RemoteImage
                url={dog.photoUrl}
                width={width * 0.7}
                height={width * 0.7}
              />
            </View>
            <Spacer space={64} />
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, marginRight: 4}}>
                <Button onPress={onPressLike}>
                  <View
                    style={{
                      paddingVertical: 12,
                      backgroundColor: 'red',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 4,
                    }}>
                    <Icon name="thumbs-up" color="white" size={16} />
                    <Typography fontSize={20} color="white">
                      LIKE
                    </Typography>
                  </View>
                </Button>
              </View>
              <View style={{flex: 1, marginLeft: 4}}>
                <Button onPress={onPressDisLike}>
                  <View
                    style={{
                      paddingVertical: 12,
                      backgroundColor: 'blue',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 4,
                    }}>
                    <Icon name="thumbs-down" color="white" size={16} />
                    <Typography fontSize={20} color="white">
                      DISLIKE
                    </Typography>
                  </View>
                </Button>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default MainScreen2;
