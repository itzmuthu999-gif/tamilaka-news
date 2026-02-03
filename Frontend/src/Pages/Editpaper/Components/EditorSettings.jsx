import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { IoSettingsOutline } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { updatePageSettings } from "../../Slice/editpaperslice";
// import "./editorsettings.scss";

export default function EditorSettings() {
  const dispatch = useDispatch();
  const activePage = useSelector(state => state.editpaper.activePage);
  const pageSettings = useSelector(state => {
    const page = state.editpaper.pages.find(p => p.catName === activePage);
    return page?.settings || { height: 600, gridColumns: 12, gap: 10, padding: 20 };
  });

  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(pageSettings);

  useEffect(() => {
    setSettings(pageSettings);
  }, [pageSettings, activePage]);

  const handleChange = (field, value) => {
    const newSettings = { ...settings, [field]: parseInt(value) || 0 };
    setSettings(newSettings);
    
    dispatch(
      updatePageSettings({
        catName: activePage,
        settings: newSettings
      })
    );
  };

  return (
    <>
      {/* Settings Button */}
      <button
        className="editor-settings-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Editor Settings"
        style={{zIndex: "1000"}}
      >
        <IoSettingsOutline size={20} />
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div className="editor-settings-panel">
          <div className="settings-header">
            <h3>Editor Settings</h3>
            <button onClick={() => setIsOpen(false)} className="close-btn">
              <X size={18} />
            </button>
          </div>

          <div className="settings-content">
            <div style={{display: "flex", gap: "5px"}}>

                            <div className="setting-item">
              <label htmlFor="height">
                Height (px)
             
              </label>
              <input
                id="height"
                type="number"
                value={settings.height}
                onChange={(e) => handleChange("height", e.target.value)}
                min="200"
                step="50"
              />
            </div>
            <div className="setting-item">
              <label htmlFor="padding">
                Padding (px)
            
              </label>
              <input
                id="padding"
                type="number"
                value={settings.padding}
                onChange={(e) => handleChange("padding", e.target.value)}
                min="0"
                step="5"
              />
            </div>
            </div>
            <div style={{display: "flex", gap: "5px"}}>
            <div className="setting-item">
              <label htmlFor="gridColumns">
                Columns
              
              </label>
              <input
                id="gridColumns"
                type="number"
                value={settings.gridColumns}
                onChange={(e) => handleChange("gridColumns", e.target.value)}
                min="1"
                max="24"
              />
            </div>

            <div className="setting-item">
              <label htmlFor="gap">
                Gap (px)
               
              </label>
              <input
                id="gap"
                type="number"
                value={settings.gap}
                onChange={(e) => handleChange("gap", e.target.value)}
                min="0"
                step="5"
              />
            </div>
            </div>


          </div>

          <div className="settings-footer">
            <div className="info-text">
              Changes apply to: <strong>{activePage}</strong>
            </div>
          </div>
        </div>
      )}
    </>
  );
}