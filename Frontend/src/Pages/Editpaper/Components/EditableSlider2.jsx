import React, { useState, useRef, useEffect } from "react";
import { X, Edit2, Space, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateSliderWidth,
  updateContainerSliderGap,
  updateContainerSliderHeader,
  updateContainerSliderPadding,
  addSlotToContainerSlider,
  dropNewsIntoContainerSliderSlot,
  deleteContainerSlider,
  removeSlotFromContainerSlider,
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

export function EditableSlider2({
  id,
  catName,
  containerId,
  isNested = false,
  parentContainerId = null,
}) {
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
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
  const [headerEnabled, setHeaderEnabled] = useState(slider?.header?.enabled || false);
  const [headerTitle, setHeaderTitle] = useState(slider?.header?.title || "");
  const [padding, setPadding] = useState(slider?.padding || 10);
  const [width, setWidth] = useState(slider?.size?.width || 0);
  const [isResizing, setIsResizing] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const droppedContainers = slider?.items || [];
  const lockedType = slider?.lockedType;

  // Calculate container width based on first container and gap
  useEffect(() => {
    if (droppedContainers.length > 0 && scrollContainerRef.current) {
      const firstChild = scrollContainerRef.current.children[0];
      if (firstChild) {
        const childWidth = firstChild.offsetWidth;
        setContainerWidth(childWidth + gap);
      }
    }
  }, [droppedContainers, gap]);

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
        const parentContainer = containerRef.current.closest('.ep-ed-cont');
        const parentWidth = parentContainer ? parentContainer.offsetWidth - 40 : 1250; // Account for padding
        const newWidth = Math.max(200, Math.min(parentWidth, e.clientX - containerRect.left));

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

    if (!type) return;

    if (lockedType && type !== lockedType) {
      alert(`This slider only accepts "${lockedType}" containers!`);
      return;
    }

    const slotId = `slider2_slot_${Date.now()}`;

    dispatch(
      addSlotToContainerSlider({
        catName,
        containerId,
        sliderId: id,
        containerType: type,
        slotId: slotId,
        isNested,
        parentContainerId,
      }),
    );

    if (newsId) {
      dispatch(
        dropNewsIntoContainerSliderSlot({
          catName,
          containerId,
          sliderId: id,
          slotId: slotId,
          newsId: Number(newsId),
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
  };

  // Slide left function
  const slideLeft = () => {
    if (scrollContainerRef.current && containerWidth > 0) {
      const newTranslateX = Math.min(translateX + containerWidth, 0);
      setTranslateX(newTranslateX);
    }
  };

  // Slide right function
  const slideRight = () => {
    if (scrollContainerRef.current && containerWidth > 0) {
      const scrollWidth = scrollContainerRef.current.scrollWidth;
      const visibleWidth = containerRef.current?.offsetWidth || width;
      const maxTranslate = -(scrollWidth - visibleWidth);
      
      const newTranslateX = Math.max(translateX - containerWidth, maxTranslate);
      setTranslateX(newTranslateX);
    }
  };

  // Check if navigation buttons should be visible
  const showNavigation = droppedContainers.length > 0;
  const canSlideLeft = translateX < 0;
  const canSlideRight = scrollContainerRef.current
    ? translateX > -(scrollContainerRef.current.scrollWidth - (containerRef.current?.offsetWidth || width))
    : false;

  return (
    <div
      ref={containerRef}
      style={{
        border: "2px dashed #ff6b35",
        background: "rgba(255, 107, 53, 0.05)",
        position: "relative",
        width: width > 0 ? `${width}px` : "100%",
        height: droppedContainers.length > 0 ? "fit-content" : "auto",
        minHeight: droppedContainers.length === 0 ? "120px" : "0",
        pointerEvents: "auto",
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {headerEnabled && (
        <div style={{ 
          padding: `${padding}px`, 
          fontSize: "18px", 
          fontWeight: "bold", 
          flexShrink: 0, 
          pointerEvents: "none",
          background: "rgba(255, 107, 53, 0.05)"
        }}>
          <Newsheader name={headerTitle || "slider header"} />
        </div>
      )}

      <div
        style={{
          width: "100%",
          height: droppedContainers.length > 0 ? "fit-content" : "auto",
          padding: `${padding}px`,
          position: "relative",
          overflow: "hidden",
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
            pointerEvents: "auto",
          }}
        >
          <button
            onClick={() => setShowSettings(!showSettings)}
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

        {showSettings && (
          <div
            style={{
              position: "absolute",
              top: "50px",
              right: "8px",
              background: "white",
              border: "2px solid #ff6b35",
              borderRadius: "8px",
              padding: "15px",
              zIndex: 1000,
              minWidth: "220px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input 
                  type="checkbox" 
                  checked={headerEnabled} 
                  onChange={(e) => {
                    const enabled = e.target.checked;
                    setHeaderEnabled(enabled);
                    dispatch(
                      updateContainerSliderHeader({
                        catName,
                        containerId,
                        sliderId: id,
                        enabled,
                        title: enabled ? headerTitle : "",
                        isNested,
                        parentContainerId,
                      }),
                    );
                  }}
                  style={{ cursor: "pointer" }} 
                />
                <span style={{ fontSize: "12px", fontWeight: "500" }}>Enable Header</span>
              </label>
            </div>

            {headerEnabled && (
              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "12px", fontWeight: "500", marginBottom: "4px", display: "block" }}>Header Title</label>
                <input 
                  type="text" 
                  value={headerTitle} 
                  onChange={(e) => {
                    const title = e.target.value;
                    setHeaderTitle(title);
                    dispatch(
                      updateContainerSliderHeader({
                        catName,
                        containerId,
                        sliderId: id,
                        enabled: headerEnabled,
                        title,
                        isNested,
                        parentContainerId,
                      }),
                    );
                  }}
                  placeholder="Enter header title..." 
                  style={{ width: "100%", padding: "6px 8px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px" }} 
                />
              </div>
            )}

            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "12px", fontWeight: "500", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Maximize2 size={16} /> Padding (px)
              </label>
              <input
                type="number"
                value={padding}
                min="0"
                max="100"
                onChange={(e) => {
                  const v = parseInt(e.target.value) || 0;
                  setPadding(v);
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
              <label style={{ fontSize: "12px", fontWeight: "500", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
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
                  color: "#ff6b35",
                }}
              >
                🔒 Locked to: {lockedType}
              </div>
            )}
          </div>
        )}

        {droppedContainers.length === 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              minHeight: "120px",
              color: "#ff6b35",
              fontSize: "14px",
              textAlign: "center",
              padding: "20px",
            }}
          >
            Drop containers here (horizontal scroll)
            <br />
            <span
              style={{ fontSize: "12px", marginTop: "8px", display: "block" }}
            >
              (First drop locks the container type)
            </span>
          </div>
        )}

        {droppedContainers.length > 0 && (
          <div
            style={{
              width: "100%",
              height: "auto",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              ref={scrollContainerRef}
              style={{
                display: "flex",
                alignItems: "center",
                height: "auto",
                gap: `${gap}px`,
                padding: "10px",
                pointerEvents: "none",
                transform: `translateX(${translateX}px)`,
                transition: "transform 0.3s ease-in-out",
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
                      pointerEvents: "auto",
                    }}
                  >
                    <Component
                      border
                      slotId={container.slotId}
                      catName={catName}
                      containerId={containerId}
                      sliderId={id}
                      isSlider2={true}
                      isNested={isNested}
                      parentContainerId={parentContainerId}
                      onDelete={() => handleDeleteSlot(container.slotId)}
                    />
                  </div>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            {showNavigation && (
              <>
                {/* Left Button */}
                <button
                  onClick={slideLeft}
                  disabled={!canSlideLeft}
                  style={{
                    position: "absolute",
                    left: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: canSlideLeft ? "#ff6b35" : "#ccc",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: canSlideLeft ? "pointer" : "not-allowed",
                    zIndex: 1001,
                    pointerEvents: "auto",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (canSlideLeft) {
                      e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                  }}
                >
                  <ChevronLeft size={24} color="white" />
                </button>

                {/* Right Button */}
                <button
                  onClick={slideRight}
                  disabled={!canSlideRight}
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: canSlideRight ? "#ff6b35" : "#ccc",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: canSlideRight ? "pointer" : "not-allowed",
                    zIndex: 1001,
                    pointerEvents: "auto",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (canSlideRight) {
                      e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                  }}
                >
                  <ChevronRight size={24} color="white" />
                </button>
              </>
            )}
          </div>
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