import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const data = JSON.parse(await readFile(new URL('../src/data/wordlist.json', import.meta.url)));
const browser = await chromium.launch({channel: 'chromium', headless: true});
try {
  for (const width of [320, 390, 1280]) {
    const page = await browser.newPage({viewport: {width, height: 844}});
    await page.goto(process.env.TEST_URL || 'http://127.0.0.1:5174');
    await page.getByTitle('학습할 탄(회차) 선택').click();
    await page.getByRole('button', {name: '전체 1~52탄', exact: true}).click();
    await page.getByText('2588개', {exact: true}).waitFor();
    await page.getByRole('button', {name: '적용하고 학습하기'}).click();
    await page.getByTitle('학습할 탄(회차) 선택').click();
    // Select just the newest round through persisted settings on a clean reload.
    await page.evaluate(() => localStorage.setItem('vocab_app_selected_rounds', '[52]'));
    await page.reload();
    await page.getByRole('button', {name: '어휘 리스트', exact: true}).click();
    const rows = page.getByRole('article');
    assert.equal(await rows.count(), data.rounds.find(r => r.round === 52).count);
    assert.ok((await rows.first().innerText()).includes(data.items.find(i => i.round === 52).word));
    await rows.first().getByRole('button', {name: '외웠어요', exact: true}).click();
    await page.reload();
    await rows.first().waitFor();
    assert.equal(await rows.first().getByRole('button', {name: '✓ 외웠어요', exact: true}).getAttribute('aria-pressed'), 'true');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.close();
  }
  console.log('PASS dataset browser: 52 rounds, actual counts, newest expressions and persistence at 320/390/1280px');
} finally { await browser.close(); }
