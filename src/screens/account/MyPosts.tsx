import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import {FlatList, Image, useWindowDimensions, View} from 'react-native';
import {useSelector} from 'react-redux';
import {AgentAccountInfo} from '../../@types/AgentAccountInfo';
import {Button} from '../../components/Button';
import {Spacer} from '../../components/Spacer';
import {useMyFeedNavigation} from '../../navigation/MyFeedNavigation';
import {UncrRootReducer} from '../../uncrStore';
import {
  createAxiosServerInstance,
  createAxiosYoutubeDataAPIInstance,
  youtubeGeneralAPI,
} from '../../utils/AxiosUtils';
import {Color} from '../../utils/ColorStyle';
import {Font} from '../../utils/FontStyle';

const MyPosts: React.FC = () => {
  const [agentFeedData, setAgentFeedData] = useState([]);
  const {width, height} = useWindowDimensions();
  const agentInfo = useSelector<UncrRootReducer, AgentAccountInfo | null>(
    state => {
      return state.accountInfo.accountInfo;
    },
  );
  const navigation = useMyFeedNavigation<'MyFeed'>();
  //   console.log('tab view', mainRoutes);
  const onPressMyFeedDetail = index => {
    navigation.navigate('MyFeedDetail', {
      MyID: agentInfo?.agentNumber,
      MyFeedData: agentFeedData,
      index: index,
    });
  };
  async function getAgentFeeds() {
    const result = await createAxiosServerInstance().get('/mypage/get', {
      params: {agentID: agentInfo?.agentNumber},
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
    <View style={{marginTop: 16}}>
      <FlatList
        data={agentFeedData}
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        ItemSeparatorComponent={() => <Spacer space={16} />}
        keyExtractor={item => item.boardID.toString()}
        renderItem={({item, index}) => {
          return (
            <View style={{marginHorizontal: 8}}>
              <Button onPress={() => onPressMyFeedDetail(index)}>
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
                <Text style={[Font.Footnote_14_R, {color: 'black'}]}>
                  {item.channelTitle}
                </Text>
              </View>
              <Spacer space={8} />
              <Text style={[Color.Neutral60, Font.Body_14_R]}>
                #Fun <Spacer horizontal space={4} />
                #Must watch
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default MyPosts;
