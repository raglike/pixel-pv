import * as PIXI from 'pixi.js';
import { BaseEffect, type EffectConfig } from './base.js';

export interface TextAnimationConfig extends EffectConfig {
  type: 'hero' | 'staggered' | 'wave';
  text: string;
  fontSize: number;
  color: string;
  strokeColor?: string;
  strokeWidth?: number;
  duration: number;
  fontFamily?: string;
}

export class HeroTextEffect extends BaseEffect {
  private text: PIXI.Text | null = null;
  private configExt!: TextAnimationConfig;

  init(app: PIXI.Application): void {
    this.configExt = this.config as TextAnimationConfig;
    const { text, fontSize, color, strokeColor, strokeWidth, fontFamily } = this.configExt;

    this.text = new PIXI.Text({
      text,
      style: {
        fontFamily: fontFamily || 'Arial Black, sans-serif',
        fontSize,
        fill: color,
        stroke: strokeColor ? { color: strokeColor, width: strokeWidth || 3 } : undefined,
        fontWeight: 'bold',
      },
    });

    this.text.anchor.set(0.5);
    this.text.x = app.screen.width / 2;
    this.text.y = app.screen.height / 2;
    this.text.alpha = 0;
    this.text.scale.set(0.5);

    this.container.addChild(this.text);

    // Animation
    const tl = this.createTimeline();
    tl.to(this.text, {
      alpha: 1,
      scale: 1,
      duration: 0.5,
      ease: 'back.out(1.7)',
    });
    tl.to(this.text, {
      alpha: 0.8,
      duration: 0.3,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1,
    });
  }

  updateText(newText: string): void {
    if (this.text) {
      this.text.text = newText;
    }
  }

  update(_deltaTime: number): void {
    if (this.text) {
      this.text.rotation = Math.sin(Date.now() * 0.001) * 0.02;
    }
  }
}

export class StaggeredTextEffect extends BaseEffect {
  private chars: PIXI.Text[] = [];
  private configExt!: TextAnimationConfig;

  init(app: PIXI.Application): void {
    this.configExt = this.config as TextAnimationConfig;
    const { text, fontSize, color, strokeColor, strokeWidth, fontFamily } = this.configExt;

    const chars = text.split('');
    const totalWidth = chars.length * fontSize * 0.6;
    let xOffset = app.screen.width / 2 - totalWidth / 2;

    chars.forEach((char) => {
      const charText = new PIXI.Text({
        text: char,
        style: {
          fontFamily: fontFamily || 'Arial, sans-serif',
          fontSize,
          fill: color,
          stroke: strokeColor ? { color: strokeColor, width: strokeWidth || 2 } : undefined,
          fontWeight: 'bold',
        },
      });

      charText.anchor.set(0.5);
      charText.x = xOffset + fontSize * 0.3;
      charText.y = app.screen.height / 2;
      charText.alpha = 0;
      charText.scale.set(0);

      this.container.addChild(charText);
      this.chars.push(charText);

      xOffset += fontSize * 0.6;
    });

    // Staggered animation
    const tl = this.createTimeline();
    tl.to(this.chars, {
      alpha: 1,
      scale: 1,
      duration: 0.3,
      ease: 'back.out(1.7)',
      stagger: 0.08,
    });
  }

  updateText(newText: string): void {
    // Remove old chars
    this.chars.forEach((c) => c.destroy());
    this.chars = [];

    const { fontSize, color, strokeColor, strokeWidth, fontFamily } = this.configExt;
    const chars = newText.split('');
    const totalWidth = chars.length * fontSize * 0.6;
    let xOffset = 640 / 2 - totalWidth / 2;

    chars.forEach((char) => {
      const charText = new PIXI.Text({
        text: char,
        style: {
          fontFamily: fontFamily || 'Arial, sans-serif',
          fontSize,
          fill: color,
          stroke: strokeColor ? { color: strokeColor, width: strokeWidth || 2 } : undefined,
          fontWeight: 'bold',
        },
      });

      charText.anchor.set(0.5);
      charText.x = xOffset + fontSize * 0.3;
      charText.y = 360 / 2;
      charText.alpha = 1;
      charText.scale.set(1);

      this.container.addChild(charText);
      this.chars.push(charText);

      xOffset += fontSize * 0.6;
    });
  }

  update(_deltaTime: number): void {
    this.chars.forEach((char, i) => {
      char.y = 360 / 2 + Math.sin(Date.now() * 0.003 + i * 0.3) * 5;
    });
  }
}

export class WaveTextEffect extends BaseEffect {
  private chars: PIXI.Text[] = [];
  private configExt!: TextAnimationConfig;

  init(app: PIXI.Application): void {
    this.configExt = this.config as TextAnimationConfig;
    const { text, fontSize, color, strokeColor, strokeWidth, fontFamily } = this.configExt;

    const chars = text.split('');
    const totalWidth = chars.length * fontSize * 0.6;
    let xOffset = app.screen.width / 2 - totalWidth / 2;

    chars.forEach((char) => {
      const charText = new PIXI.Text({
        text: char,
        style: {
          fontFamily: fontFamily || 'Arial Black, sans-serif',
          fontSize,
          fill: color,
          stroke: strokeColor ? { color: strokeColor, width: strokeWidth || 3 } : undefined,
          fontWeight: 'bold',
        },
      });

      charText.anchor.set(0.5);
      charText.x = xOffset + fontSize * 0.3;
      charText.y = app.screen.height / 2;
      charText.alpha = 0;

      this.container.addChild(charText);
      this.chars.push(charText);

      xOffset += fontSize * 0.6;
    });

    // Fade in
    const tl = this.createTimeline();
    tl.to(this.chars, {
      alpha: 1,
      duration: 0.5,
      ease: 'power2.out',
    });
  }

  updateText(newText: string): void {
    this.chars.forEach((c) => c.destroy());
    this.chars = [];

    const { fontSize, color, strokeColor, strokeWidth, fontFamily } = this.configExt;
    const chars = newText.split('');
    const totalWidth = chars.length * fontSize * 0.6;
    let xOffset = 640 / 2 - totalWidth / 2;

    chars.forEach((char) => {
      const charText = new PIXI.Text({
        text: char,
        style: {
          fontFamily: fontFamily || 'Arial Black, sans-serif',
          fontSize,
          fill: color,
          stroke: strokeColor ? { color: strokeColor, width: strokeWidth || 3 } : undefined,
          fontWeight: 'bold',
        },
      });

      charText.anchor.set(0.5);
      charText.x = xOffset + fontSize * 0.3;
      charText.y = 360 / 2;
      charText.alpha = 1;

      this.container.addChild(charText);
      this.chars.push(charText);

      xOffset += fontSize * 0.6;
    });
  }

  update(_deltaTime: number): void {
    const time = Date.now() * 0.003;
    this.chars.forEach((char, i) => {
      char.y = 360 / 2 + Math.sin(time + i * 0.5) * 20 * Math.sin(time * 0.5);
    });
  }
}
