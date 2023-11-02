export default function WeightTile({ weight = 0 }: { weight?: number }) {
  return (
    <div>
      <div>Weight</div>
      <div>{weight}</div>
    </div>
  );
}
