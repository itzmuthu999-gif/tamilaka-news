import React, { useState } from "react";
import { X, Edit2, Grid3x3, Space, Maximize2, Move } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  updateContainerGrid,
  updateContainerHeader,
  updateContainerSpacing,
  addEmptySlot,
  dropNewsIntoSlot,
  deleteContainer,
  addNestedContainer,
  deleteNestedContainer,
  updateNestedContainerGrid,
  updateNestedContainerHeader,
  updateNestedContainerSpacing,
  addEmptySlotToNested,
  dropNewsIntoNestedSlot,
  removeNewsFromNestedSlot,
  removeNewsFromSlot
} from "../../Slice/editpaperslice";

import BigNewsContainer1 from "../Containers_/BigContainer1";
import BigNewsContainer2 from "../Containers_/BigContainer2";
import BigNewsContainer3 from "../Containers_/BigContainer3";
import BigNewsContainer4 from "../Containers_/BigContainer4";
import BigNewsContainer4A from "../Containers_/BigContainer4A";
import BigNewsContainer5 from "../Containers_/BigContainer5";

import NorContainer1 from "../Containers_/NorContainer1";
import NorContainer2 from "../Containers_/NorContainer2";
import NorContainer3 from "../Containers_/NorContainer3";
import NorContainer4 from "../Containers_/NorContainer4";
import NorContainer4A from "../Containers_/NorContainer4A";
import NorContainer5 from "../Containers_/NorContainer5";

import Newsheader from "../../Newspaper/Components/Newsheader";

const COMPONENT_MAP = {
  "Big Container Type 1": BigNewsContainer1,
  "Big Container Type 2": BigNewsContainer2,
  "Big Container Type 3": BigNewsContainer3,
  "Big Container Type 4": BigNewsContainer4,
  "Big Container Type 4A": BigNewsContainer4A,
  "Big Container Type 5": BigNewsContainer5,
  "Normal Container Type 1": NorContainer1,
  "Normal Container Type 2": NorContainer2,
  "Normal Container Type 3": NorContainer3,
  "Normal Container Type 4": NorContainer4,
  "Normal Container Type 4A": NorContainer4A,
  "Normal Container Type 5": NorContainer5,
};

export default function EditableContainer({ 
  id, 
  catName,
  isNested = false,
  parentContainerId = null,
}) {
  const dispatch = useDispatch();
  
  const containerData = useSelector(state => {
    const page = state.editpaper.pages.find(p => p.catName === catName);
    
    if (isNested && parentContainerId) {
      const findNested = (containers) => {
        for (const cont of containers) {
          if (cont.id === parentContainerId) {
            return cont.nestedContainers?.find(nc => nc.id === id);
          }
          if (cont.nestedContainers?.length > 0) {
            const found = findNested(cont.nestedContainers);
            if (found) return found;
          }
        }
        return null;
      };
      return findNested(page?.containers || []);
    } else {
      return page?.containers.find(c => c.id === id);
    }
  });

  const grid = containerData?.grid || { columns: 2, gap: 10 };
  const headerEnabled = containerData?.header?.enabled || false;
  const headerTitle = containerData?.header?.title || "";
  const spacing = containerData?.spacing || { padding: 10, margin: 0 };
  const nestedContainers = containerData?.nestedContainers || [];
  const items = containerData?.items || [];

  const [showSettings, setShowSettings] = useState(false);
  const [columns, setColumns] = useState(grid.columns);
  const [gap, setGap] = useState(grid.gap);
  const [localHeaderTitle, setLocalHeaderTitle] = useState(headerTitle);
  const [padding, setPadding] = useState(spacing.padding);
  const [margin, setMargin] = useState(spacing.margin);
  const [gridColumnSpan, setGridColumnSpan] = useState(1);

  const handleDelete = (e) => {
    if (e.detail === 2) {
      e.stopPropagation();
      if (isNested && parentContainerId) {
        dispatch(deleteNestedContainer({ 
          catName, 
          parentContainerId, 
          nestedContainerId: id 
        }));
      } else {
        dispatch(deleteContainer({ catName, containerId: id }));
      }
    }
  };

  const handleToggleHeader = (enabled) => {
    if (isNested && parentContainerId) {
      dispatch(updateNestedContainerHeader({
        catName,
        parentContainerId,
        nestedContainerId: id,
        enabled,
        title: enabled ? localHeaderTitle : ""
      }));
    } else {
      dispatch(updateContainerHeader({ 
        catName, 
        containerId: id, 
        enabled, 
        title: enabled ? localHeaderTitle : "" 
      }));
    }
  };

  const handleHeaderTitleChange = (e) => {
    const newTitle = e.target.value;
    setLocalHeaderTitle(newTitle);
    
    if (isNested && parentContainerId) {
      dispatch(updateNestedContainerHeader({
        catName,
        parentContainerId,
        nestedContainerId: id,
        enabled: headerEnabled,
        title: newTitle
      }));
    } else {
      dispatch(updateContainerHeader({ 
        catName, 
        containerId: id, 
        enabled: headerEnabled, 
        title: newTitle 
      }));
    }
  };

  const handlePaddingChange = (e) => {
    const newPadding = parseInt(e.target.value) || 0;
    setPadding(newPadding);
    
    if (isNested && parentContainerId) {
      dispatch(updateNestedContainerSpacing({
        catName,
        parentContainerId,
        nestedContainerId: id,
        padding: newPadding,
        margin
      }));
    } else {
      dispatch(updateContainerSpacing({ 
        catName, 
        containerId: id, 
        padding: newPadding, 
        margin 
      }));
    }
  };

  const handleMarginChange = (e) => {
    const newMargin = parseInt(e.target.value) || 0;
    setMargin(newMargin);
    
    if (isNested && parentContainerId) {
      dispatch(updateNestedContainerSpacing({
        catName,
        parentContainerId,
        nestedContainerId: id,
        padding,
        margin: newMargin
      }));
    } else {
      dispatch(updateContainerSpacing({ 
        catName, 
        containerId: id, 
        padding, 
        margin: newMargin 
      }));
    }
  };

  const handleGridChange = (type, value) => {
    const v = parseInt(value) || (type === 'columns' ? 1 : 0);
    
    if (type === 'columns') setColumns(v);
    else setGap(v);
    
    const newColumns = type === 'columns' ? v : columns;
    const newGap = type === 'gap' ? v : gap;
    
    if (isNested && parentContainerId) {
      dispatch(updateNestedContainerGrid({
        catName,
        parentContainerId,
        nestedContainerId: id,
        columns: newColumns,
        gap: newGap
      }));
    } else {
      dispatch(updateContainerGrid({ 
        catName, 
        containerId: id, 
        columns: newColumns, 
        gap: newGap 
      }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const isContainerOverlay = e.dataTransfer.getData("containerOverlay");
    const type = e.dataTransfer.getData("text/plain");
    const newsId = e.dataTransfer.getData("newsId");

    if (isContainerOverlay === "true") {
      dispatch(addNestedContainer(catName, id));
      return;
    }

    if (type && !newsId) {
      const slotId = `slot_${Date.now()}`;
      
      if (isNested && parentContainerId) {
        dispatch(addEmptySlotToNested({
          catName,
          parentContainerId,
          nestedContainerId: id,
          containerType: type,
          slotId,
        }));
      } else {
        dispatch(addEmptySlot({ 
          catName, 
          containerId: id, 
          containerType: type, 
          slotId 
        }));
      }
      return;
    }

    if (newsId) {
      const targetSlot = items.find(item => !item.newsId);
      
      if (targetSlot) {
        if (isNested && parentContainerId) {
          dispatch(dropNewsIntoNestedSlot({
            catName,
            parentContainerId,
            nestedContainerId: id,
            slotId: targetSlot.slotId,
            newsId: Number(newsId),
          }));
        } else {
          dispatch(dropNewsIntoSlot({ 
            catName, 
            containerId: id, 
            slotId: targetSlot.slotId, 
            newsId: Number(newsId) 
          }));
        }
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const borderColor = isNested ? "#f57c00" : "#666";
  const bgColor = isNested ? "rgba(255, 152, 0, 0.05)" : "transparent";

  return (
    <div 
      style={{ 
        border: `2px dashed ${borderColor}`, 
        background: bgColor, 
        borderRadius: "8px", 
        gridColumn: `span ${gridColumnSpan}`, 
        width: "100%", 
        minHeight: nestedContainers.length === 0 && items.length === 0 ? "250px" : "auto", 
        position: "relative",
        margin: `${margin}px`,
      }}
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
            bottom: "-10px", 
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
              background: isNested ? "orange" : "green", 
              border: "none", 
              borderRadius: "100%", 
              width: "20px",
              height: "20px",
              display: "flex", 
              justifyContent: "center",
              alignItems: "center", 
              cursor: "pointer" 
            }}
          >
            <Edit2 size={10} color="white" />
          </button>
          <button 
            onClick={handleDelete} 
            title="Double click to delete" 
            style={{ 
              background: "red", 
              border: "none", 
              borderRadius: "100%",
              width: "20px",
              height: "20px",
              display: "flex", 
              justifyContent: "center",
              alignItems: "center", 
              cursor: "pointer" 
            }}
          >
            <X size={10} color="white" />
          </button>
        </div>

        {showSettings && (
          <div 
            style={{ 
              position: "absolute",
              display:"flex", 
              justifyContent: "center",
              alignItems: "center", 
              bottom: "-120px", 
              right: "-550px", 
              background: "white", 
              border: `2px solid ${borderColor}`, 
              borderRadius: "8px", 
              padding: "15px", 
              zIndex: 20, 
              minWidth: "660px", 
              maxHeight: "500px", 
              overflowY: "auto" 
            }}
          >
            <div style={{ marginBottom: "12px" , display:"none"}}>
              <label style={{ fontSize: "12px", fontWeight: "500", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Grid3x3 size={16} /> Grid Column Span
              </label>
              <input type="number" value={gridColumnSpan} min="1" max="12" onChange={(e) => setGridColumnSpan(parseInt(e.target.value) || 1)} style={{ width: "100%", padding: "6px 8px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px" }} />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input type="checkbox" checked={headerEnabled} onChange={(e) => handleToggleHeader(e.target.checked)} style={{ cursor: "pointer" }} />
                <span style={{ fontSize: "10px", fontWeight: "500" }}>Enable Header</span>
              </label>
            </div>

            {headerEnabled && (
              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "12px", fontWeight: "500", marginBottom: "4px", display: "block" }}>Header Title</label>
                <input type="text" value={localHeaderTitle} onChange={handleHeaderTitleChange} placeholder="Enter header title..." style={{ width: "100%", padding: "6px 8px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px" }} />
              </div>
            )}

            <div style={{display:"flex",alignItems: "center",justifyContent: "space-between"}}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "12px", fontWeight: "500", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Grid3x3 size={16} /> Internal Columns
                </label>
                <input type="number" value={columns} min="1" max="6" onChange={(e) => handleGridChange('columns', e.target.value)} style={{ width: "100%", padding: "6px 8px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px" }} />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "12px", fontWeight: "500", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Space size={16} /> Gap (px)
                </label>
                <input type="number" value={gap} min="0" max="50" onChange={(e) => handleGridChange('gap', e.target.value)} style={{ width: "100%", padding: "6px 8px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px" }} />
              </div>
            </div>

            <div style={{display:"flex",alignItems: "center",justifyContent: "space-between"}}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "12px", fontWeight: "500", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Maximize2 size={16} /> Padding (px)
                </label>
                <input type="number" value={padding} min="0" max="100" onChange={handlePaddingChange} style={{ width: "100%", padding: "6px 8px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px" }} />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "12px", fontWeight: "500", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Move size={16} /> Margin (px)
                </label>
                <input type="number" value={margin} min="0" max="100" onChange={handleMarginChange} style={{ width: "100%", padding: "6px 8px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px" }} />
              </div>
            </div>
          </div>
        )}

        {headerEnabled && (
          <div style={{ padding: `${padding}px`, fontSize: "18px", fontWeight: "bold", flexShrink: 0, pointerEvents: "none" }}>
            <Newsheader name={headerTitle || (isNested ? "nested header" : "header")} />
          </div>
        )}

        <div 
          style={{ 
            flex: 1, 
            position: "relative", 
            overflow: "visible", 
            padding: `${padding}px`, 
            minHeight: nestedContainers.length === 0 && items.length === 0 ? "150px" : "auto" 
          }} 
          onDrop={handleDrop} 
          onDragOver={handleDragOver}
        >
          {nestedContainers.length === 0 && items.length === 0 && (
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              height: "100%", 
              color: isNested ? "#ff9800" : "#999", 
              fontSize: "14px", 
              textAlign: "center", 
              padding: "20px" 
            }}>
              {isNested ? "Drop containers or news here (Nested)" : "Drop containers here"}
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
            {items.map((item, index) => {
              const Component = COMPONENT_MAP[item.containerType];
              if (!Component) return null;
              
              return (
                <div 
                  key={item.slotId} 
                  style={{ 
                    pointerEvents: "auto",
                    position: "relative",
                    zIndex: 10 + index
                  }}
                >
                  <Component 
                    border 
                    slotId={item.slotId} 
                    catName={catName} 
                    containerId={id}
                    isNested={isNested}
                    parentContainerId={parentContainerId}
                    onDelete={() => {
                      // Remove the news from the slot
                      if (isNested && parentContainerId) {
                        dispatch(removeNewsFromNestedSlot({
                          catName,
                          parentContainerId,
                          nestedContainerId: id,
                          slotId: item.slotId
                        }));
                      } else {
                        dispatch(removeNewsFromSlot({ 
                          catName, 
                          containerId: id, 
                          slotId: item.slotId 
                        }));
                      }
                    }}
                  />
                </div>
              );
            })}

            {nestedContainers.map((nested, index) => (
              <div 
                key={nested.id} 
                style={{ 
                  pointerEvents: "auto",
                  position: "relative",
                  zIndex: 10 + items.length + index
                }}
              >
                <EditableContainer
                  id={nested.id}
                  catName={catName}
                  isNested={true}
                  parentContainerId={id}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}