import type { EffectConfig } from './effects/base.js';

export type TemplateType = 'battle' | 'cyber' | 'adventure' | 'minimal';

export interface TemplateEffect {
  type: string;
  config: EffectConfig;
}

export interface Template {
  name: string;
  effects: TemplateEffect[];
  defaultText: {
    text: string;
    fontSize: number;
    color: string;
    strokeColor: string;
    strokeWidth: number;
  };
}

export const templates: Record<TemplateType, Template> = {
  battle: {
    name: '战场 Battle',
    defaultText: {
      text: 'BATTLE',
      fontSize: 72,
      color: '#ff4444',
      strokeColor: '#000000',
      strokeWidth: 4,
    },
    effects: [
      {
        type: 'gradientBackground',
        config: {
          active: true,
          color1: '#1a0a0a',
          color2: '#4a1010',
          alpha: 0.8,
          angle: 45,
        },
      },
      {
        type: 'radialRectangles',
        config: {
          active: true,
          color: '#ff4444',
          count: 8,
          rectWidth: 40,
          rectHeight: 120,
          rotationSpeed: 0.5,
        },
      },
      {
        type: 'diagonalSplit',
        config: {
          active: true,
          color1: '#ff000044',
          color2: '#00000044',
          splitPosition: 0.6,
          speed: 0,
        },
      },
      {
        type: 'scanlines',
        config: {
          active: true,
          color: 0x000000,
          alpha: 0.3,
          lineSpacing: 4,
          lineWidth: 2,
          speed: 0.5,
        },
      },
    ],
  },

  cyber: {
    name: '赛博 Cyber',
    defaultText: {
      text: 'CYBER',
      fontSize: 64,
      color: '#00ffff',
      strokeColor: '#000000',
      strokeWidth: 3,
    },
    effects: [
      {
        type: 'gradientBackground',
        config: {
          active: true,
          color1: '#0a0a2a',
          color2: '#1a1a4a',
          alpha: 0.9,
          angle: 180,
        },
      },
      {
        type: 'perspectiveGrid',
        config: {
          active: true,
          color: '#00ffff',
          lineCount: 20,
          speed: 0,
        },
      },
      {
        type: 'flowingLines',
        config: {
          active: true,
          color: '#00ffff',
          count: 6,
          lineLength: 200,
          speed: 1.5,
        },
      },
      {
        type: 'vignette',
        config: {
          active: true,
          color: 0x000000,
          alpha: 0.6,
          intensity: 1.2,
        },
      },
    ],
  },

  adventure: {
    name: '冒险 Adventure',
    defaultText: {
      text: 'ADVENTURE',
      fontSize: 56,
      color: '#44ff88',
      strokeColor: '#000000',
      strokeWidth: 3,
    },
    effects: [
      {
        type: 'gradientBackground',
        config: {
          active: true,
          color1: '#0a2a1a',
          color2: '#1a4a2a',
          alpha: 0.85,
          angle: 135,
        },
      },
      {
        type: 'diamondShapes',
        config: {
          active: true,
          color: '#44ff88',
          count: 15,
          size: 30,
          speed: 1,
        },
      },
      {
        type: 'crossPattern',
        config: {
          active: true,
          color: '#44ff88',
          spacing: 60,
          lineWidth: 2,
          rotationSpeed: 0.2,
        },
      },
    ],
  },

  minimal: {
    name: '极简 Minimal',
    defaultText: {
      text: 'MINIMAL',
      fontSize: 80,
      color: '#ffffff',
      strokeColor: '#000000',
      strokeWidth: 2,
    },
    effects: [
      {
        type: 'gradientBackground',
        config: {
          active: true,
          color1: '#1a1a1a',
          color2: '#2a2a2a',
          alpha: 1,
          angle: 90,
        },
      },
      {
        type: 'vignette',
        config: {
          active: true,
          color: 0x000000,
          alpha: 0.7,
          intensity: 1.5,
        },
      },
    ],
  },
};
