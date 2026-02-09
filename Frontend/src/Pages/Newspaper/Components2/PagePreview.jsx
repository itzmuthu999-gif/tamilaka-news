import React from "react";
import { useSelector } from "react-redux";
import PreviewContainer from "./PreviewContainer";
import PreviewSlider from "./PreviewSlider";
import PreviewLine from "./PreviewLine";

export default function PagePreview({ pageName = "main" }) {
  const currentPage = useSelector(state => 
    state.editpaper.pages.find(p => p.catName === pageName)
  );

  if (!currentPage) {
    return (
      <div style={{ 
        padding: "40px", 
        textAlign: "center",
        color: "#999",
        fontSize: "16px"
      }}>
        No content available for this page
      </div>
    );
  }

  const containers = currentPage.containers || [];
  const sliders = currentPage.sliders || [];
  const lines = currentPage.lines || [];
  const pageSettings = currentPage.settings || { 
    height: 600, 
    gridColumns: 12, 
    gap: 10, 
    padding: 20 
  };

  return (
    <div 
      style={{ 
        height: `${pageSettings.height}px`,
        padding: `${pageSettings.padding}px`,
        position: 'relative',
        overflow: 'visible',
        width: '100%',
        maxWidth: '1250px',
        margin: '0 auto'
      }}
    >
      {/* Main grid for containers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${pageSettings.gridColumns}, 1fr)`,
          gap: `${pageSettings.gap}px`,
          width: '100%',
          marginBottom: `${pageSettings.gap}px`,
          position: 'relative',
          zIndex: 1
        }}
      >
        {containers.map((container) => (
          <PreviewContainer
            key={container.id}
            id={container.id}
            catName={pageName}
          />
        ))}
      </div>

      {/* Page-level sliders */}
      {sliders.map((slider) => (
        <div
          key={slider.id}
          style={{
            marginBottom: `${pageSettings.gap}px`,
            position: 'relative',
            zIndex: 2
          }}
        >
          <PreviewSlider
            id={slider.id}
            catName={pageName}
            containerId={null}
            isNested={false}
            parentContainerId={null}
          />
        </div>
      ))}

      {/* Lines */}
      {lines.map((line) => (
        <PreviewLine
          key={line.id}
          lineType={line.lineType}
          orientation={line.orientation}
          length={line.length}
          x={line.x}
          y={line.y}
        />
      ))}

      {/* Empty state */}
      {containers.length === 0 && sliders.length === 0 && lines.length === 0 && (
        <div style={{ 
          padding: "40px", 
          textAlign: "center",
          color: "#999",
          fontSize: "16px"
        }}>
          No content has been added to this page yet
        </div>
      )}
    </div>
  );
}
