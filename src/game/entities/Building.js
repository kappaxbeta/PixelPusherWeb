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
    constructor(scene, x, y, texture, recipe, library, scale = 1) {
        super(scene, x, y);

        this.scene = scene;
        this.textureKey = texture;
        this.recipe = recipe;
        this.library = library;
        this.tileScale = scale;

        this.build();
        
        scene.add.existing(this);
        
        // Setup Physics
        scene.physics.add.existing(this, true); // true = static body
        this.setupPhysicsBody();
    }

    build() {
        let currentY = 0;
        let maxWidth = 0;

        this.recipe.forEach((recipeRow) => {
            let currentX = 0;
            let maxRowHeightTiles = 0;

            recipeRow.forEach((partId) => {
                const part = this.library.find(p => p.id === partId);
                if (!part) return;

                const partWidth = part.width || 1; // Width in tiles
                const partHeight = Math.ceil(part.tiles.length / partWidth); // Height in tiles
                maxRowHeightTiles = Math.max(maxRowHeightTiles, partHeight);

                // Render tiles in this part
                part.tiles.forEach((frameIndex, i) => {
                    if (frameIndex === -1) return;

                    // Local tile offsets within the part
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

        this.totalWidth = maxWidth;
        this.totalHeight = currentY;
    }

    setupPhysicsBody() {
        this.body.setSize(this.totalWidth, this.totalHeight);
        this.body.setOffset(0, 0);
        
        // Manual sync for Container static body
        this.body.x = this.x;
        this.body.y = this.y;
    }
}
