import { Application, Container } from 'pixi.js';
import {
  BaseEffect,
  type EffectConfig,
  GradientBackgroundEffect,
  DiamondShapesEffect,
  CrossPatternEffect,
  RadialRectanglesEffect,
  FlowingLinesEffect,
  PerspectiveGridEffect,
  DiagonalSplitEffect,
  HeroTextEffect,
  StaggeredTextEffect,
  WaveTextEffect,
  VignetteEffect,
  ScanlinesEffect,
} from './effects/index.js';
import type { TemplateType } from './templates.js';
import { templates } from './templates.js';

export class PVEngine {
  public app!: Application;
  private layers: {
    background: Container;
    decoration: Container;
    text: Container;
    overlay: Container;
  };
  private effects: BaseEffect[] = [];
  private currentTemplate: TemplateType = 'battle';
  private animationSpeed: number = 1;
  private textEffect: HeroTextEffect | StaggeredTextEffect | WaveTextEffect | null = null;

  constructor() {
    this.layers = {
      background: new Container(),
      decoration: new Container(),
      text: new Container(),
      overlay: new Container(),
    };
  }

  async init(canvas: HTMLCanvasElement): Promise<void> {
    this.app = new Application();

    await this.app.init({
      canvas,
      width: 640,
      height: 360,
      backgroundColor: 0x000000,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      antialias: true,
    });

    // Add layers
    this.app.stage.addChild(this.layers.background);
    this.app.stage.addChild(this.layers.decoration);
    this.app.stage.addChild(this.layers.text);
    this.app.stage.addChild(this.layers.overlay);

    // RAF loop
    this.app.ticker.add(this.update.bind(this));

    // Load default template
    this.loadTemplate('battle');
  }

  private update(ticker: { deltaTime: number }): void {
    const delta = (ticker.deltaTime / 60) * this.animationSpeed;
    this.effects.forEach((effect) => {
      if (effect.config.active) {
        effect.update(delta);
      }
    });
  }

  loadTemplate(templateType: TemplateType): void {
    this.currentTemplate = templateType;
    const template = templates[templateType];

    // Clear existing effects
    this.clearEffects();

    // Apply effects
    template.effects.forEach((effectConfig) => {
      this.addEffect(effectConfig.type, effectConfig.config);
    });

    // Add text effect
    this.addTextEffect(template.defaultText);

    // Refresh text with current settings
    if (this.textEffect) {
      const textInput = document.getElementById('text-input') as HTMLInputElement;
      if (textInput) {
        this.updateText(textInput.value);
      }
    }
  }

  private clearEffects(): void {
    this.effects.forEach((effect) => effect.destroy());
    this.effects = [];

    // Clear containers
    Object.values(this.layers).forEach((layer) => {
      layer.removeChildren();
    });

    this.textEffect = null;
  }

  private addEffect(type: string, config: Record<string, unknown>): void {
    let effect: BaseEffect | null = null;

    // Ensure config has active property
    const fullConfig: EffectConfig = {
      ...config,
      active: typeof config.active === 'boolean' ? config.active : true,
    } as EffectConfig;

    switch (type) {
      case 'gradientBackground':
        effect = new GradientBackgroundEffect(fullConfig);
        break;
      case 'diamondShapes':
        effect = new DiamondShapesEffect(fullConfig);
        break;
      case 'crossPattern':
        effect = new CrossPatternEffect(fullConfig);
        break;
      case 'radialRectangles':
        effect = new RadialRectanglesEffect(fullConfig);
        break;
      case 'flowingLines':
        effect = new FlowingLinesEffect(fullConfig);
        break;
      case 'perspectiveGrid':
        effect = new PerspectiveGridEffect(fullConfig);
        break;
      case 'diagonalSplit':
        effect = new DiagonalSplitEffect(fullConfig);
        break;
      case 'vignette':
        effect = new VignetteEffect(fullConfig);
        break;
      case 'scanlines':
        effect = new ScanlinesEffect(fullConfig);
        break;
    }

    if (effect) {
      effect.init(this.app);
      const layer = this.getLayerForEffect(type);
      layer.addChild(effect.container);
      this.effects.push(effect);
    }
  }

  private getLayerForEffect(type: string): Container {
    if (
      [
        'gradientBackground',
        'perspectiveGrid',
        'diagonalSplit',
      ].includes(type)
    ) {
      return this.layers.background;
    }
    if (
      [
        'diamondShapes',
        'crossPattern',
        'radialRectangles',
        'flowingLines',
      ].includes(type)
    ) {
      return this.layers.decoration;
    }
    if (['vignette', 'scanlines'].includes(type)) {
      return this.layers.overlay;
    }
    return this.layers.decoration;
  }

  private addTextEffect(textConfig: {
    text: string;
    fontSize: number;
    color: string;
    strokeColor: string;
    strokeWidth: number;
  }): void {
    const templateType = this.currentTemplate;
    let TextEffectClass: typeof HeroTextEffect | typeof StaggeredTextEffect | typeof WaveTextEffect;

    switch (templateType) {
      case 'battle':
      case 'cyber':
      case 'minimal':
        TextEffectClass = HeroTextEffect;
        break;
      case 'adventure':
        TextEffectClass = StaggeredTextEffect;
        break;
      default:
        TextEffectClass = HeroTextEffect;
    }

    const effect = new TextEffectClass({
      type: templateType === 'adventure' ? 'staggered' : 'hero',
      text: textConfig.text,
      fontSize: textConfig.fontSize,
      color: textConfig.color,
      strokeColor: textConfig.strokeColor,
      strokeWidth: textConfig.strokeWidth,
      duration: 2,
      active: true,
    });

    effect.init(this.app);
    this.layers.text.addChild(effect.container);
    this.effects.push(effect);
    this.textEffect = effect;
  }

  updateText(text: string): void {
    if (this.textEffect instanceof HeroTextEffect) {
      this.textEffect.updateText(text);
    } else if (this.textEffect instanceof StaggeredTextEffect) {
      this.textEffect.updateText(text);
    } else if (this.textEffect instanceof WaveTextEffect) {
      this.textEffect.updateText(text);
    }
  }

  updateTextStyle(params: {
    fontSize?: number;
    color?: string;
    strokeColor?: string;
    strokeWidth?: number;
  }): void {
    if (this.textEffect) {
      // Get current text
      let currentText = 'PIXEL PV';
      if (this.textEffect instanceof HeroTextEffect) {
        currentText = (this.textEffect as unknown as { text: { text: string } }).text?.text || currentText;
      }

      this.layers.text.removeChild(this.textEffect.container);

      const index = this.effects.indexOf(this.textEffect);
      if (index > -1) {
        this.effects.splice(index, 1);
      }

      let TextEffectClass: typeof HeroTextEffect | typeof StaggeredTextEffect | typeof WaveTextEffect;
      switch (this.currentTemplate) {
        case 'adventure':
          TextEffectClass = StaggeredTextEffect;
          break;
        default:
          TextEffectClass = HeroTextEffect;
      }

      const effect = new TextEffectClass({
        type: this.currentTemplate === 'adventure' ? 'staggered' : 'hero',
        text: currentText,
        fontSize: params.fontSize ?? 64,
        color: params.color ?? '#ffffff',
        strokeColor: params.strokeColor ?? '#000000',
        strokeWidth: params.strokeWidth ?? 3,
        duration: 2,
        active: true,
      });

      effect.init(this.app);
      this.layers.text.addChild(effect.container);
      this.effects.push(effect);
      this.textEffect = effect;
    }
  }

  setAnimationSpeed(speed: number): void {
    this.animationSpeed = speed;
  }

  play(): void {
    this.effects.forEach((effect) => effect.play());
  }

  pause(): void {
    this.effects.forEach((effect) => effect.pause());
  }

  getCanvas(): HTMLCanvasElement {
    return this.app.canvas as HTMLCanvasElement;
  }

  getCurrentTemplate(): TemplateType {
    return this.currentTemplate;
  }
}
