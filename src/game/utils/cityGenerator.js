export const generateCityGrid = (terrain, repeats = 50) => {
    const borderTiles = 10; // Red building height (4 tiles) + ~80px (5 tiles) = 9-10 tiles
    // Grid configuration: 50 repeats of 30x30 tile units
    // Total city size effectively increased to accommodate larger segments
    const streetWidth = 10; // Two streetParts (5+5) side-by-side
    const blockSize = 20;
    const segmentSize = blockSize + streetWidth; // 30 tiles

    const streetLayout = [
        [1593, 1594, 1595, 1596, 1597],
        [1652, 1653, 1654, 1655, 1656],
        [1711, 1712, 1713, 1714, 1715],
        [1770, 1771, 1772, 1773, 1774]
    ];

    const sidewalkLayout = [
        [1366, 1367, 1368, 1369],
        [1425, 1426, 1427, 1428],
        [1484, 1485, 1486, 1487],
        [1543, 1544, 1545, 1546],
    ];

    const StreetMiddleX = [[425], [425], [425], [425]]
    const StreetMiddleY = [[366, 366, 366, 366, 366]]

    const CrossRoadBorderY = [[241, 242], [243, 244], [243, 244], [243, 244], [243, 244], [243, 244], [243, 244], [243, 244], [300, 301]]
    const CrossRoadBorderDownY = [[300, 301]]
    const CrossRoadStreetY = [[243, 244], [302, 303]]

    const CrossRoadBorderX = [[359, 361, 361, 361, 361, 361, 361, 361, 361, 361, 360], [418, 420, 420, 420, 420, 420, 420, 420, 420, 420, 419]]

    const CrossRoadBorderLeftX = [[359], [418]]
    const CrossRoadBorderRIghtX = [[360], [419]]
    const CrossRoadStreetX = [[361, 362], [420, 421]]
    console.log(`[cityGenerator] Starting grid generation: ${repeats}x${repeats} segments with ${borderTiles} tile top border...`);

    //Top Left Walkstonge
    terrain.addSegment(0, 0, sidewalkLayout);
    terrain.addSegment(0, 4, sidewalkLayout);
    terrain.addSegment(0, 8, sidewalkLayout);
    terrain.addSegment(0, 12, sidewalkLayout);
    terrain.addSegment(0, 16, sidewalkLayout);
    terrain.addSegment(0, 20, sidewalkLayout);
    terrain.addSegment(0, 24, sidewalkLayout);
    terrain.addSegment(4, 0, sidewalkLayout);
    terrain.addSegment(4, 4, sidewalkLayout);
    terrain.addSegment(4, 8, sidewalkLayout);
    terrain.addSegment(4, 12, sidewalkLayout);
    terrain.addSegment(4, 16, sidewalkLayout);
    terrain.addSegment(4, 20, sidewalkLayout);
    terrain.addSegment(4, 24, sidewalkLayout);
    terrain.addSegment(8, 0, sidewalkLayout);
    terrain.addSegment(8, 4, sidewalkLayout);
    terrain.addSegment(8, 8, sidewalkLayout);
    terrain.addSegment(8, 12, sidewalkLayout);
    terrain.addSegment(8, 16, sidewalkLayout);
    terrain.addSegment(8, 20, sidewalkLayout);
    terrain.addSegment(8, 24, sidewalkLayout);
    terrain.addSegment(12, 0, sidewalkLayout);
    terrain.addSegment(12, 4, sidewalkLayout);
    terrain.addSegment(12, 8, sidewalkLayout);
    terrain.addSegment(12, 12, sidewalkLayout);
    terrain.addSegment(12, 16, sidewalkLayout);
    terrain.addSegment(12, 20, sidewalkLayout);
    terrain.addSegment(12, 24, sidewalkLayout);
    terrain.addSegment(16, 0, sidewalkLayout);
    terrain.addSegment(16, 4, sidewalkLayout);
    terrain.addSegment(16, 8, sidewalkLayout);
    terrain.addSegment(16, 12, sidewalkLayout);
    terrain.addSegment(16, 16, sidewalkLayout);
    terrain.addSegment(16, 20, sidewalkLayout);
    terrain.addSegment(16, 24, sidewalkLayout);
    terrain.addSegment(20, 0, sidewalkLayout);
    terrain.addSegment(20, 4, sidewalkLayout);
    terrain.addSegment(20, 8, sidewalkLayout);
    terrain.addSegment(20, 12, sidewalkLayout);
    terrain.addSegment(20, 16, sidewalkLayout);
    terrain.addSegment(20, 20, sidewalkLayout);
    terrain.addSegment(20, 24, sidewalkLayout);
    terrain.addSegment(24, 0, sidewalkLayout);
    terrain.addSegment(24, 4, sidewalkLayout);
    terrain.addSegment(24, 8, sidewalkLayout);
    terrain.addSegment(24, 12, sidewalkLayout);
    terrain.addSegment(24, 16, sidewalkLayout);
    terrain.addSegment(24, 20, sidewalkLayout);
    terrain.addSegment(24, 24, sidewalkLayout);
    terrain.addSegment(28, 0, sidewalkLayout);
    terrain.addSegment(28, 4, sidewalkLayout);
    terrain.addSegment(28, 8, sidewalkLayout);
    terrain.addSegment(28, 12, sidewalkLayout);
    terrain.addSegment(28, 16, sidewalkLayout);
    terrain.addSegment(28, 20, sidewalkLayout);
    terrain.addSegment(28, 24, sidewalkLayout);
    terrain.addSegment(32, 0, sidewalkLayout);
    terrain.addSegment(32, 4, sidewalkLayout);
    terrain.addSegment(32, 8, sidewalkLayout);
    terrain.addSegment(32, 12, sidewalkLayout);
    terrain.addSegment(32, 16, sidewalkLayout);
    terrain.addSegment(32, 20, sidewalkLayout);
    terrain.addSegment(32, 24, sidewalkLayout);


    // Street X
    terrain.addSegment(0, 28, streetLayout)
    terrain.addSegment(0, 32, StreetMiddleY)
    terrain.addSegment(0, 33, streetLayout)
    terrain.addSegment(0, 28, CrossRoadBorderY)
    terrain.addSegment(5, 28, streetLayout)
    terrain.addSegment(5, 32, StreetMiddleY)
    terrain.addSegment(5, 33, streetLayout)
    terrain.addSegment(10, 28, streetLayout)
    terrain.addSegment(10, 32, StreetMiddleY)
    terrain.addSegment(10, 33, streetLayout)
    terrain.addSegment(15, 28, streetLayout)
    terrain.addSegment(15, 32, StreetMiddleY)
    terrain.addSegment(15, 33, streetLayout)
    terrain.addSegment(20, 28, streetLayout)
    terrain.addSegment(20, 32, StreetMiddleY)
    terrain.addSegment(20, 33, streetLayout)
    terrain.addSegment(25, 28, streetLayout)
    terrain.addSegment(25, 32, StreetMiddleY)
    terrain.addSegment(25, 33, streetLayout)
    terrain.addSegment(30, 28, streetLayout)
    terrain.addSegment(30, 32, StreetMiddleY)
    terrain.addSegment(30, 33, streetLayout)
    terrain.addSegment(34, 28, CrossRoadBorderY)



    terrain.addSegment(0, 37, sidewalkLayout);
    terrain.addSegment(0, 4 + 37, sidewalkLayout);
    terrain.addSegment(0, 8 + 37, sidewalkLayout);
    terrain.addSegment(0, 12 + 37, sidewalkLayout);
    terrain.addSegment(0, 16 + 37, sidewalkLayout);
    terrain.addSegment(0, 20 + 37, sidewalkLayout);
    terrain.addSegment(0, 24 + 37, sidewalkLayout);
    terrain.addSegment(4, 0 + 37, sidewalkLayout);
    terrain.addSegment(4, 4 + 37, sidewalkLayout);
    terrain.addSegment(4, 8 + 37, sidewalkLayout);
    terrain.addSegment(4, 12 + 37, sidewalkLayout);
    terrain.addSegment(4, 16 + 37, sidewalkLayout);
    terrain.addSegment(4, 20 + 37, sidewalkLayout);
    terrain.addSegment(4, 24 + 37, sidewalkLayout);
    terrain.addSegment(8, 0 + 37, sidewalkLayout);
    terrain.addSegment(8, 4 + 37, sidewalkLayout);
    terrain.addSegment(8, 8 + 37, sidewalkLayout);
    terrain.addSegment(8, 12 + 37, sidewalkLayout);
    terrain.addSegment(8, 16 + 37, sidewalkLayout);
    terrain.addSegment(8, 20 + 37, sidewalkLayout);
    terrain.addSegment(8, 24 + 37, sidewalkLayout);
    terrain.addSegment(12, 0 + 37, sidewalkLayout);
    terrain.addSegment(12, 4 + 37, sidewalkLayout);
    terrain.addSegment(12, 8 + 37, sidewalkLayout);
    terrain.addSegment(12, 12 + 37, sidewalkLayout);
    terrain.addSegment(12, 16 + 37, sidewalkLayout);
    terrain.addSegment(12, 20 + 37, sidewalkLayout);
    terrain.addSegment(12, 24 + 37, sidewalkLayout);
    terrain.addSegment(16, 0 + 37, sidewalkLayout);
    terrain.addSegment(16, 4 + 37, sidewalkLayout);
    terrain.addSegment(16, 8 + 37, sidewalkLayout);
    terrain.addSegment(16, 12 + 37, sidewalkLayout);
    terrain.addSegment(16, 16 + 37, sidewalkLayout);
    terrain.addSegment(16, 20 + 37, sidewalkLayout);
    terrain.addSegment(16, 24 + 37, sidewalkLayout);
    terrain.addSegment(20, 0 + 37, sidewalkLayout);
    terrain.addSegment(20, 4 + 37, sidewalkLayout);
    terrain.addSegment(20, 8 + 37, sidewalkLayout);
    terrain.addSegment(20, 12 + 37, sidewalkLayout);
    terrain.addSegment(20, 16 + 37, sidewalkLayout);
    terrain.addSegment(20, 20 + 37, sidewalkLayout);
    terrain.addSegment(20, 24 + 37, sidewalkLayout);
    terrain.addSegment(24, 0 + 37, sidewalkLayout);
    terrain.addSegment(24, 4 + 37, sidewalkLayout);
    terrain.addSegment(24, 8 + 37, sidewalkLayout);
    terrain.addSegment(24, 12 + 37, sidewalkLayout);
    terrain.addSegment(24, 16 + 37, sidewalkLayout);
    terrain.addSegment(24, 20 + 37, sidewalkLayout);
    terrain.addSegment(24, 24 + 37, sidewalkLayout);
    terrain.addSegment(28, 0 + 37, sidewalkLayout);
    terrain.addSegment(28, 4 + 37, sidewalkLayout);
    terrain.addSegment(28, 8 + 37, sidewalkLayout);
    terrain.addSegment(28, 12 + 37, sidewalkLayout);
    terrain.addSegment(28, 16 + 37, sidewalkLayout);
    terrain.addSegment(28, 20 + 37, sidewalkLayout);
    terrain.addSegment(28, 24 + 37, sidewalkLayout);
    terrain.addSegment(32, 0 + 37, sidewalkLayout);
    terrain.addSegment(32, 4 + 37, sidewalkLayout);
    terrain.addSegment(32, 8 + 37, sidewalkLayout);
    terrain.addSegment(32, 12 + 37, sidewalkLayout);
    terrain.addSegment(32, 16 + 37, sidewalkLayout);
    terrain.addSegment(32, 20 + 37, sidewalkLayout);
    terrain.addSegment(32, 24 + 37, sidewalkLayout);

    // StreetUP
    terrain.addSegment(36, 0, streetLayout)
    terrain.addSegment(41, 0, StreetMiddleX)
    terrain.addSegment(42, 0, streetLayout)
    terrain.addSegment(36, 0, CrossRoadBorderX)
    terrain.addSegment(36, 4, streetLayout)
    terrain.addSegment(41, 4, StreetMiddleX)
    terrain.addSegment(42, 4, streetLayout)
    terrain.addSegment(36, 8, streetLayout)
    terrain.addSegment(41, 8, StreetMiddleX)
    terrain.addSegment(42, 8, streetLayout)
    terrain.addSegment(36, 12, streetLayout)
    terrain.addSegment(41, 12, StreetMiddleX)
    terrain.addSegment(42, 12, streetLayout)
    terrain.addSegment(36, 16, streetLayout)
    terrain.addSegment(41, 16, StreetMiddleX)
    terrain.addSegment(42, 16, streetLayout)
    terrain.addSegment(36, 20, streetLayout)
    terrain.addSegment(41, 20, StreetMiddleX)
    terrain.addSegment(42, 20, streetLayout)
    terrain.addSegment(36, 24, streetLayout)
    terrain.addSegment(41, 24, StreetMiddleX)
    terrain.addSegment(42, 24, streetLayout)
    terrain.addSegment(36, 26, CrossRoadBorderX)

    // StreetCrosss
    terrain.addSegment(36, 28, streetLayout)
    terrain.addSegment(36, 32, streetLayout)
    terrain.addSegment(40, 28, streetLayout)
    terrain.addSegment(40, 32, streetLayout)
    terrain.addSegment(42, 28, streetLayout)
    terrain.addSegment(42, 32, streetLayout)
    terrain.addSegment(42, 33, streetLayout)
    terrain.addSegment(40, 33, streetLayout)
    terrain.addSegment(36, 33, streetLayout)

    terrain.addSegment(42, 37, streetLayout)
    terrain.addSegment(41, 37, StreetMiddleX)
    terrain.addSegment(36, 37, streetLayout)
    terrain.addSegment(36, 37, CrossRoadBorderX)
    terrain.addSegment(42, 41, streetLayout)
    terrain.addSegment(41, 41, StreetMiddleX)
    terrain.addSegment(36, 41, streetLayout)
    terrain.addSegment(42, 45, streetLayout)
    terrain.addSegment(41, 45, StreetMiddleX)
    terrain.addSegment(36, 45, streetLayout)
    terrain.addSegment(42, 49, streetLayout)
    terrain.addSegment(41, 49, StreetMiddleX)
    terrain.addSegment(36, 49, streetLayout)
    terrain.addSegment(42, 53, streetLayout)
    terrain.addSegment(41, 53, StreetMiddleX)
    terrain.addSegment(36, 53, streetLayout)
    terrain.addSegment(42, 57, streetLayout)
    terrain.addSegment(41, 57, StreetMiddleX)
    terrain.addSegment(36, 57, streetLayout)
    terrain.addSegment(42, 61, streetLayout)
    terrain.addSegment(41, 61, StreetMiddleX)
    terrain.addSegment(36, 61, streetLayout)
    terrain.addSegment(36, 63, CrossRoadBorderX)


    /* for (let gy = 0; gy < repeats; gy++) {
         for (let gx = 0; gx < repeats; gx++) {
             const startX = gx * segmentSize;
             const startY = borderTiles + (gy * segmentSize);
 
             // 1. Fill the block (20x20) with sidewalk tiles
             for (let by = 0; by < blockSize; by += 4) {
                 for (let bx = 0; bx < blockSize; bx += 4) {
                     terrain.addSegment(startX + bx, startY + by, sidewalkLayout);
                 }
             }
 
             // 2. Add horizontal street (composed of two segments for 10-tile width)
             for (let sx = 0; sx < segmentSize; sx += 5) {
                 // First part
                 terrain.addSegment(startX + sx, startY + blockSize, streetLayout);
                 // Second part (middle/extended)
                 terrain.addSegment(startX + sx, startY + blockSize + 4, StreetMiddleY);
             }
 
             // 3. Add vertical street (composed of two segments side-by-side)
             for (let sy = 0; sy < blockSize; sy += 4) {
                 // First lane
                 terrain.addSegment(startX + blockSize, startY + sy, sidewalkLayout);
                 // Second lane
                 terrain.addSegment(startX + blockSize + 4, startY + sy, sidewalkLayout);
             }
         }
     }*/

    console.log("[cityGenerator] Generation complete.");
};
