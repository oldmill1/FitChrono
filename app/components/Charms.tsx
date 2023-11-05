const Charms = ({ message }: { message: string }) => {
  return (
    <div className='charms'>
      <div className='charm'>
        <div className='charm-col charm-col-a'>
          <div className='charm-icon'>&#x1F9DA;</div>{' '}
          {/* Fairy emoji as a placeholder */}
        </div>
        <div className='charm-col charm-col-b'>
          <p>{message}</p>
          <p>Another workout in the books!</p>
        </div>
      </div>
    </div>
  );
};

export default Charms;
