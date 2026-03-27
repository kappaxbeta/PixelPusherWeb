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
import GymLayer1 from "../../assets/interior/gym/Gym_layer_1.png";
import GymLayer2 from "../../assets/interior/gym/Gym_layer_2.png";
import CondominiumLayer1 from "../../assets/interior/condominium/Condominium_Design_2_layer_1.png";
import CondominiumLayer2 from "../../assets/interior/condominium/Condominium_Design_2_layer_2.png";
import flat1 from "../../assets/interior/home/Generic_Home_1_Layer_1.png";
import flat2 from "../../assets/interior/home/Generic_Home_1_Layer_2_.png";
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

    // Define Interior Configurations
    const interiorConfigs = {
      condominium: {
        buildingId: "Condominium",
        collision: [
          { x: 1, y: 79, width: 29, height: 16, isSensor: false },
          { x: 1, y: 0, width: 16, height: 81, isSensor: false },
          { x: 17, y: 1, width: 15, height: 30, isSensor: false },
          { x: 49, y: 0, width: 31, height: 30, isSensor: false },
          { x: 97, y: 0, width: 30, height: 30, isSensor: false },
          { x: 144, y: 0, width: 32, height: 30, isSensor: false },
          { x: 192, y: 0, width: 32, height: 31, isSensor: false },
          { x: 207, y: 31, width: 17, height: 57, isSensor: false },
          { x: 193, y: 79, width: 15, height: 19, isSensor: false },
          { x: 64, y: 79, width: 96, height: 17, isSensor: false },
          { x: 25, y: 94, width: 41, height: 4, isSensor: false },
          { x: 159, y: 96, width: 38, height: 7, isSensor: false },
          { x: 28, y: 1, width: 169, height: 17, isSensor: false },
        ],
        imageLayer: [CondominiumLayer1, CondominiumLayer2],
        playerStart: { x: 43, y: 61 },
        portals: [
          {
            x: 30,
            y: 82,
            width: 35,
            height: 12,
            target: "MainCity",
            id: "exit",
          },
          {
            x: 159,
            y: 82,
            width: 35,
            height: 12,
            isSensor: false,
            target: "Condominium",
            id: "entry",
          },
          {
            x: 32,
            y: 0,
            width: 17,
            height: 30,
            isSensor: false,
            target: "flat",
            id: "entry_flat1",
          },
          {
            x: 79,
            y: 3,
            width: 17,
            height: 25,
            target: "flat",
            id: "entry_flat2",
          },
          {
            x: 127,
            y: 0,
            width: 18,
            height: 27,
            target: "flat",
            id: "entry_flat3",
          },
          {
            x: 174,
            y: 2,
            width: 19,
            height: 26,
            target: "flat",
            id: "entry_flat4",
          },
        ],
        subInteriors: {
          flat: {
            buildingId: "Flat",
            collision: [
              { x: -1, y: -1, width: 50, height: 62, isSensor: false },
              { x: 49, y: -1, width: 158, height: 32, isSensor: false },
              { x: 192, y: 28, width: 33, height: 51, isSensor: false },
              { x: 224, y: 79, width: 1, height: 22, isSensor: false },
              { x: 193, y: 99, width: 31, height: 118, isSensor: false },
              { x: 1, y: 113, width: 0, height: 0, isSensor: false },
              { x: 1, y: 96, width: 46, height: 119, isSensor: false },
              { x: -7, y: 61, width: 8, height: 38, isSensor: false },
              { x: 47, y: 127, width: 64, height: 32, isSensor: false },
              { x: 129, y: 129, width: 72, height: 30, isSensor: false },
              { x: 47, y: 209, width: 152, height: 6, isSensor: false },
            ],
            imageLayer: [flat1, flat2],
            playerStart: { x: 113, y: 100 },
            portals: [
              {
                x: 105,
                y: 190,
                width: 30,
                height: 10,
                target: "Condominium",
                scene: "InteriorScene",
                id: "exit",
              },
            ],
          },
        },
      },
      gym: {
        buildingId: "Gym",
        collision: [
          { x: 225, y: 209, width: 81, height: 30, isSensor: false },
          { x: -1, y: 208, width: 178, height: 31, isSensor: false },
          { x: 3, y: 47, width: 14, height: 162, isSensor: false },
          { x: 1, y: 0, width: 15, height: 47, isSensor: false },
          { x: 6, y: 0, width: 170, height: 31, isSensor: false },
          { x: 159, y: 1, width: 50, height: 78, isSensor: false },
          { x: 209, y: 0, width: 94, height: 33, isSensor: false },
          { x: 290, y: 33, width: 15, height: 181, isSensor: false },
          { x: 223, y: 143, width: 67, height: 33, isSensor: false },
          { x: 15, y: 130, width: 161, height: 30, isSensor: false },
          { x: 176, y: 238, width: 50, height: 5, isSensor: false },
        ],
        imageLayer: [GymLayer1, GymLayer2],
        playerStart: { x: 187, y: 200 },
        portals: [
          {
            x: 175,
            y: 223,
            width: 51,
            height: 17,
            target: "MainCity",

            id: "exit",
          },
        ],
      },
      red_building_hallway: {
        buildingId: "Red Building Hallway",
        tileset: "city-props",
        mapData: [
          [80, 80, 80, 80, 80, 80, 80, 80, 80, 80],
          [80, 5, 5, 5, 5, 5, 5, 5, 5, 80],
          [80, 5, 5, 5, 5, 5, 5, 5, 5, 80],
          [80, 80, 80, 5, 5, 5, 5, 80, 80, 80],
          [80, 1, 1, 5, 5, 5, 5, 1, 1, 80],
          [80, 1, 1, 5, 5, 5, 5, 1, 1, 80],
          [80, 80, 80, 80, 5, 5, 80, 80, 80, 80],
        ],
        playerStart: { x: 320, y: 400 },
        portals: [
          {
            x: 320,
            y: 440,
            width: 64,
            height: 32,
            target: "MainCity",
            id: "exit",
          },
          {
            x: 100,
            y: 100,
            width: 32,
            height: 32,
            target: "Flat_101",
            id: "door_101",
          },
          {
            x: 540,
            y: 100,
            width: 32,
            height: 32,
            target: "Flat_102",
            id: "door_102",
          },
        ],
        subInteriors: {
          Flat_101: {
            buildingId: "Flat 101",
            tileset: "city-props",
            mapData: [
              [5, 5, 5],
              [5, 5, 5],
              [5, 5, 5],
            ],
            playerStart: { x: 100, y: 100 },
            npcs: [
              {
                x: 150,
                y: 120,
                name: "Dealer Dan",
                config: {
                  type: "buy",
                  item: "weed",
                  amount: 1,
                  price: 60,
                  prompt: "Sell 1g for $60?",
                },
              },
            ],
            portals: [{ x: 100, y: 150, target: "red_building_hallway" }],
          },
        },
      },
    };

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

    const gymParts = [
      {
        id: "gymDown",
        tiles: [
          2795, 2796, 2797, 2798, 2799, 2800, 2801, 2827, 2828, 2829, 2830,
          2831, 2832, 2833, 2859, 2860, 2861, 2862, 2863, 2864, 2865,
        ],
        width: 7,
        collisions: [
          { x: 0, y: 0, width: 76, height: 44, isSensor: false },
          {
            x: 274 - 177,
            y: 1393 - 1393,
            width: 13,
            height: 43,
            isSensor: false,
          },
          {
            x: 254 - 177,
            y: 1391 - 1393,
            width: 20,
            height: 17,
            isSensor: false,
          },
          {
            x: 254 - 177,
            y: 1413 - 1393,
            width: 19,
            height: 24,
            isSensor: true,
            id: "gym_entrance",
          },
        ],
      },
      {
        id: "gymUp",
        tiles: [
          2922, 2923, 2924, 2925, 2926, 2927, 2928, 2954, 2955, 2956, 2957,
          2958, 2959, 2960, 2986, 2987, 2988, 2989, 2990, 2991, 2992, 3018,
          3019, 3020, 3021, 3022, 3023, 3024, 3050, 3051, 3052, 3053, 3054,
          3055, 3056, 3082, 3083, 3084, 3085, 3086, 3087, 3088, 3114, 3115,
          3116, 3117, 3118, 3119, 3120,
        ],
        width: 7,
        collisions: [{ x: 5, y: 20, width: 108, height: 97, isSensor: false }],
      },
    ];
    // Granular Building Part Library with explicit widths
    const buildingParts = [
      ...gymParts,
      // Roof Top Row
      {
        id: "redRoofEdgeLeftTop",
        tiles: [2752, 2784, 2816, 2848, 2880, 2912, 2944, 2976, 3008, 3040],
        width: 1,
        collisions: [{ x: 0, y: 0, width: 16, height: 159, isSensor: false }],
      },
      {
        id: "redRoofEdgeMiddleTop",
        tiles: [
          2753, 2754, 2755, 2756, 2757, 2785, 2786, 2787, 2788, 2789, 2817,
          2818, 2819, 2820, 2821, 2849, 2850, 2851, 2852, 2853, 2881, 2882,
          2883, 2884, 2885, 2913, 2914, 2915, 2916, 2917, 2945, 2946, 2947,
          2948, 2949, 2977, 2978, 2979, 2980, 2981, 3009, 3010, 3011, 3012,
          3013, 3041, 3042, 3043, 3044, 3045,
        ],
        width: 5,
        collisions: [
          { x: 0, y: 0, width: 79, height: 18, isSensor: false },
          { x: 0, y: 94, width: 81, height: 64, isSensor: false },
        ],
      },
      {
        id: "redRoofEdgeRightTop",
        tiles: [2752, 2784, 2816, 2848, 2880, 2912, 2944, 2976, 3008, 3040],
        flipX: true,
        width: 1,
        collisions: [{ x: 0, y: 0, width: 16, height: 159, isSensor: false }],
      },
      // Middle Building Row
      {
        id: "redBuildingMiddleEdgeLeft",
        tiles: [3104, 3136, 3168],
        width: 1,
        collisions: [{ x: 0, y: 0, width: 16, height: 50, isSensor: false }],
      },
      {
        id: "redBuildingMiddleEdgeMiddle",
        tiles: [
          3105, 3106, 3107, 3108, 3109, 3137, 3138, 3139, 3140, 3141, 3169,
          3170, 3171, 3172, 3173,
        ],
        width: 5,
        collisions: [{ x: 0, y: 0, width: 82, height: 49, isSensor: false }],
      },
      {
        id: "redBuildingMiddleEdgeRight",
        tiles: [3104, 3136, 3168],
        flipX: true,
        width: 1,
        collisions: [{ x: 0, y: 0, width: 16, height: 50, isSensor: false }],
      },
      // Ground Building Row
      {
        id: "redBuildingGroundEdgeLeft",
        tiles: [3232, 3264, 3296, 3328],
        width: 1,
        collisions: [{ x: 0, y: 0, width: 17, height: 65, isSensor: false }],
      },
      {
        id: "redBuildingGroundEdgeMiddle",
        tiles: [
          3233, 3234, 3235, 3236, 3237, 3265, 3266, 3267, 3268, 3269, 3297,
          3298, 3299, 3300, 3301, 3329, 3330, 3331, 3332, 3333,
        ],
        width: 5,
        collisions: [
          { x: 0, y: 0, width: 18, height: 64, isSensor: false },
          { x: 62, y: 0, width: 21, height: 59, isSensor: false },
          { x: 32, y: 0, width: 9, height: 6, isSensor: false },
          { x: 16, y: 0, width: 43, height: 21, isSensor: false },
          {
            x: 16,
            y: 16,
            width: 48,
            height: 48,
            id: "main_entrance",
            isSensor: true,
          },
        ],
      },
      {
        id: "redBuildingGroundEdgeRight",
        tiles: [3232, 3264, 3296, 3328],
        flipX: true,
        width: 1,
        collisions: [{ x: 0, y: 0, width: 17, height: 65, isSensor: false }],
      },
    ];

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
