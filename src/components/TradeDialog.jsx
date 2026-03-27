import React from "react";

const TradeDialog = ({
  npcName,
  prompt,
  price,
  inventory,
  onSell,
  onClose,
}) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        backdropFilter: "blur(10px)",
        padding: "40px",
        borderRadius: "24px",
        border: "2px solid #00ff00",
        boxShadow: "0 0 30px rgba(0, 255, 0, 0.2)",
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#fff",
        fontFamily: '"Courier New", Courier, monospace',
        minWidth: "350px",
      }}
    >
      <h2
        style={{
          color: "#00ff00",
          margin: "0 0 20px 0",
          fontSize: "24px",
          textTransform: "uppercase",
          letterSpacing: "2px",
        }}
      >
        Deal with {npcName}
      </h2>

      <p
        style={{
          fontSize: "18px",
          margin: "0 0 10px 0",
          textAlign: "center",
        }}
      >
        {prompt}
      </p>

      <p
        style={{
          fontSize: "14px",
          color: "#aaaaaa",
          margin: "0 0 30px 0",
        }}
      >
        You have:{" "}
        <span style={{ color: inventory > 0 ? "#00ff00" : "#ff0000" }}>
          {inventory}g
        </span>
      </p>

      <div
        style={{
          display: "flex",
          gap: "20px",
          width: "100%",
        }}
      >
        <button
          onClick={onSell}
          disabled={inventory <= 0}
          style={{
            flex: 1,
            padding: "15px",
            backgroundColor:
              inventory > 0 ? "rgba(0, 255, 0, 0.2)" : "rgba(50, 50, 50, 0.5)",
            border: `2px solid ${inventory > 0 ? "#00ff00" : "#555"}`,
            color: inventory > 0 ? "#00ff00" : "#555",
            borderRadius: "12px",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: inventory > 0 ? "pointer" : "not-allowed",
            transition: "all 0.2s",
            textTransform: "uppercase",
          }}
          onMouseEnter={(e) => {
            if (inventory > 0)
              e.target.style.backgroundColor = "rgba(0, 255, 0, 0.4)";
          }}
          onMouseLeave={(e) => {
            if (inventory > 0)
              e.target.style.backgroundColor = "rgba(0, 255, 0, 0.2)";
          }}
        >
          Sell Weed
        </button>

        <button
          onClick={onClose}
          style={{
            flex: 1,
            padding: "15px",
            backgroundColor: "rgba(50, 50, 50, 0.2)",
            border: "2px solid #fff",
            color: "#fff",
            borderRadius: "12px",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s",
            textTransform: "uppercase",
          }}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = "rgba(50, 50, 50, 0.4)")
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = "rgba(50, 50, 50, 0.2)")
          }
        >
          Cancel
        </button>
      </div>

      {inventory <= 0 && (
        <p
          style={{
            color: "#ff0000",
            fontSize: "12px",
            margin: "15px 0 0 0",
            fontStyle: "italic",
          }}
        >
          Not enough stock to complete the deal.
        </p>
      )}
    </div>
  );
};

export default TradeDialog;
