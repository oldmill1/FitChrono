import React from 'react';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useActionData, useLoaderData } from '@remix-run/react';
import { db } from '~/db.server';
import StrengthBar from '~/components/StrengthBar';
import TrackFit from '~/components/TrackFit';
import invariant from 'tiny-invariant';
import Tweets from '~/components/Tweets';
import { useTweets } from '~/contexts/useTweets';

type ActionData = {
  success?: string;
  error?: string;
  setId?: string;
};

export const action = async ({ params, request }: LoaderFunctionArgs) => {
  const formData = await request.formData();
  const weight = formData.get('weight');
  const reps = formData.get('reps');
  const workoutId = formData.get('workoutId');

  invariant(params.workoutName, 'Missing workoutName param');
  invariant(workoutId, 'Missing workoutId param');
  invariant(weight, 'Missing weight param');
  invariant(reps, 'Missing reps param');

  if (typeof weight === 'string' && typeof reps === 'string') {
    const weightNumber = parseFloat(weight);
    const repsNumber = parseFloat(reps);
    if (isNaN(weightNumber) || isNaN(repsNumber)) {
      return { error: 'Invalid weight format.' };
    }
    const userId = 1; // Replace with actual user ID from session or authentication context

    try {
      // Upsert workoutDefaults
      await db.workoutDefaults.upsert({
        where: { workoutId_userId: { workoutId: Number(workoutId), userId } },
        update: { weight: weightNumber, reps: repsNumber },
        create: {
          workoutId: Number(workoutId),
          userId,
          weight: weightNumber,
          reps: repsNumber,
        },
      });

      // Create a new SetEntry
      // Look for an env variable called IS_LOCAL
      // if it's true, don't create a setEntry in the database, just return the id 1
      // otherwise, create a new setEntry in the database
      if (process.env.IS_LOCAL) {
        console.log('IS_LOCAL is true, not creating a setEntry');
        return json({ setId: 1 });
      }

      const setEntry = await db.setEntry.create({
        data: {
          userId,
          workoutId: Number(workoutId),
          weight: weightNumber,
          reps: repsNumber,
        },
      });

      // Return the id of the new SetEntry
      return json({ setId: setEntry.id });
    } catch (error) {
      console.error(error);
      return { error: 'An error occurred while updating.' };
    }
  } else {
    return { error: 'Weight and reps must be strings.' };
  }
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

export default function Workout() {
  const { workout, muscleGroup, defaultReps, defaultWeight } =
    useLoaderData<typeof loader>();
  const { tweets, addTweet } = useTweets();

  const actionData = useActionData<ActionData>();
  // React.useEffect will run after the component mounts and whenever the actionData changes
  React.useEffect(() => {
    // If there's a success message, add a tweet
    if (actionData?.setId) {
      addTweet({
        text: 'Workout captured!',
        message: 'Another workout in the books!',
        payload: actionData.setId,
        resource: 'set',
      });
    }
  }, [actionData, addTweet]); // Dependencies array ensures this effect is only re-run if actionData or addTweet changes
  return (
    <div>
      {tweets && tweets.length > 0 && <Tweets tweets={tweets} />}
      <StrengthBar
        returnTo={`/muscleGroup/${muscleGroup.name}`}
        title={workout.displayName}
        message={actionData?.error}
        listItems={[
          {
            name: 'PR Weight',
            httpEntity: <span>&#128170;</span>,
            itemValue: 0,
          },
        ]}
      />
      <div className='workout-tracker'>
        <TrackFit
          workoutId={workout.id}
          weight={defaultWeight}
          reps={defaultReps}
        />
      </div>
    </div>
  );
}
