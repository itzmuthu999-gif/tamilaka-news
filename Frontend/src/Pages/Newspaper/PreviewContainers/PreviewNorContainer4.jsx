import { useNavigate } from "react-router-dom";
import timeFun from "../Containers_/timeFun";
import { useSelector } from "react-redux";
import jwt from "../../../assets/jwt.jpg";

const PreviewNorContainer4 = ({ newsId, version = 1, showSeparator = false }) => {
  const navigate = useNavigate();
  const { allNews = [], translatedNews = [], language } = useSelector(
    (state) => state.newsform || {}
  );
  const newsSource = language === "en" ? translatedNews : allNews;
  const news = newsSource.find((n) => n.id === newsId);

  const DEFAULT_DATA = {
    image: jwt,
    headline: "Breaking News Headline Comes Here",
    content: "This is a short description of the news. Drop a news card to replace this content.",
    time: "Just now",
  };

  const formatTime = (timestamp) => timeFun(timestamp);

  const renderData = news
    ? {
        image: (() => {
          const thumb = news.data?.thumbnail;
          if (!thumb) return DEFAULT_DATA.image;
          if (typeof thumb === "string") return thumb;
          if (thumb instanceof File) return URL.createObjectURL(thumb);
          return DEFAULT_DATA.image;
        })(),
        headline: news.data?.headline || DEFAULT_DATA.headline,
        content: news.data?.oneLiner || DEFAULT_DATA.content,
        time: formatTime(news.time || news.createdAt || news.updatedAt) || DEFAULT_DATA.time,
      }
    : DEFAULT_DATA;

  const handleNavigate = () => {
    if (!newsId) return;
    navigate(`/preview/${newsId}`);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div
        className={version === 1 ? "preview-nm-news-7" : "preview-nm-news-8"}
        onClick={handleNavigate}
        style={{ cursor: "pointer" }}
      >
        {version === 1 && (
          <div className="preview-nm7-inner">
            <div className="preview-epnn7-img">
              <img src={renderData.image} alt="" />
            </div>
            <div className="preview-nm7-sbc">
              <div className="preview-epnn7-hdln">{renderData.headline}</div>
              <div className="preview-epnn7-tm">{renderData.time}</div>
            </div>
          </div>
        )}

        {version === 2 && (
          <div className="preview-nm8-inner">
            <div className="preview-nm8-sbc">
              <div className="preview-epnn8-hdln">{renderData.headline}</div>
              <div className="preview-epnn8-tm">{renderData.time}</div>
            </div>
            <div className="preview-epnn8-img">
              <img src={renderData.image} alt="" />
            </div>
          </div>
        )}

        {/* Separator line is INSIDE the container so it matches its width exactly */}
        {showSeparator && <div className="separator-line" />}
      </div>
    </div>
  );
};

export default PreviewNorContainer4;


