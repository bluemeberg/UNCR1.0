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
import MyPosts from './MyPosts';
import MyStats from './MyStats';

const FirstRoute = () => <View style={{flex: 1, backgroundColor: 'gray'}} />;

const SecondRoute = () => <View style={{flex: 1, backgroundColor: 'black'}} />;

const renderScene = SceneMap({
  first: MyPosts,
  second: MyStats,
});

const MyFeedComponentScreen: React.FC = () => {
  const rootNavigation = useRootNavigation();
  const onPressClose = () => {
    rootNavigation.goBack();
  };
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
        <View style={{flex: 1, marginTop: safe.top}}>
          <Pressable onPress={() => setIsPopupOpen(false)}>
            <View
              style={{
                opacity: 0.8,
                width: 50,
                marginLeft: 16,
                marginTop: 16,
              }}>
              <Icon name="close" size={20} color="black" />
            </View>
          </Pressable>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: safe.bottom + 60,
            }}>
            <Image
              source={{uri: `https://uncr.io/${agentInfo?.agentNumber}.png`}}
              style={{
                width: width - 32,
                height: width - 32,
                borderRadius: 20,
              }}
            />
          </View>
        </View>
      </Modal>
      <View style={{marginHorizontal: 16, flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => {
            setIsPopupOpen(true);
          }}>
          <View>
            <Image
              source={{uri: `https://uncr.io/${agentInfo?.agentNumber}.png`}}
              style={{width: 100, height: 100}}
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
          <Text style={[Font.Caption01_14_R, {color: 'gray'}]}>
            Agent #{agentInfo?.agentNumber}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[Font.Title02_22_R, {color: 'black'}]}>
              {agentInfo?.agentName}
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
              <Text style={[Font.Caption01_12_R, {color: 'white'}]}>Lv. 1</Text>
            </View>
          </View>
          <Spacer space={10} />
          <View style={{flexDirection: 'row'}}>
            <Text style={{color: 'black'}}>0 Following</Text>
            <Spacer horizontal space={10} />
            <Text style={{color: 'black'}}>0 Follower</Text>
          </View>
        </View>
      </View>
      <Spacer space={16} />
      <View style={{marginHorizontal: 16}}>
        <Text style={{color: 'gray'}}>
          Hello, im Agent ----, im usually consume work out contents
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
              border: 'none',
            }}
            style={{
              backgroundColor: 'white',
              fontWeight: 'bold',
              shadowOffset: {height: 0, width: 0},
              shadowColor: 'transparent',
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
