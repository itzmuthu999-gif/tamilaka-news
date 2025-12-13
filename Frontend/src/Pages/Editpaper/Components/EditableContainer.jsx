import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { X, Plus, Edit2, Grid3x3, Space } from "lucide-react";


export function EditableContainer({ id, onDelete, initialPosition }) {
  const [showSettings, setShowSettings] = useState(false);
  const [columns, setColumns] = useState(2);
  const [gap, setGap] = useState(10);

  const handleDelete = (e) => {
    if (e.detail === 2) {
      onDelete(id);
    }
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
      <div className="drag-handle-container" style={{ width: "100%", height: "100%", position: "relative", pointerEvents: "auto" }}>
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
      </div>
    </Rnd>
  );
}
