import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import jwt from "../assets/jwt.jpg";

const PreviewBigContainer4A = ({ newsId, size = 280, version = 1 }) => {
  const navigate = useNavigate();
  
  const { allNews = [], translatedNews = [], language } = useSelector(
    (state) => state.newsform || {}
  );

  const newsSource = language === "en" ? translatedNews : allNews;
  const news = newsSource.find((n) => n.id === newsId);

  const DEFAULT_DATA = {
    image: jwt,
    headline: "Breaking News Headline Comes Here",
    content: "This is a short description of the news.",
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
    <div className="preview-bg-news-4a" onClick={handleNavigate}>
      <style>
        {`
        .preview-bg-news-4a {
          width: ${size}px;
          height: fit-content;
          transition: 0.5s ease-in-out;
          cursor: pointer;
        }

        .preview-bg-news-4a:hover {
          color: rgb(237, 1, 141);
        }

        .preview-epbn4a-img {
          width: ${size}px;
          height: ${size}px;
          border-radius: 5px;
          overflow: hidden;
        }

        .preview-epbn4a-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preview-epbn4a-hdln {
          font-size: 20px;
          font-weight: bold;
          word-wrap: break-word;
        }

        .preview-epn-tm {
          font-size: 12px;
          color: #666;
        }
      `}
      </style>

      {version === 1 && (
        <>
          <div className="preview-epbn4a-img">
            <img src={renderData.image} alt="" />
          </div>
          <div className="preview-epbn4a-hdln">{renderData.headline}</div>
          <div className="preview-epn-tm">{renderData.time}</div>
        </>
      )}

      {version === 2 && (
        <>
          <div className="preview-epbn4a-hdln">{renderData.headline}</div>
          <div className="preview-epbn4a-img">
            <img src={renderData.image} alt="" />
          </div>
          <div className="preview-epn-tm">{renderData.time}</div>
        </>
      )}
    </div>
  );
};

export default PreviewBigContainer4A;
