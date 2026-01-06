import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { GrRevert } from "react-icons/gr";
import { useSelector, useDispatch } from "react-redux";
import { addLine, updateLineArguments } from "../../Slice/editpaperslice";
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
  onAddSlider = () => {},
  onAddSlider2 = () => {},
}) {
  const dispatch = useDispatch();
  const activePage = useSelector(state => state.editpaper.activePage);
  const activeLineId = useSelector(state => state.editpaper.activeLineId);
  
  // Get active line data
  const activeLine = useSelector(state => {
    if (!activeLineId) return null;
    const page = state.editpaper.pages.find(p => p.catName === activePage);
    return page?.lines.find(l => l.id === activeLineId);
  });

  const [categories, setCategories] = useState(initialCategories);
  const [activeCategory, setActiveCategory] = useState(initialCategories[0] || "");
  const [showAddInput, setShowAddInput] = useState(false);
  const [showDeleteInput, setShowDeleteInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [deleteCategory, setDeleteCategory] = useState("");
  const [activeTab, setActiveTab] = useState("containers");
  const [showBorders, setShowBorders] = useState(true);
  const [showLines, setShowLines] = useState(true);
  const [switchpos, setSwitchpos] = useState([1080, 10]);
  
  // Line arguments state
  const [lineArguments, setLineArguments] = useState("");

  // Update line arguments when active line changes
  useEffect(() => {
    if (activeLine) {
      setLineArguments(`${activeLine.length}-${activeLine.x}-${activeLine.y}`);
    } else {
      setLineArguments("");
    }
  }, [activeLine]);

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

  // Handle line arguments input
  const handleLineArgumentsChange = (e) => {
    const value = e.target.value;
    setLineArguments(value);

    // Parse format: length-x-y
    const parts = value.split("-");
    if (parts.length === 3 && activeLineId) {
      const length = parseInt(parts[0]);
      const x = parseInt(parts[1]);
      const y = parseInt(parts[2]);

      if (!isNaN(length) && !isNaN(x) && !isNaN(y)) {
        dispatch(
          updateLineArguments({
            catName: activePage,
            lineId: activeLineId,
            length,
            x,
            y,
          })
        );
      }
    }
  };

  // Handle dropping lines
  const handleLineClick = (lineType, orientation) => {
    dispatch(
      addLine(activePage, lineType, orientation, { x: 100, y: 100 })
    );
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
    { id: 1, label: "Slider Type 1 (Carousel)", action: onAddSlider },
    { id: 2, label: "Slider Type 2 (Horizontal)", action: onAddSlider2 },
  ];

  const lineTypes = [
    { id: 1, type: "pink-bold", orientation: "horizontal", label: "pink bold line (hr)" },
    { id: 2, type: "pink-bold", orientation: "vertical", label: "pink bold line (vr)" },
    { id: 3, type: "light-grey", orientation: "horizontal", label: "light grey line (hr)" },
    { id: 4, type: "light-grey", orientation: "vertical", label: "light grey line (vr)" },
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

          {/* ✅ DRAGGABLE CONTAINER OVERLAY */}
          {activeTab === "containers" && (
            <div
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("containerOverlay", "true");
                e.dataTransfer.effectAllowed = "copy";
              }}
              style={{
                padding: "15px",
                margin: "10px 0",
                border: "2px dashed #2196F3",
                borderRadius: "8px",
                background: "#e3f2fd",
                cursor: "grab",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                fontWeight: "600",
                color: "#1976d2",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#bbdefb";
                e.currentTarget.style.borderColor = "#1976d2";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#e3f2fd";
                e.currentTarget.style.borderColor = "#2196F3";
              }}
            >
              <Plus size={20} />
              Container Overlay (Drag to Canvas)
            </div>
          )}

          <div className="tabs-container">
            {["containers", "sliders", "lines", "headers", "ad", "layouts"].map((tab) => (
              <div key={tab} onClick={() => setActiveTab(tab)} className={`tab-item ${activeTab === tab ? "active" : ""}`}>
                {tab}
              </div>
            ))}
          </div>

          <div className="drag-box">
            {/* SLIDERS TAB */}
            {activeTab === "sliders" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "15px", padding: "20px" }}>
                {sliderTypes.map((slider) => (
                  <button
                    key={slider.id}
                    onClick={slider.action}
                    className="dds-add-cont-btn"
                    style={{
                      width: "100%",
                      padding: "15px",
                      fontSize: "14px",
                      fontWeight: "500"
                    }}
                  >
                    <Plus size={18} />
                    {slider.label}
                  </button>
                ))}
              </div>
            ) : activeTab === "lines" ? (
              /* LINES TAB */
              <div style={{ padding: "20px" }}>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(4, 1fr)", 
                  gap: "15px",
                  marginBottom: "20px"
                }}>
                  {lineTypes.map((line) => (
                    <div
                      key={line.id}
                      onClick={() => handleLineClick(line.type, line.orientation)}
                      style={{
                        border: "2px solid #ddd",
                        borderRadius: "8px",
                        padding: "20px 10px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "15px",
                        cursor: "pointer",
                        background: "white",
                        minHeight: "120px",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#2196F3";
                        e.currentTarget.style.background = "#f5f5f5";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#ddd";
                        e.currentTarget.style.background = "white";
                      }}
                    >
                      {/* Line preview */}
                      <div style={{
                        width: line.orientation === "horizontal" ? "80px" : "4px",
                        height: line.orientation === "horizontal" ? (line.type === "pink-bold" ? "4px" : "2px") : "80px",
                        backgroundColor: line.type === "pink-bold" ? "#e91e63" : "#d0d0d0",
                      }} />
                      
                      {/* Label */}
                      <div style={{
                        fontSize: "11px",
                        color: "#666",
                        textAlign: "center",
                        fontWeight: "500"
                      }}>
                        {line.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Line Arguments Input */}
                <div style={{
                  marginTop: "20px",
                  padding: "15px",
                  background: "#f9f9f9",
                  borderRadius: "8px",
                  border: "1px solid #ddd"
                }}>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    marginBottom: "8px",
                    color: "#333"
                  }}>
                    Choose Line Arguments:
                    <br />
                    <span style={{ fontSize: "11px", fontWeight: "normal", color: "#666" }}>
                      (length-Xpos-Ypos)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={lineArguments}
                    onChange={handleLineArgumentsChange}
                    placeholder="500-0-0"
                    disabled={!activeLineId}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontSize: "13px",
                      fontFamily: "monospace",
                      background: activeLineId ? "white" : "#f0f0f0",
                      cursor: activeLineId ? "text" : "not-allowed"
                    }}
                  />
                  {!activeLineId && (
                    <div style={{
                      fontSize: "11px",
                      color: "#999",
                      marginTop: "5px"
                    }}>
                      Click on a line in the canvas to edit its properties
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* OTHER TABS */
              getActiveItems().map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", item.label);
                    e.dataTransfer.effectAllowed = "copy";
                  }}
                  onDragEnd={(e) => {
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}