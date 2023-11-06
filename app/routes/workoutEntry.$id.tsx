import { useLoaderData } from '@remix-run/react';
import StrengthBar from '~/components/StrengthBar';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { db } from '~/db.server';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.id, 'Missing id param');
  const workoutEntryId = parseInt(params.id, 10);
  if (isNaN(workoutEntryId)) {
    throw new Response('Invalid ID', { status: 400 });
  }
  const workoutEntry = await db.workoutEntry.findUnique({
    where: { id: workoutEntryId },
  });
  if (!workoutEntry) {
    throw new Response('Not Found', { status: 404 });
  }
  return json({ workoutEntry });
};
export default function Workout() {
  const { workoutEntry } = useLoaderData<typeof loader>();
  console.log({ workoutEntry });
  return (
    <div>
      <StrengthBar title='Workout' returnTo={'/'} />
    </div>
  );
}
