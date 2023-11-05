import { useContext } from 'react';
import { TweetContext } from './TweetContext';

export const useTweets = () => {
  const context = useContext(TweetContext);
  if (context === undefined) {
    throw new Error('useTweets must be used within a TweetsProvider');
  }
  return context;
};
