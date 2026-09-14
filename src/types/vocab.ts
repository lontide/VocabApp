export interface WordItem {
  id: number;
  round: number;
  category: string;
  word: string;
  meaning: string;
  ex_en: string;
  ex_ko: string;
  link?: string;
}

export interface RoundInfo {
  round: number;
  title: string;
  count: number;
  categories: string[];
  itemIds: number[];
}

export interface WordlistData {
  totalCount: number;
  rounds: RoundInfo[];
  items: WordItem[];
}

export type QuizMode = 
  | 'word_to_meaning'     // 단어를 보여주고 뜻 맞히기
  | 'meaning_to_word'     // 뜻을 보여주고 단어 맞히기
  | 'sentence_to_meaning' // 예제 문장을 보여주고 뜻 맞히기
  | 'korean_to_sentence'; // 한국어 문장을 보여주고 예제 영어 문장 맞히기

export type StudyStyle = 'flashcard' | 'quiz';

export interface QuizOption {
  id: number;
  text: string;
  isCorrect: boolean;
  item: WordItem;
}

export interface QuizQuestion {
  item: WordItem;
  questionText: string;
  promptType: string;
  answerType: string;
  correctAnswerText: string;
  options: QuizOption[];
  ttsText?: string;
}
