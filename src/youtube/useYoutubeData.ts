import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useCallback, useState} from 'react';
import {TypeListItem} from './TypeListItem';
import {TypeVieoListReponse} from './TypeVideoListReponse';

export const useYoutubeData = () => {
  const [data, setData] = useState([]);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [nextPageCursor, setNextPageCursor] = useState<string | null>(null);
  const [nextPageNumber, setNextPageNumber] = useState<number>(0);
  const loadData = useCallback(async () => {
    try {
      const rawData = await AsyncStorage.getItem('likedVideoData');
      if (!rawData) {
        throw new Error('No Saved' + 'likedVideoData');
      }
      const videoData = JSON.parse(rawData);

      setData(
        videoData.slice(0, 15).map(
          (item: {
            snippet: {
              title: any;
              thumbnails: {default: {url: any}; medium: {url: any}};
              publishedAt: any;
              channelTitle: any;
              channelId: any;
              categoryId: any;
            };
            id: any;
            statistics: {viewCount: any; commentCount: any};
          }) => ({
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.default.url,
            thumbnailUpload: item.snippet.thumbnails.medium.url,
            publishedAt: item.snippet.publishedAt,
            channelTitle: item.snippet.channelTitle,
            id: item.id,
            viewCount: item.statistics.viewCount,
            commentCount: item.statistics.commentCount,
            channelId: item.snippet.channelId,
            categoryId: item.snippet.categoryId,
          }),
        ),
      );
      // setHasNextPage(typeof videoData.nextPageToken !== 'undefined');
      // setNextPageCursor(
      //   typeof videoData.nextPageToken !== 'undefined'
      //     ? videoData.nextPageToken
      //     : null,
      // );
      setNextPageNumber(15);
    } catch (ex) {
      console.error('loadData', ex);
    }
  }, []);

  let nextPageCount = 15;

  const loadMoreData = useCallback(async () => {
    if (!hasNextPage) {
      return;
    } else if (nextPageNumber > 50) {
      return;
    }
    try {
      const rawData = await AsyncStorage.getItem('likedVideoData');
      if (!rawData) {
        throw new Error('No Saved' + 'likedVideoData');
      }
      const videoData = JSON.parse(rawData);
      // console.log(videoData.length);
      // console.log('nextPageNumber', nextPageNumber);
      setData(prevData =>
        prevData.concat(
          videoData.slice(nextPageCount, nextPageCount + 15).map(
            (item: {
              snippet: {
                title: any;
                thumbnails: {default: {url: any}; medium: {url: any}};
                publishedAt: any;
                channelTitle: any;
                channelId: any;
                categoryId: any;
              };
              id: any;
              statistics: {viewCount: any; commentCount: any};
            }) => ({
              title: item.snippet.title,
              thumbnail: item.snippet.thumbnails.default.url,
              thumbnailUpload: item.snippet.thumbnails.medium.url,
              publishedAt: item.snippet.publishedAt,
              channelTitle: item.snippet.channelTitle,
              id: item.id,
              viewCount: item.statistics.viewCount,
              commentCount: item.statistics.commentCount,
              channelId: item.snippet.channelId,
              categoryId: item.snippet.categoryId,
            }),
          ),
        ),
      );
      // setHasNextPage(typeof videoData.nextPageToken !== 'undefined');
      // setNextPageCursor(
      //   typeof videoData.nextPageToken !== 'undefined'
      //     ? videoData.nextPageToken
      //     : null,
      // );
      nextPageCount += 15;
      setNextPageNumber(prev => prev + 15);
    } catch (ex) {
      console.error('loadMore', ex);
    }
  }, []);
  return {data, loadData, loadMoreData};
};
