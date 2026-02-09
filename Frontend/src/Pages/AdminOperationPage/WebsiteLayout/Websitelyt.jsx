import React from "react";
import { useDispatch } from "react-redux";
import { setLayout } from "../../Slice/newsformslice.js";
import { useSelector } from "react-redux";
import layout1 from "../../../assets/Layout1.png";
import layout2 from "../../../assets/Layout2.png";
import "./websitelyt.scss";

export default function Websitelyt() {
  const dispatch = useDispatch();
  const MLayout = useSelector((state) => state.newsform.MLayout);

  return (
    <div className="website-layout-container">
      <div className="layout-header">
        <h2>Website Layout</h2>
        <p>Select a layout for your website design</p>
      </div>

      <div className="layout-content">
        <div className="layout-section">
          <h3>Select Layout</h3>
          <div className="layout-encloser">
            <div
              className="layout lone"
              onClick={() => dispatch(setLayout(1))}
              style={{
                border:
                  MLayout === 1 ? "3px solid #ff008c" : "3px solid #ffcce5",
                background: MLayout === 1 ? "#ffd0e8" : "#ffe6f2",
                borderRadius: "10px",
                padding: "5px",
                cursor: "pointer",
                transition: "0.3s",
                marginBottom: "10px",
              }}
            >
              <img
                src={layout1}
                alt="Layout 1"
                style={{ width: "100%", borderRadius: "8px" }}
              />
              <div className="layout-title">Layout 1</div>
            </div>

            <div
              className="layout ltwo"
              onClick={() => dispatch(setLayout(2))}
              style={{
                border:
                  MLayout === 2 ? "3px solid #ff008c" : "3px solid #ffcce5",
                background: MLayout === 2 ? "#ffd0e8" : "#ffe6f2",
                borderRadius: "10px",
                padding: "5px",
                cursor: "pointer",
                transition: "0.3s",
              }}
            >
              <img
                src={layout2}
                alt="Layout 2"
                style={{ width: "100%", borderRadius: "8px" }}
              />
              <div className="layout-title">Layout 2</div>
            </div>
          </div>
        </div>

        <div className="layout-info">
          <h4>Layout Information</h4>
          <div className="info-content">
            <p><strong>Current Selection:</strong> Layout {MLayout}</p>
            <p>Choose a layout that best fits your website design needs. Each layout offers different content organization and visual presentation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}