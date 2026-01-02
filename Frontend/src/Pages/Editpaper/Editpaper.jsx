import React, { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiWorld } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiMiniMoon } from "react-icons/hi2";
import { AiFillGitlab } from "react-icons/ai";
import NewsFilter from "./Components/NewsFilter";
import PageEditor from "./Components/PageEditor";
import  EditableContainer  from "./Components/EditableContainer";

import { EditableSlider } from "./Components/EditableSlider";
import { EditableSlider2 } from "./Components/EditableSlider2";
import EditableLine from "./Containers_/EditableLine";
import logo from "../../assets/logo.png";

import { useDispatch, useSelector } from "react-redux";
import { 
  addContainer,
  // deleteContainer,
  addSlider,
} from "../Slice/editpaperslice";

import "./editpapercss.scss";
import { BiCube } from "react-icons/bi";

export default function Editpaper() {
  const dispatch = useDispatch();
  const { pages, activePage, activeLineId } = useSelector(state => state.editpaper);

  const currentPage = pages.find(p => p.catName === activePage);
  const containers = currentPage?.containers || [];
  const sliders = currentPage?.sliders || [];
  const lines = currentPage?.lines || []; // ✅ NEW

  const categories = ["Politics", "Sports", "Cinema", "Weather", "Astrology", "Kids"];
  const [showEditor, setShowEditor] = useState(false);
  const [edContHeight, setEdContHeight] = useState(600);
  const [nextId, setNextId] = useState(1);
  const [showNewsFilter, setShowNewsFilter] = useState(false);

  const handleAddContainer = () => {
    dispatch(addContainer(activePage, { x: 50, y: 50 }));
    setNextId(nextId + 1);
  };

  const handleAddSlider = () => {
    dispatch(addSlider(activePage, { x: 50, y: 100 }, "type1"));
    setNextId(nextId + 1);
  };

  const handleAddSlider2 = () => {
    dispatch(addSlider(activePage, { x: 50, y: 150 }, "type2"));
    setNextId(nextId + 1);
  };

  // const handleDeleteContainer = (id) => {
  //   dispatch(deleteContainer({ catName: activePage, containerId: id }));
  // };

  return (
    <div>
      <PageEditor 
        open={showEditor} 
        onClose={() => setShowEditor(false)} 
        categories={categories}
        onHeightChange={setEdContHeight}
        onAddContainer={handleAddContainer}
        onAddSlider={handleAddSlider}
        onAddSlider2={handleAddSlider2}
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

      <div className="navcon1">
        <div className="navcon2">
          <div className="nav-c1">
            <div className="nav-c1-date">வியாழன் அக்டோபர் 30 2025</div>
            <div className="nav-c1-logo">
              <img src={logo} alt="alt" />
            </div>
            <div className="nav-c1-links">
              <div>
                <IoSearchSharp />
              </div>
              <div>
                <IoMdNotificationsOutline />
              </div>
              <div>
                <BiWorld />
              </div>
            </div>
          </div>

          <div className="nav-c2-line"></div>

          <div className="nav-c3">
            <div className="nav-c3-ham">
              <GiHamburgerMenu />
            </div>
            <div className="nav-c3-sections">
              <div>அரசியல்</div>
              <div>உலகம்</div>
              <div>இந்தியா</div>
              <div>தமிழக நியூஸ்</div>
              <div>மாவட்டம்</div>
              <div>விளையாட்டு</div>
              <div>ட்ரெண்டிங்</div>
            </div>
            <div className="nav-c3-dm">
              <HiMiniMoon />
            </div>
          </div>
        </div>
      </div>

      <div className="ep-main-ed-cont">
        <div className="ep-ed-cont" style={{ height: `${edContHeight}px` }}>
          {/* RENDER CONTAINERS */}
          {containers.map((container) => (
            <EditableContainer
              key={container.id}
              id={container.id}
              catName={activePage}
              position={container.position}
              size={container.size}
              grid={container.grid}
              items={container.items}
            />
          ))}

          {/* RENDER SLIDERS */}
          {sliders.map((slider) => {
            if (slider.type === "type1") {
              return (
                <EditableSlider
                  key={slider.id}
                  id={slider.id}
                  catName={activePage}
                  position={slider.position}
                  size={slider.size}
                  gap={slider.gap}
                />
              );
            }
            
            if (slider.type === "type2") {
              return (
                <EditableSlider2
                  key={slider.id}
                  id={slider.id}
                  catName={activePage}
                  position={slider.position}
                  size={slider.size}
                  gap={slider.gap}
                />
              );
            }
            
            return null;
          })}

          {/* ✅ RENDER LINES */}
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

          {containers.length === 0 && sliders.length === 0 && lines.length === 0 && (
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}></div>
          )}

          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}></div>
        </div>
      </div>
    </div>
  );
}