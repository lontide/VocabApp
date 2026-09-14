import React from 'react';
import { 
  Languages, 
  HelpCircle, 
  FileText, 
  MessageSquareQuote, 
  CheckCircle2, 
  Layers
} from 'lucide-react';
import { QuizMode, StudyStyle } from '../types/vocab';

interface ModeTabsProps {
  currentMode: QuizMode;
  onSelectMode: (mode: QuizMode) => void;
  studyStyle: StudyStyle;
  onSelectStudyStyle: (style: StudyStyle) => void;
}

export const ModeTabs: React.FC<ModeTabsProps> = ({
  currentMode,
  onSelectMode,
  studyStyle,
  onSelectStudyStyle,
}) => {
  const modes: { id: QuizMode; title: string; subtitle: string; icon: React.ReactNode }[] = [
    {
      id: 'word_to_meaning',
      title: '단어 ➔ 뜻',
      subtitle: '영어 표현 보고 뜻 맞히기',
      icon: <Languages className="w-4 h-4" />
    },
    {
      id: 'meaning_to_word',
      title: '뜻 ➔ 단어',
      subtitle: '한국어 뜻 보고 단어 맞히기',
      icon: <HelpCircle className="w-4 h-4" />
    },
    {
      id: 'sentence_to_meaning',
      title: '예문 ➔ 뜻',
      subtitle: '영어 예문 보고 뜻 맞히기',
      icon: <FileText className="w-4 h-4" />
    },
    {
      id: 'korean_to_sentence',
      title: '한국어 ➔ 영어 예문',
      subtitle: '한국어 문장 보고 영어 예문 맞히기',
      icon: <MessageSquareQuote className="w-4 h-4" />
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-2.5 px-3 sm:px-6 pt-3">
      {/* 4 Study Modes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
        {modes.map((m) => {
          const isActive = currentMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectMode(m.id)}
              className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl border text-center transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30 font-bold scale-[1.01]'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-white hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className={isActive ? 'text-white' : 'text-indigo-400'}>
                  {m.icon}
                </span>
                <span className="text-xs sm:text-sm">{m.title}</span>
              </div>
              <span className={`text-[10px] hidden sm:block ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                {m.subtitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Style Toggle (Flashcard vs Quiz) */}
      <div className="flex items-center justify-between gap-2 bg-slate-800/40 p-1.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onSelectStudyStyle('flashcard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              studyStyle === 'flashcard'
                ? 'bg-indigo-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>📇 플래시카드 (정답 확인)</span>
          </button>
          <button
            onClick={() => onSelectStudyStyle('quiz')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              studyStyle === 'quiz'
                ? 'bg-indigo-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>🎯 4지선다 퀴즈 (테스트)</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 hidden sm:flex items-center gap-2 pr-2">
          <span>단축키: Space (정답/다음), ←/→ (이전/다음), 1~4 (보기)</span>
        </div>
      </div>
    </div>
  );
};
