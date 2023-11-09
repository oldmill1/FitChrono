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

  // Make sure params.id is a number, return 500 otherwise
  if (isNaN(setEntryId)) {
    throw new Response('Invalid Set Entry ID', { status: 500 });
  }

  const setEntry = await db.setEntry.findUnique({
    where: { id: setEntryId },
  });

  if (!setEntry) {
    throw new Response('Set Entry Not Found', { status: 404 });
  }

  const workout = await db.workout.findUnique({
    where: { id: setEntry.workoutId },
  });

  if (!workout) {
    throw new Response('Workout Not Found', { status: 404 });
  }

  const topSets = await db.setEntry.findMany({
    where: {
      workoutId: setEntry.workoutId,
      userId: setEntry.userId,
    },
    take: 10,
    orderBy: {
      weight: 'desc',
    },
    include: {
      workout: true,
    },
  });

  return json({ setEntry, workout, topSets });
};

// const useTicker = (end: number, duration = 1000, onEnd?: () => void) => {
//   const [number, setNumber] = React.useState(0);
//
//   React.useEffect(() => {
//     let start = 0;
//     // Determine how many times to tick based on the duration
//     const interval = Math.round(duration / end);
//     const timer = setInterval(() => {
//       start += 1;
//       setNumber(start);
//       if (start === end) {
//         clearInterval(timer);
//         if (onEnd) {
//           onEnd();
//         }
//       }
//     }, interval);
//
//     return () => clearInterval(timer);
//   }, [end, duration, onEnd]);
//
//   return number;
// };

interface SetEntry {
  id: number;
  userId: number;
  workoutId: number;
  timestamp: Date;
  weight: number;
  reps: number;
  workout: {
    id: number;
    name: string;
    displayName: string;
    muscleGroupId: number;
  };
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function Workout() {
  const { setEntry, workout, topSets } = useLoaderData<typeof loader>();
  console.log({ topSets });
  // const [setPuff, setSetPuff] = React.useState(false);
  // const onEnd = React.useCallback(() => {
  //   // Your onEnd logic here
  //   setSetPuff(true);
  //   setTimeout(() => setSetPuff(false), 2000);
  // }, []); // Dependencies array is empty, meaning this callback only gets created once

  // const reps = useTicker(setEntry.reps, 1000, onEnd);
  // const weight = useTicker(setEntry.weight, 1000, onEnd);

  const reps = setEntry.reps;
  const weight = setEntry.weight;

  topSets.sort((a: SetEntry, b: SetEntry) => b.weight - a.weight);
  const rank =
    topSets.findIndex((set: SetEntry) => set.weight === setEntry.weight) + 1;

  let rankText = rank > 0 ? getOrdinal(rank) : undefined;

  return (
    <div>
      <StrengthBar
        title={`Your ${workout.displayName}`}
        returnTo={`/workout/${workout.name}/`}
      />
      <div className='quad-container'>
        <div className='quad-item'>
          <div className='glossy-circle'>
            <span className='number'>{reps}</span>
            <span className='label'>Reps</span>
          </div>
        </div>
        <div className='quad-item'>
          <div className='glossy-circle'>
            <span className='number'>{weight}</span>
            <span className='label'>lbs</span>
          </div>
          {rankText && <div className='badge'>{rankText}</div>}
        </div>
        <div className='quad-item'></div>
        <div className='quad-item'></div>
      </div>
    </div>
  );
}
