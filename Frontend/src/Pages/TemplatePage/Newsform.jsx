import React, { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import { AiOutlineSlack } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";
import layout1 from  "../../assets/Layout1.png"
import layout2 from  "../../assets/Layout2.png"
import { useDispatch } from "react-redux";
import { setLayout } from "../Slice/newsformslice.js";
import { useSelector } from "react-redux";
import "../TemplatePage/Templatepage.scss"


export default function Newsform({
  initialData = null,
  onChange = () => {},
  onSave = () => {},
  addbx,
  handleInputChange,
  divHeight
}) {
  const [formData, setFormData] = useState({
    headline: "",
    oneLiner: "",
    thumbnail: null,
    zonal: "",
    author: "", 
    images: []
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [openForm, setOpenForm] = useState(false); // <-- NEW
  const dispatch = useDispatch();
  const MLayout = useSelector(state => state.newsform.MLayout);


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
        } catch(e) { console.log(e)}
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



  const submit = (e) => {
    e && e.preventDefault();
    onSave(formData);
  };

  /* ------------------------------ UI RETURN ------------------------------ */
  return (
    <div  className="form-main-cont">
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
          default={{ x: 1080, y:0, width: 450, height: 700 }}
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
                <label className="form-label">Author</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
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
      {/* Check file type and render accordingly */}
      {formData.thumbnail && 
       (formData.thumbnail.type?.startsWith('video/') || 
        (typeof formData.thumbnail === 'string' && formData.thumbnail.includes('.mp4'))) ? (
        <video
          src={thumbnailPreview}
          controls
          style={{
            width: '100%',
            maxHeight: '200px',
            borderRadius: '8px'
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
                <label className="form-label">Zonar</label>
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

              <div className="add-pi">
                              <div className="add-para"  onClick={() => addbx("paragraph")}>Add Paragraph</div>
              <div className="add-img"  onClick={() => addbx("image")}>Add Image</div>
              
              </div>
              <div className="inc-ht">  
                <div className="inc-ht-txt">Main News Container height:</div>
                <div className="inc-ht-inp"><input  
                type="number"
                value={divHeight}
                onChange={handleInputChange}
                style={{ width: "100px" }}
              /></div>

              </div>
              <div>Select Layout</div>
<div className="layout-encloser" style={{display: "flex", gap: "10px", margin: "10px"}}> 
  <div
  className="layout lone"
  onClick={() => dispatch(setLayout(1))}
  style={{
    border: MLayout === 1 ? "3px solid #ff008c" : "3px solid #ffcce5",
    background: MLayout === 1 ? "#ffd0e8" : "#ffe6f2",
    borderRadius: "10px",
    padding: "5px",
    cursor: "pointer",
    transition: "0.3s",
    marginBottom: "10px"
  }}
>
  <img src={layout1} style={{ width: "100%", borderRadius: "8px" }} />
</div>

<div
  className="layout ltwo"
  onClick={() => dispatch(setLayout(2))}
  style={{
    border: MLayout === 2 ? "3px solid #ff008c" : "3px solid #ffcce5",
    background: MLayout === 2 ? "#ffd0e8" : "#ffe6f2",
    borderRadius: "10px",
    padding: "5px",
    cursor: "pointer",
    transition: "0.3s"
  }}
>
  <img src={layout2} style={{ width: "100%", borderRadius: "8px" }} />
</div>
</div>


              <button type="submit" onClick={submit} className="upload-button">
                Preview / Apply
              </button>


<div>
  <div>
</div>

                 
              </div>
            </form>
          </div>
        </Rnd>
      )}
    </div>
  );
}
