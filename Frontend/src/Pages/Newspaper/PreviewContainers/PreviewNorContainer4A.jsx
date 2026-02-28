import { useNavigate } from "react-router-dom";
import timeFun from "../Containers_/timeFun";
import { useSelector } from "react-redux";
import jwt from "../../../assets/jwt.jpg";

const PreviewNorContainer4A = ({ newsId, version = 1, showSeparator = false }) => {
  const navigate = useNavigate();
  const { allNews = [], translatedNews = [], language } = useSelector(
    (state) => state.newsform || {}
  );
  const newsSource = language === "en" ? translatedNews : allNews;
  const news = newsSource.find((n) => n.id === newsId);

  const DEFAULT_DATA = {
    image: jwt,
    headline: "Breaking News Headline Comes Here",
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
        className={version === 1 ? "preview-nm-news-7a" : "preview-nm-news-8a"}
        onClick={handleNavigate}
        style={{ cursor: "pointer" }}
      >
        {version === 1 && (
          <>
            <div className="preview-epnn7a-img">
              <img src={renderData.image} alt="" />
            </div>
            <div className="preview-nm7a-sbc">
              <div className="preview-epnn7a-hdln">{renderData.headline}</div>
              <div className="preview-epnn7a-tm">{renderData.time}</div>
            </div>
          </>
        )}

        {version === 2 && (
          <>
            <div className="preview-nm8a-sbc">
              <div className="preview-epnn8a-hdln">{renderData.headline}</div>
              <div className="preview-epnn8a-tm">{renderData.time}</div>
            </div>
            <div className="preview-epnn8a-img">
              <img src={renderData.image} alt="" />
            </div>
          </>
        )}
      </div>

      {showSeparator && <div className="separator-line" />}
    </div>
  );
};

export default PreviewNorContainer4A;


