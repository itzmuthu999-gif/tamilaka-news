import React from 'react'
import { useState,useEffect } from 'react';
import { FaCheck, FaEdit, FaTimes } from "react-icons/fa";
import { Rnd } from "react-rnd";

export default function ParagraphBox({ id, onDelete, onUpdate, initialContent, box }) {
  const [text, setText] = useState(initialContent || "");
  const [editing, setEditing] = useState(true);

  useEffect(() => {
    onUpdate(id, { content: text });
  }, [text]);

  return (
    <Rnd
      bounds="parent"
      // CONTROLLED MODE
      position={{ x: box.x, y: box.y }}
      size={{ width: box.width, height: box.height }}
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
        background: "#fff",
        borderRadius: "8px",
        padding: "8px",
        position: "absolute"   // VERY IMPORTANT
      }}
    >
      <FaTimes
        color="red"
        className="para-cls-btn"
        style={{
          position: "absolute",
          top: 1,
          right: 5,
          background: "white",
          padding: "4px",
          borderRadius: "100%",
          cursor: "pointer",
          boxShadow: "0 0 8px rgba(0,0,0,0.2)",
          fontSize: "23px"
        }}
        onDoubleClick={() => onDelete(id)}
      />

      {editing ? (
        <div style={{ display: "flex", gap: "6px" }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text..."
            style={{ width: "100%", height: "200px" }}
          />
          <FaCheck
            color="green"
            style={{
              position: "absolute",
              cursor: "pointer",
              top: 1,
              right: 30,
              background: "rgba(238, 255, 232, 1)",
              padding: "5px",
              borderRadius: "100%",
              boxShadow: "0 0 8px rgba(0,0,0,0.2)",
              fontSize: "23px"
            }}
            onClick={() => setEditing(false)}
          />
        </div>
      ) : (
        <div>
          <p style={{ whiteSpace: "pre-wrap" }}>{text}</p>
          <FaEdit
            style={{
              position: "absolute",
              cursor: "pointer",
              top: 1,
              right: 30,
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
