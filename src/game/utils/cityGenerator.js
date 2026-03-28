export const TStyle = {
    BLOCK: 'BLOCK',
    PARK: 'PARK',
};

const LAYOUTS = {
    street: [
        [1593, 1594, 1595, 1596, 1597],
        [1652, 1653, 1654, 1655, 1656],
        [1711, 1712, 1713, 1714, 1715],
        [1770, 1771, 1772, 1773, 1774]
    ],
    sidewalk: [
        [1366, 1367, 1368, 1369],
        [1425, 1426, 1427, 1428],
        [1484, 1485, 1486, 1487],
        [1543, 1544, 1545, 1546],
    ],
    streetMiddleX: [[425], [425], [425], [425]],
    streetMiddleY: [[366, 366, 366, 366, 366]],
    crossRoadBorderY: [[241, 242], [243, 244], [243, 244], [243, 244], [243, 244], [243, 244], [243, 244], [243, 244], [300, 301]],
    crossRoadBorderX: [[359, 361, 361, 361, 361, 361, 361, 361, 361, 361, 360], [418, 420, 420, 420, 420, 420, 420, 420, 420, 420, 419]],
    grass: [
        [144, 145, 144, 145],
        [203, 204, 203, 204],
        [144, 145, 144, 145],
        [203, 204, 203, 204],
    ]
};

const renderBlockArea = (terrain, x, y, style) => {
    const layout = style === TStyle.PARK ? LAYOUTS.grass : LAYOUTS.sidewalk;
    // Standard block area is 9x7 segments of 4x4 tiles
    for (let bx = 0; bx < 9; bx++) {
        for (let by = 0; by < 7; by++) {
            terrain.addSegment(x + bx * 4, y + by * 4, layout);
        }
    }
};

const renderInfrastructure = (terrain, x, y) => {
    // 1. Horizontal Street (below the block)
    const streetY = y + 28;
    for (let sx = 0; sx < 35; sx += 5) {
        terrain.addSegment(x + sx, streetY, LAYOUTS.street);
        terrain.addSegment(x + sx, streetY + 4, LAYOUTS.streetMiddleY);
        terrain.addSegment(x + sx, streetY + 5, LAYOUTS.street);
    }
    // Right border of horizontal street
    terrain.addSegment(x + 34, streetY, LAYOUTS.crossRoadBorderY);
    terrain.addSegment(x + 0, streetY, LAYOUTS.crossRoadBorderY);
    // 2. Vertical Street (right of the block)
    const streetX = x + 36;
    for (let sy = 0; sy < 28; sy += 4) {
        terrain.addSegment(streetX, y + sy, LAYOUTS.street);
        terrain.addSegment(streetX + 5, y + sy, LAYOUTS.streetMiddleX);
        terrain.addSegment(streetX + 6, y + sy, LAYOUTS.street);
    }
    // Top and bottom borders of vertical street
    terrain.addSegment(streetX, y, LAYOUTS.crossRoadBorderX);
    terrain.addSegment(streetX, y + 26, LAYOUTS.crossRoadBorderX);

    // 3. Intersection (bottom-right of the block)
    const interX = x + 36;
    const interY = y + 28;
    terrain.addSegment(interX, interY, LAYOUTS.street); // top-left quadrant
    terrain.addSegment(interX, interY + 4, LAYOUTS.street); // bottom-left quadrant
    terrain.addSegment(interX + 6, interY, LAYOUTS.street); // top-right quadrant
    terrain.addSegment(interX + 6, interY + 4, LAYOUTS.street); // bottom-right quadrant
    // Cross-fills
    terrain.addSegment(interX + 5, interY, LAYOUTS.street);
    terrain.addSegment(interX + 5, interY + 4, LAYOUTS.street);
    terrain.addSegment(interX, interY + 4, LAYOUTS.street);
    terrain.addSegment(interX + 6, interY + 4, LAYOUTS.street);
    terrain.addSegment(interX + 0, interY + 5, LAYOUTS.street);
    terrain.addSegment(interX + 3, interY + 5, LAYOUTS.street);
    terrain.addSegment(interX + 6, interY + 5, LAYOUTS.street);
};

export const generateCityGrid = (terrain, config) => {
    const borderTiles = 10;
    const cellWidth = 47;
    const cellHeight = 37;

    // Use default repeats if config is not provided (backwards compatibility)
    if (!config || !Array.isArray(config)) {
        console.warn("[cityGenerator] No config provided, using single default block.");
        config = [[TStyle.BLOCK]];
    }

    console.log(`[cityGenerator] Starting modular grid generation: ${config.length} rows...`);

    config.forEach((row, gy) => {
        row.forEach((style, gx) => {
            const startX = gx * cellWidth;
            const startY = borderTiles + gy * cellHeight;

            renderBlockArea(terrain, startX, startY, style);
            renderInfrastructure(terrain, startX, startY);
        });
    });

    console.log("[cityGenerator] Modular generation complete.");
};
