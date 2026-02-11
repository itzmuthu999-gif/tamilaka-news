import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import jwt from "../../../assets/jwt.jpg";

const PreviewNorContainer1 = ({ newsId, version = 1 }) => {
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
    <div
      className={version === 1 ? "preview-nm-news-1" : "preview-nm-news-2"}
      onClick={handleNavigate}
    >
      <style>
        {`
          .preview-nm-news-1 {
            width: 800px;
            height: fit-content;
            display: flex;
            transition: 0.5s ease-in-out;
            cursor: pointer;
          }
          
          .preview-nm-news-1:hover {
            color: rgb(237, 1, 141);
          }
          
          .preview-epnn1-img {
            width: 390px;
            height: 200px;
            border-radius: 5px;
            overflow: hidden;
            flex-shrink: 0;
          }
          
          .preview-epnn1-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          .preview-ep-nm1-sbc {
            flex: 1;
            min-width: 0;
          }
          
          .preview-epnn1-hdln {
            font-size: 20px;
            font-weight: bold;
          }
          
          .preview-epnn1-onln {
            font-size: 13px;
          }

          .preview-nm-news-2 {
            width: 800px;
            height: fit-content;
            display: flex;
            transition: 0.5s ease-in-out;
            cursor: pointer;
          }
          
          .preview-nm-news-2:hover {
            color: rgb(237, 1, 141);
          }

          .preview-epnn2-img {
            width: 390px;
            height: 200px;
            border-radius: 5px;
            overflow: hidden;
            flex-shrink: 0;
          }
          
          .preview-epnn2-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          .preview-ep-nm2-sbc {
            flex: 1;
            min-width: 0;
          }
          
          .preview-epnn2-hdln {
            font-size: 20px;
            font-weight: bold;
          }
          
          .preview-epnn2-onln {
            font-size: 13px;
          }

          .preview-epn-tm {
            font-size: 12px;
            color: #666;
          }
        `}
      </style>

      {version === 1 && (
        <>
          <div className="preview-epnn1-img">
            <img src={renderData.image} alt="" />
          </div>
          <div className="preview-ep-nm1-sbc">
            <div className="preview-epnn1-hdln">{renderData.headline}</div>
            <div className="preview-epnn1-onln">{renderData.content}</div>
            <div className="preview-epn-tm">{renderData.time}</div>
          </div>
        </>
      )}

      {version === 2 && (
        <>
          <div className="preview-ep-nm2-sbc">
            <div className="preview-epnn2-hdln">{renderData.headline}</div>
            <div className="preview-epnn2-onln">{renderData.content}</div>
            <div className="preview-epn-tm">{renderData.time}</div>
          </div>
          <div className="preview-epnn2-img">
            <img src={renderData.image} alt="" />
          </div>
        </>
      )}
    </div>
  );
};

export default PreviewNorContainer1;
