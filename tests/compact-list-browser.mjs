import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser = await chromium.launch({channel:process.env.BROWSER_CHANNEL || 'chromium'});
try {
  for (const width of [320,390,1280]) {
    const page = await browser.newPage({viewport:{width,height:844},hasTouch:width<1280,isMobile:width<1280});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(process.env.TEST_URL || 'http://localhost:5173');
    const cardHeight=(await page.getByRole('article').boundingBox()).height;
    await page.getByRole('button',{name:'어휘 리스트',exact:true}).click();
    const rows=page.getByRole('article');
    assert.equal(await rows.count(),50);
    const first=rows.first();
    const height=(await first.boundingBox()).height;
    assert.ok(height<=145 && height<cardHeight*0.65,`compact row ${height}px vs card ${cardHeight}px`);
    const confused=first.getByRole('button',{name:'헷갈려요',exact:true});
    const mastered=first.getByRole('button',{name:'외웠어요',exact:true});
    for(const [button,symbol] of [[confused,'?'],[mastered,'✓']]) {
      assert.equal(await button.innerText(),symbol);
      const box=await button.boundingBox();
      assert.ok(box.width>=44 && box.height>=44);
    }
    const bookmark = first.getByRole('button',{name:'☆ 북마크',exact:true});
    const boxes = await Promise.all([confused,mastered,bookmark].map(button=>button.boundingBox()));
    assert.ok(boxes.every(box=>Math.abs(box.y-boxes[0].y)<1));
    assert.ok(boxes[2].x>boxes[1].x+boxes[1].width);
    const question=await first.locator('p').boundingBox();
    const row=await first.boundingBox();
    assert.equal(question.x-row.x,16);
    const before=await first.boundingBox();
    await confused.click();
    assert.equal(await first.getByRole('button',{name:'✓ 헷갈려요',exact:true}).getAttribute('aria-pressed'),'true');
    assert.equal(await first.getByRole('button',{name:'답안 공개',exact:true}).count(),1);
    assert.equal((await first.boundingBox()).height,before.height);
    await mastered.click();
    assert.equal(await first.getByRole('button',{name:'✓ 외웠어요',exact:true}).getAttribute('aria-pressed'),'true');
    await first.getByRole('button',{name:'☆ 북마크',exact:true}).click();
    assert.equal(await first.getByRole('button',{name:'★ 북마크',exact:true}).getAttribute('aria-pressed'),'true');
    await first.getByRole('button',{name:'답안 공개',exact:true}).click();
    assert.equal(await first.getByRole('button',{name:'영어 발음 듣기',exact:true}).count(),1);
    assert.equal(await rows.nth(1).getByRole('button',{name:'답안 공개',exact:true}).count(),1);
    await first.getByRole('button',{name:'답안 다시 가리기',exact:true}).click();
    await page.screenshot({path:`/tmp/vocab-compact-list-${width}.png`,fullPage:false});
    for(const name of ['뜻 ➔ 단어','예문 ➔ 뜻','한국어 ➔ 영어 예문']) {
      await page.getByRole('button',{name,exact:false}).click();
      await first.getByRole('button',{name:'답안 공개',exact:true}).click();
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
      await rows.last().scrollIntoViewIfNeeded();
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    }
    assert.deepEqual(errors,[]);
    await page.close();
    console.log(`PASS compact list ${width}px, row ${height}px vs card ${cardHeight}px`);
  }
} finally {await browser.close();}
