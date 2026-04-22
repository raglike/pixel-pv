import * as PIXI from 'pixi.js';
import { BaseEffect, type EffectConfig } from './base.js';

// Vignette Effect
export interface VignetteConfig extends EffectConfig {
  color: number;
  alpha: number;
  intensity: number;
}

export class VignetteEffect extends BaseEffect {
  private graphics!: PIXI.Graphics;
  private configExt!: VignetteConfig;

  init(app: PIXI.Application): void {
    this.configExt = this.config as VignetteConfig;
    this.graphics = new PIXI.Graphics();
    this.container.addChild(this.graphics);
    this.drawVignette(app.screen.width, app.screen.height);
  }

  private drawVignette(width: number, height: number): void {
    const { color, alpha, intensity } = this.configExt;
    this.graphics.clear();

    // Create a gradient-like effect using concentric rectangles
    const steps = 8;
    for (let i = steps; i >= 0; i--) {
      const ratio = i / steps;
      const size = Math.max(width, height) * (1 + ratio * 0.5);
      const offsetX = (width - size) / 2;
      const offsetY = (height - size) / 2;

      this.graphics.fill({ color, alpha: alpha * (1 - ratio) * intensity });
      this.graphics.rect(offsetX, offsetY, size, size);
    }

    // Cut out center
    this.graphics.fill({ color: 0x000000, alpha: 1 });
    const centerSize = Math.min(width, height) * 0.3;
    this.graphics.rect(
      width / 2 - centerSize / 2,
      height / 2 - centerSize / 2,
      centerSize,
      centerSize
    );
  }

  update(_deltaTime: number): void {
    // Static effect
  }
}

// Scanlines Effect
export interface ScanlinesConfig extends EffectConfig {
  color: number;
  alpha: number;
  lineSpacing: number;
  lineWidth: number;
  speed: number;
}

export class ScanlinesEffect extends BaseEffect {
  private graphics!: PIXI.Graphics;
  private configExt!: ScanlinesConfig;
  private offset: number = 0;

  init(app: PIXI.Application): void {
    this.configExt = this.config as ScanlinesConfig;
    this.graphics = new PIXI.Graphics();
    this.container.addChild(this.graphics);
    this.drawScanlines(app.screen.width, app.screen.height);
  }

  private drawScanlines(width: number, height: number): void {
    const { color, alpha, lineSpacing, lineWidth } = this.configExt;
    this.graphics.clear();

    for (let y = this.offset % lineSpacing; y < height; y += lineSpacing) {
      this.graphics.fill({ color, alpha });
      this.graphics.rect(0, y, width, lineWidth);
    }
  }

  update(deltaTime: number): void {
    const { speed } = this.configExt;
    this.offset += speed * deltaTime * 60;
    this.drawScanlines(640, 360);
  }
}
