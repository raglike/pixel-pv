import type { PVEngine } from './engine.js';
import type { TemplateType } from './templates.js';

export function initUI(engine: PVEngine): void {
  // Template cards
  const templateGrid = document.getElementById('template-grid');
  const cards = templateGrid?.querySelectorAll('.template-card');

  cards?.forEach((card) => {
    card.addEventListener('click', () => {
      const template = card.getAttribute('data-template') as TemplateType;
      if (template) {
        // Update active state
        cards.forEach((c) => c.classList.remove('active'));
        card.classList.add('active');

        // Load template
        engine.loadTemplate(template);

        // Reset to first template's default text style
        const defaultStyles = getDefaultTextStyle(template);
        applyTextStyle(defaultStyles);
      }
    });
  });

  // Set initial active card
  const initialCard = templateGrid?.querySelector('[data-template="battle"]');
  initialCard?.classList.add('active');

  // Text input
  const textInput = document.getElementById('text-input') as HTMLInputElement;
  textInput?.addEventListener('input', () => {
    engine.updateText(textInput.value);
  });

  // Font size slider
  const fontSizeSlider = document.getElementById('font-size') as HTMLInputElement;
  const fontSizeVal = document.getElementById('font-size-val');
  fontSizeSlider?.addEventListener('input', () => {
    const val = parseInt(fontSizeSlider.value);
    if (fontSizeVal) fontSizeVal.textContent = `${val}px`;
    engine.updateTextStyle({ fontSize: val });
  });

  // Animation speed slider
  const animSpeedSlider = document.getElementById('anim-speed') as HTMLInputElement;
  const animSpeedVal = document.getElementById('anim-speed-val');
  animSpeedSlider?.addEventListener('input', () => {
    const val = parseFloat(animSpeedSlider.value);
    if (animSpeedVal) animSpeedVal.textContent = `${val}x`;
    engine.setAnimationSpeed(val);
  });

  // Color inputs
  setupColorInput('primary-color', 'primary-color-text', (color) => {
    engine.updateTextStyle({ color });
  });

  setupColorInput('secondary-color', 'secondary-color-text', () => {
    // Secondary color used for template-specific effects
  });

  setupColorInput('stroke-color', 'stroke-color-text', (color) => {
    engine.updateTextStyle({ strokeColor: color });
  });

  // Stroke width slider
  const strokeWidthSlider = document.getElementById('stroke-width') as HTMLInputElement;
  const strokeWidthVal = document.getElementById('stroke-width-val');
  strokeWidthSlider?.addEventListener('input', () => {
    const val = parseInt(strokeWidthSlider.value);
    if (strokeWidthVal) strokeWidthVal.textContent = `${val}px`;
    engine.updateTextStyle({ strokeWidth: val });
  });

  // Play/Pause buttons
  const btnPlay = document.getElementById('btn-play');
  const btnPause = document.getElementById('btn-pause');
  const animStatus = document.getElementById('anim-status');
  const animStatusText = document.getElementById('anim-status-text');

  btnPlay?.addEventListener('click', () => {
    engine.play();
    animStatus?.classList.add('playing');
    if (animStatusText) animStatusText.textContent = '播放中';
  });

  btnPause?.addEventListener('click', () => {
    engine.pause();
    animStatus?.classList.remove('playing');
    if (animStatusText) animStatusText.textContent = '暂停';
  });

  // Export button
  const btnExport = document.getElementById('btn-export');
  btnExport?.addEventListener('click', () => {
    exportPNG(engine);
  });
}

function setupColorInput(
  colorInputId: string,
  textInputId: string,
  onChange: (color: string) => void
): void {
  const colorInput = document.getElementById(colorInputId) as HTMLInputElement;
  const textInput = document.getElementById(textInputId) as HTMLInputElement;

  colorInput?.addEventListener('input', () => {
    if (textInput) textInput.value = colorInput.value;
    onChange(colorInput.value);
  });

  textInput?.addEventListener('input', () => {
    const hex = textInput.value;
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      colorInput.value = hex;
      onChange(hex);
    }
  });
}

function getDefaultTextStyle(template: TemplateType): {
  fontSize: number;
  color: string;
  strokeColor: string;
  strokeWidth: number;
} {
  switch (template) {
    case 'battle':
      return {
        fontSize: 72,
        color: '#ff4444',
        strokeColor: '#000000',
        strokeWidth: 4,
      };
    case 'cyber':
      return {
        fontSize: 64,
        color: '#00ffff',
        strokeColor: '#000000',
        strokeWidth: 3,
      };
    case 'adventure':
      return {
        fontSize: 56,
        color: '#44ff88',
        strokeColor: '#000000',
        strokeWidth: 3,
      };
    case 'minimal':
      return {
        fontSize: 80,
        color: '#ffffff',
        strokeColor: '#000000',
        strokeWidth: 2,
      };
    default:
      return {
        fontSize: 64,
        color: '#ffffff',
        strokeColor: '#000000',
        strokeWidth: 3,
      };
  }
}

function applyTextStyle(style: {
  fontSize: number;
  color: string;
  strokeColor: string;
  strokeWidth: number;
}): void {
  const fontSizeSlider = document.getElementById('font-size') as HTMLInputElement;
  const fontSizeVal = document.getElementById('font-size-val');
  if (fontSizeSlider) {
    fontSizeSlider.value = String(style.fontSize);
    if (fontSizeVal) fontSizeVal.textContent = `${style.fontSize}px`;
  }

  const primaryColorInput = document.getElementById('primary-color') as HTMLInputElement;
  const primaryColorText = document.getElementById('primary-color-text') as HTMLInputElement;
  if (primaryColorInput) primaryColorInput.value = style.color;
  if (primaryColorText) primaryColorText.value = style.color;

  const strokeColorInput = document.getElementById('stroke-color') as HTMLInputElement;
  const strokeColorText = document.getElementById('stroke-color-text') as HTMLInputElement;
  if (strokeColorInput) strokeColorInput.value = style.strokeColor;
  if (strokeColorText) strokeColorText.value = style.strokeColor;

  const strokeWidthSlider = document.getElementById('stroke-width') as HTMLInputElement;
  const strokeWidthVal = document.getElementById('stroke-width-val');
  if (strokeWidthSlider) {
    strokeWidthSlider.value = String(style.strokeWidth);
    if (strokeWidthVal) strokeWidthVal.textContent = `${style.strokeWidth}px`;
  }
}

export function exportPNG(engine: PVEngine): void {
  const canvas = engine.getCanvas();
  const link = document.createElement('a');
  link.download = `pixel-pv-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
