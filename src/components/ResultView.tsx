import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  RotateCcw, 
  AlertCircle, 
  Layers, 
  XCircle,
  Volume2
} from 'lucide-react';
import { WordItem } from '../types/vocab';
import { playEnglishTTS } from '../utils/tts';

interface ResultViewProps {
  totalCount: number;
  correctCount: number;
  wrongItems: WordItem[];
  onRetryAll: () => void;
  onRetryWrongOnly: () => void;
  onOpenRoundSelector: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  totalCount,
  correctCount,
  wrongItems,
  onRetryAll,
  onRetryWrongOnly,
  onOpenRoundSelector,
}) => {
  const percentage = Math.round((correctCount / totalCount) * 100) || 0;

  useEffect(() => {
    // Fire confetti when reaching results
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn('Confetti failed to trigger', e);
    }
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto px-3 sm:px-0 py-6 flex flex-col items-center animate-in fade-in duration-300">
      {/* Trophy & Congratulation Banner */}
      <div className="w-full bg-gradient-to-b from-indigo-950/70 to-slate-900 border border-indigo-500/40 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20 text-slate-950">
          <Trophy className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight mb-1">
          학습 완료! 수고하셨습니다 🎉
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          선택한 회차의 모든 단어 학습을 마쳤습니다.
        </p>

        {/* Score Summary Grid */}
        <div className="grid grid-cols-3 gap-2 mt-6">
          <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block font-semibold">학습 단어</span>
            <span className="text-xl font-black text-white">{totalCount}</span>
            <span className="text-[10px] text-slate-400 block">개</span>
          </div>

          <div className="bg-emerald-950/40 rounded-2xl p-3 border border-emerald-500/30">
            <span className="text-[11px] text-emerald-400 block font-semibold">외운 단어</span>
            <span className="text-xl font-black text-emerald-300">{correctCount}</span>
            <span className="text-[10px] text-emerald-400 block">개</span>
          </div>

          <div className="bg-indigo-950/40 rounded-2xl p-3 border border-indigo-500/30">
            <span className="text-[11px] text-indigo-400 block font-semibold">정답률</span>
            <span className="text-xl font-black text-indigo-300">{percentage}%</span>
            <span className="text-[10px] text-indigo-400 block">성공</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-2.5 mb-6">
        {wrongItems.length > 0 && (
          <button
            onClick={onRetryWrongOnly}
            className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition active:scale-95"
          >
            <AlertCircle className="w-5 h-5 text-slate-950" />
            <span>헷갈린 단어({wrongItems.length}개)만 다시 학습하기</span>
          </button>
        )}

        <button
          onClick={onRetryAll}
          className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
          <span>전체 단어 다시 셔플해서 학습하기</span>
        </button>

        <button
          onClick={onOpenRoundSelector}
          className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-700 transition"
        >
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>다른 탄(회차) 선택하기</span>
        </button>
      </div>

      {/* Wrong Items Review List */}
      {wrongItems.length > 0 && (
        <div className="w-full bg-slate-850 border border-slate-750 rounded-3xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>복습이 필요한 단어 목록 ({wrongItems.length}개)</span>
            </h3>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {wrongItems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-300 text-sm">{item.word}</span>
                    <span className="text-[10px] text-slate-500">#{item.id} · 총정리 {item.round}탄</span>
                  </div>
                  <p className="text-slate-300 mt-0.5">{item.meaning}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5 italic">{item.ex_en}</p>
                </div>

                <button
                  onClick={() => playEnglishTTS(item.word)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition shrink-0"
                  title="발음 듣기"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
