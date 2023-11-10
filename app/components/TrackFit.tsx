import React, { useState, useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames';
import clickSound from '~/sounds/click.mp3';
import clickSound2 from '~/sounds/click2.mp3';
import clickSound3 from '~/sounds/click3.mp3';

import { useSubmit } from '@remix-run/react';

export default function TrackFit({
  weight = 0,
  reps = 0,
  workoutId,
  recentSetsCount = 0,
  prWeight = 0,
}: {
  weight?: number;
  workoutId: number;
  reps?: number;
  recentSetsCount?: number;
  prWeight?: number;
}) {
  const [repsInput, setRepsInput] = useState('0');
  const [weightInput, setWeightInput] = useState('0');
  const [selectedDisplay, setSelectedDisplay] = useState('weight');
  const [originalWeight] = useState(weight);
  const [originalReps] = useState(reps);
  const repsDisplayRef = useRef<HTMLDivElement>(null);
  const weightDisplayRef = useRef<HTMLDivElement>(null);
  const [displayStates, setDisplayStates] = useState({
    reps: 'overwrite',
    weight: 'overwrite',
  });
  const submit = useSubmit();

  console.log({ prWeight });

  const playClickSound = async (soundId: string) => {
    let soundToPlay;
    switch (soundId) {
      case '1':
        soundToPlay = clickSound;
        break;
      case '2':
        soundToPlay = clickSound2;
        break;
      case '3':
        soundToPlay = clickSound3;
        break;
      default:
        console.error('Invalid soundId');
        return;
    }
    const audio = new Audio(soundToPlay);
    try {
      await audio.play();
      // Playback started!
    } catch (error) {
      console.error('Playback failed! Error:', error);
    }
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    // Check if the clicked element is one of the input buttons
    if (event.target && (event.target as HTMLElement).closest('.aqua-button')) {
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
      // Set the state to 'overwrite' for both reps and weight
      setDisplayStates((prevState) => ({
        ...prevState,
        reps: 'overwrite',
        weight: 'overwrite',
      }));
    }
  }, []);

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

  async function handlePress(action: string) {
    const numberAction = Number(action);
    if (!isNaN(numberAction)) {
      try {
        await playClickSound('1');
      } catch (error) {
        console.error('Error playing sound', error);
      }
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
      try {
        await playClickSound('2');
      } catch (error) {
        console.error('Error playing sound', error);
      }
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
  async function handleSubmit() {
    // Log the workout
    // Get the weight from weighInput
    // turn it into a number
    // and update formWeight with it
    try {
      await playClickSound('3');
    } catch (error) {
      console.error('Error playing sound', error);
    }
    const weightNumber = Number(weightInput);
    const repsNumber = Number(repsInput);
    if (!isNaN(weightNumber) && !isNaN(repsNumber)) {
      const formData = new FormData();
      formData.append('weight', weightNumber.toString());
      formData.append('reps', repsNumber.toString());
      formData.append('workoutId', workoutId.toString());
      formData.append('prWeight', prWeight.toString());
      formData.append('recentSetsCount', recentSetsCount.toString());
      submit(formData, { method: 'post' });
    }
  }
  return (
    <div className='simple-form'>
      <div className='top-container'>
        <div className='reps-display'>
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
        </div>
        <div className='weight-display'>
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
      </div>
      <div className='control-buttons'>
        <button onClick={() => handlePress('reset')}>Reset</button>
        <button onClick={() => handlePress('convert')}>Convert</button>
        <button onClick={() => handlePress('copy')}>Copy</button>
      </div>
      <div className='bottom-container'>
        <div className='buttons'>
          <div className='row'>
            <button className='aqua-button' onClick={() => handlePress('7')}>
              7
            </button>
            <button className='aqua-button' onClick={() => handlePress('8')}>
              8
            </button>
            <button className='aqua-button' onClick={() => handlePress('9')}>
              9
            </button>
          </div>
          <div className='row'>
            <button className='aqua-button' onClick={() => handlePress('4')}>
              4
            </button>
            <button className='aqua-button' onClick={() => handlePress('5')}>
              5
            </button>
            <button className='aqua-button' onClick={() => handlePress('6')}>
              6
            </button>
          </div>
          <div className='row'>
            <button className='aqua-button' onClick={() => handlePress('1')}>
              1
            </button>
            <button className='aqua-button' onClick={() => handlePress('2')}>
              2
            </button>
            <button className='aqua-button' onClick={() => handlePress('3')}>
              3
            </button>
          </div>
          <div className='row'>
            <button className='aqua-button' onClick={() => handlePress('0')}>
              0
            </button>
          </div>
        </div>
        <div className='submit-log'>
          <button
            onClick={handleSubmit}
            className='aqua-button aqua-button-confirm'
          >
            Log
          </button>
        </div>
      </div>
    </div>
  );
}
