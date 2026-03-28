import Phaser from "phaser";

export class Building extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {string} texture - The key of the spritesheet/tileset
   * @param {string[][]} recipe - 2D Array of part IDs [['id1', 'id2'], ['id3', 'id4']]
   * @param {Object[]} library - Library of part objects [{id: 'id1', tiles: [tileIndex], width: 1}, ...]
   * @param {number} scale - Scaling factor (default 1)
   */
  constructor(
    scene,
    x,
    y,
    texture,
    recipe,
    library,
    scale = 1,
    collisionConfig = {},
    debug = false,
  ) {
    super(scene, x, y);

    this.scene = scene;
    this.textureKey = texture;
    this.recipe = recipe;
    this.library = library;
    this.tileScale = scale;
    this.collisionConfig = collisionConfig;
    this.debug = debug;
    this.sensors = scene.add.group();
    this.debugShapes = []; // Track debug shapes for toggling
    this.isMovingMode = false; // Advanced MOVE state
    this.sortYOffset = 0; // Offset from building Y for depth sorting

    this.build();

    scene.add.existing(this);
  }

  build() {
    let currentY = 0;
    let maxWidth = 0;
    let maxColBottomY = 0;
    const debugRects = [];

    this.recipe.forEach((recipeRow) => {
      let currentX = 0;
      let maxRowHeightTiles = 0;

      recipeRow.forEach((partId) => {
        const part = this.library.find((p) => p.id === partId);
        if (!part) return;

        const partWidth = part.width || 1; // Width in tiles
        const partHeight = Math.ceil(part.tiles.length / partWidth); // Height in tiles
        maxRowHeightTiles = Math.max(maxRowHeightTiles, partHeight);

        // Create individual collision sensors for each part
        if (part.collisions && part.collisions.length > 0) {
          part.collisions.forEach((col, idx) => {
            const sensorX = currentX + col.x * this.tileScale;
            const sensorY = currentY + col.y * this.tileScale;
            const sensorW = col.width * this.tileScale;
            const sensorH = col.height * this.tileScale;

            // Track the lowest solid collision point for Y sorting
            if (!col.isSensor) {
              maxColBottomY = Math.max(maxColBottomY, sensorY + sensorH);
            }

            // Create a zone as a sensor or collider
            const sensor = this.scene.add.zone(
              this.x + sensorX + sensorW / 2,
              this.y + sensorY + sensorH / 2,
              sensorW,
              sensorH,
            );

            this.scene.physics.add.existing(sensor, true);

            // Add meta-data for event emission
            sensor.partId = partId;
            sensor.collisionId = col.id || `col_${idx}`;

            if (col.isSensor) {
              // Setup overlap detection for sensors
              this.scene.physics.add.overlap(this.scene.player, sensor, () => {
                const config =
                  this.collisionConfig[partId] ||
                  this.collisionConfig[sensor.collisionId];
                if (config && config.onEnter) {
                  config.onEnter(sensor);
                }
                this.scene.events.emit("building-part-collision", {
                  building: this,
                  partId: partId,
                  collisionId: sensor.collisionId,
                });
              });
            } else {
              // Setup solid collider
              this.scene.physics.add.collider(this.scene.player, sensor);
            }

            if (this.debug) {
              debugRects.push({
                x: sensorX + sensorW / 2,
                y: sensorY + sensorH / 2,
                w: sensorW,
                h: sensorH,
                isSensor: col.isSensor,
              });
            }

            this.sensors.add(sensor);
          });
        }

        // Render tiles in this part
        part.tiles.forEach((frameIndex, i) => {
          if (frameIndex === -1) return;

          const tx = i % partWidth;
          const ty = Math.floor(i / partWidth);
          const spriteX = currentX + tx * 16 * this.tileScale;
          const spriteY = currentY + ty * 16 * this.tileScale;

          const sprite = this.scene.add.sprite(
            spriteX,
            spriteY,
            this.textureKey,
            frameIndex,
          );
          sprite.setScale(this.tileScale);
          sprite.setOrigin(0);

          if (part.flipX) sprite.setFlipX(true);
          if (part.flipY) sprite.setFlipY(true);

          this.add(sprite);
        });

        currentX += partWidth * 16 * this.tileScale;
      });

      maxWidth = Math.max(maxWidth, currentX);
      currentY += maxRowHeightTiles * 16 * this.tileScale;
    });

    // Add debug rects last so they are on top
    debugRects.forEach((dr) => {
      const debugRect = this.scene.add.rectangle(
        dr.x,
        dr.y,
        dr.w,
        dr.h,
        dr.isSensor ? 0x0000ff : 0xff0000,
        0.3,
      );
      debugRect.setStrokeStyle(2, dr.isSensor ? 0x0000ff : 0xff0000);
      this.add(debugRect);
      if (this.debug) this.debugShapes.push(debugRect);
    });

    this.totalWidth = maxWidth;
    this.totalHeight = currentY;

    // Use max solid collision bottom as the sort point, or default to building bottom
    this.sortYOffset = maxColBottomY > 0 ? maxColBottomY : this.totalHeight;

    if (this.debug) {
      this.setupDebug();
    }
  }

  toggleDebugVisibility(visible) {
    this.debugShapes.forEach((shape) => {
      if (shape && shape.setVisible) {
        shape.setVisible(visible);
      }
    });
  }

  setupDebug() {
    // 1. Draw 16x16 grid overlay
    const grid = this.scene.add.grid(
      this.totalWidth / 2,
      this.totalHeight / 2,
      this.totalWidth,
      this.totalHeight,
      16,
      16,
      0,
      0,
      0x00ff00,
      0.1,
    );
    grid.setOutlineStyle(0x00ff00, 0.2);
    this.add(grid);
    this.debugShapes.push(grid);

    const handleYPos = this.totalHeight + 4;

    // 2. Add Advanced Drag & WASD Move Handle at bottom
    const advancedHandle = this.scene.add.rectangle(
      0,
      handleYPos,
      100,
      16,
      0xff00ff,
      0.8,
    );
    advancedHandle.setOrigin(0);
    advancedHandle.setInteractive({ useHandCursor: true, draggable: true });
    const advancedText = this.scene.add.text(2, handleYPos + 2, "DRAG / WASD", {
      fontSize: "10px",
      fill: "#000000",
      fontStyle: "bold",
    });
    this.add([advancedHandle, advancedText]);
    this.debugShapes.push(advancedHandle, advancedText);

    advancedHandle.on("pointerdown", (pointer) => {
      if (!this.isMovingMode) {
        this.toggleMoveMode();
      }
      pointer.event.stopPropagation();
    });

    advancedHandle.on("drag", (pointer, dragX, dragY) => {
      // dragX/Y are local to container, but let's use world for precision snapping
      const snapX = Math.round(pointer.worldX / 16) * 16;
      const snapY = Math.round(pointer.worldY / 16) * 16;

      // Calculate shift from handle relative top-left to building origin
      const dx = snapX - 50 - this.x; // Adjusted for 100-width handle centered-ish
      const dy = snapY - (handleYPos + 8) - this.y;

      if (dx !== 0 || dy !== 0) {
        this.moveBuilding(dx, dy);
      }
    });

    advancedHandle.on("dragstart", () => {
      if (!this.isMovingMode) this.toggleMoveMode();
    });

    advancedHandle.on("dragend", () => {
      this.copyPosition();
    });
  }

  toggleMoveMode() {
    this.isMovingMode = !this.isMovingMode;
    if (this.isMovingMode) {
      this.setAlpha(0.6);
      this.scene.events.emit("building-move-start", this);
    } else {
      this.setAlpha(1.0);
      this.scene.events.emit("building-move-end", this);
      this.copyPosition();
    }
  }

  copyPosition() {
    const posStr = `x: ${Math.round(this.x)}, y: ${Math.round(this.y)}`;
    navigator.clipboard.writeText(posStr).then(() => {
      console.log(`Copied building position: ${posStr}`);
    });
  }

  moveBuilding(dx, dy) {
    this.x += dx;
    this.y += dy;

    // Must move all physics sensors too since they are global zones
    this.sensors.getChildren().forEach((sensor) => {
      const newX = sensor.x + dx;
      const newY = sensor.y + dy;
      sensor.setPosition(newX, newY);
      if (sensor.body) {
        sensor.body.reset(newX, newY);
      }
    });

    // Also update depth
    this.setDepth(this.y + (this.sortYOffset || this.totalHeight || 0));
  }
}
