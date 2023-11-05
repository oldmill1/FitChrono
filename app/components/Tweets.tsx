import type { Tweet } from '~/contexts/TweetContext';

const Tweets = ({ tweets }: { tweets: Tweet[] }) => {
  return (
    <div className='tweets'>
      {tweets &&
        tweets.map((tweet) => (
          <div key={tweet.id} className='tweet'>
            <div className='tweet-col tweet-col-a'>
              <div className='tweet-icon'>&#x1F9DA;</div>{' '}
              {/* Fairy emoji as a placeholder */}
            </div>
            <div className='tweet-col tweet-col-b'>
              <p>{tweet.text}</p>
              {tweet.message && <p>{tweet.message}</p>}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Tweets;
