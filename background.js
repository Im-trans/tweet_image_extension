/* Tweet Image Extension - Service Worker */

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'convert-to-image',
    title: 'Converter para imagem',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== 'convert-to-image' || !tab?.id) return;

  // Garante que os scripts estejam injetados (abas abertas antes da instalacao
  // nao recebem content scripts automaticamente).
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['card-renderer.js', 'content.js']
    });
  } catch (e) {
    // paginas protegidas (chrome://, webstore, etc.) nao permitem injecao
    console.warn('Nao foi possivel injetar na pagina:', e);
    return;
  }

  chrome.tabs.sendMessage(tab.id, {
    action: 'convert',
    text: info.selectionText || ''
  });
});
