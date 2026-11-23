import { useState } from "react";
import { WordItem, QuizMode } from "../types/vocab";
import { studyText, Status } from "../utils/study";
import { playEnglishTTS } from "../utils/tts";
export function StudyItem({
  item,
  mode,
  status,
  onEvaluate,
  bookmarked,
  onBookmark,
  compact = false,
}: {
  item: WordItem;
  mode: QuizMode;
  status?: Status;
  onEvaluate: (s: Status) => void;
  bookmarked: boolean;
  onBookmark: () => void;
  compact?: boolean;
}) {
  const [revealed, setRevealed] = useState(false);
  const text = studyText(item, mode);
  if (compact) return (
    <article className="flex items-center gap-3 border-b border-slate-700/70 py-3 px-4 min-w-0">
      <div className="min-w-0 flex-1">
        <span className="text-xs text-slate-400">{item.round}탄 · #{item.id}</span>
        <p className="text-base font-normal whitespace-pre-wrap break-words">{text.questionText}</p>
        <div className="flex items-center gap-1">
          <button
            className="min-h-11 min-w-0 flex-1 text-left text-sm text-slate-200 whitespace-pre-wrap break-words rounded focus-visible:outline focus-visible:outline-indigo-300"
            aria-expanded={revealed}
            aria-label={revealed ? "답안 다시 가리기" : "답안 공개"}
            onClick={() => setRevealed(value => !value)}
          >
            {revealed ? text.correctAnswerText : "탭하여 답안 확인"}
          </button>
          {revealed && <button
            className="w-11 h-11 shrink-0 rounded-lg text-indigo-300 focus-visible:outline focus-visible:outline-indigo-300"
            aria-label="영어 발음 듣기"
            title="영어 발음 듣기"
            onClick={() => playEnglishTTS(text.ttsText)}
          ><span aria-hidden="true">♪</span></button>}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex rounded-lg bg-slate-900/60 ring-1 ring-inset ring-slate-700">
          {(["confused", "mastered"] as Status[]).map(s => (
            <button
              key={s}
              aria-label={(status === s ? "✓ " : "") + (s === "mastered" ? "외웠어요" : "헷갈려요")}
              title={s === "mastered" ? "외웠어요" : "헷갈려요"}
              aria-pressed={status === s}
              onClick={() => onEvaluate(s)}
              className={"w-11 h-11 rounded-lg text-lg focus-visible:outline focus-visible:outline-indigo-300 " +
                (status === s ? "bg-indigo-600 text-white ring-1 ring-inset ring-indigo-300" : "text-slate-400 hover:bg-slate-700")}
            ><span aria-hidden="true">{s === "mastered" ? "✓" : "?"}</span></button>
          ))}
        </div>
        <button
          className="w-11 h-11 rounded-lg text-amber-300 focus-visible:outline focus-visible:outline-indigo-300"
          aria-label={bookmarked ? "★ 북마크" : "☆ 북마크"}
          title="북마크"
          aria-pressed={bookmarked}
          onClick={onBookmark}
        ><span aria-hidden="true">{bookmarked ? "★" : "☆"}</span></button>
      </div>
    </article>
  );
  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-800 p-4 space-y-3 min-w-0">
      <div className="flex justify-between items-center text-sm text-slate-300">
        <span>
          총정리 {item.round}탄 · #{item.id}
        </span>
        <button className="p-3" aria-pressed={bookmarked} onClick={onBookmark}>
          {bookmarked ? "★ 북마크" : "☆ 북마크"}
        </button>
      </div>
      <p className="text-lg font-semibold whitespace-pre-wrap break-words">
        {text.questionText}
      </p>
      <button
        className="w-full text-left min-h-14 p-4 rounded-xl bg-slate-900 whitespace-pre-wrap break-words"
        aria-expanded={revealed}
        aria-label={revealed ? "답안 다시 가리기" : "답안 공개"}
        onClick={() => setRevealed((value) => !value)}
      >
        {revealed ? text.correctAnswerText : "탭하여 답안 확인"}
      </button>
      {revealed && (
        <button
          className="p-3 text-indigo-300"
          onClick={() => playEnglishTTS(text.ttsText)}
        >
          영어 발음 듣기
        </button>
      )}
      <div className="grid grid-cols-2 gap-2">
        {(["confused", "mastered"] as Status[]).map((s) => (
          <button
            key={s}
            aria-pressed={status === s}
            onClick={() => onEvaluate(s)}
            className={
              "min-h-12 p-3 rounded-xl border " +
              (status === s
                ? "border-indigo-300 bg-indigo-600 text-white"
                : "border-slate-600 bg-slate-900")
            }
          >
            {status === s ? "✓ " : ""}
            {s === "mastered" ? "외웠어요" : "헷갈려요"}
          </button>
        ))}
      </div>
    </article>
  );
}
