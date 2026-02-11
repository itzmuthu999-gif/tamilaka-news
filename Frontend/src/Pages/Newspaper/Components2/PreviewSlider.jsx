import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

import Newsheader from "../Components/Newsheader";

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

export default function PreviewSlider({
  id,
  catName,
  containerId,
  isNested = false,
  parentContainerId = null,
}) {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slider = useSelector((state) => {
    const page = state.editpaper.pages.find((p) => p.catName === catName);
    
    if (!page) return null;
    
    // If this slider is at page level (no containerId)
    if (!containerId) {
      return page.sliders?.find((s) => s.id === id);
    }
    
    // If this slider is inside a nested container
    if (isNested && parentContainerId) {
      const parentCont = page.containers.find((c) => c.id === parentContainerId);
      const nestedCont = parentCont?.nestedContainers?.find((nc) => nc.id === containerId);
      return nestedCont?.sliders?.find((s) => s.id === id);
    }
    
    // If this slider is inside a regular container
    const container = page.containers.find((c) => c.id === containerId);
    return container?.sliders?.find((s) => s.id === id);
  });

  if (!slider) return null;

  const gap = slider.gap ?? 10;
  const headerEnabled = slider.header?.enabled || false;
  const headerTitle = slider.header?.title || "";
  const padding = slider.padding || 10;
  const droppedContainers = slider.items || [];
  const width = slider.size?.width || 0;

  const containerCount = droppedContainers.length;

  const scrollToIndex = (index) => {
    if (containerRef.current) {
      const scrollPosition = index * (containerRef.current.offsetWidth + gap);
      containerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex);
    }
  };

  const handleNext = () => {
    if (currentIndex < containerCount - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex);
    }
  };

  return (
    <div
      style={{
        border: "2px solid #2196F3",
        borderRadius: "8px",
        backgroundColor: "rgba(33, 150, 243, 0.05)",
        overflow: "hidden",
        position: "relative",
        width: width > 0 ? `${width}px` : "100%",
      }}
    >
      {headerEnabled && (
        <div style={{ padding: `${padding}px`, fontSize: "18px", fontWeight: "bold" }}>
          <Newsheader name={headerTitle || "Slider Header"} />
        </div>
      )}

      <div style={{ padding: `${padding}px`, position: "relative" }}>
        {droppedContainers.length === 0 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "150px",
              color: "#999",
              fontSize: "14px",
            }}
          >
            No content
          </div>
        ) : (
          <>
            <div
              ref={containerRef}
              style={{
                display: "flex",
                gap: `${gap}px`,
                overflowX: "auto",
                scrollBehavior: "smooth",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <style>
                {`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}
              </style>
              {droppedContainers.map((item) => {
                const Component = COMPONENT_MAP[item.containerType];
                if (!Component) return null;

                // FIXED: Pass newsId instead of slotId to the news container components
                return (
                  <div
                    key={item.slotId}
                    style={{
                      minWidth: "100%",
                      flexShrink: 0,
                    }}
                  >
                    <Component
                      newsId={item.newsId}  
                      border={false}
                      version={item.version || 1}  
                    />
                  </div>
                );
              })}
            </div>

            {containerCount > 1 && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "10px",
                  right: "10px",
                  transform: "translateY(-50%)",
                  display: "flex",
                  justifyContent: "space-between",
                  pointerEvents: "none",
                }}
              >
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  style={{
                    backgroundColor: "rgba(33, 150, 243, 0.9)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                    opacity: currentIndex === 0 ? 0.3 : 1,
                    pointerEvents: "auto",
                    transition: "opacity 0.2s",
                  }}
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentIndex === containerCount - 1}
                  style={{
                    backgroundColor: "rgba(33, 150, 243, 0.9)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: currentIndex === containerCount - 1 ? "not-allowed" : "pointer",
                    opacity: currentIndex === containerCount - 1 ? 0.3 : 1,
                    pointerEvents: "auto",
                    transition: "opacity 0.2s",
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {containerCount > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "6px",
                  marginTop: "12px",
                }}
              >
                {droppedContainers.map((_, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                      scrollToIndex(index);
                    }}
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: index === currentIndex ? "#2196F3" : "#ccc",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}