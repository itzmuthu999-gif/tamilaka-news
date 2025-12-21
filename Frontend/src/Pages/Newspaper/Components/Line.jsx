import React from "react";

export default function Line({
  direction = "H",
  length = "100px",
  thickness = "2px",
  color = "#000"
}) {
  if (direction === "V") {
    return (
      <div
        style={{
          flex: "0 0 auto",     // 🔒 HARD STOP
          minWidth: thickness, // 🔒 CANNOT COLLAPSE
          display: "flex",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            width: thickness,
            height: length,
            backgroundColor: color
          }}
        />
      </div>
    );
  }

  // Horizontal
  return (
    <div
      style={{
        width: length,
        height: thickness,
        backgroundColor: color,
        margin: "5px 0",
        flexShrink: 0
      }}
    />
  );
}
