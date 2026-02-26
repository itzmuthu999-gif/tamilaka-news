import React from "react";
import { useSelector } from "react-redux";

const PreviewEditableLine = ({
  catName,
  containerId,
  parentContainerId = null,
}) => {
  const lines = useSelector((state) => {
    const page = state.editpaper.pages.find((p) => p.catName === catName);
    if (!page) return [];

    if (parentContainerId) {
      const nestedCont = page.containers
        ?.find((c) => c.id === parentContainerId)
        ?.nestedContainers?.find((nc) => nc.id === containerId);
      return nestedCont?.lines || [];
    } else {
      const container = page.containers?.find((c) => c.id === containerId);
      return container?.lines || [];
    }
  });

  if (!lines.length) return null;

  return (

    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      {lines.map((line) => {
        const isHorizontal = line.orientation === "horizontal";
        const bg = line.lineType === "pink-bold" ? "#e91e63" : "#d0d0d0";
        const width = isHorizontal ? `${line.length}px` : "2px";
        const height = isHorizontal ? "2px" : `${line.length}px`;

        return (
          <div
            key={line.id}
            style={{
              position: "absolute",
              left: line.x,
              top: line.y,
              width,
              height,
              backgroundColor: bg,
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        );
      })}
    </div>
  );
};

export default PreviewEditableLine;