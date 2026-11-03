import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge'});
try {for(const width of [320,390,1280]){
 const page=await browser.newPage({viewport:{width,height:844}});await page.goto(process.env.TEST_URL||'http://localhost:5173');
 const group=page.getByRole('group',{name:'학습 순서',exact:true});
 const original=group.getByRole('button',{name:'원본 순서',exact:true});const shuffle=group.getByRole('button',{name:'섞기',exact:true});
 assert.equal(await original.getAttribute('aria-pressed'),'true');assert.equal(await shuffle.getAttribute('aria-pressed'),'false');
 for(const button of [original,shuffle]){const box=await button.boundingBox();assert.ok(box.height>=48);}
 await page.getByRole('button',{name:'어휘 리스트',exact:true}).click();const rows=page.getByRole('article');const before=await rows.locator('p').allTextContents();
 await shuffle.click();assert.equal(await shuffle.getAttribute('aria-pressed'),'true');
 const shuffled=await rows.locator('p').allTextContents();await rows.first().getByRole('button',{name:'답안 공개',exact:true}).click();await shuffle.click();
 assert.deepEqual(await rows.locator('p').allTextContents(),shuffled);assert.equal(await rows.first().getByRole('button',{name:'답안 다시 가리기',exact:true}).count(),1);
 await page.reload();assert.equal(await shuffle.getAttribute('aria-pressed'),'true');await original.click();assert.deepEqual(await rows.locator('p').allTextContents(),before);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await original.focus();await page.keyboard.press('Tab');assert.equal(await shuffle.evaluate(el=>el===document.activeElement),true);await page.keyboard.press('Enter');assert.equal(await shuffle.getAttribute('aria-pressed'),'true');
 await page.close();console.log('PASS UI-06 '+width);
}}finally{await browser.close();}
