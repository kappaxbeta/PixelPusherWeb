import CondominiumLayer1 from "../../assets/interior/condominium/Condominium_Design_2_layer_1.png";
import CondominiumLayer2 from "../../assets/interior/condominium/Condominium_Design_2_layer_2.png";
import GymLayer1 from "../../assets/interior/gym/Gym_layer_1.png";
import GymLayer2 from "../../assets/interior/gym/Gym_layer_2.png";
import flat1 from "../../assets/interior/home/Generic_Home_1_Layer_1.png";
import flat2 from "../../assets/interior/home/Generic_Home_1_Layer_2_.png";

const interiorConfigs = {
  condominium: {
    buildingId: "Condominium",
    collision: [
      { x: 1, y: 79, width: 29, height: 16, isSensor: false },
      { x: 1, y: 0, width: 16, height: 81, isSensor: false },
      { x: 17, y: 1, width: 15, height: 30, isSensor: false },
      { x: 49, y: 0, width: 31, height: 30, isSensor: false },
      { x: 97, y: 0, width: 30, height: 30, isSensor: false },
      { x: 144, y: 0, width: 32, height: 30, isSensor: false },
      { x: 192, y: 0, width: 32, height: 31, isSensor: false },
      { x: 207, y: 31, width: 17, height: 57, isSensor: false },
      { x: 193, y: 79, width: 15, height: 19, isSensor: false },
      { x: 64, y: 79, width: 96, height: 17, isSensor: false },
      { x: 25, y: 94, width: 41, height: 4, isSensor: false },
      { x: 159, y: 96, width: 38, height: 7, isSensor: false },
      { x: 28, y: 1, width: 169, height: 17, isSensor: false },
    ],
    imageLayer: [CondominiumLayer1, CondominiumLayer2],
    playerStart: { x: 43, y: 61 },
    portals: [
      {
        x: 30,
        y: 82,
        width: 35,
        height: 12,
        target: "MainCity",
        id: "exit",
      },
      {
        x: 159,
        y: 82,
        width: 35,
        height: 12,
        isSensor: false,
        target: "Condominium",
        id: "entry",
      },
      {
        x: 32,
        y: 0,
        width: 17,
        height: 30,
        isSensor: false,
        target: "flat",
        id: "entry_flat1",
      },
      {
        x: 79,
        y: 3,
        width: 17,
        height: 25,
        target: "flat",
        id: "entry_flat2",
      },
      {
        x: 127,
        y: 0,
        width: 18,
        height: 27,
        target: "flat",
        id: "entry_flat3",
      },
      {
        x: 174,
        y: 2,
        width: 19,
        height: 26,
        target: "flat",
        id: "entry_flat4",
      },
    ],
    subInteriors: {
      flat: {
        buildingId: "Flat",
        collision: [
          { x: -1, y: -1, width: 50, height: 62, isSensor: false },
          { x: 49, y: -1, width: 158, height: 32, isSensor: false },
          { x: 192, y: 28, width: 33, height: 51, isSensor: false },
          { x: 224, y: 79, width: 1, height: 22, isSensor: false },
          { x: 193, y: 99, width: 31, height: 118, isSensor: false },
          { x: 1, y: 113, width: 0, height: 0, isSensor: false },
          { x: 1, y: 96, width: 46, height: 119, isSensor: false },
          { x: -7, y: 61, width: 8, height: 38, isSensor: false },
          { x: 47, y: 127, width: 64, height: 32, isSensor: false },
          { x: 129, y: 129, width: 72, height: 30, isSensor: false },
          { x: 47, y: 209, width: 152, height: 6, isSensor: false },
        ],
        imageLayer: [flat1, flat2],
        playerStart: { x: 113, y: 100 },
        portals: [
          {
            x: 105,
            y: 190,
            width: 30,
            height: 10,
            target: "Condominium",
            scene: "InteriorScene",
            id: "exit",
          },
        ],
      },
    },
  },
  gym: {
    buildingId: "Gym",
    collision: [
      { x: 225, y: 209, width: 81, height: 30, isSensor: false },
      { x: -1, y: 208, width: 178, height: 31, isSensor: false },
      { x: 3, y: 47, width: 14, height: 162, isSensor: false },
      { x: 1, y: 0, width: 15, height: 47, isSensor: false },
      { x: 6, y: 0, width: 170, height: 31, isSensor: false },
      { x: 159, y: 1, width: 50, height: 78, isSensor: false },
      { x: 209, y: 0, width: 94, height: 33, isSensor: false },
      { x: 290, y: 33, width: 15, height: 181, isSensor: false },
      { x: 223, y: 143, width: 67, height: 33, isSensor: false },
      { x: 15, y: 130, width: 161, height: 30, isSensor: false },
      { x: 176, y: 238, width: 50, height: 5, isSensor: false },
    ],
    imageLayer: [GymLayer1, GymLayer2],
    playerStart: { x: 187, y: 200 },
    portals: [
      {
        x: 175,
        y: 223,
        width: 51,
        height: 17,
        target: "MainCity",
        id: "exit",
      },
    ],
  },
  red_building_hallway: {
    buildingId: "Red Building Hallway",
    tileset: "city-props",
    mapData: [
      [80, 80, 80, 80, 80, 80, 80, 80, 80, 80],
      [80, 5, 5, 5, 5, 5, 5, 5, 5, 80],
      [80, 5, 5, 5, 5, 5, 5, 5, 5, 80],
      [80, 80, 80, 5, 5, 5, 5, 80, 80, 80],
      [80, 1, 1, 5, 5, 5, 5, 1, 1, 80],
      [80, 1, 1, 5, 5, 5, 5, 1, 1, 80],
      [80, 80, 80, 80, 5, 5, 80, 80, 80, 80],
    ],
    playerStart: { x: 320, y: 400 },
    portals: [
      {
        x: 320,
        y: 440,
        width: 64,
        height: 32,
        target: "MainCity",
        id: "exit",
      },
      {
        x: 100,
        y: 100,
        width: 32,
        height: 32,
        target: "Flat_101",
        id: "door_101",
      },
      {
        x: 540,
        y: 100,
        width: 32,
        height: 32,
        target: "Flat_102",
        id: "door_102",
      },
    ],
    subInteriors: {
      Flat_101: {
        buildingId: "Flat 101",
        tileset: "city-props",
        mapData: [
          [5, 5, 5],
          [5, 5, 5],
          [5, 5, 5],
        ],
        playerStart: { x: 100, y: 100 },
        npcs: [
          {
            x: 150,
            y: 120,
            name: "Dealer Dan",
            config: {
              type: "buy",
              item: "weed",
              amount: 1,
              price: 60,
              prompt: "Sell 1g for $60?",
            },
          },
        ],
        portals: [{ x: 100, y: 150, target: "red_building_hallway" }],
      },
    },
  },
};

export default interiorConfigs;
