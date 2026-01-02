import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import timeFun  from "./timeFun";

const NorContainer4A = ({ newsId = null, border = false }) => {
  const navigate = useNavigate();
const { allNews, translatedNews, language } = useSelector(
  (state) => state.newsform
);

const newsToShow = language === "en" ? translatedNews : allNews;

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
    <div
      className="ep-nm-news"
      onClick={handleNavigate}
      style={{ border: border ? "2px dotted #999" : "none" }}
    >
      <style>
        {`
          .ep-nm-news {
            width: 300px;
            height: 80px;
            margin: 4px;
            padding: 6px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            cursor: pointer;
            transition: 0.3s ease-in-out;
          }

          .ep-nm-news:hover {
            color: rgb(237, 1, 141);
          }

          .ep-nm-headline {
            font-size: 15px;
            font-weight: bold;
            line-height: 1.2;
            max-height: 48px;
            overflow: hidden;
          }

          .ep-nm-time {
            font-size: 10px;
            color: gray;
          }
        `}
      </style>

      <div className="ep-nm-headline">{renderData.content}</div>
      <div className="ep-nm-time">{renderData.time}</div>
    </div>
  );
};

export default NorContainer4A;
