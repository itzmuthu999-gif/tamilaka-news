import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { X, Edit2, Space } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  updateSliderPosition,
  updateSliderSize,
  updateSliderGap,
  addSlotToSlider,
  dropNewsIntoSliderSlot,
  deleteSlider,
  removeSlotFromSlider,
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

export function EditableSlider2({
  id,
  position,
  size,
  gap: initialGap,
  catName,
}) {
  const dispatch = useDispatch();
  
  // ✅ FIXED: Get slider data from unified sliders array
  const slider = useSelector((state) => {
    const page = state.editpaper.pages.find((p) => p.catName === catName);
    return page?.sliders.find((s) => s.id === id); // Changed from sliders2 to sliders
  });

  const [showSettings, setShowSettings] = useState(false);
  const [gap, setGap] = useState(initialGap ?? 10);

  const droppedContainers = slider?.items || [];
  const lockedType = slider?.lockedType;

  /* ---------- DELETE SLIDER ---------- */
  const handleDelete = (e) => {
    if (e.detail === 2) {
      dispatch(deleteSlider({ catName, sliderId: id })); // Changed from slider2Id to sliderId
    }
  };

  /* ---------- DROP CONTAINER TYPE ---------- */
  const handleDrop = (e) => {
    e.preventDefault();

    const type = e.dataTransfer.getData("text/plain");
    const newsId = e.dataTransfer.getData("newsId");

    if (!type) return;

    // Check if type matches locked type (after first drop)
    if (lockedType && type !== lockedType) {
      alert(`This slider only accepts "${lockedType}" containers!`);
      return;
    }

    // Generate consistent ID
    const slotId = `slider2_slot_${Date.now()}`;

    // ✅ Add slot to Redux
    dispatch(
      addSlotToSlider({
        catName,
        sliderId: id, // Changed from slider2Id to sliderId
        containerType: type,
        slotId: slotId,
      })
    );

    // If news was dropped directly, assign it
    if (newsId) {
      dispatch(
        dropNewsIntoSliderSlot({
          catName,
          sliderId: id, // Changed from slider2Id to sliderId
          slotId: slotId,
          newsId: Number(newsId),
        })
      );
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDeleteSlot = (slotId) => {
    dispatch(
      removeSlotFromSlider({
        catName,
        sliderId: id, // Changed from slider2Id to sliderId
        slotId,
      })
    );
  };

  /* ---------- RENDER ---------- */
  return (
    <Rnd
      size={{
        width: size?.width ?? 1000,
        height: size?.height ?? 150,
      }}
      position={{
        x: position?.x ?? 50,
        y: position?.y ?? 50,
      }}
      minWidth={400}
      minHeight={100}
      bounds="parent"
      enableResizing
      dragHandleClassName="drag-handle-slider2"
      style={{
        border: "2px dashed #ff6b35",
        background: "rgba(255, 107, 53, 0.05)",
        position: "absolute",
        cursor: "move",
      }}
      onDragStop={(e, d) => {
        dispatch(
          updateSliderPosition({
            catName,
            sliderId: id, // Changed from slider2Id to sliderId
            position: { x: d.x, y: d.y },
          })
        );
      }}
      onResizeStop={(e, dir, ref, delta, pos) => {
        dispatch(
          updateSliderSize({
            catName,
            sliderId: id, // Changed from slider2Id to sliderId
            size: {
              width: ref.offsetWidth,
              height: ref.offsetHeight,
            },
          })
        );
        dispatch(
          updateSliderPosition({
            catName,
            sliderId: id, // Changed from slider2Id to sliderId
            position: pos,
          })
        );
      }}
    >
      <div
        className="drag-handle-slider2"
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          pointerEvents: "auto",
          overflow: "hidden",
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {/* ---------- CONTROLS ---------- */}
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            display: "flex",
            gap: "8px",
            zIndex: 1000,
            pointerEvents: "auto",
          }}
        >
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="control-btn edit-btn"
            style={{
              background: "#ff6b35",
              border: "none",
              borderRadius: "4px",
              padding: "6px",
              cursor: "pointer",
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
            }}
          >
            <X size={18} color="white" />
          </button>
        </div>

        {/* ---------- SETTINGS PANEL ---------- */}
        {showSettings && (
          <div
            className="settings-panel"
            style={{
              position: "absolute",
              top: "50px",
              right: "8px",
              background: "white",
              border: "2px solid #ff6b35",
              borderRadius: "8px",
              padding: "15px",
              zIndex: 20,
              minWidth: "220px",
            }}
          >
            <div>
              <Space size={16} /> Gap (px)
              <input
                type="number"
                value={gap}
                min="0"
                max="50"
                onChange={(e) => {
                  const v = parseInt(e.target.value) || 0;
                  setGap(v);
                  dispatch(
                    updateSliderGap({
                      catName,
                      sliderId: id, // Changed from slider2Id to sliderId
                      gap: v,
                    })
                  );
                }}
                style={{
                  width: "100%",
                  marginTop: "8px",
                  padding: "4px",
                }}
              />
            </div>
            
            {lockedType && (
              <div style={{ marginTop: "12px", fontSize: "12px", color: "#ff6b35" }}>
                🔒 Locked to: {lockedType}
              </div>
            )}
          </div>
        )}

        {/* ---------- EMPTY STATE ---------- */}
        {droppedContainers.length === 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#ff6b35",
              fontSize: "14px",
              textAlign: "center",
              padding: "20px",
            }}
          >
            Drop containers here (horizontal scroll)
            <br />
            <span style={{ fontSize: "12px", marginTop: "8px", display: "block" }}>
              (First drop locks the container type)
            </span>
          </div>
        )}

        {/* ---------- HORIZONTAL SCROLLABLE CONTENT ---------- */}
        {droppedContainers.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              overflowX: "auto",
              overflowY: "hidden",
              gap: `${gap}px`,
              padding: "10px",
              pointerEvents: "none",
            }}
          >
            {droppedContainers.map((container) => {
              const Component = COMPONENT_MAP[container.containerType];
              
              if (!Component) return null;

              return (
                <div 
                  key={container.slotId} 
                  style={{ 
                    flexShrink: 0,
                    pointerEvents: "auto"
                  }}
                >
                  <Component
                    border
                    slotId={container.slotId}
                    catName={catName}
                    containerId={id}
                    isSlider2={true}
                    onDelete={() => handleDeleteSlot(container.slotId)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Rnd>
  );
}