import * as Phaser from 'phaser';
import { GameScene } from './scenes/game-scene';
import { PreloadScene } from './scenes/preload-scene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'matter',
        matter: {
            gravity: { x: 0, y: 0.5 }
        }
    },
    scene: [PreloadScene, GameScene]
};

const game = new Phaser.Game(config);