import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { X, Edit2, Grid3x3, Space } from "lucide-react";
import { useDispatch } from "react-redux";

import {
  updateContainerPosition,
  updateContainerSize,
  updateContainerGrid,
  addEmptySlot,
  dropNewsIntoSlot,
  deleteContainer,
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

export function EditableContainer({
  id,
  position,
  size,
  grid,
  // items,
  catName,
}) {
  const dispatch = useDispatch();
  /* ---------- EXISTING LOCAL EDITOR STATE (KEPT) ---------- */
  const [showSettings, setShowSettings] = useState(false);
  const [columns, setColumns] = useState(grid?.columns ?? 2);
  const [gap, setGap] = useState(grid?.gap ?? 10);

  const [droppedContainers, setDroppedContainers] = useState([]);

  /* ---------- DELETE CONTAINER ---------- */
  const handleDelete = (e) => {
    if (e.detail === 2) {
      dispatch(deleteContainer({ catName, containerId: id }));
    }
  };

  /* ---------- DROP NEWS / CONTAINER TYPE ---------- */
  const handleDrop = (e) => {
    e.preventDefault();

    const type = e.dataTransfer.getData("text/plain");
    const newsId = e.dataTransfer.getData("newsId");

    if (!type) return;

    // ✅ Generate consistent ID
    const slotId = `slot_${Date.now()}`;

    /* local editor rendering */
    const newContainer = {
      id: slotId, // ✅ Use the same slotId
      type,
      data: {
        image: jwt,
        headline: `Sample Headline for ${type}`,
        content: "This is sample content for the news container.",
        time: "2 hours ago",
      },
    };

    setDroppedContainers((prev) => [...prev, newContainer]);

    /* ✅ Create slot in Redux with the SAME slotId */
    dispatch(
      addEmptySlot({
        catName,
        containerId: id,
        containerType: type,
        slotId: slotId, // Pass the slotId explicitly
      })
    );

    // If news was dropped directly, assign it
    if (newsId) {
      dispatch(
        dropNewsIntoSlot({
          catName,
          containerId: id,
          slotId: slotId,
          newsId: Number(newsId),
        })
      );
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDeleteDroppedContainer = (containerId) => {
    setDroppedContainers((prev) => prev.filter((c) => c.id !== containerId));
  };

  /* ---------- RENDER ---------- */
  return (
    <Rnd
      size={{
        width: size?.width ?? 700,
        height: size?.height ?? 250,
      }}
      position={{
        x: position?.x ?? 50,
        y: position?.y ?? 50,
      }}
      minWidth={1}
      minHeight={1}
      bounds="parent"
      enableResizing
      dragHandleClassName="drag-handle-container"
      style={{
        border: "2px dashed #666",
        background: "transparent",
        position: "absolute",
        cursor: "move",
        overflowX: "none",
        overflowy: "none",
      }}
      onDragStop={(e, d) => {
        dispatch(
          updateContainerPosition({
            catName,
            containerId: id,
            position: { x: d.x, y: d.y },
          })
        );
      }}
      onResizeStop={(e, dir, ref, delta, pos) => {
        dispatch(
          updateContainerSize({
            catName,
            containerId: id,
            size: {
              width: ref.offsetWidth,
              height: ref.offsetHeight,
            },
          })
        );
        dispatch(
          updateContainerPosition({
            catName,
            containerId: id,
            position: pos,
          })
        );
      }}
    >
      <div
        className="drag-handle-container"
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          pointerEvents: "auto",
          overflow: "auto",
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
              background: "green",
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
              border: "2px solid #666",
              borderRadius: "8px",
              // padding: "15px",
              zIndex: 20,
              minWidth: "220px",
            }}
          >
            <div style={{ marginBottom: "12px" }}>
              <Grid3x3 size={16} /> Column Count
              <input
                type="number"
                value={columns}
                min="1"
                max="6"
                onChange={(e) => {
                  const v = parseInt(e.target.value) || 1;
                  setColumns(v);
                  dispatch(
                    updateContainerGrid({
                      catName,
                      containerId: id,
                      columns: v,
                      gap,
                    })
                  );
                }}
              />
            </div>

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
                    updateContainerGrid({
                      catName,
                      containerId: id,
                      columns,
                      gap: v,
                    })
                  );
                }}
              />
            </div>
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
              color: "#999",
              fontSize: "14px",
              textAlign: "center",
              padding: "20px",
            }}
          >
            Drop containers here
          </div>
        )}

        {/* ---------- RENDER DROPPED NEWS ---------- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: `${gap}px`,
            padding: "10px",
            pointerEvents: "none",
          }}
        >
          {droppedContainers.map((container) => {
            const Component = COMPONENT_MAP[container.type];
            if (!Component) return null;

            return (
              <div key={container.id} style={{ pointerEvents: "auto" }}>
                <Component
                  {...container.data}
                  border
                  slotId={container.id} // ✅ Pass slotId
                  catName={catName} // ✅ Pass catName
                  containerId={id} // ✅ Pass containerId
                  onDelete={() => handleDeleteDroppedContainer(container.id)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </Rnd>
  );
}
