import React, { useState, useEffect, useRef } from 'react';
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
  reps = 0,
  workoutId,
}: {
  weight?: number;
  workoutId: number;
  reps?: number;
}) {
  const [repsInput, setRepsInput] = useState('0');
  const [weightInput, setWeightInput] = useState('0');
  const [selectedDisplay, setSelectedDisplay] = useState('reps');
  const [originalWeight] = useState(weight);
  const [originalReps] = useState(reps);
  const repsDisplayRef = useRef<HTMLDivElement>(null);
  const weightDisplayRef = useRef<HTMLDivElement>(null);
  const [displayStates, setDisplayStates] = useState({
    reps: 'overwrite',
    weight: 'overwrite',
  });

  const handleClickOutside = (event: MouseEvent) => {
    // Check if the clicked element is one of the input buttons
    if (
      event.target &&
      (event.target as HTMLElement).closest('.complete-set-button')
    ) {
      // If it's one of the buttons, do nothing and return early
      return;
    }

    // Check if the click is outside both the repsDisplayRef and weightDisplayRef
    if (
      (repsDisplayRef.current &&
        !repsDisplayRef.current.contains(event.target as Node)) ||
      (weightDisplayRef.current &&
        !weightDisplayRef.current.contains(event.target as Node))
    ) {
      console.log('switching to overwrite');
      // Set the state to 'overwrite' for both reps and weight
      setDisplayStates((prevState) => ({
        ...prevState,
        reps: 'overwrite',
        weight: 'overwrite',
      }));
    }
  };

  useEffect(() => {
    // Add when mounted
    document.addEventListener('mousedown', handleClickOutside as EventListener);
    // Return function to be called when unmounted
    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside as EventListener,
      );
    };
  }, [handleClickOutside]);

  function handleDisplaySelect(display: string) {
    setSelectedDisplay(display);
  }

  useEffect(() => {
    // If weight is a number, set usrInput to the string representation of weight
    setWeightInput(Math.floor(weight).toString());
    setRepsInput(Math.floor(reps).toString());
  }, [reps, weight]); // This effect runs on component mount and whenever weight changes

  function handlePress(action: string) {
    const numberAction = Number(action);
    if (!isNaN(numberAction)) {
      if (selectedDisplay === 'reps') {
        if (displayStates.reps === 'overwrite') {
          setRepsInput(action);
          setDisplayStates({ ...displayStates, reps: 'append' });
        } else {
          setRepsInput(repsInput === '0' ? action : repsInput + action);
        }
      } else if (selectedDisplay === 'weight') {
        if (displayStates.weight === 'overwrite') {
          setWeightInput(action);
          setDisplayStates({ ...displayStates, weight: 'append' });
        } else {
          setWeightInput(weightInput === '0' ? action : weightInput + action);
        }
      }
    } else {
      switch (action) {
        case 'convert':
          break;
        case 'reset':
          if (selectedDisplay === 'reps') {
            setRepsInput(Math.floor(originalReps).toString()); // Assuming 'reps' is the original value for reps
          } else if (selectedDisplay === 'weight') {
            setWeightInput(Math.floor(originalWeight).toString()); // Assuming 'weight' is the original value for weight
          }
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
          ref={repsDisplayRef}
          onClick={() => handleDisplaySelect('reps')}
        >
          {repsInput}
        </div>
        <div className='heading'>
          <p>Weight</p>
        </div>
        <div
          className={classNames('display', {
            selected: selectedDisplay === 'weight',
          })}
          ref={weightDisplayRef}
          onClick={() => handleDisplaySelect('weight')}
        >
          {weightInput}
        </div>
      </div>
      <div className='control-buttons'>
        <button onClick={() => handlePress('reset')}>Reset</button>
        <button onClick={() => handlePress('convert')}>Convert</button>
        <button onClick={() => handlePress('copy')}>Copy</button>
      </div>
      <div className='bottom-container'>
        <div className='buttons'>
          <div className='row'>
            <button
              className='complete-set-button'
              onClick={() => handlePress('7')}
            >
              7
            </button>
            <button
              className='complete-set-button'
              onClick={() => handlePress('8')}
            >
              8
            </button>
            <button
              className='complete-set-button'
              onClick={() => handlePress('9')}
            >
              9
            </button>
          </div>
          <div className='row'>
            <button
              className='complete-set-button'
              onClick={() => handlePress('4')}
            >
              4
            </button>
            <button
              className='complete-set-button'
              onClick={() => handlePress('5')}
            >
              5
            </button>
            <button
              className='complete-set-button'
              onClick={() => handlePress('6')}
            >
              6
            </button>
          </div>
          <div className='row'>
            <button
              className='complete-set-button'
              onClick={() => handlePress('1')}
            >
              1
            </button>
            <button
              className='complete-set-button'
              onClick={() => handlePress('2')}
            >
              2
            </button>
            <button
              className='complete-set-button'
              onClick={() => handlePress('3')}
            >
              3
            </button>
          </div>
        </div>
        <div className='submit-log'>
          <button className='complete-set-button complete-set-button-confirm'>
            Log
          </button>
        </div>
      </div>
    </div>
  );
}
