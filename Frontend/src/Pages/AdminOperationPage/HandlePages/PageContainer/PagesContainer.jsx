import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addPage, updatePage, deletePage } from "../../../Slice/adminSlice";
import { FaEdit, FaTimes } from "react-icons/fa";
import "./PagesContainer.css";

export default function PagesContainer({ showEnglish }) {
  const dispatch = useDispatch();
  const allPages = useSelector((state) => state.admin.allPages);
  
  // Filter out the district selector page
  const pages = allPages.filter((page, index) => index !== allPages.length - 1);

  const [input, setInput] = useState("");
  const [translation, setTranslation] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editTranslation, setEditTranslation] = useState("");

  const translateToEnglish = (tamilText) => {
    const translations = {
      "வர்த்தகம்": "Business",
      "உலகம்": "World",
      "இந்தியா": "India",
      "தமிழகம்": "Tamil Nadu",
      "நியூஸ்": "News",
      "அரசியல்": "Politics",
      "விளையாட்டு": "Sports",
      "ட்ரெண்டிங்": "Trending"
    };
    
    return translations[tamilText] || tamilText;
  };

  const handleAddPage = () => {
    if (!input.trim()) return;
    
    dispatch(addPage({
      tam: input.trim(),
      eng: translation.trim() || translateToEnglish(input.trim())
    }));
    
    setInput("");
    setTranslation("");
  };

  const handleDeletePage = (id) => {
    if (window.confirm("Delete this section?")) {
      dispatch(deletePage({ id }));
    }
  };

  const openEditModal = (page) => {
    setEditingId(page.id);
    setEditName(page.name.tam);
    setEditTranslation(page.name.eng);
    setShowEditModal(true);
  };

  const saveEdit = () => {
    if (!editName.trim()) return;
    
    dispatch(updatePage({
      id: editingId,
      tam: editName.trim(),
      eng: editTranslation.trim() || translateToEnglish(editName.trim())
    }));
    
    setShowEditModal(false);
    setEditingId(null);
    setEditName("");
    setEditTranslation("");
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingId(null);
    setEditName("");
    setEditTranslation("");
  };

  const getPageDisplay = (page) => {
    return showEnglish ? page.name.eng : page.name.tam;
  };

  return (
    <div className="pages-wrapper">
      <h2>Available pages</h2>

      <div className="pages-box">
        {pages.map((page) => (
          <div
            key={page.id}
            className="page-chip"
            title={page.name.eng}
          >
            {getPageDisplay(page)}
            <button className="edit-btn" onClick={() => openEditModal(page)} title="Edit page">
              <FaEdit />
            </button>
            <span className="close" onClick={() => handleDeletePage(page.id)} title="Delete page">x</span>
          </div>
        ))}
      </div>

      <div className="add-area">
        <div className="input-group">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="New section name (Tamil)"
            className="primary-input"
          />
          <input
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            placeholder="English translation"
            className="translation-input"
          />
        </div>
        <button onClick={handleAddPage}>Add New Sections +</button>
      </div>

      {showEditModal && (
        <div className="edit-modal-overlay">
          <div className="edit-modal-content">
            <h3>Edit Page</h3>
            <div className="edit-input-group">
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Page name (Tamil)"
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