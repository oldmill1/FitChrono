import { useLoaderData } from '@remix-run/react';
import StrengthBar from '~/components/StrengthBar';
import { json, LoaderFunction } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { db } from '~/db.server';

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.id, 'Missing id param');
  const setEntryId = parseInt(params.id, 10);

  try {
    if (isNaN(setEntryId)) {
      return new Response('Invalid ID', { status: 400 });
    }

    const setEntry = await db.setEntry.findUnique({
      where: { id: setEntryId },
    });

    if (!setEntry) {
      return new Response('Not Found', { status: 404 });
    }

    const workout = await db.workout.findUnique({
      where: { id: setEntry.workoutId },
    });

    if (!workout) {
      return new Response('Workout Not Found', { status: 404 });
    }

    return json({ setEntry, workout });
  } catch (error) {
    // Handle any other errors that might occur during database access
    throw new Response('Internal Server Error', { status: 500 });
  }
};
export default function Workout() {
  const { setEntry, workout } = useLoaderData<typeof loader>();
  console.log({ workout });
  console.log({ setEntry });
  return (
    <div>
      <StrengthBar
        title={`Your ${workout.displayName}`}
        returnTo={`/workout/${workout.name}/`}
      />
      <div className='quad-container'>
        <div className='quad-item'></div>
        <div className='quad-item'></div>
        <div className='quad-item'></div>
        <div className='quad-item'></div>
      </div>
    </div>
  );
}
