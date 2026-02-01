import React from 'react'
import { useState, useEffect } from 'react';
import { FaCheck, FaEdit, FaTimes } from "react-icons/fa";
import { Rnd } from "react-rnd";

export default function ParagraphBox({ id, onDelete, onUpdate, initialContent, box, isInContainer = false, contentKey = "content" }) {
  const [text, setText] = useState(initialContent || "");
  const [editing, setEditing] = useState(true);
  
  useEffect(() => {
    setText(initialContent || "");
  }, [initialContent, contentKey]);

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("boxId", id.toString());
    e.dataTransfer.setData("boxType", "paragraph");
  };

  useEffect(() => {
    onUpdate(id, { [contentKey]: text });
  }, [text]);
   
  if (isInContainer) {
    return (
      <div
        style={{
          border: "2px dashed #555",
          background: "#fff",
          borderRadius: "8px",
          padding: "8px",
          position: "relative",
          width: "100%",
          minHeight: "100px"
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
            fontSize: "23px",
            zIndex: 10
          }}
          onDoubleClick={() => onDelete(id)}
        />

        {editing ? (
          <div style={{ display: "flex", gap: "6px" }}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text..."
              style={{ width: "100%", height: "100px", resize: "vertical" }}
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
                fontSize: "23px",
                zIndex: 10
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
                color: "green",
                zIndex: 10
              }}
              onClick={() => setEditing(true)}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
    style={{
      border: "2px dashed #555",
      background: "#fff",
      borderRadius: "8px",
      padding: "8px",
      position: "relative",
      width: "100%",
      minHeight: "150px"
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
    </div>
  );
}