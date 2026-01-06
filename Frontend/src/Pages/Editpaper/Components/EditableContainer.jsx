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
  // ✅ NEW: Import nested container actions
  addNestedContainer,
  deleteNestedContainer,
  updateNestedContainerGrid,
  updateNestedContainerHeader,
  updateNestedContainerSpacing,
  addEmptySlotToNested,
  dropNewsIntoNestedSlot,
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

import jwt from "../../../assets/jwt.jpg";
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

// ✅ NEW: Recursive NestedContainer component
function NestedContainer({ 
  id, 
  catName, 
  parentContainerId,
  grid,
  header,
  spacing,
  items,
  nestedContainers = []
}) {
  const dispatch = useDispatch();
  const [showSettings, setShowSettings] = useState(false);
  const [columns, setColumns] = useState(grid?.columns ?? 2);
  const [gap, setGap] = useState(grid?.gap ?? 10);
  const [localHeaderTitle, setLocalHeaderTitle] = useState(header?.title || "");
  const [padding, setPadding] = useState(spacing?.padding || 10);
  const [margin, setMargin] = useState(spacing?.margin || 0);
  const [gridColumnSpan, setGridColumnSpan] = useState(1);
  const [droppedContainers, setDroppedContainers] = useState([]);

  const headerEnabled = header?.enabled || false;

  const handleDelete = (e) => {
    if (e.detail === 2) {
      dispatch(deleteNestedContainer({ 
        catName, 
        parentContainerId, 
        nestedContainerId: id 
      }));
    }
  };

  const handleToggleHeader = (enabled) => {
    dispatch(
      updateNestedContainerHeader({
        catName,
        parentContainerId,
        nestedContainerId: id,
        enabled,
        title: enabled ? localHeaderTitle : ""
      })
    );
  };

  const handleHeaderTitleChange = (e) => {
    const newTitle = e.target.value;
    setLocalHeaderTitle(newTitle);
    dispatch(
      updateNestedContainerHeader({
        catName,
        parentContainerId,
        nestedContainerId: id,
        enabled: headerEnabled,
        title: newTitle
      })
    );
  };

  const handlePaddingChange = (e) => {
    const newPadding = parseInt(e.target.value) || 0;
    setPadding(newPadding);
    dispatch(
      updateNestedContainerSpacing({
        catName,
        parentContainerId,
        nestedContainerId: id,
        padding: newPadding,
        margin
      })
    );
  };

  const handleMarginChange = (e) => {
    const newMargin = parseInt(e.target.value) || 0;
    setMargin(newMargin);
    dispatch(
      updateNestedContainerSpacing({
        catName,
        parentContainerId,
        nestedContainerId: id,
        padding,
        margin: newMargin
      })
    );
  };

  // ✅ Handle drops: both container overlays AND news containers
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const isContainerOverlay = e.dataTransfer.getData("containerOverlay");
    const containerType = e.dataTransfer.getData("text/plain");
    const newsId = e.dataTransfer.getData("newsId");

    // ✅ If it's a container overlay, add nested container
    if (isContainerOverlay === "true") {
      dispatch(addNestedContainer(catName, id));
      return;
    }

    // ✅ Otherwise, handle as news container drop
    if (!containerType) return;

    const slotId = `slot_${Date.now()}`;
    const newContainer = {
      id: slotId,
      type: containerType,
      data: {
        image: jwt,
        headline: `Sample Headline for ${containerType}`,
        content: "This is sample content for the news container.",
        time: "2 hours ago",
      },
    };

    setDroppedContainers((prev) => [...prev, newContainer]);

    dispatch(
      addEmptySlotToNested({
        catName,
        parentContainerId,
        nestedContainerId: id,
        containerType,
        slotId,
      })
    );

    if (newsId) {
      dispatch(
        dropNewsIntoNestedSlot({
          catName,
          parentContainerId,
          nestedContainerId: id,
          slotId,
          newsId: Number(newsId),
        })
      );
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDeleteDroppedContainer = (containerId) => {
    setDroppedContainers((prev) => prev.filter((c) => c.id !== containerId));
  };

  return (
    <div
      style={{
        border: "2px dashed #f57c00",
        background: "rgba(255, 152, 0, 0.05)",
        borderRadius: "8px",
        gridColumn: `span ${gridColumnSpan}`,
        width: "100%",
        minHeight: droppedContainers.length === 0 && nestedContainers.length === 0 ? "200px" : "auto",
        position: "relative",
        margin: `${margin}px`,
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", flexDirection: "column" }}>
        {/* Controls */}
        <div style={{ position: "absolute", top: "8px", right: "8px", display: "flex", gap: "8px", zIndex: 1000 }}>
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{ background: "orange", border: "none", borderRadius: "4px", padding: "6px", cursor: "pointer" }}
          >
            <Edit2 size={18} color="white" />
          </button>
          <button
            onClick={handleDelete}
            title="Double click to delete"
            style={{ background: "red", border: "none", borderRadius: "4px", padding: "6px", cursor: "pointer" }}
          >
            <X size={18} color="white" />
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div style={{ position: "absolute", top: "50px", right: "8px", background: "white", border: "2px solid #f57c00", borderRadius: "8px", padding: "15px", zIndex: 20, minWidth: "220px", maxHeight: "500px", overflowY: "auto" }}>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "12px", fontWeight: "500", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Grid3x3 size={16} /> Grid Column Span
              </label>
              <input type="number" value={gridColumnSpan} min="1" max="12" onChange={(e) => setGridColumnSpan(parseInt(e.target.value) || 1)} style={{ width: "100%", padding: "6px 8px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px" }} />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input type="checkbox" checked={headerEnabled} onChange={(e) => handleToggleHeader(e.target.checked)} style={{ cursor: "pointer" }} />
                <span style={{ fontSize: "14px", fontWeight: "500" }}>Enable Header</span>
              </label>
            </div>

            {headerEnabled && (
              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "12px", fontWeight: "500", marginBottom: "4px", display: "block" }}>Header Title</label>
                <input type="text" value={localHeaderTitle} onChange={handleHeaderTitleChange} placeholder="Enter header title..." style={{ width: "100%", padding: "6px 8px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px" }} />
              </div>
            )}

            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "12px", fontWeight: "500", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Grid3x3 size={16} /> Internal Columns
              </label>
              <input type="number" value={columns} min="1" max="6" onChange={(e) => { const v = parseInt(e.target.value) || 1; setColumns(v); dispatch(updateNestedContainerGrid({ catName, parentContainerId, nestedContainerId: id, columns: v, gap })); }} style={{ width: "100%", padding: "6px 8px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px" }} />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "12px", fontWeight: "500", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Space size={16} /> Gap (px)
              </label>
              <input type="number" value={gap} min="0" max="50" onChange={(e) => { const v = parseInt(e.target.value) || 0; setGap(v); dispatch(updateNestedContainerGrid({ catName, parentContainerId, nestedContainerId: id, columns, gap: v })); }} style={{ width: "100%", padding: "6px 8px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px" }} />
            </div>

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
        )}

        {/* Header */}
        {headerEnabled && (
          <div style={{ padding: `${padding}px`, fontSize: "16px", fontWeight: "bold", flexShrink: 0 }}>
            <Newsheader name={localHeaderTitle || "nested header"} />
          </div>
        )}

        {/* Drop Zone */}
        <div style={{ flex: 1, position: "relative", padding: `${padding}px`, minHeight: droppedContainers.length === 0 && nestedContainers.length === 0 ? "150px" : "auto" }}>
          {droppedContainers.length === 0 && nestedContainers.length === 0 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#ff9800", fontSize: "13px", textAlign: "center", padding: "20px" }}>
              Drop containers or news here (Nested)
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: `${gap}px`, width: "100%" }}>
            {/* Render nested containers FIRST */}
            {nestedContainers && nestedContainers.map((nested) => (
              <NestedContainer
                key={nested.id}
                id={nested.id}
                catName={catName}
                parentContainerId={id}
                grid={nested.grid}
                header={nested.header}
                spacing={nested.spacing}
                items={nested.items}
                nestedContainers={nested.nestedContainers}
              />
            ))}

            {/* Render dropped news containers */}
            {droppedContainers.map((container) => {
              const Component = COMPONENT_MAP[container.type];
              if (!Component) return null;
              return (
                <div key={container.id}>
                  <Component {...container.data} border slotId={container.id} catName={catName} containerId={id} onDelete={() => handleDeleteDroppedContainer(container.id)} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ Main EditableContainer component
export default function EditableContainer({ id, grid, catName }) {
  const dispatch = useDispatch();
  
  const container = useSelector(state => 
    state.editpaper.pages
      .find(p => p.catName === catName)
      ?.containers.find(c => c.id === id)
  );

  const headerEnabled = container?.header?.enabled || false;
  const headerTitle = container?.header?.title || "";
  const spacing = container?.spacing || { padding: 10, margin: 0 };
  const nestedContainers = container?.nestedContainers || [];

  const [showSettings, setShowSettings] = useState(false);
  const [columns, setColumns] = useState(grid?.columns ?? 2);
  const [gap, setGap] = useState(grid?.gap ?? 10);
  const [localHeaderTitle, setLocalHeaderTitle] = useState(headerTitle);
  const [padding, setPadding] = useState(spacing.padding);
  const [margin, setMargin] = useState(spacing.margin);
  const [gridColumnSpan, setGridColumnSpan] = useState(1);
  const [droppedContainers, setDroppedContainers] = useState([]);

  const handleDelete = (e) => {
    if (e.detail === 2) {
      dispatch(deleteContainer({ catName, containerId: id }));
    }
  };

  const handleToggleHeader = (enabled) => {
    dispatch(updateContainerHeader({ catName, containerId: id, enabled, title: enabled ? localHeaderTitle : "" }));
  };

  const handleHeaderTitleChange = (e) => {
    const newTitle = e.target.value;
    setLocalHeaderTitle(newTitle);
    dispatch(updateContainerHeader({ catName, containerId: id, enabled: headerEnabled, title: newTitle }));
  };

  const handlePaddingChange = (e) => {
    const newPadding = parseInt(e.target.value) || 0;
    setPadding(newPadding);
    dispatch(updateContainerSpacing({ catName, containerId: id, padding: newPadding, margin }));
  };

  const handleMarginChange = (e) => {
    const newMargin = parseInt(e.target.value) || 0;
    setMargin(newMargin);
    dispatch(updateContainerSpacing({ catName, containerId: id, padding, margin: newMargin }));
  };

  // ✅ Handle drops: both container overlays AND news containers
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const isContainerOverlay = e.dataTransfer.getData("containerOverlay");
    const type = e.dataTransfer.getData("text/plain");
    const newsId = e.dataTransfer.getData("newsId");

    // ✅ If it's a container overlay, add as nested container
    if (isContainerOverlay === "true") {
      dispatch(addNestedContainer(catName, id));
      return;
    }

    // ✅ Otherwise, handle as news container drop
    if (!type) return;

    const slotId = `slot_${Date.now()}`;
    const newContainer = {
      id: slotId,
      type,
      data: {
        image: jwt,
        headline: `Sample Headline for ${type}`,
        content: "This is sample content for the news container.",
        time: "2 hours ago",
      },
    };

    setDroppedContainers((prev) => [...prev, newContainer]);
    dispatch(addEmptySlot({ catName, containerId: id, containerType: type, slotId }));

    if (newsId) {
      dispatch(dropNewsIntoSlot({ catName, containerId: id, slotId, newsId: Number(newsId) }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDeleteDroppedContainer = (containerId) => {
    setDroppedContainers((prev) => prev.filter((c) => c.id !== containerId));
  };

  return (
    <div style={{ border: "2px dashed #666", background: "transparent", borderRadius: "8px", gridColumn: `span ${gridColumnSpan}`, width: "100%", minHeight: droppedContainers.length === 0 && nestedContainers.length === 0 ? "250px" : "auto", position: "relative" }}>
      <div style={{ width: "100%", height: "100%", position: "relative", pointerEvents: "auto", overflow: "visible", display: "flex", flexDirection: "column" }}>
        {/* Controls */}
        <div style={{ position: "absolute", top: "8px", right: "8px", display: "flex", gap: "8px", zIndex: 1000, pointerEvents: "auto" }}>
          <button onClick={() => setShowSettings(!showSettings)} style={{ background: "green", border: "none", borderRadius: "4px", padding: "6px", cursor: "pointer" }}>
            <Edit2 size={18} color="white" />
          </button>
          <button onClick={handleDelete} title="Double click to delete" style={{ background: "red", border: "none", borderRadius: "4px", padding: "6px", cursor: "pointer" }}>
            <X size={18} color="white" />
          </button>
        </div>

        {/* Settings Panel - Same as before */}
        {showSettings && (
          <div style={{ position: "absolute", top: "50px", right: "8px", background: "white", border: "2px solid #666", borderRadius: "8px", padding: "15px", zIndex: 20, minWidth: "220px", maxHeight: "500px", overflowY: "auto" }}>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "12px", fontWeight: "500", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Grid3x3 size={16} /> Grid Column Span
              </label>
              <input type="number" value={gridColumnSpan} min="1" max="12" onChange={(e) => setGridColumnSpan(parseInt(e.target.value) || 1)} style={{ width: "100%", padding: "6px 8px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px" }} />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input type="checkbox" checked={headerEnabled} onChange={(e) => handleToggleHeader(e.target.checked)} style={{ cursor: "pointer" }} />
                <span style={{ fontSize: "14px", fontWeight: "500" }}>Enable Header</span>
              </label>
            </div>

            {headerEnabled && (
              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "12px", fontWeight: "500", marginBottom: "4px", display: "block" }}>Header Title</label>
                <input type="text" value={localHeaderTitle} onChange={handleHeaderTitleChange} placeholder="Enter header title..." style={{ width: "100%", padding: "6px 8px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px" }} />
              </div>
            )}

            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "12px", fontWeight: "500", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Grid3x3 size={16} /> Internal Columns
              </label>
              <input type="number" value={columns} min="1" max="6" onChange={(e) => { const v = parseInt(e.target.value) || 1; setColumns(v); dispatch(updateContainerGrid({ catName, containerId: id, columns: v, gap })); }} style={{ width: "100%", padding: "6px 8px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px" }} />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "12px", fontWeight: "500", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Space size={16} /> Gap (px)
              </label>
              <input type="number" value={gap} min="0" max="50" onChange={(e) => { const v = parseInt(e.target.value) || 0; setGap(v); dispatch(updateContainerGrid({ catName, containerId: id, columns, gap: v })); }} style={{ width: "100%", padding: "6px 8px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px" }} />
            </div>

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
        )}

        {/* Header */}
        {headerEnabled && (
          <div style={{ padding: `${padding}px`, fontSize: "18px", fontWeight: "bold", flexShrink: 0, pointerEvents: "none" }}>
            <Newsheader name={headerTitle || "header"} />
          </div>
        )}

        {/* Drop Zone */}
        <div style={{ flex: 1, position: "relative", overflow: "visible", padding: `${padding}px`, minHeight: droppedContainers.length === 0 && nestedContainers.length === 0 ? "150px" : "auto" }} onDrop={handleDrop} onDragOver={handleDragOver}>
          {droppedContainers.length === 0 && nestedContainers.length === 0 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#999", fontSize: "14px", textAlign: "center", padding: "20px" }}>
              Drop containers here
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: `${gap}px`, pointerEvents: "none", width: "100%" }}>
            {/* ✅ Render nested containers FIRST */}
            {nestedContainers.map((nested) => (
              <NestedContainer
                key={nested.id}
                id={nested.id}
                catName={catName}
                parentContainerId={id}
                grid={nested.grid}
                header={nested.header}
                spacing={nested.spacing}
                items={nested.items}
                nestedContainers={nested.nestedContainers}
              />
            ))}

            {/* Render dropped news containers */}
            {droppedContainers.map((container) => {
              const Component = COMPONENT_MAP[container.type];
              if (!Component) return null;
              return (
                <div key={container.id} style={{ pointerEvents: "auto" }}>
                  <Component {...container.data} border slotId={container.id} catName={catName} containerId={id} onDelete={() => handleDeleteDroppedContainer(container.id)} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}