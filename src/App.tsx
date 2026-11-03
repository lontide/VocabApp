import { useState, useMemo, useEffect } from "react";
import raw from "./data/wordlist.json";
import { WordlistData, WordItem, StudyStyle } from "./types/vocab";
import * as storage from "./utils/storage";
import {
  orderedItems,
  evaluate,
  statusKey,
  summary,
  Order,
  filterList,
  ListFilter,
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
  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const observer = new ResizeObserver(() =>
      document.documentElement.style.setProperty(
        "--header-height",
        header.getBoundingClientRect().height + "px",
      ),
    );
    observer.observe(header);
    return () => observer.disconnect();
  }, []);
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
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ListFilter>("all");
  const [snapshot, setSnapshot] = useState(records);
  function resetFilters() {
    setQuery("");
    setFilter("all");
    setSnapshot(records);
  }
  const [generation, setGeneration] = useState(0);
  const pool = useMemo(
    () => orderedItems(data.items, rounds, order),
    [rounds, order],
  );
  const visible = filterList(pool, mode, snapshot, query, filter);
  const listStats = summary(pool, mode, records);
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
    resetFilters();
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
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-6">
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
          resetFilters();
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
            <div
              role="region"
              aria-label="목록 도구"
              className="sticky top-[var(--header-height)] z-20 bg-slate-900/95 backdrop-blur border border-slate-700 rounded-xl p-3 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <h1 className="font-bold text-sm">
                  어휘 리스트 · {visible.length}/{pool.length}개
                </h1>
                <button
                  className="p-3 bg-indigo-600 rounded-xl text-sm"
                  onClick={() => view("flashcard")}
                >
                  카드로 돌아가기
                </button>
              </div>
              <p className="text-xs text-slate-300" aria-live="polite">
                외웠어요 {listStats.mastered} · 헷갈려요{" "}
                {listStats.wrong.length} · 미평가{" "}
                {pool.length - listStats.mastered - listStats.wrong.length}
              </p>
              <div className="flex gap-2">
                <input
                  aria-label="목록 검색"
                  placeholder="질문이나 답안 검색"
                  className="min-w-0 flex-1 bg-slate-800 border border-slate-600 rounded-lg p-3 text-sm"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSnapshot(records);
                  }}
                />
                <select
                  aria-label="암기 상태"
                  className="bg-slate-800 rounded-lg p-2 text-sm"
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value as ListFilter);
                    setSnapshot(records);
                  }}
                >
                  <option value="all">전체</option>
                  <option value="unassessed">미평가</option>
                  <option value="confused">헷갈려요</option>
                  <option value="mastered">외웠어요</option>
                </select>
              </div>
              <div className="flex justify-between text-xs">
                <button
                  className="min-h-11 px-2"
                  onClick={() => setSnapshot(records)}
                >
                  결과 새로고침
                </button>
                <button
                  className="min-h-11 px-2"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "instant" })
                  }
                >
                  맨 위로
                </button>
              </div>
            </div>
            {visible.length === 0 && (
              <div className="text-center p-6 space-y-3">
                <p>일치하는 어휘가 없습니다.</p>
                <button
                  className="p-3 bg-indigo-600 rounded-xl"
                  onClick={resetFilters}
                >
                  검색 및 필터 초기화
                </button>
              </div>
            )}
            {visible.map((i) => (
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
          resetFilters();
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
