import { chromium } from "playwright";
import assert from "node:assert/strict";
const base = process.env.TEST_URL || "http://localhost:5173";
const browser = await chromium.launch({
  channel: process.env.BROWSER_CHANNEL || "msedge",
  headless: true,
});
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base);
  await page.getByRole("button", { name: "어휘 리스트", exact: true }).click();
  const rows = page.getByRole("article");
  await rows.first().waitFor();
  assert.equal(await rows.count(), 50);
  assert.equal(
    await page.getByText("탭하여 답안 확인", { exact: true }).count(),
    50,
  );
  await rows
    .first()
    .getByRole("button", { name: "답안 공개", exact: true })
    .click();
  assert.equal(
    await page.getByText("탭하여 답안 확인", { exact: true }).count(),
    49,
  );
  await rows
    .first()
    .getByRole("button", { name: "외웠어요", exact: true })
    .click();
  assert.equal(
    await rows
      .first()
      .getByRole("button", { name: "✓ 외웠어요", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  await rows
    .first()
    .getByRole("button", { name: "✓ 외웠어요", exact: true })
    .click();
  await rows
    .first()
    .getByRole("button", { name: "헷갈려요", exact: true })
    .click();
  await page.getByRole("button", { name: "뜻 ➔ 단어", exact: false }).click();
  assert.equal(
    await rows
      .first()
      .getByRole("button", { name: "외웠어요", exact: true })
      .getAttribute("aria-pressed"),
    "false",
  );
  await page.getByRole("button", { name: "단어 ➔ 뜻", exact: false }).click();
  assert.equal(
    await rows
      .first()
      .getByRole("button", { name: "✓ 헷갈려요", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  const original = await rows.locator("p").allTextContents();
  await page.getByLabel("학습 순서", { exact: true }).selectOption("shuffle");
  const shuffled = await rows.locator("p").allTextContents();
  await rows
    .first()
    .getByRole("button", { name: "외웠어요", exact: true })
    .click();
  assert.deepEqual(await rows.locator("p").allTextContents(), shuffled);
  await page
    .getByRole("button", { name: "카드로 돌아가기", exact: true })
    .click();
  await page.getByRole("button", { name: "어휘 리스트", exact: true }).click();
  assert.deepEqual(await rows.locator("p").allTextContents(), shuffled);
  await page.getByLabel("학습 순서", { exact: true }).selectOption("original");
  assert.deepEqual(await rows.locator("p").allTextContents(), original);
  await page.reload();
  await rows.first().waitFor();
  assert.equal(
    await page.getByText("탭하여 답안 확인", { exact: true }).count(),
    50,
  );
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    true,
  );
  assert.equal(await page.getByText(/Space|단축키|4지선다/).count(), 0);
  await page
    .getByRole("button", { name: "카드로 돌아가기", exact: true })
    .click();
  await page
    .getByRole("button", { name: "전체 단어 목록 및 검색", exact: false })
    .count()
    .then(async (n) => {
      if (n) {
        await page
          .getByRole("button", { name: "전체 단어 목록 및 검색", exact: false })
          .click();
      }
    });
  assert.deepEqual(errors, []);
  console.log(
    "PASS mobile browser: list, reveal, assessment, mode isolation, persistence, ordering, navigation, width and removed quiz hints at " +
      base,
  );
} finally {
  await browser.close();
}
