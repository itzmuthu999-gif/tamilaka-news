import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import jwt from "../../../assets/jwt.jpg";

const PreviewNorContainer4 = ({ newsId, version = 1, showSeparator = false }) => {
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
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${diffDays} d ago`;
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
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
        className={version === 1 ? "preview-nm-news-7" : "preview-nm-news-8"}
        onClick={handleNavigate}
        style={{ cursor: "pointer" }}
      >
        <style>
          {`
            .preview-nm-news-7 {
              width: 300px;
              max-width: 300px;
              flex: 0 0 300px;
              display: flex;
              flex-direction: column;
              transition: 0.5s ease-in-out;
            }

            .preview-nm-news-7:hover {
              color: rgb(237, 1, 141);
            }

            .preview-nm-news-8 {
              width: 300px;
              max-width: 300px;
              flex: 0 0 300px;
              display: flex;
              flex-direction: column;
              transition: 0.5s ease-in-out;
            }

            .preview-nm-news-8:hover {
              color: rgb(237, 1, 141);
            }

            .preview-nm7-inner,
            .preview-nm8-inner {
              display: flex;
              width: 100%;
              height: 100px;
              max-height: 100px;
              overflow: hidden;
            }

            .preview-nm7-sbc,
            .preview-nm8-sbc {
              flex: 1;
              min-width: 0;
            }

            .preview-epnn7-img {
              width: 100px;
              height: 100px;
              border-radius: 5px;
              overflow: hidden;
              flex-shrink: 0;
            }

            .preview-epnn7-img img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .preview-epnn7-hdln {
              font-size: 15px;
              font-weight: bold;
              height: 84px;
              overflow: hidden;
            }

            .preview-epnn7-tm {
              font-size: 10px;
              color: gray;
            }

            .preview-epnn8-img {
              width: 100px;
              height: 100px;
              border-radius: 5px;
              overflow: hidden;
              flex-shrink: 0;
            }

            .preview-epnn8-img img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .preview-epnn8-hdln {
              font-size: 15px;
              font-weight: bold;
              height: 84px;
              overflow: hidden;
            }

            .preview-epnn8-tm {
              font-size: 10px;
              color: gray;
            }

            .separator-line {
              width: 100%;
              height: 1px;
              background-color: #999;
              margin-top: 10px;
              display: block;
            }

            @media (max-width: 768px) {
              .preview-nm-news-7,
              .preview-nm-news-8 {
                width: 100%;
                max-width: 300px;
                flex: 1 1 auto;
              }

              .preview-nm7-inner,
              .preview-nm8-inner {
                height: auto;
                min-height: 100px;
              }

              .preview-epnn7-img,
              .preview-epnn8-img {
                width: 90px;
                height: 90px;
              }

              .preview-epnn7-hdln,
              .preview-epnn8-hdln {
                font-size: 14px;
                height: auto;
              }
            }

            @media (max-width: 480px) {
              .preview-nm-news-7,
              .preview-nm-news-8 {
                max-width: 100%;
              }

              .preview-nm7-inner,
              .preview-nm8-inner {
                flex-direction: column;
                height: auto;
              }

              .preview-epnn7-img,
              .preview-epnn8-img {
                width: 100%;
                height: 120px;
              }

              .preview-nm7-sbc,
              .preview-nm8-sbc {
                width: 100%;
              }

              .preview-epnn7-hdln,
              .preview-epnn8-hdln {
                font-size: 13px;
                height: auto;
                max-height: none;
              }
            }
          `}
        </style>

        {version === 1 && (
          <div className="preview-nm7-inner">
            <div className="preview-epnn7-img">
              <img src={renderData.image} alt="" />
            </div>
            <div className="preview-nm7-sbc">
              <div className="preview-epnn7-hdln">{renderData.headline}</div>
              <div className="preview-epnn7-tm">{renderData.time}</div>
            </div>
          </div>
        )}

        {version === 2 && (
          <div className="preview-nm8-inner">
            <div className="preview-nm8-sbc">
              <div className="preview-epnn8-hdln">{renderData.headline}</div>
              <div className="preview-epnn8-tm">{renderData.time}</div>
            </div>
            <div className="preview-epnn8-img">
              <img src={renderData.image} alt="" />
            </div>
          </div>
        )}

        {/* Separator line is INSIDE the container so it matches its width exactly */}
        {showSeparator && <div className="separator-line" />}
      </div>
    </div>
  );
};

export default PreviewNorContainer4;