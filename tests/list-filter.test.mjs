import test from 'node:test';
import assert from 'node:assert/strict';
import {loadUtility} from './load-utility.mjs';
const {filterList}=await loadUtility('study');
const items=[{id:1,word:'Come Up',meaning:'생각하다'},{id:2,word:'Other',meaning:'다른'},{id:3,word:'Test',meaning:'검사'}];
const records={'1:word_to_meaning':'mastered','2:word_to_meaning':'confused'};
test('UI-03: search matches trimmed case-insensitive prompt or answer and intersects status',()=>{
 assert.deepEqual(filterList(items,'word_to_meaning',records,' COME ','all'),[items[0]]);
 assert.deepEqual(filterList(items,'word_to_meaning',records,'생각','mastered'),[items[0]]);
 assert.deepEqual(filterList(items,'word_to_meaning',records,'생각','confused'),[]);
 assert.deepEqual(filterList(items,'word_to_meaning',records,'','unassessed'),[items[2]]);
 assert.deepEqual(filterList(items,'word_to_meaning',records,'','confused'),[items[1]]);
 assert.deepEqual(filterList(items,'meaning_to_word',records,'','unassessed'),items);
 assert.deepEqual(filterList([],'word_to_meaning',records,'','all'),[]);
});
