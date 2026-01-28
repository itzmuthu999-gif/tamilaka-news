import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { IoSettingsOutline } from "react-icons/io5";

export default function NewsContainerSettings({ 
  settings, 
  onSettingsChange 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (field, value) => {
    const newSettings = { 
      ...localSettings, 
      [field]: parseInt(value) || 0 
    };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <>
      {/* Settings Button */}
      <button
        className="news-settings-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="News Container Settings"
        style={{
          position: 'absolute',
          top: '-50px',
          right: '0px',
          background: '#ff0059',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 100,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#e6004f';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#ff0059';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <IoSettingsOutline size={20} />
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div
          className="news-settings-panel"
          style={{
            position: 'absolute',
            top: '0px',
            right: '0px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            padding: '20px',
            width: '300px',
            zIndex: 1000,
            border: '1px solid #e0e0e0'
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '15px',
              borderBottom: '2px solid #f0f0f0'
            }}
          >
            <h3 style={{ 
              margin: 0, 
              fontSize: '18px',
              fontWeight: '600',
              color: '#333'
            }}>
              Container Settings
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#999',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f5f5f5';
                e.currentTarget.style.color = '#ff0059';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#999';
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Settings Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* Height and Padding Row */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label
                  htmlFor="container-height"
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#555'
                  }}
                >
                  Height (px)
                </label>
                <input
                  id="container-height"
                  type="number"
                  value={localSettings.height}
                  onChange={(e) => handleChange("height", e.target.value)}
                  min="200"
                  step="50"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#ff0059'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label
                  htmlFor="container-padding"
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#555'
                  }}
                >
                  Padding (px)
                </label>
                <input
                  id="container-padding"
                  type="number"
                  value={localSettings.padding}
                  onChange={(e) => handleChange("padding", e.target.value)}
                  min="0"
                  step="5"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#ff0059'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                />
              </div>
            </div>

            {/* Grid Columns and Gap Row */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label
                  htmlFor="container-columns"
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#555'
                  }}
                >
                  Columns
                </label>
                <input
                  id="container-columns"
                  type="number"
                  value={localSettings.gridColumns}
                  onChange={(e) => handleChange("gridColumns", e.target.value)}
                  min="1"
                  max="12"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#ff0059'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label
                  htmlFor="container-gap"
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#555'
                  }}
                >
                  Gap (px)
                </label>
                <input
                  id="container-gap"
                  type="number"
                  value={localSettings.gap}
                  onChange={(e) => handleChange("gap", e.target.value)}
                  min="0"
                  step="5"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#ff0059'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                />
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div
            style={{
              marginTop: '20px',
              paddingTop: '15px',
              borderTop: '2px solid #f0f0f0',
              fontSize: '12px',
              color: '#999',
              textAlign: 'center'
            }}
          >
            Changes apply immediately
          </div>
        </div>
      )}
    </>
  );
}