import { useState, useEffect } from 'react';
import { PhaserGame } from './game/PhaserGame';
import { EventBus } from './game/EventBus';
import { Joystick } from './components/Joystick';
import './App.css';

function App() {
  const [money, setMoney] = useState(0);
  const [inventory, setInventory] = useState(10); // Start with 10g

  useEffect(() => {
    const handleDelivery = (data) => {
      setMoney(prev => prev + data.money);
      setInventory(prev => Math.max(0, prev - data.amount));
    };

    EventBus.on('delivery-complete', handleDelivery);

    return () => {
      EventBus.off('delivery-complete', handleDelivery);
    };
  }, []);

  return (
    <div className="App">
      <header style={{ position: 'absolute', top: 0, left: 0, zIndex: 10, padding: '20px', pointerEvents: 'none', width: '100%' }}>
        <h1 style={{ color: '#00ff00', margin: 0, fontSize: '32px', textShadow: '2px 2px 4px #000', textAlign: 'center' }}>WEED EMPIRE</h1>
      </header>
      <PhaserGame />
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: '15px',
        borderRadius: '12px',
        border: '2px solid #00ff00',
        minWidth: '150px',
        boxShadow: '0 0 10px #00ff00'
      }}>
        <p style={{ margin: '5px 0', fontSize: '18px' }}>💰 Cash: ${money}</p>
        <p style={{ margin: '5px 0', fontSize: '18px' }}>🌿 Stock: {inventory}g</p>
      </div>

      {/* Mobile Controls */}
      <Joystick />
      <button
        style={{
          position: 'absolute',
          bottom: '40px',
          right: '160px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 255, 0, 0.5)',
          color: 'white',
          border: '2px solid rgba(255, 255, 255, 0.5)',
          fontSize: '24px',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 101,
          boxShadow: '0 0 15px #00ff00',
          touchAction: 'none'
        }}
        onClick={() => EventBus.emit('player-interact-touch')}
        onTouchStart={(e) => {
          e.preventDefault();
          EventBus.emit('player-interact-touch');
        }}
      >
        E
      </button>
    </div>
  );
}

export default App;
