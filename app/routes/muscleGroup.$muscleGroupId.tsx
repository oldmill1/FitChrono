import invariant from 'tiny-invariant';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { NavLink, useLoaderData } from '@remix-run/react';
import StrengthBar from '~/components/StrengthBar';

import { db } from '~/db.server';

async function getLoaderData(name: string) {
  const muscleGroup = await db.muscleGroup.findFirst({
    where: {
      name: name,
    },
    select: {
      id: true,
      name: true,
      display: true,
      workouts: {
        select: {
          id: true,
          name: true,
          displayName: true,
        },
      },
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
  const { workouts } = muscleGroup;
  return (
    <div>
      <div className='grid-container'>
        {workouts.map((workout) => (
          <NavLink
            key={workout.id}
            className='grid-item'
            to={`/workout/${workout.name}`}
          >
            {workout.displayName}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
