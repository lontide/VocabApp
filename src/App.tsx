import React, { useState, useEffect, useMemo, useCallback } from 'react';
import wordlistDataRaw from './data/wordlist.json';
import { WordlistData, WordItem, QuizMode, StudyStyle } from './types/vocab';
import { shuffleArray } from './utils/quiz';
import { 
  loadSelectedRounds, 
  saveSelectedRounds, 
  loadQuizMode, 
  saveQuizMode, 
  loadStudyStyle, 
  saveStudyStyle, 
  loadBookmarks, 
  saveBookmarks 
} from './utils/storage';

import { Header } from './components/Header';
import { ModeTabs } from './components/ModeTabs';
import { FlashcardView } from './components/FlashcardView';
import { QuizView } from './components/QuizView';
import { ResultView } from './components/ResultView';
import { RoundSelectorModal } from './components/RoundSelectorModal';
import { WordListModal } from './components/WordListModal';
import { MobileConnectModal } from './components/MobileConnectModal';

const data = wordlistDataRaw as WordlistData;

export const App: React.FC = () => {
  // Saved user preferences
  const [selectedRounds, setSelectedRounds] = useState<number[]>(() => loadSelectedRounds([1]));
  const [currentMode, setCurrentMode] = useState<QuizMode>(() => loadQuizMode('word_to_meaning'));
  const [studyStyle, setStudyStyle] = useState<StudyStyle>(() => loadStudyStyle('flashcard'));
  const [bookmarks, setBookmarks] = useState<number[]>(() => loadBookmarks());

  // Modals
  const [isRoundModalOpen, setIsRoundModalOpen] = useState(false);
  const [isWordListModalOpen, setIsWordListModalOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  // Deck & Learning State
  const [deck, setDeck] = useState<WordItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Progress & Scores
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [wrongItemIds, setWrongItemIds] = useState<number[]>([]);

  // Filter all items that belong to the selected rounds
  const selectedPool = useMemo(() => {
    return data.items.filter(item => selectedRounds.includes(item.round));
  }, [selectedRounds]);

  // Initialize or re-shuffle deck when selected rounds change
  const initializeDeck = useCallback((pool: WordItem[]) => {
    if (pool.length === 0) return;
    const shuffled = shuffleArray(pool);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsCompleted(false);
    setScore(0);
    setStreak(0);
    setWrongItemIds([]);
  }, []);

  // When selectedRounds changes, update deck
  useEffect(() => {
    saveSelectedRounds(selectedRounds);
    initializeDeck(selectedPool);
  }, [selectedRounds, initializeDeck, selectedPool]);

  // Mode change handler
  const handleSelectMode = (newMode: QuizMode) => {
    setCurrentMode(newMode);
    saveQuizMode(newMode);
  };

  // Study style change handler
  const handleSelectStudyStyle = (newStyle: StudyStyle) => {
    setStudyStyle(newStyle);
    saveStudyStyle(newStyle);
  };

  // Shuffle button handler
  const handleShuffle = () => {
    initializeDeck(selectedPool);
  };

  // Round selection apply handler
  const handleApplyRounds = (newRounds: number[]) => {
    setSelectedRounds(newRounds);
  };

  // Toggle bookmark handler
  const handleToggleBookmark = (id: number) => {
    setBookmarks(prev => {
      const next = prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id];
      saveBookmarks(next);
      return next;
    });
  };

  // Flashcard Next handler
  const handleFlashcardNext = (isMastered: boolean) => {
    const currentItem = deck[currentIndex];
    if (currentItem) {
      if (isMastered) {
        setScore(prev => prev + 1);
        setWrongItemIds(prev => prev.filter(id => id !== currentItem.id));
      } else {
        setWrongItemIds(prev => Array.from(new Set([...prev, currentItem.id])));
      }
    }

    if (currentIndex + 1 < deck.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  // Flashcard Prev handler
  const handleFlashcardPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Quiz answer submitted handler
  const handleQuizAnswerSubmitted = (isCorrect: boolean) => {
    const currentItem = deck[currentIndex];
    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
      if (currentItem) {
        setWrongItemIds(prev => Array.from(new Set([...prev, currentItem.id])));
      }
    }
  };

  // Quiz next question handler
  const handleQuizNextQuestion = () => {
    if (currentIndex + 1 < deck.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  // Retry all items
  const handleRetryAll = () => {
    initializeDeck(selectedPool);
  };

  // Retry wrong items only
  const handleRetryWrongOnly = () => {
    const wrongItems = data.items.filter(i => wrongItemIds.includes(i.id));
    if (wrongItems.length > 0) {
      initializeDeck(wrongItems);
    }
  };

  const currentItem = deck[currentIndex];
  const wrongItemsList = useMemo(() => {
    return data.items.filter(i => wrongItemIds.includes(i.id));
  }, [wrongItemIds]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white pb-12">
      {/* Top Header */}
      <Header
        selectedRounds={selectedRounds}
        roundsInfo={data.rounds}
        totalDeckCount={selectedPool.length}
        onOpenRoundSelector={() => setIsRoundModalOpen(true)}
        onOpenWordList={() => setIsWordListModalOpen(true)}
        onOpenMobileConnect={() => setIsMobileModalOpen(true)}
        onShuffle={handleShuffle}
        bookmarkCount={bookmarks.length}
      />

      {/* Mode & Style Selection Tabs */}
      <ModeTabs
        currentMode={currentMode}
        onSelectMode={handleSelectMode}
        studyStyle={studyStyle}
        onSelectStudyStyle={handleSelectStudyStyle}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center py-4">
        {deck.length === 0 ? (
          <div className="text-center py-16 px-4">
            <p className="text-slate-400">선택된 탄에 단어가 없습니다.</p>
            <button
              onClick={() => setIsRoundModalOpen(true)}
              className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold"
            >
              탄 선택하기
            </button>
          </div>
        ) : isCompleted ? (
          <ResultView
            totalCount={deck.length}
            correctCount={score}
            wrongItems={wrongItemsList}
            onRetryAll={handleRetryAll}
            onRetryWrongOnly={handleRetryWrongOnly}
            onOpenRoundSelector={() => setIsRoundModalOpen(true)}
          />
        ) : currentItem ? (
          studyStyle === 'flashcard' ? (
            <FlashcardView
              key={`flashcard-${currentItem.id}-${currentMode}`}
              item={currentItem}
              currentIndex={currentIndex}
              totalCount={deck.length}
              mode={currentMode}
              isBookmarked={bookmarks.includes(currentItem.id)}
              onToggleBookmark={handleToggleBookmark}
              onNext={handleFlashcardNext}
              onPrev={handleFlashcardPrev}
              canPrev={currentIndex > 0}
            />
          ) : (
            <QuizView
              key={`quiz-${currentItem.id}-${currentMode}`}
              item={currentItem}
              pool={selectedPool.length >= 4 ? selectedPool : data.items}
              currentIndex={currentIndex}
              totalCount={deck.length}
              mode={currentMode}
              streak={streak}
              score={score}
              isBookmarked={bookmarks.includes(currentItem.id)}
              onToggleBookmark={handleToggleBookmark}
              onAnswerSubmitted={handleQuizAnswerSubmitted}
              onNextQuestion={handleQuizNextQuestion}
            />
          )
        ) : null}
      </main>

      {/* Round Selector Modal */}
      <RoundSelectorModal
        isOpen={isRoundModalOpen}
        onClose={() => setIsRoundModalOpen(false)}
        roundsInfo={data.rounds}
        selectedRounds={selectedRounds}
        onApplyRounds={handleApplyRounds}
      />

      {/* Word List & Search Modal */}
      <WordListModal
        isOpen={isWordListModalOpen}
        onClose={() => setIsWordListModalOpen(false)}
        allItems={data.items}
        selectedRounds={selectedRounds}
        bookmarks={bookmarks}
        onToggleBookmark={handleToggleBookmark}
      />

      {/* Mobile QR Connect Modal */}
      <MobileConnectModal
        isOpen={isMobileModalOpen}
        onClose={() => setIsMobileModalOpen(false)}
      />
    </div>
  );
};

export default App;
