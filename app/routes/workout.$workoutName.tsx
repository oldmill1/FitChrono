import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { db } from '~/db.server';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const workout = await db.workout.findFirst({
    where: { name: params.workoutName },
  });
  if (!workout) {
    throw new Response('Not Found', { status: 404 });
  }
  return json(workout);
};

/**
 * This page will have 4 buttons to complete the workout
 * - "Set": Means complete 1 set of the Workout for `reps` at `weight`
 * - "Reps": Change the number of reps
 * - "Weight": Change the weight
 * @constructor
 */
export default function Workout() {
  const workout = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>{workout.displayName}</h1>
      <div className='grid-container'>
        <div className='grid-item'>
          <span>Set</span>
        </div>
        <div className='grid-item'>
          <span>Reps</span>
        </div>
      </div>
    </div>
  );
}
