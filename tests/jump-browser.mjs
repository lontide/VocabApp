import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser = await chromium.launch({channel:process.env.BROWSER_CHANNEL || 'chromium'});
try {
  for (const width of [320,390,1280]) {
    const page = await browser.newPage({viewport:{width,height:844},hasTouch:width<1280,isMobile:width<1280});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(process.env.TEST_URL || 'http://localhost:5173');
    const input=()=>page.getByRole('combobox',{name:'카드 번호로 이동'});
    const jump=async n=>{await input().selectOption(String(n));};
    const position=async n=>assert.match(await page.locator('main > div > p').innerText(),new RegExp(`^${n} /`));
    const record=()=>page.evaluate(()=>localStorage.getItem('vocab_app_mastery'));
    await page.getByRole('button',{name:'외웠어요',exact:true}).click();
    const saved=await record();
    await page.getByRole('button',{name:'☆ 북마크',exact:true}).click();
    const bookmarks=await page.evaluate(()=>localStorage.getItem('vocab_app_bookmarks'));
    await jump(25);await position(25);
    await page.screenshot({path:`/tmp/vocab-jump-compact-${width}.png`,fullPage:true});
    await page.getByRole('button',{name:'답안 공개',exact:true}).click();
    await jump(25);
    assert.equal(await page.getByRole('button',{name:'답안 다시 가리기',exact:true}).count(),1);
    await jump(50);await position(50);
    assert.equal(await page.getByRole('button',{name:'답안 공개',exact:true}).count(),1);
    assert.equal(await input().locator('option').count(),50);
    await input().focus();
    await input().press('Home');await input().press('Enter');await position(1);
    assert.equal(await record(),saved);
    assert.equal(await page.evaluate(()=>localStorage.getItem('vocab_app_bookmarks')),bookmarks);
    await page.getByRole('button',{name:'섞기',exact:true}).click();
    await page.getByRole('button',{name:'어휘 리스트',exact:true}).click();
    const questions=await page.getByRole('article').locator('p').allTextContents();
    await page.getByRole('button',{name:'카드로 돌아가기',exact:true}).click();
    await jump(25);
    assert.equal(await page.getByRole('article').locator('p').innerText(),questions[24]);
    await page.getByRole('button',{name:'헷갈려요',exact:true}).click();
    await jump(50);await page.getByRole('button',{name:'결과 보기',exact:true}).click();
    await page.getByRole('button',{name:/헷갈린 단어.*만 다시 학습하기/}).click();
    await position(1);
    assert.equal(await input().locator('option').count(),1);
    await jump(1);await position(1);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    await page.screenshot({path:`/tmp/vocab-jump-${width}.png`,fullPage:true});
    assert.deepEqual(errors,[]);
    await page.close();
    console.log(`PASS card jump ${width}px`);
  }
} finally {await browser.close();}
