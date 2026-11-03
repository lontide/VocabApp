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
}: {
  item: WordItem;
  mode: QuizMode;
  status?: Status;
  onEvaluate: (s: Status) => void;
  bookmarked: boolean;
  onBookmark: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const text = studyText(item, mode);
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
        aria-label={revealed ? "공개된 답안" : "답안 공개"}
        onClick={() => setRevealed(true)}
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
