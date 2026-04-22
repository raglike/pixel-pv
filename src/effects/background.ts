import * as PIXI from 'pixi.js';
import { BaseEffect, type EffectConfig } from './base.js';

export interface GradientBackgroundConfig extends EffectConfig {
  color1: string;
  color2: string;
  alpha: number;
  angle: number;
}

export class GradientBackgroundEffect extends BaseEffect {
  private graphics!: PIXI.Graphics;
  private configExt!: GradientBackgroundConfig;

  init(app: PIXI.Application): void {
    this.configExt = this.config as GradientBackgroundConfig;
    this.graphics = new PIXI.Graphics();
    this.container.addChild(this.graphics);
    this.drawGradient(app.screen.width, app.screen.height);
  }

  private drawGradient(width: number, height: number): void {
    this.graphics.clear();

    const { color1, color2, alpha } = this.configExt;
    const c1 = this.hexToRgb(color1);
    const c2 = this.hexToRgb(color2);

    const steps = 50;
    for (let i = 0; i < steps; i++) {
      const t1 = i / steps;

      const r = Math.round(c1.r + (c2.r - c1.r) * t1);
      const g = Math.round(c1.g + (c2.g - c1.g) * t1);
      const b = Math.round(c1.b + (c2.b - c1.b) * t1);

      this.graphics.moveTo(0, 0);
      this.graphics.lineTo(width, 0);
      this.graphics.lineTo(width, height);
      this.graphics.lineTo(0, height);
      this.graphics.closePath();
      this.graphics.fill({
        color: (r << 16) | (g << 8) | b,
        alpha: alpha,
      });
    }
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  }

  update(_deltaTime: number): void {
    // Static effect, no update needed
  }
}
