import React, { useState, useRef, useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import { useSelector } from "react-redux";

/**
 * PreviewVideoContainer
 *
 * Public-facing video player. No edit / close / width controls.
 * - Reads videoData and containerWidth from Redux slot dimensions.
 * - Play button uses dark-pink theme (#e91e63).
 * - YouTube → iframe embed on click.
 * - Device video → shows thumbnail, then plays the <video> on click.
 * - Aspect ratio is calculated from the actual video metadata for device
 *   uploads, and defaults to 16:9 for YouTube.
 */
const PreviewVideoContainer = ({
  catName,
  containerId,
  slotId,
  isSlider = false,
  isSlider2 = false,
  isNested = false,
  parentContainerId = null,
  sliderId = null,
}) => {
  const videoRef = useRef(null);

  // ── Read slot from Redux (mirrors editor's selector) ──────────────────────
  const slot = useSelector((state) => {
    const page = state.editpaper.pages.find((p) => p.catName === catName);

    if (isSlider || isSlider2) {
      const slider = page?.containers
        .find((c) => c.id === containerId)
        ?.sliders?.find((s) => s.id === sliderId);
      return slider?.items.find((i) => i.slotId === slotId);
    } else if (isNested && parentContainerId) {
      const nestedCont = page?.containers
        .find((c) => c.id === parentContainerId)
        ?.nestedContainers?.find((nc) => nc.id === containerId);
      return nestedCont?.items?.find((i) => i.slotId === slotId);
    } else {
      const container = page?.containers.find((c) => c.id === containerId);
      return container?.items.find((i) => i.slotId === slotId);
    }
  });

  const videoData = slot?.videoData;
  // Use width saved by the editor; fall back to 800
  const containerWidth = slot?.dimensions?.width || 800;

  const [isPlaying, setIsPlaying] = useState(false);
  const [videoAspectRatio, setVideoAspectRatio] = useState(16 / 9);

  // Detect aspect ratio from device video metadata
  useEffect(() => {
    if (videoData?.type === "device") {
      const vid = document.createElement("video");
      vid.preload = "metadata";
      vid.onloadedmetadata = () => {
        if (vid.videoWidth && vid.videoHeight) {
          setVideoAspectRatio(vid.videoWidth / vid.videoHeight);
        }
        URL.revokeObjectURL(vid.src);
      };
      if (videoData.videoFile instanceof File) {
        vid.src = URL.createObjectURL(videoData.videoFile);
      } else if (videoData.videoUrl) {
        vid.src = videoData.videoUrl;
      }
    } else if (videoData?.type === "youtube") {
      setVideoAspectRatio(16 / 9);
    }
  }, [videoData]);

  if (!videoData) return null;

  // Padding-bottom trick for responsive aspect-ratio box
  const paddingBottom =
    videoAspectRatio < 1
      ? `${(1 / videoAspectRatio) * 100}%`
      : "56.25%";

  // For vertical videos, constrain the width so the box isn't too tall
  const resolvedWidth =
    videoAspectRatio < 1
      ? Math.min(containerWidth * 0.6, 600)
      : containerWidth;

  const wrapperStyle = {
    width: `${resolvedWidth}px`,
    position: "relative",
    borderRadius: "8px",
    overflow: "hidden",
    background: "#000",
  };

  const playBtnStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // ── Dark-pink theme ──
    background: "#e91e63",
    border: "none",
    borderRadius: "50%",
    width: "80px",
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "28px",
    color: "#fff",
    boxShadow: "0 4px 16px rgba(233,30,99,0.5)",
    transition: "transform 0.2s, box-shadow 0.2s",
    zIndex: 5,
  };

  return (
    <div style={wrapperStyle}>
      {/* ── Thumbnail + play button ── */}
      {!isPlaying && (
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingBottom,
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
            onClick={() => setIsPlaying(true)}
            style={playBtnStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translate(-50%, -50%) scale(1.12)";
              e.currentTarget.style.boxShadow =
                "0 6px 22px rgba(233,30,99,0.7)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translate(-50%, -50%)";
              e.currentTarget.style.boxShadow =
                "0 4px 16px rgba(233,30,99,0.5)";
            }}
          >
            <FaPlay style={{ marginLeft: "4px" }} />
          </button>
        </div>
      )}

      {/* ── Playing state ── */}
      {isPlaying && (
        <div
          style={{ position: "relative", width: "100%", paddingBottom }}
        >
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
              title="YouTube video"
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
                objectFit: "contain",
              }}
              onEnded={() => setIsPlaying(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PreviewVideoContainer;