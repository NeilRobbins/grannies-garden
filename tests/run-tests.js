// TDD test runner. Loads tests.html in headless chromium and reports results.
// Usage: node tests/run-tests.js
process.env.PLAYWRIGHT_BROWSERS_PATH = '/opt/pw-browsers';
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  let p = req.url.split('?')[0];
  if (p === '/') p = '/index.html';
  const full = path.join(ROOT, p);
  if (!full.startsWith(ROOT) || !fs.existsSync(full)) {
    res.writeHead(404); res.end('not found'); return;
  }
  const ext = path.extname(full);
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
  fs.createReadStream(full).pipe(res);
});

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const fileUrl = `http://127.0.0.1:${port}/tests/tests.html`;

  const logs = [];
  page.on('console', msg => logs.push(msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  await page.goto(fileUrl);
  // Wait for tests to finish
  await page.waitForFunction(() => window.__testsComplete === true, { timeout: 15000 });
  const results = await page.evaluate(() => window.__testResults);

  for (const line of logs) console.log(line);
  console.log('');
  console.log(`Passed: ${results.passed}  Failed: ${results.failed}  Total: ${results.total}`);

  if (results.failures.length > 0) {
    console.log('\nFailures:');
    for (const f of results.failures) {
      console.log(`  ✗ ${f.name}`);
      console.log(`      ${f.error}`);
    }
  }

  await browser.close();
  server.close();
  process.exit(results.failed > 0 ? 1 : 0);
})();
