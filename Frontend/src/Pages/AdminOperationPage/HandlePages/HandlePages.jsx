import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addTopNavHeader1,
  updateTopNavHeader1,
  deleteTopNavHeader1,
  reorderTopNavHeaders1,
  setSelectedDistrict1,
  addTopNavHeader2,
  updateTopNavHeader2,
  deleteTopNavHeader2,
  reorderTopNavHeaders2,
  setSelectedDistrict2
} from "../../Slice/adminSlice";
import "./HandlePages.css";
import img1 from "../../../assets/Adminoperations/navbar1.png";
import PageContainer from "./PageContainer/PagesContainer";
import DistrictContainer from "./DistrictContainer/DistrictContainer";
import img2 from "../../../assets/Adminoperations/navbar2.png";
import { FaExchangeAlt, FaTimes, FaGripVertical } from "react-icons/fa";

export default function HandlePages() {
  const dispatch = useDispatch();
  
  const allPages = useSelector((state) => state.admin.allPages);
  const topNavHeaders1 = useSelector((state) => state.admin.topNavHeaders1);
  const topNavHeaders2 = useSelector((state) => state.admin.topNavHeaders2);
  
  // Get district page and its properties
  const districtPage = allPages[allPages.length - 1];
  const selectedDistrict1 = districtPage?.selectedDistrict1 || "";
  const selectedDistrict2 = districtPage?.selectedDistrict2 || "";

  const [showPopup1, setShowPopup1] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);
  const [editingIndex1, setEditingIndex1] = useState(null);
  const [editingIndex2, setEditingIndex2] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedNav, setDraggedNav] = useState(null);
  const [showEnglish, setShowEnglish] = useState(false);

  const districts = districtPage?.districts || [];
  // All pages including the district page can now be added to navigation
  const pages = allPages;

  const getPageById = (id) => {
    return allPages.find(page => page.id === id);
  };

  const getPageDisplay = (page) => {
    if (!page) return "";
    return showEnglish ? page.name.eng : page.name.tam;
  };

  const getDistrictDisplay = (district) => {
    return showEnglish ? district.eng : district.tam;
  };

  const addHeader = (navNumber) => {
    if (navNumber === 1) {
      setShowPopup1(true);
      setEditingIndex1(null);
    } else {
      setShowPopup2(true);
      setEditingIndex2(null);
    }
  };

  const selectPage = (pageId, navNumber, editingIndex) => {
    if (navNumber === 1) {
      if (editingIndex !== null) {
        dispatch(updateTopNavHeader1({ index: editingIndex, pageId }));
      } else {
        dispatch(addTopNavHeader1({ pageId }));
      }
      setShowPopup1(false);
      setEditingIndex1(null);
    } else {
      if (editingIndex !== null) {
        dispatch(updateTopNavHeader2({ index: editingIndex, pageId }));
      } else {
        dispatch(addTopNavHeader2({ pageId }));
      }
      setShowPopup2(false);
      setEditingIndex2(null);
    }
  };

  const deleteHeader = (index, navNumber) => {
    if (navNumber === 1) {
      dispatch(deleteTopNavHeader1({ index }));
    } else {
      dispatch(deleteTopNavHeader2({ index }));
    }
  };

  const changeHeader = (index, navNumber) => {
    if (navNumber === 1) {
      setShowPopup1(true);
      setEditingIndex1(index);
    } else {
      setShowPopup2(true);
      setEditingIndex2(index);
    }
  };

  const handleDragStart = (e, index, navNumber) => {
    setDraggedItem(index);
    setDraggedNav(navNumber);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex, navNumber) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedItem === null || draggedNav === null || draggedNav !== navNumber) return;
    if (draggedItem === dropIndex) return; // Can't drop on itself

    const sourceIndex = draggedItem;
    const targetIndex = dropIndex;
    
    if (sourceIndex !== targetIndex) {
      if (navNumber === 1) {
        dispatch(reorderTopNavHeaders1({ sourceIndex, targetIndex }));
      } else {
        dispatch(reorderTopNavHeaders2({ sourceIndex, targetIndex }));
      }
    }
    
    setDraggedItem(null);
    setDraggedNav(null);
  };

  const handleDropzoneDragOver = (e, position, navNumber) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropzoneDrop = (e, position, navNumber) => {
    e.preventDefault();
    e.stopPropagation();
    handleDrop(e, position, navNumber);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDraggedNav(null);
  };

  const renderNavItems = (navNumber) => {
    const headers = navNumber === 1 ? topNavHeaders1 : topNavHeaders2;
    const selectedDistrict = navNumber === 1 ? selectedDistrict1 : selectedDistrict2;
    const setSelectedDistrict = navNumber === 1 
      ? (value) => dispatch(setSelectedDistrict1(value))
      : (value) => dispatch(setSelectedDistrict2(value));
    
    return headers.map((pageId, index) => {
      const page = getPageById(pageId);
      
      // Check if this is the district page
      if (page === districtPage) {
        // Render as dropdown
        return (
          <div 
            key={index}
            className={`dropdown-container-${navNumber} ${
              draggedItem === index && draggedNav === navNumber ? 'dragging' : ''
            }`}
            draggable
            onDragStart={(e) => handleDragStart(e, index, navNumber)}
            onDragOver={(e) => handleDropzoneDragOver(e, index, navNumber)}
            onDrop={(e) => handleDropzoneDrop(e, index, navNumber)}
            onDragEnd={handleDragEnd}
          >
            <button 
              className="drag-handle"
              title="Drag to move dropdown"
            >
              <FaGripVertical />
            </button>
            <select 
              value={selectedDistrict} 
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="district-dropdown"
            >
              <option value="">Select District</option>
              {districts.map((district, distIndex) => (
                <option key={distIndex} value={getDistrictDisplay(district)}>
                  {getDistrictDisplay(district)}
                </option>
              ))}
            </select>
            <button onClick={() => changeHeader(index, navNumber)} className={`header-btn-${navNumber}1 change`}>
              <FaExchangeAlt />
            </button>
            <button onDoubleClick={() => deleteHeader(index, navNumber)} className={`header-btn-${navNumber}2 delete`}>
              <FaTimes />
            </button>
          </div>
        );
      } else {
        // Render as regular header
        return (
          <div 
            key={index}
            className={`header-item-${navNumber} header-item-enter ${
              draggedItem === index && draggedNav === navNumber ? 'dragging' : ''
            }`}
            draggable
            onDragStart={(e) => handleDragStart(e, index, navNumber)}
            onDragOver={(e) => handleDropzoneDragOver(e, index, navNumber)}
            onDrop={(e) => handleDropzoneDrop(e, index, navNumber)}
            onDragEnd={handleDragEnd}
          >
            <span>{getPageDisplay(page)}</span>
            <button onClick={() => changeHeader(index, navNumber)} className={`header-btn-${navNumber}1 change`}>
              <FaExchangeAlt />
            </button>
            <button onDoubleClick={() => deleteHeader(index, navNumber)} className={`header-btn-${navNumber}2 delete`}>
              <FaTimes />
            </button>
          </div>
        );
      }
    });
  };

  return (
    <div className="handle-pages">
      <div className="content-header">
        <img src={img1} alt="Main Header" className="header-image" />
        <button className="translate-toggle-btn" onClick={() => setShowEnglish(!showEnglish)}>
          {showEnglish ? 'Show Tamil' : 'Translate to English'}
        </button>
      </div>

      <div className="content-main">
        <div className="sections-container">
          <PageContainer  showEnglish={showEnglish} />
          <DistrictContainer showEnglish={showEnglish} />
        </div>
        
        <div className="side-image">
          <img src={img2} alt="Side Content" />
        </div>
      </div>

      <div className="top-navbar nav-1">
        <div className="tn-cont-1">
          {topNavHeaders1.length === 0 && (
            <span className="empty-state">No headers added yet</span>
          )}
          {renderNavItems(1)}
        </div>
        <button className="tn-btn-1" onClick={() => addHeader(1)}>Add Header</button>
      </div>

      <div className="top-navbar nav-2">
        <div className="tn-cont-2">
          {topNavHeaders2.length === 0 && (
            <span className="empty-state">No headers added yet</span>
          )}
          {renderNavItems(2)}
        </div>
        <button className="tn-btn-2" onClick={() => addHeader(2)}>Add Header</button>
      </div>

      {showPopup1 && (
        <div className="popup-overlay">
          <div className="popup-content popup-nav1">
            <h3>Select a Page for Navigation 1</h3>
            <div className="page-list">
              {pages.map((page) => (
                <button key={page.id} onClick={() => selectPage(page.id, 1, editingIndex1)} className="page-item">
                  {getPageDisplay(page)}
                </button>
              ))}
            </div>
            <div className="popup-actions">
              <button onClick={() => {setShowPopup1(false); setEditingIndex1(null);}} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showPopup2 && (
        <div className="popup-overlay">
          <div className="popup-content popup-nav2">
            <h3>Select a Page for Navigation 2</h3>
            <div className="page-list">
              {pages.map((page) => (
                <button key={page.id} onClick={() => selectPage(page.id, 2, editingIndex2)} className="page-item">
                  {getPageDisplay(page)}
                </button>
              ))}
            </div>
            <div className="popup-actions">
              <button onClick={() => {setShowPopup2(false); setEditingIndex2(null);}} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}