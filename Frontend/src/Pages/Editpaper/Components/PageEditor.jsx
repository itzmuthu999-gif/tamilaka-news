import { useState } from "react";
import { Rnd } from "react-rnd";
import { X, Plus } from "lucide-react";

export default function PageEditor({
  open = false,
  onClose = () => {},
  categories: initialCategories = [],

}) {
  const [categories, setCategories] = useState(initialCategories);
  const [activeCategory, setActiveCategory] = useState(initialCategories[0] || "");
  const [showAddInput, setShowAddInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [activeTab, setActiveTab] = useState("containers");
  const [showBorders, setShowBorders] = useState(true);
  const [showLines, setShowLines] = useState(true);

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

  // Sample container data
  const containerTypes = [
    { id: 1, img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop", label: "Big container type 1" },
    { id: 2, img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop", label: "Big container type 2" },
    { id: 3, img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop", label: "normal container type 1" },
  ];

  const sliderTypes = [
    { id: 4, img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop", label: "Slider type 1" },
    { id: 5, img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop", label: "Slider type 2" },
  ];

  const lineTypes = [
    { id: 6, img: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=200&fit=crop", label: "Line style 1" },
    { id: 7, img: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=200&fit=crop", label: "Line style 2" },
  ];

  const headerTypes = [
    { id: 8, img: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=300&h=200&fit=crop", label: "Header type 1" },
    { id: 9, img: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=300&h=200&fit=crop", label: "Header type 2" },
  ];

  const adTypes = [
    { id: 10, img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop", label: "Ad banner 1" },
    { id: 11, img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop", label: "Ad banner 2" },
  ];

  const getActiveItems = () => {
    switch(activeTab) {
      case "containers": return containerTypes;
      case "sliders": return sliderTypes;
      case "lines": return lineTypes;
      case "headers": return headerTypes;
      case "ad": return adTypes;
      default: return containerTypes;
    }
  };

  return (
    <Rnd
      default={{
        x: window.innerWidth / 2 - 225,
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
      }}
    >
      <div style={{
        width: "100%",
        height: "100%",
        background: "#fdfdfd",
        borderRadius: "6px",
        border: "1px solid #999",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "sans-serif",
        overflow: "hidden"
      }}>
        {/* Header with Close Button and Drag Handle */}
        <div className="drag-handle" style={{
          padding: "10px 15px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          cursor: "move",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #999"
        }}>
          <div style={{ color: "white", fontWeight: "bold", fontSize: "16px" }}>
            Page Editor
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              borderRadius: "4px",
              padding: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.3)"}
            onMouseLeave={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
          >
            <X size={18} color="white" />
          </button>
        </div>

        {/* Content Area */}
        <div style={{ padding: "15px", flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
          {/* Switch Pages Section */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "10px" }}>
              switch pages
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    background: activeCategory === cat ? "#e9e9e9" : "#f6f6f6",
                    border: "1px solid #bbb",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: activeCategory === cat ? "bold" : "normal"
                  }}
                >
                  {cat.toLowerCase()}
                </button>
              ))}
            </div>

            {/* Add New Page Button */}
            {!showAddInput && (
              <button
                onClick={() => setShowAddInput(true)}
                style={{
                  padding: "4px 12px",
                  background: "#f6f6f6",
                  border: "1px solid #bbb",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "12px",
                  marginRight: "8px"
                }}
              >
                Add New page
              </button>
            )}

            {/* Add Page Input */}
            {showAddInput && (
              <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter page name..."
                  autoFocus
                  style={{
                    flex: 1,
                    padding: "6px 10px",
                    border: "1px solid #bbb",
                    borderRadius: "4px",
                    fontSize: "12px",
                    outline: "none"
                  }}
                />
                <button
                  onClick={handleAddCategory}
                  style={{
                    padding: "6px 16px",
                    background: "#667eea",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "500"
                  }}
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddInput(false);
                    setNewCategory("");
                  }}
                  style={{
                    padding: "6px 16px",
                    background: "#f0f0f0",
                    border: "1px solid #bbb",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px"
                  }}
                >
                  Cancel
                </button>
              </div>
            )}

            <button
              style={{
                padding: "4px 12px",
                background: "#ededed",
                border: "1px solid #bcbcbc",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
                marginTop: "10px"
              }}
            >
              Save changes
            </button>
          </div>

          {/* Borders and Remove Lines Buttons */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <button
              onClick={() => setShowBorders(!showBorders)}
              style={{
                padding: "4px 10px",
                background: showBorders ? "#667eea" : "#ededed",
                color: showBorders ? "white" : "#333",
                border: "1px solid #bcbcbc",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px"
              }}
            >
              {showBorders ? "Hide Borders" : "Show Borders"}
            </button>
            <button
              onClick={() => setShowLines(!showLines)}
              style={{
                padding: "4px 10px",
                background: showLines ? "#667eea" : "#ededed",
                color: showLines ? "white" : "#333",
                border: "1px solid #bcbcbc",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px"
              }}
            >
              {showLines ? "Remove Lines" : "Show Lines"}
            </button>
          </div>

          {/* Drag and Drop Section */}
          <div style={{ marginTop: "10px", flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "10px" }}>
              Drag and Drop the containers
            </div>

            {/* Tabs */}
            <div style={{
              display: "flex",
              gap: "15px",
              borderBottom: "1px solid #b5b5b5",
              marginBottom: "10px"
            }}>
              {["containers", "sliders", "lines", "headers", "ad"].map((tab) => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "4px 6px",
                    fontSize: "13px",
                    cursor: "pointer",
                    color: activeTab === tab ? "#a30000" : "#444",
                    fontWeight: activeTab === tab ? "bold" : "normal",
                    borderBottom: activeTab === tab ? "2px solid #a30000" : "none",
                    marginBottom: "-1px"
                  }}
                >
                  {tab}
                </div>
              ))}
            </div>

            {/* Drag Box with Items */}
            <div style={{
              width: "100%",
              flex: 1,
              background: "#eee",
              border: "1px solid #bdbdbd",
              borderRadius: "4px",
              padding: "12px",
              overflowY: "auto",
              display: "flex",
              flexWrap: "wrap",
              gap: "15px",
              alignContent: "flex-start"
            }}>
              {getActiveItems().map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", item.label);
                  }}
                  style={{
                    width: "140px",
                    cursor: "grab",
                    transition: "transform 0.2s"
                  }}
                  onMouseDown={(e) => e.currentTarget.style.cursor = "grabbing"}
                  onMouseUp={(e) => e.currentTarget.style.cursor = "grab"}
                >
                  <img
                    src={item.img}
                    alt={item.label}
                    style={{
                      width: "100%",
                      height: "90px",
                      objectFit: "cover",
                      borderRadius: "4px",
                      border: showBorders ? "2px solid #999" : "none",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                    }}
                  />
                  <div style={{
                    fontSize: "12px",
                    marginTop: "5px",
                    textAlign: "center",
                    color: "#333"
                  }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Rnd>
  );
}