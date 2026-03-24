import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MainCity } from './scenes/MainCity';
import { InteriorScene } from './scenes/InteriorScene';

export const config = {
    type: Phaser.AUTO,
    parent: 'phaser-container',
    backgroundColor: '#2d2d2d',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    },
    scene: [BootScene, MainCity, InteriorScene],
};
