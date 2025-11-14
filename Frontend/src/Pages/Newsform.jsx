import React, { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import { AiOutlineSlack } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";

export default function Newsform({
  initialData = null,
  onChange = () => {},
  onSave = () => {},
  addbx,
  rmvbx,
  handleDecreaseClick,
  handleIncreaseClick,
  handleInputChange,
  divHeight
}) {
  const [formData, setFormData] = useState({
    headline: "",
    oneLiner: "",
    thumbnail: null,
    zonal: "",
    images: []
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [multiPreviews, setMultiPreviews] = useState([]);

  const [openForm, setOpenForm] = useState(false); // <-- NEW

  // Initialize when editing
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData.data }));
      if (initialData.data && initialData.data.thumbnail) {
        try {
          if (typeof initialData.data.thumbnail === "string") {
            setThumbnailPreview(initialData.data.thumbnail);
          } else {
            setThumbnailPreview(URL.createObjectURL(initialData.data.thumbnail));
          }
        } catch {}
      }
    }
  }, [initialData]);

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));

      if (name === "thumbnail") {
        setThumbnailPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiImages = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => URL.createObjectURL(file));

    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), ...files]
    }));

    setMultiPreviews(prev => [...prev, ...newPreviews]);
  };

  const submit = (e) => {
    e && e.preventDefault();
    onSave(formData);
  };

  /* ------------------------------ UI RETURN ------------------------------ */
  return (
    <div>
      {/* Floating Icon (initial stage) */}
      {!openForm && (
        <div
          onClick={() => setOpenForm(true)}
          style={{
            position: "fixed",
            top: 20,
            left: 20,
            fontSize: "40px",
            cursor: "pointer",
            zIndex: 9999
          }}
        >
          <AiOutlineSlack />
        </div>
      )}

      {/* Draggable + Resizable Form */}
      {openForm && (
        <Rnd
          default={{ x: 20, y: 20, width: 350, height: "auto" }}
          bounds="window"
          dragHandleClassName="drag-header"
          style={{
            background: "white",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
            padding: "10px",
            zIndex: 9999
          }}
        >
          {/* Drag Header + Close Button */}
          <div
            className="drag-header"
            style={{
              fontWeight: "bold",
              cursor: "move",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <span>News Form</span>
            <FaTimes
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => setOpenForm(false)}
            />
          </div>

          {/* Actual form */}
          <div className="newsform-con">
            <form onSubmit={submit} className="news-form">

              <div className="form-group">
                <label className="form-label">News Headline</label>
                <textarea
                  name="headline"
                  value={formData.headline}
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
                  value={formData.oneLiner}
                  onChange={handleChange}
                  placeholder="Enter a short one-liner"
                  className="form-textarea"
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Thumbnail Image</label>
                <input
                  type="file"
                  name="thumbnail"
                  accept="image/*"
                  onChange={handleChange}
                  className="form-file"
                />

                {thumbnailPreview && (
                  <div className="image-preview">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail Preview"
                      className="preview-img"
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Zonal</label>
                <textarea
                  name="zonal"
                  value={formData.zonal}
                  onChange={handleChange}
                  placeholder="Enter zone"
                  className="form-textarea"
                  rows="2"
                  required
                />
              </div>

              <div onClick={() => addbx("paragraph")}>Add Paragraph</div>
              <div onClick={() => addbx("image")}>Add Image</div>

              <input
                type="number"
                value={divHeight}
                onChange={handleInputChange}
                style={{ width: "100px" }}
              />

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
