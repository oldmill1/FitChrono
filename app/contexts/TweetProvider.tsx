import type { ReactNode } from 'react';
import React, { useState, useMemo, useCallback } from 'react';
import { TweetContext } from './TweetContext';
import type { Tweet } from './TweetContext';

let tweetId = 0;

type TweetProviderProps = {
  children: ReactNode;
};

export const TweetProvider: React.FC<TweetProviderProps> = ({ children }) => {
  const [tweets, setTweets] = useState<Tweet[]>([]);

  const addTweet = useCallback(
    ({
      text,
      message,
      payload,
      resource,
      coins = '0',
    }: {
      text: string;
      message?: string;
      payload?: string;
      resource?: string;
      coins?: string;
    }) => {
      const newTweet: Tweet = {
        id: ++tweetId,
        text,
        message,
        payload,
        resource,
        coins,
      };
      setTweets((prevTweets) => [...prevTweets, newTweet]);
    },
    [],
  );

  const clearTweets = useCallback(() => {
    setTweets([]);
  }, []);

  const contextValue = useMemo(
    () => ({
      tweets,
      addTweet,
      clearTweets,
    }),
    [tweets, addTweet, clearTweets],
  );

  return (
    <TweetContext.Provider value={contextValue}>
      {children}
    </TweetContext.Provider>
  );
};
