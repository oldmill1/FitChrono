import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export default function Index() {
  return (
    <div className='grid-container'>
      <div className='grid-item'>Chest</div>
      <div className='grid-item'>Legs</div>
      <div className='grid-item'>Back</div>
      <div className='grid-item'>Arms</div>
      <div className='grid-item'>Core</div>
      <div className='grid-item'>Shoulders</div>
    </div>
  );
}
