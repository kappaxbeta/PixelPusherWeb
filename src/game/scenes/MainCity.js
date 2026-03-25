import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { NPC } from '../entities/NPC';
import { EventBus } from '../EventBus';
import PlayerSprite from '../../assets/spritesheets/character/Premade_Character_18.png';
export class MainCity extends Phaser.Scene {
    constructor() {
        super('MainCity');
    }
    preload() {
    // Replace 32 with the actual width/height of one character frame
    this.load.spritesheet('player',PlayerSprite, { 
        frameWidth: 16, 
        frameHeight: 32 
    });
}

    create() {
        console.log('MainCity: Starting create');

        this.cameras.main.setBackgroundColor('#ff00ff'); // Bright Magenta

        // Debug Marker
        this.add.rectangle(400, 300, 200, 200, 0xffffff); // Big White Square in center
        this.add.text(400, 300, 'RENDER OK', { font: '64px Courier', fill: '#000000' }).setOrigin(0.5);

        console.log('MainCity: Creating animations');
        this.anims.create({
            key: 'walk-down',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'walk-up',
            frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'walk-left',
            frames: this.anims.generateFrameNumbers('player', { start: 12, end: 15 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'walk-right',
            frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'idle-down',
            frames: [{ key: 'player', frame: 0 }],
            frameRate: 10
        });

        console.log('MainCity: Creating player');
        // Setup Player
        this.player = new Player(this, 100, 100, 'player');
        this.player.setScale(4);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        // Buildings
        this.buildings = this.physics.add.staticGroup();
        const buildingPositions = [
            { x: 300, y: 300, label: 'SHOP', frame: 1 },
            { x: 600, y: 500, label: 'OFFICE', frame: 5 },
            { x: 100, y: 500, label: 'HOME', frame: 9 },
        ];

        buildingPositions.forEach(pos => {
            const b = this.add.rectangle(pos.x, pos.y, 64, 64, 0x333333);
            this.physics.add.existing(b, true);
            this.buildings.add(b);
            this.add.text(pos.x, pos.y - 60, pos.label, { font: '14px Courier', fill: '#00ff00' }).setOrigin(0.5);
            this.add.image(pos.x, pos.y, 'city-buildings', pos.frame).setScale(2);
        });

        // NPCs
        this.npcs = this.physics.add.group();
        const customer1 = new NPC(this, 500, 300, 'player', 'Big G');
        const customer2 = new NPC(this, 200, 400, 'player', 'Lil Smokey');
        //this.npcs.add(customer1);
        //this.npcs.add(customer2);

        // Overlaps & Collisions
        console.log('MainCity: Adding overlaps');
        this.physics.add.collider(this.player, this.buildings);

        this.physics.add.overlap(this.player, this.buildings, (player, building) => {
            this.showInteractionPrompt('Press E to Enter');
            this.activeTrigger = 'building';
        }, null, this);

        this.physics.add.overlap(this.player, this.npcs, (player, npc) => {
            if (npc.isWaitingForDelivery) {
                this.showInteractionPrompt('Press E to Deliver');
                this.activeTrigger = 'npc';
                this.activeNPC = npc;
            }
        }, null, this);
        console.log('MainCity: Overlaps added');

        this.events.on('player-interact', () => {
            if (this.activeTrigger === 'building') {
                console.log('Entering Building...');
                // For now just restart city as a test or go to interior if implemented
                this.scene.start('MainCity');
            } else if (this.activeTrigger === 'npc' && this.activeNPC) {
                if (this.activeNPC.deliver()) {
                    EventBus.emit('delivery-complete', { money: 100, amount: 1 });
                    console.log('Delivery complete!');
                }
            }
        });

        EventBus.on('player-interact-touch', () => {
            console.log('Touch interact!');
            this.events.emit('player-interact');
        });

        this.promptText = this.add.text(400, 500, '', { font: '18px Courier', fill: '#ffff00', backgroundColor: '#000000' }).setOrigin(0.5);
        console.log('MainCity: create finished');
    }

    showInteractionPrompt(msg) {
        this.promptText.setText(msg);
        this.time.delayedCall(100, () => {
            this.promptText.setText('');
            this.activeTrigger = null;
            this.activeNPC = null;
        });
    }

    update() {
        this.player.update();
    }
}
