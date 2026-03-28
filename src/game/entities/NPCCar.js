import Phaser from "phaser";
import { Car } from "./Car";

export class NPCCar extends Car {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.maxSpeed = 150 + Math.random() * 50; // NPC cars drive slightly slower/varied
    this.acceleration = 800;
    this.dragValue = 400;

    // Movement state
    this.moveDir = new Phaser.Math.Vector2(0, 0);
    this.targetPos = new Phaser.Math.Vector2(x, y);
    this.lastIntersection = null;

    // Grid Constants
    this.CELL_WIDTH = 47 * 16;
    this.CELL_HEIGHT = 37 * 16;
    this.BORDER_Y = 10 * 16;
  }

  update(time, delta) {
    this.aiMovement(delta);
    this.updateAnims(delta);
    this.setDepth(this.y + 32);
  }

  aiMovement(delta) {
    const dt = delta / 1000;
    const gx = Math.floor(this.x / this.CELL_WIDTH);
    const gy = Math.floor((this.y - this.BORDER_Y) / this.CELL_HEIGHT);

    // Relative position in cell
    const rx = this.x % this.CELL_WIDTH;
    const ry = (this.y - this.BORDER_Y) % this.CELL_HEIGHT;

    const inIntersection = rx >= 36 * 16 && ry >= 28 * 16;
    const currentLoc = `${gx},${gy}`;

    if (inIntersection && this.lastIntersection !== currentLoc) {
      // Logic for choosing new direction at intersection
      this.handleIntersection(gx, gy);
      this.lastIntersection = currentLoc;
    } else if (!inIntersection) {
      this.lastIntersection = null;
    }

    // Apply movement
    this.velocity.x += this.moveDir.x * this.acceleration * dt;
    this.velocity.y += this.moveDir.y * this.acceleration * dt;

    // Lane locking (nudge towards center of lane)
    this.lockToLane(rx, ry);

    this.velocity.limit(this.maxSpeed);
    this.body.setVelocity(this.velocity.x, this.velocity.y);
    this.isMoving = this.velocity.length() > 10;
  }

  handleIntersection(gx, gy) {
    // Choose random next direction (straight, left turn, right turn?)
    const dirs = ["right", "left", "up", "down"];
    this.currentDir = dirs[Math.floor(Math.random() * dirs.length)];

    const dirMap = {
      right: { x: 1, y: 0 },
      left: { x: -1, y: 0 },
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
    };

    const next = dirMap[this.currentDir];
    this.moveDir.set(next.x, next.y);
  }

  lockToLane(rx, ry) {
    // Simple lane correction
    if (this.moveDir.x !== 0) {
      // Driving horizontally, lock Y
      const targetYOffset = this.moveDir.x > 0 ? 30 * 16 : 35 * 16;
      const currentCellY = Math.floor((this.y - this.BORDER_Y) / this.CELL_HEIGHT) * this.CELL_HEIGHT + this.BORDER_Y;
      const targetY = currentCellY + targetYOffset;
      const diff = targetY - this.y;
      this.velocity.y += diff * 5; // Nudge factor
    } else if (this.moveDir.y !== 0) {
      // Driving vertically, lock X
      const targetXOffset = this.moveDir.y > 0 ? 39 * 16 : 44 * 16;
      const currentCellX = Math.floor(this.x / this.CELL_WIDTH) * this.CELL_WIDTH;
      const targetX = currentCellX + targetXOffset;
      const diff = targetX - this.x;
      this.velocity.x += diff * 5; // Nudge factor
    }
  }
}
