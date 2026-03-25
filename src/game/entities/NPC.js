import Phaser from 'phaser';

export class NPC extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, name) {
        console.log('NPC: Constructor started: ' + name);
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this, true); // standalone static body

        this.npcName = name;
        this.isWaitingForDelivery = true;
        this.setScale(1); // Scale up for visibility

        // Add name tag
        this.nameTag = scene.add.text(x, y - 40, name, { font: '12px Courier', fill: '#ffffff' }).setOrigin(0.5);
    }

    deliver() {
        if (this.isWaitingForDelivery) {
            this.isWaitingForDelivery = false;
            this.nameTag.setText(this.npcName + ' (Done)');
            this.nameTag.setFill('#00ff00');
            return true;
        }
        return false;
    }
}
