import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import jwt from "../../../assets/jwt.jpg";

const NorContainer5 = ({
  newsId = null,
  version = 1,
  border = false,
}) => {
  const navigate = useNavigate();
  const allNews = useSelector((state) => state.newsform.allNews);

  const news = allNews.find((n) => n.id === newsId);

  const DEFAULT_DATA = {
    image: jwt,
    headline: "Breaking News Headline Comes Here",
    content:
      "This is a short description of the news. Drop a news card to replace this content.",
    time: "Just now",
  };

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
        time: news.time || DEFAULT_DATA.time,
      }
    : DEFAULT_DATA;

  const handleNavigate = () => {
    if (!newsId) return;
    navigate(`/preview/${newsId}`);
  };

  return (
    <div
      className={version === 1 ? "ep-nm2-news-2" : "ep-nm2-news-3"}
      onClick={handleNavigate}
      style={{
        border: border ? "2px dotted #999" : "none",
        cursor: newsId ? "pointer" : "default",
      }}
    >
      {/* VERSION 1 */}
      {version === 1 && (
        <>
          <div className="epbn22-hdln">{renderData.headline}</div>

          <div className="ep-nm22-sbc">
            <div className="ep-nm22sbc-c1">
              <div className="epnn22-onln">{renderData.content}</div>
              <div className="epn-tm">{renderData.time}</div>
            </div>

            <div className="epnn22-img">
              <img src={renderData.image} alt="" />
            </div>
          </div>
        </>
      )}

      {/* VERSION 2 */}
      {version === 2 && (
        <>
          <div className="epbn23-hdln">{renderData.headline}</div>

          <div className="ep-nm23-sbc">
            <div className="epnn23-img">
              <img src={renderData.image} alt="" />
            </div>

            <div className="ep-nm23sbc-c1">
              <div className="epnn23-onln">{renderData.content}</div>
              <div className="epn-tm">{renderData.time}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NorContainer5;
