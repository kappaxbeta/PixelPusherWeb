import Phaser from 'phaser';

export class InteriorScene extends Phaser.Scene {
    constructor() {
        super('InteriorScene');
    }

    create() {
        this.add.text(10, 10, 'Building Interior', { font: '16px Courier', fill: '#ffff00' });
        this.add.text(10, 30, 'Press "SPACE" to Exit', { font: '12px Courier', fill: '#ffffff' });

        this.exitKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.exitKey)) {
            this.scene.start('MainCity');
        }
    }
}
