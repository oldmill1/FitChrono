// import { Form } from '@remix-run/react';

// function DataForm({
//   weight,
//   workoutId,
// }: {
//   weight: number;
//   workoutId: number;
// }) {
//   return (
//     <Form id='default-weight-form' method='post'>
//       <input name='weight' type='number' defaultValue={weight} />
//       <input type='hidden' name='workoutId' value={workoutId} />
//       <button type='submit'>Update</button>
//     </Form>
//   );
// }

export default function WeightTile({
  weight = 0,
  workoutId,
}: {
  weight?: number;
  workoutId: number;
}) {
  return (
    <div className='simple-form'>
      <div className='top-container'>
        <div className='heading'>
          <p>Lift Weight</p>
        </div>
        <div className='display'>0</div>
      </div>
      <div className='bottom-container'>
        <div className='buttons'>
          <div className='row'>
            <span>7</span>
            <span>8</span>
            <span>9</span>
          </div>
          <div className='row'>
            <span>4</span>
            <span>5</span>
            <span>6</span>
          </div>
          <div className='row'>
            <span>1</span>
            <span>2</span>
            <span>3</span>
          </div>
        </div>
      </div>
    </div>
  );
}
