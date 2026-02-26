import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import jwt from "../../../assets/jwt.jpg";

const PreviewBigContainer5 = ({
  newsId,
  version = 1,
  showSeparator = false,
}) => {
  const navigate = useNavigate();
  const allNews = useSelector((state) => state.newsform?.allNews || []);
  const news = allNews.find((n) => n.id === newsId);

  const DEFAULT_DATA = {
    media: jwt,
    mediaType: "image",
    headline: "Breaking News Headline Comes Here",
    content: "Drop a news card here",
    time: "Just now",
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
        headline: news.data?.headline || DEFAULT_DATA.headline,
        content: news.data?.oneLiner || DEFAULT_DATA.content,
        time: formatTime(news.time) || DEFAULT_DATA.time,
      }
    : DEFAULT_DATA;

  const handleNavigate = () => {
    if (!newsId) return;
    navigate(`/preview/${newsId}`);
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

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div className="preview-bg-news5-1" onClick={handleNavigate} style={{ cursor: "pointer" }}>
        <style>{`
          .preview-bg-news5-1 { width: 910px; height: fit-content; display: flex; transition: 0.5s ease-in-out; }
          .preview-bg-news5-1:hover { color: rgb(237, 1, 141); }
          .preview-epbn51-img { width: 500px; height: 300px; border-radius: 5px; overflow: hidden; flex-shrink: 0; }
          .preview-epbn51-content { width: 400px; flex-shrink: 0; }
          .preview-epbn51-hdln { font-size: 20px; font-weight: bold; margin-bottom: 8px; }
          .preview-epbn51-onln { font-size: 13px; margin-bottom: 8px; }
          .preview-epbn51-tm { font-size: 12px; color: #666; }
          .separator-line { width: 100%; height: 1px; background-color: #999; margin-top: 10px; }
          @media (max-width: 1200px) {
            .preview-bg-news5-1 { width: 100%; max-width: 910px; }
            .preview-epbn51-img { width: 55%; min-width: 300px; }
            .preview-epbn51-content { width: 45%; min-width: 250px; }
          }
          @media (max-width: 768px) {
            .preview-bg-news5-1 { flex-direction: column; width: 100%; }
            .preview-epbn51-img { width: 100%; height: 250px; }
            .preview-epbn51-content { width: 100%; }
            .preview-epbn51-hdln { font-size: 18px; }
            .preview-epbn51-onln { font-size: 12px; }
          }
          @media (max-width: 480px) {
            .preview-epbn51-img { height: 200px; }
            .preview-epbn51-hdln { font-size: 16px; }
            .preview-epbn51-onln { font-size: 11px; }
          }
        `}</style>

        {version === 1 && (
          <>
            <div className="preview-epbn51-content">
              <div className="preview-epbn51-hdln">{renderData.headline}</div>
              <div className="preview-epbn51-onln">{renderData.content}</div>
              <div className="preview-epbn51-tm">{renderData.time}</div>
            </div>
            <div className="preview-epbn51-img">{renderMedia()}</div>
          </>
        )}

        {version === 2 && (
          <>
            <div className="preview-epbn51-img">{renderMedia()}</div>
            <div className="preview-epbn51-content">
              <div className="preview-epbn51-hdln">{renderData.headline}</div>
              <div className="preview-epbn51-onln">{renderData.content}</div>
              <div className="preview-epbn51-tm">{renderData.time}</div>
            </div>
          </>
        )}
      </div>
      {showSeparator && <div className="separator-line" />}
    </div>
  );
};

export default PreviewBigContainer5;