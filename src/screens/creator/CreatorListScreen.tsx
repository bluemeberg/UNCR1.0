import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CreatorListComponent from '../../components/Creator/CreatorListComponent';
import CreatorListComponentBF from '../../components/Creator/CreatorListComponentBF';
import {Header} from '../../components/Header/Header';
import {Icon} from '../../components/Icon';
import {Spacer} from '../../components/Spacer';
import {useBottomTabRoute} from '../../navigation/BottomTabNavigation';
import {useRootNavigation} from '../../navigation/RootStackNavigation';
import {createAxiosServerInstance} from '../../utils/AxiosUtils';
import {Color} from '../../utils/ColorStyle';
import {Font} from '../../utils/FontStyle';

const CreatorListScreen: React.FC = () => {
  // /creator/list 받아오기
  let [creatorList, setCreatorList] = useState();
  const isFocused = useIsFocused();
  const routes = useBottomTabRoute<'Creator'>();
  const [tabPressCount, setTabPressCount] = useState(0);
  const rootNavgiation = useRootNavigation();
  const [filterData, setFilterData] = useState([
    'Latest',
    'View Time',
    'Supporters',
    'Posts',
  ]);
  const [filter, setFilter] = useState(1);
  const handleFilter = filterValue => {
    setFilter(filterValue);
    if (filterValue === 2) {
      creatorList = creatorList
        .sort((a: any, b: any) => a.supporters.length - b.supporters.length)
        .reverse();
      setCreatorList(creatorList);
    } else if (filterValue === 3) {
      creatorList = creatorList
        .sort(
          (a: any, b: any) => a.creatorBoards.length - b.creatorBoards.length,
        )
        .reverse();
      setCreatorList(creatorList);
    } else if (filterValue === 1) {
      creatorList = creatorList
        .sort(
          (a: any, b: any) => a.channelTotalDuration - b.channelTotalDuration,
        )
        .reverse();
      setCreatorList(creatorList);
    }
  };
  //   console.log('filter', filter);
  useEffect(() => {
    setTabPressCount(0);
  }, [isFocused]);
  useEffect(() => {
    setTabPressCount(prev => prev + 1);
    if (tabPressCount > 0) {
      flatlistRef.current?.scrollToOffset({animated: true, offset: 0});
    }
  }, [routes]);
  const getCreatorList = async () => {
    try {
      let result = await createAxiosServerInstance().get('/creator/list');
      // console.log('get list success', result.data);
      console.log('hi');
      result.data = result.data.filter(item => item.creatorBoards.length > 0);
      result.data = result.data
        .sort(
          (a: any, b: any) => a.channelTotalDuration - b.channelTotalDuration,
        )
        .reverse();
      setCreatorList(result.data);
      console.log('hi2');
    } catch (e) {
      console.log('error', e);
    }
  };
  const insets = useSafeAreaInsets();
  const {width, height} = useWindowDimensions();
  const flatlistRef = useRef();
  useEffect(() => {
    getCreatorList();
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: 'white', paddingTop: insets.top}}>
      <View style={{height: 56}}>
        <Text
          style={[
            Font.Headline_20_SM,
            Color.Black100,
            {marginLeft: 16, marginTop: 12},
          ]}>
          Creators
        </Text>
      </View>
      <View
        style={{
          backgroundColor: 'white',
          position: 'absolute',
          top: insets.top + 2.5,
          right: -2,
        }}>
        <TouchableOpacity
          onPress={() => {
            rootNavgiation.push('Alarm');
          }}
          style={{borderRadius: 100}}>
          <View style={{padding: 14}}>
            <Icon name="notifications-outline" size={20} color="black" />
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* <TouchableOpacity
            onPress={() => {
              handleFilter(0);
            }}>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#DDDDDD',
                backgroundColor: filter === 0 ? '#7400DB' : 'white',
                borderRadius: 4,
              }}>
              <Text
                style={[
                  Font.Body_14_R,
                  filter === 0 ? Color.White100 : Color.Black100,
                  {marginHorizontal: 12, marginVertical: 5},
                ]}>
                Latest
              </Text>
            </View>
          </TouchableOpacity>
          <Spacer horizontal space={8} /> */}
          <TouchableOpacity
            onPress={() => {
              handleFilter(1);
            }}>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#DDDDDD',
                backgroundColor: filter === 1 ? '#7400DB' : 'white',
                borderRadius: 4,
              }}>
              <Text
                style={[
                  Font.Body_14_R,
                  filter === 1 ? Color.White100 : Color.Black100,
                  {marginHorizontal: 12, marginVertical: 5},
                ]}>
                View Time
              </Text>
            </View>
          </TouchableOpacity>
          <Spacer horizontal space={8} />
          <TouchableOpacity
            onPress={() => {
              handleFilter(2);
            }}>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#DDDDDD',
                backgroundColor: filter === 2 ? '#7400DB' : 'white',
                borderRadius: 4,
              }}>
              <Text
                style={[
                  Font.Body_14_R,
                  filter === 2 ? Color.White100 : Color.Black100,
                  {marginHorizontal: 12, marginVertical: 5},
                ]}>
                Supporters
              </Text>
            </View>
          </TouchableOpacity>
          <Spacer horizontal space={8} />
          <TouchableOpacity
            onPress={() => {
              handleFilter(3);
            }}>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#DDDDDD',
                backgroundColor: filter === 3 ? '#7400DB' : 'white',
                borderRadius: 4,
              }}>
              <Text
                style={[
                  Font.Body_14_R,
                  filter === 3 ? Color.White100 : Color.Black100,
                  {marginHorizontal: 12, marginVertical: 5},
                ]}>
                Posts
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <Spacer space={12} />
      {isFocused === false ? (
        <Pressable
          style={[
            StyleSheet.absoluteFill,
            {backgroundColor: 'rgba(0, 0, 0, 0.3)', zIndex: 1},
          ]}
        />
      ) : (
        <></>
      )}
      {/* <CreatorListComponent /> */}

      {creatorList === undefined ? (
        <FlatList
          data={[1, 2, 3, 4]}
          ref={flatlistRef}
          renderItem={({item, index}) => {
            return (
              <>
                <CreatorListComponentBF />
                <Spacer space={20} />
              </>
            );
          }}
        />
      ) : (
        <FlatList
          data={creatorList}
          ref={flatlistRef}
          keyExtractor={item => item.channelID}
          renderItem={({item, index}) => {
            return (
              <>
                <CreatorListComponent
                  channelID={item.channelID}
                  channelThumbnail={null}
                  channelTotalDuration={item.channelTotalDuration}
                  channelTotalSurfCount={item.channelTotalSurfCount}
                  channleTitle={item.channelTitle}
                  creatorBoards={item.creatorBoards}
                  supporters={item.supporters}
                  index={index}
                />
                <Spacer space={20} />
              </>
            );
          }}
        />
      )}
    </View>
  );
};

export default CreatorListScreen;
