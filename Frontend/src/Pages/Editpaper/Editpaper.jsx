import React, { useEffect, useRef, useState } from "react";
import { AiFillGitlab } from "react-icons/ai";
import { BiCube } from "react-icons/bi";
import NewsFilter from "./Components/NewsFilter";
import PageEditor from "./Components/PageEditor";
import EditableContainer from "./Components/EditableContainer";
import EditorSettings from "./Components/EditorSettings";
import EditableLine from "./Containers_/EditableLine";
import Navbarr from "../Newspaper/Components/Navbarr";
import { saveLayout } from "../../Api/layoutApi";

import { useDispatch, useSelector } from "react-redux";
import { 
  addContainer,
  addLine,
} from "../Slice/editpaperSlice/editpaperslice";

import "./editpapercss.scss";

export default function Editpaper() {
  const dispatch = useDispatch();
  const layoutState = useSelector(state => state.editpaper);
  const { pages, activePage, activeLineId, hydrated } = layoutState;

  const saveTimeoutRef = useRef(null);
  const skipFirstSaveRef = useRef(true);

  const currentPage = pages.find(p => p.catName === activePage);
  const containers = currentPage?.containers || [];
  const lines = currentPage?.lines || [];
  const pageSettings = currentPage?.settings || { height: 600, gridColumns: 12, gap: 10, padding: 20 };

  const categories = ["Politics", "Sports", "Cinema", "Weather", "Astrology", "Kids"];
  const [showEditor, setShowEditor] = useState(false);
  const [nextId, setNextId] = useState(1);
  const [showNewsFilter, setShowNewsFilter] = useState(false);

  const buildLayoutPayload = (state) => ({
    pages: state.pages,
    presetContainers: state.presetContainers,
    activePage: state.activePage,
    activeLineId: state.activeLineId
  });

  const hasLayoutContent = (payload) => {
    if (payload.presetContainers?.length) return true;
    return payload.pages?.some((page) =>
      (page.containers && page.containers.length > 0) ||
      (page.lines && page.lines.length > 0) ||
      (page.sliders && page.sliders.length > 0)
    );
  };

  useEffect(() => {
    if (!hydrated) return;

    const token = localStorage.getItem("userToken");
    if (!token) return;

    const payload = buildLayoutPayload(layoutState);

    if (skipFirstSaveRef.current) {
      skipFirstSaveRef.current = false;
      if (!hasLayoutContent(payload)) return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveLayout(payload).catch((error) => {
        console.error("Auto-save failed:", error);
      });
    }, 600);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [layoutState, hydrated]);

  const handleCanvasDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isContainerOverlay = e.dataTransfer.getData("containerOverlay");
    const lineType = e.dataTransfer.getData("lineType");
    const lineOrientation = e.dataTransfer.getData("lineOrientation");
    
    if (lineType && lineOrientation) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      dispatch(addLine(activePage, lineType, lineOrientation, { x, y }));
      return;
    }
    
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
