import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import jwt from "../../../assets/jwt.jpg";

const PreviewNorContainer1 = ({
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
      <style>{`
        .preview-nm-news-1 {
          width: 800px;
          height: fit-content;
          display: flex;
          flex-direction: column;
          transition: 0.5s ease-in-out;
          cursor: pointer;
        }
        .preview-nm-news-1:hover { color: rgb(237, 1, 141); }

        .preview-nm-news-1-inner,
        .preview-nm-news-2-inner {
          display: flex;
          width: 100%;
        }

        .preview-epnn1-img {
          width: 390px;
          height: 200px;
          max-width: 700px;
          max-height: 200px;
          border-radius: 5px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .preview-epnn1-img img { width: 100%; height: 100%; object-fit: cover; }
        .preview-nm1-sbc { flex: 1; min-width: 0; }
        .preview-epnn1-hdln { font-size: 20px; font-weight: bold; }
        .preview-epnn1-onln { font-size: 13px; }

        .preview-nm-news-2 {
          width: 800px;
          height: fit-content;
          display: flex;
          flex-direction: column;
          transition: 0.5s ease-in-out;
          cursor: pointer;
        }
        .preview-nm-news-2:hover { color: rgb(237, 1, 141); }

        .preview-epnn2-img {
          width: 390px;
          height: 200px;
          border-radius: 5px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .preview-epnn2-img img { width: 100%; height: 100%; object-fit: cover; }
        .preview-nm2-sbc { flex: 1; min-width: 0; }
        .preview-epnn2-hdln { font-size: 20px; font-weight: bold; margin-bottom: 8px; }
        .preview-epnn2-onln { font-size: 13px; margin-bottom: 8px; }
        .preview-epnn-tm { font-size: 12px; color: #666; }

        .separator-line {
          width: 100%;
          height: 1px;
          background-color: #999;
          margin-top: 10px;
          display: block;
        }

        @media (max-width: 1024px) {
          .preview-nm-news-1, .preview-nm-news-2 { width: 100%; max-width: 800px; }
          .preview-epnn1-img, .preview-epnn2-img { width: 45%; min-width: 250px; }
        }
        @media (max-width: 768px) {
          .preview-nm-news-1-inner, .preview-nm-news-2-inner { flex-direction: column; }
          .preview-epnn1-img, .preview-epnn2-img { width: 100%; height: 180px; }
          .preview-epnn1-hdln, .preview-epnn2-hdln { font-size: 18px; }
          .preview-epnn1-onln, .preview-epnn2-onln { font-size: 12px; }
        }
        @media (max-width: 480px) {
          .preview-epnn1-img, .preview-epnn2-img { height: 150px; }
          .preview-epnn1-hdln, .preview-epnn2-hdln { font-size: 16px; }
          .preview-epnn1-onln, .preview-epnn2-onln { font-size: 11px; }
        }
      `}</style>

      <div
        className={version === 1 ? "preview-nm-news-1" : "preview-nm-news-2"}
        onClick={handleNavigate}
      >
        {version === 1 && (
          <div className="preview-nm-news-1-inner">
            <div className="preview-epnn1-img"><img src={renderData.image} alt="" /></div>
            <div className="preview-nm1-sbc">
              <div className="preview-epnn1-hdln">{renderData.headline}</div>
              <div className="preview-epnn1-onln">{renderData.content}</div>
              <div className="preview-epnn-tm">{renderData.time}</div>
            </div>
          </div>
        )}

        {version === 2 && (
          <div className="preview-nm-news-2-inner">
            <div className="preview-nm2-sbc">
              <div className="preview-epnn2-hdln">{renderData.headline}</div>
              <div className="preview-epnn2-onln">{renderData.content}</div>
              <div className="preview-epnn-tm">{renderData.time}</div>
            </div>
            <div className="preview-epnn2-img"><img src={renderData.image} alt="" /></div>
          </div>
        )}

        {/* Separator line is INSIDE the container so it matches its width exactly */}
        {showSeparator && <div className="separator-line" />}
      </div>
    </div>
  );
};

export default PreviewNorContainer1;