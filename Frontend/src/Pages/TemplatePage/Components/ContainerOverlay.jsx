import React, { useState } from 'react';
import { FaTimes, FaEdit } from 'react-icons/fa';
import ImageBox from './ImageBox.jsx';
import ParagraphBox from './ParagraphBox.jsx';

export default function ContainerOverlay({ id, onDelete, onUpdate, initialSettings = {} }) {
  const [settings, setSettings] = useState({
    columns: initialSettings.columns || 2,
    gap: initialSettings.gap || 10,
    padding: initialSettings.padding || 20,
    boxes: initialSettings.boxes || [],
    ...initialSettings
  });
  
  const [showSettings, setShowSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState({ ...settings });

  const handleDelete = () => {
    onDelete(id);
  };

  const handleEditClick = () => {
    setTempSettings({ ...settings });
    setShowSettings(!showSettings);
  };

  const handleApply = () => {
    setSettings(tempSettings);
    onUpdate(id, tempSettings);
    setShowSettings(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const boxId = e.dataTransfer.getData('boxId');
    const boxType = e.dataTransfer.getData('boxType');
    const addBoxType = e.dataTransfer.getData('add-box-type');
    
    if (boxId && boxType) {
      const newBox = {
        id: parseInt(boxId),
        type: boxType,
        content: ''
      };
      
      const updatedSettings = {
        ...settings,
        boxes: [...settings.boxes, newBox]
      };
      
      setSettings(updatedSettings);
      onUpdate(id, updatedSettings);
    } else if (addBoxType) {
      const newBox = {
        id: Date.now(),
        type: addBoxType,
        content: ''
      };
      
      const updatedSettings = {
        ...settings,
        boxes: [...settings.boxes, newBox]
      };
      
      setSettings(updatedSettings);
      onUpdate(id, updatedSettings);
    }
  };

  const removeBoxFromContainer = (boxId) => {
    const updatedSettings = {
      ...settings,
      boxes: settings.boxes.filter(b => b.id !== boxId)
    };
    setSettings(updatedSettings);
    onUpdate(id, updatedSettings);
  };

  const updateBoxInContainer = (boxId, updates) => {
    const updatedSettings = {
      ...settings,
      boxes: settings.boxes.map(b => 
        b.id === boxId ? { ...b, ...updates } : b
      )
    };
    setSettings(updatedSettings);
    onUpdate(id, updatedSettings);
  };

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          border: '2px dashed #667eea',
          borderRadius: '8px',
          padding: `${settings.padding}px`,
          minHeight: '200px',
          height: '100%',
          position: 'relative',
          background: 'rgba(102, 126, 234, 0.05)'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            display: 'flex',
            gap: '8px',
            zIndex: 10
          }}
        >
          <button
            onClick={handleEditClick}
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            <FaEdit />
          </button>
          <button
            onDoubleClick={handleDelete}
            style={{
              background: '#ff0059',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            <FaTimes />
          </button>
        </div>

        {showSettings && (
          <div
            style={{
              position: 'absolute',
              top: '45px',
              right: '8px',
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              zIndex: 20,
              minWidth: '200px'
            }}
          >
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>
                Columns:
              </label>
              <input
                type="number"
                min="1"
                max="6"
                value={tempSettings.columns}
                onChange={(e) => setTempSettings({ ...tempSettings, columns: parseInt(e.target.value) || 1 })}
                style={{
                  width: '100%',
                  padding: '6px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '13px'
                }}
              />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>
                Gap (px):
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={tempSettings.gap}
                onChange={(e) => setTempSettings({ ...tempSettings, gap: parseInt(e.target.value) || 0 })}
                style={{
                  width: '100%',
                  padding: '6px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '13px'
                }}
              />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>
                Padding (px):
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={tempSettings.padding}
                onChange={(e) => setTempSettings({ ...tempSettings, padding: parseInt(e.target.value) || 0 })}
                style={{
                  width: '100%',
                  padding: '6px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '13px'
                }}
              />
            </div>
            <button
              onClick={handleApply}
              style={{
                width: '100%',
                padding: '8px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500'
              }}
            >
              Apply
            </button>
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${settings.columns}, 1fr)`,
            gap: `${settings.gap}px`,
            minHeight: '150px'
          }}
        >
          {settings.boxes.length === 0 ? (
            <div style={{ gridColumn: `span ${settings.columns}`, textAlign: 'center', color: '#999', padding: '20px' }}>
              Drop paragraph or image boxes here
            </div>
          ) : (
            settings.boxes.map((box) => (
              <div key={box.id}>
                {box.type === 'paragraph' ? (
                  <ParagraphBox
                    id={box.id}
                    onDelete={removeBoxFromContainer}
                    onUpdate={updateBoxInContainer}
                    initialContent={box.content}
                    box={{ x: 0, y: 0, width: 200, height: 150, ...box }}
                    isInContainer={true}
                  />
                ) : (
                  <ImageBox
                    id={box.id}
                    onDelete={removeBoxFromContainer}
                    onUpdate={updateBoxInContainer}
                    initialContent={box.content}
                    box={{ x: 0, y: 0, width: 200, height: 150, ...box }}
                    isInContainer={true}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}