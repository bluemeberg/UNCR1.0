import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useCallback, useState} from 'react';
import {Alert, Modal, Text, TouchableOpacity, View} from 'react-native';
import {
  createAxiosYoutubeDataAPIInstance,
  youtubeGeneralAPI,
  youtubeOauthAPI,
} from '../utils/AxiosUtils';
import {Icon} from './Icon';
import {Spacer} from './Spacer';

const CustomDropdown = ({
  commentCounts,
  selectedValue,
  onValueChange,
  likeVideoID,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [myComments, setMycomments] = useState([]);
  // console.log(commentCounts);
  const getYoutubeComment = useCallback(async () => {
    if (Number(commentCounts) > 500) {
      Alert.alert(
        '',
        'This contents have over 500 comments. Already famous, so we do not support verification',
        [
          {
            text: 'Okay',
            onPress: () => {
              return;
            },
          },
        ],
        {cancelable: false},
      );
      return;
    }
    const accessToken = await AsyncStorage.getItem('accessToken');
    console.log(accessToken);
    let nextPageToken = null;
    let commentsTotal: any = [];
    let i = 0;
    const result = await createAxiosYoutubeDataAPIInstance().get('/channels', {
      params: {
        key: youtubeOauthAPI,
        part: 'snippet',
        mine: true,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('mine', result.data.items[0].id);
    while (true) {
      console.log(likeVideoID);
      let comments: any;
      try {
        comments = await createAxiosYoutubeDataAPIInstance().get(
          '/commentThreads',
          {
            params: {
              key: youtubeGeneralAPI,
              part: 'snippet',
              videoId: likeVideoID,
              maxResults: 100,
              pageToken: nextPageToken,
            },
          },
        );
      } catch (e) {
        console.log(e);
        Alert.alert('', 'Sorry, this video blind the comments', [
          {
            text: 'Okay',
            onPress: async () => {
              return;
            },
          },
        ]);
      }
      commentsTotal = [...commentsTotal, comments.data.items];
      i += 1;
      nextPageToken = comments.data.nextPageToken;
      if (!nextPageToken) {
        break;
      } else if (i > 4) {
        break;
      }
    }

    let myCommentsAndCounts = [];
    for (let i = 0; i < commentsTotal.length; i++) {
      for (let j = 0; j < commentsTotal[i].length; j++) {
        console.log(
          commentsTotal[i][j].snippet.topLevelComment.snippet.textOriginal,
        );
        console.log(
          'comment snippet',
          commentsTotal[i][j].snippet.topLevelComment.snippet.likeCount,
        );
        if (
          commentsTotal[i][j].snippet.topLevelComment.snippet.authorChannelId
            .value === result.data.items[0].id
        ) {
          const commentObject = {
            text: commentsTotal[i][j].snippet.topLevelComment.snippet
              .textOriginal,
            textLikeCounts:
              commentsTotal[i][j].snippet.topLevelComment.snippet.likeCount,
          };
          myCommentsAndCounts.push(commentObject);
          // setItems([
          //   {
          //     label:
          //       commentsTotal[i][j].snippet.topLevelComment.snippet
          //         .textOriginal,
          //     value:
          //       commentsTotal[i][j].snippet.topLevelComment.snippet
          //         .textOriginal,
          //   },
          // ]);
          // return;
        }
      }
    }
    if (myCommentsAndCounts.length === 0) {
      myCommentsAndCounts.push('No your comments in this contents');
    }
    console.log('myComments', myCommentsAndCounts);
    setMycomments(myCommentsAndCounts);
  }, []);
  const [commmentLikeCount, setCommentLikeCount] = useState();
  const handlePress = async value => {
    if (value === 'No your comments in this contents') {
      console.log('choose comment', value);
      await AsyncStorage.setItem('chooseComment', value);
      onValueChange(value);
      setModalVisible(false);
      selectedValue = value;
    } else {
      console.log('choose comment', value);
      await AsyncStorage.setItem('chooseComment', JSON.stringify(value));
      onValueChange(value.text);
      setModalVisible(false);
      selectedValue = value.text;
      setCommentLikeCount(value.textLikeCounts);
    }
  };
  // console.log('textLikeCounts', commmentLikeCount);
  const handleOpen = async () => {
    if (modalVisible === false) {
      await getYoutubeComment();
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleOpen}>
        <View
          style={{
            backgroundColor: '#F2F4F9',
            borderWidth: 1,
            borderColor: '#E3E7F0',
            padding: 16,
            borderRadius: 10,
          }}>
          {selectedValue === undefined ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{color: '#97A2B6'}}>
                Verify your comments from Youtube
              </Text>
              {modalVisible === true ? (
                <Icon name="chevron-up" size={20} color="#97A2B6"></Icon>
              ) : (
                <Icon name="chevron-down" size={20} color="#97A2B6"></Icon>
              )}
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{color: '#97A2B6'}}>{selectedValue}</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {selectedValue === 'No your comments in this contents' ? (
                  <></>
                ) : (
                  <>
                    <Icon name="thumbs-up-outline" size={16} color="#97A2B6" />
                    <Spacer space={8} horizontal />
                    <Text style={{color: '#97A2B6'}}>{commmentLikeCount}</Text>
                    <Spacer space={16} horizontal />
                  </>
                )}
                {modalVisible === true ? (
                  <Icon name="chevron-up" size={20} color="#97A2B6"></Icon>
                ) : (
                  <Icon name="chevron-down" size={20} color="#97A2B6"></Icon>
                )}
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
      <Spacer space={8} />
      {modalVisible && myComments.length !== 0 ? (
        <View>
          <View
            style={{
              flex: 1,
              // justifyContent: 'center',
              // alignItems: 'center',
              backgroundColor: '#F2F4F9',
              borderRadius: 10,
            }}>
            {myComments.map((item, index) =>
              item !== 'No your comments in this contents' ? (
                <TouchableOpacity key={index} onPress={() => handlePress(item)}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{padding: 16, color: 'black'}}>
                      {item.text}
                    </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Icon name="thumbs-up-outline" size={16} color="black" />
                      <Spacer space={8} horizontal />
                      <Text
                        style={{
                          paddingVertical: 16,
                          paddingRight: 16,
                          color: 'black',
                        }}>
                        {item.textLikeCounts}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity key={index} onPress={() => handlePress(item)}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{padding: 16, color: 'black'}}>{item}</Text>
                  </View>
                </TouchableOpacity>
              ),
            )}
          </View>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

export default CustomDropdown;
