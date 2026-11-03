import { useState, useMemo } from "react";
import raw from "./data/wordlist.json";
import { WordlistData, WordItem, StudyStyle } from "./types/vocab";
import * as storage from "./utils/storage";
import {
  orderedItems,
  evaluate,
  statusKey,
  summary,
  Order,
} from "./utils/study";
import { Header } from "./components/Header";
import { ModeTabs } from "./components/ModeTabs";
import { StudyItem } from "./components/StudyItem";
import { RoundSelectorModal } from "./components/RoundSelectorModal";
import { WordListModal } from "./components/WordListModal";
import { MobileConnectModal } from "./components/MobileConnectModal";
import { InstallAppBanner } from "./components/InstallAppBanner";
import { ResultView } from "./components/ResultView";
const data = raw as WordlistData;
export default function App() {
  const [rounds, setRounds] = useState(() => storage.loadSelectedRounds());
  const [mode, setMode] = useState(() => storage.loadQuizMode());
  const [style, setStyle] = useState(() => storage.loadStudyStyle());
  const [order, setOrder] = useState<Order>(() => storage.loadOrder());
  const [records, setRecords] = useState(() => storage.loadRecords());
  const [bookmarks, setBookmarks] = useState(() => storage.loadBookmarks());
  const [modal, setModal] = useState("");
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [retry, setRetry] = useState<WordItem[] | null>(null);
  const [generation, setGeneration] = useState(0);
  const pool = useMemo(
    () => orderedItems(data.items, rounds, order),
    [rounds, order],
  );
  const deck = retry || pool;
  const stats = summary(deck, mode, records);
  const item = deck[index];
  function bookmark(id: number) {
    const next = bookmarks.includes(id)
      ? bookmarks.filter((i) => i !== id)
      : [...bookmarks, id];
    setBookmarks(next);
    storage.saveBookmarks(next);
  }
  function mark(id: number, status: "mastered" | "confused") {
    setRecords((prev) => {
      const next = evaluate(prev, id, mode, status);
      storage.saveRecords(next);
      return next;
    });
  }
  function view(next: StudyStyle) {
    setStyle(next);
    storage.saveStudyStyle(next);
    setGeneration((g) => g + 1);
  }
  function restart(items: WordItem[] | null) {
    setRetry(items);
    setIndex(0);
    setDone(false);
    setGeneration((g) => g + 1);
  }
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-36">
      <Header
        selectedRounds={rounds}
        roundsInfo={data.rounds}
        totalDeckCount={pool.length}
        onOpenRoundSelector={() => setModal("rounds")}
        onOpenWordList={() => setModal("search")}
        onOpenMobileConnect={() => setModal("mobile")}
        bookmarkCount={bookmarks.length}
      />
      <ModeTabs
        currentMode={mode}
        onSelectMode={(m) => {
          setMode(m);
          storage.saveQuizMode(m);
          setGeneration((g) => g + 1);
        }}
        studyStyle={style}
        onSelectStudyStyle={view}
      />
      <div className="max-w-4xl mx-auto p-3">
        <label className="flex items-center gap-3">
          학습 순서{" "}
          <select
            aria-label="학습 순서"
            className="bg-slate-800 rounded-xl p-3"
            value={order}
            onChange={(e) => {
              const next = e.target.value as Order;
              setOrder(next);
              storage.saveOrder(next);
              restart(null);
            }}
          >
            <option value="original">원본 순서</option>
            <option value="shuffle">섞기</option>
          </select>
        </label>
      </div>
      <main className="max-w-4xl mx-auto p-3 space-y-3">
        {style === "list" ? (
          <section aria-label="어휘 리스트" className="space-y-3">
            <div className="flex items-center justify-between">
              <h1 className="font-bold">
                선택한 총정리 {rounds.join(", ")}탄 · {pool.length}개
              </h1>
              <button
                className="p-3 bg-indigo-600 rounded-xl"
                onClick={() => view("flashcard")}
              >
                카드로 돌아가기
              </button>
            </div>
            {pool.map((i) => (
              <StudyItem
                key={generation + ":" + i.id + ":" + mode}
                item={i}
                mode={mode}
                status={records[statusKey(i.id, mode)]}
                onEvaluate={(s) => mark(i.id, s)}
                bookmarked={bookmarks.includes(i.id)}
                onBookmark={() => bookmark(i.id)}
              />
            ))}
          </section>
        ) : done ? (
          <ResultView
            totalCount={deck.length}
            correctCount={stats.mastered}
            wrongItems={stats.wrong}
            onRetryAll={() => restart(null)}
            onRetryWrongOnly={() => restart(stats.wrong)}
            onOpenRoundSelector={() => setModal("rounds")}
          />
        ) : item ? (
          <>
            <p>
              {index + 1} / {deck.length} · 외웠어요 {stats.mastered}개
            </p>
            <StudyItem
              key={generation + ":" + item.id + ":" + mode}
              item={item}
              mode={mode}
              status={records[statusKey(item.id, mode)]}
              onEvaluate={(s) => {
                mark(item.id, s);
                if (index + 1 < deck.length) setIndex((i) => i + 1);
                else setDone(true);
              }}
              bookmarked={bookmarks.includes(item.id)}
              onBookmark={() => bookmark(item.id)}
            />
            <button
              className="p-3 rounded-xl bg-slate-800 disabled:opacity-30"
              disabled={index === 0}
              onClick={() => setIndex((i) => i - 1)}
            >
              이전 카드
            </button>
          </>
        ) : (
          <p>선택된 탄에 단어가 없습니다.</p>
        )}
      </main>
      <RoundSelectorModal
        key={modal === "rounds" ? "open" : "closed"}
        isOpen={modal === "rounds"}
        onClose={() => setModal("")}
        roundsInfo={data.rounds}
        selectedRounds={rounds}
        onApplyRounds={(next) => {
          setRounds(next);
          storage.saveSelectedRounds(next);
          restart(null);
        }}
      />
      <WordListModal
        isOpen={modal === "search"}
        onClose={() => setModal("")}
        allItems={data.items}
        selectedRounds={rounds}
        bookmarks={bookmarks}
        onToggleBookmark={bookmark}
      />
      <MobileConnectModal
        isOpen={modal === "mobile"}
        onClose={() => setModal("")}
      />
      <InstallAppBanner />
    </div>
  );
}
