import { useNavigate } from "react-router-dom";
import timeFun from "../Containers_/timeFun";
import { useSelector } from "react-redux";
import jwt from "../../../assets/jwt.jpg";

const PreviewBigContainer5 = ({
  newsId,
  version = 1,
  showSeparator = false,
}) => {
  const navigate = useNavigate();
  const { allNews = [], translatedNews = [], language } = useSelector(
    (state) => state.newsform || {}
  );
  const newsSource = language === "en" ? translatedNews : allNews;
  const news = newsSource.find((n) => n.id === newsId);

  const DEFAULT_DATA = {
    media: jwt,
    mediaType: "image",
    headline: "Breaking News Headline Comes Here",
    content: "Drop a news card here",
    time: "Just now",
  };

  const formatTime = (timestamp) => timeFun(timestamp);

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
        time: formatTime(news.time || news.createdAt || news.updatedAt) || DEFAULT_DATA.time,
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


