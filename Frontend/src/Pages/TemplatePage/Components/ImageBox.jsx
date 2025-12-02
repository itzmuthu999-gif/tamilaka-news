import React from 'react'
import { useState } from 'react';
import { FaCheck, FaEdit, FaTimes } from "react-icons/fa";

import { Rnd } from "react-rnd";

export default function ImageBox({ id, onDelete, onUpdate, initialContent, box }) {
  const [image, setImage] = useState(initialContent || null);
  const [editing, setEditing] = useState(!initialContent);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
      setEditing(false);
      onUpdate(id, { content: url });
    }
  };

  return (
    <Rnd
      bounds="parent"
      // CONTROLLED MODE
      position={{ x: box.x, y: box.y }}
      size={{ width: box.width, height: box.height }}
      minWidth={150}
      minHeight={100}
      onDrag={(e, data) => {
        onUpdate(id, { x: data.x, y: data.y, dragging: true });
      }}

      onDragStop={(e, data) => {
        onUpdate(id, { x: data.x, y: data.y, dragging: false });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        onUpdate(id, {
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          x: position.x,
          y: position.y
        });
      }}
      style={{
        border: "2px dashed #555",
        background: "#fdfdfd",
        borderRadius: "8px",
        padding: "8px",
        position: "absolute"
      }}
    >
      <FaTimes
        color="red"
        style={{
          position: "absolute",
          top: 1,
          right: 5,
          background: "rgba(255, 235, 235, 1)",
          padding: "4px",
          borderRadius: "100%",
          cursor: "pointer",
          boxShadow: "0 0 8px rgba(0,0,0,0.2)",
          fontSize: "23px",
          zIndex: 99
        }}
        onDoubleClick={() => onDelete(id)}
      />

      {editing ? (
        <input type="file" accept="image/*" onChange={handleImageChange} />
      ) : (
        <div style={{ position: "relative" }}>
          <img
            src={image}
            alt="uploaded"
            style={{ width: "100%", height: "100%", borderRadius: "8px", objectFit: "cover" }}
          />
          <FaEdit
            style={{
              position: "absolute",
              cursor: "pointer",
              top: -5,
              right: 25,
              background: "rgba(238, 255, 232, 1)",
              padding: "4px",
              borderRadius: "100%",
              boxShadow: "0 0 8px rgba(0,0,0,0.2)",
              fontSize: "23px",
              color: "green"
            }}
            onClick={() => setEditing(true)}
          />
        </div>
      )}
    </Rnd>
  );
}
