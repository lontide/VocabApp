import React, { useState } from 'react';
import { X, Check, Filter } from 'lucide-react';
import { RoundInfo } from '../types/vocab';

interface RoundSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  roundsInfo: RoundInfo[];
  selectedRounds: number[];
  onApplyRounds: (newRounds: number[]) => void;
}

export const RoundSelectorModal: React.FC<RoundSelectorModalProps> = ({
  isOpen,
  onClose,
  roundsInfo,
  selectedRounds,
  onApplyRounds,
}) => {
  const [tempSelected, setTempSelected] = useState<number[]>(selectedRounds);

  if (!isOpen) return null;

  const toggleRound = (roundNum: number) => {
    if (tempSelected.includes(roundNum)) {
      // Prevent unselecting if it's the last one
      if (tempSelected.length === 1) return;
      setTempSelected(tempSelected.filter(r => r !== roundNum));
    } else {
      setTempSelected([...tempSelected, roundNum].sort((a, b) => a - b));
    }
  };

  const selectAll = () => {
    setTempSelected(roundsInfo.map(r => r.round));
  };

  const selectRange = (start: number, end: number) => {
    const range = roundsInfo
      .filter(r => r.round >= start && r.round <= end)
      .map(r => r.round);
    setTempSelected(range);
  };

  const handleApply = () => {
    if (tempSelected.length === 0) return;
    onApplyRounds(tempSelected);
    onClose();
  };

  const totalExpressions = tempSelected.length * 50;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📚 총정리 탄(회차) 선택</span>
              <span className="text-xs font-normal text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                복수 선택 가능
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              학습할 총정리 회차를 선택하세요. (총 1탄 ~ 50탄)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Range Selector Buttons */}
        <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-900/50 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-indigo-400" /> 빠른 선택:
          </span>
          <button
            onClick={selectAll}
            className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-medium border border-indigo-500/30 transition active:scale-95"
          >
            전체 1~50탄
          </button>
          <button
            onClick={() => selectRange(1, 10)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition active:scale-95"
          >
            1~10탄
          </button>
          <button
            onClick={() => selectRange(11, 20)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition active:scale-95"
          >
            11~20탄
          </button>
          <button
            onClick={() => selectRange(21, 30)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition active:scale-95"
          >
            21~30탄
          </button>
          <button
            onClick={() => selectRange(31, 40)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition active:scale-95"
          >
            31~40탄
          </button>
          <button
            onClick={() => selectRange(41, 50)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition active:scale-95"
          >
            41~50탄
          </button>
        </div>

        {/* 1~50 Rounds Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {roundsInfo.map((info) => {
            const isSelected = tempSelected.includes(info.round);
            const previewCats = info.categories.slice(0, 2).join(', ');

            return (
              <button
                key={info.round}
                onClick={() => toggleRound(info.round)}
                className={`flex flex-col p-2.5 rounded-xl text-left border transition-all relative ${
                  isSelected
                    ? 'bg-indigo-950/60 border-indigo-500 shadow-md shadow-indigo-950/50'
                    : 'bg-slate-850/60 border-slate-800 hover:border-slate-705 hover:bg-slate-800/60 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-xs font-bold ${isSelected ? 'text-indigo-300' : 'text-slate-300'}`}>
                    총정리 {info.round}탄
                  </span>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center text-xs transition ${
                      isSelected
                        ? 'bg-indigo-500 text-white'
                        : 'border border-slate-600 text-transparent'
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 truncate w-full" title={info.categories.join(', ')}>
                  {previewCats || '실전 표현 50개'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-850 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-300">
            선택된 탄: <span className="font-bold text-indigo-400">{tempSelected.length}개</span>
            <span className="text-slate-500 mx-1.5">|</span>
            총 <span className="font-bold text-emerald-400">{totalExpressions}개</span> 단어
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              취소
            </button>
            <button
              onClick={handleApply}
              disabled={tempSelected.length === 0}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>적용하고 학습하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
