/* Tweet Image Extension - Popup (botao da barra) */

const btn = document.getElementById('btn');
const statusEl = document.getElementById('status');

btn.addEventListener('click', async () => {
  btn.disabled = true;
  btn.textContent = 'Convertendo...';
  statusEl.textContent = '';
  statusEl.className = '';

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      showStatus('Não foi possível acessar a aba ativa.', true);
      return;
    }

    // Captura o texto selecionado diretamente na pagina.
    let text = '';
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const el = document.activeElement;
          if (el && (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') &&
              typeof el.selectionStart === 'number' && el.selectionStart !== el.selectionEnd) {
            return el.value.substring(el.selectionStart, el.selectionEnd);
          }
          return window.getSelection ? window.getSelection().toString() : '';
        }
      });
      text = (results && results[0] && results[0].result ? results[0].result : '').trim();
    } catch (e) {
      showStatus('Não é possível acessar esta página.', true);
      return;
    }

    if (!text) {
      showStatus('Nenhum texto selecionado na página.', true);
      return;
    }

    // Renderiza e copia a partir do proprio popup (documento em foco -> clipboard OK).
    const blob = await tiRenderTweetCard(text);
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    showStatus('Imagem copiada! ✓', false);
  } catch (err) {
    console.error('Tweet Image Extension (popup) error:', err);
    showStatus('Erro ao gerar a imagem. Tente novamente.', true);
  }
});

function showStatus(msg, isError) {
  statusEl.textContent = msg;
  statusEl.className = isError ? 'error' : 'success';
  btn.disabled = false;
  btn.textContent = 'Converter para imagem';
}
