import React, { useState, useRef, useEffect } from "react";
import { IoIosClose } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { FaPlay, FaPause, FaYoutube, FaUpload } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { uploadVideoWithThumbnail } from "../../../Api/uploadApi";
import {
  updateVideoData,
  updateVideoDimensions,
  removeSlotFromContainer,
  removeSlotFromNestedContainer,
  removeSlotFromContainerSlider,
} from "../../Slice/editpaperSlice/editpaperslice";

const VideoContainer = ({
  border = false,
  onDelete,
  slotId,
  catName,
  containerId,
  sliderId,
  isSlider = false,
  isSlider2 = false,
  isNested = false,
  parentContainerId = null,
}) => {
  const dispatch = useDispatch();
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  // Get slot data from Redux
  const slot = useSelector((state) => {
    const page = state.editpaper.pages.find((p) => p.catName === catName);
    
    if (isSlider || isSlider2) {
      const slider = page?.containers.find((c) => c.id === containerId)
        ?.sliders?.find((s) => s.id === sliderId);
      return slider?.items.find((i) => i.slotId === slotId);
    } else if (isNested && parentContainerId) {
      const nestedCont = page?.containers.find((c) => c.id === parentContainerId)
        ?.nestedContainers?.find((nc) => nc.id === containerId);
      return nestedCont?.items?.find((i) => i.slotId === slotId);
    } else {
      const container = page?.containers.find((c) => c.id === containerId);
      return container?.items.find((i) => i.slotId === slotId);
    }
  });

  const videoData = slot?.videoData;
  const containerWidth = slot?.dimensions?.width || 800;

  const [isPlaying, setIsPlaying] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showUploadUI, setShowUploadUI] = useState(!videoData);
  const [uploadType, setUploadType] = useState(null); // 'youtube' or 'device'
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [tempWidth, setTempWidth] = useState(containerWidth);
  const [showChangeFile, setShowChangeFile] = useState(false);
  const [videoAspectRatio, setVideoAspectRatio] = useState(16 / 9); // Default to 16:9
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setTempWidth(containerWidth);
  }, [containerWidth]);

  // Detect video dimensions when video file is selected
  useEffect(() => {
    if (selectedVideo) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        const aspectRatio = video.videoWidth / video.videoHeight;
        setVideoAspectRatio(aspectRatio);
        URL.revokeObjectURL(video.src);
      };
      
      video.src = URL.createObjectURL(selectedVideo);
    }
  }, [selectedVideo]);

  // Detect aspect ratio from existing video data
  useEffect(() => {
    if (videoData?.type === "device" && videoData?.videoFile) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        const aspectRatio = video.videoWidth / video.videoHeight;
        setVideoAspectRatio(aspectRatio);
        URL.revokeObjectURL(video.src);
      };
      
      if (videoData.videoFile instanceof File) {
        video.src = URL.createObjectURL(videoData.videoFile);
      } else if (videoData.videoUrl) {
        video.src = videoData.videoUrl;
      }
    } else if (videoData?.type === "youtube") {
      // YouTube videos default to 16:9
      setVideoAspectRatio(16 / 9);
    }
  }, [videoData]);

  const extractYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleYouTubeUpload = () => {
    const videoId = extractYouTubeVideoId(youtubeUrl);
    if (videoId) {
      const data = {
        type: "youtube",
        videoId: videoId,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      };
      
      dispatch(
        updateVideoData({
          catName,
          containerId,
          slotId,
          videoData: data,
          isNested,
          parentContainerId,
          sliderId: isSlider || isSlider2 ? sliderId : null,
        })
      );
      
      setShowUploadUI(false);
      setShowChangeFile(false); // FIX: Close the change file popup
      setUploadType(null);
      setYoutubeUrl("");
      setShowEditPopup(false); // FIX: Close the edit popup as well
    } else {
      alert("Please enter a valid YouTube URL");
    }
  };

  const handleDeviceUpload = async () => {
    if (!selectedVideo || !selectedThumbnail) {
      alert("Please select both video and thumbnail files");
      return;
    }

    try {
      setIsUploading(true);
      const { videoUrl, thumbnailUrl } = await uploadVideoWithThumbnail(
        selectedVideo,
        selectedThumbnail
      );

      const data = {
        type: "device",
        videoUrl,
        thumbnail: thumbnailUrl,
      };

      dispatch(
        updateVideoData({
          catName,
          containerId,
          slotId,
          videoData: data,
          isNested,
          parentContainerId,
          sliderId: isSlider || isSlider2 ? sliderId : null,
        })
      );

      setShowUploadUI(false);
      setShowChangeFile(false);
      setUploadType(null);
      setSelectedVideo(null);
      setSelectedThumbnail(null);
      setShowEditPopup(false);
    } catch (error) {
      console.error("Video upload failed:", error);
      alert("Video upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePlayPause = () => {
    // Simply toggle the playing state for all video types
    // The video element will auto-play when rendered due to autoPlay prop
    setIsPlaying(true);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.();
  };

  const handleWidthChange = (e) => {
    const newWidth = parseInt(e.target.value) || 800;
    setTempWidth(newWidth);
    dispatch(
      updateVideoDimensions({
        catName,
        containerId,
        slotId,
        width: newWidth,
        isNested,
        parentContainerId,
        sliderId: isSlider || isSlider2 ? sliderId : null,
      })
    );
  };

  const handleChangeFile = () => {
    setShowChangeFile(true);
    setUploadType(videoData?.type || null); // FIX: Set to current type instead of null
    if (videoData?.type === "youtube") {
      setYoutubeUrl("");
    } else {
      setSelectedVideo(null);
      setSelectedThumbnail(null);
    }
  };

  const renderUploadUI = () => {
    if (!uploadType) {
      return (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <h3 style={{ marginBottom: "30px", color: "#333" }}>Choose Upload Method</h3>
          <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
            <button
              onClick={() => setUploadType("youtube")}
              style={{
                padding: "20px 30px",
                fontSize: "16px",
                background: "#ff0000",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#cc0000";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#ff0000";
              }}
            >
              <FaYoutube size={24} />
              Upload YouTube Video
            </button>
            <button
              onClick={() => setUploadType("device")}
              style={{
                padding: "20px 30px",
                fontSize: "16px",
                background: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1976D2";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#2196F3";
              }}
            >
              <FaUpload size={20} />
              Upload from Device
            </button>
          </div>
        </div>
      );
    }

    if (uploadType === "youtube") {
      return (
        <div style={{ padding: "30px" }}>
          <h3 style={{ marginBottom: "20px", color: "#333" }}>YouTube Video URL</h3>
          <input
            type="text"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="Paste YouTube URL here"
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "14px",
              border: "2px solid #ddd",
              borderRadius: "4px",
              marginBottom: "20px",
            }}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleYouTubeUpload}
              style={{
                padding: "12px 24px",
                fontSize: "14px",
                background: "#ff0000",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Upload
            </button>
            <button
              onClick={() => {
                setUploadType(null);
                setYoutubeUrl("");
              }}
              style={{
                padding: "12px 24px",
                fontSize: "14px",
                background: "#999",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Back
            </button>
          </div>
        </div>
      );
    }

    if (uploadType === "device") {
      return (
        <div style={{ padding: "30px" }}>
          <h3 style={{ marginBottom: "20px", color: "#333" }}>Upload from Device</h3>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
              Video File
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={(e) => setSelectedVideo(e.target.files[0])}
              style={{
                width: "100%",
                padding: "8px",
                border: "2px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            />
            {selectedVideo && (
              <p style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>
                Selected: {selectedVideo.name}
              </p>
            )}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
              Thumbnail Image
            </label>
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedThumbnail(e.target.files[0])}
              style={{
                width: "100%",
                padding: "8px",
                border: "2px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            />
            {selectedThumbnail && (
              <p style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>
                Selected: {selectedThumbnail.name}
              </p>
            )}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleDeviceUpload}
              disabled={!selectedVideo || !selectedThumbnail || isUploading}
              style={{
                padding: "12px 24px",
                fontSize: "14px",
                background: selectedVideo && selectedThumbnail && !isUploading ? "#2196F3" : "#ccc",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: selectedVideo && selectedThumbnail && !isUploading ? "pointer" : "not-allowed",
              }}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
            <button
              onClick={() => {
                setUploadType(null);
                setSelectedVideo(null);
                setSelectedThumbnail(null);
              }}
              style={{
                padding: "12px 24px",
                fontSize: "14px",
                background: "#999",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Back
            </button>
          </div>
        </div>
      );
    }
  };

  // FIX: Calculate padding based on aspect ratio for vertical videos
  const getPaddingBottom = () => {
    if (videoAspectRatio < 1) {
      // Vertical video (e.g., 9:16)
      return `${(1 / videoAspectRatio) * 100}%`;
    } else {
      // Horizontal video (e.g., 16:9)
      return "56.25%"; // Default 16:9
    }
  };

  // FIX: Determine container styling - make width independent of parent
  const getContainerStyle = () => {
    const baseStyle = {
      width: `${containerWidth}px`, // Fixed width, not relative to parent
      margin: "0 auto",
      position: "relative",
      border: border ? "2px solid #ddd" : "none",
      borderRadius: "8px",
      overflow: "hidden",
      background: "#000",
    };

    // For vertical videos, adjust width proportionally
    if (videoAspectRatio < 1) {
      return {
        ...baseStyle,
        width: `${Math.min(containerWidth * 0.6, 600)}px`, // Proportional width for vertical videos
      };
    }

    return baseStyle;
  };

  if (showUploadUI) {
    return (
      <div
        style={{
          width: `${containerWidth}px`, // Fixed width, independent of parent
          margin: "0 auto",
          position: "relative",
          border: border ? "2px solid #ddd" : "none",
          borderRadius: "8px",
          overflow: "hidden",
          background: "#f5f5f5",
          minHeight: "400px",
        }}
      >
        {renderUploadUI()}
      </div>
    );
  }

  if (!videoData) return null;

  return (
    <div style={getContainerStyle()}>
      {border && (
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            display: "flex",
            gap: "8px",
            zIndex: 20,
          }}
        >
          <button
            onClick={() => setShowEditPopup(!showEditPopup)}
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              color: "#333",
              fontWeight: "bold",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "18px",
              padding: "6px 10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <MdEdit />
          </button>

          <button
            onDoubleClick={handleDelete}
            title="Double click to delete"
            style={{
              fontWeight: "bold",
              background: "rgba(255, 255, 255, 0.9)",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "24px",
              color: "red",
              padding: "4px 8px",
            }}
          >
            <IoIosClose />
          </button>
        </div>
      )}

      {showEditPopup && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            right: "8px",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "15px",
            zIndex: 30,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            minWidth: "250px",
          }}
        >
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "13px" }}>
              Container Width (px)
            </label>
            <input
              type="number"
              value={tempWidth}
              onChange={handleWidthChange}
              min="400"
              max="1200"
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "13px",
              }}
            />
          </div>

          <button
            onClick={handleChangeFile}
            style={{
              width: "100%",
              padding: "10px",
              background: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
              marginBottom: "10px",
            }}
          >
            Change Video
          </button>

          <button
            onClick={() => setShowEditPopup(false)}
            style={{
              width: "100%",
              padding: "10px",
              background: "#999",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            Close
          </button>
        </div>
      )}

      {showChangeFile && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.95)",
            zIndex: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "8px",
              padding: "20px",
              maxWidth: "500px",
              width: "90%",
              position: "relative",
            }}
          >
            <button
              onClick={() => {
                setShowChangeFile(false);
                setUploadType(null);
              }}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "transparent",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#999",
              }}
            >
              <IoIosClose />
            </button>
            {renderUploadUI()}
          </div>
        </div>
      )}

      {!isPlaying && (
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingBottom: getPaddingBottom(), // FIX: Dynamic padding based on aspect ratio
            background: "#000",
          }}
        >
          <img
            src={videoData.thumbnail}
            alt="Video thumbnail"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <button
            onClick={handlePlayPause}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "rgba(255, 255, 255, 0.9)",
              border: "none",
              borderRadius: "50%",
              width: "80px",
              height: "80px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "30px",
              color: "#333",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)";
            }}
          >
            <FaPlay style={{ marginLeft: "5px" }} />
          </button>
        </div>
      )}

      {isPlaying && (
        <div style={{ position: "relative", width: "100%", paddingBottom: getPaddingBottom() }}>
          {videoData.type === "youtube" ? (
            <iframe
              ref={videoRef}
              src={`https://www.youtube.com/embed/${videoData.videoId}?autoplay=1`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <video
              ref={videoRef}
              src={videoData.videoUrl}
              controls
              autoPlay
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain", // FIX: Use contain to show full video
              }}
              onEnded={() => setIsPlaying(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default VideoContainer;

