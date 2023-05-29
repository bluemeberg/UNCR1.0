import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {FlatList} from 'react-native';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {useSelector} from 'react-redux';
import {AgentAccountInfo} from '../../@types/AgentAccountInfo';
import CreatorFeed from '../../components/Creator/CreatorFeed';
import {Icon} from '../../components/Icon';
import {Spacer} from '../../components/Spacer';
import {
  useCreatorFeedNavigation,
  useCreatorFeedRoute,
  useCreatorListNavigation,
} from '../../navigation/CreatorFeedNavigation';
import {UncrRootReducer} from '../../uncrStore';
import {createAxiosServerInstance} from '../../utils/AxiosUtils';
import {Color} from '../../utils/ColorStyle';
import {Font} from '../../utils/FontStyle';

const CreatorFeedScreen: React.FC = () => {
  // 크리에이터 피드에 대한 포스팅 정보 불러오기
  const [data, setData] = useState();
  const [list, setList] = useState();
  const route = useCreatorFeedRoute();
  console.log('route', route);
  const renderScrene = SceneMap({
    first: CreatorFeed,
  });
  const agentInfo = useSelector<UncrRootReducer, AgentAccountInfo | null>(
    state => {
      return state.accountInfo.accountInfo;
    },
  );
  const [index, setIndex] = React.useState(0);
  const [routes] = useState([{key: 'first', title: 'Posts'}]);
  // /creator/get
  const getCreatorInfo = async () => {
    const result = await createAxiosServerInstance().get('/creator/get', {
      params: {
        agentID: agentInfo != null ? agentInfo?.agentNumber.toString() : 0,
        channelID: route.params.channelID,
      },
    });
    console.log('result', result.data);
    setData(result.data);
    setList(result.data.boards);
  };
  // params : channelID, agentID
  //
  const inset = useSafeAreaInsets();
  const layout = useWindowDimensions();
  const navigation = useCreatorFeedNavigation();
  const isFocused = useIsFocused();
  useEffect(() => {
    getCreatorInfo();
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: 'white', paddingTop: inset.top}}>
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
      <View style={{height: 56, alignItems: 'center'}}>
        <View
          style={{
            backgroundColor: 'white',
            position: 'absolute',
            left: -2,
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{borderRadius: 100}}>
            <View style={{padding: 14}}>
              <Icon name="arrow-back" size={20} color="black" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          marginHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: 48,
            height: 48,
            backgroundColor: 'gray',
            borderRadius: 24,
          }}>
          {data !== undefined ? (
            <Image
              source={{uri: data.channelThumbnail, width: 48, height: 48}}
              style={{borderRadius: 24}}
            />
          ) : (
            <></>
          )}
        </View>
        <Spacer space={10} horizontal />
        <View style={{flexDirection: 'column'}}>
          {data !== undefined ? (
            <>
              <Text style={[Font.Title02_22_B, Color.Black100]}>
                {data.channelTitle}
              </Text>
              <Text style={[Font.Footnote_14_R, Color.Black100]}>
                Posted {data.boards.length}
              </Text>
            </>
          ) : (
            <></>
          )}
        </View>
      </View>
      <Spacer space={20} />
      <View style={{marginHorizontal: 16}}>
        <Text
          style={[
            {
              fontFamily: 'System',
              fontSize: 12,
              fontStyle: 'normal',
              fontWeight: '400',
              lineHeight: 12,
              letterSpacing: 0.01,
            },
            Color.Neutral80,
          ]}>
          {route.params.channelDesc}
        </Text>
      </View>
      {/* <TabView
        navigationState={{index, routes}}
        renderScene={renderScrene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{
              backgroundColor: '#7400DB',
            }}
            style={{
              backgroundColor: 'white',
              shadowOffset: {height: 0, width: 0},
              shadowColor: 'transparent',
              borderBottomWidth: 1,
              borderColor: '#F2F4F9',
            }}
            pressColor={'transparent'}
            renderLabel={({route, focused}) => (
              <Text
                style={{
                  color: focused ? 'black' : 'gray',
                  fontSize: 16,
                }}>
                {route.title}
              </Text>
            )}
          />
        )}
      /> */}
      <Spacer space={16} />
      <FlatList
        data={list}
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        ItemSeparatorComponent={() => <Spacer space={20} />}
        renderItem={({item, index}) => {
          return (
            <View
              style={{
                flexDirection: 'column',
                marginHorizontal: 8,
                width: layout.width / 2 - 16,
              }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.push('CreatorFeedDetailScreen', {
                    channelID: route.params.channelID,
                    channelTitle: data.channelTitle,
                    agentID: agentInfo != null ? agentInfo?.agentNumber : 0,
                    index: index,
                  });
                }}>
                <View
                  style={{
                    width: layout.width / 2 - 16,
                    backgroundColor: 'gray',
                    height: 88,
                    borderRadius: 10,
                  }}>
                  <Image
                    source={{
                      uri: item.videoThumbnail,
                      width: layout.width / 2 - 16,
                      height: 90,
                    }}
                    style={{borderRadius: 10}}
                  />
                </View>
                <Spacer space={10} />
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: 'gray',
                    }}>
                    <Image
                      source={{
                        uri: item.agentURI,
                        width: 32,
                        height: 32,
                      }}
                      style={{borderRadius: 16}}
                    />
                  </View>
                  <Spacer space={8} horizontal />
                  <View
                    style={{
                      width: layout.width / 2 - 48,
                      height: 32,
                      borderRadius: 4,
                      justifyContent: 'center',
                    }}>
                    <Text style={[Font.Body_16_R, Color.Black100]}>
                      {item.agentNickname}
                    </Text>
                  </View>
                </View>
                <Spacer space={8} />
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}>
                  {item.hashtags.map(item => (
                    <View style={{marginRight: 4}}>
                      <Text style={Color.Purple_Main}>#{item}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

export default CreatorFeedScreen;
