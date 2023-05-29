import React, {useEffect, useState} from 'react';
import {
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {useDispatch, useSelector} from 'react-redux';
import {MainFeedInfo} from '../../@types/MainFeedInfo';
import {getAccountFeedList} from '../../actions/agentAccount';
import {
  getAgentFeedList,
  TypeAgentFeedListDispatch,
} from '../../actions/agentFeed';
import {getMainFeedList} from '../../actions/mainFeed';
import {Badge} from '../../components/Badge';
import {Button} from '../../components/Button';
import {Color} from '../../utils/ColorStyle';
import {Divider} from '../../components/Divider';
import {Font} from '../../utils/FontStyle';
import {Header} from '../../components/Header/Header';
import {Icon} from '../../components/Icon';
import {Spacer} from '../../components/Spacer';
import {useMainRoute} from '../../navigation/MainFeedNavigation';
import {useRootNavigation} from '../../navigation/RootStackNavigation';
import {UncrRootReducer} from '../../uncrStore';
import {sleep} from '../../utils/sleep';

import {AgentAccountInfo} from '../../@types/AgentAccountInfo';
import MyPosts from '../../components/MyFeed/MyPosts';
import MyStats from '../../components/MyFeed/MyStats';
import {ImageURL} from '../../utils/ImageUtils';
import {useMyFeedNavigation} from '../../navigation/MyFeedNavigation';

const renderScene = SceneMap({
  first: MyPosts,
  second: MyStats,
});

const MyFeedComponentScreen: React.FC = () => {
  const rootNavigation = useRootNavigation();
  const onPressClose = () => {
    rootNavigation.goBack();
  };
  const navigation = useMyFeedNavigation();
  const mainRoutes = useMainRoute<'AgentFeedNavigation'>();
  const {width, height} = useWindowDimensions();
  const agentFeed = useSelector<UncrRootReducer, MainFeedInfo[]>(
    state => state.agentFeedList.list,
  );
  const safe = useSafeAreaInsets();
  // console.log('agentFeed', agentFeed.agentVO.agentNickname);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [imageDimension, setImageDimensions] = useState({width: 0, height: 0});
  const onImageLayout = (event: {
    nativeEvent: {layout: {width: any; height: any}};
  }) => {
    const {width, height} = event.nativeEvent.layout;
    setImageDimensions({
      width,
      height,
    });
  };
  const safeAreaInset = useSafeAreaInsets();
  const agentInfo = useSelector<UncrRootReducer, AgentAccountInfo | null>(
    state => {
      return state.accountInfo.accountInfo;
    },
  );
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = useState([
    {key: 'first', title: 'Posts'},
    {key: 'second', title: 'Stats'},
  ]);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Modal
        visible={isPopupOpen}
        animationType="fade"
        style={{position: 'relative'}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Pressable onPress={() => setIsPopupOpen(false)}>
            <View style={{flex: 1, marginTop: safe.top}}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: safe.bottom + 60,
                }}>
                <Pressable onPress={() => setIsPopupOpen(false)}>
                  <Image
                    source={{uri: ImageURL + `${agentInfo?.agentNumber}.png`}}
                    style={{
                      width: width - 32,
                      height: width - 32,
                      borderRadius: 20,
                    }}
                  />
                </Pressable>
              </View>
            </View>
          </Pressable>
        </View>
      </Modal>
      <View
        style={{
          marginHorizontal: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => {
              setIsPopupOpen(true);
            }}>
            <View>
              <Image
                source={{uri: ImageURL + `${agentInfo?.agentNumber}.png`}}
                style={{width: 60, height: 60}}
                borderRadius={10}
                onLayout={onImageLayout}
              />
            </View>
          </TouchableOpacity>
          <Spacer horizontal space={10} />
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[Font.Caption01_12_R, {color: '#ADADAD'}]}>
                Agent #{agentInfo?.agentNumber}
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
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[Font.Title02_22_R, {color: 'black'}]}>
                {agentInfo?.agentName}
              </Text>
            </View>
            {/* <Spacer space={10} />
          <View style={{flexDirection: 'row'}}>
            <Text style={{color: 'black'}}>0 Following</Text>
            <Spacer horizontal space={10} />
            <Text style={{color: 'black'}}>0 Follower</Text>
          </View> */}
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.push('Edit');
          }}>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#CCD4DF',
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}>
            <Text style={[Font.Caption01_12_R, Color.Black100]}>Edit</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Spacer space={16} />
      <View style={{marginHorizontal: 16}}>
        <Text style={{color: 'gray'}}>
          Please descirbe your contents personality.
        </Text>
      </View>
      {/* <Spacer space={20} />
      <View style={{flexDirection: 'row', marginHorizontal: 16}}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Button onPress={() => {}}>
            <Text style={[Font.Body_16_R, {color: 'black'}]}>Posts</Text>
          </Button>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Button onPress={() => {}}>
            <Text style={[Font.Body_16_R, {color: 'gray'}]}>Routings</Text>
          </Button>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Button onPress={() => {}}>
            <Text style={[Font.Body_16_R, {color: 'gray'}]}>Stats</Text>
          </Button>
        </View>
      </View> */}
      <Spacer space={10} />
      {/* <Divider width={0.3} color="gray" /> */}
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
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
              <Text style={{color: focused ? 'black' : 'gray', fontSize: 16}}>
                {route.title}
              </Text>
            )}
          />
        )}
      />
    </View>
  );
};

export default MyFeedComponentScreen;
