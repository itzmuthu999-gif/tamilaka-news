import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import jwt from "../../../assets/jwt.jpg";
import timeFun  from "./timeFun";

const NorContainer4 = ({
  newsId = null,
  version = 1,
  border = false,
}) => {
  const navigate = useNavigate();
const { allNews = [], translatedNews = [], language } = useSelector(
  (state) => state.newsform || {}
);

const newsToShow = (language === "en" ? translatedNews : allNews) || [];

  const news = newsToShow.find((n) => n.id === newsId);
  const width= 290;
  const DEFAULT_DATA = {
    image: jwt,
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
      className={version === 1 ? "ep-nm-news-7" : "ep-nm-news-8"}
      onClick={handleNavigate}
      style={{
        border: border ? "2px dotted #999" : "none",
      }}
    >
              <style>
    {
        `
        .ep-nm-news-7 {
  width: ${width}px;
  height: 100px;
  max-width: ${width}px;
  max-height: 100px;
  // border: solid;
  flex: 0 0 300px;
  margin: 4px;
  overflow: hidden;
  display: flex;
  gap: 10px;
  transition: 0.5s ease-in-out;
  cursor: pointer;
}
.ep-nm-news-7:hover {
  color: rgb(237, 1, 141);
}

.ep-nm7-sbc {
  max-width: 200px;
}
.epnn7-img {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  overflow: hidden;
  flex-shrink: 0;
}
.epnn7-img img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* This will make the image fill the box nicely */
}

.epnn7-hdln {
  font-size: 15px;
  font-weight: bold;
  height: 84px;
  overflow: hidden;
}

/// normal news container 8
.ep-nm-news-8 {
  width: ${width}px;
  height: 100px;
  max-width: ${width}px;
  max-height: 100px;
  // border: solid;
  flex: 0 0 300px;
  margin: 4px;
  overflow: hidden;
  display: flex;
  gap: 10px;
  transition: 0.5s ease-in-out;
  cursor: pointer;
}
.ep-nm-news-8:hover {
  color: rgb(237, 1, 141);
}

.ep-nm8-sbc {
  max-width: 200px;
}
.epnn8-img {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  overflow: hidden;
  flex-shrink: 0;
}
.epnn8-img img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* This will make the image fill the box nicely */
}

.epnn8-hdln {
  font-size: 15px;
  font-weight: bold;
  height: 84px;
  overflow: hidden;
}

.epn-tm {
  font-size: 10px;
  color: gray;
  // background-color: blue;
}


        
        `
    }
</style>
      {/* VERSION 1 – Image left */}
      {version === 1 && (
        <>
          <div className="epnn7-img">
            <img src={renderData.image} alt="" />
          </div>

          <div className="ep-nm7-sbc">
            <div className="epnn7-hdln">{renderData.content}</div>
            <div className="epn-tm">{renderData.time}</div>
          </div>
        </>
      )}

      {/* VERSION 2 – Image right */}
      {version === 2 && (
        <>
          <div className="ep-nm8-sbc">
            <div className="epnn8-hdln">{renderData.content}</div>
            <div className="epn-tm">{renderData.time}</div>
          </div>

          <div className="epnn8-img">
            <img src={renderData.image} alt="" />
          </div>
        </>
      )}
    </div>
  );
};

export default NorContainer4;
