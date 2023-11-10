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
  coins?: string;
};

function payout(
  repsNumber: number,
  weightNumber: number,
  recentSetsCount: string,
  prWeight: string,
): number {
  let log = '';
  let coins = 3; // Base points for completing a workout set
  log += 'Base points: 3\n';

  // Additional coins for more than 8 reps
  if (repsNumber > 8) {
    coins += 1;
    log += 'Extra points for more than 8 reps: 1\n';
  }

  // Coins based on weight
  let weightPoints = Math.floor(weightNumber / 10);
  coins += weightPoints;
  log += `Points based on weight (${weightNumber}): ${weightPoints}\n`;

  // Bonus coins for recent sets
  let recentSetPoints = Number(recentSetsCount);
  coins += recentSetPoints;
  log += `Bonus points for recent sets (${recentSetsCount}): ${recentSetPoints}\n`;

  // TODO: Pyramid sets = flat 200 coins bonus
  // TODO: Add points for hitting a PR
  // TODO: Add points if you did the same workout in the past 7 days (not including today)

  // Bonus for setting a new PR
  if (weightNumber > Number(prWeight)) {
    coins += 10;
    log += 'It was a PR - got extra 10 points\n';
  }

  console.log(log);
  return coins;
}

export const action = async ({ params, request }: LoaderFunctionArgs) => {
  const formData = await request.formData();
  const weight = formData.get('weight');
  const reps = formData.get('reps');
  const workoutId = formData.get('workoutId');
  const recentSetsCount = formData.get('recentSetsCount');
  const prWeight = formData.get('prWeight');

  invariant(params.workoutName, 'Missing workoutName param');
  invariant(workoutId, 'Missing workoutId param');
  invariant(weight, 'Missing weight param');
  invariant(reps, 'Missing reps param');
  invariant(
    typeof recentSetsCount === 'string',
    'recentSetsCount must be a string',
  );
  invariant(typeof prWeight === 'string', 'prWeight must be a string');

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

      // Generate points for this workout set
      const coins = payout(repsNumber, weightNumber, recentSetsCount, prWeight);

      // Create a new SetEntry
      // Look for an env variable called IS_LOCAL
      // if it's true, don't create a setEntry in the database, just return the id 1
      // otherwise, create a new setEntry in the database
      // if (process.env.IS_LOCAL) {
      //   console.log('IS_LOCAL is true, not creating a setEntry');
      //   return json({ setId: 23, coins });
      // }

      const setEntry = await db.setEntry.create({
        data: {
          userId,
          workoutId: Number(workoutId),
          weight: weightNumber,
          reps: repsNumber,
          coins,
        },
      });

      // Return the id of the new SetEntry
      return json({ setId: setEntry.id, coins });
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
  // Count all the SetEntries for this workout that were created in the last 15 minutes by user 1
  // get the count only
  // for 15 minutes ago, use new Date(Date.now() - 15 * 60 * 1000)
  // for 7 days ago, use new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const recentSetsCount = await db.setEntry.count({
    where: {
      workoutId: workout.id,
      userId: 1,
      timestamp: {
        gt: new Date(Date.now() - 15 * 60 * 1000),
      },
    },
  });

  // Calculate the PR
  const prWeight = await db.setEntry.findFirst({
    where: {
      workoutId: workout.id,
      userId: 1,
    },
    orderBy: {
      weight: 'desc',
    },
    take: 1,
  });

  return json({
    workout,
    muscleGroup,
    defaultReps: workoutDefaults ? workoutDefaults.reps : 0, // TODO: maybe change this?
    defaultWeight: workoutDefaults ? workoutDefaults.weight : 0,
    prWeight: prWeight ? prWeight.weight : 0, // Top weight will be 0 if there are no records
    recentSetsCount,
  });
};

export default function Workout() {
  const {
    workout,
    muscleGroup,
    defaultReps,
    defaultWeight,
    recentSetsCount,
    prWeight,
  } = useLoaderData<typeof loader>();
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
        coins: actionData.coins,
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
            itemValue: prWeight,
          },
        ]}
      />
      <div className='workout-tracker'>
        <TrackFit
          workoutId={workout.id}
          weight={defaultWeight}
          reps={defaultReps}
          recentSetsCount={recentSetsCount}
          prWeight={prWeight}
        />
      </div>
    </div>
  );
}
