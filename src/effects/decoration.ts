import * as PIXI from 'pixi.js';
import { BaseEffect, type EffectConfig } from './base.js';
import { gsap } from 'gsap';

// Diamond Shapes Effect
export interface DiamondShapesConfig extends EffectConfig {
  color: string;
  count: number;
  size: number;
  speed: number;
}

export class DiamondShapesEffect extends BaseEffect {
  private diamonds: PIXI.Graphics[] = [];
  private configExt!: DiamondShapesConfig;

  init(app: PIXI.Application): void {
    this.configExt = this.config as DiamondShapesConfig;
    const { count, size, color } = this.configExt;

    for (let i = 0; i < count; i++) {
      const diamond = new PIXI.Graphics();
      diamond.x = Math.random() * app.screen.width;
      diamond.y = Math.random() * app.screen.height;
      diamond.rotation = Math.PI / 4;

      const s = size * (0.5 + Math.random() * 0.5);
      diamond.fill(color);
      diamond.rect(-s / 2, -s / 2, s, s);
      diamond.stroke({ width: 1, color: 0xffffff, alpha: 0.3 });

      this.container.addChild(diamond);
      this.diamonds.push(diamond);

      // Animate
      gsap.to(diamond, {
        y: diamond.y - 100 - Math.random() * 100,
        rotation: diamond.rotation + Math.PI / 2,
        duration: 2 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
  }

  update(_deltaTime: number): void {
    this.diamonds.forEach((d) => {
      d.x += Math.sin(Date.now() * 0.001 + d.y * 0.01) * 0.5;
    });
  }
}

// Cross Pattern Effect
export interface CrossPatternConfig extends EffectConfig {
  color: string;
  spacing: number;
  lineWidth: number;
  rotationSpeed: number;
}

export class CrossPatternEffect extends BaseEffect {
  private crosses: PIXI.Graphics[] = [];
  private configExt!: CrossPatternConfig;

  init(app: PIXI.Application): void {
    this.configExt = this.config as CrossPatternConfig;
    const { color, spacing, lineWidth } = this.configExt;

    const cross = new PIXI.Graphics();
    const size = spacing;

    // Horizontal line
    cross.moveTo(-size / 2, 0);
    cross.lineTo(size / 2, 0);
    cross.stroke({ width: lineWidth, color: color, alpha: 0.5 });

    // Vertical line
    cross.moveTo(0, -size / 2);
    cross.lineTo(0, size / 2);
    cross.stroke({ width: lineWidth, color: color, alpha: 0.5 });

    const cols = Math.ceil(app.screen.width / spacing) + 2;
    const rows = Math.ceil(app.screen.height / spacing) + 2;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const c = cross.clone();
        c.x = i * spacing;
        c.y = j * spacing;
        c.alpha = 0.2 + Math.random() * 0.3;
        this.container.addChild(c);
        this.crosses.push(c);
      }
    }
  }

  update(deltaTime: number): void {
    const { rotationSpeed } = this.configExt;
    this.crosses.forEach((c, i) => {
      c.rotation += rotationSpeed * deltaTime * (i % 2 === 0 ? 1 : -1);
    });
  }
}

// Radial Rectangles Effect
export interface RadialRectanglesConfig extends EffectConfig {
  color: string;
  count: number;
  rectWidth: number;
  rectHeight: number;
  rotationSpeed: number;
}

export class RadialRectanglesEffect extends BaseEffect {
  private rects: PIXI.Graphics[] = [];
  private configExt!: RadialRectanglesConfig;

  init(app: PIXI.Application): void {
    this.configExt = this.config as RadialRectanglesConfig;
    const { count, rectWidth, rectHeight, color } = this.configExt;

    const cx = app.screen.width / 2;
    const cy = app.screen.height / 2;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const rect = new PIXI.Graphics();

      rect.fill(color);
      rect.rect(-rectWidth / 2, -rectHeight / 2, rectWidth, rectHeight);
      rect.stroke({ width: 2, color: 0xffffff, alpha: 0.5 });

      rect.x = cx + Math.cos(angle) * 50;
      rect.y = cy + Math.sin(angle) * 50;
      rect.rotation = angle + Math.PI / 4;

      this.container.addChild(rect);
      this.rects.push(rect);

      // Animate expanding
      gsap.to(rect, {
        x: cx + Math.cos(angle) * (150 + Math.random() * 100),
        y: cy + Math.sin(angle) * (150 + Math.random() * 100),
        rotation: rect.rotation + Math.PI,
        duration: 3 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
  }

  update(_deltaTime: number): void {
    // Animation handled by GSAP
  }
}

// Flowing Lines Effect
export interface FlowingLinesConfig extends EffectConfig {
  color: string;
  count: number;
  lineLength: number;
  speed: number;
}

export class FlowingLinesEffect extends BaseEffect {
  private lines: { graphics: PIXI.Graphics; offset: number }[] = [];
  private configExt!: FlowingLinesConfig;

  init(app: PIXI.Application): void {
    this.configExt = this.config as FlowingLinesConfig;
    const { count, color, speed } = this.configExt;

    for (let i = 0; i < count; i++) {
      const graphics = new PIXI.Graphics();
      const offset = (i / count) * app.screen.width;

      graphics.moveTo(0, 0);
      for (let y = 0; y < app.screen.height; y += 5) {
        const x = Math.sin((y + Date.now() * speed) * 0.02) * 30;
        graphics.lineTo(x, y);
      }
      graphics.stroke({ width: 2, color: color, alpha: 0.6 });

      graphics.x = offset;
      this.container.addChild(graphics);
      this.lines.push({ graphics, offset });
    }
  }

  update(_deltaTime: number): void {
    const { speed } = this.configExt;
    this.lines.forEach((line, i) => {
      line.graphics.clear();
      line.graphics.moveTo(0, 0);
      for (let y = 0; y < 800; y += 5) {
        const x = Math.sin((y + Date.now() * speed * 0.01) * 0.03 + i) * 40;
        line.graphics.lineTo(x, y);
      }
      line.graphics.stroke({ width: 2, color: this.configExt.color, alpha: 0.6 });
    });
  }
}

// Perspective Grid Effect
export interface PerspectiveGridConfig extends EffectConfig {
  color: string;
  lineCount: number;
  speed: number;
}

export class PerspectiveGridEffect extends BaseEffect {
  private configExt!: PerspectiveGridConfig;

  init(app: PIXI.Application): void {
    this.configExt = this.config as PerspectiveGridConfig;
    this.drawGrid(app.screen.width, app.screen.height);
  }

  private drawGrid(width: number, height: number): void {
    const { color, lineCount } = this.configExt;
    const graphics = new PIXI.Graphics();
    const cx = width / 2;

    // Vertical lines (perspective)
    for (let i = 0; i <= lineCount; i++) {
      const t = i / lineCount;
      const bottomX = t * width;
      const topX = cx + (t - 0.5) * width * 0.3;

      graphics.moveTo(bottomX, height);
      graphics.lineTo(topX, 0);
      graphics.stroke({ width: 1, color: color, alpha: 0.4 });
    }

    // Horizontal lines
    for (let i = 0; i < 15; i++) {
      const t = Math.pow(i / 15, 1.5);
      const y = height - t * height;
      const spread = t * 0.8 + 0.2;
      const leftX = cx - spread * width / 2;
      const rightX = cx + spread * width / 2;

      graphics.moveTo(leftX, y);
      graphics.lineTo(rightX, y);
      graphics.stroke({ width: 1, color: color, alpha: 0.3 });
    }

    this.container.addChild(graphics);
  }

  update(_deltaTime: number): void {
    // Static effect
  }
}

// Diagonal Split Effect
export interface DiagonalSplitConfig extends EffectConfig {
  color1: string;
  color2: string;
  splitPosition: number;
  speed: number;
}

export class DiagonalSplitEffect extends BaseEffect {
  private graphics!: PIXI.Graphics;
  private configExt!: DiagonalSplitConfig;

  init(app: PIXI.Application): void {
    this.configExt = this.config as DiagonalSplitConfig;
    this.graphics = new PIXI.Graphics();
    this.container.addChild(this.graphics);
    this.drawSplit(app.screen.width, app.screen.height);
  }

  private drawSplit(width: number, height: number): void {
    const { splitPosition } = this.configExt;
    this.graphics.clear();

    // Triangle 1
    this.graphics.fill(this.configExt.color1);
    this.graphics.moveTo(0, 0);
    this.graphics.lineTo(width, 0);
    this.graphics.lineTo(width * splitPosition, height);
    this.graphics.closePath();

    // Triangle 2
    this.graphics.fill(this.configExt.color2);
    this.graphics.moveTo(width, 0);
    this.graphics.lineTo(width, height);
    this.graphics.lineTo(width * splitPosition, height);
    this.graphics.closePath();
  }

  update(_deltaTime: number): void {
    // Static effect
  }
}
