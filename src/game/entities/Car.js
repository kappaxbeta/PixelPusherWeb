import Phaser from "phaser";

export class Car extends Phaser.GameObjects.Container {
  constructor(scene, x, y, texture) {
    super(scene, x, y);
    this.scene = scene;
    this.textureKey = texture;
    this.sprites = [];
    this.driver = null;

    // Car Configuration (Multi-tile indices)
    // Horizontal: 5x3 (15 tiles)
    // Vertical: 3x6 (18 tiles)
    this.config = {
      idle: {
        right: {
          tiles: [240, 241, 242, 243, 244, 360, 361, 362, 363, 364, 480, 481, 482, 483, 484],
          cols: 5,
          rows: 3,
        },
        left: {
          tiles: [250, 251, 252, 253, 254, 370, 371, 372, 373, 374, 490, 491, 492, 493, 494],
          cols: 5,
          rows: 3,
        },
        up: {
          tiles: [6, 7, 8, 126, 127, 128, 246, 247, 248, 366, 367, 368, 486, 487, 488, 606, 607, 608],
          cols: 3,
          rows: 6,
        },
        down: {
          tiles: [16, 17, 18, 136, 137, 138, 256, 257, 258, 376, 377, 378, 496, 497, 498, 616, 617, 618],
          cols: 3,
          rows: 6,
        },
      },
      walk: {
        right: [
          [840, 841, 842, 843, 844, 960, 961, 962, 963, 964, 1080, 1081, 1082, 1083, 1084],
          [845, 846, 847, 848, 849, 965, 966, 967, 968, 969, 1085, 1086, 1087, 1088, 1089],
          [850, 851, 852, 853, 854, 970, 971, 972, 973, 974, 1090, 1091, 1092, 1093, 1094],
          [855, 856, 857, 858, 859, 975, 976, 977, 978, 979, 1095, 1096, 1097, 1098, 1099],
          [860, 861, 862, 863, 864, 980, 981, 982, 983, 984, 1100, 1101, 1102, 1103, 1104],
          [865, 866, 867, 868, 869, 985, 986, 987, 988, 989, 1105, 1106, 1107, 1108, 1109],
        ],
        up: [
          [631, 632, 633, 751, 752, 753, 871, 872, 873, 991, 992, 993, 1111, 1112, 1113, 1231, 1232, 1233],
          [636, 637, 638, 756, 757, 758, 876, 877, 878, 996, 997, 998, 1116, 1117, 1118, 1236, 1237, 1238],
          [641, 642, 643, 761, 762, 763, 881, 882, 883, 1001, 1002, 1003, 1121, 1122, 1123, 1241, 1242, 1243],
          [646, 647, 648, 766, 767, 768, 886, 887, 888, 1006, 1007, 1008, 1126, 1127, 1128, 1246, 1247, 1248],
          [651, 652, 653, 771, 772, 773, 891, 892, 893, 1011, 1012, 1013, 1131, 1132, 1133, 1251, 1252, 1253],
          [656, 657, 658, 776, 777, 778, 896, 897, 898, 1016, 1017, 1018, 1136, 1137, 1138, 1256, 1257, 1258],
        ],
        left: [
          [900, 901, 902, 903, 904, 1020, 1021, 1022, 1023, 1024, 1140, 1141, 1142, 1143, 1144],
          [905, 906, 907, 908, 909, 1025, 1026, 1027, 1028, 1029, 1145, 1146, 1147, 1148, 1149],
          [910, 911, 912, 913, 914, 1030, 1031, 1032, 1033, 1034, 1150, 1151, 1152, 1153, 1154],
          [915, 916, 917, 918, 919, 1035, 1036, 1037, 1038, 1039, 1155, 1156, 1157, 1158, 1159],
          [920, 921, 922, 923, 924, 1040, 1041, 1042, 1043, 1044, 1160, 1161, 1162, 1163, 1164],
          [925, 926, 927, 928, 929, 1045, 1046, 1047, 1048, 1049, 1165, 1166, 1167, 1168, 1169],
        ],
        down: [
          [691, 692, 693, 811, 812, 813, 931, 932, 933, 1051, 1052, 1053, 1171, 1172, 1173, 1291, 1292, 1293],
          [696, 697, 698, 816, 817, 818, 936, 937, 938, 1056, 1057, 1058, 1176, 1177, 1178, 1296, 1297, 1298],
          [701, 702, 703, 821, 822, 823, 941, 942, 943, 1061, 1062, 1063, 1181, 1182, 1183, 1301, 1302, 1303],
          [706, 707, 708, 826, 827, 828, 946, 947, 948, 1066, 1067, 1068, 1186, 1187, 1188, 1306, 1307, 1308],
          [711, 712, 713, 831, 832, 833, 951, 952, 953, 1071, 1072, 1073, 1191, 1192, 1193, 1311, 1312, 1313],
          [716, 717, 718, 836, 837, 838, 956, 957, 958, 1076, 1077, 1078, 1196, 1197, 1198, 1316, 1317, 1318],
        ],
      },
    };

    this.currentDir = "right";
    this.isMoving = false;
    this.frameIndex = 0;
    this.animTimer = 0;
    this.animSpeed = 100; // ms per frame
    this.velocity = new Phaser.Math.Vector2(0, 0);
    this.maxSpeed = 300;
    this.acceleration = 1200;
    this.dragValue = 600;

    // Physics
    scene.physics.add.existing(this);
    this.body.setCollideWorldBounds(true);

    this.renderTiles(this.config.idle.right.tiles, 5, 3);
    scene.add.existing(this);
  }

  renderTiles(tiles, cols, rows) {
    // Clear old sprites
    this.sprites.forEach((s) => s.destroy());
    this.sprites = [];

    tiles.forEach((tileIdx, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const sprite = this.scene.add.sprite(col * 16, row * 16, this.textureKey, tileIdx);
      sprite.setOrigin(0);
      this.add(sprite);
      this.sprites.push(sprite);
    });

    // Center the container content roughly
    const width = cols * 16;
    const height = rows * 16;
    this.iterate((child) => {
      child.x -= width / 2;
      child.y -= height / 2;
    });

    // Update physics body size
    this.body.setSize(width - 4, height - 4);
    this.body.setOffset(-width / 2 + 2, -height / 2 + 2);
  }

  update(time, delta, cursors) {
    if (!this.driver) {
      this.stopAnims();
      this.body.setVelocity(0, 0);
      return;
    }

    this.handleInput(cursors, delta);
    this.updateAnims(delta);

    // Position driver at car center while driving
    this.driver.setPosition(this.x, this.y);
    this.setDepth(this.y + 32); // Ensure car is above road and NPCs
  }

  handleInput(cursors, delta) {
    let moving = false;
    const dt = delta / 1000;

    if (cursors.left.isDown || (cursors.A && cursors.A.isDown)) {
      this.velocity.x -= this.acceleration * dt;
      this.currentDir = "left";
      moving = true;
    } else if (cursors.right.isDown || (cursors.D && cursors.D.isDown)) {
      this.velocity.x += this.acceleration * dt;
      this.currentDir = "right";
      moving = true;
    } else {
      this.applyDrag("x", dt);
    }

    if (cursors.up.isDown || (cursors.W && cursors.W.isDown)) {
      this.velocity.y -= this.acceleration * dt;
      this.currentDir = "up";
      moving = true;
    } else if (cursors.down.isDown || (cursors.S && cursors.S.isDown)) {
      this.velocity.y += this.acceleration * dt;
      this.currentDir = "down";
      moving = true;
    } else {
      this.applyDrag("y", dt);
    }

    // Clip velocity
    this.velocity.limit(this.maxSpeed);
    this.body.setVelocity(this.velocity.x, this.velocity.y);
    this.isMoving = moving;
  }

  applyDrag(axis, dt) {
    if (Math.abs(this.velocity[axis]) < 10) {
      this.velocity[axis] = 0;
      return;
    }
    const dragAmt = this.dragValue * dt;
    if (this.velocity[axis] > 0) this.velocity[axis] -= dragAmt;
    else this.velocity[axis] += dragAmt;
  }

  updateAnims(delta) {
    if (!this.isMoving) {
      this.stopAnims();
      return;
    }

    this.animTimer += delta;
    if (this.animTimer >= this.animSpeed) {
      this.animTimer = 0;
      this.frameIndex = (this.frameIndex + 1) % 6;

      const frames = this.config.walk[this.currentDir];
      const currentFrameTiles = frames[this.frameIndex];

      const isHorizontal = this.currentDir === "right" || this.currentDir === "left";
      const cols = isHorizontal ? 5 : 3;
      const rows = isHorizontal ? 3 : 6;

      if (this.sprites.length === currentFrameTiles.length) {
        this.sprites.forEach((s, i) => s.setFrame(currentFrameTiles[i]));
      } else {
        this.renderTiles(currentFrameTiles, cols, rows);
      }
    }
  }

  stopAnims() {
    const idle = this.config.idle[this.currentDir];
    const isHorizontal = this.currentDir === "right" || this.currentDir === "left";
    const cols = isHorizontal ? 5 : 3;
    const rows = isHorizontal ? 3 : 6;

    if (this.sprites.length === idle.tiles.length) {
      this.sprites.forEach((s, i) => s.setFrame(idle.tiles[i]));
    } else {
      this.renderTiles(idle.tiles, cols, rows);
    }
    this.frameIndex = 0;
    this.animTimer = 0;
  }

  enter(player) {
    this.driver = player;
    player.setVisible(false);
    player.frozen = true;
    if (player.body) player.body.setEnable(false);
  }

  exit() {
    if (!this.driver) return;
    this.driver.setVisible(true);
    if (this.driver.body) {
      this.driver.body.setEnable(true);
      this.driver.frozen = false;
      this.driver.body.reset(this.x + 40, this.y);
    }
    this.driver.setPosition(this.x + 40, this.y);
    this.driver = null;
    this.body.setVelocity(0, 0);
    this.velocity.set(0, 0);
  }
}
