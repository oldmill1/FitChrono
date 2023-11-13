export default function Playground() {
  return (
    <div id='container'>
      <div className='header'>
        <h1 className='title'>Barbell Swami</h1>
        <div className='coins-meter'>
          <span className='coin-graphic'>
            <img src='/images/coins.png' alt='coins' />
          </span>
          <span className='coin-count'>30</span>
        </div>
      </div>
      <div className='content'>
        <div className='clouds'>
          <div className='cloud'>
            <span>Chest</span>
          </div>
        </div>
      </div>
    </div>
  );
}
