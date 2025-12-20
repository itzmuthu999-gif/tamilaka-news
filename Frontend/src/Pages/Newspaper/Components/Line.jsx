import React from "react";

export default function Line({
  direction = "H",   // "H" or "V"
  length = "100px",  // width for H, height for V
  thickness = "2px",
  color = "#000"
}) {
  const style =
    direction === "H"
      ? {
          width: length,
          height: thickness,
          backgroundColor: color,
          margin: "5px 0px"
        }
      : {
          height: length,
          width: thickness,
          backgroundColor: color,
          margin: "5px 0px"
        };

  return <div style={style} />;
}
