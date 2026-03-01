import React, { useState, useEffect, useRef, useMemo } from "react";

import { X, Plus } from "lucide-react";

import { GrRevert } from "react-icons/gr";
import { IoIosClose } from "react-icons/io";

import { useSelector, useDispatch } from "react-redux";

import {
  addLine,
  updateLineArguments,
  setActivePage,
  deletePresetContainer,
} from "../../Slice/editpaperSlice/editpaperSlice";
import { selectAllPages, selectDistrictPage } from "../../Slice/adminSelectors";
import { saveLayout } from "../../../Api/layoutApi.js";

import "./pageeditor.scss";
import norcont1 from "../../../assets/Containers/norcont1.png";
import norcont4b from "../../../assets/Containers/norcont4b.png";
import bcont1 from "../../../assets/Containers/bcont1.png";

import bcont2 from "../../../assets/Containers/bcont2.png";

import bcont3 from "../../../assets/Containers/bcont3.png";

import bcont4 from "../../../assets/Containers/bcont4.png";

import ncont1 from "../../../assets/Containers/ncont1.png";

import ncont2 from "../../../assets/Containers/ncont2.png";

import ncont3 from "../../../assets/Containers/ncont3.png";

import ncont4 from "../../../assets/Containers/ncont4.png";
// import ncont4B from "../../../assets/Containers/ncont4.png";

import ncont5 from "../../../assets/Containers/ncont5.png";
import Universalcont from "../../../assets/Containers/ncont5.png";

const buildLayoutPayload = (layoutState) => ({
  pages: layoutState.pages,
  presetContainers: layoutState.presetContainers,
  activePage: layoutState.activePage,
  activeLineId: layoutState.activeLineId
});

// PresetsTab Component
const PresetsTab = () => {
  const dispatch = useDispatch();
  const presets = useSelector((state) => state.editpaper.presetContainers || []);

  const handleDeletePreset = (presetId, presetName) => {
    if (window.confirm(`Are you sure you want to delete preset "${presetName}"?`)) {
      dispatch(deletePresetContainer({ presetId }));
    }
  };

  if (presets.length === 0) {
    return (
      <div style={{ 
        padding: "40px 20px", 
        textAlign: "center",
        color: "#666" 
      }}>
        <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>
          No Presets Yet
        </div>
        <div style={{ fontSize: "13px", color: "#999" }}>
          Create a Universal Container and click "Save as Preset" to add one here
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ 
        fontSize: "14px", 
        fontWeight: "600", 
        marginBottom: "15px",
        color: "#333" 
      }}>
        Saved Presets ({presets.length})
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {presets.map((preset) => (
          <div
            key={preset.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("presetId", preset.id);
              e.dataTransfer.setData("text/plain", "Universal Container");
              e.dataTransfer.effectAllowed = "copy";
            }}
            style={{
              position: "relative",
              padding: "15px",
              background: "#f8f9fa",
              border: "2px solid #e0e0e0",
              borderRadius: "8px",
              cursor: "grab",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#e3f2fd";
              e.currentTarget.style.borderColor = "#2196F3";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#f8f9fa";
              e.currentTarget.style.borderColor = "#e0e0e0";
            }}
          >
            <button
              onClick={() => handleDeletePreset(preset.id, preset.presetName)}
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                background: "rgba(255, 255, 255, 0.9)",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2px",
                color: "red",
                transition: "all 0.2s ease",
              }}
              title="Delete preset"
            >
              <IoIosClose />
            </button>
            
            <div style={{ fontWeight: "600", fontSize: "14px", marginBottom: "8px", color: "#333" }}>
              {preset.presetName}
            </div>
            
            <div style={{ fontSize: "11px", color: "#666", fontFamily: "monospace" }}>
              <div>Container: {preset.dimensions.containerWidth}×{preset.dimensions.containerHeight}px</div>
              <div>Image: {preset.dimensions.imgWidth}×{preset.dimensions.imgHeight}px</div>
              <div>Padding: {preset.dimensions.padding}px</div>
            </div>
            
            <div style={{ 
              marginTop: "8px", 
              fontSize: "10px", 
              color: "#999",
              fontStyle: "italic" 
            }}>
              Drag and drop to use this preset
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function PageEditor({
  open = false,

  onClose = () => {},

  categories: initialCategories = [],

  onAddSlider = () => {},

  onAddSlider2 = () => {},
}) {
  const dispatch = useDispatch();

  const activePage = useSelector((state) => state.editpaper.activePage);

  const activeLineId = useSelector((state) => state.editpaper.activeLineId);
  const layoutState = useSelector((state) => state.editpaper);

  // Get pages and districts from admin slice
  const allPages = useSelector(selectAllPages);
  const districtPage = useSelector(selectDistrictPage);

  // Memoize derived values to prevent infinite re-renders
  const regularPages = useMemo(() => {
    return allPages.filter((page, index) => index !== allPages.length - 1);
  }, [allPages]);

  const districts = useMemo(() => {
    return districtPage?.districts || [];
  }, [districtPage]);

  // Get active line data

  const activeLine = useSelector((state) => {
    if (!activeLineId) return null;

    const page = state.editpaper.pages.find((p) => p.catName === activePage);

    return page?.lines.find((l) => l.id === activeLineId);
  });

  const [categories, setCategories] = useState(
    regularPages.map((page) => page.name.tam),
  );

  const [activeCategory, setActiveCategory] = useState(
    regularPages[0]?.name.tam || "",
  );

  // Memoize categories to prevent infinite re-renders
  const memoizedCategories = useMemo(() => {
    return regularPages.map((page) => page.name.tam);
  }, [regularPages]);

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

  // Update categories when pages change
  useEffect(() => {
    setCategories(memoizedCategories);

    // Only update active category if it's not in the new categories or if no active category exists
    if (!activeCategory || !memoizedCategories.includes(activeCategory)) {
      setActiveCategory(memoizedCategories[0] || "");
    }
  }, [memoizedCategories]); // Use memoizedCategories instead of regularPages

  // Sync activeCategory with Redux activePage on mount
  useEffect(() => {
    if (activePage === "main") {
      setActiveCategory("main");
    } else {
      // Find the page in regularPages or districts
      const regularPage = regularPages.find(
        (p) => p.name.eng.toLowerCase() === activePage,
      );
      if (regularPage) {
        setActiveCategory(regularPage.name.tam);
      } else {
        const districtMatch = districts.find(
          (d) => d.eng.toLowerCase() === activePage,
        );
        if (districtMatch) {
          setActiveCategory(districtMatch.tam);
        }
      }
    }
  }, [activePage, regularPages, districts]);

  if (!open) return null;

  // Helper function to get English name from Tamil name
  const getEnglishName = (tamilName) => {
    if (tamilName === "main") return "main";

    // Check regular pages
    const regularPage = regularPages.find((p) => p.name.tam === tamilName);
    if (regularPage) {
      return regularPage.name.eng.toLowerCase();
    }

    // Check districts
    const district = districts.find((d) => d.tam === tamilName);
    if (district) {
      return district.eng.toLowerCase();
    }

    return tamilName;
  };

  // Handle page button click
  const handlePageClick = (tamilName) => {
    setActiveCategory(tamilName);
    const englishName = getEnglishName(tamilName);
    dispatch(setActivePage(englishName));
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
          }),
        );
      }
    }
  };

  // Handle dropping lines

  const handleLineClick = (lineType, orientation) => {
    dispatch(addLine(activePage, lineType, orientation, { x: 100, y: 100 }));
  };

  const handleSaveLayout = async () => {
    try {
      await saveLayout({
        ...buildLayoutPayload(layoutState)
      });
      alert("Layout saved");
    } catch (error) {
      console.error("Failed to save layout:", error);
      alert("Failed to save layout. Check the server and try again.");
    }
  };

  const containerTypes = [
    { id: 1, img: bcont1, label: "Big Container Type 1" },
    

    { id: 2, img: bcont2, label: "Big Container Type 2" },

    { id: 3, img: bcont3, label: "Big Container Type 3" },

    { id: 4, img: bcont4, label: "Big Container Type 4" },

    { id: 5, img: bcont4, label: "Big Container Type 4A" },

    { id: 6, img: ncont4, label: "Big Container Type 5" },

    { id: 7, img: norcont1, label: "Normal Container Type 1" },

    { id: 8, img: ncont4, label: "Normal Container Type 2" },

    { id: 9, img: ncont3, label: "Normal Container Type 3" },

    { id: 10, img: ncont5, label: "Normal Container Type 4" },

    { id: 11, img: ncont4, label: "Normal Container Type 4A" },

    { id: 12, img: ncont1, label: "Normal Container Type 5" },
    { id: 13, img: norcont4b, label: "Normal Container Type 4B" },
      { id: 14, img: bcont1, label: "Universal Container" },
  ];

  const sliderTypes = [
    { id: 1, label: "Slider Type 1 (Carousel)", type: "type1" },

    { id: 2, label: "Slider Type 2 (Horizontal)", type: "type2" },
  ];

  const lineTypes = [
    {
      id: 1,
      type: "pink-bold",
      orientation: "horizontal",
      label: "pink bold line (hr)",
    },

    {
      id: 2,
      type: "pink-bold",
      orientation: "vertical",
      label: "pink bold line (vr)",
    },

    {
      id: 3,
      type: "light-grey",
      orientation: "horizontal",
      label: "light grey line (hr)",
    },

    {
      id: 4,
      type: "light-grey",
      orientation: "vertical",
      label: "light grey line (vr)",
    },
  ];

  const adTypes = [
    { id: 10, label: "Ad banner 1" },

    { id: 11, label: "Ad banner 2" },
  ];

  const otherTypes = [
    { id: 20, label: "Poll" },
    { id: 21, label: "Video Container" },
  ];

  const getActiveItems = () => {
    switch (activeTab) {
      case "containers":
        return containerTypes;

      case "lines":
        return lineTypes;

      case "ad":
        return adTypes;

      default:
        return containerTypes;
    }
  };

  return (
    <div
      className="page-editor-container"
      style={{ transform: `translate(${switchpos[0]}px,${switchpos[1]}px)` }}
    >
      <div className="page-editor-header">
        <div className="page-editor-title">Page Editor</div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="pe-rev-btn"
            onClick={() =>
              setSwitchpos((v) => (v[0] === 1080 ? [10, 10] : [1080, 10]))
            }
          >
            <GrRevert />
          </button>

          <button className="page-editor-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
      </div>

      <div
        className="page-editor-content"
        style={{
          overflowY: "auto",

          flex: 1,
        }}
      >
        <div className="switch-pages-section">
          <button className="save-changes-btn" onClick={handleSaveLayout}>
            Save changes
          </button>

          <div className="section-title">switch pages</div>

          {/* Main Page Button */}
          <div className="main-page-section">
            <div className="subsection-title">Main Page</div>
            <div className="categories-container">
              <button
                onClick={() => handlePageClick("main")}
                className={`category-btn ${activeCategory === "main" ? "active" : ""}`}
              >
                main
              </button>
            </div>
          </div>

          {/* Pages Section */}
          <div className="pages-section">
            <div className="subsection-title">Pages</div>
            <div className="categories-container">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageClick(cat)}
                  className={`category-btn ${activeCategory === cat ? "active" : ""}`}
                >
                  {cat.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Districts Section */}
          <div className="districts-section">
            <div className="subsection-title">Districts</div>
            <div className="categories-container">
              {districts.map((district, idx) => (
                <button
                  key={`district-${idx}`}
                  onClick={() => handlePageClick(district.tam)}
                  className={`category-btn ${activeCategory === district.tam ? "active" : ""}`}
                >
                  {district.tam.toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="toggle-buttons-container">
          <button
            onClick={() => setShowBorders(!showBorders)}
            className={`toggle-btn ${showBorders ? "active" : ""}`}
          >
            {showBorders ? "Hide Borders" : "Show Borders"}
          </button>

          <button
            onClick={() => setShowLines(!showLines)}
            className={`toggle-btn ${showLines ? "active" : ""}`}
          >
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

                transition: "all 0.2s",
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
            {["containers", "sliders", "lines", "presets", "others"].map((tab) => (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-item ${activeTab === tab ? "active" : ""}`}
              >
                {tab}
              </div>
            ))}
          </div>

          <div className="drag-box">
            {/* SLIDERS TAB */}

            {activeTab === "sliders" ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  padding: "20px",
                }}
              >
                {sliderTypes.map((slider) => (
                  <div
                    key={slider.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("sliderType", slider.type);

                      e.dataTransfer.effectAllowed = "copy";
                    }}
                    onDragEnd={(e) => {
                      e.preventDefault();
                    }}
                    className="dds-add-cont-btn"
                    style={{
                      width: "100%",

                      padding: "15px",

                      fontSize: "14px",

                      fontWeight: "500",

                      cursor: "grab",

                      display: "flex",

                      alignItems: "center",

                      justifyContent: "center",

                      gap: "10px",
                    }}
                  >
                    <Plus size={18} />

                    {slider.label}
                  </div>
                ))}
              </div>
            ) : activeTab === "lines" ? (
              /* LINES TAB */

              <div style={{ padding: "20px" }}>
                <div
                  style={{
                    display: "grid",

                    gridTemplateColumns: "repeat(4, 1fr)",

                    gap: "15px",

                    marginBottom: "20px",
                  }}
                >
                  {lineTypes.map((line) => (
                    <div
                      key={line.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("lineType", line.type);

                        e.dataTransfer.setData(
                          "lineOrientation",
                          line.orientation,
                        );

                        e.dataTransfer.effectAllowed = "copy";
                      }}
                      onDragEnd={(e) => {
                        e.preventDefault();
                      }}
                      style={{
                        border: "2px solid #ddd",

                        borderRadius: "8px",

                        padding: "20px 10px",

                        display: "flex",

                        flexDirection: "column",

                        alignItems: "center",

                        justifyContent: "center",

                        gap: "15px",

                        cursor: "grab",

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

                      <div
                        style={{
                          width:
                            line.orientation === "horizontal" ? "80px" : "4px",

                          height:
                            line.orientation === "horizontal"
                              ? line.type === "pink-bold"
                                ? "4px"
                                : "2px"
                              : "80px",

                          backgroundColor:
                            line.type === "pink-bold" ? "#e91e63" : "#d0d0d0",
                        }}
                      />

                      {/* Label */}

                      <div
                        style={{
                          fontSize: "11px",

                          color: "#666",

                          textAlign: "center",

                          fontWeight: "500",
                        }}
                      >
                        {line.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Line Arguments Input */}

                <div
                  style={{
                    marginTop: "20px",

                    padding: "15px",

                    background: "#f9f9f9",

                    borderRadius: "8px",

                    border: "1px solid #ddd",
                  }}
                >
                  <label
                    style={{
                      display: "block",

                      fontSize: "13px",

                      fontWeight: "600",

                      marginBottom: "8px",

                      color: "#333",
                    }}
                  >
                    Choose Line Arguments:
                    <br />
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "normal",
                        color: "#666",
                      }}
                    >
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

                      cursor: activeLineId ? "text" : "not-allowed",
                    }}
                  />

                  {!activeLineId && (
                    <div
                      style={{
                        fontSize: "11px",

                        color: "#999",

                        marginTop: "5px",
                      }}
                    >
                      Click on a line in the canvas to edit its properties
                    </div>
                  )}
                </div>
              </div>
            ) : activeTab === "presets" ? (
              /* PRESETS TAB */
              <PresetsTab />
            ) : activeTab === "others" ? (
              /* OTHERS TAB */
              <div style={{ padding: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                  }}
                >
                  {otherTypes.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => {
                        if (item.label === "Poll") {
                          e.dataTransfer.setData("isPoll", "true");
                        } else if (item.label === "Video Container") {
                          e.dataTransfer.setData("isVideo", "true");
                        }
                        e.dataTransfer.effectAllowed = "copy";
                      }}
                      onDragEnd={(e) => {
                        e.preventDefault();
                      }}
                      style={{
                        width: "100%",
                        padding: "15px",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: "grab",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        border: "2px solid #e91e63",
                        borderRadius: "8px",
                        background: "#fff",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#fce4ec";
                        e.currentTarget.style.borderColor = "#c2185b";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#fff";
                        e.currentTarget.style.borderColor = "#e91e63";
                      }}
                      className="dds-add-cont-btn"
                    >
                      <Plus size={18} />
                      {item.label}
                    </div>
                  ))}
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
                    <img
                      src={item.img}
                      alt={item.label}
                      className={`draggable-item-img ${showBorders ? "with-border" : "no-border"}`}
                    />
                  )}

                  {!item.img && (
                    <div
                      className={`draggable-item-img ${showBorders ? "with-border" : "no-border"}`}
                    ></div>
                  )}

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
