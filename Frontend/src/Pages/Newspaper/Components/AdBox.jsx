import React from "react";

const AdBox = ({ width, height, children }) => {
  return (
    <div
      style={{
        width: width,
        height: height,
        backgroundColor: "#e0e0e0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#888",
        fontSize: "14px",
        borderRadius: "4px",
      }}
    >
      {children || "Advertisement here"}
    </div>
  );
};

export default AdBox;
