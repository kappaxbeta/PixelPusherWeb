import Phaser from "phaser";
import { Player } from "../entities/Player";
import { NPC } from "../entities/NPC";
import { EventBus } from "../EventBus";

export class InteriorScene extends Phaser.Scene {
  constructor() {
    super("InteriorScene");
  }

  init(data) {
    // config could be direct or wrapped in { config, returnScene, returnSpawn, returnConfig }
    if (data && data.config) {
      this.config = data.config;
      this.returnScene = data.returnScene || "MainCity";
      this.returnSpawn = data.returnSpawn;
      this.returnConfig = data.returnConfig;
    } else {
      this.config = data || {};
      this.returnScene = "MainCity";
      this.returnSpawn = this.config.portals
        ? this.config.portals[0]?.spawnPos
        : null;
      this.returnConfig = null;
    }

    // Reset transition guard whenever we enter/restart a scene
    this.isTransitioning = false;

    console.log(
      "InteriorScene Init:",
      this.config?.buildingId,
      "Return:",
      this.returnScene,
    );
  }

  preload() {
    // Dynamic loading of image layers
    if (this.config.imageLayer) {
      this.config.imageLayer.forEach((path, idx) => {
        const key = `layer_${this.config.buildingId}_${idx}`;
        // Note: Using the provided path string. In a real Vite setup,
        // these might need proper resolution if not in /public
        this.load.image(key, path);
      });
    }
  }

  create(data) {
    console.log(
      `[InteriorScene] Create started at ${new Date().toLocaleTimeString()}. Building: ${this.config?.buildingId}`,
    );

    const { mapData, tileset, portals, playerStart, imageLayer, collision } =
      this.config;
    const gridScale = 4;

    // 1. Setup Background (Tilemap or Image Layers)
    if (imageLayer) {
      imageLayer.forEach((_, idx) => {
        const key = `layer_${this.config.buildingId}_${idx}`;
        const img = this.add.image(0, 0, key).setOrigin(0);
        img.setScale(gridScale);
        img.setDepth(idx); // Base layers at the bottom
      });
    } else if (mapData) {
      const map = this.make.tilemap({
        data: mapData,
        tileWidth: 16,
        tileHeight: 16,
      });
      const tiles = map.addTilesetImage(tileset);
      const layer = map.createLayer(0, tiles, 0, 0);
      layer.setScale(4);
      layer.setCollisionByExclusion([-1]);

      // We'll add the player collider later
      this.mapLayer = layer;
    }

    // 2. Setup Player
    const startX = (playerStart?.x || 100) * gridScale;
    const startY = (playerStart?.y || 100) * gridScale;
    this.player = new Player(this, startX, startY, "player");
    this.player.setDepth(100);
    // Adjust body to be just the feet for better top-down collisions
    const bodyW = 12 * gridScale;
    const bodyH = 8 * gridScale;
    this.player.body.setSize(12, 8); // Scaled automatically if using setScale, but let's be explicit
    this.player.body.setOffset(2, 24); // Bottom center-ish

    // Expanded bounds for scaled interior
    const worldW = 320 * gridScale;
    const worldH = 320 * gridScale;
    this.physics.world.setBounds(0, 0, worldW, worldH);
    this.cameras.main.setBounds(0, 0, worldW, worldH);

    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(2);
    this.cameras.main.roundPixels = true;
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // 4. Setup NPC and Portal Groups early to avoid undefined errors in colliders
    this.portals = this.physics.add.staticGroup();
    this.npcs = this.physics.add.group(); // Add NPC group (Dynamic)
    this.debugGraphics = this.add.group();

    if (collision) {
      const scale = 4;
      collision.forEach((c) => {
        const x = c.x * scale;
        const y = c.y * scale;
        const w = c.width * scale;
        const h = c.height * scale;

        const zone = this.add.zone(x + w / 2, y + h / 2, w, h);
        this.physics.add.existing(zone, true);

        if (!c.isSensor) {
          this.physics.add.collider(this.player, zone);
          this.physics.add.collider(this.npcs, zone);
        }

        // Debug view for collisions
        const rect = this.add.rectangle(
          x + w / 2,
          y + h / 2,
          w,
          h,
          0xff0000,
          0.3,
        );
        rect.setStrokeStyle(2, 0xff0000);
        rect.setDepth(1000);
        rect.setVisible(
          this.game.config.physics.arcade.debug || this.showDebug,
        );
        this.debugGraphics.add(rect);
      });
    }

    if (this.mapLayer) {
      this.physics.add.collider(this.player, this.mapLayer);
    }

    // Render portals and setup NPCs
    if (portals) {
      portals.forEach((p, idx) => {
        const x = p.x * gridScale;
        const y = p.y * gridScale;
        const w = (p.width || 32) * gridScale;
        const h = (p.height || 32) * gridScale;

        const portal = this.add.zone(x + w / 2, y + h / 2, w, h);
        this.physics.add.existing(portal, true);
        this.portals.add(portal); // <-- THIS WAS MISSING
        portal.setData("target", p.target);
        portal.setData("spawnPos", p.spawnPos);
        portal.setData("id", p.id || `portal_${idx}`);
        portal.setData("config", p);

        // This overlap is now handled in update()
        // this.physics.add.overlap(this.player, portal, () => {
        //     this.activePortal = portal;
        // });

        // Debug view for portals
        const rect = this.add.rectangle(
          x + w / 2,
          y + h / 2,
          w,
          h,
          0x00ff00,
          0.3,
        );
        rect.setStrokeStyle(2, 0x00ff00);
        rect.setDepth(1000);
        rect.setVisible(this.showDebug);
        this.debugGraphics.add(rect);
      });
    }

    if (this.config.npcs) {
      this.config.npcs.forEach((n) => {
        const npc = new NPC(
          this,
          n.x * gridScale,
          n.y * gridScale,
          "player",
          n.name,
          n.config,
        );
        this.npcs.add(npc);
        npc.setData("id", n.name);
        npc.setData("config", n.config || {});
      });
    }

    // UI Info
    this.add
      .text(10, 10, `Location: ${this.config.buildingId || "Unknown"}`, {
        font: "16px Courier",
        fill: "#ffff00",
        backgroundColor: "#000000",
      })
      .setScrollFactor(0);

    this.interactionPrompt = this.add
      .text(this.scale.width / 2, this.scale.height - 50, "", {
        fontSize: "16px",
        fill: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setVisible(false)
      .setDepth(100);

    // Handle Resize
    this.scale.on("resize", (gameSize) => {
      const { width, height } = gameSize;
      if (this.interactionPrompt) {
        this.interactionPrompt.setPosition(width / 2, height - 50);
      }
    });

    this.exitKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );

    // Debug toggle for portals/collisions
    this.showDebug = !!this.game.config.physics.arcade.debug;
    this.input.keyboard.on("keydown-G", () => {
      this.showDebug = !this.showDebug;
      this.debugGraphics.getChildren().forEach((child) => {
        child.setVisible(this.showDebug);
      });
    });

    // Unfreeze player when React menu closes
    EventBus.on("close-trade-menu", () => {
      this.player.frozen = false;
    });

    // 6. Interaction Handler
    const interactionHandler = () => {
      if (!this.activePortal || this.player.frozen) return;

      const pData = this.activePortal.getData("config") || {};
      const pId = this.activePortal.getData("id") || "";

      if (this.isNearNPC) {
        // Open Trade Menu
        this.player.frozen = true;
        this.activePortal.frozen = true;
        EventBus.emit("open-trade", {
          npcName: this.activePortal.npcName,
          prompt: this.activePortal.tradeConfig.prompt,
          price: this.activePortal.tradeConfig.price,
          amount: this.activePortal.tradeConfig.amount,
        });
      } else if (this.activePortal && !this.isNearNPC) {
        // Any regular portal interaction (Flat doors, etc.)
        this.handlePortal(this.activePortal);
      }
    };

    this.events.on("player-interact", interactionHandler);

    // Listen for global touch interaction events from React UI
    this.handleTouchInteract = () => {
      this.events.emit("player-interact");
    };
    EventBus.on("player-interact-touch", this.handleTouchInteract);
  }

  shutdown() {
    this.events.off("player-interact");
    EventBus.off("player-interact-touch", this.handleTouchInteract);
    EventBus.off("close-trade-menu", this.handleCloseTrade);
  }

  handlePortal(portal) {
    if (this.isTransitioning) return;

    const pData = portal.getData("config") || {};
    const target = portal.getData("target");
    const spawnPos = portal.getData("spawnPos");
    // Prioritize explicit scene from config, else stay in InteriorScene for room-to-room transitions
    const targetScene =
      pData.scene || (target === "MainCity" ? "MainCity" : "InteriorScene");

    console.log(
      `[InteriorScene] handlePortal triggered. Target: ${target}, Scene: ${targetScene}, Spawn:`,
      spawnPos,
    );

    this.isTransitioning = true;

    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      () => {
        console.log(
          `[InteriorScene] Fade out complete. Starting: ${targetScene} (Target: ${target})`,
        );

        if (targetScene === "MainCity") {
          this.scene.start("MainCity", {
            spawnPos: spawnPos || this.returnSpawn,
          });
        } else if (
          targetScene === this.scene.key ||
          targetScene === "InteriorScene"
        ) {
          // Interior to Interior transition (either new sub-room or return to parent)

          // 1. Check if returning to parent (if target matches returnConfig)
          const isReturning =
            this.returnConfig &&
            (target.toLowerCase() ===
              (this.returnConfig.buildingId || "").toLowerCase() ||
              target.toLowerCase() === "condominium");

          if (isReturning) {
            console.log(
              `[InteriorScene] Forcing scene stop/start to return to parent: ${this.returnConfig.buildingId}`,
            );
            this.scene.stop(this.scene.key);
            this.scene.start(this.scene.key, {
              config: this.returnConfig,
              returnScene: "MainCity",
              spawnPos: spawnPos || this.returnSpawn,
            });
          } else {
            const interiorConfig = this.config.subInteriors
              ? this.config.subInteriors[target]
              : null;
            if (interiorConfig) {
              console.log(
                `[InteriorScene] Forcing scene stop/start to enter sub-interior: ${target}`,
              );
              this.scene.stop(this.scene.key);
              this.scene.start(targetScene, {
                config: interiorConfig,
                buildingId: target,
                returnScene: this.scene.key,
                returnConfig: this.config, // SAVE CURRENT (the hallway)
                // Land exactly where we entered (manual E prevents loop)
                returnSpawn: { x: this.player.x / 4, y: this.player.y / 4 },
              });
            } else {
              console.warn(`[InteriorScene] No config for target: ${target}`);
              this.isTransitioning = false;
              this.cameras.main.fadeIn(200);
            }
          }
        } else {
          // Fallback for any other explicitly targeted scene
          this.scene.start(targetScene, {
            target,
            spawnPos: spawnPos || this.returnSpawn,
          });
        }
      },
    );

    // Unfreeze player when React menu closes
    EventBus.on("close-trade-menu", () => {
      this.player.frozen = false;
    });
  }

  update(time, delta) {
    // Update NPCs
    if (this.npcs) {
      this.npcs.getChildren().forEach((npc) => {
        if (npc.update) npc.update(time, delta);
      });
    }

    if (this.player) {
      // Need to reset these each frame as they are set by overlap call below
      this.activePortal = null;
      this.isNearNPC = false;

      // Synchronous overlap check each frame (cleaner than permanent listeners for transient state)
      this.physics.overlap(
        this.player,
        this.portals,
        (player, portal) => {
          this.activePortal = portal;
        },
        null,
        this,
      );

      this.physics.overlap(
        this.player,
        this.npcs,
        (player, npc) => {
          this.activePortal = npc;
          this.isNearNPC = true;
        },
        null,
        this,
      );

      if (this.activePortal) {
        const pData = this.activePortal.getData("config");
        const pId = this.activePortal.getData("id") || "";

        // Trigger automatic transition for HALLWAYS (if we want them automatic)
        // For now, let's keep everything manual 'E' per user preference,
        // EXCEPT if specifically marked automatic or it's a generic "hallway" sensor
        const isAutomatic = pData?.automatic === true;

        if (isAutomatic) {
          this.handlePortal(this.activePortal);
        } else if (this.isNearNPC) {
          this.interactionPrompt.setText("Press E to Deal");
          this.interactionPrompt.setVisible(true);
        } else if (
          pId.toLowerCase().includes("exit") ||
          pData?.target === "MainCity" ||
          pData?.target === this.returnScene
        ) {
          this.interactionPrompt.setText("Press E to Exit");
          this.interactionPrompt.setVisible(true);
        } else {
          // It's a door or entrance to something else
          const targetName = pData?.buildingId || pData?.target || "room";
          this.interactionPrompt.setText(`Press E up to enter ${targetName}`);
          this.interactionPrompt.setVisible(true);
        }
      } else {
        this.interactionPrompt.setVisible(false);
      }

      this.player.update();
      if (this.player.isWalking) {
        if (!this.shakeActive) {
          this.shakeActive = true;
          this.applySmoothShake();
        }
      } else {
        this.shakeActive = false;
        if (this.shakeTween) {
          this.shakeTween.stop();
          this.shakeTween = null;
        }
        // Return to center smoothly
        if (
          this.cameras.main.followOffset.x !== 0 ||
          this.cameras.main.followOffset.y !== 0
        ) {
          this.tweens.add({
            targets: this.cameras.main.followOffset,
            x: 0,
            y: 0,
            duration: 300,
            ease: "Cubic.easeOut",
          });
        }
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.exitKey)) {
      console.log("[InteriorScene] Manual exit triggered via SPACE");
      this.scene.start("MainCity");
    }
  }

  applySmoothShake() {
    if (!this.shakeActive) return;

    const targetX = (Math.random() - 0.5) * 50; // +/- 50px
    const targetY = (Math.random() - 0.5) * 50; // +/- 50px

    this.shakeTween = this.tweens.add({
      targets: this.cameras.main.followOffset,
      x: targetX,
      y: targetY,
      duration: 300,
      ease: "Sine.easeInOut",
      onComplete: () => {
        this.applySmoothShake();
      },
    });
  }
}
