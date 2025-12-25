import React, { useState } from "react";
import { X, Plus, Edit2, Grid3x3, Space } from "lucide-react";
import { GrRevert } from "react-icons/gr";
import './pageeditor.scss';

import bcont1 from "../../../assets/Containers/bcont1.png";
import bcont2 from "../../../assets/Containers/bcont2.png";
import bcont3 from "../../../assets/Containers/bcont3.png";
import bcont4 from "../../../assets/Containers/bcont4.png";
import ncont1 from "../../../assets/Containers/ncont1.png";
import ncont2 from "../../../assets/Containers/ncont2.png";
import ncont3 from "../../../assets/Containers/ncont3.png";
import ncont4 from "../../../assets/Containers/ncont4.png";
import ncont5 from "../../../assets/Containers/ncont5.png";

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
  const [showDeleteInput, setShowDeleteInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [deleteCategory, setDeleteCategory] = useState("");
  const [activeTab, setActiveTab] = useState("containers");
  const [showBorders, setShowBorders] = useState(true);
  const [showLines, setShowLines] = useState(true);
  const [height, setHeight] = useState(600);
  const [switchpos, setSwitchpos] = useState([1080, 10]);

  if (!open) return null;

  const handleAddCategory = () => {
    if (newCategory.trim() !== "") {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
      setShowAddInput(false);
    }
  };

  const handleDeleteCategory = () => {
    const categoryToDelete = deleteCategory.trim();
    
    if (categoryToDelete && categories.includes(categoryToDelete)) {
      const updatedCategories = categories.filter(cat => cat !== categoryToDelete);
      setCategories(updatedCategories);
      
      if (activeCategory === categoryToDelete) {
        setActiveCategory(updatedCategories[0] || "");
      }
    }
    
    setDeleteCategory("");
    setShowDeleteInput(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddCategory();
    }
  };

  const handleDeleteKeyPress = (e) => {
    if (e.key === "Enter") {
      handleDeleteCategory();
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
    { id: 5, img: bcont4, label: "Big Container Type 4A" },
    { id: 6, img: bcont4, label: "Big Container Type 5" },
    { id: 7, img: ncont1, label: "Normal Container Type 1" },
    { id: 8, img: ncont2, label: "Normal Container Type 2" },
    { id: 9, img: ncont3, label: "Normal Container Type 3" },
    { id: 10, img: ncont4, label: "Normal Container Type 4" },
    { id: 11, img: ncont4, label: "Normal Container Type 4A" },
    { id: 12, img: ncont5, label: "Normal Container Type 5" },
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
    <div className="page-editor-container" style={{transform: `translate(${switchpos[0]}px,${switchpos[1]}px)`}}>
      <div className="page-editor-header">
        <div className="page-editor-title">Page Editor</div>
        <div style={{display: "flex", gap: "10px"}}>
          <button className="pe-rev-btn" onClick={() => setSwitchpos(v => v[0] === 1080 ? [10, 10] : [1080, 10])}>
            <GrRevert/>
          </button>
          <button className="page-editor-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="page-editor-content" style={{ 
        overflowY: "auto",
        flex: 1
      }}>
        <div className="switch-pages-section">
          <button className="save-changes-btn">Save changes</button>
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

          {!showAddInput && !showDeleteInput && (
            <>
              <button onClick={() => setShowAddInput(true)} className="add-page-btn">
                Add New page
              </button>
              <button onClick={() => setShowDeleteInput(true)} className="dlt-page-btn">
                Delete page
              </button>
            </>
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

          {showDeleteInput && (
            <div className="add-page-input-container">
              <input
                type="text"
                value={deleteCategory}
                onChange={(e) => setDeleteCategory(e.target.value)}
                onKeyPress={handleDeleteKeyPress}
                placeholder="Enter page name to delete..."
                autoFocus
                className="add-page-input"
              />
              <button onClick={handleDeleteCategory} className="dlt-page-btn">
                Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteInput(false);
                  setDeleteCategory("");
                }}
                className="add-page-cancel-btn"
              >
                Cancel
              </button>
            </div>
          )}
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
                  // Set the data to be transferred
                  e.dataTransfer.setData("text/plain", item.label);
                  // Set effect to copy (shows + cursor icon)
                  e.dataTransfer.effectAllowed = "copy";
                }}
                onDragEnd={(e) => {
                  // This ensures the original stays in place
                  e.preventDefault();
                }}
                className="draggable-item"
                style={{ cursor: "grab" }}
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
  );
}