import React, { useState, useEffect } from "react";
import { X, Edit2, Grid3x3, Space, Maximize2, Move } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  updateContainerGrid,
  updateContainerSpacing,
  updateContainerHeader,
  addEmptySlot,
  dropNewsIntoSlot,
  deleteContainer,
  addNestedContainer,
  deleteNestedContainer,
  updateNestedContainerGrid,
  updateNestedContainerSpacing,
  updateNestedContainerHeader,
  addEmptySlotToNested,
  dropNewsIntoNestedSlot,
  removeNewsFromNestedSlot,
  removeNewsFromSlot,
  removeSlotFromContainer,
  removeSlotFromNestedContainer,
  addSliderToContainer,
  updateSliderWidth,
  updateContainerSliderGap,
  deleteContainerSlider,
  addSlotToContainerSlider,
  removeSlotFromContainerSlider,
  addLine,
  addPollSlot,
  addVideoSlot,
  addVideoSlotToSlider
} from "../../Slice/editpaperSlice/editpaperSlice";

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
import NorContainer4B from "../Containers_/NorContainer4B";
import NorContainer5 from "../Containers_/NorContainer5";
import UniversalNewsContainer from "../Containers_/UniversalNewsContainer";

import { EditableSlider } from "./EditableSlider";
import { EditableSlider2 } from "./EditableSlider2";
import EditableLine from "../Containers_/EditableLine";
import PollContainer from "../Containers_/PollContainer";
import VideoContainer from "../Containers_/VideoContainer";

const COMPONENT_MAP = {
  "Universal Container": UniversalNewsContainer,
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
  "Normal Container Type 4B": NorContainer4B,
  "Normal Container Type 5": NorContainer5,
  "Poll": PollContainer,
  "Video Container": VideoContainer,
};

const getUniversalContainerDefaults = (containerType) => {
  const defaultsMap = {
    "Big Container Type 1": { width: 800, height: 500, layout: 3 },
    "Big Container Type 2": { width: 500, height: 350, layout: 4 },
    "Big Container Type 3": { width: 400, height: 350, layout: 1 },
    "Big Container Type 4": { width: 280, height: 280, layout: 6 },
    "Big Container Type 4A": { width: 280, height: 280, layout: 6 },
    "Big Container Type 5": { width: 500, height: 300, layout: 4 },
    "Normal Container Type 1": { width: 300, height: 200, layout: 10 },
    "Normal Container Type 2": { width: 200, height: 100, layout: 8 },
    "Normal Container Type 3": { width: 300, height: 150, layout: 6 },
    "Normal Container Type 4": { width: 300, height: 200, layout: 11 },
    "Normal Container Type 4A": { width: 100, height: 100, layout: 6 },
    "Normal Container Type 4B": { width: 300, height: 80, layout: 10 },
    "Normal Container Type 5": { width: 400, height: 300, layout: 1 },
    "Universal Container": { width: 400, height: 300, layout: 1 },
  };
  return defaultsMap[containerType] || { width: 400, height: 300, layout: 1 };
};

export default function EditableContainer({ 
  id, 
  catName,
  isNested = false,
  parentContainerId = null,
}) {
  const dispatch = useDispatch();

  // ── Select container data directly from Redux ─────────────────────────────
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

  // ── Values derived from Redux state ───────────────────────────────────────
  const grid             = containerData?.grid    || { columns: 2, gap: 10 };
  const spacing          = containerData?.spacing || { padding: 10, margin: 0 };
  // Read header directly from Redux state every render — source of truth
  const reduxHeaderEnabled = containerData?.header?.enabled ?? false;
  const reduxHeaderTitle   = containerData?.header?.title   ?? "";
  const nestedContainers = containerData?.nestedContainers || [];
  const items            = containerData?.items   || [];
  const sliders          = containerData?.sliders || [];
  const lines            = containerData?.lines   || [];

  // ── Local state for settings panel controls ───────────────────────────────
  const [showSettings, setShowSettings]     = useState(false);
  const [columns, setColumns]               = useState(grid.columns);
  const [gap, setGap]                       = useState(grid.gap);
  const [padding, setPadding]               = useState(spacing.padding);
  const [margin, setMargin]                 = useState(spacing.margin);
  const [gridColumnSpan, setGridColumnSpan] = useState(1);

  // ── Header local state — mirrors Redux, re-syncs when Redux changes ───────
  //    This is the KEY FIX: useEffect keeps local state in sync so that
  //    changes persisted in Redux are reflected after re-mounts / refreshes.
  const [headerEnabled, setHeaderEnabled] = useState(reduxHeaderEnabled);
  const [headerTitle, setHeaderTitle]     = useState(reduxHeaderTitle);

  useEffect(() => {
    setHeaderEnabled(reduxHeaderEnabled);
    setHeaderTitle(reduxHeaderTitle);
  }, [reduxHeaderEnabled, reduxHeaderTitle]);

  // ── Dispatch helper for header — always sends both fields to Redux ─────────
  const dispatchHeader = (enabled, title) => {
    if (isNested && parentContainerId) {
      dispatch(updateNestedContainerHeader({
        catName,
        parentContainerId,
        nestedContainerId: id,
        enabled,
        title,
      }));
    } else {
      dispatch(updateContainerHeader({
        catName,
        containerId: id,
        enabled,
        title,
      }));
    }
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleHeaderEnabledChange = (e) => {
    const val = e.target.checked;
    setHeaderEnabled(val);
    dispatchHeader(val, headerTitle);
  };

  const handleHeaderTitleChange = (e) => {
    const val = e.target.value;
    setHeaderTitle(val);
    dispatchHeader(headerEnabled, val);
  };

  const handleDelete = (e) => {
    if (e.detail === 2) {
      e.stopPropagation();
      if (isNested && parentContainerId) {
        dispatch(deleteNestedContainer({ catName, parentContainerId, nestedContainerId: id }));
      } else {
        dispatch(deleteContainer({ catName, containerId: id }));
      }
    }
  };

  const handlePaddingChange = (e) => {
    const val = parseInt(e.target.value) || 0;
    setPadding(val);
    if (isNested && parentContainerId) {
      dispatch(updateNestedContainerSpacing({ catName, parentContainerId, nestedContainerId: id, padding: val, margin }));
    } else {
      dispatch(updateContainerSpacing({ catName, containerId: id, padding: val, margin }));
    }
  };

  const handleMarginChange = (e) => {
    const val = parseInt(e.target.value) || 0;
    setMargin(val);
    if (isNested && parentContainerId) {
      dispatch(updateNestedContainerSpacing({ catName, parentContainerId, nestedContainerId: id, padding, margin: val }));
    } else {
      dispatch(updateContainerSpacing({ catName, containerId: id, padding, margin: val }));
    }
  };

  const handleGridChange = (type, value) => {
    const v = parseInt(value) || (type === 'columns' ? 1 : 0);
    if (type === 'columns') setColumns(v);
    else setGap(v);
    const newColumns = type === 'columns' ? v : columns;
    const newGap     = type === 'gap'     ? v : gap;
    if (isNested && parentContainerId) {
      dispatch(updateNestedContainerGrid({ catName, parentContainerId, nestedContainerId: id, columns: newColumns, gap: newGap }));
    } else {
      dispatch(updateContainerGrid({ catName, containerId: id, columns: newColumns, gap: newGap }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const isContainerOverlay = e.dataTransfer.getData("containerOverlay");
    const type               = e.dataTransfer.getData("text/plain");
    const newsId             = e.dataTransfer.getData("newsId");
    const sliderType         = e.dataTransfer.getData("sliderType");
    const lineType           = e.dataTransfer.getData("lineType");
    const lineOrientation    = e.dataTransfer.getData("lineOrientation");
    const presetId           = e.dataTransfer.getData("presetId");
    const isPoll             = e.dataTransfer.getData("isPoll");
    const isVideo            = e.dataTransfer.getData("isVideo");

    if (lineType && lineOrientation) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      dispatch(addLine(catName, lineType, lineOrientation, { x, y }, id, parentContainerId));
      return;
    }
    if (sliderType) {
      dispatch(addSliderToContainer(catName, id, sliderType, isNested, parentContainerId));
      return;
    }
    if (isContainerOverlay === "true") {
      dispatch(addNestedContainer(catName, id));
      return;
    }
    if (isPoll === "true") {
      dispatch(addPollSlot(catName, id, isNested, parentContainerId));
      return;
    }
    if (isVideo === "true") {
      const slotId = `slot_${Date.now()}`;
      dispatch(addVideoSlot({ catName, containerId: id, slotId, isNested, parentContainerId }));
      return;
    }
    if (type && !newsId) {
      const slotId = `slot_${Date.now()}`;
      if (isNested && parentContainerId) {
        dispatch(addEmptySlotToNested({ catName, parentContainerId, nestedContainerId: id, containerType: type, slotId, presetId: presetId || undefined }));
      } else {
        dispatch(addEmptySlot({ catName, containerId: id, containerType: type, slotId, presetId: presetId || undefined }));
      }
      return;
    }
    if (newsId) {
      const targetSlot = items.find(item => !item.newsId);
      if (targetSlot) {
        if (isNested && parentContainerId) {
          dispatch(dropNewsIntoNestedSlot({ catName, parentContainerId, nestedContainerId: id, slotId: targetSlot.slotId, newsId: Number(newsId) }));
        } else {
          dispatch(dropNewsIntoSlot({ catName, containerId: id, slotId: targetSlot.slotId, newsId: Number(newsId) }));
        }
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // ── Colours ───────────────────────────────────────────────────────────────
  const borderColor = isNested ? "#f57c00" : "#666";
  const bgColor     = isNested ? "rgba(255, 152, 0, 0.05)" : "transparent";
  const headerAccent = isNested ? "#f57c00" : "#e91e8c";   // magenta for root, orange for nested

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div 
      style={{ 
        border: `2px dashed ${borderColor}`, 
        background: bgColor, 
        borderRadius: "8px", 
        gridColumn: `span ${gridColumnSpan}`, 
        width: "100%", 
        minHeight: nestedContainers.length === 0 && items.length === 0 ? "250px" : "fit-content", 
        position: "relative",
        margin: `${margin}px`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ──────────────────────────────────────────────────────────────────────
          Edit / Delete buttons  (position: absolute, outside the flex flow)
      ────────────────────────────────────────────────────────────────────── */}
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
          onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }} 
          style={{ 
            background: isNested ? "orange" : "green", 
            border: "none", 
            borderRadius: "100%", 
            width: "20px",
            height: "20px",
            display: "flex", 
            justifyContent: "center",
            alignItems: "center", 
            cursor: "pointer",
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
            cursor: "pointer",
          }}
        >
          <X size={10} color="white" />
        </button>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────
          Settings panel (absolute, floats to the side)
      ────────────────────────────────────────────────────────────────────── */}
      {showSettings && (
        <div 
          style={{ 
            position: "absolute",
            bottom: "-120px", 
            right: "-310px", 
            background: "white", 
            border: `2px solid ${borderColor}`, 
            borderRadius: "8px", 
            padding: "15px", 
            zIndex: 2000, 
            minWidth: "290px", 
            maxHeight: "520px", 
            overflowY: "auto",
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
          }}
        >
          {/* Hidden: grid column span */}
          <div style={{ marginBottom: "12px", display: "none" }}>
            <label style={{ fontSize: "12px", fontWeight: "500", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Grid3x3 size={16} /> Grid Column Span
            </label>
            <input type="number" value={gridColumnSpan} min="1" max="12"
              onChange={(e) => setGridColumnSpan(parseInt(e.target.value) || 1)}
              style={{ width: "100%", padding: "6px 8px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px" }} />
          </div>

          {/* Columns + Gap */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "12px", fontWeight: "500", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Grid3x3 size={14} /> Columns
              </label>
              <input type="number" value={columns} min="1" max="6"
                onChange={(e) => handleGridChange('columns', e.target.value)}
                style={{ width: "100%", padding: "6px 8px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "12px", fontWeight: "500", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Space size={14} /> Gap (px)
              </label>
              <input type="number" value={gap} min="0" max="50"
                onChange={(e) => handleGridChange('gap', e.target.value)}
                style={{ width: "100%", padding: "6px 8px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px" }} />
            </div>
          </div>

          {/* Padding + Margin */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "12px", fontWeight: "500", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Maximize2 size={14} /> Padding (px)
              </label>
              <input type="number" value={padding} min="0" max="100"
                onChange={handlePaddingChange}
                style={{ width: "100%", padding: "6px 8px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "12px", fontWeight: "500", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Move size={14} /> Margin (px)
              </label>
              <input type="number" value={margin} min="0" max="100"
                onChange={handleMarginChange}
                style={{ width: "100%", padding: "6px 8px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px" }} />
            </div>
          </div>

          {/* ── Header section ─────────────────────────────────────────────── */}
          <div style={{ borderTop: "1px solid #eee", paddingTop: "12px" }}>
            <p style={{ fontSize: "12px", fontWeight: "600", margin: "0 0 8px 0", color: headerAccent, display: "flex", alignItems: "center", gap: "6px" }}>
              <Edit2 size={13} /> Header
            </p>

            {/* Enable / disable toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <input
                type="checkbox"
                id={`hdr-enabled-${id}`}
                checked={headerEnabled}
                onChange={handleHeaderEnabledChange}
                style={{ width: "15px", height: "15px", cursor: "pointer", accentColor: headerAccent }}
              />
              <label htmlFor={`hdr-enabled-${id}`} style={{ fontSize: "12px", cursor: "pointer", userSelect: "none" }}>
                Enable Header
              </label>
            </div>

            {/* Header name input — only visible when enabled */}
            {headerEnabled && (
              <div>
                <label style={{ fontSize: "11px", color: "#666", display: "block", marginBottom: "4px" }}>
                  Header Name
                </label>
                <input
                  type="text"
                  value={headerTitle}
                  onChange={handleHeaderTitleChange}
                  placeholder="Enter header name..."
                  autoFocus
                  style={{ 
                    width: "100%", 
                    padding: "6px 8px", 
                    border: `1px solid ${headerAccent}`, 
                    borderRadius: "4px", 
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────
          HEADER BAR
          Shown as its own row above the drop zone when headerEnabled = true.
          Structured as: [title text] [stretching coloured line]
          Matches the design in the reference image.
      ────────────────────────────────────────────────────────────────────── */}
      {headerEnabled && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "7px 12px",
            borderRadius: "6px 6px 0 0",
            flexShrink: 0,
            minHeight: "36px",
            pointerEvents: "none",   // header bar itself is non-interactive
          }}
        >
          {/* Title */}
          <span
            style={{
              fontWeight: "700",
              fontSize: "15px",
                
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {headerTitle || "header"}
          </span>

          {/* Decorative horizontal line — fills remaining space */}
          <div
            style={{
              flex: 1,
              height: "2.5px",
              background: headerAccent,
              borderRadius: "2px",
            }}
          />
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────
          DROP ZONE  — all existing drag-drop functionality is untouched
      ────────────────────────────────────────────────────────────────────── */}
      <div 
        style={{ 
          flex: 1, 
          position: "relative", 
          overflow: "visible", 
          padding: `${padding}px`, 
          minHeight:
            nestedContainers.length === 0 && items.length === 0 && sliders.length === 0
              ? "150px"
              : "fit-content",
        }} 
        onDrop={handleDrop} 
        onDragOver={handleDragOver}
      >
        {/* Empty-state label */}
        {nestedContainers.length === 0 && items.length === 0 && sliders.length === 0 && (
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            height: "100%", 
            color: isNested ? "#ff9800" : "#999", 
            fontSize: "14px", 
            textAlign: "center", 
            padding: "20px",
          }}>
            {isNested ? "Drop containers or news here (Nested)" : "Drop containers here"}
          </div>
        )}

        {/* Grid of items / nested containers / sliders (insertion order preserved) */}
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: `repeat(${columns}, 1fr)`, 
            gap: `${gap}px`, 
            width: "100%",
            position: "relative",
          }}
        >
          {(() => {
            const extractTimestamp = (item) => {
              if (item.slotId) {
                const m = item.slotId.match(/slot_(\d+)/);
                return m ? parseInt(m[1]) : 0;
              }
              if (item.id) {
                const m = item.id.toString().match(/_(\d+)$/);
                return m ? parseInt(m[1]) : 0;
              }
              return 0;
            };

            const allElements = [
              ...items.map(item => ({ type: 'item',   data: item,   timestamp: extractTimestamp(item) })),
              ...nestedContainers.map(nc => ({ type: 'nested', data: nc,     timestamp: extractTimestamp(nc) })),
              ...sliders.map(sl => ({ type: 'slider', data: sl,     timestamp: extractTimestamp(sl) })),
            ];
            allElements.sort((a, b) => a.timestamp - b.timestamp);

            return allElements.map((element, index) => {
              // ── Item (news slot) ──────────────────────────────────────────
              if (element.type === 'item') {
                const item = element.data;
                const Component = COMPONENT_MAP[item.containerType];
                if (!Component) return null;
                const defaults = getUniversalContainerDefaults(item.containerType);
                return (
                  <div key={item.slotId} style={{ pointerEvents: "auto", position: "relative", zIndex: 10 + index }}>
                    <Component 
                      border 
                      slotId={item.slotId} 
                      catName={catName} 
                      containerId={id}
                      isNested={isNested}
                      parentContainerId={parentContainerId}
                      defaultWidth={defaults.width}
                      defaultHeight={defaults.height}
                      defaultLayout={defaults.layout}
                      onDelete={() => {
                        if (isNested && parentContainerId) {
                          dispatch(removeSlotFromNestedContainer({ catName, parentContainerId, nestedContainerId: id, slotId: item.slotId }));
                        } else {
                          dispatch(removeSlotFromContainer({ catName, containerId: id, slotId: item.slotId }));
                        }
                      }}
                    />
                  </div>
                );
              }

              // ── Nested container ──────────────────────────────────────────
              if (element.type === 'nested') {
                const nested = element.data;
                return (
                  <div key={nested.id} style={{ pointerEvents: "auto", position: "relative", zIndex: 10 + index }}>
                    <EditableContainer
                      id={nested.id}
                      catName={catName}
                      isNested={true}
                      parentContainerId={id}
                    />
                  </div>
                );
              }

              // ── Slider ────────────────────────────────────────────────────
              if (element.type === 'slider') {
                const slider = element.data;
                return (
                  <div key={slider.id} style={{ pointerEvents: "auto", position: "relative", zIndex: 10 + index, width: "100%", height: "fit-content" }}>
                    {slider.type === "type1" ? (
                      <EditableSlider
                        id={slider.id}
                        catName={catName}
                        containerId={id}
                        isNested={isNested}
                        parentContainerId={parentContainerId}
                      />
                    ) : (
                      <EditableSlider2
                        id={slider.id}
                        catName={catName}
                        containerId={id}
                        isNested={isNested}
                        parentContainerId={parentContainerId}
                      />
                    )}
                  </div>
                );
              }

              return null;
            });
          })()}
        </div>

        {/* Lines */}
        {lines.map((line) => (
          <EditableLine
            key={line.id}
            id={line.id}
            lineType={line.lineType}
            orientation={line.orientation}
            length={line.length}
            x={line.x}
            y={line.y}
            catName={catName}
            isActive={false}
            containerId={id}
            parentContainerId={parentContainerId}
          />
        ))}
      </div>
    </div>
  );
}