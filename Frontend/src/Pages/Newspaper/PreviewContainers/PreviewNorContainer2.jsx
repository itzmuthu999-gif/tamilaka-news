import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import jwt from "../../../assets/jwt.jpg";

const PreviewNorContainer2 = ({
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
    <div style={{ position: "relative", width: "100%" }}>
      <div
        className={version === 1 ? "preview-nm-news-3" : "preview-nm-news-4"}
        onClick={handleNavigate}
        style={{ cursor: "pointer" }}
      >
        <style>{`
          .preview-nm-news-3 { width: 395px; height: 100px; overflow: hidden; display: flex; transition: 0.5s ease-in-out; }
          .preview-nm-news-3:hover { color: rgb(237, 1, 141); }
          .preview-nm3-sbc { flex: 1; min-width: 0; }
          .preview-epnn3-img { width: 200px; height: 100px; border-radius: 5px; overflow: hidden; flex-shrink: 0; }
          .preview-epnn3-img img { width: 100%; height: 100%; object-fit: cover; }
          .preview-epnn3-onln { font-size: 13px; height: 84px; overflow: hidden; }
          .preview-epnn3-tm { font-size: 10px; color: gray; }
          .preview-nm-news-4 { width: 395px; height: 100px; overflow: hidden; display: flex; transition: 0.5s ease-in-out; }
          .preview-nm-news-4:hover { color: rgb(237, 1, 141); }
          .preview-nm4-sbc { flex: 1; min-width: 0; }
          .preview-epnn4-img { width: 200px; height: 100px; border-radius: 5px; overflow: hidden; flex-shrink: 0; }
          .preview-epnn4-img img { width: 100%; height: 100%; object-fit: cover; }
          .preview-epnn4-onln { font-size: 13px; height: 84px; overflow: hidden; }
          .preview-epnn4-tm { font-size: 10px; color: gray; }
          .separator-line { width: 100%; height: 1px; background-color: #999; margin-top: 10px; }
          @media (max-width: 768px) {
            .preview-nm-news-3, .preview-nm-news-4 { width: 100%; max-width: 395px; height: auto; min-height: 100px; }
            .preview-epnn3-img, .preview-epnn4-img { width: 150px; height: 90px; }
            .preview-epnn3-onln, .preview-epnn4-onln { font-size: 12px; height: auto; }
          }
          @media (max-width: 480px) {
            .preview-nm-news-3, .preview-nm-news-4 { flex-direction: column; height: auto; }
            .preview-epnn3-img, .preview-epnn4-img { width: 100%; height: 120px; }
            .preview-nm3-sbc, .preview-nm4-sbc { width: 100%; }
            .preview-epnn3-onln, .preview-epnn4-onln { font-size: 11px; height: auto; max-height: none; }
          }
        `}</style>

        {version === 1 && (
          <>
            <div className="preview-epnn3-img"><img src={renderData.image} alt="" /></div>
            <div className="preview-nm3-sbc">
              <div className="preview-epnn3-onln">{renderData.content}</div>
              <div className="preview-epnn3-tm">{renderData.time}</div>
            </div>
          </>
        )}

        {version === 2 && (
          <>
            <div className="preview-nm4-sbc">
              <div className="preview-epnn4-onln">{renderData.content}</div>
              <div className="preview-epnn4-tm">{renderData.time}</div>
            </div>
            <div className="preview-epnn4-img"><img src={renderData.image} alt="" /></div>
          </>
        )}
      </div>
      {showSeparator && <div className="separator-line" />}
    </div>
  );
};

export default PreviewNorContainer2;