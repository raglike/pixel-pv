import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

export interface EffectConfig {
  active: boolean;
  [key: string]: unknown;
}

export abstract class BaseEffect {
  public container: PIXI.Container;
  public config: EffectConfig;
  protected timeline: gsap.core.Timeline | null = null;
  protected isPlaying: boolean = false;

  constructor(config: EffectConfig = { active: true }) {
    this.config = config;
    this.container = new PIXI.Container();
  }

  abstract init(app: PIXI.Application): void;

  abstract update(deltaTime: number): void;

  play(): void {
    if (this.timeline && !this.isPlaying) {
      this.timeline.play();
      this.isPlaying = true;
    }
  }

  pause(): void {
    if (this.timeline && this.isPlaying) {
      this.timeline.pause();
      this.isPlaying = false;
    }
  }

  reset(): void {
    if (this.timeline) {
      this.timeline.restart();
    }
  }

  destroy(): void {
    if (this.timeline) {
      this.timeline.kill();
      this.timeline = null;
    }
    this.container.destroy({ children: true });
  }

  protected createTimeline(): gsap.core.Timeline {
    const tl = gsap.timeline({ repeat: -1 });
    this.timeline = tl;
    return tl;
  }
}
