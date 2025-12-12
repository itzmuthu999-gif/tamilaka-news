import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { X, Plus, Edit2, Grid3x3, Space } from "lucide-react";
import "./pageeditor.scss";

import bcont1 from "../../../assets/Containers/bcont1.png";
import bcont2 from "../../../assets/Containers/bcont2.png";
import bcont3 from "../../../assets/Containers/bcont3.png";
import bcont4 from "../../../assets/Containers/bcont4.png";
import ncont1 from "../../../assets/Containers/ncont1.png";
import ncont2 from "../../../assets/Containers/ncont2.png";
import ncont3 from "../../../assets/Containers/ncont3.png";
import ncont4 from "../../../assets/Containers/ncont4.png";
import ncont5 from "../../../assets/Containers/ncont5.png";

// Simple EditableContainer Component
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

// PageEditor Component
export default function PageEditor({
  open = false,
  onClose = () => {},
  categories: initialCategories = [],
  onHeightChange = () => {},
  onAddContainer = () => {},
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [activeCategory, setActiveCategory] = useState(initialCategories[0] || "");
  const [showAddInput, setShowAddInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [activeTab, setActiveTab] = useState("containers");
  const [showBorders, setShowBorders] = useState(true);
  const [showLines, setShowLines] = useState(true);
  const [height, setHeight] = useState(600);

  if (!open) return null;

  const handleAddCategory = () => {
    if (newCategory.trim() !== "") {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
      setShowAddInput(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddCategory();
    }
  };

  const handleHeightChange = (e) => {
    const newHeight = parseInt(e.target.value) || 600;
    setHeight(newHeight);
    onHeightChange(newHeight);
  };

  const containerTypes = [
    { id: 1, img: bcont1, label: "Big Container Type 1" },
    { id: 2, img: bcont2, label: "Big Container Type 2" },
    { id: 3, img: bcont3, label: "Big Container Type 3" },
    { id: 4, img: bcont4, label: "Big Container Type 4" },
    { id: 5, img: ncont1, label: "Normal Container Type 1" },
    { id: 6, img: ncont2, label: "Normal Container Type 2" },
    { id: 7, img: ncont3, label: "Normal Container Type 3" },
    { id: 8, img: ncont4, label: "Normal Container Type 4" },
    { id: 9, img: ncont5, label: "Normal Container Type 5" },
  ];

  const sliderTypes = [
    { id: 4, label: "Slider type 1" },
    { id: 5, label: "Slider type 2" },
  ];

  const lineTypes = [
    { id: 6, label: "Line style 1" },
    { id: 7, label: "Line style 2" },
  ];

  const headerTypes = [
    { id: 8, label: "Header type 1" },
    { id: 9, label: "Header type 2" },
  ];

  const adTypes = [
    { id: 10, label: "Ad banner 1" },
    { id: 11, label: "Ad banner 2" },
  ];

  const layoutTypes = [
    { id: 12, label: "Layout 1" },
    { id: 13, label: "Layout 2" },
  ];

  const getActiveItems = () => {
    switch (activeTab) {
      case "containers":
        return containerTypes;
      case "sliders":
        return sliderTypes;
      case "lines":
        return lineTypes;
      case "headers":
        return headerTypes;
      case "ad":
        return adTypes;
      case "layouts":
        return layoutTypes;
      default:
        return containerTypes;
    }
  };

  return (
    <Rnd
      default={{
        x: 100,
        y: 100,
        width: 450,
        height: 600,
      }}
      minWidth={400}
      minHeight={500}
      bounds="window"
      dragHandleClassName="drag-handle"
      style={{
        zIndex: 99999,
        position: "fixed",
      }}
    >
      <div className="page-editor-container">
        <div className="page-editor-header drag-handle">
          <div className="page-editor-title">Page Editor</div>
          <button className="page-editor-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="page-editor-content">
          <div className="switch-pages-section">
            <div className="section-title">switch pages</div>
            <div className="categories-container">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCategory(cat)}
                  className={`category-btn ${activeCategory === cat ? "active" : ""}`}
                >
                  {cat.toLowerCase()}
                </button>
              ))}
            </div>

            {!showAddInput && (
              <button onClick={() => setShowAddInput(true)} className="add-page-btn">
                Add New page
              </button>
            )}

            {showAddInput && (
              <div className="add-page-input-container">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter page name..."
                  autoFocus
                  className="add-page-input"
                />
                <button onClick={handleAddCategory} className="add-page-submit-btn">
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddInput(false);
                    setNewCategory("");
                  }}
                  className="add-page-cancel-btn"
                >
                  Cancel
                </button>
              </div>
            )}

            <button className="save-changes-btn">Save changes</button>
          </div>

          <div className="toggle-buttons-container">
            <button onClick={() => setShowBorders(!showBorders)} className={`toggle-btn ${showBorders ? "active" : ""}`}>
              {showBorders ? "Hide Borders" : "Show Borders"}
            </button>
            <button onClick={() => setShowLines(!showLines)} className={`toggle-btn ${showLines ? "active" : ""}`}>
              {showLines ? "Remove Lines" : "Show Lines"}
            </button>
          </div>

          <div className="drag-drop-section">
            <div className="section-title">Drag and Drop the containers</div>

            <button onClick={onAddContainer} className="dds-add-cont-btn">
              <Plus size={18} />
              Add Container Overlay
            </button>

            <div className="dds-add-ht">
              <div>Height</div>
              <div className="div">
                <input type="number" value={height} onChange={handleHeightChange} />
              </div>
            </div>

            <div className="tabs-container">
              {["containers", "sliders", "lines", "headers", "ad", "layouts"].map((tab) => (
                <div key={tab} onClick={() => setActiveTab(tab)} className={`tab-item ${activeTab === tab ? "active" : ""}`}>
                  {tab}
                </div>
              ))}
            </div>

            <div className="drag-box">
              {getActiveItems().map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", item.label);
                  }}
                  className="draggable-item"
                >
                  {item.img && (
                    <img src={item.img} alt={item.label} className={`draggable-item-img ${showBorders ? "with-border" : "no-border"}`} />
                  )}
                  {!item.img && <div className={`draggable-item-img ${showBorders ? "with-border" : "no-border"}`}></div>}
                  <div className="draggable-item-label">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Rnd>
  );
}