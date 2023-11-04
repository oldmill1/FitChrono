import React from 'react';
import classNames from 'classnames';

// import { Form } from '@remix-run/react';

// function DataForm({
//   weight,
//   workoutId,
// }: {
//   weight: number;
//   workoutId: number;
// }) {
//   return (
//     <Form id='default-weight-form' method='post'>
//       <input name='weight' type='number' defaultValue={weight} />
//       <input type='hidden' name='workoutId' value={workoutId} />
//       <button type='submit'>Update</button>
//     </Form>
//   );
// }

export default function UpdateDefaults({
  weight = 0,
  workoutId,
}: {
  weight?: number;
  workoutId: number;
}) {
  const [repsInput, setRepsInput] = React.useState('0');
  const [usrInput, setUsrInput] = React.useState('0');
  const [selectedDisplay, setSelectedDisplay] = React.useState('reps');

  function handleDisplaySelect(display) {
    setSelectedDisplay(display);
  }

  React.useEffect(() => {
    // If weight is a number, set usrInput to the string representation of weight
    setUsrInput(Math.floor(weight).toString());
  }, [weight]); // This effect runs on component mount and whenever weight changes

  function handlePress(action: string) {
    const numberAction = Number(action);
    if (!isNaN(numberAction)) {
      setUsrInput(usrInput === '0' ? action : usrInput + action);
    } else {
      switch (action) {
        case 'clear':
          setUsrInput('0');
          break;
      }
    }
  }
  return (
    <div className='simple-form'>
      <div className='top-container'>
        <div className='heading'>
          <p>Reps</p>
        </div>
        <div
          className={classNames('display', {
            selected: selectedDisplay === 'reps',
          })}
          onClick={() => handleDisplaySelect('reps')}
        >
          0
        </div>
        <div className='heading'>
          <p>
            Weight <span>(lb)</span>
          </p>
        </div>
        <div
          className={classNames('display', {
            selected: selectedDisplay === 'weight',
          })}
          onClick={() => handleDisplaySelect('weight')}
        >
          {usrInput}
        </div>
      </div>
      <div className='control-buttons'>
        <button onClick={() => handlePress('clear')}>Clear</button>
        <button onClick={() => handlePress('convert')}>Convert</button>
        <button onClick={() => handlePress('copy')}>Copy</button>
      </div>
      <div className='bottom-container'>
        <div className='buttons'>
          <div className='row'>
            <button onClick={() => handlePress('7')}>7</button>
            <button onClick={() => handlePress('8')}>8</button>
            <button onClick={() => handlePress('9')}>9</button>
          </div>
          <div className='row'>
            <button onClick={() => handlePress('4')}>4</button>
            <button onClick={() => handlePress('5')}>5</button>
            <button onClick={() => handlePress('6')}>6</button>
          </div>
          <div className='row'>
            <button onClick={() => handlePress('1')}>1</button>
            <button onClick={() => handlePress('2')}>2</button>
            <button onClick={() => handlePress('3')}>3</button>
          </div>
        </div>
        <button className='complete-set-button'>Record Set</button>
      </div>
    </div>
  );
}
