/* Tweet Image Extension - Content Script (menu de contexto) */

if (!window.__tweetImgExtLoaded) {
  window.__tweetImgExtLoaded = true;

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.action === 'convert') {
      const text = (msg.text || tiGetSelectedTextFromPage() || '').trim();
      if (!text) {
        showToast('Nenhum texto selecionado!', true);
        sendResponse({ ok: false });
        return true;
      }
      renderAndCopy(text).then((ok) => sendResponse({ ok }));
      return true; // resposta assíncrona
    }
  });

  function tiGetSelectedTextFromPage() {
    try {
      const el = document.activeElement;
      if (el && (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') &&
          typeof el.selectionStart === 'number' && el.selectionStart !== el.selectionEnd) {
        return el.value.substring(el.selectionStart, el.selectionEnd);
      }
    } catch (e) {}
    return window.getSelection ? window.getSelection().toString() : '';
  }

  async function renderAndCopy(text) {
    try {
      const blob = await tiRenderTweetCard(text);
      try { window.focus(); } catch (e) {}
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      showToast('Copiado! ✓');
      return true;
    } catch (err) {
      console.error('Tweet Image Extension error:', err);
      showToast('Erro ao copiar imagem.', true);
      return false;
    }
  }

  function showToast(message, isError = false) {
    const existing = document.getElementById('tweet-img-ext-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'tweet-img-ext-toast';
    toast.textContent = message;
    Object.assign(toast.style, {
      position: 'fixed', bottom: '24px', right: '24px', zIndex: '2147483647',
      padding: '12px 24px', borderRadius: '10px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '15px', fontWeight: '600', color: '#fff',
      background: isError ? '#e53e3e' : '#1d9bf0',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      transition: 'opacity 0.3s ease', opacity: '0'
    });
    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity = '1'; });
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }
}
