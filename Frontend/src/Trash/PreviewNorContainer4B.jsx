import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import jwt from "../../../assets/jwt.jpg";

const PreviewNorContainer4B = ({ newsId, version = 1 }) => {
  const navigate = useNavigate();
  const allNews = useSelector((state) => state.newsform?.allNews || []);
  const news = allNews.find((n) => n.id === newsId);

  const DEFAULT_DATA = {
    image: jwt,
    headline: "Breaking News Headline Comes Here",
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
        time: news.time || DEFAULT_DATA.time,
      }
    : DEFAULT_DATA;

  const handleNavigate = () => {
    if (!newsId) return;
    navigate(`/preview/${newsId}`);
  };

  return (
    <div className="preview-nm-news-4b" onClick={handleNavigate}>
      <style>
        {`
          .preview-nm-news-4b {
            width: 200px;
            height: fit-content;
            transition: 0.5s ease-in-out;
            cursor: pointer;
          }
          
          .preview-nm-news-4b:hover {
            color: rgb(237, 1, 141);
          }

          .preview-epnn4b-img {
            width: 200px;
            height: 200px;
            border-radius: 5px;
            overflow: hidden;
          }
          
          .preview-epnn4b-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .preview-epnn4b-hdln {
            font-size: 14px;
            font-weight: bold;
          }

          .preview-epn-tm {
            font-size: 11px;
            color: #666;
          }
        `}
      </style>

      <div className="preview-epnn4b-img">
        <img src={renderData.image} alt="" />
      </div>
      <div className="preview-epnn4b-hdln">{renderData.headline}</div>
      <div className="preview-epn-tm">{renderData.time}</div>
    </div>
  );
};

export default PreviewNorContainer4B;
