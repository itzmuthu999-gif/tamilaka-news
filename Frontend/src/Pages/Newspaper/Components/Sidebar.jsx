import React, { useState } from "react";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import logo from "../../../assets/logo1.png";
import { IoSearchSharp } from "react-icons/io5";

export default function Sidebar({ open, onClose }) {
  const [active, setActive] = useState(null);

  // Get navigation data from Redux store
  const { allPages, selectedDistrict2 } = useSelector((state) => state.admin);

  // Filter and sort pages that should appear in sidebar (sidenavpos is not null)
  const sidebarPages = allPages
    .filter((page) => page.sidenavpos !== null)
    .sort((a, b) => a.sidenavpos - b.sidenavpos);

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
        <div className="nav-c1-logo-v2" style={{ position: "relative" }}>
          <div className="nav-c1l-t1-v2">
            <img src={logo} />
          </div>
          <div
            className="nav-c1l-t2-v2"
            style={{ position: "absolute", transform: "translateY(20px)" }}
          >
            நடுநிலை நாளிதழ்
          </div>
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
          {sidebarPages.map((page) => {
            // Special handling for District selector
            if (page.districts) {
              return (
                <SidebarItem
                  key={page.id}
                  title={page.name.tam}
                  active={active}
                  toggle={toggle}
                >
                  {page.districts.map((district, index) => (
                    <li key={index}>{district.tam}</li>
                  ))}
                </SidebarItem>
              );
            }

            // Regular page items without sub-items
            return (
              <div key={page.id} className="sb-item">
                <div className="sb-title-simple">
                  {page.name.tam}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* Reusable item with dropdown */
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