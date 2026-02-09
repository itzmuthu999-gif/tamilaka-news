import React from "react";
import Line from "../Components/Line";

export default function PreviewLine({ lineType, orientation, length, x, y }) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      <Line 
        lineType={lineType} 
        orientation={orientation} 
        length={length}
      />
    </div>
  );
}
