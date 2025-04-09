import * as Phaser from 'phaser';
import { GameScene } from './scenes/game-scene';

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
      default: 'matter',
      matter: {
          gravity: { x: 0, y: 0.5 }
      }
  },
  scene: GameScene
};
const game = new Phaser.Game(gameConfig);