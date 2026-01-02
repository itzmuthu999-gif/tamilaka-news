import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import logo from "../../../assets/logo1.png";
import { IoSearchSharp } from "react-icons/io5";
export default function Sidebar({ open, onClose }) {
  const [active, setActive] = useState(null);

  const toggle = (name) => {
    setActive(active === name ? null : name);
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div className="sb-overlay" onClick={onClose}></div>

      {/* Sidebar */}
      <div className="sb-container">
                    <div className="nav-c1-logo-v2" style={{position: "relative"}}>
                       <div className="nav-c1l-t1-v2" > <img src={logo}/></div>
                       <div className="nav-c1l-t2-v2" style={{position: "absolute", transform: "translateY(20px)"}}>நடுநிலை நாளிதழ்</div>
                    </div>
        <div className="sb-header">
          <div className="search-bar">
  <input
    type="text"
    placeholder="Search..."
    className="search-input"
  />
  <IoSearchSharp className="search-icon" />
</div>
        </div>

        <div className="sb-content">

          <SidebarItem title="அரசியல்" active={active} toggle={toggle}>
            <li>தமிழ்நாடு அரசியல்</li>
            <li>தேசிய அரசியல்</li>
            <li>தேர்தல்கள்</li>
          </SidebarItem>

          <SidebarItem title="வானிலை" active={active} toggle={toggle}>
            <li>இன்றைய வானிலை</li>
            <li>மாவட்ட வானிலை</li>
            <li>மழை செய்திகள்</li>
          </SidebarItem>

          <SidebarItem title="சினிமா" active={active} toggle={toggle}>
            <li>தமிழ் சினிமா</li>
            <li>திரை விமர்சனம்</li>
            <li>நட்சத்திர செய்திகள்</li>
          </SidebarItem>

          <SidebarItem title="விளையாட்டு" active={active} toggle={toggle}>
            <li>கிரிக்கெட்</li>
            <li>கால்பந்து</li>
            <li>ஒலிம்பிக்</li>
          </SidebarItem>

          <SidebarItem title="ஜோதிடம்" active={active} toggle={toggle}>
            <li>இன்றைய ராசிபலன்</li>
            <li>வார ராசிபலன்</li>
            <li>பரிகாரங்கள்</li>
          </SidebarItem>

        </div>
      </div>
    </>
  );
}

/* Reusable item */
function SidebarItem({ title, children, active, toggle }) {
  const isOpen = active === title;

  return (
    <div className="sb-item">
      <div className="sb-title" onClick={() => toggle(title)}>
        {title}
        <span>{isOpen ? "−" : "+"}</span>
      </div>
      {isOpen && <ul className="sb-sub">{children}</ul>}
    </div>
  );
}
