import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { NPC } from '../entities/NPC';
import { Building } from '../entities/Building';
import { ModularTerrain } from '../entities/ModularTerrain';
import { EventBus } from '../EventBus';
import PlayerSprite from '../../assets/spritesheets/character/Premade_Character_18.png';
import ModularBuildingsSprite from '../../assets/tilesets/5_Floor_Modular_Buildings_16x16.png';
import CityTerrainSprite from '../../assets/tilesets/2_City_Terrains_16x16.png';
import GenericBuildingsTileMap from '../../assets/tilesets/4_Generic_Buildings_16x16.png'
export class MainCity extends Phaser.Scene {
    constructor() {
        super('MainCity');
    }
    preload() {
        // Player spritesheet
        this.load.spritesheet('player', PlayerSprite, {
            frameWidth: 16,
            frameHeight: 32
        });

        // Modular Buildings spritesheet
        this.load.spritesheet('modular-buildings', ModularBuildingsSprite, {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('generic-building', GenericBuildingsTileMap, {
            frameWidth: 16,
            frameHeight: 16
        })
        // City Terrains tileset (for the background)
        this.load.image('city-terrain', CityTerrainSprite);
    }

    create() {
        console.log('MainCity: Starting create');

        // Setup Modular Terrain (Bottom Layer)
        this.terrain = new ModularTerrain(this, 'city-terrain', 16, 100, 100);

        // Example Street Section (4x4 tiles)
        const streetLayout = [
            [1366, 1367, 1368, 1369],
            [1425, 1426, 1427, 1428],
            [1484, 1485, 1486, 1487],
            [1543, 1544, 1545, 1546]
        ];

        const carStreetLayout = [
            [178],
            [236],
            [295],
            [354],
            [413]
        ]

        // Fill a large area (e.g., 20x20 segments = 80x80 tiles)
        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 20; x++) {
                this.terrain.addSegment(x * 4, y * 4, streetLayout);
            }
        }

        // Add a primary horizontal street at Y-tile 11 (covers rows 11 to 16)
        // 116 (11-16) request: carStreetLayout is 5 tiles high.
        for (let x = 0; x < 80; x++) {
            this.terrain.addSegment(x, 26, carStreetLayout);
        }

        this.cameras.main.setBackgroundColor('#000000'); // Black background for city

        const citySize = 100 * 16; // 1600px
        this.physics.world.setBounds(0, 0, citySize, citySize);
        this.cameras.main.setBounds(0, 0, citySize, citySize);

        console.log('MainCity: Creating player');
        // Setup Player
        this.player = new Player(this, 200, 400, 'player');
        this.player.setScale(1);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        // Granular Building Part Library with explicit widths
        const buildingParts = [
            // Roof Top Row
            { id: 'redRoofEdgeLeftTop', tiles: [2752, 2784, 2816, 2848, 2880, 2912, 2944, 2976, 3008, 3040], width: 1, collisions: [{ "x": 0, "y": 0, "width": 16, "height": 159, "isSensor": false }] },
            {
                id: 'redRoofEdgeMiddleTop', tiles: [2753, 2754, 2755, 2756, 2757, 2785, 2786, 2787, 2788, 2789, 2817, 2818, 2819, 2820, 2821, 2849, 2850, 2851, 2852, 2853, 2881, 2882, 2883, 2884, 2885, 2913, 2914, 2915, 2916, 2917, 2945, 2946, 2947, 2948, 2949, 2977, 2978, 2979, 2980, 2981, 3009, 3010, 3011, 3012, 3013, 3041, 3042, 3043, 3044, 3045], width: 5, collisions:
                    [{ "x": 0, "y": 0, "width": 79, "height": 18, "isSensor": false },
                    { "x": 0, "y": 94, "width": 81, "height": 64, "isSensor": false }]
            },
            { id: 'redRoofEdgeRightTop', tiles: [2752, 2784, 2816, 2848, 2880, 2912, 2944, 2976, 3008, 3040], flipX: true, width: 1, collisions: [{ "x": 0, "y": 0, "width": 16, "height": 159, "isSensor": false }] },
            // Middle Building Row
            {
                id: 'redBuildingMiddleEdgeLeft', tiles: [3104, 3136, 3168], width: 1,
                collisions: [{ "x": 0, "y": 0, "width": 16, "height": 50, "isSensor": false }]
            },
            {
                id: 'redBuildingMiddleEdgeMiddle', tiles: [3105, 3106, 3107, 3108, 3109, 3137, 3138, 3139, 3140, 3141, 3169, 3170, 3171, 3172, 3173], width: 5,
                collisions: [{ "x": 0, "y": 0, "width": 82, "height": 49, "isSensor": false }]
            },
            {
                id: 'redBuildingMiddleEdgeRight', tiles: [3104, 3136, 3168], flipX: true, width: 1,
                collisions: [{ "x": 0, "y": 0, "width": 16, "height": 50, "isSensor": false }]
            },
            // Ground Building Row
            {
                id: 'redBuildingGroundEdgeLeft', tiles: [3232, 3264, 3296, 3328], width: 1, collisions: [
                    { "x": 0, "y": 0, "width": 17, "height": 65, "isSensor": false }
                ]
            },
            {
                id: 'redBuildingGroundEdgeMiddle',
                tiles: [3233, 3234, 3235, 3236, 3237, 3265, 3266, 3267, 3268, 3269, 3297, 3298, 3299, 3300, 3301, 3329, 3330, 3331, 3332, 3333],
                width: 5,
                collisions: [
                    { "x": 0, "y": 0, "width": 18, "height": 64, "isSensor": false },
                    { "x": 62, "y": 0, "width": 21, "height": 59, "isSensor": false },
                    { "x": 32, "y": 0, "width": 9, "height": 6, "isSensor": false },
                    { "x": 16, "y": 0, "width": 43, "height": 21, "isSensor": false },
                    { x: 16, y: 16, width: 48, height: 48, id: 'main_entrance', isSensor: true }
                ]
            },
            {
                id: 'redBuildingGroundEdgeRight', tiles: [3232, 3264, 3296, 3328], flipX: true, width: 1, collisions: [
                    { "x": 0, "y": 0, "width": 17, "height": 65, "isSensor": false }
                ]
            }
        ];

        // 2D Recipe for a complex building
        const redBuildingRecipe = [
            ['redRoofEdgeLeftTop', 'redRoofEdgeMiddleTop', 'redRoofEdgeRightTop'],
            ['redBuildingMiddleEdgeLeft', 'redBuildingMiddleEdgeMiddle', 'redBuildingMiddleEdgeRight'],
            ['redBuildingMiddleEdgeLeft', 'redBuildingMiddleEdgeMiddle', 'redBuildingMiddleEdgeRight'],
            ['redBuildingGroundEdgeLeft', 'redBuildingGroundEdgeMiddle', 'redBuildingGroundEdgeRight']
        ];

        const collisionConfig = {
            'main_entrance': {
                onEnter: (sensor) => {
                    console.log('--- ENTRANCE TRIGGERED ---', sensor.partId);
                    // You could emit a custom event or change scene here
                }
            }
        };

        // Create the Building instance (16px tiles, scale 1) with debug enabled
        this.buildingOne = new Building(this, 0, 0, 'generic-building', redBuildingRecipe, buildingParts, 1, collisionConfig, true);
        // Create the Building instance (16px tiles, scale 1) with debug enabled
        this.buildingTwo = new Building(this, 114, 0, 'generic-building', redBuildingRecipe, buildingParts, 1, collisionConfig, true);
        // Create the Building instance (16px tiles, scale 1) with debug enabled
        this.buildingThree = new Building(this, 228, 0, 'generic-building', redBuildingRecipe, buildingParts, 1, collisionConfig, true);

        this.buildings = [this.buildingOne, this.buildingTwo, this.buildingThree];

        // Debug Toggle Key
        this.input.keyboard.on('keydown-G', () => {
            this.buildings.forEach(b => {
                if (b && b.list) {
                    b.list.forEach(child => {
                        if (child instanceof Phaser.GameObjects.Rectangle) {
                            child.setVisible(!child.visible);
                        }
                    });
                }
            });
        });




        // NPCs
        this.npcs = this.physics.add.group();
        const customer1 = new NPC(this, 500, 600, 'player', 'Big G');
        const customer2 = new NPC(this, 500, 100, 'player', 'Lil Smokey');
        //this.npcs.add(customer1);
        //this.npcs.add(customer2);

        // Overlaps & Collisions
        console.log('MainCity: Adding overlaps');
        this.physics.add.collider(this.player, this.buildings);
        //this.physics.add.collider(this.player, this.buildingOne); // Add collision with recipe-based building
        //this.physics.add.collider(this.player, this.buildingTwo); // Add collision with recipe-based building
        //this.physics.add.collider(this.player, this.buildingThree); // Add collision with recipe-based building

        this.physics.add.overlap(this.player, this.buildings, (player, building) => {
            this.showInteractionPrompt('Press E to Enter');
            this.activeTrigger = 'building';
        }, null, this);

        this.physics.add.overlap(this.player, this.npcs, (player, npc) => {
            //if (npc.isWaitingForDelivery) {
            this.showInteractionPrompt('Press E to Deliver');
            this.activeTrigger = 'npc';
            this.activeNPC = npc;
            //}
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

        // Y-sorting for all relevant objects
        const sortableObjects = [this.player, this.buildingOne, this.buildingTwo, this.buildingThree];
        // Add NPCs if they exist
        if (this.npcs) {
            this.npcs.getChildren().forEach(npc => sortableObjects.push(npc));
        }

        sortableObjects.forEach(obj => {
            if (!obj) return;

            let sortY = obj.y;
            if (obj instanceof Building) {
                // Buildings use their calculated sortYOffset which is based on solid colliders
                sortY = obj.y + (obj.sortYOffset || obj.totalHeight || 0);
            } else if (obj instanceof Player || obj instanceof NPC) {
                // Characters are origin 0.5, 0.5, so bottom is y + half height
                // They are scaled, so we consider that
                sortY = obj.y + (obj.displayHeight / 2);
            }

            obj.setDepth(sortY);
        });
    }
}
