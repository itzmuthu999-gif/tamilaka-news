import React from "react";
import { useSelector } from "react-redux";

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
import PreviewSlider from "./PreviewSlider";
import PreviewLine from "./PreviewLine";

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

export default function PreviewContainer({ 
  id, 
  catName,
  isNested = false,
  parentContainerId = null,
}) {
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

  if (!containerData) return null;

  const grid = containerData.grid || { columns: 2, gap: 10 };
  const headerEnabled = containerData.header?.enabled || false;
  const headerTitle = containerData.header?.title || "";
  const spacing = containerData.spacing || { padding: 10, margin: 0 };
  const nestedContainers = containerData.nestedContainers || [];
  const items = containerData.items || [];
  const sliders = containerData.sliders || [];
  const lines = containerData.lines || [];

  return (
    <div 
      style={{ 
        border: isNested ? "2px dashed #ff9800" : "2px solid #ccc",
        borderRadius: "8px",
        backgroundColor: isNested ? "rgba(255, 152, 0, 0.05)" : "#fff",
        overflow: "visible",
        margin: `${spacing.margin}px 0`,
        position: "relative",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {headerEnabled && (
        <div style={{ 
          padding: `${spacing.padding}px`, 
          fontSize: "18px", 
          fontWeight: "bold"
        }}>
          <Newsheader name={headerTitle || (isNested ? "Nested Header" : "Header")} />
        </div>
      )}

      <div 
        style={{ 
          flex: 1, 
          position: "relative", 
          overflow: "visible", 
          padding: `${spacing.padding}px`, 
          minHeight: nestedContainers.length === 0 && items.length === 0 && sliders.length === 0 ? "150px" : "fit-content" 
        }}
      >
        {nestedContainers.length === 0 && items.length === 0 && sliders.length === 0 && (
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            height: "100%", 
            color: "#999", 
            fontSize: "14px", 
            textAlign: "center", 
            padding: "20px" 
          }}>
            No content
          </div>
        )}

        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: `repeat(${grid.columns}, 1fr)`, 
            gap: `${grid.gap}px`, 
            width: "100%",
            position: "relative"
          }}
        >
          {(() => {
            const extractTimestamp = (item) => {
              if (item.slotId) {
                const match = item.slotId.match(/slot_(\d+)/);
                return match ? parseInt(match[1]) : 0;
              }
              if (item.id) {
                const match = item.id.toString().match(/_(\d+)$/);
                return match ? parseInt(match[1]) : 0;
              }
              return 0;
            };

            const allElements = [
              ...items.map(item => ({ 
                type: 'item', 
                data: item, 
                timestamp: extractTimestamp(item)
              })),
              ...nestedContainers.map(nested => ({ 
                type: 'nested', 
                data: nested, 
                timestamp: extractTimestamp(nested)
              })),
              ...sliders.map(slider => ({ 
                type: 'slider', 
                data: slider, 
                timestamp: extractTimestamp(slider)
              }))
            ];
            
            allElements.sort((a, b) => a.timestamp - b.timestamp);
            
            return allElements.map((element, index) => {
              if (element.type === 'item') {
                const item = element.data;
                const Component = COMPONENT_MAP[item.containerType];
                if (!Component) return null;
                
                return (
                  <div 
                    key={item.slotId} 
                    style={{ 
                      position: "relative",
                      zIndex: 10 + index
                    }}
                  >
                    <Component 
                      border={false}
                      slotId={item.slotId} 
                      catName={catName} 
                      containerId={id}
                      isNested={isNested}
                      parentContainerId={parentContainerId}
                      isPreview={true}
                    />
                  </div>
                );
              } else if (element.type === 'nested') {
                const nested = element.data;
                return (
                  <div 
                    key={nested.id} 
                    style={{ 
                      position: "relative",
                      zIndex: 10 + index
                    }}
                  >
                    <PreviewContainer
                      id={nested.id}
                      catName={catName}
                      isNested={true}
                      parentContainerId={id}
                    />
                  </div>
                );
              } else if (element.type === 'slider') {
                const slider = element.data;
                return (
                  <div
                    key={slider.id}
                    style={{
                      position: "relative",
                      zIndex: 10 + index,
                      width: "100%",
                      height: "fit-content"
                    }}
                  >
                    <PreviewSlider
                      id={slider.id}
                      catName={catName}
                      containerId={id}
                      isNested={isNested}
                      parentContainerId={parentContainerId}
                    />
                  </div>
                );
              }
              return null;
            });
          })()}
        </div>

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
      </div>
    </div>
  );
}
