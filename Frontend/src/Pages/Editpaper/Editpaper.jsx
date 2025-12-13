import React, { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiWorld } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiMiniMoon } from "react-icons/hi2";
import { AiFillGitlab } from "react-icons/ai";
import NewsFilter from "./Components/NewsFilter";
import PageEditor from "./Components/PageEditor";
import { EditableContainer } from "./Components/EditableContainer";
import logo from "../../assets/logo.png";
import bcs from "./../../assets/bcs.jpg";
import jwt from "./../../assets/jwt.jpg";
import "./editpapercss.scss";
import { BiCube } from "react-icons/bi";
import PerfectSlider from "./Containers_/PerfectSlider";

export default function Editpaper() {
  const categories = ["Politics", "Sports", "Cinema", "Weather", "Astrology", "Kids"];
  const [showEditor, setShowEditor] = useState(false);
  const [edContHeight, setEdContHeight] = useState(600);
  const [containers, setContainers] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [showNewsFilter, setShowNewsFilter] = useState(false);

  const handleAddContainer = () => {
    const newContainer = {
      id: nextId,
      position: { x: 50, y: 50 + containers.length * 50 }
    };
    setContainers([...containers, newContainer]);
    setNextId(nextId + 1);
  };

  const handleDeleteContainer = (id) => {
    setContainers(containers.filter((c) => c.id !== id));
  };

  return (
    <div>
<PageEditor 
  open={showEditor} 
  onClose={() => setShowEditor(false)} 
  categories={categories}
  onHeightChange={setEdContHeight}
  onAddContainer={handleAddContainer}
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
            <div className="nav-c1-date">வியாக்ழன் அக்டோபர் 30 2025</div>
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

      <div className="break-news">
        <p>
          சென்னை விமான நிலையத்தில் பாதுகாப்பு சோதனை தீவிரம் | டெல்லியில் மழை வெள்ளம் – போக்குவரத்து பாதிப்பு | பெங்களூருவில் பெரிய IT நிறுவனத்தில் திடீர் பணிநீக்கம் | தமிழகத்தில் இன்று மின்தடை அறிவிப்பு | கோவை அருகே வெடிகுண்டு பரபரப்பு – போலீஸ் விசாரணை தொடக்கம் | பங்குச்சந்தை சரிவு – முதலீட்டாளர்கள் அதிர்ச்சி
        </p>
      </div>

      <div className="ep-main-ed-cont">
        <div className="ep-ed-cont" style={{ height: `${edContHeight}px` }}>
          {containers.map((container) => (
            <EditableContainer
              key={container.id}
              id={container.id}
              initialPosition={container.position}
              onDelete={handleDeleteContainer}
            />
          ))}

          {containers.length === 0 && (
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}></div>
          )}

          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}></div>
        </div>
      </div>
    </div>
  );
}