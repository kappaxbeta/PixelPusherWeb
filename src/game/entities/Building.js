import Phaser from 'phaser';

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
    constructor(scene, x, y, texture, recipe, library, scale = 1, collisionConfig = {}, debug = false) {
        super(scene, x, y);

        this.scene = scene;
        this.textureKey = texture;
        this.recipe = recipe;
        this.library = library;
        this.tileScale = scale;
        this.collisionConfig = collisionConfig;
        this.debug = debug;
        this.sensors = scene.add.group();
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
                const part = this.library.find(p => p.id === partId);
                if (!part) return;

                const partWidth = part.width || 1; // Width in tiles
                const partHeight = Math.ceil(part.tiles.length / partWidth); // Height in tiles
                maxRowHeightTiles = Math.max(maxRowHeightTiles, partHeight);

                // Create individual collision sensors for each part
                if (part.collisions && part.collisions.length > 0) {
                    part.collisions.forEach((col, idx) => {
                        const sensorX = (currentX + col.x * this.tileScale);
                        const sensorY = (currentY + col.y * this.tileScale);
                        const sensorW = col.width * this.tileScale;
                        const sensorH = col.height * this.tileScale;

                        // Track the lowest solid collision point for Y sorting
                        if (!col.isSensor) {
                            maxColBottomY = Math.max(maxColBottomY, sensorY + sensorH);
                        }
                        
                        // Create a zone as a sensor or collider
                        const sensor = this.scene.add.zone(
                            this.x + sensorX + (sensorW / 2),
                            this.y + sensorY + (sensorH / 2),
                            sensorW,
                            sensorH
                        );
                        
                        this.scene.physics.add.existing(sensor, true);
                        
                        // Add meta-data for event emission
                        sensor.partId = partId;
                        sensor.collisionId = col.id || `col_${idx}`;
                        
                        if (col.isSensor) {
                            // Setup overlap detection for sensors
                            this.scene.physics.add.overlap(this.scene.player, sensor, () => {
                                const config = this.collisionConfig[partId] || this.collisionConfig[sensor.collisionId];
                                if (config && config.onEnter) {
                                    config.onEnter(sensor);
                                }
                                this.scene.events.emit('building-part-collision', {
                                    building: this,
                                    partId: partId,
                                    collisionId: sensor.collisionId
                                });
                            });
                        } else {
                            // Setup solid collider
                            this.scene.physics.add.collider(this.scene.player, sensor);
                        }

                        if (this.debug) {
                            debugRects.push({
                                x: sensorX + (sensorW / 2),
                                y: sensorY + (sensorH / 2),
                                w: sensorW,
                                h: sensorH,
                                isSensor: col.isSensor
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
                    const spriteX = currentX + (tx * 16 * this.tileScale);
                    const spriteY = currentY + (ty * 16 * this.tileScale);

                    const sprite = this.scene.add.sprite(
                        spriteX,
                        spriteY,
                        this.textureKey,
                        frameIndex
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
        debugRects.forEach(dr => {
            const debugRect = this.scene.add.rectangle(
                dr.x, dr.y, dr.w, dr.h,
                dr.isSensor ? 0x0000ff : 0xff0000, 0.3
            );
            debugRect.setStrokeStyle(2, dr.isSensor ? 0x0000ff : 0xff0000);
            this.add(debugRect);
        });

        this.totalWidth = maxWidth;
        this.totalHeight = currentY;
        
        // Use max solid collision bottom as the sort point, or default to building bottom
        this.sortYOffset = maxColBottomY > 0 ? maxColBottomY : this.totalHeight;
    }
}
