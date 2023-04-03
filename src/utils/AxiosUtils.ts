import axios from 'axios';

export const createAxiosLocalServerInstance = () => {
  return axios.create({
    baseURL: 'http://192.168.155.56:8080/',
  });
};

export const createAxiosServerInstance = () => {
  return axios.create({
    baseURL: 'https://uncrapi.link/',
  });
};

export const createAxiosYoutubeDataAPIInstance = () => {
  return axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3/',
  });
};

export const youtubeOauthAPI = 'AIzaSyC9wMNYCcj-DV96j3dy0r-WTEhpbKMDXSU';
export const youtubeGeneralAPI = 'AIzaSyDp2Iw7uoEunRQZ-fvNGGw5kry3ZP9uMRs';
