import { Form } from '@remix-run/react';

export default function WeightTile({
  weight = 0,
  workoutId,
}: {
  weight?: number;
  workoutId: number;
}) {
  return (
    <div>
      <div>Weight</div>
      <div>{weight}</div>
      <Form id='default-weight-form' method='post'>
        <input name='weight' type='number' defaultValue={weight} />
        <input type='hidden' name='workoutId' value={workoutId} />
        <button type='submit'>Update</button>
      </Form>
    </div>
  );
}
