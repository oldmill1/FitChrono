import invariant from 'tiny-invariant';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { db } from '~/db.server';

async function getLoaderData(name: string) {
  console.log({ name });
  const muscleGroup = await db.muscleGroup.findFirst({
    where: {
      name: name,
    },
    select: {
      id: true,
      name: true,
    },
  });
  if (!muscleGroup) {
    throw new Response('Not Found', { status: 404 });
  }
  return muscleGroup;
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.muscleGroupId, 'Missing muscleGroupId param');
  return json(await getLoaderData(params.muscleGroupId));
};

export default function MuscleGroup() {
  const muscleGroup = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>{muscleGroup.name}</h1>
    </div>
  );
}
