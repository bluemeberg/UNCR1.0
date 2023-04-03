export type TypeVieoListReponse = {
  kind: 'youtube#videoListResponse';
  etag: string;
  nextPageToken: string;
  prevPageToken: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: {
    kind: 'youtube#video';
    etag: string;
    id: string;
    snippet: {
      publishedAt: string;
      channelId: string;
      title: string;
      description: string;
      thumbnails: {
        [key: string]: {
          url: string;
          width: number;
          height: number;
        };
      };
      channelTitle: string;
      tags: [string];
      categoryId: string;
    };
    contentDetails: {
      duration: string;
      dimension: string;
      definition: string;
      caption: string;
      licensedContent: boolean;
      regionRestriction: {
        allowed: [string];
        blocked: [string];
      };
      contentRating: {
        mpaaRating: string;
        tvpgRating: string;
        bbfcRating: string;
        chvrsRating: string;
        eirinRating: string;
        cbfcRating: string;
        fmocRating: string;
        icaaRating: string;
        acbRating: string;
        oflcRating: string;
        fskRating: string;
        kmrbRating: string;
        djctqRating: string;
        russiaRating: string;
        rtcRating: string;
        ytRating: string;
      };
    };
    status: {
      uploadStatus: string;
      failureReason: string;
      rejectionReason: string;
      privacyStatus: string;
      license: string;
      embeddable: boolean;
      publicStatsViewable: boolean;
    };
    statistics: {
      viewCount: number;
      likeCount: number;
      dislikeCount: number;
      favoriteCount: number;
      commentCount: number;
    };
  }[];
};
