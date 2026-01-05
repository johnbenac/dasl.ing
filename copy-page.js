// copy-page.js
function getCopyPayload() {
  const main = document.querySelector('main');
  if (!main) return null;

  const html = main.innerHTML;
  const text = main.innerText.trim();

  return { text, html };
}

async function writeToClipboard({ text, html }) {
  const canWriteRich =
    !!(navigator.clipboard && navigator.clipboard.write && window.ClipboardItem);

  if (canWriteRich) {
    const item = new ClipboardItem({
      'text/plain': new Blob([text], { type: 'text/plain' }),
      'text/html': new Blob([html], { type: 'text/html' }),
    });
    await navigator.clipboard.write([item]);
    return;
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  ta.style.top = '0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
}

function setButtonState(btn, { state, message }) {
  const original = btn.dataset.originalText || btn.textContent;
  btn.dataset.originalText = original;

  if (state === 'idle') {
    btn.textContent = original;
    btn.disabled = false;
    btn.removeAttribute('aria-busy');
    return;
  }

  btn.textContent = message;
  btn.disabled = true;
  btn.setAttribute('aria-busy', 'true');
}

function setupCopyButton() {
  const btn = document.querySelector('button.copy-page');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const payload = getCopyPayload();
    if (!payload) return;

    try {
      setButtonState(btn, { state: 'working', message: 'Copying…' });
      await writeToClipboard(payload);
      setButtonState(btn, { state: 'done', message: 'Copied!' });
      setTimeout(() => setButtonState(btn, { state: 'idle' }), 1200);
    }
    catch (err) {
      console.error('Copy failed:', err);
      setButtonState(btn, { state: 'error', message: 'Copy failed' });
      setTimeout(() => setButtonState(btn, { state: 'idle' }), 1600);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupCopyButton);
}
else {
  setupCopyButton();
}
