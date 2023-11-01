import type { MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node'; // or cloudflare/deno
import { NavLink, useLoaderData } from '@remix-run/react';
import { db } from '~/db.server';
import Menubar from '~/components/Menubar';

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
    <div>
      <Menubar
        title='FitChrono 0.1'
        listItems={[
          {
            name: 'Hearts',
            httpEntity: <span>&#10084;</span>,
          },
          {
            name: 'Total Weight',
            httpEntity: <span>&#128170;</span>,
          },
        ]}
      />
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
