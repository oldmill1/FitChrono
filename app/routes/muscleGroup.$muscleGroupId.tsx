import invariant from 'tiny-invariant';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { NavLink, useLoaderData } from '@remix-run/react';
import Header from '~/components/Header';

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
          help: true,
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
  return json({
    muscleGroup: await getLoaderData(params.muscleGroupId),
    title: process.env.APP_NAME,
  });
};

export default function MuscleGroup() {
  const { muscleGroup } = useLoaderData<typeof loader>();
  const { workouts } = muscleGroup;
  return (
    <div className='container list-container'>
      {muscleGroup.display && typeof muscleGroup.display === 'string' && (
        <Header hasBackButton={true} title={`${muscleGroup.display}`} />
      )}
      <ul className='list-box'>
        {workouts.map((workout) => (
          <li key={workout.id} className='list-box-item'>
            <img
              src='/images/icon.png'
              alt={workout.displayName}
              className='item-image'
            />
            <div className='item-text-content'>
              <h3 className='item-heading'>
                <NavLink to={`/workout/${workout.name}`}>
                  {workout.displayName}
                </NavLink>
              </h3>
              <p className='item-description'>{workout.help}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
