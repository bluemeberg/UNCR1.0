import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {AgentAccountInfo} from '../../@types/AgentAccountInfo';
import {
  getAccountFeedList,
  TypeAgentAccountDispatch,
} from '../../actions/agentAccount';
import {Divider} from '../../components/Divider';
import {Icon} from '../../components/Icon';
import {Spacer} from '../../components/Spacer';
import {
  useCreatorListNavigation,
  useCreatorListRoute,
} from '../../navigation/CreatorListNavigation';
import {
  useCreatorSupportNavigation,
  useCreatorSupportRoute,
} from '../../navigation/CreatorSupporterNavigation';
import {UncrRootReducer} from '../../uncrStore';
import {createAxiosServerInstance} from '../../utils/AxiosUtils';
import {Color} from '../../utils/ColorStyle';
import {Font} from '../../utils/FontStyle';
import {ImageURL} from '../../utils/ImageUtils';
import {convertSecondsToTime} from '../../utils/MetricUtils';
import {sleep} from '../../utils/sleep';

const CreatorSupporterList: React.FC = () => {
  // creator/list에서 supporter 정보 넘겨받기
  const insets = useSafeAreaInsets();
  const route = useCreatorSupportRoute();
  console.log(Object.keys(route.params).length);
  console.log(Object.values(route.params));
  const [data, setData] = useState();
  const navigation = useCreatorListNavigation();
  const navigationSupport = useCreatorSupportNavigation();
  console.log('data', data);
  const getData = async () => {
    try {
      for (let i = 0; i < Object.keys(route.params).length; i++) {
        console.log('route', route.params[i].agentID);
        const result = await createAxiosServerInstance().get('/mypage/get', {
          params: {
            agentID: route.params[i].agentID,
          },
        });
        //   console.log('result', result.data.agentVO.agentNickname);
        route.params[i].agentNickname = result.data.agentVO.agentNickname;
      }
      setData(Object.values(route.params));
    } catch (e) {
      console.log('error', e);
    }
  };
  //   console.log('data', data);
  const isFoucsed = useIsFocused();
  useEffect(() => {
    // setTimeout(() => {
    //   getData();
    // }, 1000);
    getData();
  }, []);
  const agentFeedListDispatch = useDispatch<TypeAgentAccountDispatch>();
  const agentInfo = useSelector<UncrRootReducer, AgentAccountInfo | null>(
    state => {
      return state.accountInfo.accountInfo;
    },
  );
  const {width, height} = useWindowDimensions();
  const [flag, setFlag] = useState(false);
  return (
    <View style={{flex: 1, backgroundColor: 'white', paddingTop: insets.top}}>
      {isFoucsed === false ? (
        <Pressable
          style={[
            StyleSheet.absoluteFill,
            {backgroundColor: 'rgba(0, 0, 0, 0.3)', zIndex: 1},
          ]}
        />
      ) : (
        <></>
      )}
      <View style={{height: 56}}>
        <Text
          style={[
            Font.Headline_20_SM,
            Color.Black100,
            {marginTop: 12, textAlign: 'center'},
          ]}>
          Supporters
        </Text>
      </View>
      <View
        style={{
          backgroundColor: 'white',
          position: 'absolute',
          top: insets.top + 2.5,
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
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1.5, alignItems: 'center'}}>
          <Text style={[Font.Footnote_14_R, Color.Neutral50]}>Supporter</Text>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={[Font.Footnote_14_R, Color.Neutral50]}>
            Generated time
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={[Font.Footnote_14_R, Color.Neutral50]}>Views</Text>
        </View>
      </View>
      <Divider width={1} color="#F2F4F9" />
      {flag === true ? (
        <View style={{position: 'absolute', top: height / 2, left: width / 2}}>
          <ActivityIndicator size={20} color="black" />
        </View>
      ) : (
        <></>
      )}
      {data === undefined ? (
        <TouchableOpacity
          onPress={() =>
            navigationSupport.push('Agent', {
              screen: 'AgentFeed',
              params: {AgentID: 5},
            })
          }>
          <View style={{width: 100, height: 100, backgroundColor: 'red'}}>
            <View style={{backgroundColor: 'gray', flex: 1}}>
              <Text>Hello</Text>
              <Text>Hello</Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <FlatList
          data={data}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={async () => {
                  agentFeedListDispatch(
                    getAccountFeedList(
                      item.agentID.toString(),
                      agentInfo != null ? agentInfo?.agentNumber.toString() : 0,
                    ),
                  );
                  setFlag(true);
                  await sleep(2000);
                  setFlag(false);
                  navigationSupport.push('Agent', {
                    screen: 'AgentFeed',
                    params: {AgentID: item.agentID},
                  });
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: 16,
                    marginVertical: 16,
                  }}>
                  <View
                    style={{
                      flexWrap: 'wrap',
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1.5,
                    }}>
                    <Image
                      source={{
                        uri: ImageURL + `${item.agentID}.png`,
                      }}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 4,
                      }}
                    />
                    <Spacer space={4} horizontal />
                    <Text style={[Font.Headline_16_SM, Color.Black100]}>
                      {item.agentNickname}
                    </Text>
                  </View>
                  <View style={{flex: 1.2, alignItems: 'center'}}>
                    <Text style={[Font.Body_16_R, Color.Black100]}>
                      {convertSecondsToTime(
                        item.supportBoards[0].totalDuration,
                      )}
                    </Text>
                  </View>
                  <View style={{flex: 0.9, alignItems: 'center'}}>
                    <Text
                      style={[
                        Font.Body_16_R,
                        Color.Black100,
                        {textAlign: 'center'},
                      ]}>
                      {item.supportBoards[0].totalSurfCount}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

export default CreatorSupporterList;
