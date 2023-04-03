import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Typography} from './Typography';

interface Props {
  setVideoCount: Dispatch<SetStateAction<number>>;
}

export const VideoTimer: React.FC<Props> = ({setVideoCount}) => {
  const [count, setTimer] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimer(prev => prev + 1);
      setVideoCount(prev => prev + 1);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  // return <Typography>{count.toString()}</Typography>;
};
