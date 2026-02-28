import React, { useState, useRef, useEffect } from "react";
import { IoIosClose } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { FaPlay, FaYoutube, FaUpload } from "react-icons/fa";

/**
 * NewsVideoBox
 *
 * Self-contained video component for the Newsform / Templatepage system.
 * Does NOT depend on editpaperSlice. All video data is managed via local
 * state and propagated up through `onUpdate` so the parent can persist it
 * into the newsformSlice (via updateBoxInContainer or updateBoxContent).
 *
 * Props
 * ─────
 * id            – unique box id
 * onDelete      – (id) => void
 * onUpdate      – (id, updates) => void   updates = { videoData, dimensions }
 * initialData   – { videoData, dimensions } from Redux / parent state
 * isInContainer – boolean, controls border style
 */
const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const NewsVideoBox = ({
  id,
  onDelete,
  onUpdate,
  initialData = {},
  isInContainer = false,
}) => {
  const fileInputRef      = useRef(null);
  const thumbnailInputRef = useRef(null);
  const videoRef          = useRef(null);

  // ── local state ──────────────────────────────────────────────────────────
  const [videoData,      setVideoData]      = useState(initialData.videoData  || null);
  const [dimensions,     setDimensions]     = useState({ width: 800, ...(initialData.dimensions || {}) });
  const [isPlaying,      setIsPlaying]      = useState(false);
  const [showEditPopup,  setShowEditPopup]  = useState(false);
  const [showChangeFile, setShowChangeFile] = useState(false);
  const [uploadType,     setUploadType]     = useState(null);   // null | "youtube" | "device"
  const [youtubeUrl,     setYoutubeUrl]     = useState("");
  const [selectedVideo,  setSelectedVideo]  = useState(null);
  const [selectedThumb,  setSelectedThumb]  = useState(null);
  const [videoAspectRatio, setVideoAspectRatio] = useState(16 / 9);
  const [tempWidth,      setTempWidth]      = useState(dimensions.width);

  // sync if parent passes updated initialData (e.g. when loading a saved news)
  useEffect(() => {
    setVideoData(initialData.videoData || null);
    setDimensions({ width: 800, ...(initialData.dimensions || {}) });
    setTempWidth((initialData.dimensions?.width) || 800);
  }, [id]);

  // detect aspect ratio from selected file
  useEffect(() => {
    if (!selectedVideo) return;
    const vid = document.createElement("video");
    vid.preload = "metadata";
    vid.onloadedmetadata = () => {
      setVideoAspectRatio(vid.videoWidth / vid.videoHeight);
      URL.revokeObjectURL(vid.src);
    };
    vid.src = URL.createObjectURL(selectedVideo);
  }, [selectedVideo]);

  // detect aspect ratio from saved videoData
  useEffect(() => {
    if (!videoData) return;
    if (videoData.type === "youtube") {
      setVideoAspectRatio(16 / 9);
    } else if (videoData.type === "device") {
      const vid = document.createElement("video");
      vid.preload = "metadata";
      vid.onloadedmetadata = () => {
        setVideoAspectRatio(vid.videoWidth / vid.videoHeight);
        URL.revokeObjectURL(vid.src);
      };
      if (videoData.videoUrl) {
        vid.src = videoData.videoUrl;
      }
    }
  }, [videoData]);

  // ── helpers ──────────────────────────────────────────────────────────────
  const propagate = (newVideoData, newDimensions) => {
    onUpdate?.(id, { videoData: newVideoData, dimensions: newDimensions });
  };

  const extractYouTubeId = (url) => {
    const m = url.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
    return m && m[2].length === 11 ? m[2] : null;
  };

  const getPaddingBottom = () =>
    videoAspectRatio < 1 ? `${(1 / videoAspectRatio) * 100}%` : "56.25%";

  // ── upload handlers ───────────────────────────────────────────────────────
  const handleYouTubeUpload = () => {
    const videoId = extractYouTubeId(youtubeUrl);
    if (!videoId) { alert("Please enter a valid YouTube URL"); return; }

    const data = {
      type: "youtube",
      videoId,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    };
    setVideoData(data);
    propagate(data, dimensions);
    setYoutubeUrl("");
    setUploadType(null);
    setShowChangeFile(false);
    setShowEditPopup(false);
  };

  const handleDeviceUpload = async () => {
    if (!selectedVideo || !selectedThumb) {
      alert("Please select both a video file and a thumbnail image");
      return;
    }
    const videoUrl = await readFileAsDataUrl(selectedVideo);
    const thumbnailUrl = await readFileAsDataUrl(selectedThumb);
    const data = {
      type: "device",
      videoUrl,
      thumbnail: thumbnailUrl,
    };
    setVideoData(data);
    propagate(data, dimensions);
    setSelectedVideo(null);
    setSelectedThumb(null);
    setUploadType(null);
    setShowChangeFile(false);
    setShowEditPopup(false);
  };

  const handleWidthChange = (e) => {
    const w = parseInt(e.target.value) || 800;
    setTempWidth(w);
    const newDims = { ...dimensions, width: w };
    setDimensions(newDims);
    propagate(videoData, newDims);
  };

  const handleChangeFile = () => {
    setUploadType(videoData?.type || null);
    setYoutubeUrl("");
    setSelectedVideo(null);
    setSelectedThumb(null);
    setShowChangeFile(true);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(id);
  };

  // ── upload UI renderer ────────────────────────────────────────────────────
  const renderUploadUI = () => {
    if (!uploadType) {
      return (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <h3 style={{ marginBottom: "30px", color: "#333", fontSize: "16px" }}>
            Choose Upload Method
          </h3>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setUploadType("youtube")}
              style={uploadBtnStyle("#ff0000")}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#cc0000")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#ff0000")}
            >
              <FaYoutube size={22} /> YouTube
            </button>
            <button
              onClick={() => setUploadType("device")}
              style={uploadBtnStyle("#2196F3")}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1976D2")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#2196F3")}
            >
              <FaUpload size={20} /> Device
            </button>
          </div>
        </div>
      );
    }

    if (uploadType === "youtube") {
      return (
        <div style={{ padding: "30px" }}>
          <h3 style={{ marginBottom: "16px", color: "#333", fontSize: "15px" }}>
            YouTube Video URL
          </h3>
          <input
            type="text"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="Paste YouTube URL here…"
            style={inputStyle}
          />
          <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            <button onClick={handleYouTubeUpload} style={actionBtn("#ff0000")}>Upload</button>
            <button onClick={() => { setUploadType(null); setYoutubeUrl(""); }} style={actionBtn("#999")}>Back</button>
          </div>
        </div>
      );
    }

    if (uploadType === "device") {
      return (
        <div style={{ padding: "30px" }}>
          <h3 style={{ marginBottom: "16px", color: "#333", fontSize: "15px" }}>
            Upload from Device
          </h3>
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Video File</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={(e) => setSelectedVideo(e.target.files[0])}
              style={inputStyle}
            />
            {selectedVideo && <p style={fileNameStyle}>{selectedVideo.name}</p>}
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Thumbnail Image</label>
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedThumb(e.target.files[0])}
              style={inputStyle}
            />
            {selectedThumb && <p style={fileNameStyle}>{selectedThumb.name}</p>}
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleDeviceUpload}
              disabled={!selectedVideo || !selectedThumb}
              style={actionBtn(selectedVideo && selectedThumb ? "#2196F3" : "#ccc")}
            >
              Upload
            </button>
            <button
              onClick={() => { setUploadType(null); setSelectedVideo(null); setSelectedThumb(null); }}
              style={actionBtn("#999")}
            >
              Back
            </button>
          </div>
        </div>
      );
    }
  };

  // ── container width for display ───────────────────────────────────────────
  const containerWidth = dimensions.width;
  const displayWidth   = videoAspectRatio < 1
    ? Math.min(containerWidth * 0.6, 600)
    : containerWidth;

  // ── upload / empty state ──────────────────────────────────────────────────
  if (!videoData) {
    return (
      <div style={{
        width: `${containerWidth}px`,
        margin: "0 auto",
        border: isInContainer ? "1px solid #ddd" : "2px solid #ddd",
        borderRadius: "8px",
        background: "#f5f5f5",
        minHeight: "300px",
        position: "relative",
      }}>
        {/* Delete button */}
        <button
          onDoubleClick={handleDelete}
          title="Double-click to remove"
          style={cornerBtnStyle("red", { top: 8, right: 8 })}
        >
          <IoIosClose size={20} />
        </button>
        {renderUploadUI()}
      </div>
    );
  }

  // ── video display ─────────────────────────────────────────────────────────
  return (
    <div style={{
      width: `${displayWidth}px`,
      margin: "0 auto",
      position: "relative",
      borderRadius: "8px",
      overflow: "hidden",
      background: "#000",
      border: isInContainer ? "1px solid #444" : "2px solid #444",
    }}>
      {/* Controls row */}
      <div style={{
        position: "absolute", top: 8, right: 8,
        display: "flex", gap: "8px", zIndex: 20,
      }}>
        <button
          onClick={() => setShowEditPopup((v) => !v)}
          title="Edit settings"
          style={cornerBtnStyle("rgba(255,255,255,0.9)")}
        >
          <MdEdit style={{ color: "#333", fontSize: "16px" }} />
        </button>
        <button
          onDoubleClick={handleDelete}
          title="Double-click to delete"
          style={cornerBtnStyle("rgba(255,255,255,0.9)")}
        >
          <IoIosClose style={{ color: "red", fontSize: "22px" }} />
        </button>
      </div>

      {/* Edit popup */}
      {showEditPopup && (
        <div style={editPopupStyle}>
          <div style={{ marginBottom: "12px" }}>
            <label style={labelStyle}>Container Width (px)</label>
            <input
              type="number"
              value={tempWidth}
              onChange={handleWidthChange}
              min="200"
              max="1200"
              style={{ ...inputStyle, marginTop: "4px" }}
            />
          </div>
          <button onClick={handleChangeFile} style={{ ...actionBtn("#2196F3"), marginBottom: "8px", width: "100%" }}>
            Change Video
          </button>
          <button onClick={() => setShowEditPopup(false)} style={{ ...actionBtn("#999"), width: "100%" }}>
            Close
          </button>
        </div>
      )}

      {/* Change file overlay */}
      {showChangeFile && (
        <div style={changeFileOverlayStyle}>
          <div style={changeFileInnerStyle}>
            <button
              onClick={() => { setShowChangeFile(false); setUploadType(null); }}
              style={{ position: "absolute", top: 8, right: 8, background: "none", border: "none", cursor: "pointer", fontSize: "22px", color: "#999" }}
            >
              <IoIosClose />
            </button>
            {renderUploadUI()}
          </div>
        </div>
      )}

      {/* Thumbnail + play button */}
      {!isPlaying && (
        <div style={{ position: "relative", width: "100%", paddingBottom: getPaddingBottom(), background: "#000" }}>
          <img
            src={videoData.thumbnail}
            alt="Video thumbnail"
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          <button
            onClick={() => setIsPlaying(true)}
            style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%",
              width: "72px", height: "72px",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: "26px", color: "#333",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)")}
          >
            <FaPlay style={{ marginLeft: "4px" }} />
          </button>
        </div>
      )}

      {/* Video player */}
      {isPlaying && (
        <div style={{ position: "relative", width: "100%", paddingBottom: getPaddingBottom() }}>
          {videoData.type === "youtube" ? (
            <iframe
              ref={videoRef}
              src={`https://www.youtube.com/embed/${videoData.videoId}?autoplay=1`}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <video
              ref={videoRef}
              src={videoData.videoUrl}
              controls
              autoPlay
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "contain" }}
              onEnded={() => setIsPlaying(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

// ── micro style helpers ──────────────────────────────────────────────────────
const uploadBtnStyle = (bg) => ({
  padding: "16px 24px", fontSize: "15px",
  background: bg, color: "white",
  border: "none", borderRadius: "8px",
  cursor: "pointer", display: "flex",
  alignItems: "center", gap: "8px",
  transition: "background 0.2s",
});

const actionBtn = (bg) => ({
  padding: "10px 20px", fontSize: "13px",
  background: bg, color: "white",
  border: "none", borderRadius: "4px", cursor: "pointer",
});

const cornerBtnStyle = (bg, extra = {}) => ({
  background: bg, border: "1px solid #ccc",
  borderRadius: "4px", cursor: "pointer",
  padding: "4px 6px", display: "flex",
  alignItems: "center", justifyContent: "center",
  ...extra,
});

const inputStyle = {
  width: "100%", padding: "8px",
  border: "2px solid #ddd", borderRadius: "4px",
  fontSize: "13px", boxSizing: "border-box",
};

const labelStyle = {
  display: "block", marginBottom: "6px",
  fontWeight: "500", fontSize: "13px", color: "#444",
};

const fileNameStyle = {
  marginTop: "6px", fontSize: "11px", color: "#666",
};

const editPopupStyle = {
  position: "absolute", top: "50px", right: "8px",
  background: "white", border: "1px solid #ccc",
  borderRadius: "8px", padding: "16px",
  zIndex: 30, boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  minWidth: "220px",
};

const changeFileOverlayStyle = {
  position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(0,0,0,0.9)", zIndex: 40,
  display: "flex", alignItems: "center", justifyContent: "center",
};

const changeFileInnerStyle = {
  background: "white", borderRadius: "8px",
  padding: "20px", maxWidth: "480px",
  width: "90%", position: "relative",
};

export default NewsVideoBox;
