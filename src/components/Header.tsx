import React from 'react';
import { Layers, Search, RotateCcw, Smartphone } from 'lucide-react';
import { RoundInfo } from '../types/vocab';

interface HeaderProps {
  selectedRounds: number[];
  roundsInfo: RoundInfo[];
  totalDeckCount: number;
  onOpenRoundSelector: () => void;
  onOpenWordList: () => void;
  onOpenMobileConnect: () => void;
  onShuffle: () => void;
  bookmarkCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  selectedRounds,
  roundsInfo,
  totalDeckCount,
  onOpenRoundSelector,
  onOpenWordList,
  onOpenMobileConnect,
  onShuffle,
  bookmarkCount
}) => {
  const getSelectedRoundsSummary = () => {
    if (selectedRounds.length === 0) return '탄을 선택해주세요';
    if (selectedRounds.length === roundsInfo.length) return '전체 50개 탄 선택됨';
    if (selectedRounds.length === 1) return `총정리 ${selectedRounds[0]}탄`;
    return `총정리 ${selectedRounds[0]}탄 외 ${selectedRounds.length - 1}개`;
  };

  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-3 py-2.5 sm:px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* App Title */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-lg">
            V
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-base sm:text-lg text-white leading-none">
                실전 영어 단어장
              </h1>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                2500 Expressions
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">
              구슬쌤 영상 핵심 총정리 1~50탄
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Round Selector Trigger Button */}
          <button
            onClick={onOpenRoundSelector}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition active:scale-95 shadow-sm"
            title="학습할 탄(회차) 선택"
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="max-w-[120px] sm:max-w-[170px] truncate">
              {getSelectedRoundsSummary()}
            </span>
            <span className="text-[11px] font-bold text-indigo-400 bg-indigo-950/80 px-1.5 py-0.2 rounded-full border border-indigo-800/50">
              {totalDeckCount}개
            </span>
          </button>

          {/* Shuffle Button */}
          <button
            onClick={onShuffle}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition active:scale-95"
            title="단어 순서 다시 섞기 (Shuffle)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Word List / Search Button */}
          <button
            onClick={onOpenWordList}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm transition active:scale-95"
            title="전체 단어 목록 및 검색"
          >
            <Search className="w-4 h-4" />
            <span className="hidden md:inline">사전/검색</span>
            {bookmarkCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>

          {/* Mobile QR Connect Button */}
          <button
            onClick={onOpenMobileConnect}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-950/70 hover:bg-indigo-900/80 border border-indigo-500/40 text-indigo-300 hover:text-white text-xs sm:text-sm font-medium transition active:scale-95"
            title="스마트폰으로 연결 (QR코드)"
          >
            <Smartphone className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">폰으로 열기</span>
          </button>
        </div>
      </div>
    </header>
  );
};
