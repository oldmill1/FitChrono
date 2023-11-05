import React from 'react';
export type Tweet = {
  id: number;
  text: string;
};

export type TweetContextType = {
  tweets: Tweet[];
  addTweet: (text: string) => void;
  clearTweets: () => void;
};

export const TweetContext = React.createContext<TweetContextType | undefined>(
  undefined,
);
