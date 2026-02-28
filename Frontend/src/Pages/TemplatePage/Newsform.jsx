import React, { useEffect, useState, useCallback, useRef } from "react";
import { Rnd } from "react-rnd";
import { AiOutlineSlack } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { BiGridAlt } from "react-icons/bi";
import layout1 from "../../assets/Layout1.png";
import layout2 from "../../assets/Layout2.png";
import { useDispatch } from "react-redux";
import { setLayout } from "../Slice/newsformSlice.js";
import { useSelector } from "react-redux";
import "../TemplatePage/TemplatePage.scss";

const emptyFormData = () => ({
  headline: "",
  oneLiner: "",
  thumbnail: null,
  zonal: [],
  author: "",
  images: [],
});

const normalizeCategories = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export default function Newsform({
  initialData = null,
  onChange = () => {},
  onSave = () => {},
  activeLang = "ta",
  onActiveLangChange = () => {},
  paragraphBoxes = [],
  onTranslatedParagraphs = () => {},
}) {
  const [tamilBuffer, setTamilBuffer] = useState(emptyFormData());
  const [englishBuffer, setEnglishBuffer] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const dispatch = useDispatch();
  const MLayout = useSelector((state) => state.newsform.MLayout);
  const allPages = useSelector((state) => state.admin.allPages || []);

  const categoryOptions = Array.from(
    new Set(
      allPages
        .filter(
          (page) =>
            page?.name?.eng &&
            page.name.eng !== "Select District" &&
            !page.districts
        )
        .map((page) => page.name.eng)
    )
  );

  const selectedCategories = normalizeCategories(tamilBuffer.zonal);

  const hasEnglishBuffer = englishBuffer !== null;
  const displayData =
    activeLang === "en"
      ? englishBuffer || {
          ...emptyFormData(),
          thumbnail: tamilBuffer.thumbnail,
          images: tamilBuffer.images,
          zonal: tamilBuffer.zonal,
        }
      : tamilBuffer;

  const categoryRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      const data = initialData.data || emptyFormData();
      const normalizedData = {
        ...data,
        zonal: normalizeCategories(data.zonal),
      };
      setTamilBuffer((prev) => ({ ...emptyFormData(), ...prev, ...normalizedData }));
      if (initialData.dataEn) {
        const normalizedEn = {
          ...initialData.dataEn,
          zonal: normalizeCategories(initialData.dataEn.zonal),
        };
        setEnglishBuffer((prev) => ({ ...emptyFormData(), ...prev, ...normalizedEn }));
      } else {
        setEnglishBuffer(null);
      }
      if (data.thumbnail) {
        try {
          if (typeof data.thumbnail === "string") {
            setThumbnailPreview(data.thumbnail);
          } else {
            setThumbnailPreview(URL.createObjectURL(data.thumbnail));
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (!categoryOpen) return;
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [categoryOpen]);

  useEffect(() => {
    if (activeLang === "en") setCategoryOpen(false);
  }, [activeLang]);

  useEffect(() => {
    if (!hasEnglishBuffer) return;
    setEnglishBuffer((prev) => {
      if (!prev) return prev;
      const sameThumb = prev.thumbnail === tamilBuffer.thumbnail;
      const sameImages = prev.images === tamilBuffer.images;
      const sameZonal = prev.zonal === tamilBuffer.zonal;
      if (sameThumb && sameImages && sameZonal) return prev;
      return {
        ...prev,
        thumbnail: tamilBuffer.thumbnail,
        images: tamilBuffer.images,
        zonal: tamilBuffer.zonal,
      };
    });
  }, [tamilBuffer.thumbnail, tamilBuffer.images, tamilBuffer.zonal, hasEnglishBuffer]);

  const notifyChange = useCallback(() => {
    onChange({ tamil: { ...tamilBuffer }, english: englishBuffer ? { ...englishBuffer } : null });
  }, [tamilBuffer, englishBuffer, onChange]);

  useEffect(() => {
    notifyChange();
  }, [tamilBuffer, englishBuffer, notifyChange]);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    if (activeLang === "en" && (name === "thumbnail" || name === "zonal")) {
      return;
    }

    if (files && files[0]) {
      const file = files[0];
      const dataUrl = await readFileAsDataUrl(file);
      if (activeLang === "en") {
        setEnglishBuffer((prev) => ({
          ...(prev || {
            ...emptyFormData(),
            thumbnail: tamilBuffer.thumbnail,
            images: tamilBuffer.images,
            zonal: tamilBuffer.zonal,
          }),
          [name]: dataUrl,
        }));
      } else {
        setTamilBuffer((prev) => ({ ...prev, [name]: dataUrl }));
        if (name === "thumbnail") setThumbnailPreview(dataUrl);
      }
      return;
    }

    if (activeLang === "en") {
      setEnglishBuffer((prev) => ({
        ...(prev || {
          ...emptyFormData(),
          thumbnail: tamilBuffer.thumbnail,
          images: tamilBuffer.images,
          zonal: tamilBuffer.zonal,
        }),
        [name]: value,
      }));
    } else {
      setTamilBuffer((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleCategory = (value) => {
    if (activeLang === "en") return;
    setTamilBuffer((prev) => {
      const current = normalizeCategories(prev.zonal);
      const exists = current.includes(value);
      const next = exists
        ? current.filter((c) => c !== value)
        : [...current, value];
      return { ...prev, zonal: next };
    });
  };

  const switchToEnglishWithEmpty = useCallback(() => {
    const emptyEn = {
      ...emptyFormData(),
      thumbnail: tamilBuffer.thumbnail,
      images: tamilBuffer.images,
      zonal: tamilBuffer.zonal,
    };
    setEnglishBuffer(emptyEn);
    const emptyParagraphs = paragraphBoxes.map((b) => ({ id: b.id, contentEn: "" }));
    onTranslatedParagraphs(emptyParagraphs);
    onActiveLangChange("en");
  }, [tamilBuffer.thumbnail, tamilBuffer.images, tamilBuffer.zonal, paragraphBoxes, onTranslatedParagraphs, onActiveLangChange]);

  const handleSwitchToTamil = () => {
    onActiveLangChange("ta");
  };

  const handleSwitchToEnglish = () => {
    if (englishBuffer) {
      onActiveLangChange("en");
    } else {
      switchToEnglishWithEmpty();
    }
  };

  const submit = (e) => {
    e && e.preventDefault();
    
    // Get current form data based on active language
    const currentFormData = activeLang === "en" && englishBuffer ? englishBuffer : tamilBuffer;
    
    try {
      onSave(currentFormData);
      console.log('onSave called successfully with:', currentFormData);
    } catch (error) {
      console.error('Error in submit function:', error);
      alert('Error saving news: ' + error.message);
    }
  };

  const handleContainerDragStart = (e) => {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("container-overlay", "true");
  };

  const handleParagraphDragStart = (e) => {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("add-box-type", "paragraph");
  };

  const handleImageDragStart = (e) => {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("add-box-type", "image");
  };

  // ── NEW: drag handler for video box ──────────────────────────────────────
  const handleVideoDragStart = (e) => {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("add-box-type", "video");
  };

  return (
    <div className="form-main-cont">
      {!openForm && (
        <div
          onClick={() => setOpenForm(true)}
          style={{
            position: "fixed",
            top: 20,
            left: 20,
            fontSize: "40px",
            cursor: "pointer",
            zIndex: 9999,
          }}
        >
          <AiOutlineSlack />
        </div>
      )}

      {openForm && (
        <Rnd
          default={{ x: 1080, y: 0, width: 450, height: 700 }}
          bounds="window"
          dragHandleClassName="drag-header"
          className="newsform-panel"
          style={{ zIndex: 9999 }}
        >
          <div
            className="drag-header"
          >
            <span>News Form</span>
            <FaTimes
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => setOpenForm(false)}
            />
          </div>

          <div className="newsform-con">
            <form onSubmit={submit} className="news-form">
              <div className="newsform-lang-toggle">
                <span className="newsform-lang-label">Language</span>
                <div className="newsform-lang-buttons">
                  <button
                    type="button"
                    onClick={handleSwitchToTamil}
                    className={`newsform-lang-btn${activeLang === "ta" ? " is-active" : ""}`}
                  >
                    Tamil
                  </button>
                  <button
                    type="button"
                    onClick={handleSwitchToEnglish}
                    className={`newsform-lang-btn${activeLang === "en" ? " is-active" : ""}`}
                  >
                    English
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">News Headline</label>
                <textarea
                  name="headline"
                  value={displayData.headline || ""}
                  onChange={handleChange}
                  placeholder="Enter news headline"
                  className="form-textarea"
                  rows="2"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">News One-Liner</label>
                <textarea
                  name="oneLiner"
                  value={displayData.oneLiner || ""}
                  onChange={handleChange}
                  placeholder="Enter a short one-liner"
                  className="form-textarea"
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Author</label>
                <input
                  type="text"
                  name="author"
                  value={displayData.author || ""}
                  onChange={handleChange}
                  placeholder="Enter author name"
                  className="form-textarea"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Thumbnail Image</label>
                <input
                  type="file"
                  name="thumbnail"
                  accept="image/*,video/*,.gif"
                  onChange={handleChange}
                  className={`form-file${activeLang === "en" ? " is-disabled" : ""}`}
                  disabled={activeLang === "en"}
                />
                {activeLang === "en" && (
                  <div className="newsform-note">Switch to Tamil to change the thumbnail.</div>
                )}

                {thumbnailPreview && (
                  <div className="image-preview">
                    {displayData.thumbnail &&
                    (displayData.thumbnail.type?.startsWith("video/") ||
                      (typeof displayData.thumbnail === "string" &&
                        (displayData.thumbnail.startsWith("data:video/") ||
                          displayData.thumbnail.includes(".mp4") ||
                          displayData.thumbnail.includes(".webm") ||
                          displayData.thumbnail.includes(".ogg")))) ? (
                      <video
                        src={thumbnailPreview}
                        controls
                        style={{
                          width: "100%",
                          maxHeight: "200px",
                          borderRadius: "8px",
                        }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail Preview"
                        className="preview-img"
                      />
                    )}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <div
                  ref={categoryRef}
                  className={`newsform-multiselect${activeLang === "en" ? " is-disabled" : ""}`}
                >
                  <button
                    type="button"
                    className="newsform-multiselect-trigger"
                    onClick={() => {
                      if (activeLang === "en") return;
                      setCategoryOpen((prev) => !prev);
                    }}
                    disabled={activeLang === "en"}
                  >
                    <span>
                      {selectedCategories.length > 0
                        ? selectedCategories.join(", ")
                        : "Select categories"}
                    </span>
                    <span className="newsform-multiselect-caret">v</span>
                  </button>

                  {selectedCategories.length > 0 && (
                    <div className="newsform-selected-tags">
                      {selectedCategories.map((cat) => (
                        <span key={cat} className="newsform-tag">
                          {cat}
                          {activeLang !== "en" && (
                            <button
                              type="button"
                              className="newsform-tag-remove"
                              onClick={() => toggleCategory(cat)}
                            >
                              x
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                  )}

                  {categoryOpen && (
                    <div className="newsform-multiselect-menu">
                      {categoryOptions.length === 0 && (
                        <div className="newsform-empty">No categories configured.</div>
                      )}
                      {categoryOptions.map((cat) => {
                        const checked = selectedCategories.includes(cat);
                        return (
                          <label key={cat} className={`newsform-option${checked ? " is-checked" : ""}`}>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleCategory(cat)}
                            />
                            <span>{cat}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
                {activeLang === "en" && (
                  <div className="newsform-note">Switch to Tamil to edit categories.</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Content Organization</label>
                <div
                  draggable
                  onDragStart={handleContainerDragStart}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "12px",
                    background: "#667eea",
                    color: "#fff",
                    borderRadius: "8px",
                    cursor: "move",
                  }}
                >
                  <BiGridAlt size={18} />
                  Drag Container Overlay
                </div>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#666",
                    marginTop: "6px",
                    lineHeight: "1.4",
                  }}
                >
                  Drag this to organize paragraphs and images in a grid layout
                </p>
              </div>

              {/* ── Add content items row ────────────────────────────────── */}
              <div className="add-pi">
                <div
                  className="add-para"
                  draggable
                  onDragStart={handleParagraphDragStart}
                  style={{ cursor: "move" }}
                >
                  Add Paragraph
                </div>
                <div
                  className="add-img"
                  draggable
                  onDragStart={handleImageDragStart}
                  style={{ cursor: "move" }}
                >
                  Add Image
                </div>

                {/* ── NEW: Add Video button ───────────────────────────────── */}
                <div
                  className="add-video"
                  draggable
                  onDragStart={handleVideoDragStart}
                  style={{
                    cursor: "move",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 12px",
                    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)",
                    color: "#fff",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    userSelect: "none",
                    border: "1px solid rgba(255,255,255,0.15)",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  title="Drag onto the canvas or into a Container Overlay"
                >
                  <FaVideo size={13} />
                  Add Video
                </div>
              </div>

              <div>Select Layout</div>
              <div
                className="layout-encloser"
                style={{ display: "flex", gap: "10px", margin: "10px" }}
              >
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
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
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
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                </div>
              </div>

              <button type="submit" onClick={submit} className="upload-button">
                Preview / Apply
              </button>
            </form>
          </div>
        </Rnd>
      )}
    </div>
  );
}
