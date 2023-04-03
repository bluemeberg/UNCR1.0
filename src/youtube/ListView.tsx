import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {Icon} from '../components/Icon';
import {ListItemView} from './ListItemView';
import {TypeListItem} from './TypeListItem';
import {useYoutubeData} from './useYoutubeData';

export const ListView: React.FC = () => {
  const {data, loadData, loadMoreData} = useYoutubeData();

  useEffect(() => {
    loadData();
  }, [loadData]);
  return (
    <FlatList
      data={data}
      renderItem={({item}) => <ListItemView item={item} />}
      keyExtractor={item => item.id}
      onEndReached={loadMoreData}
      onEndReachedThreshold={0.1}
    />
  );
};
