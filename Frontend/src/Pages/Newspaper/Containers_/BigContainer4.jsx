import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import jwt from "../../../assets/jwt.jpg";
import timeFun  from "./timeFun";

const BigNewsContainer4 = ({
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
        time: timeFun(news.time) || DEFAULT_DATA.time,
      }
    : DEFAULT_DATA;

  const handleNavigate = () => {
    if (!newsId) return;
    navigate(`/preview/${newsId}`);
  };

  return (
    <div
      className="ep-bg-news-4"
      onClick={handleNavigate}
      style={{
        border: border ? "2px dotted #999" : "none",
      }}
    >
              <style>
    {
        `
        .ep-bg-news-4 {
  width: 400px;
  height: fit-content;
  margin: 5px;
  transition: 0.5s ease-in-out;
  cursor: pointer;
  gap: 5px;
}
.ep-bg-news-4:hover {
  color: rgb(237, 1, 141);
}

.epbn4-img {
  width: 400px;
  height: 350px;
  border-radius: 5px;
  overflow: hidden;
}
.epbn4-img img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* This will make the image fill the box nicely */
}
.epbn4-hdln {
  font-size: 20px;
  font-weight: bold;
}

        
        `
    }
</style>

      {version === 1 && (
        <>
          <div className="epbn4-img">
            <img src={renderData.image} alt="" />
          </div>
          <div className="epbn4-hdln">{renderData.headline}</div>
          <div className="epn-tm">{renderData.time}</div>
        </>
      )}

      {version === 2 && (
        <>
          <div className="epbn4-hdln">{renderData.headline}</div>
          <div className="epbn4-img">
            <img src={renderData.image} alt="" />
          </div>
          <div className="epn-tm">{renderData.time}</div>
        </>
      )}
    </div>
  );
};

export default BigNewsContainer4;
