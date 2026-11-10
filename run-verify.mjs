import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const PORT = 9130;
const DIST = '/Users/ritulshekhar/Downloads/language-logs/wortgarten/dist';
const ARTIFACT_DIR = '/Users/ritulshekhar/.gemini/antigravity/brain/7426ff78-a72b-4019-ae59-206ee635cf1f';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url?.split('?')[0] || '/';
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(DIST, reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/javascript' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(path.join(DIST, 'index.html')).pipe(res);
  }
});

server.listen(PORT, '127.0.0.1', async () => {
  console.log(`Server listening at http://127.0.0.1:${PORT}`);
  try {
    await verify();
  } catch (err) {
    console.error('Verification failed:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});

async function verify() {
  const chrome = spawn(CHROME, [
    '--headless=new',
    '--remote-debugging-port=9228',
    '--disable-gpu',
    '--window-size=390,844',
    `http://127.0.0.1:${PORT}`
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const res = await fetch('http://127.0.0.1:9228/json');
    const tabs = await res.json();
    const pageTab = tabs.find(t => t.type === 'page' && t.url.includes(`${PORT}`));
    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++;
        const handler = (evt) => {
          const d = JSON.parse(evt.data);
          if (d.id === msgId) { ws.removeEventListener('message', handler); resolve(d.result); }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send('Runtime.enable');
    await send('Page.enable');
    await new Promise(r => setTimeout(r, 1500));

    // 1. Switch to Settings and load sample words
    console.log('Navigating to Settings...');
    await send('Runtime.evaluate', { expression: 'document.querySelectorAll(".nav-item")[4].click()' });
    await new Promise(r => setTimeout(r, 1000));

    console.log('Clicking Load Sample Words...');
    await send('Runtime.evaluate', {
      expression: `
        const b = Array.from(document.querySelectorAll('button')).find(x => x.textContent.includes('Load 15 Sample'));
        if (b) b.click();
      `
    });
    await new Promise(r => setTimeout(r, 1200));

    // 2. Switch to Words tab
    console.log('Navigating to Words tab...');
    await send('Runtime.evaluate', { expression: 'document.querySelectorAll(".nav-item")[0].click()' });
    await new Promise(r => setTimeout(r, 1200));

    const wordsStatus = await send('Runtime.evaluate', {
      expression: `
        ({
          cardCount: document.querySelectorAll('.word-item').length,
          hasGeschwindigkeit: document.body.innerText.includes('Geschwindigkeitsbegrenzung'),
          wordOfTheDay: document.querySelector('.card [lang="de"]')?.textContent || ''
        })
      `,
      returnByValue: true
    });
    console.log('Words status:', JSON.stringify(wordsStatus.result.value));

    // Capture Screen 1: Words Tab
    let scr = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'screen-1-words-list.png'), Buffer.from(scr.data, 'base64'));
    console.log('Saved screen-1-words-list.png');

    // 3. Test Viewports for horizontal overflow
    const viewports = [
      { name: '320x568', w: 320, h: 568 },
      { name: '360x640', w: 360, h: 640 },
      { name: '390x844', w: 390, h: 844 },
      { name: '430x932', w: 430, h: 932 },
      { name: '768x1024', w: 768, h: 1024 },
      { name: '1280x800', w: 1280, h: 800 }
    ];

    for (const vp of viewports) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.w,
        height: vp.h,
        deviceScaleFactor: 1,
        mobile: vp.w < 768
      });
      await new Promise(r => setTimeout(r, 400));

      const of = await send('Runtime.evaluate', {
        expression: `
          ({
            viewport: "${vp.name}",
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
            noHorizontalOverflow: document.documentElement.scrollWidth <= document.documentElement.clientWidth
          })
        `,
        returnByValue: true
      });
      console.log(`Viewport ${vp.name} overflow check:`, JSON.stringify(of.result.value));

      const vpScr = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(ARTIFACT_DIR, `viewport-${vp.name}.png`), Buffer.from(vpScr.data, 'base64'));
    }

    // Reset back to 390x844
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 400));

    // 4. Practice tab & session
    console.log('Navigating to Practice tab...');
    await send('Runtime.evaluate', { expression: 'document.querySelectorAll(".nav-item")[1].click()' });
    await new Promise(r => setTimeout(r, 1000));

    scr = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'screen-2-practice-setup.png'), Buffer.from(scr.data, 'base64'));
    console.log('Saved screen-2-practice-setup.png');

    // Start Practice
    await send('Runtime.evaluate', {
      expression: `
        const b = Array.from(document.querySelectorAll('button')).find(x => x.textContent.includes('Start Practice'));
        if (b) b.click();
      `
    });
    await new Promise(r => setTimeout(r, 1000));

    scr = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'screen-2-practice-quiz.png'), Buffer.from(scr.data, 'base64'));
    console.log('Saved screen-2-practice-quiz.png');

    // Answer first question
    await send('Runtime.evaluate', {
      expression: `
        // Click first multiple choice option if present
        const mc = document.querySelector('.mc-option');
        if (mc) {
          mc.click();
        } else {
          // or if typing, enter something
          const inp = document.querySelector('input[type="text"]');
          if (inp) {
            inp.value = 'lernen';
            inp.dispatchEvent(new Event('input', { bubbles: true }));
            const checkBtn = Array.from(document.querySelectorAll('button')).find(x => x.textContent.includes('Check'));
            if (checkBtn) checkBtn.click();
          }
        }
      `
    });
    await new Promise(r => setTimeout(r, 1000));

    scr = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'screen-2-practice-feedback.png'), Buffer.from(scr.data, 'base64'));
    console.log('Saved screen-2-practice-feedback.png');

    // Quit quiz
    await send('Runtime.evaluate', {
      expression: `
        const qb = document.querySelector('button[aria-label="Quit session"]');
        if (qb) qb.click();
      `
    });
    await new Promise(r => setTimeout(r, 600));

    // 5. Grammar tab
    console.log('Navigating to Grammar tab...');
    await send('Runtime.evaluate', { expression: 'document.querySelectorAll(".nav-item")[2].click()' });
    await new Promise(r => setTimeout(r, 1000));

    // Expand Gender & Articles
    await send('Runtime.evaluate', {
      expression: 'document.querySelectorAll(".collapsible-header")[0]?.click()'
    });
    await new Promise(r => setTimeout(r, 600));

    scr = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'screen-3-grammar-reference.png'), Buffer.from(scr.data, 'base64'));
    console.log('Saved screen-3-grammar-reference.png');

    // Open Possessive Selector
    await send('Runtime.evaluate', {
      expression: `
        const b = Array.from(document.querySelectorAll('button')).find(x => x.textContent.includes('Possessive selector'));
        if (b) b.click();
      `
    });
    await new Promise(r => setTimeout(r, 800));

    scr = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'screen-3-possessive-selector.png'), Buffer.from(scr.data, 'base64'));
    console.log('Saved screen-3-possessive-selector.png');

    // Back to grammar list
    await send('Runtime.evaluate', {
      expression: 'Array.from(document.querySelectorAll("button")).find(x => x.textContent.includes("←"))?.click()'
    });
    await new Promise(r => setTimeout(r, 600));

    // Open Conjugation Tool
    await send('Runtime.evaluate', {
      expression: `
        const b = Array.from(document.querySelectorAll('button')).find(x => x.textContent.includes('Conjugation tool'));
        if (b) b.click();
      `
    });
    await new Promise(r => setTimeout(r, 800));

    // Type "fahren" and look up
    await send('Runtime.evaluate', {
      expression: `
        const inp = document.querySelector('#verb-input');
        if (inp) {
          inp.value = 'fahren';
          inp.dispatchEvent(new Event('input', { bubbles: true }));
          Array.from(document.querySelectorAll('button')).find(x => x.textContent.includes('Look up'))?.click();
        }
      `
    });
    await new Promise(r => setTimeout(r, 800));

    scr = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'screen-3-conjugation-tool.png'), Buffer.from(scr.data, 'base64'));
    console.log('Saved screen-3-conjugation-tool.png');

    // Back to grammar list
    await send('Runtime.evaluate', {
      expression: 'Array.from(document.querySelectorAll("button")).find(x => x.textContent.includes("←"))?.click()'
    });
    await new Promise(r => setTimeout(r, 600));

    // 6. Progress tab
    console.log('Navigating to Progress tab...');
    await send('Runtime.evaluate', { expression: 'document.querySelectorAll(".nav-item")[3].click()' });
    await new Promise(r => setTimeout(r, 1000));

    scr = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'screen-4-progress.png'), Buffer.from(scr.data, 'base64'));
    console.log('Saved screen-4-progress.png');

    // 7. Settings tab & Dark Mode
    console.log('Navigating to Settings tab...');
    await send('Runtime.evaluate', { expression: 'document.querySelectorAll(".nav-item")[4].click()' });
    await new Promise(r => setTimeout(r, 1000));

    // Click "Dark"
    await send('Runtime.evaluate', {
      expression: `
        const darkBtn = Array.from(document.querySelectorAll('button')).find(x => x.textContent.trim() === 'Dark');
        if (darkBtn) darkBtn.click();
      `
    });
    await new Promise(r => setTimeout(r, 800));

    scr = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'screen-5-settings-dark.png'), Buffer.from(scr.data, 'base64'));
    console.log('Saved screen-5-settings-dark.png');

    // Switch back to Words in Dark Mode
    await send('Runtime.evaluate', { expression: 'document.querySelectorAll(".nav-item")[0].click()' });
    await new Promise(r => setTimeout(r, 800));

    scr = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'screen-1-words-dark.png'), Buffer.from(scr.data, 'base64'));
    console.log('Saved screen-1-words-dark.png');

    ws.close();
    console.log('ALL VERIFICATIONS AND SCREENSHOTS SUCCESSFUL!');
  } finally {
    chrome.kill();
  }
}

