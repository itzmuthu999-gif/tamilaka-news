import React from "react";
import { Rnd } from "react-rnd";
import { useDispatch } from "react-redux";
import {
  updateLinePosition,
  updateLineLength,
  deleteLine,
  setActiveLine,
} from "../../Slice/editpaperSlice/editpaperslice";


export default function EditableLine({
  id,
  lineType,
  orientation,
  length,
  x,
  y,
  catName,
  isActive,
  containerId,
  parentContainerId,
}) {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setActiveLine({ lineId: id }));
  };

  const handleDelete = (e) => {
    if (e.detail === 2) {
      e.stopPropagation();
      dispatch(deleteLine({ catName, lineId: id, containerId, parentContainerId }));
    }
  };

  // Line styles based on type
  const getLineStyle = () => {
    const baseStyle = {
      position: "absolute",
      cursor: "pointer",
    };

    if (lineType === "pink-bold") {
      return {
        ...baseStyle,
        backgroundColor: "#e91e63",
        ...(orientation === "horizontal"
          ? { width: `${length}px`, height: "2px" }
          : { width: "2px", height: `${length}px` }),
      };
    } else {
      // light-grey
      return {
        ...baseStyle,
        backgroundColor: "#d0d0d0",
        ...(orientation === "horizontal"
          ? { width: `${length}px`, height: "2px" }
          : { width: "2px", height: `${length}px` }),
      };
    }
  };

  return (
    <Rnd
      size={
        orientation === "horizontal"
          ? { width: length, height: 2 }
          : { width: 2, height: length }
      }
      position={{ x, y }}
      enableResizing={
        orientation === "horizontal"
          ? {
              top: false,
              right: true,
              bottom: false,
              left: true,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false,
            }
          : {
              top: true,
              right: false,
              bottom: true,
              left: false,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false,
            }
      }
      bounds="parent"
      onDragStop={(e, d) => {
        dispatch(
          updateLinePosition({
            catName,
            lineId: id,
            x: d.x,
            y: d.y,
            containerId,
            parentContainerId,
          })
        );
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        const newLength =
          orientation === "horizontal"
            ? ref.offsetWidth
            : ref.offsetHeight;

        dispatch(
          updateLineLength({
            catName,
            lineId: id,
            length: newLength,
            containerId,
            parentContainerId,
          })
        );

        dispatch(
          updateLinePosition({
            catName,
            lineId: id,
            x: position.x,
            y: position.y,
            containerId,
            parentContainerId,
          })
        );
      }}
      style={{
        border: isActive ? "1px dashed #2196F3" : "none",
        zIndex: isActive ? 1000 : 1,
      }}
    >
      <div
        onClick={handleClick}
        onDoubleClick={handleDelete}
        style={getLineStyle()}
        title="Click to select, Double-click to delete"
      />
    </Rnd>
  );
}
