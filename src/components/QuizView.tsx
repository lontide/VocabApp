import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Volume2, 
  ArrowRight, 
  Flame, 
  Tag, 
  Star 
} from 'lucide-react';
import { WordItem, QuizMode, QuizQuestion } from '../types/vocab';
import { generateQuizQuestion } from '../utils/quiz';
import { playEnglishTTS } from '../utils/tts';

interface QuizViewProps {
  item: WordItem;
  pool: WordItem[];
  currentIndex: number;
  totalCount: number;
  mode: QuizMode;
  streak: number;
  score: number;
  isBookmarked: boolean;
  onToggleBookmark: (id: number) => void;
  onAnswerSubmitted: (isCorrect: boolean) => void;
  onNextQuestion: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  item,
  pool,
  currentIndex,
  totalCount,
  mode,
  streak,
  score,
  isBookmarked,
  onToggleBookmark,
  onAnswerSubmitted,
  onNextQuestion,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);

  // Generate question with 4 options
  const question: QuizQuestion = useMemo(() => {
    return generateQuizQuestion(item, mode, pool);
  }, [item, mode, pool]);

  // Reset answer state when item changes
  useEffect(() => {
    setSelectedOptionId(null);
    setHasAnswered(false);
  }, [item.id, mode]);

  const handleSelectOption = (optionId: number, isCorrect: boolean) => {
    if (hasAnswered) return;
    setSelectedOptionId(optionId);
    setHasAnswered(true);
    onAnswerSubmitted(isCorrect);

    // If English question or answer, play pronunciation
    if (question.ttsText) {
      playEnglishTTS(question.ttsText);
    }
  };

  // Keyboard shortcut support
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    if (!hasAnswered) {
      const key = e.key;
      if (['1', '2', '3', '4'].includes(key)) {
        const idx = parseInt(key, 10) - 1;
        if (question.options[idx]) {
          handleSelectOption(question.options[idx].id, question.options[idx].isCorrect);
        }
      }
    } else {
      if (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowRight') {
        e.preventDefault();
        onNextQuestion();
      }
    }
  }, [hasAnswered, question.options, onNextQuestion]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const isCurrentCorrect = selectedOptionId === item.id;

  return (
    <div className="w-full max-w-xl mx-auto px-3 sm:px-0 py-2 flex flex-col items-center">
      {/* Top Header: Progress, Streak, Score */}
      <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-indigo-400">
            총정리 {item.round}탄
          </span>
          <span className="text-slate-600">·</span>
          <span className="bg-slate-800 px-2 py-0.5 rounded-full text-slate-300 border border-slate-700/60 flex items-center gap-1">
            <Tag className="w-3 h-3 text-indigo-400" />
            {item.category || '실전 회화'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {streak >= 2 && (
            <div className="flex items-center gap-1 text-amber-400 font-bold animate-pulse">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>{streak}연속!</span>
            </div>
          )}
          <div className="text-slate-300 font-medium">
            정답: <span className="text-emerald-400 font-bold">{score}</span> / {currentIndex + (hasAnswered ? 1 : 0)}
          </div>
          <button
            onClick={() => onToggleBookmark(item.id)}
            className="p-1 rounded-lg hover:bg-slate-800 transition"
            title="즐겨찾기 / 북마크"
          >
            <Star
              className={`w-4 h-4 transition ${
                isBookmarked ? 'fill-amber-400 text-amber-400' : 'text-slate-500 hover:text-amber-400'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
        <div 
          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="w-full bg-slate-850 border border-slate-750 rounded-3xl p-5 sm:p-7 shadow-xl mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wider font-bold text-indigo-400 bg-indigo-950/70 px-2.5 py-1 rounded-lg border border-indigo-800/50">
            {question.promptType}
          </span>
          <span className="text-xs font-mono text-slate-400 font-semibold">
            Q. {currentIndex + 1} / {totalCount}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 py-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
            {question.questionText}
          </h2>
          {question.ttsText && (
            <button
              onClick={() => playEnglishTTS(question.ttsText!)}
              className="p-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 transition border border-indigo-500/30 shrink-0"
              title="발음 듣기"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-1">
          올바른 {question.answerType}을(를) 선택하세요.
        </p>
      </div>

      {/* 4 Choices Grid */}
      <div className="w-full space-y-2.5 mb-4">
        {question.options.map((option, idx) => {
          const isSelected = selectedOptionId === option.id;
          let btnStyle = 'bg-slate-800/90 border-slate-700 hover:border-indigo-500 hover:bg-slate-755 text-slate-200';
          let badgeStyle = 'bg-slate-700 text-slate-300';

          if (hasAnswered) {
            if (option.isCorrect) {
              btnStyle = 'bg-emerald-950/70 border-emerald-500 text-emerald-100 shadow-md shadow-emerald-950/50 font-bold';
              badgeStyle = 'bg-emerald-500 text-white';
            } else if (isSelected) {
              btnStyle = 'bg-rose-950/70 border-rose-500 text-rose-200 shadow-md shadow-rose-950/50 line-through';
              badgeStyle = 'bg-rose-500 text-white';
            } else {
              btnStyle = 'bg-slate-850/50 border-slate-800 text-slate-500 opacity-60';
              badgeStyle = 'bg-slate-800 text-slate-600';
            }
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelectOption(option.id, option.isCorrect)}
              disabled={hasAnswered}
              className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left flex items-start gap-3 transition-all duration-150 active:scale-[0.99] ${btnStyle}`}
            >
              <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 transition ${badgeStyle}`}>
                {idx + 1}
              </span>

              <span className="text-sm sm:text-base leading-snug flex-1 font-medium">
                {option.text}
              </span>

              {hasAnswered && option.isCorrect && (
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              )}
              {hasAnswered && isSelected && !option.isCorrect && (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Answer Explanation Box (Shown after answering) */}
      {hasAnswered && (
        <div className="w-full bg-slate-850 border border-slate-750 rounded-2xl p-4 sm:p-5 shadow-xl animate-in fade-in duration-200 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              {isCurrentCorrect ? (
                <span className="text-emerald-400 font-bold text-sm flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> 정답입니다!
                </span>
              ) : (
                <span className="text-rose-400 font-bold text-sm flex items-center gap-1">
                  <XCircle className="w-4 h-4" /> 아쉬워요!
                </span>
              )}
            </div>
            <span className="text-xs text-slate-400">총정리 {item.round}탄 #{item.id}</span>
          </div>

          <div className="space-y-2.5 text-xs sm:text-sm bg-slate-900/60 rounded-xl p-3.5 border border-slate-800">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] text-slate-400 block font-semibold">표현 & 뜻</span>
                <span className="text-indigo-300 font-bold text-base">{item.word}</span>
                <p className="text-slate-300 mt-0.5">{item.meaning}</p>
              </div>
              <button
                onClick={() => playEnglishTTS(item.word)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="border-t border-slate-800 pt-2 flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] text-slate-400 block font-semibold">실전 예문</span>
                <p className="text-slate-200 font-medium">{item.ex_en}</p>
                <p className="text-slate-400 text-xs mt-1">{item.ex_ko}</p>
              </div>
              <button
                onClick={() => playEnglishTTS(item.ex_en)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            onClick={onNextQuestion}
            className="w-full mt-3.5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition active:scale-95"
          >
            <span>다음 문제로 넘어가기 (Space)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
