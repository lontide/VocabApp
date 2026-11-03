import test from 'node:test';
import assert from 'node:assert/strict';
import { loadUtility } from './load-utility.mjs';
const storage = await loadUtility('storage');

test('preferences and bookmarks: defaults, round trips, corrupt JSON and denied storage', () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const originalError = console.error;
  const errors = [];
  const values = new Map();
  try {
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
      getItem: key => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
    } });
    assert.deepEqual(storage.loadSelectedRounds(), [1]);
    assert.equal(storage.loadQuizMode(), 'word_to_meaning');
    assert.equal(storage.loadStudyStyle(), 'flashcard');
    assert.deepEqual(storage.loadBookmarks(), []);
    storage.saveSelectedRounds([2, 5]);
    storage.saveQuizMode('korean_to_sentence');
    storage.saveStudyStyle('quiz');
    storage.saveBookmarks([10, 20]);
    assert.deepEqual(storage.loadSelectedRounds(), [2, 5]);
    assert.equal(storage.loadQuizMode(), 'korean_to_sentence');
    assert.equal(storage.loadStudyStyle(), 'quiz');
    assert.deepEqual(storage.loadBookmarks(), [10, 20]);
    assert.equal(values.get('vocab_app_bookmarks'), '[10,20]');
    console.error = (...args) => errors.push(args);
    for (const key of values.keys()) values.set(key, '{broken');
    assert.deepEqual(storage.loadSelectedRounds([3]), [3]);
    assert.deepEqual(storage.loadBookmarks(), []);
    assert.equal(storage.loadQuizMode(), 'word_to_meaning');
    assert.equal(storage.loadStudyStyle(), 'flashcard');
    values.set('vocab_app_selected_rounds', '[]');
    assert.deepEqual(storage.loadSelectedRounds(), [1]);
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('denied'); } });
    assert.deepEqual(storage.loadSelectedRounds(), [1]);
    assert.equal(storage.loadQuizMode(), 'word_to_meaning');
    assert.equal(storage.loadStudyStyle(), 'flashcard');
    assert.deepEqual(storage.loadBookmarks(), []);
    assert.doesNotThrow(() => {
      storage.saveSelectedRounds([1]); storage.saveQuizMode('meaning_to_word');
      storage.saveStudyStyle('quiz'); storage.saveBookmarks([1]);
    });
    assert.equal(errors.length, 10);
  } finally {
    console.error = originalError;
    if (previous) Object.defineProperty(globalThis, 'localStorage', previous);
    else delete globalThis.localStorage;
  }
});
