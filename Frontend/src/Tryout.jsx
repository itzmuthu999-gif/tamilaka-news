import { useState } from "react";
function Container({ title, items, onDragStart, onDrop }) {
  return (
    <div
      onDragOver={(e) => e.preventDefault()} // required to allow drop
      onDrop={onDrop}
      style={{
        width: 200,
        minHeight: 200,
        border: "2px dashed gray",
        padding: 12
      }}
    >
      <h3>{title}</h3>

      {items.map(item => (
        <div
          key={item.id}
          draggable
          onDragStart={() => onDragStart(item)}
          style={{
            padding: 8,
            marginBottom: 6,
            background: "#eee",
            cursor: "grab"
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}

export default function Tryout() {
  const [left, setLeft] = useState([
    { id: 1, text: "Item A" },
    { id: 2, text: "Item B" }
  ]);

  const [right, setRight] = useState([
    { id: 3, text: "Item C" }
  ]);

  // temporarily stores dragged item info
  const [dragged, setDragged] = useState(null); 
  // { item, source }

  const dropTo = (target) => {
    if (!dragged || dragged.source === target) return;

    const remove = (list, id) =>
      list.filter(item => item.id !== id);

    if (dragged.source === "left") {
      setLeft(l => remove(l, dragged.item.id));
      setRight(r => [...r, dragged.item]);
    } else {
      setRight(r => remove(r, dragged.item.id));
      setLeft(l => [...l, dragged.item]);
    }

    setDragged(null);
  };

  return (
    <div style={{ display: "flex", gap: 32 }}>
      <Container
        title="Left"
        items={left}
        onDragStart={(item) =>
          setDragged({ item, source: "left" })
        }
        onDrop={() => dropTo("left")}
      />

      <Container
        title="Right"
        items={right}
        onDragStart={(item) =>
          setDragged({ item, source: "right" })
        }
        onDrop={() => dropTo("right")}
      />
    </div>
  );
}
