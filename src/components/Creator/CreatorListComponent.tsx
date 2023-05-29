import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {CreatorListInfo} from '../../@types/CreatorListInfo';
import {useCreatorListNavigation} from '../../navigation/CreatorListNavigation';
import {
  createAxiosYoutubeDataAPIInstance,
  youtubeGeneralAPI,
} from '../../utils/AxiosUtils';
import {Color} from '../../utils/ColorStyle';
import {Font} from '../../utils/FontStyle';
import {ImageURL} from '../../utils/ImageUtils';
import {convertSecondsToTime} from '../../utils/MetricUtils';
import {Spacer} from '../Spacer';

const CreatorListComponent: React.FC<CreatorListInfo> = props => {
  const [bannerUrl, setBannerUrl] = useState();
  const [channelThumbnail, setChannleThumbnail] = useState();
  const [channelDesc, setChannelDesc] = useState<string>();
  const [myID, setMyID] = useState();
  const navigation = useCreatorListNavigation();
  const getCreatorListYoutubeInfo = async () => {
    const result = await createAxiosYoutubeDataAPIInstance().get('channels', {
      params: {
        id: props.channelID,
        key: youtubeGeneralAPI,
        part: 'snippet, brandingSettings',
      },
    });
    if (result.data.items[0].brandingSettings.image === undefined) {
      setChannleThumbnail(result.data.items[0].snippet.thumbnails.medium.url);
    } else {
      setBannerUrl(
        result.data.items[0].brandingSettings.image.bannerExternalUrl,
      );
      setChannleThumbnail(result.data.items[0].snippet.thumbnails.medium.url);
    }
    let agentInfo = await AsyncStorage.getItem('agentInfo');
    agentInfo = JSON.parse(agentInfo);
    // console.log(agentInfo);
    if (agentInfo != null) {
      setMyID(agentInfo[1].agentNumber);
    } else {
      setMyID(0);
    }
    // console.log(
    //   'youtube creator list data',
    //   result.data.items[0].brandingSettings.image.bannerExternalUrl,
    //   result.data.items[0].snippet.thumbnails.medium.url,
    // );

    // channel description 받아오기
    setChannelDesc(result.data.items[0].snippet.description);
  };

  const onPressSupportTab = () => {
    console.log('support', props.supporters);
    navigation.push('CreatorSupportScreen', {
      screen: 'CreatorSupportList',
      params: props.supporters,
    });
  };

  const onPressFeedDetail = index => {
    console.log('myid', myID);
    console.log(props.index);
    navigation.push('CreatorFeedDetailScreen', {
      channelID: props.channelID,
      agentID: myID.toString(),
      channelTitle: props.channleTitle,
      index: index,
    });
  };
  const [isLoading, setIsLoading] = useState(true);
  const handleLoading = () => {
    setIsLoading(false);
  };
  useEffect(() => {
    getCreatorListYoutubeInfo();
  }, []);
  const {width, height} = useWindowDimensions();
  return (
    // creator thumbnail
    // creator title
    //

    <View
      style={{
        flex: 1,
        paddingHorizontal: 16,
        height: 260,
        maxWidth: '100%',
      }}>
      <ImageBackground
        source={
          bannerUrl === undefined
            ? require('../../assests/CreatorListBG.png')
            : {uri: bannerUrl}
        }
        onLoad={handleLoading}
        imageStyle={{borderRadius: 10}}
        style={{
          width: '100%',
          height: '100%',
        }}>
        {/* <LinearGradient
          colors={['#7400DB', '#B615EF']}
          start={{x: -0.7816438265377731, y: 0.6239296102808506}}
          end={{x: 0.7816438265377729, y: -0.6239296102808508}}
          style={{width: '100%', height: '100%'}}
        /> */}
        <View
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            width: '100%',
            height: '100%',
            borderRadius: 10,
            padding: 20,
          }}>
          <View
            style={{
              position: 'absolute',
              left: width / 2 - 32,
              top: 20,
            }}>
            {isLoading && <ActivityIndicator size={16} color="white" />}
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.push('CreatorFeed', {
                screen: 'CreatorFeed',
                params: {
                  channelID: props.channelID,
                  channelDesc: channelDesc,
                },
              });
            }}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={{
                  uri: channelThumbnail,
                  width: width / 9,
                  height: width / 9,
                }}
                style={{borderRadius: 10}}
              />
              <Spacer space={8} horizontal />
              <View style={{flexDirection: 'column'}}>
                <Text style={[Font.Headline_16_SM, Color.White100]}>
                  {props.channleTitle}
                </Text>
                <Text style={[Font.Footnote_14_R, Color.White066]}>
                  Posted {props.creatorBoards.length}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <Spacer space={10} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}>
            <View
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                paddingVertical: 4,
                paddingHorizontal: 12,
                borderRadius: 30,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  width: width / 2.5,
                  justifyContent: 'space-between',
                }}>
                <Text style={[Font.Caption01_14_R, Color.White100]}>
                  View time
                </Text>
                <Text
                  style={[
                    {
                      fontFamily: 'System',
                      fontSize: 14,
                      fontStyle: 'normal',
                      fontWeight: '700',
                      lineHeight: 18,
                      letterSpacing: 0.01,
                      color: 'rgba(0,0,0,0.5)',
                    },
                    Color.White100,
                  ]}>
                  {convertSecondsToTime(props.channelTotalDuration)}
                </Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                paddingVertical: 4,
                paddingHorizontal: 12,
                borderRadius: 30,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  width: width / 4,
                  justifyContent: 'space-between',
                }}>
                <Text style={[Font.Caption01_14_R, Color.White100]}>View</Text>
                <Text
                  style={[
                    {
                      fontFamily: 'System',
                      fontSize: 14,
                      fontStyle: 'normal',
                      fontWeight: '700',
                      lineHeight: 18,
                      letterSpacing: 0.01,
                      color: 'rgba(0,0,0,0.5)',
                    },
                    ,
                    Color.White100,
                  ]}>
                  {props.channelTotalSurfCount}
                </Text>
              </View>
            </View>
          </View>
          <Spacer space={16} />
          <FlatList
            data={props.creatorBoards}
            horizontal={true}
            renderItem={({item, index}) => {
              return (
                <>
                  <TouchableOpacity onPress={() => onPressFeedDetail(index)}>
                    <Image
                      source={{
                        uri: item.videoThumbnail,
                        width: 120,
                        height: 68,
                      }}
                      style={{borderRadius: 10}}
                    />
                  </TouchableOpacity>
                  <Spacer space={8} horizontal />
                </>
              );
            }}
          />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[Font.Headline_16_SM, Color.White100]}>
              Supporters
            </Text>
            <Spacer space={8} horizontal />
            <FlatList
              data={props.supporters}
              horizontal={true}
              renderItem={({item, index}) => {
                return (
                  <>
                    <View
                      style={{
                        borderWidth: 2,
                        borderColor: '#8B80F8',
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        marginLeft: index > 0 ? -8 : 0,
                      }}>
                      <TouchableOpacity onPress={onPressSupportTab}>
                        <Image
                          source={{
                            uri: ImageURL + `${item.agentID}.png`,
                            width: 32,
                            height: 32,
                          }}
                          style={{borderRadius: 16}}
                        />
                      </TouchableOpacity>
                    </View>
                  </>
                );
              }}
            />
            {/* <View
              style={{
                borderWidth: 2,
                borderColor: '#8B80F8',
                width: 32,
                height: 32,
                borderRadius: 16,
              }}></View>
            <View
              style={{
                borderWidth: 2,
                borderColor: '#8B80F8',
                width: 32,
                height: 32,
                borderRadius: 16,
                marginLeft: -12,
              }}></View> */}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default CreatorListComponent;
