import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import timeFun from "../../Newspaper/Containers_/timeFun";

const PreviewNorContainer4B = ({ newsId, showSeparator = false }) => {
  const navigate = useNavigate();

  const { allNews = [], translatedNews = [], language } = useSelector(
    (state) => state.newsform || {}
  );

  const newsToShow = (language === "en" ? translatedNews : allNews) || [];
  const news = newsToShow.find((n) => n.id === newsId);

  const DEFAULT_DATA = {
    content: "Drop a news card to replace this headline.",
    time: "Just now",
  };

  const renderData = news
    ? {
        content: news.data?.oneLiner || DEFAULT_DATA.content,
        time: timeFun(news.time || news.createdAt || news.updatedAt) || DEFAULT_DATA.time,
      }
    : DEFAULT_DATA;


  const handleNavigate = () => {
    if (!newsId) return;
    navigate(`/preview/${newsId}`);
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        className="preview-nm-news-4b"
        onClick={handleNavigate}
        style={{ cursor: "pointer" }}
      >
        <div className="preview-nm-headline-4b">{renderData.content}</div>
        <div className="preview-nm-time-4b">{renderData.time}</div>
      </div>

      {showSeparator && <div className="separator-line-4b"></div>}
    </div>
  );
};

export default PreviewNorContainer4B;

