import Phaser from 'phaser';
import { EventBus } from '../EventBus';

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        console.log('Player: Constructor started');
        super(scene, x, y, texture);
        console.log('Player: super() called');

        scene.add.existing(this);
        scene.physics.add.existing(this);
        console.log('Player: Physics added');

        this.setCollideWorldBounds(true);
        this.speed = 200;
        this.setScale(2);

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = scene.input.keyboard.addKeys('W,A,S,D');
        this.interactKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        console.log('Player: Inputs added');

        // Joystick State
        this.joystickInput = { x: 0, y: 0 };
        if (EventBus) {
            console.log('Player: Setting up joystick listener');
            EventBus.on('joystick-move', (data) => {
                this.joystickInput = data;
            });
        }
        console.log('Player: Constructor finished');
    }
    create() {
    const player = this.physics.add.sprite(100, 100, 'player');

    // Animation for walking down (usually the first row)
    this.anims.create({
        key: 'walk-down',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    // Animation for walking left
    this.anims.create({
        key: 'walk-left',
        frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
        frameRate: 10,
        repeat: -1
    });

    // Define 'idle' usually as a single frame
    this.anims.create({
        key: 'idle-down',
        frames: [{ key: 'player', frame: 0 }],
        frameRate: 20
    });

    // Create cursors for input
    this.cursors = this.input.keyboard.createCursorKeys();
}

    update() {
        this.setVelocity(0);

        // Movement Logic
        let isMoving = false;
        let vx = 0;
        let vy = 0;

        // Keyboard
        if (this.wasd.A.isDown || this.cursors.left.isDown) vx = -1;
        else if (this.wasd.D.isDown || this.cursors.right.isDown) vx = 1;

        if (this.wasd.W.isDown || this.cursors.up.isDown) vy = -1;
        else if (this.wasd.S.isDown || this.cursors.down.isDown) vy = 1;

        // Joystick Override (if moving)
        if (Math.abs(this.joystickInput.x) > 0.1 || Math.abs(this.joystickInput.y) > 0.1) {
            vx = this.joystickInput.x;
            vy = this.joystickInput.y;
        }

        if (vx !== 0 || vy !== 0) {
            isMoving = true;
            this.setVelocity(vx * this.speed, vy * this.speed);

            // Interaction with animations
            if (Math.abs(vx) > Math.abs(vy)) {
                if (vx > 0) this.play('walk-right', true);
                else this.play('walk-left', true);
            } else {
                if (vy > 0) this.play('walk-down', true);
                else this.play('walk-up', true);
            }
        }

        if (!isMoving) {
            this.setVelocity(0);
            this.play('idle-down', true);
        }

        // Normalize and scale the velocity so that we don't move faster along a diagonal
        this.body.velocity.normalize().scale(this.speed);

        // Interaction check (this will be called by the scene)
        if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
            this.scene.events.emit('player-interact');
        }
    }
}
