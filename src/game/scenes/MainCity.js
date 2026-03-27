import Phaser from "phaser";
import { Player } from "../entities/Player";
import { NPC } from "../entities/NPC";
import { Building } from "../entities/Building";
import { ModularTerrain } from "../entities/ModularTerrain";
import { EventBus } from "../EventBus";
import PlayerSprite from "../../assets/spritesheets/character/Premade_Character_18.png";
import ModularBuildingsSprite from "../../assets/tilesets/5_Floor_Modular_Buildings_16x16.png";
import CityTerrainSprite from "../../assets/tilesets/2_City_Terrains_16x16.png";
import GenericBuildingsTileMap from "../../assets/tilesets/4_Generic_Buildings_16x16.png";
import interiorConfigs from "../configs/interior";
import { buildingsparts, gymParts } from "../configs/buildings";
export class MainCity extends Phaser.Scene {
    constructor() {
        super("MainCity");
    }

    init(data) {
        this.spawnPos = data?.spawnPos || { x: 400, y: 400 };
    }
    preload() {
        // Player spritesheet
        this.load.spritesheet("player", PlayerSprite, {
            frameWidth: 16,
            frameHeight: 32,
        });

        // Modular Buildings spritesheet
        this.load.spritesheet("modular-buildings", ModularBuildingsSprite, {
            frameWidth: 16,
            frameHeight: 16,
        });
        this.load.spritesheet("generic-building", GenericBuildingsTileMap, {
            frameWidth: 16,
            frameHeight: 16,
        });
        // City Terrains tileset (for the background)
        this.load.image("city-terrain", CityTerrainSprite);
    }

    create() {
        console.log("MainCity: Starting create");

        // Define Interior Configurations (imported from config file)

        // Setup Modular Terrain (Bottom Layer)
        this.terrain = new ModularTerrain(this, "city-terrain", 16, 100, 100);

        // Example Street Section (4x4 tiles)
        const streetLayout = [
            [1366, 1367, 1368, 1369],
            [1425, 1426, 1427, 1428],
            [1484, 1485, 1486, 1487],
            [1543, 1544, 1545, 1546],
        ];

        const carStreetLayout = [[178], [236], [295], [354], [413]];

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

        this.cameras.main.setBackgroundColor("#000000"); // Black background for city

        const citySize = 100 * 16; // 1600px
        this.physics.world.setBounds(0, 0, citySize, citySize);
        this.cameras.main.setBounds(0, 0, citySize, citySize);

        console.log("MainCity: Creating player");
        // Setup Player
        this.player = new Player(this, this.spawnPos.x, this.spawnPos.y, "player");
        this.player.setScale(1);

        // Music
        if (this.cache.audio.has("bg-music")) {
            if (!this.sound.get("bg-music")) {
                this.sound.play("bg-music", { loop: true, volume: 0.5 });
            } else if (!this.sound.get("bg-music").isPlaying) {
                this.sound.get("bg-music").play();
            }
        } else {
            console.warn(
                "[MainCity] bg-music not found in cache. Preload might have failed.",
            );
        }

        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.fadeIn(500, 0, 0, 0);


        // Granular Building Part Library with explicit widths
        const buildingParts = buildingsparts

        // 2D Recipe for a complex building
        const redBuildingRecipe = [
            ["redRoofEdgeLeftTop", "redRoofEdgeMiddleTop", "redRoofEdgeRightTop"],
            [
                "redBuildingMiddleEdgeLeft",
                "redBuildingMiddleEdgeMiddle",
                "redBuildingMiddleEdgeRight",
            ],
            [
                "redBuildingMiddleEdgeLeft",
                "redBuildingMiddleEdgeMiddle",
                "redBuildingMiddleEdgeRight",
            ],
            [
                "redBuildingGroundEdgeLeft",
                "redBuildingGroundEdgeMiddle",
                "redBuildingGroundEdgeRight",
            ],
        ];

        const gymRecipe = [["gymUp"], ["gymDown"]];

        const collisionConfig = {
            gym_entrance: {
                onEnter: (sensor) => {
                    if (this.player.frozen) return;
                    console.log("--- ENTERING BUILDING ---", sensor.partId);

                    this.player.frozen = true;
                    this.player.setVelocity(0);
                    this.player.stop();

                    const returnSpawn = { x: this.player.x, y: this.player.y + 20 };
                    const config = interiorConfigs["gym"];
                    if (config.portals[0]) {
                        config.portals[0].spawnPos = returnSpawn;
                    }

                    this.cameras.main.fadeOut(500, 0, 0, 0, (camera, progress) => {
                        if (progress === 1) {
                            this.scene.start("InteriorScene", {
                                config,
                                returnScene: "MainCity",
                                returnSpawn,
                            });
                        }
                    });
                },
            },
            main_entrance: {
                onEnter: (sensor) => {
                    if (this.player.frozen) return;
                    console.log("--- ENTERING BUILDING ---", sensor.partId);

                    this.player.frozen = true;
                    this.player.setVelocity(0);
                    this.player.stop();

                    const returnSpawn = { x: this.player.x, y: this.player.y + 20 };
                    const config = interiorConfigs["condominium"];
                    if (config.portals[0]) {
                        config.portals[0].spawnPos = returnSpawn;
                    }

                    this.cameras.main.fadeOut(500, 0, 0, 0, (camera, progress) => {
                        if (progress === 1) {
                            this.scene.start("InteriorScene", config);
                        }
                    });
                },
            },
        };

        // Create the Building instance (16px tiles, scale 1) with debug enabled
        this.buildingOne = new Building(
            this,
            0,
            0,
            "generic-building",
            redBuildingRecipe,
            buildingParts,
            1,
            collisionConfig,
            true,
        );
        // Create the Building instance (16px tiles, scale 1) with debug enabled
        this.buildingTwo = new Building(
            this,
            114,
            0,
            "generic-building",
            redBuildingRecipe,
            buildingParts,
            1,
            collisionConfig,
            true,
        );
        // Create the Building instance (16px tiles, scale 1) with debug enabled
        this.buildingThree = new Building(
            this,
            228,
            0,
            "generic-building",
            redBuildingRecipe,
            buildingParts,
            1,
            collisionConfig,
            true,
        );

        this.gym = new Building(
            this,
            342,
            150,
            "modular-buildings",
            gymRecipe,
            buildingParts,
            1,
            collisionConfig,
            true,
        );

        this.buildings = [
            this.buildingOne,
            this.buildingTwo,
            this.buildingThree,
            this.gym,
        ];

        // Debug Toggle Key
        this.input.keyboard.on("keydown-G", () => {
            this.buildings.forEach((b) => {
                if (b && b.list) {
                    b.list.forEach((child) => {
                        if (child instanceof Phaser.GameObjects.Rectangle) {
                            child.setVisible(!child.visible);
                        }
                    });
                }
            });
        });

        // NPCs
        this.npcs = this.physics.add.staticGroup();
        const customer1 = new NPC(this, 500, 600, "player", "Big G");
        const customer2 = new NPC(this, 500, 100, "player", "Lil Smokey");
        this.npcs.add(customer1);
        this.npcs.add(customer2);

        // Overlaps & Collisions
        console.log("MainCity: Adding overlaps");
        this.physics.add.collider(this.player, this.buildings);

        this.physics.add.overlap(
            this.player,
            this.buildings,
            (player, building) => {
                this.showInteractionPrompt("Press E to Enter");
                this.activeTrigger = "building";
            },
            null,
            this,
        );

        this.physics.add.overlap(
            this.player,
            this.npcs,
            (player, npc) => {
                this.showInteractionPrompt("Press E to Deal");
                this.activeTrigger = "npc";
                this.activeNPC = npc;
                //}
            },
            null,
            this,
        );
        console.log("MainCity: Overlaps added");

        this.events.on("player-interact", () => {
            if (this.activeTrigger === "building") {
                console.log("Entering Building...");
                // For now just restart city as a test or go to interior if implemented
                this.scene.start("MainCity");
            } else if (this.activeTrigger === "npc" && this.activeNPC) {
                // Emit event to React TradeDialog
                this.player.frozen = true;
                EventBus.emit("open-trade", {
                    npcName: this.activeNPC.npcName,
                    prompt: this.activeNPC.tradeConfig.prompt,
                    price: this.activeNPC.tradeConfig.price,
                    amount: this.activeNPC.tradeConfig.amount,
                });
            }
        });

        // Unfreeze player when React menu closes
        this.handleCloseTrade = () => {
            this.player.frozen = false;
        };
        EventBus.on("close-trade-menu", this.handleCloseTrade);

        this.handleTouchInteract = () => {
            this.events.emit("player-interact");
        };
        EventBus.on("player-interact-touch", this.handleTouchInteract);

        this.promptText = this.add
            .text(400, 500, "", {
                font: "18px Courier",
                fill: "#ffff00",
                backgroundColor: "#000000",
            })
            .setOrigin(0.5);
        console.log("MainCity: create finished");

        // Handle Resize
        this.scale.on("resize", (gameSize) => {
            const { width, height } = gameSize;
            if (this.promptText) {
                this.promptText.setPosition(width / 2, height - 100);
            }
        });
    }

    shutdown() {
        EventBus.off("close-trade-menu", this.handleCloseTrade);
        EventBus.off("player-interact-touch", this.handleTouchInteract);
    }

    showInteractionPrompt(msg) {
        this.promptText.setText(msg);
        this.time.delayedCall(100, () => {
            this.promptText.setText("");
            this.activeTrigger = null;
            this.activeNPC = null;
        });
    }

    update() {
        this.player.update();

        // Y-sorting for all relevant objects
        const sortableObjects = [
            this.player,
            this.buildingOne,
            this.buildingTwo,
            this.buildingThree,
            this.gym,
        ];
        // Add NPCs if they exist
        if (this.npcs) {
            this.npcs.getChildren().forEach((npc) => sortableObjects.push(npc));
        }

        sortableObjects.forEach((obj) => {
            if (!obj) return;

            let sortY = obj.y;
            if (obj instanceof Building) {
                // Buildings use their calculated sortYOffset which is based on solid colliders
                sortY = obj.y + (obj.sortYOffset || obj.totalHeight || 0);
            } else if (obj instanceof Player || obj instanceof NPC) {
                // Characters are origin 0.5, 0.5, so bottom is y + half height
                // They are scaled, so we consider that
                sortY = obj.y + obj.displayHeight / 2;
            }

            obj.setDepth(sortY);
        });
    }
}
