const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 627 });
  await page.goto('http://localhost:8888/ahmed_nasr_linkedin_post.html');
  await page.waitForTimeout(3000); // Wait for fonts to load
  await page.screenshot({ path: 'ahmed_nasr_linkedin_post.png', type: 'png' });
  await browser.close();
  console.log('Screenshot saved to ahmed_nasr_linkedin_post.png');
})();
