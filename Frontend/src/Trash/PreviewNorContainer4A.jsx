import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import jwt from "../assets/jwt.jpg";

const PreviewNorContainer4A = ({ newsId, version = 1 }) => {
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
    <div className={version === 1 ? "preview-nm-news-7a" : "preview-nm-news-8a"} onClick={handleNavigate}>
      <style>
        {`
          .preview-nm-news-7a {
            width: 100%;
            max-width: 300px;
            height: 100px;
            overflow: hidden;
            display: flex;
            transition: 0.5s ease-in-out;
            cursor: pointer;
          }
          
          .preview-nm-news-7a:hover {
            color: rgb(237, 1, 141);
          }

          .preview-nm7a-sbc {
            flex: 1;
            min-width: 0;
            padding-left: 10px;
          }
          
          .preview-epnn7a-img {
            width: 100px;
            height: 100px;
            border-radius: 5px;
            overflow: hidden;
            flex-shrink: 0;
          }
          
          .preview-epnn7a-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .preview-epnn7a-hdln {
            font-size: 15px;
            font-weight: bold;
            height: 84px;
            overflow: hidden;
          }

          .preview-nm-news-8a {
            width: 100%;
            max-width: 300px;
            height: 100px;
            overflow: hidden;
            display: flex;
            transition: 0.5s ease-in-out;
            cursor: pointer;
          }
          
          .preview-nm-news-8a:hover {
            color: rgb(237, 1, 141);
          }

          .preview-nm8a-sbc {
            flex: 1;
            min-width: 0;
            padding-right: 10px;
          }
          
          .preview-epnn8a-img {
            width: 100px;
            height: 100px;
            border-radius: 5px;
            overflow: hidden;
            flex-shrink: 0;
          }
          
          .preview-epnn8a-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .preview-epnn8a-hdln {
            font-size: 15px;
            font-weight: bold;
            height: 84px;
            overflow: hidden;
          }

          .preview-epn-tm {
            font-size: 10px;
            color: gray;
            margin-top: 5px;
          }

          @media (max-width: 768px) {
            .preview-nm-news-7a,
            .preview-nm-news-8a {
              width: 100%;
              max-width: 300px;
              height: auto;
              min-height: 100px;
            }
            
            .preview-epnn7a-img,
            .preview-epnn8a-img {
              width: 90px;
              height: 90px;
            }
            
            .preview-epnn7a-hdln,
            .preview-epnn8a-hdln {
              font-size: 14px;
              height: auto;
            }
          }

          @media (max-width: 480px) {
            .preview-nm-news-7a,
            .preview-nm-news-8a {
              flex-direction: column;
              height: auto;
              max-width: 100%;
            }
            
            .preview-epnn7a-img,
            .preview-epnn8a-img {
              width: 100%;
              height: 120px;
            }
            
            .preview-nm7a-sbc,
            .preview-nm8a-sbc {
              width: 100%;
              padding-left: 0;
              padding-right: 0;
              padding-top: 10px;
            }
            
            .preview-epnn7a-hdln,
            .preview-epnn8a-hdln {
              font-size: 13px;
              height: auto;
              max-height: none;
            }
          }
        `}
      </style>

      {version === 1 && (
        <>
          <div className="preview-epnn7a-img">
            <img src={renderData.image} alt="" />
          </div>
          <div className="preview-nm7a-sbc">
            <div className="preview-epnn7a-hdln">{renderData.headline}</div>
            <div className="preview-epn-tm">{renderData.time}</div>
          </div>
        </>
      )}

      {version === 2 && (
        <>
          <div className="preview-nm8a-sbc">
            <div className="preview-epnn8a-hdln">{renderData.headline}</div>
            <div className="preview-epn-tm">{renderData.time}</div>
          </div>
          <div className="preview-epnn8a-img">
            <img src={renderData.image} alt="" />
          </div>
        </>
      )}
    </div>
  );
};

export default PreviewNorContainer4A;