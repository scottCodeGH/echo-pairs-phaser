import Phaser from 'phaser';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { WinScene } from './scenes/WinScene';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#3498db',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [MenuScene, GameScene, WinScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
};

export const GAME_CONFIG = {
  GRID_ROWS: 4,
  GRID_COLS: 4,
  CARD_WIDTH: 100,
  CARD_HEIGHT: 140,
  CARD_SPACING: 20,
  FLIP_DURATION: 300,
  MATCH_DELAY: 500,
  MISMATCH_DELAY: 1000,
};
