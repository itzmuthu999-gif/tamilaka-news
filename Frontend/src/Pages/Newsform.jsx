import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setNewsData } from "./Slice/newsformslice";


export default function  Newsform({ addbx, rmvbx, handleDecreaseClick,handleIncreaseClick,handleInputChange,divHeight }) {
    const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    headline: "",
    oneLiner: "",
    thumbnail: null,
    zonal: "",
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(null); // 👈 for single thumbnail
  const [multiPreviews, setMultiPreviews] = useState([]); // 👈 for multiple import images

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });

      if (name === "thumbnail") {
        const imagePreviewUrl = URL.createObjectURL(file);
        setThumbnailPreview(imagePreviewUrl);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleMultiImages = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...files],
    }));

    setMultiPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setNewsData(formData));
    console.log("Form Submitted:", formData);
    alert("News uploaded successfully!");
  };

  return (
    <div className="newsform-con">
      <form onSubmit={handleSubmit} className="news-form">
        {/* News Headline */}
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

        {/* News One-Liner */}
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

        {/* Thumbnail Image */}
        <div className="form-group">
          <label className="form-label">Thumbnail Image</label>
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleChange}
            className="form-file"
            required
          />

          {/* 👇 Single Image Preview */}
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

        {/* Zonal */}
        <div className="form-group">
          <label className="form-label">Zonal</label>
          <textarea
            name="zonal"
            value={formData.zonal}
            onChange={handleChange}
            placeholder="Enter zone (e.g., North, South, etc.)"
            className="form-textarea"
            rows="2"
            required
          />
        </div>

        {/* Upload Button */}
        <button type="submit" className="upload-button">
          Upload
        </button>

 
      </form>
<button onClick={() => addbx("paragraph")}>➕ Add Paragraph</button>
<button onClick={() => addbx("image")}>🖼️ Add Image</button>
   <input
        type="number"
        value={divHeight}
        onChange={handleInputChange}
        style={{ width: '100px' }}
      />


    </div>
  );
}
