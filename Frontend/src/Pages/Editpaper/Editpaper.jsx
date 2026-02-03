import React, { useState } from "react";
import { AiFillGitlab } from "react-icons/ai";
import { BiCube } from "react-icons/bi";
import NewsFilter from "./Components/NewsFilter";
import PageEditor from "./Components/PageEditor";
import EditableContainer from "./Components/EditableContainer";
import EditorSettings from "./Components/EditorSettings";
import EditableLine from "./Containers_/EditableLine";
import Navbarr from "../Newspaper/Components/Navbarr";

import { useDispatch, useSelector } from "react-redux";
import { 
  addContainer,
} from "../Slice/editpaperslice";

import "./editpapercss.scss";

export default function Editpaper() {
  const dispatch = useDispatch();
  const { pages, activePage, activeLineId } = useSelector(state => state.editpaper);

  const currentPage = pages.find(p => p.catName === activePage);
  const containers = currentPage?.containers || [];
  const lines = currentPage?.lines || [];
  const pageSettings = currentPage?.settings || { height: 600, gridColumns: 12, gap: 10, padding: 20 };

  const categories = ["Politics", "Sports", "Cinema", "Weather", "Astrology", "Kids"];
  const [showEditor, setShowEditor] = useState(false);
  const [nextId, setNextId] = useState(1);
  const [showNewsFilter, setShowNewsFilter] = useState(false);

  const handleCanvasDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isContainerOverlay = e.dataTransfer.getData("containerOverlay");
    
    if (isContainerOverlay === "true") {
      dispatch(addContainer(activePage));
      setNextId(nextId + 1);
      
      console.log("Container added to grid flow");
    }
  };

  const handleCanvasDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  };

  return (
    <div>
      <PageEditor 
        open={showEditor} 
        onClose={() => setShowEditor(false)} 
        categories={categories}
      />

      {!showEditor && (
        <button className="pageeditorbtn" onClick={() => setShowEditor(true)}>
          <AiFillGitlab />
        </button>
      )}

      <NewsFilter open={showNewsFilter} onClose={() => setShowNewsFilter(false)} />

      {!showNewsFilter && (
        <button className="pageeditorbtn2" onClick={() => setShowNewsFilter(true)}>
          <BiCube />
        </button>
      )}
      
      <div style={{marginLeft: "70px", width:"1400px"}}>
        <Navbarr/>
      </div>

      <div className="ep-main-ed-cont">
        <div 
          className="ep-ed-cont" 
          style={{ 
            height: `${pageSettings.height}px`,
            padding: `${pageSettings.padding}px`,
            position: 'relative',
            overflow: 'visible',
            width: '1250px',
            maxWidth: '1250px'
          }}
          onDrop={handleCanvasDrop}
          onDragOver={handleCanvasDragOver}
        >
          <EditorSettings />

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
              <EditableContainer
                key={container.id}
                id={container.id}
                catName={activePage}
                grid={container.grid}
                items={container.items}
              />
            ))}
          </div>

          {lines.map((line) => (
            <EditableLine
              key={line.id}
              id={line.id}
              lineType={line.lineType}
              orientation={line.orientation}
              length={line.length}
              x={line.x}
              y={line.y}
              catName={activePage}
              isActive={line.id === activeLineId}
            />
          ))}

          {containers.length === 0 && lines.length === 0 && (
            <div style={{ 
              padding: "40px", 
              textAlign: "center",
              color: "#999",
              fontSize: "16px"
            }}>
              Drop containers here or add sliders/lines from the Page Editor
            </div>
          )}
        </div>
      </div>
    </div>
  );
}