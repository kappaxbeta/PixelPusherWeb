import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { PhaserGame } from "./game/PhaserGame";
import { EventBus } from "./game/EventBus";
import { Joystick } from "./components/Joystick";
import TradeDialog from "./components/TradeDialog";
import ImageNumerateTool from "./components/ImageNumerateTool";
import "./App.css";

function GameView() {
  const [money, setMoney] = useState(0);
  const [inventory, setInventory] = useState(10); // Start with 10g
  const [tradeData, setTradeData] = useState({
    isOpen: false,
    npcName: "",
    prompt: "",
    price: 0,
    amount: 1,
  });

  useEffect(() => {
    const handleDelivery = (data) => {
      setMoney((prev) => prev + data.money);
      setInventory((prev) => Math.max(0, prev - data.amount));
    };

    const handleOpenTrade = (data) => {
      setTradeData({
        isOpen: true,
        npcName: data.npcName,
        prompt: data.prompt,
        price: data.price,
        amount: data.amount || 1,
      });
    };

    EventBus.on("delivery-complete", handleDelivery);
    EventBus.on("open-trade", handleOpenTrade);

    return () => {
      EventBus.off("delivery-complete", handleDelivery);
      EventBus.off("open-trade", handleOpenTrade);
    };
  }, []);

  const handleSell = () => {
    if (inventory >= tradeData.amount) {
      setInventory((prev) => prev - tradeData.amount);
      setMoney((prev) => prev + tradeData.price);
      // Optional: Visual feedback or close menu
      // setTradeData(prev => ({ ...prev, isOpen: false }));
      // EventBus.emit("trade-success");
    }
  };

  const closeTrade = () => {
    setTradeData((prev) => ({ ...prev, isOpen: false }));
    EventBus.emit("close-trade-menu"); // Unfreeze player in Phaser
  };

  return (
    <div className="App">
      <header
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 10,
          padding: "20px",
          pointerEvents: "none",
          width: "100%",
        }}
      >
        <h1
          style={{
            color: "#00ff00",
            margin: 0,
            fontSize: "32px",
            textShadow: "2px 2px 4px #000",
            textAlign: "center",
          }}
        >
          WEED EMPIRE
        </h1>
      </header>
      <PhaserGame />

      {tradeData.isOpen && (
        <TradeDialog
          npcName={tradeData.npcName}
          prompt={tradeData.prompt}
          price={tradeData.price}
          inventory={inventory}
          onSell={handleSell}
          onClose={closeTrade}
        />
      )}

      {/* Stats UI */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          color: "#fff",
          backgroundColor: "rgba(0,0,0,0.8)",
          padding: "15px",
          borderRadius: "12px",
          border: "2px solid #00ff00",
          minWidth: "150px",
          boxShadow: "0 0 10px #00ff00",
        }}
      >
        <p style={{ margin: "5px 0", fontSize: "18px" }}>💰 Cash: ${money}</p>
        <p style={{ margin: "5px 0", fontSize: "18px" }}>
          🌿 Stock: {inventory}g
        </p>
      </div>

      <Joystick />
      <button
        style={{
          position: "absolute",
          bottom: "40px",
          right: "160px",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          backgroundColor: "rgba(0, 255, 0, 0.5)",
          color: "white",
          border: "2px solid rgba(255, 255, 255, 0.5)",
          fontSize: "24px",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 101,
          boxShadow: "0 0 15px #00ff00",
          touchAction: "none",
        }}
        onClick={() => EventBus.emit("player-interact-touch")}
        onTouchStart={(e) => {
          e.preventDefault();
          EventBus.emit("player-interact-touch");
        }}
      >
        E
      </button>

      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <Link
          to="/numerate"
          style={{
            color: "#00ff00",
            textDecoration: "none",
            backgroundColor: "rgba(0,0,0,0.8)",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "1px solid #00ff00",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          Numerate Tool
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<GameView />} />
      <Route path="/numerate" element={<ImageNumerateTool />} />
    </Routes>
  );
}

export default App;
