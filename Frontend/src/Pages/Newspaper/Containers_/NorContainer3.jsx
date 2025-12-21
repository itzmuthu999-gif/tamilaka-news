import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import jwt from "../../../assets/jwt.jpg";

const NorContainer3 = ({
  newsId = null,
  version = 1,
  border = false,
}) => {
  const navigate = useNavigate();
const { allNews, translatedNews, language } = useSelector(
  (state) => state.newsform
);

const newsToShow = language === "en" ? translatedNews : allNews;

  const news = newsToShow.find((n) => n.id === newsId);

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
        time: news.time || DEFAULT_DATA.time,
      }
    : DEFAULT_DATA;

  const handleNavigate = () => {
    if (!newsId) return;
    navigate(`/preview/${newsId}`);
  };

  return (
    <div
      className={version === 1 ? "ep-nm-news-5" : "ep-nm-news-6"}
      onClick={handleNavigate}
      style={{
        border: border ? "2px dotted #999" : "none",
      }}
    >
              <style>
    {
        `
        
.ep-nm-news-5 {
  width: 395px;
  height: 100px;
    min-width: 395px;
  min-height: 100px;
  // border: solid;
  margin: 5px;
  overflow: hidden;
  display: flex;
  gap: 10px;
  transition: 0.5s ease-in-out;
  cursor: pointer;
}
.ep-nm-news-5:hover {
  color: rgb(237, 1, 141);
}

.ep-nm5-sbc {
  max-width: 200px;
}
.epnn5-img {
  max-width: 200px;
  max-height: 100px;
  width: 200px;
  height: 100px;
  border-radius: 5px;
  overflow: hidden;
}
.epnn5-img img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* This will make the image fill the box nicely */
}
.epbn5-hdln {
  font-size: 15px;
  font-weight: bold;
  height: 84px;
  overflow: hidden;
}

.epnn5-onln {
  font-size: 13px;
}
/// normal news container 6
.ep-nm-news-6 {
  width: 395px;
  height: 100px;
  // border: solid;
  margin: 5px;
  overflow: hidden;
  display: flex;
  gap: 10px;
  // border: 1px solid;
  transition: 0.5s ease-in-out;
  cursor: pointer;
}
.ep-nm-news-6:hover {
  color: rgb(237, 1, 141);
}

.ep-nm6-sbc {
  max-width: 200px;
}
.epnn6-img {
  max-width: 200px;
  max-height: 100px;
  border-radius: 5px;
  overflow: hidden;
}
.epnn6-img img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* This will make the image fill the box nicely */
}

.epbn6-hdln {
  font-size: 15px;
  font-weight: bold;
  height: 84px;
  overflow: hidden;
}

        `
    }
</style>
      {version === 1 && (
        <>
          <div className="epnn5-img">
            <img src={renderData.image} alt="" />
          </div>

          <div className="ep-nm5-sbc">
            <div className="epbn5-hdln">{renderData.content}</div>
            <div className="epn-tm">{renderData.time}</div>
          </div>
        </>
      )}

      {version === 2 && (
        <>
          <div className="ep-nm6-sbc">
            <div className="epbn6-hdln">{renderData.content}</div>
            <div className="epn-tm">{renderData.time}</div>
          </div>

          <div className="epnn6-img">
            <img src={renderData.image} alt="" />
          </div>
        </>
      )}
    </div>
  );
};

export default NorContainer3;
