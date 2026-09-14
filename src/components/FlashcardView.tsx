import React, { useState, useEffect, useCallback } from 'react';
import { 
  Volume2, 
  Star, 
  RotateCw, 
  ArrowLeft, 
  Check, 
  X, 
  Eye, 
  Tag
} from 'lucide-react';
import { WordItem, QuizMode } from '../types/vocab';
import { playEnglishTTS } from '../utils/tts';

interface FlashcardViewProps {
  item: WordItem;
  currentIndex: number;
  totalCount: number;
  mode: QuizMode;
  isBookmarked: boolean;
  onToggleBookmark: (id: number) => void;
  onNext: (isMastered: boolean) => void;
  onPrev: () => void;
  canPrev: boolean;
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({
  item,
  currentIndex,
  totalCount,
  mode,
  isBookmarked,
  onToggleBookmark,
  onNext,
  onPrev,
  canPrev,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flipped state when card changes
  useEffect(() => {
    setIsFlipped(false);
  }, [item.id, mode]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // If inside an input/textarea, ignore
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    if (e.code === 'Space') {
      e.preventDefault();
      setIsFlipped(prev => !prev);
    } else if (e.code === 'ArrowRight') {
      e.preventDefault();
      onNext(true); // 외웠어요
    } else if (e.code === 'ArrowLeft') {
      e.preventDefault();
      if (canPrev) {
        onPrev();
      } else {
        onNext(false); // 헷갈려요
      }
    } else if (e.code === 'KeyR') {
      e.preventDefault();
      // Play TTS for the current English text
      if (mode === 'korean_to_sentence' || mode === 'sentence_to_meaning') {
        playEnglishTTS(item.ex_en);
      } else {
        playEnglishTTS(item.word);
      }
    }
  }, [canPrev, onNext, onPrev, item, mode]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const getPromptData = () => {
    switch (mode) {
      case 'word_to_meaning':
        return {
          label: '실전 영어 표현',
          prompt: item.word,
          isEnglish: true,
          sublabel: '이 표현의 뜻과 뉘앙스를 떠올려보세요.',
          targetAnswer: item.meaning
        };
      case 'meaning_to_word':
        return {
          label: '뉘앙스 및 한국어 뜻',
          prompt: item.meaning,
          isEnglish: false,
          sublabel: '이에 해당하는 영어 표현을 떠올려보세요.',
          targetAnswer: item.word
        };
      case 'sentence_to_meaning':
        return {
          label: '실전 예문 (English)',
          prompt: item.ex_en,
          isEnglish: true,
          sublabel: '이 문장의 의미와 뉘앙스를 해석해보세요.',
          targetAnswer: item.meaning
        };
      case 'korean_to_sentence':
        return {
          label: '자연스러운 해석 (Korean)',
          prompt: item.ex_ko,
          isEnglish: false,
          sublabel: '이 말을 영어 예문으로 어떻게 표현할까요?',
          targetAnswer: item.ex_en
        };
    }
  };

  const promptData = getPromptData();

  return (
    <div className="w-full max-w-xl mx-auto px-3 sm:px-0 py-2 flex flex-col items-center">
      {/* Progress & Card Info Bar */}
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

        <div className="flex items-center gap-2">
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
          <span className="font-mono text-slate-300 font-bold bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60">
            {currentIndex + 1} <span className="text-slate-500 font-normal">/</span> {totalCount}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
        <div 
          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
        />
      </div>

      {/* Flashcard Body */}
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full min-h-[360px] sm:min-h-[400px] bg-gradient-to-b from-slate-850 to-slate-900 border border-slate-750 hover:border-indigo-500/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative cursor-pointer select-none transition-all duration-200 group"
      >
        {/* Card Header inside */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-bold text-indigo-400/90 bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-800/50">
              {promptData.label}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(!isFlipped);
            }}
            className="text-xs flex items-center gap-1.5 text-slate-400 group-hover:text-indigo-300 transition bg-slate-800/80 hover:bg-slate-750 px-2.5 py-1 rounded-xl border border-slate-700"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isFlipped ? '문제 보기' : '정답 확인'}</span>
          </button>
        </div>

        {/* Card Central Question / Answer View */}
        <div className="my-auto py-4 text-center flex flex-col items-center justify-center">
          {/* Main Question Display */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-relaxed">
              {promptData.prompt}
            </h2>
            {promptData.isEnglish && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playEnglishTTS(promptData.prompt);
                }}
                className="p-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 hover:text-indigo-300 transition border border-indigo-500/30 active:scale-95"
                title="발음 듣기 (R)"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <p className="text-xs sm:text-sm text-slate-400 mt-2 font-normal">
            {promptData.sublabel}
          </p>

          {/* Answer Section (Visible when Flipped) */}
          {isFlipped ? (
            <div className="w-full mt-6 pt-5 border-t border-slate-750 animate-in fade-in zoom-in-95 duration-200 text-left">
              {/* Target Answer Highlight */}
              <div className="bg-indigo-950/50 border border-indigo-500/40 rounded-2xl p-4 mb-4">
                <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wide mb-1 flex items-center justify-between">
                  <span>정답</span>
                  <span className="text-[10px] text-slate-400 font-normal">No. #{item.id}</span>
                </div>
                <div className="text-lg sm:text-xl font-bold text-emerald-300 leading-snug flex items-center justify-between gap-2">
                  <span>{promptData.targetAnswer}</span>
                  {!promptData.isEnglish && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playEnglishTTS(promptData.targetAnswer);
                      }}
                      className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 transition shrink-0"
                      title="발음 듣기"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Full Context Details */}
              <div className="space-y-3 bg-slate-800/60 rounded-2xl p-4 border border-slate-750 text-xs sm:text-sm">
                {/* Expression & Meaning */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-700/60 pb-2.5">
                  <div>
                    <span className="text-slate-400 text-[11px] block">영어 표현 & 뜻</span>
                    <span className="font-bold text-indigo-300 text-base">{item.word}</span>
                    <span className="text-slate-300 ml-2">{item.meaning}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playEnglishTTS(item.word);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition shrink-0"
                    title="단어 발음 듣기"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Example Sentence & Translation */}
                <div className="pt-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-slate-400 text-[11px] block">실전 예문</span>
                      <p className="text-slate-200 font-medium">{item.ex_en}</p>
                      <p className="text-slate-400 text-xs mt-1">{item.ex_ko}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playEnglishTTS(item.ex_en);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition shrink-0"
                      title="예문 발음 듣기"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-800/90 text-indigo-400 text-xs font-semibold border border-indigo-500/20 group-hover:border-indigo-500/40 group-hover:bg-indigo-950/40 transition">
                <Eye className="w-4 h-4" />
                <span>카드를 터치하거나 Space를 눌러 정답 확인</span>
              </span>
            </div>
          )}
        </div>

        {/* Card Footer Helper */}
        <div className="w-full flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
          <span>Space: 뒤집기</span>
          <span>R: 영어 음성 재생</span>
          <span>←/→: 이전/다음</span>
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="w-full grid grid-cols-3 gap-2 sm:gap-3 mt-4">
        <button
          onClick={onPrev}
          disabled={!canPrev}
          className="flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-750 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300 font-semibold text-xs sm:text-sm border border-slate-700 transition active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>이전</span>
        </button>

        <button
          onClick={() => onNext(false)}
          className="flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 font-bold text-xs sm:text-sm transition active:scale-95 shadow-md shadow-rose-950/30"
          title="오답 노트에 저장하고 다음으로"
        >
          <X className="w-4 h-4" />
          <span>헷갈려요</span>
        </button>

        <button
          onClick={() => onNext(true)}
          className="flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition active:scale-95 shadow-lg shadow-emerald-600/30"
          title="외운 단어로 표시하고 다음으로"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>외웠어요</span>
        </button>
      </div>
    </div>
  );
};
