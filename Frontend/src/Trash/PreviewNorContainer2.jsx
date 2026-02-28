import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import jwt from "../assets/jwt.jpg";

const PreviewNorContainer2 = ({ newsId, version = 1 }) => {
  const navigate = useNavigate();
  const allNews = useSelector((state) => state.newsform?.allNews || []);
  const news = allNews.find((n) => n.id === newsId);

  const DEFAULT_DATA = {
    image: jwt,
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
      className={version === 1 ? "preview-nm-news-3" : "preview-nm-news-4"}
      onClick={handleNavigate}
    >
      <style>
        {`
          .preview-nm-news-3 {
            width: 395px;
            height: 100px;
            overflow: hidden;
            display: flex;
            transition: 0.5s ease-in-out;
            cursor: pointer;
          }
          
          .preview-nm-news-3:hover {
            color: rgb(237, 1, 141);
          }

          .preview-ep-nm3-sbc {
            flex: 1;
            min-width: 0;
          }
          
          .preview-epnn3-img {
            width: 200px;
            height: 100px;
            border-radius: 5px;
            overflow: hidden;
            flex-shrink: 0;
          }
          
          .preview-epnn3-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .preview-epnn3-onln {
            font-size: 13px;
            height: 84px;
            overflow: hidden;
          }

          .preview-nm-news-4 {
            width: 395px;
            height: 100px;
            overflow: hidden;
            display: flex;
            transition: 0.5s ease-in-out;
            cursor: pointer;
          }
          
          .preview-nm-news-4:hover {
            color: rgb(237, 1, 141);
          }

          .preview-ep-nm4-sbc {
            flex: 1;
            min-width: 0;
          }

          .preview-epnn4-img {
            width: 200px;
            height: 100px;
            border-radius: 5px;
            overflow: hidden;
            flex-shrink: 0;
          }
          
          .preview-epnn4-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .preview-epnn4-onln {
            font-size: 13px;
            height: 84px;
            overflow: hidden;
          }

          .preview-epn-tm {
            font-size: 12px;
            color: #666;
          }
        `}
      </style>

      {version === 1 && (
        <>
          <div className="preview-epnn3-img">
            <img src={renderData.image} alt="" />
          </div>
          <div className="preview-ep-nm3-sbc">
            <div className="preview-epnn3-onln">{renderData.content}</div>
            <div className="preview-epn-tm">{renderData.time}</div>
          </div>
        </>
      )}

      {version === 2 && (
        <>
          <div className="preview-ep-nm4-sbc">
            <div className="preview-epnn4-onln">{renderData.content}</div>
            <div className="preview-epn-tm">{renderData.time}</div>
          </div>
          <div className="preview-epnn4-img">
            <img src={renderData.image} alt="" />
          </div>
        </>
      )}
    </div>
  );
};

export default PreviewNorContainer2;
