import { useState } from "react";
import "./pageeditor.scss";

export default function PageEditor({ pages, containers }) {
  const [activePage, setActivePage] = useState(pages[0]);
  const [activeTab, setActiveTab] = useState("containers");

  return (
    <div className="page-editor">

      {/* Switch Pages */}
      <div className="pe-section">
        <div className="pe-title">switch pages</div>

        <div className="pe-page-buttons">
          {pages.map((p, i) => (
            <button
              key={i}
              className={`pe-page-btn ${activePage === p ? "active" : ""}`}
              onClick={() => setActivePage(p)}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="pe-row">
          <button className="pe-sm-btn">Add New page</button>
          <button className="pe-sm-btn">Save changes</button>
        </div>

        <div className="pe-row">
          <button className="pe-sm-btn">Borders</button>
          <button className="pe-sm-btn">Remove Lines</button>
        </div>
      </div>

      {/* Drag and Drop Section */}
      <div className="pe-section drag-section">

        <div className="pe-title">Drag and Drop the containers</div>

        {/* Tabs */}
        <div className="pe-tabs">
          {["containers", "Sliders", "lines", "headers"].map((tab) => (
            <div
              key={tab}
              className={`pe-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Container Box */}
        <div className="pe-drag-box">
          {containers.map((c, i) => (
            <div key={i} className="pe-box-item">
              <img src={c.img} alt="" />
              <div className="pe-box-label">{c.label}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
