import Phaser from 'phaser';
import CityGround from '../../assets/tilesets/1_Terrains_and_Fences_16x16.png';
import CityBuildings from '../../assets/tilesets/4_Generic_Buildings_16x16.png';
import CityTerrains from '../../assets/tilesets/2_City_Terrains_16x16.png';
import CityProps from '../../assets/tilesets/3_City_Props_16x16.png';
import PlayerSprite from '../../assets/spritesheets/character/Premade_Character_18.png';
import PlayerImage from '../../assets/spritesheets/character/Premade_Character_18.png';
export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        console.log('BootScene: Starting preload');
        // Create a basic loading bar
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        //this.progressBar = this.add.graphics();
        //this.progressBox = this.add.graphics();
        //this.progressBox.fillStyle(0x222222, 0.8);
        //this.progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

        this.load.on('progress', (value) => {
            console.log('Load Progress: ' + value);
          //  progressBar.clear();
          //  progressBar.fillStyle(0xffffff, 1);
          //  progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
        });

        this.load.on('filecomplete', (key) => {
            console.log('Loaded: ' + key);
        });

        this.load.on('complete', () => {
            console.log('BootScene: Preload complete');
        });

        this.load.on('loaderror', (file) => {
            console.error('Error loading: ' + file.src);
        });

        // Native Assets
        this.load.spritesheet('player', PlayerSprite, { frameWidth: 16, frameHeight: 32 });

        // Tilesets (Loading as spritesheets for frame access)
        this.load.spritesheet('city-ground', CityGround, { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('city-buildings', CityBuildings, { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('city-terrains', CityTerrains, { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('city-props', CityProps, { frameWidth: 16, frameHeight: 16 });
    }

    create() {
       // if (this.progressBar) this.progressBar.destroy();
       // if (this.progressBox) this.progressBox.destroy();
        console.log('BootScene: Starting MainCity');
        this.scene.start('MainCity');
    }
}
