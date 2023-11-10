import type { Tweet } from '~/contexts/TweetContext';
import { Link } from '@remix-run/react';

const Tweets = ({ tweets }: { tweets: Tweet[] }) => {
  console.log({ tweets });
  return (
    <div className='tweets'>
      {tweets &&
        tweets.map((tweet) => (
          <div key={tweet.id}>
            <div className='aqua-titlebar'>
              <div className='titlebar-buttons'>
                <span className='close-button'></span>
                <span className='minimize-button'></span>
                <span className='maximize-button'></span>
              </div>
              <span className='title'>Test</span>
            </div>
            <div className='tweet'>
              <div className='tweet-col tweet-col-a'>
                <div className='tweet-icon'>&#x1F9DA;</div>{' '}
                {/* Fairy emoji as a placeholder */}
              </div>
              <div className='tweet-col tweet-col-b'>
                <p>{tweet.text}</p>
                {tweet.message && <p>{tweet.message}</p>}
                <p>You received {tweet.coins} coins.</p>
                {tweet.payload && tweet.resource && (
                  <Link to={`/${tweet.resource}/${tweet.payload}`}>
                    Click here to check it out
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Tweets;
