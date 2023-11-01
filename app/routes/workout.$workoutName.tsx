import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { db } from '~/db.server';
import Menubar from '~/components/Menubar';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const workout = await db.workout.findFirst({
    where: { name: params.workoutName },
  });
  if (!workout) {
    throw new Response('Not Found', { status: 404 });
  }
  const muscleGroup = await db.muscleGroup.findUnique({
    where: { id: workout.muscleGroupId },
  });
  if (!muscleGroup) {
    throw new Response('Not Found', { status: 404 });
  }
  return json({ workout, muscleGroup });
};

/**
 * This page will have 4 buttons to complete the workout
 * - "Set": Means complete 1 set of the Workout for `reps` at `weight`
 * - "Reps": Change the number of reps
 * - "Weight": Change the weight
 * @constructor
 */
export default function Workout() {
  const { workout, muscleGroup } = useLoaderData<typeof loader>();
  console.log({ workout });
  return (
    <div>
      <Menubar
        returnTo={`/muscleGroup/${muscleGroup.name}`}
        title={workout.displayName}
      />
      <div className='grid-container'>
        <div className='grid-item'>
          <span>Set</span>
        </div>
        <div className='grid-item'>
          <span>Reps</span>
        </div>
        <div className='grid-item'>
          <span>Weight</span>
        </div>
      </div>
    </div>
  );
}
