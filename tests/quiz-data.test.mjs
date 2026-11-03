import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadUtility } from './load-utility.mjs';

const data = JSON.parse(await readFile(new URL('../src/data/wordlist.json', import.meta.url), 'utf8'));
const quiz = await loadUtility('quiz');

test('dataset has 2,500 unique items and consistent round references', () => {
  assert.equal(data.totalCount, 2500);
  assert.equal(data.items.length, data.totalCount);
  assert.equal(data.rounds.length, 50);
  assert.equal(new Set(data.items.map(i => i.id)).size, data.items.length);
  assert.deepEqual(data.rounds.map(r => r.round), Array.from({ length: 50 }, (_, i) => i + 1));
  for (const item of data.items) {
    assert.ok(Number.isInteger(item.id));
    assert.ok(data.rounds.some(r => r.round === item.round));
    for (const key of ['word', 'meaning', 'ex_en', 'ex_ko']) {
      assert.equal(typeof item[key], 'string');
      assert.ok(item[key].trim(), `${item.id}: ${key}`);
    }
  }
  for (const round of data.rounds) {
    const items = data.items.filter(i => i.round === round.round);
    assert.equal(round.count, items.length);
    assert.deepEqual(round.itemIds, items.map(i => i.id));
    assert.deepEqual([...round.categories].sort(), [...new Set(items.map(i => i.category).filter(Boolean))].sort());
  }
});

test('shuffle preserves input and membership, including empty and singleton arrays', () => {
  for (const input of [[], [1], [1, 2, 3, 4]]) {
    const before = [...input];
    const output = quiz.shuffleArray(input);
    assert.notEqual(output, input);
    assert.deepEqual(input, before);
    assert.deepEqual([...output].sort(), [...input].sort());
  }
});

const modes = {
  word_to_meaning: ['word', 'meaning', 'word'],
  meaning_to_word: ['meaning', 'word', 'word'],
  sentence_to_meaning: ['ex_en', 'meaning', 'ex_en'],
  korean_to_sentence: ['ex_ko', 'ex_en', 'ex_en'],
};
for (const [mode, [prompt, answer, tts]] of Object.entries(modes)) {
  test(`${mode}: all dataset items map to the correct question and answer`, () => {
    for (const item of data.items) {
      const q = quiz.generateQuizQuestion(item, mode, data.items.slice(0, 8));
      assert.equal(q.questionText, item[prompt]);
      assert.equal(q.correctAnswerText, item[answer]);
      assert.equal(q.ttsText, item[tts]);
      assert.equal(quiz.getAnswerText(item, mode), item[answer]);
      assert.equal(q.options.length, 4);
      assert.equal(q.options.filter(o => o.isCorrect).length, 1);
      assert.equal(q.options.find(o => o.isCorrect).id, item.id);
      assert.equal(q.options.find(o => o.isCorrect).text, item[answer]);
      assert.ok(q.options.filter(o => !o.isCorrect).every(o => o.id !== item.id && o.text !== item[answer]));
      assert.equal(new Set(q.options.map(o => o.id)).size, q.options.length);
    }
  });
}

test('small pool and equal-answer distractors follow current behavior', () => {
  const item = data.items[0];
  const duplicate = { ...item, id: -1 };
  assert.equal(quiz.generateQuizQuestion(item, 'word_to_meaning', [item, duplicate]).options.length, 1);
  const other = { ...item, id: -2, meaning: 'other' };
  const q = quiz.generateQuizQuestion(item, 'word_to_meaning', [item, other, { ...other, id: -3 }]);
  assert.equal(q.options.length, 3);
  assert.equal(q.options.filter(o => o.text === 'other').length, 2);
});
