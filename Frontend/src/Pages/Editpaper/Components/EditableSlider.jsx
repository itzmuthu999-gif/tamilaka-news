import React, { useState, useRef, useEffect } from "react";

import {
  X,
  Edit2,
  Space,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import {
  updateSliderWidth,
  updateContainerSliderGap,
  updateContainerSliderDimensions,
  updateContainerSliderPadding,
  updateContainerSliderHeader,
  addSlotToContainerSlider,
  deleteContainerSlider,
  removeSlotFromContainerSlider,
  dropNewsIntoSliderSlot,
  addVideoSlotToSlider,
} from "../../Slice/editpaperSlice/editpaperslice";

import BigNewsContainer1 from "../Containers_/BigContainer1";
import BigNewsContainer2 from "../Containers_/BigContainer2";
import BigNewsContainer3 from "../Containers_/BigContainer3";
import BigNewsContainer4 from "../Containers_/BigContainer4";
import BigNewsContainer4A from "../Containers_/BigContainer4A";
import BigNewsContainer5 from "../Containers_/BigContainer5";
import UniversalNewsContainer from "../Containers_/UniversalNewsContainer";
import NorContainer1 from "../Containers_/NorContainer1";
import NorContainer2 from "../Containers_/NorContainer2";
import NorContainer3 from "../Containers_/NorContainer3";
import NorContainer4 from "../Containers_/NorContainer4";
import NorContainer4A from "../Containers_/NorContainer4A";

// FIX 1: Import NorContainer4B
import NorContainer4B from "../Containers_/NorContainer4B";

import NorContainer5 from "../Containers_/NorContainer5";
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

  // FIX 2: Register NorContainer4B in the map
  "Normal Container Type 4B": NorContainer4B,

  "Normal Container Type 5": NorContainer5,
  
  "Video Container": VideoContainer,
};
// Helper function to get default config for Universal Container
const getUniversalContainerDefaults = (containerType) => {
  const configMap = {
    "Big Container Type 1": { width: 800, height: 500, layout: 1 },
    "Big Container Type 2": { width: 500, height: 350, layout: 4 },
    "Big Container Type 3": { width: 400, height: 350, layout: 1 },
    "Big Container Type 4": { width: 280, height: 280, layout: 1 },
    "Big Container Type 4A": { width: 280, height: 280, layout: 1 },
    "Big Container Type 5": { width: 500, height: 300, layout: 4 },
    "Normal Container Type 1": { width: 390, height: 200, layout: 4 },
    "Normal Container Type 2": { width: 200, height: 100, layout: 8 },
    "Normal Container Type 3": { width: 200, height: 100, layout: 6 },
    "Normal Container Type 4": { width: 100, height: 100, layout: 6 },
    "Normal Container Type 4A": { width: 100, height: 100, layout: 6 },
    "Normal Container Type 4B": { width: 300, height: 80, layout: 10 },
    "Normal Container Type 5": { width: 400, height: 200, layout: 4 },
    "Universal Container": { width: 400, height: 300, layout: 1 },
    "Universal Container": { width: 400, height: 300, layout: 1 },
  };
  
  return configMap[containerType] || { width: 400, height: 300, layout: 1 };
};
export function EditableSlider({
  id,

  catName,

  containerId,

  isNested = false,

  parentContainerId = null,
}) {
  const dispatch = useDispatch();

  const containerRef = useRef(null);

  const resizerRef = useRef(null);

  const slider = useSelector((state) => {
    if (isNested && parentContainerId) {
      const parentCont = state.editpaper.pages

        .find((p) => p.catName === catName)

        ?.containers.find((c) => c.id === parentContainerId);

      return parentCont?.nestedContainers

        ?.find((nc) => nc.id === containerId)

        ?.sliders?.find((s) => s.id === id);
    } else {
      return state.editpaper.pages

        .find((p) => p.catName === catName)

        ?.containers.find((c) => c.id === containerId)

        ?.sliders?.find((s) => s.id === id);
    }
  });

  const [showSettings, setShowSettings] = useState(false);

  const [gap, setGap] = useState(slider?.gap ?? 10);

  const [sliderPadding, setSliderPadding] = useState(slider?.padding || 10);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [width, setWidth] = useState(slider?.size?.width || 0);

  const [isResizing, setIsResizing] = useState(false);

  const [headerEnabled, setHeaderEnabled] = useState(slider?.header?.enabled || false);

  const [headerTitle, setHeaderTitle] = useState(slider?.header?.title || "");

  const droppedContainers = slider?.items || [];

  const lockedType = slider?.lockedType;

  // Sync local state with Redux state when slider data changes
  useEffect(() => {
    if (slider) {
      setGap(slider.gap ?? 10);
      setSliderPadding(slider.padding || 10);
    }
  }, [slider]);

  useEffect(() => {
    if (containerRef.current && width === 0) {
      const containerWidth = containerRef.current.offsetWidth;

      setWidth(containerWidth);

      dispatch(
        updateSliderWidth({
          catName,

          containerId,

          sliderId: id,

          width: containerWidth,

          isNested,

          parentContainerId,
        }),
      );
    }
  }, [
    containerRef,
    width,
    dispatch,
    catName,
    containerId,
    id,
    isNested,
    parentContainerId,
  ]);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const newWidth = Math.max(200, e.clientX - containerRect.left);
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);

      dispatch(
        updateSliderWidth({
          catName,

          containerId,

          sliderId: id,

          width,

          isNested,

          parentContainerId,
        }),
      );
    };

    document.addEventListener("mousemove", handleMouseMove);

    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);

      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isResizing,
    width,
    dispatch,
    catName,
    containerId,
    id,
    isNested,
    parentContainerId,
  ]);

  const handleDelete = (e) => {
    if (e.detail === 2) {
      dispatch(
        deleteContainerSlider({
          catName,
          containerId,
          sliderId: id,
          isNested,
          parentContainerId,
        }),
      );
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();

    e.stopPropagation();

    const type = e.dataTransfer.getData("text/plain");

    const newsId = e.dataTransfer.getData("newsId");
    
    const presetId = e.dataTransfer.getData("presetId"); // Get presetId from drag data
    
    const isVideo = e.dataTransfer.getData("isVideo");

    if (isVideo === "true") {
      const slotId = `slider_slot_${Date.now()}`;
      dispatch(
        addVideoSlotToSlider({
          catName,
          containerId,
          sliderId: id,
          slotId,
          isNested,
          parentContainerId,
        })
      );
      return;
    }

    if (!type) return;

    if (lockedType && type !== lockedType) {
      alert(`This slider only accepts "${lockedType}" containers!`);

      return;
    }

    const slotId = `slider_slot_${Date.now()}`;

    dispatch(
      addSlotToContainerSlider({
        catName,

        containerId,

        sliderId: id,

        containerType: type,

        slotId: slotId,

        isNested,

        parentContainerId,
        
        presetId: presetId || undefined, // Pass presetId if available
      }),
    );

    if (newsId) {
      dispatch(
        dropNewsIntoSliderSlot({
          catName,
          sliderId: id,
          slotId,
          newsId: Number(newsId),
          containerId,
          isNested,
          parentContainerId,
        }),
      );
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDeleteSlot = (slotId) => {
    dispatch(
      removeSlotFromContainerSlider({
        catName,
        containerId,
        sliderId: id,
        slotId,
        isNested,
        parentContainerId,
      }),
    );

    if (currentIndex >= droppedContainers.length - 1) {
      setCurrentIndex(Math.max(0, currentIndex - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(droppedContainers.length - 1, prev + 1));
  };

  return (
    <div
      ref={containerRef}
      style={{
        border: "2px dashed #0066cc",
        background: "rgba(0, 102, 204, 0.05)",
        position: "relative",
        width: width > 0 ? `${width}px` : "100%",
        minHeight: droppedContainers.length === 0 ? "200px" : "fit-content",
        height: droppedContainers.length > 0 ? "fit-content" : "fit-content",
        pointerEvents: "auto",
        display: "flex",
        flexDirection: "column",
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Edit/Delete buttons â€” outside overflow:hidden so they are always visible */}
      <div
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          display: "flex",
          gap: "8px",
          zIndex: 99999,
          pointerEvents: "auto",
        }}
      >
        <button
          onClick={() => setShowSettings(!showSettings)}
          style={{
            background: "#0066cc",
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

      {/* Settings popup â€” outside overflow:hidden so it is never clipped */}
      {showSettings && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            right: "8px",
            background: "white",
            border: "2px solid #0066cc",
            borderRadius: "8px",
            padding: "15px",
            zIndex: 99999,
            minWidth: "220px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
            <div style={{ marginBottom: "12px" }}>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  marginBottom: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Maximize2 size={16} /> Padding (px)
              </label>
              <input
                type="number"
                value={sliderPadding}
                min="0"
                max="100"
                onChange={(e) => {
                  const v = parseInt(e.target.value) || 0;
                  setSliderPadding(v);
                  dispatch(
                    updateContainerSliderPadding({
                      catName,
                      containerId,
                      sliderId: id,
                      padding: v,
                      isNested,
                      parentContainerId,
                    }),
                  );
                }}
                style={{
                  width: "100%",
                  marginTop: "8px",
                  padding: "4px",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  marginBottom: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Space size={16} /> Gap (px)
              </label>
              <input
                type="number"
                value={gap}
                min="0"
                max="50"
                onChange={(e) => {
                  const v = parseInt(e.target.value) || 0;

                  setGap(v);

                  dispatch(
                    updateContainerSliderGap({
                      catName,

                      containerId,

                      sliderId: id,

                      gap: v,

                      isNested,

                      parentContainerId,
                    }),
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
              <div
                style={{
                  marginTop: "12px",
                  fontSize: "12px",
                  color: "#0066cc",
                }}
              >
                ðŸ”’ Locked to: {lockedType}
              </div>
            )}

            <div style={{ marginTop: "12px", borderTop: "1px solid #eee", paddingTop: "12px" }}>
              <label style={{ fontSize: "12px", fontWeight: "500", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Edit2 size={14} /> Header
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <input
                  type="checkbox"
                  id={`slider1-header-enabled-${id}`}
                  checked={headerEnabled}
                  onChange={(e) => {
                    const newEnabled = e.target.checked;
                    setHeaderEnabled(newEnabled);
                    dispatch(updateContainerSliderHeader({
                      catName, containerId, sliderId: id,
                      enabled: newEnabled, title: headerTitle,
                      isNested, parentContainerId
                    }));
                  }}
                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                />
                <label htmlFor={`slider1-header-enabled-${id}`} style={{ fontSize: "12px", cursor: "pointer" }}>Enable Header</label>
              </div>
              {headerEnabled && (
                <input
                  type="text"
                  value={headerTitle}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setHeaderTitle(newTitle);
                    dispatch(updateContainerSliderHeader({
                      catName, containerId, sliderId: id,
                      enabled: headerEnabled, title: newTitle,
                      isNested, parentContainerId
                    }));
                  }}
                  placeholder="Header title..."
                  style={{ width: "100%", padding: "6px 8px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px" }}
                />
              )}
            </div>
          </div>
        )}

      {/* Inner content wrapper â€” padding without overflow:hidden so popup is never clipped */}
      <div
        style={{
          width: "100%",
          position: "relative",
          flex: droppedContainers.length === 0 ? 1 : "0 0 auto",
          height: droppedContainers.length > 0 ? "fit-content" : "auto",
          padding: `${sliderPadding}px`,
        }}
      >

        {headerEnabled && headerTitle && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 12px",
              borderRadius: "6px 6px 0 0",
              flexShrink: 0,
              minHeight: "36px",
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                fontWeight: "700",
                fontSize: "15px",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {headerTitle}
            </span>
            <div
              style={{
                flex: 1,
                height: "2.5px",
                background: "#0066cc",
                borderRadius: "2px",
              }}
            />
          </div>
        )}

        {droppedContainers.length === 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#0066cc",
              fontSize: "14px",
              textAlign: "center",
              padding: "20px",
            }}
          >
            Drop containers here to create a slider
            <br />
            <span
              style={{ fontSize: "12px", marginTop: "8px", display: "block" }}
            >
              (First drop locks the container type)
            </span>
          </div>
        )}

        {droppedContainers.length > 0 && (
          <>
            {droppedContainers.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(0, 0, 0, 0.5)",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 100,
                    opacity: currentIndex === 0 ? 0.3 : 1,
                  }}
                >
                  <ChevronLeft size={24} color="white" />
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentIndex === droppedContainers.length - 1}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(0, 0, 0, 0.5)",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 100,
                    opacity:
                      currentIndex === droppedContainers.length - 1 ? 0.3 : 1,
                  }}
                >
                  <ChevronRight size={24} color="white" />
                </button>
              </>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px 60px",
                pointerEvents: "none",
              }}
            >
              {droppedContainers[currentIndex] &&
                (() => {
                  const container = droppedContainers[currentIndex];

                  const Component = COMPONENT_MAP[container.containerType];

                  if (!Component) return null;

                  return (
                    <div
                      key={container.slotId}
                      style={{ pointerEvents: "auto" }}
                    >
                      <Component
                        border
                        slotId={container.slotId}
                        catName={catName}
                        containerId={containerId}
                        sliderId={id}
                        isSlider={true}
                        isNested={isNested}
                        parentContainerId={parentContainerId}
                        onDelete={() => handleDeleteSlot(container.slotId)}
                      />
                    </div>
                  );
                })()}
            </div>

            <div
              style={{
                position: "absolute",
                bottom: "10px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "8px",
                zIndex: 100,
              }}
            >
              {droppedContainers.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: idx === currentIndex ? "#0066cc" : "#ccc",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div
        ref={resizerRef}
        onMouseDown={() => setIsResizing(true)}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "8px",
          cursor: "ew-resize",
          background: "transparent",
          zIndex: 1001,
        }}
      />
    </div>
  );
}
