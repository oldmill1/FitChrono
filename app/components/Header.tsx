import { useNavigate } from 'react-router-dom';

export default function Header({
  title,
  coins = 0,
  buttonText = 'Back',
  visitUrl,
  hasBackButton = false,
}: {
  title: string;
  coins?: number;
  buttonText?: string;
  visitUrl?: string;
  hasBackButton?: boolean;
}) {
  const navigate = useNavigate();
  return (
    <div className='header'>
      <div className='left-group'>
        {hasBackButton && (
          <button
            className='back-button aqua-button aqua-button-confirm'
            onClick={() => {
              // Navigate to visitUrl if it's defined, otherwise go back "/"
              const url = visitUrl ? visitUrl : '/';
              if (typeof window !== 'undefined') {
                // Use Remix's navigation function or window.location for navigation
                // For example, you might use useNavigate hook from 'react-router-dom'
                navigate(url);
              }
            }}
          >
            {buttonText}
          </button>
        )}
        <h1 className='title'>{title}</h1>
      </div>
      <div className='coins-meter'>
        <span className='coin-graphic'>
          <img src='/images/coins.png' alt='coins' />
        </span>
        <span className='coin-count'>{coins}</span>
      </div>
    </div>
  );
}
