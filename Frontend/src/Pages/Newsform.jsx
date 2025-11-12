import React from 'react'
import { useState } from 'react';
export default function Newsform() {
   const [formData, setFormData] = useState({
    headline: "",
    oneLiner: "",
    thumbnail: null,
    zonal: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("News uploaded successfully!");
  };
  return (
    <div className='newsform-con'>

      <form onSubmit={handleSubmit} className="news-form">
        {/* News Headline */}
        <div className="form-group">
          <label className="form-label">News Headline</label>
          <input
            type="text"
            name="headline"
            value={formData.headline}
            onChange={handleChange}
            placeholder="Enter news headline"
            className="form-input"
            required
          />
        </div>

        {/* News One-Liner */}
        <div className="form-group">
          <label className="form-label">News One-Liner</label>
          <input
            type="text"
            name="oneLiner"
            value={formData.oneLiner}
            onChange={handleChange}
            placeholder="Enter a short one-liner"
            className="form-input"
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
        </div>

        {/* Zonal */}
        <div className="form-group">
          <label className="form-label">Zonal</label>
          <input
            type="text"
            name="zonal"
            value={formData.zonal}
            onChange={handleChange}
            placeholder="Enter zone (e.g., North, South, etc.)"
            className="form-input"
            required
          />
        </div>

        {/* Upload Button */}
        <button type="submit" className="upload-button">
          Upload
        </button>
      </form>
    </div>
  )
}
