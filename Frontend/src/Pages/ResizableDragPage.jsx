import React from "react";
import { Rnd } from "react-rnd";
import { useState } from "react";

export default function ResizableDragPage() {
 const [boxes, setBoxes] = useState([
    { id: 1, x: 100, y: 100, width: 200, height: 150, color: "#4dabf7" },
    { id: 2, x: 400, y: 100, width: 200, height: 150, color: "#74c0fc" },
    { id: 3, x: 100, y: 100, width: 200, height: 150, color: "#4dabf7" },
    { id: 4, x: 400, y: 100, width: 200, height: 150, color: "#74c0fc" },
    { id: 5, x: 100, y: 100, width: 200, height: 150, color: "#4dabf7" },
    { id: 6, x: 400, y: 100, width: 200, height: 150, color: "#74c0fc" },
  ]);

  // Function to check overlap
  const isOverlapping = (a, b) => {
    return !(
      a.x + a.width < b.x ||
      a.x > b.x + b.width ||
      a.y + a.height < b.y ||
      a.y > b.y + b.height
    );
  };

  const handleDragStop = (id, d) => {
    setBoxes((prev) => {
      const newBoxes = [...prev];
      const current = newBoxes.find((box) => box.id === id);
      const oldX = current.x;
      const oldY = current.y;

      current.x = d.x;
      current.y = d.y;

      // Check for collision with other boxes
      const collided = newBoxes.some(
        (box) => box.id !== id && isOverlapping(current, box)
      );

      // If collided, revert to old position
      if (collided) {
        current.x = oldX;
        current.y = oldY;
      }

      return [...newBoxes];
    });
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        position: "relative",
        background: "#f8f9fa",
      }}
    >
      <h2 style={{ textAlign: "center", padding: "10px" }}>
        🚫 No Overlapping Boxes
      </h2>

      {boxes.map((box) => (
        <Rnd
          key={box.id}
          size={{ width: box.width, height: box.height }}
          position={{ x: box.x, y: box.y }}
          bounds="parent"
          onDragStop={(e, d) => handleDragStop(box.id, d)}
          onResizeStop={(e, direction, ref, delta, position) => {
            setBoxes((prev) =>
              prev.map((b) =>
                b.id === box.id
                  ? {
                      ...b,
                      width: parseInt(ref.style.width),
                      height: parseInt(ref.style.height),
                      ...position,
                    }
                  : b
              )
            );
          }}
          style={{
            border: "2px solid #007bff",
            borderRadius: "10px",
            background: box.color,
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ padding: "10px", color: "white" }}>Box {box.id}</p>
        </Rnd>
      ))}
    </div>
  );
}
