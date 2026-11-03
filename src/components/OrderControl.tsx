import { ListOrdered, Shuffle, Check } from "lucide-react";
import { Order } from "../utils/study";
export function OrderControl({
  value,
  onChange,
}: {
  value: Order;
  onChange: (order: Order) => void;
}) {
  return (
    <div className="max-w-4xl mx-auto px-3 pt-4 pb-2">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-semibold tracking-wide text-slate-400">
          학습 순서
        </span>
        <span className="text-[11px] text-slate-500">
          {value === "original"
            ? "엑셀에 담긴 순서대로"
            : "새로운 순서로 복습하기"}
        </span>
      </div>
      <div
        role="group"
        aria-label="학습 순서"
        className="grid grid-cols-2 gap-1.5 rounded-2xl border border-slate-700/70 bg-slate-950/50 p-1.5 shadow-inner"
      >
        {(
          [
            { id: "original", label: "원본 순서", Icon: ListOrdered },
            { id: "shuffle", label: "섞기", Icon: Shuffle },
          ] as const
        ).map(({ id, label, Icon }) => {
          const active = value === id;
          return (
            <button
              type="button"
              key={id}
              aria-pressed={active}
              onClick={() => {
                if (!active) onChange(id);
              }}
              className={
                "min-h-12 flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300 " +
                (active
                  ? "border-indigo-400/70 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-md shadow-indigo-950/40"
                  : "border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-100")
              }
            >
              <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span>{label}</span>
              <span aria-hidden="true" className="w-4">
                {active && <Check className="h-4 w-4" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
