export default function Header({
  title,
  coins = 0,
}: {
  title: string;
  coins: number;
}) {
  return (
    <div className='header'>
      <h1 className='title'>{title}</h1>
      <div className='coins-meter'>
        <span className='coin-graphic'>
          <img src='/images/coins.png' alt='coins' />
        </span>
        <span className='coin-count'>{coins}</span>
      </div>
    </div>
  );
}
