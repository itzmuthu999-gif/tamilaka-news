import React, { useState, useRef, useEffect } from "react";

import { X, Edit2, Space, ChevronLeft, ChevronRight } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import {
  updateSliderWidth,
  updateContainerSliderGap,
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

  const [currentIndex, setCurrentIndex] = useState(0);

  const [width, setWidth] = useState(slider?.size?.width || 0);

  const [isResizing, setIsResizing] = useState(false);

  const droppedContainers = slider?.items || [];

  const lockedType = slider?.lockedType;

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

        minHeight: "200px",

        pointerEvents: "auto",
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div
        style={{
          width: "100%",

          height: "100%",

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

              minHeight: "200px",

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

                height: "100%",

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
