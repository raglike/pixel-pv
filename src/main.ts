import { PVEngine } from './engine.js';
import { initUI } from './ui.js';

async function main(): Promise<void> {
  const canvas = document.getElementById('pixi-canvas') as HTMLCanvasElement;

  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  const engine = new PVEngine();
  await engine.init(canvas);

  initUI(engine);

  console.log('Pixel PV Tool initialized');
}

main().catch(console.error);
