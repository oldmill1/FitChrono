import type { MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node'; // or cloudflare/deno
import { NavLink, useLoaderData } from '@remix-run/react';

import { db } from '~/db.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export const loader = async () => {
  // return all the MuscleGroup records
  const muscleGroups = await db.muscleGroup.findMany();
  return json({ muscleGroups });
};

export default function Index() {
  const { muscleGroups } = useLoaderData<typeof loader>();
  return (
    <div className='grid-container'>
      {muscleGroups.map((muscleGroup) => (
        <NavLink
          key={muscleGroup.id}
          className='grid-item'
          to={`/muscleGroups/${muscleGroup.id}`}
        >
          <div>{muscleGroup.name}</div>
        </NavLink>
      ))}
    </div>
  );
}
