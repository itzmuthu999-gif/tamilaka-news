import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import jwt from "../../../assets/jwt.jpg";

const PreviewBigContainer3 = ({
  newsId,
  version = 1,
  showSeparator = false,
}) => {
  const navigate = useNavigate();
  const allNews = useSelector((state) => state.newsform?.allNews || []);
  const news = allNews.find((n) => n.id === newsId);

  const DEFAULT_DATA = {
    image: jwt,
    headline: "Breaking News Headline Comes Here",
    content: "This is a short description of the news. Drop a news card to replace this content.",
    time: "Just now",
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";
    const now = new Date();
    const newsTime = new Date(timestamp);
    const diffMs = now - newsTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffMonths = Math.floor(diffMs / 2592000000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 30) return `${diffDays} d ago`;
    return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
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
        time: formatTime(news.time) || DEFAULT_DATA.time,
      }
    : DEFAULT_DATA;

  const handleNavigate = () => {
    if (!newsId) return;
    navigate(`/preview/${newsId}`);
  };

  return (
    <div style={{ position: "relative", width: "fit-content" }}>
      <div className="preview-bg-news-3" onClick={handleNavigate}>
        <style>{`
          .preview-bg-news-3 { width: 400px; height: fit-content; transition: 0.5s ease-in-out; cursor: pointer; }
          .preview-bg-news-3:hover { color: rgb(237, 1, 141); }
          .preview-epbn3-img { width: 400px; height: 350px; border-radius: 5px; overflow: hidden; }
          .preview-epbn3-img img { width: 100%; height: 100%; object-fit: cover; }
          .preview-epbn3-hdln { font-size: 20px; font-weight: bold; word-wrap: break-word; }
          .preview-epbn3-onln { font-size: 13px; word-wrap: break-word; }
          .preview-epbn3-tm { font-size: 12px; color: #666; }
          .separator-line { width: 100%; height: 1px; background-color: #999; margin-top: 10px; }
          @media (max-width: 1024px) {
            .preview-bg-news-3 { width: 100%; max-width: 400px; }
            .preview-epbn3-img { width: 100%; height: auto; aspect-ratio: 8 / 7; }
          }
          @media (max-width: 640px) {
            .preview-epbn3-img { aspect-ratio: 16 / 9; border-radius: 3px; }
            .preview-epbn3-hdln { font-size: 18px; }
            .preview-epbn3-onln { font-size: 12px; }
          }
          @media (max-width: 480px) {
            .preview-epbn3-hdln { font-size: 16px; }
            .preview-epbn3-onln { font-size: 11px; }
          }
        `}</style>

        {version === 1 && (
          <>
            <div className="preview-epbn3-hdln">{renderData.headline}</div>
            <div className="preview-epbn3-img"><img src={renderData.image} alt="" /></div>
            <div className="preview-epbn3-onln">{renderData.content}</div>
            <div className="preview-epbn3-tm">{renderData.time}</div>
          </>
        )}

        {version === 2 && (
          <>
            <div className="preview-epbn3-img"><img src={renderData.image} alt="" /></div>
            <div className="preview-epbn3-hdln">{renderData.headline}</div>
            <div className="preview-epbn3-onln">{renderData.content}</div>
            <div className="preview-epbn3-tm">{renderData.time}</div>
          </>
        )}

        {version === 3 && (
          <>
            <div className="preview-epbn3-hdln">{renderData.headline}</div>
            <div className="preview-epbn3-onln">{renderData.content}</div>
            <div className="preview-epbn3-img"><img src={renderData.image} alt="" /></div>
            <div className="preview-epbn3-tm">{renderData.time}</div>
          </>
        )}
      </div>
      {showSeparator && <div className="separator-line"></div>}
    </div>
  );
};

export default PreviewBigContainer3;