import type { MetaFunction } from '@remix-run/node';
import { NavLink } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export default function Index() {
  return (
    <div className='grid-container'>
      <NavLink className='grid-item' to={`/muscleGroups/chest`}>
        <div >Chest</div>
      </NavLink>
      <div className='grid-item'>Legs</div>
      <div className='grid-item'>Back</div>
      <div className='grid-item'>Arms</div>
      <div className='grid-item'>Core</div>
      <div className='grid-item'>Shoulders</div>
    </div>
  );
}
