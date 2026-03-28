import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./ImageNumerateTool.css";
//import defaultImage from "../assets/interior/home/Generic_Home_1_Layer_1.png";
//import defaultImage from "../assets/interior/condominium/Condominium_Design_2_layer_1.png"
//import defaultImage from "../assets/interior/gym/Gym_layer_1.png"
//import defaultImage from "../assets/tilesets/5_Floor_Modular_Buildings_16x16.png";
//import defaultImage from "../assets/tilesets/4_Generic_Buildings_16x16.png";
//import defaultImage from '../assets/spritesheets/character/Premade_Character_18.png';
import defaultImage from '../assets/tilesets/2_City_Terrains_16x16.png'

const ImageNumerateTool = () => {
    const [imageSrc, setImageSrc] = useState(defaultImage);
    const [tileWidth, setTileWidth] = useState(16);
    const [tileHeight, setTileHeight] = useState(16);
    const [zoom, setZoom] = useState(1);
    const [showAlways, setShowAlways] = useState(false);
    const [isZeroIndexed, setIsZeroIndexed] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [isSelecting, setIsSelecting] = useState(false);
    const [isCollisionMode, setIsCollisionMode] = useState(false);
    const [collisionShapes, setCollisionShapes] = useState([]);
    const [isDrawingShape, setIsDrawingShape] = useState(false);
    const [shapeStart, setShapeStart] = useState(null);
    const [selectionStart, setSelectionStart] = useState(null);
    const [selectionEnd, setSelectionEnd] = useState(null);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [startPos, setStartPos] = useState({
        x: 0,
        y: 0,
        initialX: 50,
        initialY: 50,
    });
    const [imgPos, setImgPos] = useState({ x: 50, y: 50 });
    const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
    const imgRef = useRef(null);
    const viewerRef = useRef(null);

    // Global drag / selection / drawing handlers
    useEffect(() => {
        if (!isDragging && !isSelecting && !isDrawingShape) return;

        const handleGlobalMouseMove = (e) => {
            if (!viewerRef.current) return;

            if (isDragging) {
                const dx = e.clientX - startPos.x;
                const dy = e.clientY - startPos.y;
                setImgPos({
                    x: startPos.initialX + dx,
                    y: startPos.initialY + dy,
                });
            } else if (isSelecting) {
                const rect = viewerRef.current.getBoundingClientRect();
                const x = (e.clientX - rect.left - imgPos.x) / zoom;
                const y = (e.clientY - rect.top - imgPos.y) / zoom;
                const col = Math.floor(x / tileWidth);
                const row = Math.floor(y / tileHeight);
                setSelectionEnd({ row, col });
            } else if (isDrawingShape) {
                const rect = viewerRef.current.getBoundingClientRect();
                const x = Math.round((e.clientX - rect.left - imgPos.x) / zoom);
                const y = Math.round((e.clientY - rect.top - imgPos.y) / zoom);

                setCollisionShapes((prev) => {
                    const newShapes = [...prev];
                    const activeShape = newShapes[newShapes.length - 1];
                    if (activeShape) {
                        activeShape.w = Math.abs(x - shapeStart.x);
                        activeShape.h = Math.abs(y - shapeStart.y);
                        activeShape.x = Math.min(x, shapeStart.x);
                        activeShape.y = Math.min(y, shapeStart.y);
                    }
                    return newShapes;
                });
            }
        };

        const handleGlobalMouseUp = () => {
            if (isSelecting && selectionStart && selectionEnd) {
                processSelection();
            }
            setIsDragging(false);
            setIsSelecting(false);
            setIsDrawingShape(false);
        };

        window.addEventListener("mousemove", handleGlobalMouseMove);
        window.addEventListener("mouseup", handleGlobalMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleGlobalMouseMove);
            window.removeEventListener("mouseup", handleGlobalMouseUp);
        };
    }, [
        isDragging,
        isSelecting,
        isDrawingShape,
        startPos,
        imgPos,
        zoom,
        tileWidth,
        tileHeight,
        selectionStart,
        selectionEnd,
        shapeStart,
    ]);

    const processSelection = () => {
        if (!selectionStart || !selectionEnd) return;

        const minRow = Math.max(0, Math.min(selectionStart.row, selectionEnd.row));
        const maxRow = Math.min(
            rows - 1,
            Math.max(selectionStart.row, selectionEnd.row),
        );
        const minCol = Math.max(0, Math.min(selectionStart.col, selectionEnd.col));
        const maxCol = Math.min(
            cols - 1,
            Math.max(selectionStart.col, selectionEnd.col),
        );

        const selectedIndices = [];
        for (let r = minRow; r <= maxRow; r++) {
            for (let c = minCol; c <= maxCol; c++) {
                const index = r * cols + c;
                selectedIndices.push(isZeroIndexed ? index : index + 1);
            }
        }

        const arrayString = JSON.stringify(selectedIndices);
        navigator.clipboard.writeText(arrayString).then(() => {
            setCopiedIndex(`Range: ${selectedIndices.length} tiles`);
            setTimeout(() => setCopiedIndex(null), 2000);
        });

        setSelectionStart(null);
        setSelectionEnd(null);
    };

    const handleImageLoad = (e) => {
        setImgSize({
            width: e.target.naturalWidth,
            height: e.target.naturalHeight,
        });
    };

    const copyToClipboard = (index) => {
        const val = isZeroIndexed ? index : index + 1;
        navigator.clipboard.writeText(val.toString()).then(() => {
            setCopiedIndex(val);
            setTimeout(() => setCopiedIndex(null), 1500);
        });
    };

    const copyCollisionData = () => {
        // Find selection bounds in pixels to normalize collision shapes relative to top-left of selection
        if (!selectionStart && collisionShapes.length === 0) return;

        const dataString = JSON.stringify(
            collisionShapes.map((s) => ({
                x: s.x,
                y: s.y,
                width: s.w,
                height: s.h,
                isSensor: !!s.isSensor,
            })),
        );

        navigator.clipboard.writeText(dataString).then(() => {
            setCopiedIndex("Collision Data Copied");
            setTimeout(() => setCopiedIndex(null), 2000);
        });
    };

    const toggleSensor = (id) => {
        setCollisionShapes((prev) =>
            prev.map((s) => (s.id === id ? { ...s, isSensor: !s.isSensor } : s)),
        );
    };

    const deleteShape = (id) => {
        setCollisionShapes((prev) => prev.filter((s) => s.id !== id));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (f) => {
                setImageSrc(f.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const setPreviewSize = (w, h) => {
        setTileWidth(w);
        setTileHeight(h || w);
    };

    const cols = imgSize.width ? Math.floor(imgSize.width / tileWidth) : 0;
    const rows = imgSize.height ? Math.floor(imgSize.height / tileHeight) : 0;
    const totalTiles = cols * rows;

    const renderGrid = () => {
        const tiles = [];

        // Define selection bounds for highlighting
        const minRow =
            selectionStart && selectionEnd
                ? Math.min(selectionStart.row, selectionEnd.row)
                : -1;
        const maxRow =
            selectionStart && selectionEnd
                ? Math.max(selectionStart.row, selectionEnd.row)
                : -1;
        const minCol =
            selectionStart && selectionEnd
                ? Math.min(selectionStart.col, selectionEnd.col)
                : -1;
        const maxCol =
            selectionStart && selectionEnd
                ? Math.max(selectionStart.col, selectionEnd.col)
                : -1;

        // Cap tiling to prevent browser hang on massive images with tiny tiles
        const safeTotal = Math.min(totalTiles, 5000);

        for (let i = 0; i < safeTotal; i++) {
            const r = Math.floor(i / cols);
            const c = i % cols;

            const isSelected =
                r >= minRow && r <= maxRow && c >= minCol && c <= maxCol;

            tiles.push(
                <div
                    key={i}
                    className={`tile-overlay ${isSelected ? "selected" : ""}`}
                    onClick={() => !isCollisionMode && copyToClipboard(i)}
                    style={{
                        left: c * tileWidth * zoom,
                        top: r * tileHeight * zoom,
                        width: tileWidth * zoom,
                        height: tileHeight * zoom,
                    }}
                >
                    {!isCollisionMode && (
                        <span
                            className="tile-number"
                            style={{ fontSize: `${Math.max(12, 14 * zoom)}px` }}
                        >
                            {isZeroIndexed ? i : i + 1}
                        </span>
                    )}
                </div>,
            );
        }
        return tiles;
    };

    return (
        <div className="numerate-tool-container">
            <nav className="tool-nav">
                <Link to="/" className="back-link">
                    ← Back to Game
                </Link>
                <h1>
                    Image Numerate Tool{" "}
                    {isCollisionMode && (
                        <span className="mode-badge">COLLISION MODE</span>
                    )}
                </h1>
                {copiedIndex !== null && (
                    <div className="copy-toast">{copiedIndex}</div>
                )}
            </nav>

            <div className="tool-layout">
                <aside className="tool-sidebar">
                    <section className="control-group">
                        <label>Upload Images</label>
                        <input
                            type="file"
                            onChange={handleFileUpload}
                            accept="image/*"
                            className="file-input"
                        />
                    </section>

                    <div className="dimension-controls">
                        <section className="control-group">
                            <label>Tile Width (px)</label>
                            <input
                                type="number"
                                value={tileWidth}
                                onChange={(e) => setTileWidth(Number(e.target.value))}
                                min="1"
                            />
                        </section>
                        <section className="control-group">
                            <label>Tile Height (px)</label>
                            <input
                                type="number"
                                value={tileHeight}
                                onChange={(e) => setTileHeight(Number(e.target.value))}
                                min="1"
                            />
                        </section>
                    </div>

                    <section className="control-group">
                        <label>Presets</label>
                        <div className="preset-buttons">
                            <button onClick={() => setPreviewSize(16)}>16x16</button>
                            <button onClick={() => setPreviewSize(32)}>32x32</button>
                            <button onClick={() => setPreviewSize(64)}>64x64</button>
                            <button onClick={() => setPreviewSize(16, 32)}>16x32</button>
                        </div>
                    </section>

                    <section className="control-group">
                        <label>Zoom (x{zoom.toFixed(1)})</label>
                        <input
                            type="range"
                            min="0.5"
                            max="8"
                            step="0.5"
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                        />
                    </section>

                    <section className="control-group toggle-group">
                        <label className="toggle-label">
                            <input
                                type="checkbox"
                                checked={showAlways}
                                onChange={(e) => setShowAlways(e.target.checked)}
                                disabled={isCollisionMode}
                            />
                            Show All Numbers
                        </label>
                        <label className="toggle-label">
                            <input
                                type="checkbox"
                                checked={isZeroIndexed}
                                onChange={(e) => setIsZeroIndexed(e.target.checked)}
                            />
                            Use 0-indexing
                        </label>
                    </section>

                    <section className="control-group collision-controls">
                        <label>Collision Tools</label>
                        <button
                            className={`tool-btn ${isCollisionMode ? "active" : ""}`}
                            onClick={() => setIsCollisionMode(!isCollisionMode)}
                        >
                            {isCollisionMode ? "Exit Collision Mode" : "Edit Collision Shape"}
                        </button>
                        {isCollisionMode && (
                            <>
                                <button
                                    className="tool-btn sub-btn"
                                    onClick={() => setCollisionShapes([])}
                                >
                                    Clear All Shapes
                                </button>
                                <button
                                    className="tool-btn sub-btn primary"
                                    onClick={copyCollisionData}
                                >
                                    Copy Collision JSON
                                </button>
                            </>
                        )}
                    </section>

                    <div className="info-panel">
                        <p>
                            Image: {imgSize.width}x{imgSize.height}
                        </p>
                        <p>
                            Grid: {cols} x {rows}
                        </p>
                        <p>Total Tiles: {totalTiles}</p>
                        {totalTiles > 5000 && (
                            <p className="warning">⚠️ Only displaying first 5000 tiles</p>
                        )}
                    </div>
                </aside>

                <main className="tool-viewer">
                    <div
                        ref={viewerRef}
                        className={`image-window ${isDragging ? "is-dragging" : ""} ${isCollisionMode ? "collision-mode" : ""}`}
                        style={{
                            cursor: isDragging
                                ? "grabbing"
                                : isCollisionMode
                                    ? "crosshair"
                                    : "grab",
                        }}
                        onMouseDown={(e) => {
                            if (isCollisionMode) {
                                setIsDrawingShape(true);
                                const rect = viewerRef.current.getBoundingClientRect();
                                const x = Math.round((e.clientX - rect.left - imgPos.x) / zoom);
                                const y = Math.round((e.clientY - rect.top - imgPos.y) / zoom);
                                setShapeStart({ x, y });
                                setCollisionShapes((prev) => [
                                    ...prev,
                                    { x, y, w: 0, h: 0, id: Date.now() },
                                ]);
                            } else if (e.shiftKey) {
                                setIsSelecting(true);
                                const rect = viewerRef.current.getBoundingClientRect();
                                const x = (e.clientX - rect.left - imgPos.x) / zoom;
                                const y = (e.clientY - rect.top - imgPos.y) / zoom;
                                const col = Math.floor(x / tileWidth);
                                const row = Math.floor(y / tileHeight);
                                setSelectionStart({ row, col });
                                setSelectionEnd({ row, col });
                            } else {
                                setIsDragging(true);
                                setStartPos({
                                    x: e.clientX,
                                    y: e.clientY,
                                    initialX: imgPos.x,
                                    initialY: imgPos.y,
                                });
                            }
                        }}
                    >
                        <div
                            className="image-wrapper"
                            style={{
                                width: imgSize.width * zoom,
                                height: imgSize.height * zoom,
                                position: "absolute",
                                left: imgPos.x,
                                top: imgPos.y,
                                margin: 0,
                            }}
                        >
                            <img
                                ref={imgRef}
                                src={imageSrc}
                                alt="Target Tileset"
                                onLoad={handleImageLoad}
                                onDragStart={(e) => e.preventDefault()}
                                className="target-image"
                                style={{
                                    width: imgSize.width * zoom,
                                    height: imgSize.height * zoom,
                                    imageRendering: "pixelated",
                                }}
                            />
                            <div
                                className={`grid-overlay ${showAlways ? "show-always" : "show-hover"}`}
                            >
                                {renderGrid()}
                            </div>
                            {isCollisionMode && (
                                <div className="collision-overlay">
                                    {collisionShapes.map((shape) => (
                                        <div
                                            key={shape.id}
                                            className={`collision-rect ${shape.isSensor ? "is-sensor" : "is-solid"}`}
                                            style={{
                                                left: shape.x * zoom,
                                                top: shape.y * zoom,
                                                width: shape.w * zoom,
                                                height: shape.h * zoom,
                                            }}
                                        >
                                            <span className="rect-dims">
                                                {shape.w}x{shape.h}
                                            </span>
                                            <div className="shape-controls">
                                                <button
                                                    className={`sensor-toggle ${shape.isSensor ? "active" : ""}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleSensor(shape.id);
                                                    }}
                                                    title="Toggle Sensor"
                                                >
                                                    {shape.isSensor ? "S" : "W"}
                                                </button>
                                                <button
                                                    className="delete-shape"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteShape(shape.id);
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ImageNumerateTool;
