import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addDistrict, updateDistrict, deleteDistrict } from "../../../Slice/adminSlice";
import { FaEdit, FaTimes } from "react-icons/fa";
import "./DistrictContainer.css";

export default function DistrictContainer({ showEnglish }) {
  const dispatch = useDispatch();
  const allPages = useSelector((state) => state.admin.allPages);
  
  // Get the district page (last item in allPages)
  const districtPage = allPages[allPages.length - 1];
  const districts = districtPage?.districts || [];

  const [input, setInput] = useState("");
  const [translation, setTranslation] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editName, setEditName] = useState("");
  const [editTranslation, setEditTranslation] = useState("");

  const translateToEnglish = (tamilText) => {
    const translations = {
      "சென்னை": "Chennai",
      "கோயம்புத்தூர்": "Coimbatore",
      "மதுரை": "Madurai",
      "திருச்சிராப்பள்ளி": "Tiruchirappalli",
      "சேலம்": "Salem",
      "திருநெல்வேலி": "Tirunelveli"
    };
    
    return translations[tamilText] || tamilText;
  };

  const handleAddDistrict = () => {
    if (!input.trim()) return;
    
    dispatch(addDistrict({
      tam: input.trim(),
      eng: translation.trim() || translateToEnglish(input.trim())
    }));
    
    setInput("");
    setTranslation("");
  };

  const handleDeleteDistrict = (index) => {
    if (window.confirm("Delete this district?")) {
      dispatch(deleteDistrict({ index }));
    }
  };

  const openEditModal = (index) => {
    const district = districts[index];
    setEditingIndex(index);
    setEditName(district.tam);
    setEditTranslation(district.eng);
    setShowEditModal(true);
  };

  const saveEdit = () => {
    if (!editName.trim()) return;
    
    dispatch(updateDistrict({
      index: editingIndex,
      tam: editName.trim(),
      eng: editTranslation.trim() || translateToEnglish(editName.trim())
    }));
    
    setShowEditModal(false);
    setEditingIndex(null);
    setEditName("");
    setEditTranslation("");
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingIndex(null);
    setEditName("");
    setEditTranslation("");
  };

  const getDistrictDisplay = (district) => {
    return showEnglish ? district.eng : district.tam;
  };

  return (
    <div className="districts-wrapper">
      <h2>Select District</h2>

      <div className="districts-box">
        {districts.map((district, i) => (
          <div
            key={i}
            className="district-chip"
            title={district.eng}
          >
            {getDistrictDisplay(district)}
            <button className="edit-btn" onClick={() => openEditModal(i)} title="Edit district">
              <FaEdit />
            </button>
            <span className="close" onClick={() => handleDeleteDistrict(i)} title="Delete district">x</span>
          </div>
        ))}
      </div>

      <div className="add-area">
        <div className="input-group">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="New district name (Tamil)"
            className="primary-input"
          />
          <input
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            placeholder="English translation"
            className="translation-input"
          />
        </div>
        <button onClick={handleAddDistrict}>Add New District +</button>
      </div>

      {showEditModal && (
        <div className="edit-modal-overlay">
          <div className="edit-modal-content">
            <h3>Edit District</h3>
            <div className="edit-input-group">
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="District name (Tamil)"
                className="edit-primary-input"
              />
              <input
                value={editTranslation}
                onChange={(e) => setEditTranslation(e.target.value)}
                placeholder="English translation"
                className="edit-translation-input"
              />
            </div>
            <div className="edit-modal-actions">
              <button className="save-btn" onClick={saveEdit}>
                Save Changes
              </button>
              <button className="cancel-btn" onClick={closeEditModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}