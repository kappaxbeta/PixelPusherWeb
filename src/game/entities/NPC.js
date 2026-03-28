import Phaser from "phaser";

export class NPC extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, name, tradeConfig) {
    console.log("NPC: Constructor started: " + name);
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this); // Dynamic body
    this.setCollideWorldBounds(true);

    this.npcName = name;
    this.isWaitingForDelivery = true;
    this.setScale(1);
    this.speed = 30; // Slightly slower than player
    this.lastDirection = "down";
    this.frozen = false;

    // AI Timer Logic
    this.state = "IDLE";
    this.stateTimer = 0;

    // Trade Configuration
    this.isTrader = true;
    this.tradeConfig = tradeConfig || {
      type: "buy",
      item: "weed",
      amount: 1,
      price: 50,
      prompt: `Sell 1g for $50?`,
    };

    // Add name tag
    this.nameTag = scene.add
      .text(x, y - 20, name, {
        font: "12px Courier",
        fill: "#ffffff",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: { x: 4, y: 2 },
      })
      .setOrigin(0.5);
  }

  update(time, delta) {
    if (this.frozen) {
      this.setVelocity(0);
      this.play(`idle-${this.lastDirection}`, true);
      this.updateNameTag();
      return;
    }

    this.stateTimer -= delta;

    if (this.stateTimer <= 0) {
      // Switch State
      if (this.state === "IDLE") {
        this.state = "WANDERING";
        this.stateTimer = Phaser.Math.Between(2000, 4000);
        // Pick random direction
        const angle = Phaser.Math.Between(0, 360);
        const rad = Phaser.Math.DegToRad(angle);
        this.setVelocity(Math.cos(rad) * this.speed, Math.sin(rad) * this.speed);
      } else {
        this.state = "IDLE";
        this.stateTimer = Phaser.Math.Between(1000, 3000);
        this.setVelocity(0, 0);
      }
    }

    this.handleAnimations();
    this.updateNameTag();
  }

  handleAnimations() {
    const vx = this.body.velocity.x;
    const vy = this.body.velocity.y;

    if (vx !== 0 || vy !== 0) {
      if (Math.abs(vx) > Math.abs(vy)) {
        if (vx > 0) {
          this.play("walk-right", true);
          this.lastDirection = "right";
        } else {
          this.play("walk-left", true);
          this.lastDirection = "left";
        }
      } else {
        if (vy > 0) {
          this.play("walk-down", true);
          this.lastDirection = "down";
        } else {
          this.play("walk-up", true);
          this.lastDirection = "up";
        }
      }
    } else {
      this.play(`idle-${this.lastDirection}`, true);
    }
  }

  updateNameTag() {
    this.nameTag.setPosition(this.x, this.y - 30);
  }

  deliver() {
    if (this.isWaitingForDelivery) {
      this.isWaitingForDelivery = false;
      this.nameTag.setText(this.npcName + " (Done)");
      this.nameTag.setFill("#00ff00");
      return true;
    }
    return false;
  }
}
