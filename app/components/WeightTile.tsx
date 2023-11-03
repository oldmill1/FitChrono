import React from 'react';
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

export default function WeightTile({
  weight = 0,
  workoutId,
}: {
  weight?: number;
  workoutId: number;
}) {
  const [usrInput, setUsrInput] = React.useState('0');
  function handlePress(buttonId: string) {
    // This function edits the usrInput state:
    // 1. If the usrInput is 0, replace it with the buttonId
    // 2. If the usrInput is not 0, append the buttonId to the end of the usrInput string
    if (usrInput === '0') {
      setUsrInput(buttonId);
    } else {
      setUsrInput(usrInput + buttonId);
    }
  }
  return (
    <div className='simple-form'>
      <div className='top-container'>
        <div className='heading'>
          <p>Lift Weight</p>
        </div>
        <div className='display'>{usrInput}</div>
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
      </div>
    </div>
  );
}
