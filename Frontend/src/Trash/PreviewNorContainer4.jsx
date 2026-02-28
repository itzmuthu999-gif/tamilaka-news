import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import jwt from "../assets/jwt.jpg";

const PreviewNorContainer4 = ({ newsId, version = 1 }) => {
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
      className={version === 1 ? "preview-nm-news-7" : "preview-nm-news-8"}
      onClick={handleNavigate}
    >
      <style>
        {`
          .preview-nm-news-7 {
            width: 300px;
            height: 100px;
            overflow: hidden;
            display: flex;
            transition: 0.5s ease-in-out;
            cursor: pointer;
          }
          
          .preview-nm-news-7:hover {
            color: rgb(237, 1, 141);
          }

          .preview-ep-nm7-sbc {
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

          .preview-nm-news-8 {
            width: 300px;
            height: 100px;
            overflow: hidden;
            display: flex;
            transition: 0.5s ease-in-out;
            cursor: pointer;
          }
          
          .preview-nm-news-8:hover {
            color: rgb(237, 1, 141);
          }

          .preview-ep-nm8-sbc {
            flex: 1;
            min-width: 0;
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

          .preview-epn-tm {
            font-size: 10px;
            color: gray;
          }
        `}
      </style>

      {version === 1 && (
        <>
          <div className="preview-epnn7-img">
            <img src={renderData.image} alt="" />
          </div>
          <div className="preview-ep-nm7-sbc">
            <div className="preview-epnn7-hdln">{renderData.content}</div>
            <div className="preview-epn-tm">{renderData.time}</div>
          </div>
        </>
      )}

      {version === 2 && (
        <>
          <div className="preview-ep-nm8-sbc">
            <div className="preview-epnn8-hdln">{renderData.content}</div>
            <div className="preview-epn-tm">{renderData.time}</div>
          </div>
          <div className="preview-epnn8-img">
            <img src={renderData.image} alt="" />
          </div>
        </>
      )}
    </div>
  );
};

export default PreviewNorContainer4;
