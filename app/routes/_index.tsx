import type { MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { NavLink, useLoaderData } from '@remix-run/react';
import { db } from '~/db.server';
import Header from '~/components/Header';

export const meta: MetaFunction = () => {
  return [
    { title: 'Barbell Swami - Get strong and health' },
    {
      name: 'description',
      content:
        'Intelligent workout tracking and planning for people who lift weights',
    },
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
      <div className='content'>
        <div className='clouds'>
          {muscleGroups.map((muscleGroup) => (
            <NavLink
              key={muscleGroup.id}
              data-testid={`cloud-${muscleGroup.name}`}
              className='cloud'
              to={`/muscleGroup/${muscleGroup.name}`}
            >
              <div>
                <span>{muscleGroup.name}</span>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
