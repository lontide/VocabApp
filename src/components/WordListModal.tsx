import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Star, 
  Volume2
} from 'lucide-react';
import { WordItem } from '../types/vocab';
import { playEnglishTTS } from '../utils/tts';

interface WordListModalProps {
  isOpen: boolean;
  onClose: () => void;
  allItems: WordItem[];
  selectedRounds: number[];
  bookmarks: number[];
  onToggleBookmark: (id: number) => void;
}

export const WordListModal: React.FC<WordListModalProps> = ({
  isOpen,
  onClose,
  allItems,
  selectedRounds,
  bookmarks,
  onToggleBookmark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [scope, setScope] = useState<'selected' | 'all' | 'bookmarks'>('selected');
  const [displayLimit, setDisplayLimit] = useState(50);

  if (!isOpen) return null;

  // Filter items
  const filteredItems = useMemo(() => {
    let pool = allItems;

    if (scope === 'selected') {
      pool = pool.filter(i => selectedRounds.includes(i.round));
    } else if (scope === 'bookmarks') {
      pool = pool.filter(i => bookmarks.includes(i.id));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      pool = pool.filter(i => 
        i.word.toLowerCase().includes(q) ||
        i.meaning.toLowerCase().includes(q) ||
        i.ex_en.toLowerCase().includes(q) ||
        i.ex_ko.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        `총정리 ${i.round}탄`.includes(q)
      );
    }

    return pool;
  }, [allItems, selectedRounds, bookmarks, scope, searchQuery]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-400" />
              <span>단어장 검색 및 전체 목록</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              영어 표현, 한글 뜻, 예문, 카테고리를 실시간으로 검색할 수 있습니다.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/60 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setDisplayLimit(50);
              }}
              placeholder="단어, 뜻, 예문 검색... (예: come up, 회의, take)"
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Scope Filters */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => { setScope('selected'); setDisplayLimit(50); }}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  scope === 'selected'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                선택된 탄 ({selectedRounds.length * 50}개)
              </button>
              <button
                onClick={() => { setScope('all'); setDisplayLimit(50); }}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  scope === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                전체 50탄 (2,500개)
              </button>
              <button
                onClick={() => { setScope('bookmarks'); setDisplayLimit(50); }}
                className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1 transition ${
                  scope === 'bookmarks'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>북마크 ({bookmarks.length}개)</span>
              </button>
            </div>

            <div className="text-slate-400">
              검색 결과: <span className="font-bold text-indigo-400">{filteredItems.length}</span>개
            </div>
          </div>
        </div>

        {/* List of Words */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2.5">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm">일치하는 단어가 없습니다.</p>
              <p className="text-xs mt-1 text-slate-500">검색어나 필터를 변경해보세요.</p>
            </div>
          ) : (
            filteredItems.slice(0, displayLimit).map((item) => {
              const isBookmarked = bookmarks.includes(item.id);

              return (
                <div
                  key={item.id}
                  className="bg-slate-850/80 hover:bg-slate-800/90 border border-slate-750 rounded-xl p-3.5 sm:p-4 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-indigo-300 text-base">
                        {item.word}
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                        총정리 {item.round}탄 #{item.id}
                      </span>
                      <span className="text-[10px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-800/50">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-slate-200 font-medium">{item.meaning}</p>

                    <div className="pt-1 text-slate-400 text-xs">
                      <p className="text-slate-300 italic">{item.ex_en}</p>
                      <p className="text-slate-500 mt-0.5">{item.ex_ko}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => playEnglishTTS(item.word)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                      title="단어 발음 듣기"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onToggleBookmark(item.id)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                      title="북마크 토글"
                    >
                      <Star
                        className={`w-4 h-4 transition ${
                          isBookmarked ? 'fill-amber-400 text-amber-400' : 'text-slate-500'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {filteredItems.length > displayLimit && (
            <div className="text-center pt-3">
              <button
                onClick={() => setDisplayLimit(prev => prev + 50)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-700 transition"
              >
                더 보기 (+50개) - 총 {filteredItems.length - displayLimit}개 남음
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
