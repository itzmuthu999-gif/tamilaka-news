import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import jwt from "../assets/jwt.jpg";

const PreviewNorContainer5 = ({ newsId, version = 1 }) => {
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
    <div className="preview-nm-news-5" onClick={handleNavigate}>
      <style>
        {`
          .preview-nm-news-5 {
            width: 400px;
            height: fit-content;
            transition: 0.5s ease-in-out;
            cursor: pointer;
          }
          
          .preview-nm-news-5:hover {
            color: rgb(237, 1, 141);
          }

          .preview-epnn5-img {
            width: 400px;
            height: 250px;
            border-radius: 5px;
            overflow: hidden;
          }
          
          .preview-epnn5-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .preview-epnn5-hdln {
            font-size: 18px;
            font-weight: bold;
          }

          .preview-epnn5-onln {
            font-size: 13px;
          }

          .preview-epn-tm {
            font-size: 12px;
            color: #666;
          }
        `}
      </style>

      <div className="preview-epnn5-img">
        <img src={renderData.image} alt="" />
      </div>
      <div className="preview-epnn5-hdln">{renderData.headline}</div>
      <div className="preview-epnn5-onln">{renderData.content}</div>
      <div className="preview-epn-tm">{renderData.time}</div>
    </div>
  );
};

export default PreviewNorContainer5;
