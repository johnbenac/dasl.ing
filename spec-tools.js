(() => {
  function getMainClone() {
    const main = document.querySelector('main');
    if (!main) return null;

    const clone = main.cloneNode(true);

    clone.querySelectorAll('script, style, noscript').forEach(n => n.remove());
    clone.querySelectorAll('[data-copy-exclude], .copy-exclude').forEach(n => n.remove());

    return clone;
  }

  function getCopyPayload() {
    const clone = getMainClone();
    if (!clone) return { text: '', html: '' };

    const html = clone.outerHTML;

    const text = clone.innerText
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return { text, html };
  }

  async function writeClipboard({ text, html }) {
    if (navigator.clipboard && window.ClipboardItem) {
      try {
        const item = new ClipboardItem({
          'text/plain': new Blob([text], { type: 'text/plain' }),
          'text/html': new Blob([html], { type: 'text/html' }),
        });
        await navigator.clipboard.write([item]);
        return;
      } catch {
        // Fall through to text-only
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '0';
    ta.style.left = '0';
    ta.style.opacity = '0';

    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);

    if (!ok) throw new Error('Copy failed');
  }

  function flashButton(btn, state, label) {
    const original = btn.dataset.originalLabel || btn.textContent;
    btn.dataset.originalLabel = original;

    btn.textContent = label;
    btn.setAttribute('data-state', state);
    btn.disabled = true;

    clearTimeout(btn._flashTimer);
    btn._flashTimer = setTimeout(() => {
      btn.textContent = original;
      btn.removeAttribute('data-state');
      btn.disabled = false;
    }, 1400);
  }

  function init() {
    document.querySelectorAll('button.copy-page').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await writeClipboard(getCopyPayload());
          flashButton(btn, 'copied', 'Copied!');
        } catch (err) {
          console.error(err);
          flashButton(btn, 'error', 'Copy failed');
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
