import type { MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node'; // or cloudflare/deno
import { NavLink, useLoaderData } from '@remix-run/react';
import { db } from '~/db.server';
import Header from '~/components/Header';

export const meta: MetaFunction = () => {
  return [
    { title: 'You are awesome!' },
    { name: 'description', content: 'The hype is real' },
  ];
};

export const loader = async () => {
  // return all the MuscleGroup records
  const muscleGroups = await db.muscleGroup.findMany();
  return json({ muscleGroups, title: process.env.APP_NAME });
};

export default function Index() {
  const { muscleGroups, title } = useLoaderData<typeof loader>();
  return (
    <div className='container'>
      {title && typeof title === 'string' && <Header title={title} />}
      <div className='grid-container'>
        {muscleGroups.map((muscleGroup) => (
          <NavLink
            key={muscleGroup.id}
            className='grid-item'
            to={`/muscleGroup/${muscleGroup.name}`}
          >
            <div>{muscleGroup.name}</div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
