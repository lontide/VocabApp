import { WordItem, QuizMode } from "../types/vocab";
export type Status = "mastered" | "confused";
export type Records = Record<string, Status>;
export type Order = "original" | "shuffle";
export function studyText(item: WordItem, mode: QuizMode) {
  const fields = {
    word_to_meaning: [item.word, item.meaning, item.word],
    meaning_to_word: [item.meaning, item.word, item.word],
    sentence_to_meaning: [item.ex_en, item.meaning, item.ex_en],
    korean_to_sentence: [item.ex_ko, item.ex_en, item.ex_en],
  }[mode];
  return {
    questionText: fields[0],
    correctAnswerText: fields[1],
    ttsText: fields[2],
  };
}
export function shuffleArray<T>(items: T[], random = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
export function orderedItems(
  items: WordItem[],
  rounds: number[],
  order: Order,
) {
  const pool = items.filter((i) => rounds.includes(i.round));
  return order === "shuffle" ? shuffleArray(pool) : pool;
}
export function statusKey(id: number, mode: QuizMode) {
  return id + ":" + mode;
}
export function evaluate(
  records: Records,
  id: number,
  mode: QuizMode,
  status: Status,
): Records {
  return { ...records, [statusKey(id, mode)]: status };
}
export function summary(items: WordItem[], mode: QuizMode, records: Records) {
  const mastered = items.filter(
    (i) => records[statusKey(i.id, mode)] === "mastered",
  ).length;
  const wrong = items.filter(
    (i) => records[statusKey(i.id, mode)] === "confused",
  );
  return {
    mastered,
    wrong,
    percentage: items.length ? Math.round((mastered / items.length) * 100) : 0,
  };
}
