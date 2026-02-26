import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";

import PreviewBigContainer1 from "../PreviewContainers/PreviewBigContainer1";
import PreviewBigContainer2 from "../PreviewContainers/PreviewBigContainer2";
import PreviewBigContainer3 from "../PreviewContainers/PreviewBigContainer3";
import PreviewBigContainer4 from "../PreviewContainers/PreviewBigContainer4";
import PreviewBigContainer4A from "../PreviewContainers/PreviewBigContainer4A";
import PreviewBigContainer5 from "../PreviewContainers/PreviewBigContainer5";

import PreviewNorContainer1 from "../PreviewContainers/PreviewNorContainer1";
import PreviewNorContainer2 from "../PreviewContainers/PreviewNorContainer2";
import PreviewNorContainer3 from "../PreviewContainers/PreviewNorContainer3";
import PreviewNorContainer4 from "../PreviewContainers/PreviewNorContainer4";
import PreviewNorContainer4A from "../PreviewContainers/PreviewNorContainer4A";
import PreviewNorContainer4B from "../PreviewContainers/PreviewNorContainer4B";
import PreviewNorContainer5 from "../PreviewContainers/PreviewNorContainer5";
import PreviewUniversalNewsContainer from "../PreviewContainers/PreviewUniversalNewsContainer";

import Newsheader from "../Components/Newsheader";

const COMPONENT_MAP = {
  "Universal Container": PreviewUniversalNewsContainer,
  "Big Container Type 1": PreviewBigContainer1,
  "Big Container Type 2": PreviewBigContainer2,
  "Big Container Type 3": PreviewBigContainer3,
  "Big Container Type 4": PreviewBigContainer4,
  "Big Container Type 4A": PreviewBigContainer4A,
  "Big Container Type 5": PreviewBigContainer5,
  "Normal Container Type 1": PreviewNorContainer1,
  "Normal Container Type 2": PreviewNorContainer2,
  "Normal Container Type 3": PreviewNorContainer3,
  "Normal Container Type 4": PreviewNorContainer4,
  "Normal Container Type 4A": PreviewNorContainer4A,
  "Normal Container Type 4B": PreviewNorContainer4B,
  "Normal Container Type 5": PreviewNorContainer5,
};

export default function PreviewSlider({
  id,
  catName,
  containerId,
  isNested = false,
  parentContainerId = null,
}) {
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);

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

  const sliderType = slider.type || "type1";
  const gap = slider.gap ?? 10;
  const headerEnabled = slider.header?.enabled || false;
  const headerTitle = slider.header?.title || "";
  const padding = slider.padding || 10;
  const droppedContainers = slider.items || [];
  const width = slider.size?.width || 0;

  const containerCount = droppedContainers.length;

  // Calculate container width for horizontal slider
  useEffect(() => {
    if (sliderType === "type2" && droppedContainers.length > 0 && scrollContainerRef.current) {
      const firstChild = scrollContainerRef.current.children[0];
      if (firstChild) {
        const childWidth = firstChild.offsetWidth;
        setContainerWidth(childWidth + gap);
      }
    }
  }, [droppedContainers, gap, sliderType]);

  // Carousel slider (type1) functions - fade transition
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setFadeKey(prev => prev + 1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNextCarousel = () => {
    if (currentIndex < containerCount - 1) {
      setFadeKey(prev => prev + 1);
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Horizontal slider (type2) functions
  const slideLeft = () => {
    if (scrollContainerRef.current && containerWidth > 0) {
      const newTranslate = Math.min(0, translateX + containerWidth);
      setTranslateX(newTranslate);
    }
  };

  const slideRight = () => {
    if (scrollContainerRef.current && containerRef.current && containerWidth > 0) {
      const scrollWidth = scrollContainerRef.current.scrollWidth;
      const visibleWidth = containerRef.current.offsetWidth;
      const maxScroll = -(scrollWidth - visibleWidth);
      const newTranslate = Math.max(maxScroll, translateX - containerWidth);
      setTranslateX(newTranslate);
    }
  };

  const canSlideLeft = translateX < 0;
  const canSlideRight = (() => {
    if (!scrollContainerRef.current || !containerRef.current) return false;
    const scrollWidth = scrollContainerRef.current.scrollWidth;
    const visibleWidth = containerRef.current.offsetWidth;
    return translateX > -(scrollWidth - visibleWidth);
  })();
  const showNavigation = droppedContainers.length > 1;

  // Render carousel slider (type1)
  if (sliderType === "type1") {
    return (
      <div
        style={{
          // border: "2px solid #2196F3",
          // borderRadius: "8px",
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
              {/* Content area — height fits content, no forced minHeight */}
              <div
                style={{
                  width: "100%",
                  position: "relative",
                }}
              >
                <div
                  key={`${droppedContainers[currentIndex]?.slotId}-${fadeKey}`}
                  style={{
                    animation: "fadeIn 0.5s ease-in-out",
                  }}
                >
                  <style>
                    {`
                      @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                      }
                    `}
                  </style>
                  {(() => {
                    const item = droppedContainers[currentIndex];
                    if (!item) return null;
                    
                    const Component = COMPONENT_MAP[item.containerType];
                    if (!Component) return null;

                    if (item.containerType === "Universal Container") {
                      return (
                        <Component
                          catName={catName}
                          containerId={containerId}
                          slotId={item.slotId}
                          sliderId={id}
                          isSlider={true}
                          isNested={isNested}
                          parentContainerId={parentContainerId}
                        />
                      );
                    }

                    return (
                      <Component
                        newsId={item.newsId}
                        version={item.shfval ?? 1}
                        showSeparator={item.showSeparator || false}
                        slotId={item.slotId}
                        catName={catName}
                        containerId={containerId}
                        isSlider={true}
                        isNested={isNested}
                        parentContainerId={parentContainerId}
                      />
                    );
                  })()}
                </div>

                {/* Nav buttons — absolutely positioned over content, no extra bottom space */}
                {containerCount > 1 && (
                  <>
                    <button
                      onClick={handlePrevious}
                      disabled={currentIndex === 0}
                      style={{
                        position: "absolute",
                        left: "8px",
                        top: "50%",
                        transform: "translateY(-50%)",
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
                        zIndex: 10,
                      }}
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <button
                      onClick={handleNextCarousel}
                      disabled={currentIndex === containerCount - 1}
                      style={{
                        position: "absolute",
                        right: "8px",
                        top: "50%",
                        transform: "translateY(-50%)",
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
                        zIndex: 10,
                      }}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Dot indicators — compact, no extra margin */}
              {containerCount > 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "6px",
                    marginTop: "8px",
                  }}
                >
                  {droppedContainers.map((_, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setFadeKey(prev => prev + 1);
                        setCurrentIndex(index);
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

  // Render horizontal slider (type2)
  return (
    <div
      ref={containerRef}
      style={{
        borderRadius: "8px",
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
          <div
            style={{
              width: "100%",
              height: "auto",
    
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
                    style={{ flexShrink: 0 }}
                  >
                    {container.containerType === "Universal Container" ? (
                      <Component
                        catName={catName}
                        containerId={containerId}
                        slotId={container.slotId}
                        sliderId={id}
                        isSlider2={true}
                        isNested={isNested}
                        parentContainerId={parentContainerId}
                      />
                    ) : (
                      <Component
                        newsId={container.newsId}
                        version={container.shfval ?? 1}
                        showSeparator={container.showSeparator || false}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {showNavigation && (
              <>
                <button
                  onClick={slideLeft}
                  disabled={!canSlideLeft}
                  style={{
                    position: "absolute",
                    left: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: canSlideLeft ? "#ff4da6" : "#ccc",
                    border: "none",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: canSlideLeft ? "pointer" : "not-allowed",
                    zIndex: 100,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <ChevronLeft size={20} color="white" />
                </button>

                <button
                  onClick={slideRight}
                  disabled={!canSlideRight}
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: canSlideRight ?   " #ff4da6" : "#ccc",
                    border: "none",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: canSlideRight ? "pointer" : "not-allowed",
                    zIndex: 100,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <ChevronRight size={20} color="white" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}