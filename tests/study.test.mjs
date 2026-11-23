import test from "node:test";
import assert from "node:assert/strict";
import { loadUtility } from "./load-utility.mjs";
const study = await loadUtility("study");
const storage = await loadUtility("storage");
const mode = "word_to_meaning";
const items = [
  { id: 9, round: 1 },
  { id: 2, round: 1 },
  { id: 3, round: 2 },
];
test("TC-06: latest evaluation is idempotent and independent per item/mode", () => {
  let records = study.evaluate({}, 9, mode, "mastered");
  assert.deepEqual(study.evaluate(records, 9, mode, "mastered"), records);
  records = study.evaluate(records, 9, "meaning_to_word", "confused");
  assert.equal(records["9:" + mode], "mastered");
  assert.equal(records["9:meaning_to_word"], "confused");
  assert.equal(records["2:" + mode], undefined);
  records = study.evaluate(records, 9, mode, "confused");
  assert.equal(records["9:" + mode], "confused");
});
test("TC-11: original order preserves source rows rather than ID or round selection order", () => {
  assert.deepEqual(study.orderedItems(items, [2, 1], "original"), items);
  assert.deepEqual(
    study.orderedItems(items, [1], "original"),
    items.slice(0, 2),
  );
  const before = structuredClone(items);
  study.orderedItems(items, [1, 2], "shuffle");
  assert.deepEqual(items, before);
});
test("TC-12: deterministic shuffle preserves membership without mutation", () => {
  const before = structuredClone(items);
  assert.deepEqual(
    study.shuffleArray(items, () => 0),
    [items[1], items[2], items[0]],
  );
  assert.deepEqual(items, before);
  assert.deepEqual(
    study.shuffleArray([], () => 0),
    [],
  );
  assert.deepEqual(
    study.shuffleArray([items[0]], () => 0),
    [items[0]],
  );
});
test("TC-15: summaries count latest status only, exclude unassessed, and respect scope/mode", () => {
  let records = study.evaluate({}, 9, mode, "mastered");
  records = study.evaluate(records, 2, mode, "confused");
  assert.deepEqual(study.summary(items, mode, records), {
    mastered: 1,
    wrong: [items[1]],
    percentage: 33,
  });
  assert.equal(study.summary(items, "meaning_to_word", records).mastered, 0);
  assert.equal(study.summary([], mode, records).percentage, 0);
  records = study.evaluate(records, 9, mode, "confused");
  assert.equal(study.summary(items, mode, records).mastered, 0);
  assert.equal(study.summary(items.slice(2), mode, records).wrong.length, 0);
});
test("TC-09/TC-10/TC-14: versioned persistence, corrupt schemas, denied storage and quiz migration", () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const values = new Map();
  try {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: (k) => values.get(k) ?? null,
        setItem: (k, v) => values.set(k, v),
      },
    });
    assert.equal(storage.loadOrder(), "original");
    storage.saveOrder("shuffle");
    assert.equal(storage.loadOrder(), "shuffle");
    const records = { "9:word_to_meaning": "mastered" };
    storage.saveRecords(records);
    assert.deepEqual(storage.loadRecords(), records);
    values.set("vocab_app_study_style", "quiz");
    assert.equal(storage.loadStudyStyle(), "flashcard");
    for (const value of [
      "{broken",
      "null",
      "[]",
      "{}",
      JSON.stringify({ version: 2, entries: records }),
    ]) {
      values.set("vocab_app_mastery", value);
      assert.deepEqual(storage.loadRecords(), {});
    }
    values.set(
      "vocab_app_mastery",
      JSON.stringify({
        version: 1,
        entries: {
          ...records,
          "0:word_to_meaning": "mastered",
          "999999:word_to_meaning": "mastered",
          "2:invalid": "mastered",
          "3:meaning_to_word": "invalid",
        },
      }),
    );
    assert.deepEqual(storage.loadRecords(), records);
    values.set("vocab_app_bookmarks", "null");
    assert.deepEqual(storage.loadBookmarks(), []);
    values.set("vocab_app_selected_rounds", '[0,1,1,53,"2"]');
    assert.deepEqual(storage.loadSelectedRounds(), [1]);
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      get() {
        throw Error("denied");
      },
    });
    assert.deepEqual(storage.loadRecords(), {});
    assert.equal(storage.loadOrder(), "original");
    assert.doesNotThrow(() => {
      storage.saveOrder("shuffle");
      storage.saveRecords(records);
    });
  } finally {
    if (previous) Object.defineProperty(globalThis, "localStorage", previous);
    else delete globalThis.localStorage;
  }
});
