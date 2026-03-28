import Phaser from "phaser";
import CityGround from "../../assets/tilesets/1_Terrains_and_Fences_16x16.png";
import CityBuildings from "../../assets/tilesets/4_Generic_Buildings_16x16.png";
import CityTerrains from "../../assets/tilesets/2_City_Terrains_16x16.png";
import CityProps from "../../assets/tilesets/3_City_Props_16x16.png";
import PlayerSprite from "../../assets/spritesheets/character/Premade_Character_18.png";
import PlayerImage from "../../assets/spritesheets/character/Premade_Character_18.png";
import BGMusic from "../../assets/music/bg_music.mp3";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    console.log("BootScene: Starting preload");
    // Create a basic loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    //this.progressBar = this.add.graphics();
    //this.progressBox = this.add.graphics();
    //this.progressBox.fillStyle(0x222222, 0.8);
    //this.progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    this.load.on("progress", (value) => {
      console.log("Load Progress: " + value);
      //  progressBar.clear();
      //  progressBar.fillStyle(0xffffff, 1);
      //  progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on("filecomplete", (key) => {
      console.log("Loaded: " + key);
    });

    this.load.on("complete", () => {
      console.log("BootScene: Preload complete");
    });

    this.load.on("loaderror", (file) => {
      console.error("Error loading: " + file.src);
    });

    // Native Assets
    this.load.spritesheet("player", PlayerSprite, {
      frameWidth: 16,
      frameHeight: 32,
    });

    // Tilesets (Loading as spritesheets for frame access)
    this.load.spritesheet("city-ground", CityGround, {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("city-buildings", CityBuildings, {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("city-terrains", CityTerrains, {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("city-props", CityProps, {
      frameWidth: 16,
      frameHeight: 16,
    });

    // Audio
    this.load.audio("bg-music", BGMusic);
  }

  create() {
    // if (this.progressBar) this.progressBar.destroy();
    // if (this.progressBox) this.progressBox.destroy();
    console.log("BootScene: Starting MainCity");
    this.createAnimations();
    this.scene.start("MainCity");
  }

  createAnimations() {
    const anims = this.anims;
    const animList = [
      { key: "walk-down", start: 130, end: 135 },
      { key: "walk-up", start: 118, end: 123 },
      { key: "walk-left", start: 124, end: 128 },
      { key: "walk-right", start: 112, end: 117 },
      { key: "idle-down", start: 74, end: 79 },
      { key: "idle-up", start: 62, end: 67 },
      { key: "idle-right", start: 56, end: 61 },
      { key: "idle-left", start: 68, end: 73 },
    ];

    animList.forEach((anim) => {
      if (!anims.exists(anim.key)) {
        anims.create({
          key: anim.key,
          frames: anims.generateFrameNumbers("player", {
            start: anim.start,
            end: anim.end,
          }),
          frameRate: 5,
          repeat: -1,
        });
      }
    });
  }
}
