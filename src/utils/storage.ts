import { QuizMode, StudyStyle } from '../types/vocab';

const STORAGE_KEYS = {
  ROUNDS: 'vocab_app_selected_rounds',
  MODE: 'vocab_app_quiz_mode',
  STYLE: 'vocab_app_study_style',
  BOOKMARKS: 'vocab_app_bookmarks',
  WRONG_ITEMS: 'vocab_app_wrong_items',
};

export function loadSelectedRounds(defaultRounds: number[] = [1]): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ROUNDS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load selected rounds from storage', e);
  }
  return defaultRounds;
}

export function saveSelectedRounds(rounds: number[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ROUNDS, JSON.stringify(rounds));
  } catch (e) {
    console.error('Failed to save selected rounds', e);
  }
}

export function loadQuizMode(defaultMode: QuizMode = 'word_to_meaning'): QuizMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MODE);
    if (raw && ['word_to_meaning', 'meaning_to_word', 'sentence_to_meaning', 'korean_to_sentence'].includes(raw)) {
      return raw as QuizMode;
    }
  } catch (e) {
    console.error('Failed to load quiz mode', e);
  }
  return defaultMode;
}

export function saveQuizMode(mode: QuizMode): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MODE, mode);
  } catch (e) {
    console.error('Failed to save quiz mode', e);
  }
}

export function loadStudyStyle(defaultStyle: StudyStyle = 'flashcard'): StudyStyle {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STYLE);
    if (raw && ['flashcard', 'quiz'].includes(raw)) {
      return raw as StudyStyle;
    }
  } catch (e) {
    console.error('Failed to load study style', e);
  }
  return defaultStyle;
}

export function saveStudyStyle(style: StudyStyle): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STYLE, style);
  } catch (e) {
    console.error('Failed to save study style', e);
  }
}

export function loadBookmarks(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load bookmarks', e);
  }
  return [];
}

export function saveBookmarks(bookmarks: number[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  } catch (e) {
    console.error('Failed to save bookmarks', e);
  }
}
