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
        time: timeFun(news.time) || DEFAULT_DATA.time,
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
        <style>
          {`
            .preview-nm-news-4b {
              width: 300px;
              height: 80px;
              margin: 4px;
              padding: 6px;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              transition: 0.3s ease-in-out;
              background: transparent;
            }

            .preview-nm-news-4b:hover {
              color: rgb(237, 1, 141);
            }

            .preview-nm-headline-4b {
              font-size: 15px;
              font-weight: bold;
              line-height: 1.2;
              max-height: 48px;
              overflow: hidden;
            }

            .preview-nm-time-4b {
              font-size: 10px;
              color: gray;
            }

            .separator-line-4b {
              width: 100%;
              height: 1px;
              background-color: #999;
              margin-top: 4px;
            }
          `}
        </style>

        <div className="preview-nm-headline-4b">{renderData.content}</div>
        <div className="preview-nm-time-4b">{renderData.time}</div>
      </div>

      {showSeparator && <div className="separator-line-4b"></div>}
    </div>
  );
};

export default PreviewNorContainer4B;