import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {AgentAccountInfo} from '../../@types/AgentAccountInfo';
import {Button} from '../Button';
import {Spacer} from '../Spacer';
import {UncrRootReducer} from '../../uncrStore';
import {
  createAxiosLocalServerInstance,
  createAxiosServerInstance,
  createAxiosYoutubeDataAPIInstance,
  youtubeGeneralAPI,
} from '../../utils/AxiosUtils';
import {Color} from '../../utils/ColorStyle';
import {Font} from '../../utils/FontStyle';
import {convertSecondsToTimeAssume} from '../../utils/MetricUtils';

const MyStats: React.FC = () => {
  const {width, height} = useWindowDimensions();
  const [totalDuration, setTotalDuration] = useState(0);
  const [totalSurfCount, setTotalSurfCount] = useState(0);
  const [agentFeedData, setAgentFeedData] = useState([]);
  const [contentsTabFlag, setContentsTabFlag] = useState(true);
  const [creatorsTabFlag, setCreatorsTabFlag] = useState(false);
  const agentInfo = useSelector<UncrRootReducer, AgentAccountInfo | null>(
    state => {
      return state.accountInfo.accountInfo;
    },
  );
  const onPressContentsTab = () => {
    if (creatorsTabFlag) {
      setCreatorsTabFlag(false);
    }
    setContentsTabFlag(true);
  };
  const onPressCreatorsTab = () => {
    if (contentsTabFlag) {
      setContentsTabFlag(false);
    }
    setCreatorsTabFlag(true);
  };
  async function getAgentFeeds() {
    const result = await createAxiosServerInstance().get('/mypage/get', {
      params: {agentID: agentInfo?.agentNumber},
    });
    result.data.boardVOS
      .sort((a: any, b: any) => a.boardID - b.boardID)
      .reverse();
    for (let i = 0; i < result.data.boardVOS.length; i++) {
      //   console.log(result.data.boardVOS[i].videoID);
      const videoResult = await createAxiosYoutubeDataAPIInstance().get(
        '/videos',
        {
          params: {
            part: 'snippet',
            key: youtubeGeneralAPI,
            id: result.data.boardVOS[i].videoID,
          },
        },
      );
      result.data.boardVOS[i] = Object.assign(result.data.boardVOS[i], {
        videoThumbnail: videoResult.data.items[0].snippet.thumbnails.medium.url,
      });
      //   console.log(a);
    }
    console.log(result.data.agentTotalDuration);
    setTotalDuration(result.data.agentTotalDuration);
    setTotalSurfCount(result.data.agentTotalSurfCount);
    setAgentFeedData(result.data.boardVOS);
  }
  console.log(agentFeedData);
  useEffect(() => {
    getAgentFeeds();
  }, []);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <View style={{marginTop: 16, flexGrow: 1}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 4,
          }}>
          <View
            style={{
              width: width / 2 - 8,
              height: (width / 2 - 16) * (84 / 160),
            }}>
            <ImageBackground
              source={require('../../assests/TimeBG.png')}
              style={{width: '100%', height: '100%'}}>
              <View style={{paddingHorizontal: 16, paddingVertical: 12}}>
                <Text style={[Font.Caption02_10_R, Color.White066]}>
                  Cumulative view time
                </Text>
                <Text style={[Font.Caption02_10_R, Color.White066]}>
                  generated from feed
                </Text>
                <Spacer space={6} />
                <Text style={[Font.Title02_22_R, Color.White100]}>
                  {convertSecondsToTimeAssume(totalDuration)}
                </Text>
              </View>
            </ImageBackground>
          </View>
          <View
            style={{
              width: width / 2 - 8,
              height: (width / 2 - 16) * (84 / 160),
            }}>
            <ImageBackground
              source={require('../../assests/TrafficBG.png')}
              style={{width: '100%', height: '100%'}}>
              <View style={{paddingHorizontal: 16, paddingVertical: 12}}>
                <Text style={[Font.Caption02_10_R, Color.White066]}>
                  Cumulative Inflow to Youtube
                </Text>
                <Text style={[Font.Caption02_10_R, Color.White066]}>
                  generated from feed
                </Text>
                <Spacer space={6} />
                <Text style={[Font.Title02_22_R, Color.White100]}>
                  {totalSurfCount} inflows
                </Text>
              </View>
            </ImageBackground>
          </View>
        </View>
        <Spacer space={16} />
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              width: 100,
              height: 30,
              marginHorizontal: 10,
              backgroundColor: contentsTabFlag ? 'black' : 'white',
              borderRadius: 5,
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#DDDDDD',
            }}>
            <Button onPress={onPressContentsTab}>
              <Text
                style={[
                  Font.Body_14_R,
                  contentsTabFlag ? Color.White100 : Color.Black100,
                  {
                    textAlign: 'center',
                  },
                ]}>
                Contents
              </Text>
            </Button>
          </View>
          <View
            style={{
              width: 100,
              height: 30,
              backgroundColor: creatorsTabFlag ? 'black' : 'white',
              borderRadius: 5,
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#DDDDDD',
            }}>
            <Button onPress={onPressCreatorsTab}>
              <Text
                style={[
                  Font.Body_14_R,
                  creatorsTabFlag ? Color.White100 : Color.Black100,
                  {
                    textAlign: 'center',
                  },
                ]}>
                Creators
              </Text>
            </Button>
          </View>
        </View>
        <Spacer space={16} />
        {contentsTabFlag && (
          <View style={{flex: 1}}>
            <FlatList
              data={agentFeedData}
              numColumns={2}
              columnWrapperStyle={{justifyContent: 'space-between'}}
              contentContainerStyle={{flexGrow: 1}}
              renderItem={({item}) => {
                return (
                  <View style={{marginHorizontal: 8}}>
                    <Image
                      source={{uri: item.videoThumbnail}}
                      style={{
                        width: width / 2 - 16,
                        height: ((width / 2 - 16) * 9) / 16,
                        borderRadius: 10,
                      }}
                    />
                    <Spacer space={8} />
                    <Text style={[Font.Body_14_R, Color.Neutral60]}>
                      Cumulative view time
                    </Text>
                    <Text style={[Font.Footnote_14_SB, Color.Black100]}>
                      {convertSecondsToTimeAssume(item.totalDuration)}
                    </Text>
                    <Spacer space={8} />
                    <Text style={[Font.Body_14_R, Color.Neutral60]}>
                      Inflow to YouTube
                    </Text>
                    <Text style={[Font.Footnote_14_SB, Color.Black100]}>
                      {item.totalSurfCount} inflows
                    </Text>
                    <Spacer space={20} />
                  </View>
                );
              }}
            />
          </View>
        )}
        {creatorsTabFlag && (
          <View style={{marginHorizontal: 16}}>
            <Text>컨셉 UI 입니다.</Text>
            <Spacer space={12} />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={{flex: 1.2}}>
                <Text style={(Font.Caption02_10_R, Color.Neutral60)}>
                  Creator
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={(Font.Caption02_10_R, Color.Neutral60)}>
                  Share
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={(Font.Caption02_10_R, Color.Neutral60)}>View</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={(Font.Caption02_10_R, Color.Neutral60)}>
                  Traffic
                </Text>
              </View>
            </View>
            <Spacer space={12} />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', flex: 1.2}}>
                <Image
                  source={{
                    uri: 'https://yt3.ggpht.com/pSaUNNRqzN1su16ddDNKitMu_NI4tI6KNYn64een9JQm9rk2sKw-_SxkbIDBgBHtEJc55m8LNQ=s88-c-k-c0x00ffffff-no-rj',
                  }}
                  style={{width: 40, height: 40, borderRadius: 20}}
                />
                <Spacer horizontal space={8} />
                <Text style={[Font.Body_14_R, Color.Black100]}>꽉툰</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={[Font.Body_14_R, Color.Black100]}>3 posts</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={[Font.Body_14_R, Color.Black100]}>38 sec</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={[Font.Body_14_R, Color.Black100]}>5 counts</Text>
              </View>
            </View>
          </View>
        )}
        <Spacer space={16} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default MyStats;
