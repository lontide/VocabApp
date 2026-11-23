import { chromium } from "playwright";
import assert from 'node:assert/strict';
const browser = await chromium.launch({channel:process.env.BROWSER_CHANNEL || 'chromium',headless:true});
try {
 for (const width of [320,390,1280]) {
  const page = await browser.newPage({viewport:{width,height:844},hasTouch:width<1280,isMobile:width<1280});
  await page.goto(process.env.TEST_URL || 'http://localhost:5173');
  const next = () => page.getByRole('button',{name:'다음 카드',exact:true});
  const record = () => page.evaluate(()=>localStorage.getItem('vocab_app_mastery'));
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const before = await record();
  await next().click();
  assert.match(await page.locator('main').innerText(),/2 \/ 50/);
  assert.equal(await record(),before);
  await page.getByRole('button',{name:'답안 공개',exact:true}).click();
  await page.getByRole('button',{name:'이전 카드',exact:true}).click();
  await next().click();
  assert.equal(await page.getByRole('button',{name:'답안 공개',exact:true}).count(),1);
  await page.getByRole('button',{name:'답안 공개',exact:true}).click();
  await next().click();
  assert.equal(await record(),before);
  assert.equal(await page.getByRole('button',{name:'답안 공개',exact:true}).count(),1);
  await page.getByRole('button',{name:'이전 카드',exact:true}).click();
  await page.getByRole('button',{name:'외웠어요',exact:true}).click();
  const saved = await record();
  assert.equal(Object.keys(JSON.parse(saved).entries).length,1);
  await page.screenshot({path:'/tmp/vocab-navigation-'+width+'.png',fullPage:true});
  await page.getByRole('button',{name:'이전 카드',exact:true}).click();
  await page.getByRole('button',{name:'이전 카드',exact:true}).focus();
  await page.keyboard.press('Tab');
  assert.equal(await next().evaluate(el=>el===document.activeElement),true);
  await page.keyboard.press('Enter');
  assert.equal(await record(),saved);
  for(let i=3;i<50;i++) await next().click();
  assert.equal(await page.getByRole('button',{name:'결과 보기',exact:true}).count(),1);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.getByRole('button',{name:'결과 보기',exact:true}).click();
  await page.getByRole('heading',{name:/학습 완료/}).waitFor();
  assert.equal(await record(),saved);
  assert.deepEqual(errors,[]);
  await page.close();
  console.log('PASS navigation at '+width+'px');
 }
} finally {await browser.close();}
