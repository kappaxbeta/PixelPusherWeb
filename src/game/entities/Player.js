import Phaser from 'phaser';
import { EventBus } from '../EventBus';

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.speed = 80;
        this.setScale(4);
        this.lastDirection = 'down';

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = scene.input.keyboard.addKeys('W,A,S,D');
        this.interactKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // Joystick Input
        this.joystickInput = { x: 0, y: 0 };
        if (EventBus) {
            EventBus.on('joystick-move', (data) => {
                this.joystickInput = data;
            });
        }

        this.initAnimations();
    }

    initAnimations() {
        const anims = this.scene.anims;

        // Only create if they don't exist
        const animList = [
            { key: 'walk-down', start: 130, end: 135 },
            { key: 'walk-up', start: 118, end: 123 },
            { key: 'walk-left', start: 124, end: 128 },
            { key: 'walk-right', start: 112, end: 117 },
            { key: 'idle-down', start: 74, end: 79 },
            { key: 'idle-up', start: 62, end: 67 },
            { key: 'idle-right', start: 56, end: 61 },
            { key: 'idle-left', start: 68, end: 73 }
        ];

        animList.forEach(anim => {
            if (!anims.exists(anim.key)) {
                anims.create({
                    key: anim.key,
                    frames: anims.generateFrameNumbers('player', { start: anim.start, end: anim.end }),
                    frameRate: 5,
                    repeat: -1
                });
            }
        });
    }

    update() {
        this.setVelocity(0);

        let vx = 0;
        let vy = 0;

        // Keyboard
        if (this.wasd.A.isDown || this.cursors.left.isDown) vx = -1;
        else if (this.wasd.D.isDown || this.cursors.right.isDown) vx = 1;

        if (this.wasd.W.isDown || this.cursors.up.isDown) vy = -1;
        else if (this.wasd.S.isDown || this.cursors.down.isDown) vy = 1;

        // Joystick
        if (Math.abs(this.joystickInput.x) > 0.1 || Math.abs(this.joystickInput.y) > 0.1) {
            vx = this.joystickInput.x;
            vy = this.joystickInput.y;
        }

        if (vx !== 0 || vy !== 0) {
            this.setVelocity(vx * this.speed, vy * this.speed);
            this.body.velocity.normalize().scale(this.speed);

            if (Math.abs(vx) > Math.abs(vy)) {
                if (vx > 0) {
                    this.play('walk-right', true);
                    this.lastDirection = 'right';
                } else {
                    this.play('walk-left', true);
                    this.lastDirection = 'left';
                }
            } else {
                if (vy > 0) {
                    this.play('walk-down', true);
                    this.lastDirection = 'down';
                } else {
                    this.play('walk-up', true);
                    this.lastDirection = 'up';
                }
            }
        } else {
            this.play(`idle-${this.lastDirection}`, true);
        }

        // Interaction
        if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
            this.scene.events.emit('player-interact');
        }
    }
}
