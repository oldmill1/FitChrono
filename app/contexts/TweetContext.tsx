import React from 'react';
export type Tweet = {
  id: number;
  text: string;
  message?: string;
  payload?: string;
  resource?: string;
  coins?: string;
};

export type TweetContextType = {
  tweets: Tweet[];
  addTweet: ({
    text,
    message,
    payload,
    coins,
  }: {
    text: string;
    message?: string;
    payload?: string;
    resource?: string;
    coins?: string;
  }) => void;
  clearTweets: () => void;
};

export const TweetContext = React.createContext<TweetContextType | undefined>(
  undefined,
);
