const Tweets = ({ message }: { message: string }) => {
  return (
    <div className='tweets'>
      <div className='tweet'>
        <div className='tweet-col tweet-col-a'>
          <div className='tweet-icon'>&#x1F9DA;</div>{' '}
          {/* Fairy emoji as a placeholder */}
        </div>
        <div className='tweet-col tweet-col-b'>
          <p>{message}</p>
          <p>Another workout in the books!</p>
        </div>
      </div>
    </div>
  );
};

export default Tweets;
