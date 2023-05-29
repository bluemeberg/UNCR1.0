import React, {useEffect, useState} from 'react';
import {FlatList, Image, Text, useWindowDimensions, View} from 'react-native';
import {Button} from '../Button';
import {Spacer} from '../Spacer';
import {useAgentFeedNavigation} from '../../navigation/AgentFeedNavigation';
import {useMainRoute} from '../../navigation/MainFeedNavigation';
import {
  createAxiosServerInstance,
  createAxiosYoutubeDataAPIInstance,
  youtubeGeneralAPI,
} from '../../utils/AxiosUtils';
import {Color} from '../../utils/ColorStyle';
import {Font} from '../../utils/FontStyle';
import {useAgentInfo} from '../../selectors/agnetInfo';

const AgentPosts: React.FC = ({}) => {
  const mainRoutes = useMainRoute<'AgentFeedNavigation'>();
  const [agentFeedData, setAgentFeedData] = useState([]);
  const {width, height} = useWindowDimensions();

  const navigation = useAgentFeedNavigation();
  //   console.log('tab view', mainRoutes);
  const onPressAgentFeedDetail = index => {
    navigation.push('AgentFeedDetail', {
      AgentID: mainRoutes.params.AgentID,
      AgentFeedData: agentFeedData,
      index: index,
    });
  };
  const agentInfo = useAgentInfo();
  async function getAgentFeeds() {
    const result = await createAxiosServerInstance().get('/mypage/get', {
      params: {
        agentID: mainRoutes.params.AgentID,
        // myAgentID: agentInfo?.agentNumber,
      },
    });
    result.data.boardVOS
      .sort((a: any, b: any) => a.boardID - b.boardID)
      .reverse();
    // console.log(result.data.boardVOS);
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
    setAgentFeedData(result.data.boardVOS);
  }
  useEffect(() => {
    getAgentFeeds();
  }, []);
  console.log(agentFeedData);
  return (
    <View
      style={{
        marginTop: 16,
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
      }}>
      <FlatList
        data={agentFeedData}
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        ItemSeparatorComponent={() => <Spacer space={20} />}
        keyExtractor={item => item.boardID.toString()}
        renderItem={({item, index}) => {
          return (
            <View style={{marginHorizontal: 8, width: width / 2 - 16}}>
              <Button onPress={() => onPressAgentFeedDetail(index)}>
                <Image
                  source={{uri: item.videoThumbnail}}
                  style={{
                    width: width / 2 - 16,
                    height: ((width / 2 - 16) * 9) / 16,
                    borderRadius: 10,
                  }}
                />
              </Button>
              <Spacer space={12} />
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={{uri: item.channelThumbnail}}
                  style={{width: 28, height: 28, borderRadius: 14}}
                />
                <Spacer horizontal space={8} />
                <Text
                  style={[
                    Font.Footnote_14_R,
                    {color: 'black', width: width / 2 - 32},
                  ]}>
                  {item.channelTitle}
                </Text>
              </View>
              <Spacer space={8} />
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                {item.hashtags.map(item => (
                  <View style={{marginRight: 4}}>
                    <Text
                      style={[
                        Color.Purple_Main,
                        {
                          fontFamily: 'System',
                          fontSize: 14,
                          fontStyle: 'normal',
                          fontWeight: '400',
                          lineHeight: 22,
                          letterSpacing: 0.01,
                        },
                      ]}>
                      #{item}
                    </Text>
                    <Spacer space={4} horizontal />
                  </View>
                ))}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default AgentPosts;
