import React from 'react';
import { useLoaderData } from '@remix-run/react';
import StrengthBar from '~/components/StrengthBar';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { db } from '~/db.server';
import classNames from 'classnames';

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.id, 'Missing id param');
  const setEntryId = parseInt(params.id, 10);
  console.log({ setEntryId });

  const setEntry = await db.setEntry.findUnique({
    where: { id: setEntryId },
  });

  if (!setEntry) {
    throw new Response('Not Found', { status: 404 });
  }

  const workout = await db.workout.findUnique({
    where: { id: setEntry.workoutId },
  });

  if (!workout) {
    throw new Response('Workout Not Found', { status: 404 });
  }

  return json({ setEntry, workout });
};

const useTicker = (end: number, duration = 1000, onEnd?: () => void) => {
  const [number, setNumber] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    // Determine how many times to tick based on the duration
    const interval = Math.round(duration / end);
    const timer = setInterval(() => {
      start += 1;
      setNumber(start);
      if (start === end) {
        clearInterval(timer);
        if (onEnd) {
          onEnd();
        }
      }
    }, interval);

    return () => clearInterval(timer);
  }, [end, duration, onEnd]);

  return number;
};

export default function Workout() {
  const { setEntry, workout } = useLoaderData<typeof loader>();
  const [setPuff, setSetPuff] = React.useState(false);
  const onEnd = React.useCallback(() => {
    // Your onEnd logic here
    setSetPuff(true);
    setTimeout(() => setSetPuff(false), 2000);
  }, []); // Dependencies array is empty, meaning this callback only gets created once

  const reps = useTicker(setEntry.reps, 1000, onEnd);
  const weight = useTicker(setEntry.weight, 1000, onEnd);

  return (
    <div>
      <StrengthBar
        title={`Your ${workout.displayName}`}
        returnTo={`/workout/${workout.name}/`}
      />
      <div className='quad-container'>
        <div className='quad-item'>
          <div className='glossy-circle'>
            <span
              className={classNames({
                number: true,
                'puff-up': setPuff,
              })}
            >
              {reps}
            </span>
            <span className='label'>Reps</span>
          </div>
        </div>
        <div className='quad-item'>
          <div className='glossy-circle'>
            <span
              className={classNames({
                number: true,
                'puff-up': setPuff,
              })}
            >
              {weight}
            </span>
            <span className='label'>lbs</span>
          </div>
        </div>
        <div className='quad-item'></div>
        <div className='quad-item'></div>
      </div>
    </div>
  );
}
