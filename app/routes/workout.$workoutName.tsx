import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { db } from '~/db.server';
import StrengthBar from '~/components/StrengthBar';
import WeightTile from '~/components/WeightTile';

export const action = async ({ params, request }: LoaderFunctionArgs) => {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  console.log({ updates });
  return null;
};

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
  // Query the WorkoutDefaults table where
  // - userId is 1, workoutId is workout.id
  // - and get the reps and weight
  // - if there is no record, return 0 for both
  const workoutDefaults = await db.workoutDefaults.findFirst({
    where: {
      userId: 1,
      workoutId: workout.id,
    },
  });
  if (!workoutDefaults) {
    return json({ workout, muscleGroup, defaultReps: 0, defaultWeight: 0 });
  }
  return json({
    workout,
    muscleGroup,
    defaultReps: workoutDefaults.reps,
    defaultWeight: workoutDefaults.weight,
  });
};

/**
 * This page will have 4 buttons to complete the workout
 * - "Set": Means complete 1 set of the Workout for `reps` at `weight`
 * - "Reps": Change the number of reps
 * - "Weight": Change the weight
 * @constructor
 */
export default function Workout() {
  const { workout, muscleGroup, defaultReps, defaultWeight } =
    useLoaderData<typeof loader>();
  // console.log({ workout });
  return (
    <div>
      <StrengthBar
        returnTo={`/muscleGroup/${muscleGroup.name}`}
        title={workout.displayName}
        listItems={[
          {
            name: 'PR Weight',
            httpEntity: <span>&#128170;</span>,
            itemValue: 0,
          },
        ]}
      />
      <div className='grid-container'>
        <div className='grid-item'>
          <span>Set</span>
        </div>
        <div className='grid-item'>
          <span>Reps</span>
        </div>
        <div className='grid-item'>
          <Form id='default-weight-form' method='post'>
            <WeightTile weight={defaultWeight} />
            <input name='weight' type='number' defaultValue={defaultWeight} />
            <button type='submit'>Update</button>
          </Form>
        </div>
      </div>
    </div>
  );
}
