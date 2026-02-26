import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import jwt from "../../../assets/jwt.jpg";

const PreviewUniversalNewsContainer = ({
  catName,
  containerId,
  slotId,
  isSlider = false,
  isSlider2 = false,
  isNested = false,
  parentContainerId = null,
  sliderId = null,
}) => {
  const navigate = useNavigate();
  const allNews = useSelector((state) => state.newsform?.allNews || []);

  // Read slot from Redux directly — all values come from here
  const slot = useSelector((state) => {
    const page = state.editpaper.pages.find((p) => p.catName === catName);
    if (!page) return null;

    if ((isSlider || isSlider2) && sliderId) {
      let slider = null;
      if (isNested && parentContainerId) {
        slider = page.containers
          ?.find((c) => c.id === parentContainerId)
          ?.nestedContainers?.find((nc) => nc.id === containerId)
          ?.sliders?.find((s) => s.id === sliderId);
      } else {
        slider = page.containers
          ?.find((c) => c.id === containerId)
          ?.sliders?.find((s) => s.id === sliderId);
      }
      return slider?.items?.find((i) => i.slotId === slotId) ?? null;
    } else if (isNested && parentContainerId) {
      const nestedCont = page.containers
        ?.find((c) => c.id === parentContainerId)
        ?.nestedContainers?.find((nc) => nc.id === containerId);
      return nestedCont?.items?.find((i) => i.slotId === slotId) ?? null;
    } else {
      const container = page.containers?.find((c) => c.id === containerId);
      return container?.items?.find((i) => i.slotId === slotId) ?? null;
    }
  });

  // All values read from Redux slot
  const containerWidth  = slot?.dimensions?.containerWidth  ?? 400;
  const containerHeight = slot?.dimensions?.containerHeight ?? 300;
  const imgWidth        = slot?.dimensions?.imgWidth        ?? 400;
  const imgHeight       = slot?.dimensions?.imgHeight       ?? 300;
  const padding         = slot?.dimensions?.padding         ?? 10;
  const version         = slot?.shfval                      ?? 1;
  const showSeparator   = slot?.showSeparator               ?? false;

  const newsId = slot?.newsId;
  const news   = allNews.find((n) => n.id === newsId);

  const DEFAULT_DATA = {
    media:     jwt,
    mediaType: "image",
    headline:  "Breaking News Headline Comes Here",
    content:   "This is a short description of the news.",
    time:      "Just now",
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";
    const now = new Date();
    const newsTime = new Date(timestamp);
    const diffMs = now - newsTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffMonths = Math.floor(diffMs / 2592000000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 30) return `${diffDays} d ago`;
    return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
  };

  const renderData = news
    ? {
        media: (() => {
          const thumb = news.data?.thumbnail || news.data?.video;
          if (!thumb) return DEFAULT_DATA.media;
          if (typeof thumb === "string") return thumb;
          if (thumb instanceof File) return URL.createObjectURL(thumb);
          return DEFAULT_DATA.media;
        })(),
        mediaType: news.data?.video ? "video" : "image",
        headline:  news.data?.headline  || DEFAULT_DATA.headline,
        content:   news.data?.oneLiner  || DEFAULT_DATA.content,
        time:      formatTime(news.time) || DEFAULT_DATA.time,
      }
    : DEFAULT_DATA;

  const handleNavigate = () => {
    if (!newsId) return;
    navigate(`/preview/${newsId}`);
  };

  const imageStyle = {
    width:        `${imgWidth}px`,
    height:       `${imgHeight}px`,
    borderRadius: "5px",
    overflow:     "hidden",
    flexShrink:   0,
  };

  const headlineStyle = {
    fontSize:     "20px",
    fontWeight:   "bold",
  };

  const contentStyle = {
    fontSize:     "14px",

  };

  const timeStyle = {
    fontSize: "12px",
    color:    "gray",
  };

  const renderMedia = () => {
    if (renderData.mediaType === "video") {
      return (
        <video
          src={renderData.media}
          controls
          muted
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      );
    }
    return (
      <img
        src={renderData.media}
        alt=""
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  };

  const renderLayout = () => {
    switch (version) {
      case 1:
        return (
          <div style={{ display: "flex", flexDirection: "column",}}>
            <div style={headlineStyle}>{renderData.headline}</div>
            <div style={imageStyle}>{renderMedia()}</div>
            <div style={contentStyle}>{renderData.content}</div>
            <div style={timeStyle}>{renderData.time}</div>
          </div>
        );
      case 2:
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={headlineStyle}>{renderData.headline}</div>
            <div style={contentStyle}>{renderData.content}</div>
            <div style={timeStyle}>{renderData.time}</div>
            <div style={imageStyle}>{renderMedia()}</div>
          </div>
        );
      case 3:
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={imageStyle}>{renderMedia()}</div>
            <div style={headlineStyle}>{renderData.headline}</div>
            <div style={contentStyle}>{renderData.content}</div>
            <div style={timeStyle}>{renderData.time}</div>
          </div>
        );
      case 4:
        return (
          <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
            <div style={imageStyle}>{renderMedia()}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={headlineStyle}>{renderData.headline}</div>
              <div style={contentStyle}>{renderData.content}</div>
              <div style={timeStyle}>{renderData.time}</div>
            </div>
          </div>
        );
      case 5:
        return (
          <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={headlineStyle}>{renderData.headline}</div>
              <div style={contentStyle}>{renderData.content}</div>
              <div style={timeStyle}>{renderData.time}</div>
            </div>
            <div style={imageStyle}>{renderMedia()}</div>
          </div>
        );
      case 6:
        return (
          <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
            <div style={imageStyle}>{renderMedia()}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={headlineStyle}>{renderData.headline}</div>
              <div style={timeStyle}>{renderData.time}</div>
            </div>
          </div>
        );
      case 7:
        return (
          <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={headlineStyle}>{renderData.headline}</div>
              <div style={timeStyle}>{renderData.time}</div>
            </div>
            <div style={imageStyle}>{renderMedia()}</div>
          </div>
        );
      case 8:
        return (
          <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
            <div style={imageStyle}>{renderMedia()}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={contentStyle}>{renderData.content}</div>
              <div style={timeStyle}>{renderData.time}</div>
            </div>
          </div>
        );
      case 9:
        return (
          <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={contentStyle}>{renderData.content}</div>
              <div style={timeStyle}>{renderData.time}</div>
            </div>
            <div style={imageStyle}>{renderMedia()}</div>
          </div>
        );
      case 10:
        return (
          <div>
            <div style={headlineStyle}>{renderData.headline}</div>
            <div style={timeStyle}>{renderData.time}</div>
          </div>
        );
      case 11:
        return (
          <div>
            <div style={contentStyle}>{renderData.content}</div>
            <div style={timeStyle}>{renderData.time}</div>
          </div>
        );
      case 12:
        return (
          <div>
            <div style={imageStyle}>{renderMedia()}</div>
            <div style={timeStyle}>{renderData.time}</div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div
        className="preview-universal-container"
        onClick={handleNavigate}
        style={{
          width:      containerWidth  > 0 ? `${containerWidth}px`  : undefined,
          minHeight:  containerHeight > 0 ? `${containerHeight}px` : undefined,
          padding:    `${padding}px`,
          cursor:     "pointer",
          transition: "0.3s ease-in-out",
        }}
      >
        <style>{`
          .preview-universal-container:hover {
            color: rgb(237, 1, 141);
          }
          .separator-line-universal {
            width: 100%;
            height: 1px;
            background-color: #999;
            margin-top: 10px;
          }
          @media (max-width: 768px) {
            .preview-universal-container {
              width: 100% !important;
              max-width: 100%;
            }
          }
        `}</style>

        {renderLayout()}
      </div>

      {showSeparator && <div className="separator-line-universal"></div>}
    </div>
  );
};

export default PreviewUniversalNewsContainer;