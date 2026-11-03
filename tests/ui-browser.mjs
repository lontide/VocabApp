import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge'});
try {
 for(const width of [320,390,1280]){
 const page=await browser.newPage({viewport:{width,height:844}}); const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.TEST_URL||'http://localhost:5173');
 await page.getByRole('button',{name:'어휘 리스트',exact:true}).click();
 const rows=page.getByRole('article');await rows.first().waitFor();
 await rows.first().getByRole('button',{name:'답안 공개',exact:true}).click();
 await rows.first().getByRole('button',{name:'답안 다시 가리기',exact:true}).click();
 assert.equal(await rows.first().getByRole('button',{name:'답안 공개',exact:true}).count(),1);
 await page.getByLabel('암기 상태').selectOption('unassessed');const count=await rows.count();
 await rows.first().getByRole('button',{name:'외웠어요',exact:true}).click();assert.equal(await rows.count(),count);
 await page.getByRole('button',{name:'결과 새로고침',exact:true}).click();assert.equal(await rows.count(),count-1);
 await page.getByLabel('목록 검색').fill('no-result-xyz');assert.equal(await rows.count(),0);
 await page.getByRole('button',{name:'검색 및 필터 초기화'}).click();assert.equal(await rows.count(),50);
 await rows.last().scrollIntoViewIfNeeded();
 const toolbar=await page.getByRole('region',{name:'목록 도구'}).boundingBox();assert.ok(toolbar.y>=0&&toolbar.y<250);
 await page.getByRole('button',{name:'맨 위로',exact:true}).click();
 await page.waitForFunction(()=>window.scrollY<10);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 const banner=await page.getByTestId('install-banner').evaluate(el=>getComputedStyle(el).position);assert.notEqual(banner,'fixed');
 assert.deepEqual(errors,[]);await page.close();console.log('PASS UI-01~05 at width '+width);
 }
}finally{await browser.close();}
