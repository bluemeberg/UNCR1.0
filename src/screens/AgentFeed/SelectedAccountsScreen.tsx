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
import {
  getAccountFeedList,
  TypeAgentAccountDispatch,
} from '../../actions/agentAccount';
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
import AgentPosts from '../../components/AgentFeed/AgentPosts';
import AgentStat from '../../components/AgentFeed/AgentStat';
import {ImageURL} from '../../utils/ImageUtils';
import {useAgentInfo} from '../../selectors/agnetInfo';

const renderScene = SceneMap({
  first: AgentPosts,
  second: AgentStat,
});

const SelectedAccountsScreen: React.FC = () => {
  const rootNavigation = useRootNavigation();
  const onPressClose = () => {
    rootNavigation.goBack();
  };
  const mainRoutes = useMainRoute<'AgentFeedNavigation'>();
  console.log(mainRoutes);
  const {width, height} = useWindowDimensions();
  const agentFeed = useSelector<UncrRootReducer, MainFeedInfo[]>(
    state => state.agentFeedList.list,
  );
  const safe = useSafeAreaInsets();
  console.log('agentFeed', agentFeed);
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
  const agentFeedDispatch = useDispatch<TypeAgentAccountDispatch>();
  const agentInfo = useAgentInfo();
  console.log(agentInfo);
  useEffect(() => {
    console.log('useeffect');
    agentFeedDispatch(
      getAccountFeedList(
        mainRoutes.params.AgentID.toString(),
        agentInfo?.agentNumber.toString(),
      ),
    );
  }, [mainRoutes]);
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = useState([
    {key: 'first', title: 'Posts'},
    {key: 'second', title: 'Stats'},
  ]);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Header>
        <Header.Icon
          name="arrow-back"
          onPress={onPressClose}
          size={20}
          color="black"
        />
      </Header>
      <Modal
        visible={isPopupOpen}
        animationType="fade"
        style={{position: 'relative'}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Pressable onPress={() => setIsPopupOpen(false)}>
            <View style={{flex: 1, marginTop: safe.top}}>
              {/* <Pressable onPress={() => setIsPopupOpen(false)}>
                <View
                  style={{
                    opacity: 0.8,
                    width: 50,
                    marginLeft: 16,
                    marginTop: 16,
                  }}>
                  <Icon name="close" size={20} color="black" />
                </View>
              </Pressable> */}
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: safe.bottom + 60,
                }}>
                <Pressable onPress={() => setIsPopupOpen(false)}>
                  <Image
                    source={{
                      uri: ImageURL + `${mainRoutes.params.AgentID}.png`,
                    }}
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
      <View style={{marginHorizontal: 16, flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => {
            setIsPopupOpen(true);
          }}>
          <View>
            <Image
              source={{uri: ImageURL + `${mainRoutes.params.AgentID}.png`}}
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
            <Text style={[Font.Caption01_14_R, {color: 'gray'}]}>
              Agent #{agentFeed.agentVO.agentID}
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
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[Font.Title02_22_R, {color: 'black'}]}>
              {agentFeed.agentVO.agentNickname}
            </Text>
          </View>
        </View>
      </View>
      <Spacer space={16} />
      {/* <View style={{marginHorizontal: 16}}>
        <Text style={{color: 'gray'}}>Please introduce your Agent.</Text>
      </View> */}
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

export default SelectedAccountsScreen;
