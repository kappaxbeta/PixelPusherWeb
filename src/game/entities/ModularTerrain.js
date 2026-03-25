import Phaser from 'phaser';

export class ModularTerrain {
    /**
     * @param {Phaser.Scene} scene 
     * @param {string} tilesetKey - Texture key for the tileset
     * @param {number} tileSize - Size of individual tiles (def 16)
     * @param {number} mapWidth - Width in tiles (def 100)
     * @param {number} mapHeight - Height in tiles (def 100)
     */
    constructor(scene, tilesetKey, tileSize = 16, mapWidth = 100, mapHeight = 100) {
        this.scene = scene;
        this.tilesetKey = tilesetKey;
        this.tileSize = tileSize;

        // Create a dynamic tilemap
        this.map = scene.make.tilemap({
            tileWidth: tileSize,
            tileHeight: tileSize,
            width: mapWidth,
            height: mapHeight
        });

        // Add the tileset to the map
        this.tileset = this.map.addTilesetImage(tilesetKey, tilesetKey, tileSize, tileSize);

        // Create a blank layer
        this.layer = this.map.createBlankLayer('GroundLayer', this.tileset);

        // Set scale for the entire layer
        this.layer.setScale(1);

        // Ensure it's rendered below everything else
        this.layer.setDepth(-10);
    }

    /**
     * "Stamp" a piece of terrain into the layer
     * @param {number} tileX - X coordinate in tiles
     * @param {number} tileY - Y coordinate in tiles
     * @param {number[][]} layout - 2D array of tile indices
     */
    addSegment(tileX, tileY, layout) {
        layout.forEach((row, r) => {
            row.forEach((tileIndex, c) => {
                if (tileIndex !== -1) {
                    this.layer.putTileAt(tileIndex, tileX + c, tileY + r);
                }
            });
        });
    }

    /**
     * @param {boolean} collide - Enable/disable collision for a range of tiles
     * @param {number[]} indices - Array of tile indices that should have collision
     */
    setCollision(indices, collide = true) {
        this.map.setCollision(indices, collide, true, this.layer);
    }
}
