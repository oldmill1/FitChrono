import type { MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node'; // or cloudflare/deno
import { NavLink, useLoaderData } from '@remix-run/react';
import { db } from '~/db.server';
import Menubar from '~/components/Menubar';

export const meta: MetaFunction = () => {
  return [
    { title: 'You are awesome!' },
    { name: 'description', content: 'The hype is real' },
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
            name: 'Total Weight Logged',
            httpEntity: <span>&#128170;</span>,
            itemValue: 0,
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
