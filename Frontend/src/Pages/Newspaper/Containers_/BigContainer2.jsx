import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import jwt from "../../../assets/jwt.jpg";
import timeFun  from "./timeFun";


const BigNewsContainer2 = ({
  newsId = null,
  version = 1,
  border = false,
}) => {
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
        time: timeFun(news.time || news.createdAt || news.updatedAt) || DEFAULT_DATA.time,
      }
    : DEFAULT_DATA;

  const handleNavigate = () => {
    if (!newsId) return;
    navigate(`/preview/${newsId}`);
  };

  return (
    <div
      className="ep-bg-news-2"
      onClick={handleNavigate}
      style={{
        border: border ? "2px dotted #999" : "none",
      }}
    >
      <style>
    {
        `
        .ep-bg-news-2 {
  width: 800px;
  height: fit-content;
  margin: 5px;
  display: flex;
  gap: 10px;
  transition: 0.5s ease-in-out;
  cursor: pointer;
}
.ep-bg-news-2:hover {
  color: rgb(237, 1, 141);
}

.epbn2-img {
  width: 500px;
  height: 350px;
  border-radius: 5px;
  overflow: hidden;
}
.epbn2-img img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* This will make the image fill the box nicely */
}
.epbn2-hdln {
  font-size: 20px;
  font-weight: bold;
}

.epbn2-onln {
  font-size: 13px;
}

        `
    }
</style>
      {version === 1 && (
        <>
          <div className="epbn2-img">
            <img src={renderData.image} alt="" />
          </div>

          <div className="epbn2-text">
            <div className="epbn2-hdln">{renderData.headline}</div>
            <div className="epbn2-onln">{renderData.content}</div>
            <div className="epn-tm">{renderData.time}</div>
          </div>
        </>
      )}

      {version === 2 && (
        <>
          <div className="epbn2-text">
            <div className="epbn2-hdln">{renderData.headline}</div>
            <div className="epbn2-onln">{renderData.content}</div>
            <div className="epn-tm">{renderData.time}</div>
          </div>

          <div className="epbn2-img">
            <img src={renderData.image} alt="" />
          </div>
        </>
      )}
    </div>
  );
};

export default BigNewsContainer2;

