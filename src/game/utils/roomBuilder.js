/**
 * roomBuilder.js
 * Utility to generate 2D tile layouts for interior rooms.
 */

export const RoomStyles = {

  MODERN_GRAY: {
    floor: [2924], // Checkered dark floor
  },
};

/**
 * Generates a 2D array of tile indices for a room.
 */
export function generateRoomLayout(width, height, style = RoomStyles.MODERN_GRAY) {
  const floorTile = Array.isArray(style.floor) ? style.floor[0] : style.floor;

  const layout = Array.from({ length: height }, () =>
    Array(width).fill(floorTile),
  );


  return layout;
}
