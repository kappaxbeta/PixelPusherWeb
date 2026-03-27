import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { MainCity } from "./scenes/MainCity";
import { InteriorScene } from "./scenes/InteriorScene";

export const config = {
  type: Phaser.AUTO,
  parent: "phaser-container",
  backgroundColor: "#2d2d2d",
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [MainCity, BootScene, InteriorScene],
};
