import React, { useEffect, useState, useCallback } from "react";
import { Rnd } from "react-rnd";
import { AiOutlineSlack } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { BiGridAlt } from "react-icons/bi";
import layout1 from "../../assets/Layout1.png";
import layout2 from "../../assets/Layout2.png";
import { useDispatch } from "react-redux";
import { setLayout } from "../Slice/newsformslice.js";
import { useSelector } from "react-redux";
import { translateToEnglish } from "../Slice/translate.js";
import "../TemplatePage/Templatepage.scss";

const emptyFormData = () => ({
  headline: "",
  oneLiner: "",
  thumbnail: null,
  zonal: "",
  author: "",
  images: [],
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
  const [translating, setTranslating] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const dispatch = useDispatch();
  const MLayout = useSelector((state) => state.newsform.MLayout);
  const allPages = useSelector((state) => state.admin.allPages || []);

  const displayData = activeLang === "en" && englishBuffer ? englishBuffer : tamilBuffer;

  useEffect(() => {
    if (initialData) {
      const data = initialData.data || emptyFormData();
      setTamilBuffer((prev) => ({ ...emptyFormData(), ...prev, ...data }));
      if (initialData.dataEn) {
        setEnglishBuffer((prev) => ({ ...emptyFormData(), ...prev, ...initialData.dataEn }));
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

  const notifyChange = useCallback(() => {
    onChange({ tamil: { ...tamilBuffer }, english: englishBuffer ? { ...englishBuffer } : null });
  }, [tamilBuffer, englishBuffer, onChange]);

  useEffect(() => {
    notifyChange();
  }, [tamilBuffer, englishBuffer, notifyChange]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (activeLang === "en" && englishBuffer) {
      if (files && files[0]) {
        const file = files[0];
        setEnglishBuffer((prev) => ({ ...prev, [name]: file }));
        if (name === "thumbnail") setThumbnailPreview(URL.createObjectURL(file));
      } else {
        setEnglishBuffer((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      if (files && files[0]) {
        const file = files[0];
        setTamilBuffer((prev) => ({ ...prev, [name]: file }));
        if (name === "thumbnail") setThumbnailPreview(URL.createObjectURL(file));
      } else {
        setTamilBuffer((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  const switchToEnglishWithEmpty = useCallback(() => {
    const emptyEn = {
      ...emptyFormData(),
      thumbnail: tamilBuffer.thumbnail,
      images: tamilBuffer.images,
    };
    setEnglishBuffer(emptyEn);
    const emptyParagraphs = paragraphBoxes.map((b) => ({ id: b.id, contentEn: "" }));
    onTranslatedParagraphs(emptyParagraphs);
    onActiveLangChange("en");
  }, [tamilBuffer.thumbnail, tamilBuffer.images, paragraphBoxes, onTranslatedParagraphs, onActiveLangChange]);

  const handleTranslateToEnglish = async () => {
    setTranslating(true);
    try {
      const [headlineEn, oneLinerEn, authorEn, zonalEn] = await Promise.all([
        tamilBuffer.headline ? translateToEnglish(tamilBuffer.headline) : Promise.resolve(""),
        tamilBuffer.oneLiner ? translateToEnglish(tamilBuffer.oneLiner) : Promise.resolve(""),
        tamilBuffer.author ? translateToEnglish(tamilBuffer.author) : Promise.resolve(""),
        tamilBuffer.zonal ? translateToEnglish(tamilBuffer.zonal) : Promise.resolve(""),
      ]);
      const translatedParagraphs = await Promise.all(
        paragraphBoxes.map((b) => {
          const c = (b.content || "").trim();
          return c ? translateToEnglish(c) : Promise.resolve("");
        })
      );
      const newEnglishBuffer = {
        ...emptyFormData(),
        headline: headlineEn,
        oneLiner: oneLinerEn,
        author: authorEn,
        zonal: zonalEn,
        thumbnail: tamilBuffer.thumbnail,
        images: tamilBuffer.images,
      };
      setEnglishBuffer(newEnglishBuffer);
      const withIds = paragraphBoxes.map((b, i) => ({ id: b.id, contentEn: translatedParagraphs[i] ?? "" }));
      onTranslatedParagraphs(withIds);
      onActiveLangChange("en");
    } catch (err) {
      console.error("Translation failed, switching to English with empty fields for manual entry", err);
      switchToEnglishWithEmpty();
    } finally {
      setTranslating(false);
    }
  };

  const handleSwitchToTamil = () => {
    onActiveLangChange("ta");
  };

  const handleSwitchToEnglish = () => {
    if (englishBuffer) {
      onActiveLangChange("en");
    } else {
      handleTranslateToEnglish();
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
          style={{
            background: "white",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
            padding: "10px",
            zIndex: 9999,
          }}
        >
          <div
            className="drag-header"
            style={{
              fontWeight: "bold",
              cursor: "move",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>News Form</span>
            <FaTimes
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => setOpenForm(false)}
            />
          </div>

          <div className="newsform-con">
            <form onSubmit={submit} className="news-form">
              <div className="form-group" style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: "12px", color: "#666", marginRight: "4px" }}>Language:</span>
                <button
                  type="button"
                  onClick={handleSwitchToTamil}
                  disabled={translating}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "6px",
                    border: activeLang === "ta" ? "2px solid #ff008c" : "1px solid #ccc",
                    background: activeLang === "ta" ? "#ffd0e8" : "#fff",
                    cursor: translating ? "not-allowed" : "pointer",
                    fontWeight: activeLang === "ta" ? "600" : "normal",
                  }}
                >
                  Tamil
                </button>
                <button
                  type="button"
                  onClick={handleSwitchToEnglish}
                  disabled={translating}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "6px",
                    border: activeLang === "en" ? "2px solid #ff008c" : "1px solid #ccc",
                    background: activeLang === "en" ? "#ffd0e8" : "#fff",
                    cursor: translating ? "not-allowed" : "pointer",
                    fontWeight: activeLang === "en" ? "600" : "normal",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {translating ? (
                    <>
                      <span className="newsform-loading-spinner" style={{
                        width: "14px",
                        height: "14px",
                        border: "2px solid #eee",
                        borderTopColor: "#ff008c",
                        borderRadius: "50%",
                        animation: "newsform-spin 0.8s linear infinite",
                      }} />
                      Translating...
                    </>
                  ) : (
                    "English"
                  )}
                </button>
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
                  className="form-file"
                />

                {thumbnailPreview && (
                  <div className="image-preview">
                    {displayData.thumbnail &&
                    (displayData.thumbnail.type?.startsWith("video/") ||
                      (typeof displayData.thumbnail === "string" &&
                        displayData.thumbnail.includes(".mp4"))) ? (
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
                <label className="form-label">Zonal</label>
                <select
                  name="zonal"
                  value={displayData.zonal || ""}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select a category</option>
                  {allPages.filter(page => page.name.eng !== "Select District").map((page) => (
                    <option key={page.id} value={page.name.eng}>
                      {page.name.eng}
                    </option>
                  ))}
                </select>
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