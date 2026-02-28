import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import jwt from "../assets/jwt.jpg";

const PreviewBigContainer2 = ({ newsId, version = 1 }) => {
  const navigate = useNavigate();
  const allNews = useSelector((state) => state.newsform?.allNews || []);
  const news = allNews.find((n) => n.id === newsId);

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
    <div className="preview-bg-news-2" onClick={handleNavigate}>
      <style>{`
        .preview-bg-news-2 {
          width: 800px;
          display: flex;
          transition: 0.5s ease-in-out;
          cursor: pointer;
          height: fit-content;
        }

        .preview-bg-news-2:hover {
          color: rgb(237, 1, 141);
        }

        .preview-epbn2-img {
          width: 500px;
          height: 350px;
          border-radius: 5px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .preview-epbn2-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preview-epbn2-content {
          max-width: 400px;
          flex: 1;
          min-width: 0;
        }

        .preview-epbn2-hdln {
          font-size: 20px;
          font-weight: bold;
          word-wrap: break-word;
        }

        .preview-epbn2-onln {
          font-size: 13px;
          word-wrap: break-word;
        }

        .preview-epn-tm {
          font-size: 12px;
          color: #666;
        }
      `}</style>

      {version === 1 && (
        <>
          <div className="preview-epbn2-img">
            <img src={renderData.image} alt="" />
          </div>
          <div className="preview-epbn2-content">
            <div className="preview-epbn2-hdln">{renderData.headline}</div>
            <div className="preview-epbn2-onln">{renderData.content}</div>
            <div className="preview-epn-tm">{renderData.time}</div>
          </div>
        </>
      )}

      {version === 2 && (
        <>
          <div className="preview-epbn2-content">
            <div className="preview-epbn2-hdln">{renderData.headline}</div>
            <div className="preview-epbn2-onln">{renderData.content}</div>
            <div className="preview-epn-tm">{renderData.time}</div>
          </div>
          <div className="preview-epbn2-img">
            <img src={renderData.image} alt="" />
          </div>
        </>
      )}
    </div>
  );
};

export default PreviewBigContainer2;
