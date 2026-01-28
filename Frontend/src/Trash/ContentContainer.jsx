import React, { useState } from "react";
import { X, Edit2, Grid3x3, Space, Maximize2, Move } from "lucide-react";
import { useDispatch } from "react-redux";
import {
  deleteContentContainer,
  updateContentContainerGrid,
  updateContentContainerSpacing,
  addItemToContentContainer,
  removeItemFromContentContainer
} from "../../Slice/newsformslice.js";
import ParagraphBox from "./ParagraphBox.jsx";
import ImageBox from "./ImageBox.jsx";

export default function ContentContainer({ 
  containerId, 
  newsId,
  grid = { columns: 2, gap: 10 },
  spacing = { padding: 10, margin: 10 },
  items = [],
  boxes = [],
  removeBox,
  updateBoxContent
}) {
  const dispatch = useDispatch();
  const [showSettings, setShowSettings] = useState(false);
  const [columns, setColumns] = useState(grid.columns);
  const [gap, setGap] = useState(grid.gap);
  const [padding, setPadding] = useState(spacing.padding);
  const [margin, setMargin] = useState(spacing.margin);

  const handleDelete = (e) => {
    if (e.detail === 2) {
      e.stopPropagation();
      if (window.confirm("Delete this container?")) {
        dispatch(deleteContentContainer({ newsId, containerId }));
      }
    }
  };

  const handleGridChange = (type, value) => {
    const v = parseInt(value) || (type === 'columns' ? 1 : 0);
    
    if (type === 'columns') setColumns(v);
    else setGap(v);
    
    const newColumns = type === 'columns' ? v : columns;
    const newGap = type === 'gap' ? v : gap;
    
    dispatch(updateContentContainerGrid({
      newsId,
      containerId,
      columns: newColumns,
      gap: newGap
    }));
  };

  const handlePaddingChange = (e) => {
    const newPadding = parseInt(e.target.value) || 0;
    setPadding(newPadding);
    
    dispatch(updateContentContainerSpacing({
      newsId,
      containerId,
      padding: newPadding,
      margin
    }));
  };

  const handleMarginChange = (e) => {
    const newMargin = parseInt(e.target.value) || 0;
    setMargin(newMargin);
    
    dispatch(updateContentContainerSpacing({
      newsId,
      containerId,
      padding,
      margin: newMargin
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    
    if (e.dataTransfer.types.includes("containeroverlay")) {
      return;
    }
    
    e.stopPropagation();

    const boxId = e.dataTransfer.getData("boxId");
    const boxType = e.dataTransfer.getData("boxType");

    console.log("ContentContainer drop:", { boxId, boxType, containerId, newsId });

    if (boxId && boxType) {
      const itemExists = items.some(item => item.id === parseInt(boxId));
      
      if (!itemExists) {
        dispatch(addItemToContentContainer({
          newsId,
          containerId,
          item: {
            id: parseInt(boxId),
            type: boxType
          }
        }));
        console.log("Item added to container");
      } else {
        console.log("Item already exists in container");
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeItemFromContentContainer({
      newsId,
      containerId,
      itemId
    }));
  };

  return (
    <div 
      style={{ 
        border: "2px dashed #667eea", 
        background: "rgba(102, 126, 234, 0.05)", 
        borderRadius: "8px", 
        width: "100%", 
        minHeight: items.length === 0 ? "200px" : "auto", 
        position: "relative",
        margin: `${margin}px 0`,
        gridColumn: "span 1",
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div 
        style={{ 
          width: "100%", 
          height: "100%", 
          position: "relative", 
          pointerEvents: "auto", 
          overflow: "visible", 
          display: "flex", 
          flexDirection: "column" 
        }}
      >
        <div 
          style={{ 
            position: "absolute", 
            top: "8px", 
            right: "8px", 
            display: "flex", 
            gap: "8px", 
            zIndex: 1000, 
            pointerEvents: "auto" 
          }}
        >
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowSettings(!showSettings);
            }} 
            style={{ 
              background: "#667eea", 
              border: "none", 
              borderRadius: "100%", 
              width: "28px",
              height: "28px",
              display: "flex", 
              justifyContent: "center",
              alignItems: "center", 
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
            }}
          >
            <Edit2 size={14} color="white" />
          </button>
          <button 
            onClick={handleDelete} 
            title="Double click to delete" 
            style={{ 
              background: "#ef4444", 
              border: "none", 
              borderRadius: "100%",
              width: "28px",
              height: "28px",
              display: "flex", 
              justifyContent: "center",
              alignItems: "center", 
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
            }}
          >
            <X size={14} color="white" />
          </button>
        </div>

        {showSettings && (
          <div 
            style={{ 
              position: "absolute",
              top: "45px", 
              right: "8px", 
              background: "white", 
              border: "2px solid #667eea", 
              borderRadius: "8px", 
              padding: "15px", 
              zIndex: 20, 
              minWidth: "280px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
            }}
          >
            <div style={{ marginBottom: "12px" }}>
              <label style={{ 
                fontSize: "12px", 
                fontWeight: "500", 
                marginBottom: "4px", 
                display: "flex", 
                alignItems: "center", 
                gap: "6px" 
              }}>
                <Grid3x3 size={16} /> Columns
              </label>
              <input 
                type="number" 
                value={columns} 
                min="1" 
                max="6" 
                onChange={(e) => handleGridChange('columns', e.target.value)} 
                style={{ 
                  width: "100%", 
                  padding: "6px 8px", 
                  border: "1px solid #ccc", 
                  borderRadius: "4px", 
                  fontSize: "13px" 
                }} 
              />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ 
                fontSize: "12px", 
                fontWeight: "500", 
                marginBottom: "4px", 
                display: "flex", 
                alignItems: "center", 
                gap: "6px" 
              }}>
                <Space size={16} /> Gap (px)
              </label>
              <input 
                type="number" 
                value={gap} 
                min="0" 
                max="50" 
                onChange={(e) => handleGridChange('gap', e.target.value)} 
                style={{ 
                  width: "100%", 
                  padding: "6px 8px", 
                  border: "1px solid #ccc", 
                  borderRadius: "4px", 
                  fontSize: "13px" 
                }} 
              />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ 
                fontSize: "12px", 
                fontWeight: "500", 
                marginBottom: "4px", 
                display: "flex", 
                alignItems: "center", 
                gap: "6px" 
              }}>
                <Maximize2 size={16} /> Padding (px)
              </label>
              <input 
                type="number" 
                value={padding} 
                min="0" 
                max="100" 
                onChange={handlePaddingChange} 
                style={{ 
                  width: "100%", 
                  padding: "6px 8px", 
                  border: "1px solid #ccc", 
                  borderRadius: "4px", 
                  fontSize: "13px" 
                }} 
              />
            </div>

            <div style={{ marginBottom: "0" }}>
              <label style={{ 
                fontSize: "12px", 
                fontWeight: "500", 
                marginBottom: "4px", 
                display: "flex", 
                alignItems: "center", 
                gap: "6px" 
              }}>
                <Move size={16} /> Margin (px)
              </label>
              <input 
                type="number" 
                value={margin} 
                min="0" 
                max="100" 
                onChange={handleMarginChange} 
                style={{ 
                  width: "100%", 
                  padding: "6px 8px", 
                  border: "1px solid #ccc", 
                  borderRadius: "4px", 
                  fontSize: "13px" 
                }} 
              />
            </div>
          </div>
        )}

        <div 
          style={{ 
            flex: 1, 
            position: "relative", 
            overflow: "visible", 
            padding: `${padding}px`, 
            minHeight: items.length === 0 ? "150px" : "auto" 
          }}
        >
          {items.length === 0 && (
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              height: "100%", 
              color: "#667eea", 
              fontSize: "14px", 
              textAlign: "center", 
              padding: "20px",
              fontWeight: "500",
              minHeight: "150px"
            }}>
              Drop paragraphs or images here
            </div>
          )}

          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: `repeat(${columns}, 1fr)`, 
              gap: `${gap}px`, 
              width: "100%",
              position: "relative"
            }}
          >
            {items.map((item) => {
              const actualBox = boxes?.find(b => b.id === item.id);
              
              if (!actualBox) {
                return (
                  <div 
                    key={item.id}
                    style={{
                      position: "relative",
                      border: "1px solid #e5e7eb",
                      borderRadius: "4px",
                      padding: "8px",
                      background: "white",
                      minHeight: "60px"
                    }}
                  >
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        background: "#ef4444",
                        border: "none",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        zIndex: 10
                      }}
                    >
                      <X size={12} color="white" />
                    </button>
                    Loading box {item.id}...
                  </div>
                );
              }
              
              return (
                <div key={actualBox.id} style={{ position: "relative" }}>
                  {actualBox.type === "paragraph" ? (
                    <ParagraphBox 
                      id={actualBox.id}
                      onDelete={removeBox}
                      onUpdate={updateBoxContent}
                      initialContent={actualBox.content}
                      box={actualBox}
                      isInContainer={true}
                    />
                  ) : (
                    <ImageBox 
                      id={actualBox.id}
                      onDelete={removeBox}
                      onUpdate={updateBoxContent}
                      initialContent={actualBox.content}
                      box={actualBox}
                      isInContainer={true}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}