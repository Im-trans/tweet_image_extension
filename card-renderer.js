/* Tweet Image Extension - Renderizador compartilhado (popup + content script) */

function tiRenderTweetCard(text) {
  return new Promise((resolve) => {
    const CARD_WIDTH = 600;
    const PADDING_X = 48;
    const PADDING_Y = 44;
    const LINE_HEIGHT = 1.45;
    const FONT_SIZE = 28;
    const BORDER_RADIUS = 16;
    const BG_COLOR = '#15202b';
    const CARD_BG = '#1e2535';
    const BORDER_COLOR = '#2d3748';
    const TEXT_COLOR = '#e7e9ea';
    const FONT = `${FONT_SIZE}px Georgia, 'Times New Roman', serif`;

    const measureCanvas = document.createElement('canvas');
    const mCtx = measureCanvas.getContext('2d');
    mCtx.font = FONT;

    const maxTextWidth = CARD_WIDTH - PADDING_X * 2;
    const lines = tiWrapText(mCtx, text, maxTextWidth);
    const textHeight = lines.length * FONT_SIZE * LINE_HEIGHT;

    const cardHeight = textHeight + PADDING_Y * 2;
    const canvasWidth = CARD_WIDTH + 40;
    const canvasHeight = cardHeight + 40;

    const canvas = document.createElement('canvas');
    const dpr = 2;
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const cx = 20, cy = 20;
    tiRoundRect(ctx, cx, cy, CARD_WIDTH, cardHeight, BORDER_RADIUS, CARD_BG, BORDER_COLOR);

    ctx.fillStyle = TEXT_COLOR;
    ctx.font = FONT;
    ctx.textBaseline = 'top';
    let y = cy + PADDING_Y;
    for (const line of lines) {
      ctx.fillText(line, cx + PADDING_X, y);
      y += FONT_SIZE * LINE_HEIGHT;
    }

    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}

function tiWrapText(ctx, text, maxWidth) {
  const paragraphs = text.split('\n');
  const lines = [];
  for (const para of paragraphs) {
    if (para.trim() === '') { lines.push(''); continue; }
    const words = para.split(/\s+/);
    let currentLine = '';
    for (const word of words) {
      const testLine = currentLine ? currentLine + ' ' + word : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
  }
  return lines;
}

function tiRoundRect(ctx, x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
}
