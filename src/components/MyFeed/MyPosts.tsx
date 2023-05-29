import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import {FlatList, Image, useWindowDimensions, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AgentAccountInfo} from '../../@types/AgentAccountInfo';
import {Button} from '../Button';
import {Spacer} from '../Spacer';
import {useMyFeedNavigation} from '../../navigation/MyFeedNavigation';
import {UncrRootReducer} from '../../uncrStore';
import {
  createAxiosServerInstance,
  createAxiosYoutubeDataAPIInstance,
  youtubeGeneralAPI,
} from '../../utils/AxiosUtils';
import {Color} from '../../utils/ColorStyle';
import {Font} from '../../utils/FontStyle';
import {Divider} from '../Divider';
import {
  getAgentFeedList,
  TypeAgentFeedListDispatch,
} from '../../actions/agentFeed';
import {MainFeedInfo} from '../../@types/MainFeedInfo';
import {
  getAccountFeedList,
  TypeAgentAccountDispatch,
} from '../../actions/agentAccount';
import data from '../../FeedMock.json';
import {useRootNavigation} from '../../navigation/RootStackNavigation';
import {getMyFeedList, TypeMyAccountDispatch} from '../../actions/myFeed';
const MyPosts: React.FC = () => {
  const [agentFeedData, setAgentFeedData] = useState([]);
  const {width, height} = useWindowDimensions();
  const agentInfo = useSelector<UncrRootReducer, AgentAccountInfo | null>(
    state => {
      return state.accountInfo.accountInfo;
    },
  );
  const navigation = useMyFeedNavigation<'MyFeed'>();
  const rootNavigation = useRootNavigation<'My'>();
  //   console.log('tab view', mainRoutes);
  const onPressMyFeedDetail = index => {
    // navigation.push('MyFeedDetail', {
    //   MyID: agentInfo?.agentNumber,
    //   MyFeedData: myFeedData,
    //   index: index,
    // });
    rootNavigation.push('My', {
      screen: 'MyFeedDetail',
      params: {
        MyID: agentInfo?.agentNumber,
        MyFeedData: myFeedData,
        index: index,
      },
    });
  };

  const onPressPost = () => {
    navigation.navigate('CreatePost3');
  };
  const myPatch = useDispatch<TypeMyAccountDispatch>();
  // const agentDispatch = useDispatch<TypeAgentAccountDispatch>();
  // const myFeedData = useSelector<UncrRootReducer, MainFeedInfo[]>(
  //   state => state.myFeedList.myFeedList,
  // );
  // console.log('myFeedData', myFeedData);
  // console.log('agentFeed', myFeedData);
  const [listData, setListData] = useState([1]);
  const myFeedData = useSelector<UncrRootReducer, MainFeedInfo[]>(
    state => state.myFeedList.myFeedList,
  );
  async function getAgentFeeds() {
    myPatch(getMyFeedList(agentInfo?.agentNumber.toString())).then(a => {
      console.log('hi');
      console.log('return', a);
      setListData(a);
    });
    // const result = await createAxiosServerInstance().get('/mypage/get', {
    //   params: {agentID: agentInfo?.agentNumber},
    // });
    // result.data.boardVOS
    //   .sort((a: any, b: any) => a.boardID - b.boardID)
    //   .reverse();
    // // console.log(result.data.boardVOS);
    // for (let i = 0; i < result.data.boardVOS.length; i++) {
    //   //   console.log(result.data.boardVOS[i].videoID);
    //   const videoResult = await createAxiosYoutubeDataAPIInstance().get(
    //     '/videos',
    //     {
    //       params: {
    //         part: 'snippet',
    //         key: youtubeGeneralAPI,
    //         id: result.data.boardVOS[i].videoID,
    //       },
    //     },
    //   );
    //   result.data.boardVOS[i] = Object.assign(result.data.boardVOS[i], {
    //     videoThumbnail: videoResult.data.items[0].snippet.thumbnails.medium.url,
    //   });
    //   //   console.log(a);
    // }
    // setAgentFeedData(result.data.boardVOS);
  }
  console.log('listdata', listData);
  useEffect(() => {
    getAgentFeeds();
  }, [agentInfo]);
  return (
    <View
      style={{
        backgroundColor: 'white',
        marginTop: 16,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {/* {data.items.length != 0 ? ( */}
      {listData[0] !== 1 && listData.length !== 0 ? (
        <FlatList
          data={listData}
          // data={data.items}
          numColumns={2}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          ItemSeparatorComponent={() => <Spacer space={20} />}
          keyExtractor={item => item.boardID.toString()}
          renderItem={({item, index}) => {
            return (
              <View style={{marginHorizontal: 8, width: width / 2 - 16}}>
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
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: 200,
                  }}>
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
                          Color.Neutral60,
                          {
                            fontFamily: 'System',
                            fontSize: 14,
                            fontStyle: 'normal',
                            fontWeight: '400',
                            lineHeight: 22,
                            letterSpacing: 0.01,
                            color: '#677389',
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
      ) : listData[0] !== 1 && listData.length === 0 ? (
        <>
          <TouchableOpacity onPress={onPressPost}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                maxHeight: width / 4,
                width: width / 4,
                backgroundColor: '#F7F8FC',
                borderWidth: 1,
                borderColor: '#F2F4F9',
                borderRadius: 10,
              }}>
              <View
                style={{
                  alignSelf: 'stretch',
                  borderWidth: 2,
                  borderColor: '#CCD4DF',
                  marginHorizontal: 24,
                }}
              />
              <View
                style={{
                  alignSelf: 'stretch',
                  borderWidth: 2,
                  borderColor: '#CCD4DF',
                  transform: [{rotate: '90deg'}],
                  marginHorizontal: 24,
                }}
              />
            </View>
          </TouchableOpacity>
          <Spacer space={12} />
          <Text
            style={[
              Font.Caption01_14_R,
              Color.Neutral50,
              {maxWidth: width / 2, textAlign: 'center'},
            ]}>
            Post contents you liked to start supporting your creator
          </Text>
        </>
      ) : (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size={20} color="black" />
          <Spacer space={12} />
          <Text style={[Font.Body_16_R, Color.Neutral60]}>
            Loading data from server
          </Text>
        </View>
      )}
    </View>
  );
};

export default MyPosts;
