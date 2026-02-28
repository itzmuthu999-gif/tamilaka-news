import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import jwt from "../assets/jwt.jpg";

const PreviewBigContainer5 = ({ newsId, version = 1 }) => {
  const navigate = useNavigate();
  const allNews = useSelector((state) => state.newsform?.allNews || []);
  const news = allNews.find((n) => n.id === newsId);

  const DEFAULT_DATA = {
    media: jwt,
    mediaType: "image",
    headline: "Breaking News Headline Comes Here",
    content: "Drop a news card here",
    time: "Just now",
  };

  const renderData = news
    ? {
        media: (() => {
          const thumb = news.data?.thumbnail || news.data?.video;
          if (!thumb) return DEFAULT_DATA.media;
          if (typeof thumb === "string") return thumb;
          if (thumb instanceof File) return URL.createObjectURL(thumb);
          return DEFAULT_DATA.media;
        })(),
        mediaType: news.data?.video ? "video" : "image",
        headline: news.data?.headline || DEFAULT_DATA.headline,
        content: news.data?.oneLiner || DEFAULT_DATA.content,
        time: news.time || DEFAULT_DATA.time,
      }
    : DEFAULT_DATA;

  const handleNavigate = () => {
    if (!newsId) return;
    navigate(`/preview/${newsId}`);
  };

  const renderMedia = () => {
    if (renderData.mediaType === "video") {
      return (
        <video
          src={renderData.media}
          controls
          muted
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      );
    }
    return (
      <img
        src={renderData.media}
        alt=""
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  };

  return (
    <div className="preview-bg-news5-1" onClick={handleNavigate}>
      <style>{`
        .preview-bg-news5-1 {
          width: 910px;
          height: fit-content;
          display: flex;
          transition: 0.5s ease-in-out;
          cursor: pointer;
        }
        
        .preview-bg-news5-1:hover {
          color: rgb(237, 1, 141);
        }
        
        .preview-epbn51-img {
          width: 500px;
          height: 300px;
          border-radius: 5px;
          overflow: hidden;
          flex-shrink: 0;
        }
        
        .preview-epbn51-content {
          width: 400px;
          flex-shrink: 0;
        }
        
        .preview-epbn51-hdln {
          font-size: 20px;
          font-weight: bold;
        }
        
        .preview-epbn51-onln {
          font-size: 13px;
        }

        .preview-epn-tm {
          font-size: 12px;
          color: #666;
        }
      `}</style>

      {version === 1 && (
        <>
          <div className="preview-epbn51-content">
            <div className="preview-epbn51-hdln">{renderData.headline}</div>
            <div className="preview-epbn51-onln">{renderData.content}</div>
            <div className="preview-epn-tm">{renderData.time}</div>
          </div>
          <div className="preview-epbn51-img">{renderMedia()}</div>
        </>
      )}

      {version === 2 && (
        <>
          <div className="preview-epbn51-img">{renderMedia()}</div>
          <div className="preview-epbn51-content">
            <div className="preview-epbn51-hdln">{renderData.headline}</div>
            <div className="preview-epbn51-onln">{renderData.content}</div>
            <div className="preview-epn-tm">{renderData.time}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default PreviewBigContainer5;
