import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import jwt from "../../../assets/jwt.jpg";
import timeFun  from "./timeFun";

const NorContainer1 = ({
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
        time: timeFun(news.time || news.createdAt || news.updatedAt) || DEFAULT_DATA.time,
      }
    : DEFAULT_DATA;

  const handleNavigate = () => {
    if (!newsId) return;
    navigate(`/preview/${newsId}`);
  };

  return (
    <div
      className={version === 1 ? "ep-nm-news-1" : "ep-nm-news-2"}
      onClick={handleNavigate}
      style={{
        border: border ? "2px dotted #999" : "none",
      }}
    >
            <style>
        {`
.epnn1-img,
.epnn2-img {
  width: 250px;      /* FIXED */
  height: 200px;
  flex-shrink: 0;    /*  PREVENT FLEX RESIZE */
  border-radius: 6px;
  overflow: hidden;
}

        .ep-nm-news-1 {
  width: 800px;
  height: fit-content;
  margin: 5px;
  display: flex;
  gap: $gap2;
  transition: 0.5s ease-in-out;
  cursor: pointer;
}
.ep-nm-news-1:hover {
  color: rgb(237, 1, 141);
}

.epnn1-img img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* This will make the image fill the box nicely */
}
.epnn1-hdln {
  font-size: 20px;
  font-weight: bold;
}

.epnn1-onln {
  font-size: 13px;
}

/// normal news container 2
.ep-nm-news-2 {
  width: 800px;
  height: fit-content;
  // border: solid;
  margin: 5px;
  display: flex;
  gap: $gap2;
  transition: 0.5s ease-in-out;
  cursor: pointer;
}
.ep-nm-news-2:hover {
  color: rgb(237, 1, 141);
}

.epnn2-img img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* This will make the image fill the box nicely */
}
.epnn2-hdln {
  font-size: 20px;
  font-weight: bold;
}

.epnn2-onln {
  font-size: 13px;
}
  @media (max-width: 575px) {
    .ep-nm-news-1 {
  width: 420px;

}
  .epnn1-img,
.epnn2-img {
  width: 140px;      /* FIXED */
  height: 140px;
  flex-shrink: 0;    /*  PREVENT FLEX RESIZE */
  border-radius: 6px;
  overflow: hidden;
}
}


        `}
      </style>

      {version === 1 && (
        <>
          <div className="epnn1-img">
            <img src={renderData.image} alt="" />
          </div>

          <div className="ep-nm1-sbc">
            <div className="epnn1-hdln">{renderData.headline}</div>
            <div className="epnn1-onln">{renderData.content}</div>
            <div className="epn-tm">{renderData.time}</div>
          </div>
        </>
      )}

      {version === 2 && (
        <>
          <div className="ep-nm2-sbc">
            <div className="epnn2-hdln">{renderData.headline}</div>
            <div className="epnn2-onln">{renderData.content}</div>
            <div className="epn-tm">{renderData.time}</div>
          </div>

          <div className="epnn2-img">
            <img src={renderData.image} alt="" />
          </div>
        </>
      )}
    </div>
  );
};

export default NorContainer1;

