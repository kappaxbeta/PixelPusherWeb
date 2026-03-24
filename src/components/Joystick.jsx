import { useState, useRef, useEffect } from 'react';
import { EventBus } from '../game/EventBus';

export const Joystick = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const joystickRef = useRef(null);
    const touchId = useRef(null);

    const handleStart = (e) => {
        const touch = e.touches[0];
        touchId.current = touch.identifier;
        setDragging(true);
        updateJoystick(touch.clientX, touch.clientY);
    };

    const handleMove = (e) => {
        if (!dragging) return;
        const touch = Array.from(e.touches).find(t => t.identifier === touchId.current);
        if (touch) {
            updateJoystick(touch.clientX, touch.clientY);
        }
    };

    const handleEnd = () => {
        setDragging(false);
        setPosition({ x: 0, y: 0 });
        touchId.current = null;
        EventBus.emit('joystick-move', { x: 0, y: 0 });
    };

    const updateJoystick = (clientX, clientY) => {
        const rect = joystickRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = clientX - centerX;
        const dy = clientY - centerY;
        const distance = Math.min(Math.sqrt(dx * dx + dy * dy), 40);
        const angle = Math.atan2(dy, dx);

        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        setPosition({ x, y });

        // Normalize for Phaser (range -1 to 1)
        EventBus.emit('joystick-move', {
            x: x / 40,
            y: y / 40
        });
    };

    return (
        <div
            ref={joystickRef}
            style={{
                position: 'absolute',
                bottom: '40px',
                right: '40px',
                width: '100px',
                height: '100px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                touchAction: 'none',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 100,
                border: '2px solid rgba(255, 255, 255, 0.4)'
            }}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
        >
            <div
                style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'rgba(0, 255, 0, 0.7)',
                    borderRadius: '50%',
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    boxShadow: '0 0 10px #00ff00'
                }}
            />
        </div>
    );
};
