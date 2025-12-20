import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import jwt from "../../../assets/jwt.jpg";

const NorContainer2 = ({
  newsId = null,
  version = 1,
  border = false,
}) => {
  const navigate = useNavigate();
  const allNews = useSelector((state) => state.newsform.allNews);

  const news = allNews.find((n) => n.id === newsId);

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
      className={version === 1 ? "ep-nm-news-3" : "ep-nm-news-4"}
      onClick={handleNavigate}
      style={{
        border: border ? "2px dotted #999" : "none",
      }}
    >
              <style>
    {
        `
        .ep-nm-news-3 {
  width: 395px;
  height: 100px;
  // border: solid;
  margin: 5px;
  overflow: hidden;
  display: flex;
  gap: 10px;

  transition: 0.5s ease-in-out;
  cursor: pointer;
}
.ep-nm-news-3:hover {
  color: rgb(237, 1, 141);
}

.ep-nm3-sbc {
  max-width: 200px;
}
.epnn3-img {
  max-width: 200px;
  max-height: 100px;
  border-radius: 5px;
  overflow: hidden;
}
.epnn3-img img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* This will make the image fill the box nicely */
}

.epnn3-onln {
  font-size: 13px;
  height: 84px;
  overflow: hidden;
}

/// normal news container 4
.ep-nm-news-4 {
  width: 395px;
  height: 100px;
  // border: solid;
  margin: 5px;
  overflow: hidden;
  display: flex;
  gap: 15px;

  transition: 0.5s ease-in-out;
  cursor: pointer;
}
.ep-nm-news-4:hover {
  color: rgb(237, 1, 141);
}

.ep-nm4-sbc {
  max-width: 200px;
}

.epnn4-img {
  max-width: 200px;
  max-height: 100px;
  border-radius: 5px;
  overflow: hidden;
}
.epnn4-img img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* This will make the image fill the box nicely */
}

.epnn4-onln {
  font-size: 13px;
  height: 84px;
  overflow: hidden;
}

        `
    }
</style>

      {version === 1 && (
        <>
          <div className="epnn3-img">
            <img src={renderData.image} alt="" />
          </div>

          <div className="ep-nm3-sbc">
            <div className="epnn3-onln">{renderData.content}</div>
            <div className="epn-tm">{renderData.time}</div>
          </div>
        </>
      )}

      {version === 2 && (
        <>
          <div className="ep-nm4-sbc">
            <div className="epnn4-onln">{renderData.content}</div>
            <div className="epn-tm">{renderData.time}</div>
          </div>

          <div className="epnn4-img">
            <img src={renderData.image} alt="" />
          </div>
        </>
      )}
    </div>
  );
};

export default NorContainer2;
