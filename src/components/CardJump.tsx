export function CardJump({ current, total, onJump }: {
  current: number;
  total: number;
  onJump: (index: number) => void;
}) {
  return (
    <select
      aria-label="카드 번호로 이동"
      title="현재 학습 순서 기준 카드 번호로 이동"
      value={current}
      onChange={(event) => {
        const number = Number(event.target.value);
        if (Number.isInteger(number) && number >= 1 && number <= total) {
          onJump(number - 1);
        }
      }}
      className="min-h-11 max-w-32 rounded-lg border border-slate-600 bg-slate-800 px-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-300"
    >
      {Array.from({ length: total }, (_, index) => (
        <option key={index + 1} value={index + 1}>{index + 1}번</option>
      ))}
    </select>
  );
}
