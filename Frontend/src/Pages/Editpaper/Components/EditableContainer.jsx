import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { X, Plus, Edit2, Grid3x3, Space } from "lucide-react";
import BigNewsContainer1 from "../Containers_/BigContainer1";
import BigNewsContainer2 from "../Containers_/BigContainer2";
import BigNewsContainer3 from "../Containers_/BigContainer3";
import BigNewsContainer4 from "../Containers_/BigContainer4";
import BigNewsContainer5 from "../Containers_/BigContainer5";

import NorContainer1 from "../Containers_/NorContainer1";
import NorContainer2 from "../Containers_/NorContainer2";
import NorContainer3 from "../Containers_/NorContainer3";
import NorContainer4 from "../Containers_/NorContainer4";
import NorContainer5 from "../Containers_/NorContainer5";

import jwt from "../../../assets/jwt.jpg";

export function EditableContainer({ id, onDelete, initialPosition }) {


  const [showSettings, setShowSettings] = useState(false);


  // const [columns, setColumns] = useState(2);
  // const [gap, setGap] = useState(10);
  // const [droppedContainers, setDroppedContainers] = useState([]);

  
  const handleDelete = (e) => {
    if (e.detail === 2) {
      onDelete(id);
    }
  };

const handleDrop = (e) => {
  e.preventDefault();
  const type = e.dataTransfer.getData("text/plain");

  const newContainer = {
    id: Date.now(),
    type,
    data: {
      image: jwt,
      headline: `Sample Headline for ${type}`,
      content: "This is sample content for the news container.",
      time: "2 hours ago",
    },
  };

  setDroppedContainers((prev) => [...prev, newContainer]);
};


  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDeleteDroppedContainer = (containerId) => {
    setDroppedContainers(droppedContainers.filter(c => c.id !== containerId));
  };
const COMPONENT_MAP = {
  "Big Container Type 1": BigNewsContainer1,
  "Big Container Type 2": BigNewsContainer2,
  "Big Container Type 3": BigNewsContainer3,
  "Big Container Type 4": BigNewsContainer4,
  "Big Container Type 5": BigNewsContainer5,
  "Normal Container Type 1": NorContainer1,
  "Normal Container Type 2": NorContainer2,
  "Normal Container Type 3": NorContainer3,
  "Normal Container Type 4": NorContainer4,
  "Normal Container Type 5": NorContainer5,
};

  return (
    <Rnd
      default={{
        x: initialPosition.x,
        y: initialPosition.y,
        width: 700,
        height: 250,
      }}
      minWidth={300}
      minHeight={150}
      bounds="parent"
      enableResizing={true}
      dragHandleClassName="drag-handle-container"
      style={{
        border: "2px dashed #666",
        background: "transparent",
        position: "absolute",
        cursor: "move"
      }}
    >
      <div 
        className="drag-handle-container" 
        style={{ 
          width: "100%", 
          height: "100%", 
          position: "relative", 
          pointerEvents: "auto",
          overflow: "auto"
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div style={{ position: "absolute", top: "8px", right: "8px", display: "flex", gap: "8px", zIndex: 1000, pointerEvents: "auto" }}>
          <button 
            onClick={() => setShowSettings(!showSettings)} 
            className="control-btn edit-btn"
            style={{ 
              background: "green", 
              border: "none", 
              borderRadius: "4px", 
              padding: "6px", 
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Edit2 size={18} color="white" />
          </button>
          <button 
            onClick={handleDelete} 
            className="control-btn delete-btn" 
            title="Double click to delete"
            style={{ 
              background: "red", 
              border: "none", 
              borderRadius: "4px", 
              padding: "6px", 
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <X size={18} color="white" />
          </button>
        </div>

        {showSettings && (
          <div 
            className="settings-panel"
            style={{
              position: "absolute",
              top: "50px",
              right: "8px",
              background: "white",
              border: "2px solid #666",
              borderRadius: "8px",
              padding: "15px",
              zIndex: 20,
              minWidth: "220px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <span style={{ fontWeight: "600", fontSize: "14px" }}>Settings</span>
              <button 
                onClick={() => setShowSettings(false)} 
                className="settings-close"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <Grid3x3 size={16} />
                <label style={{ fontSize: "13px", fontWeight: "500" }}>Column Count</label>
              </div>
              <input
                type="number"
                value={columns}
                onChange={(e) => setColumns(parseInt(e.target.value) || 1)}
                min="1"
                max="6"
                className="settings-input"
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "13px"
                }}
              />
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <Space size={16} />
                <label style={{ fontSize: "13px", fontWeight: "500" }}>Gap (px)</label>
              </div>
              <input
                type="number"
                value={gap}
                onChange={(e) => setGap(parseInt(e.target.value) || 0)}
                min="0"
                max="50"
                className="settings-input"
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "13px"
                }}
              />
            </div>
          </div>
        )}

        {/* Drop zone message when empty */}
        {droppedContainers.length === 0 && (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "#999",
            fontSize: "14px",
            textAlign: "center",
            padding: "20px"
          }}>
            Drop containers here
          </div>
        )}

        {/* Render dropped containers */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${gap}px`,
    padding: "10px",
    pointerEvents: "none",
  }}
>
  {droppedContainers.map((container) => {
    const Component = COMPONENT_MAP[container.type];
    if (!Component) return null;

    return (
      <div key={container.id} style={{ pointerEvents: "auto" }}>
        <Component
          {...container.data}
          border={true}
          onDelete={() => handleDeleteDroppedContainer(container.id)}
        />
      </div>
    );
  })}
</div>

      </div>
    </Rnd>
  );
}