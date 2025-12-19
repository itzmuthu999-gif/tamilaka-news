import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbArrowsExchange } from "react-icons/tb";
import { IoIosClose } from "react-icons/io";
import { useSelector } from "react-redux";
import jwt from "../../../assets/jwt.jpg";

const NorContainer5 = ({
  border = false,
  onDelete
}) => {
  const [version, setVersion] = useState(1);
  const [newsId, setNewsId] = useState(null);
  const navigate = useNavigate();

  const allNews = useSelector((state) => state.newsform.allNews);
  const news = allNews.find((n) => n.id === newsId);

  const DEFAULT_DATA = {
    image: jwt,
    headline: "Breaking News Headline Comes Here",
    content:
      "This is a short description of the news. Drop a news card to replace this content.",
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

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedId = e.dataTransfer.getData("newsId");
    if (droppedId) {
      setNewsId(Number(droppedId));
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleChange = (e) => {
    e.stopPropagation();
    setVersion((prev) => (prev === 3 ? 1 : prev + 1));
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setNewsId(null); // reset to default template
    onDelete?.();
  };

  const handleNavigate = () => {
    if (!newsId) return; // don't navigate for default template
    navigate(`/preview/${newsId}`);
  };


  return (
    <div
      className={version === 1 ? "ep-nm2-news-2" : "ep-nm2-news-3"}
  onDrop={handleDrop}
  onDragOver={handleDragOver}
  onClick={handleNavigate}
  style={{
    border: border ? "2px dotted #999" : "none",
    position: "relative"
  }}
    >

      {/* Action buttons */}
      {border && (
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            display: "flex",
            gap: "6px",
            zIndex: 10,
          }}
        >
          {/* Change layout */}
          <button
            onClick={handleChange}
            style={iconBtnStyle}
            title="Change layout"
          >
            <TbArrowsExchange />
          </button>

          {/* Delete (double click) */}
          <button
            onDoubleClick={handleDelete}
            style={iconBtnStyle}
            title="Double click to delete"
          >
            <IoIosClose />
          </button>
        </div>
      )}

      {/* VERSION 1 */}
      {version === 1 && (
        <>
          <div className="epbn22-hdln">{renderData.headline}</div>

          <div className="ep-nm22-sbc">
            <div className="ep-nm22sbc-c1" >
              <div className="epnn22-onln">{renderData.content}</div>
              <div className="epn-tm">{renderData.time}</div>
            </div>

            <div className="epnn22-img">
              <img src={renderData.image} alt="" />
            </div>
          </div>
        </>
      )}

      {/* VERSION 2 */}
      {version === 2 && (
        <>
          <div className="epbn23-hdln">{renderData.headline}</div>

          <div className="ep-nm23-sbc">
            <div className="epnn23-img">
              <img src={renderData.image} alt="" />
            </div>

            <div className="ep-nm23sbc-c1" >
              <div className="epnn23-onln">{renderData.content}</div>
              <div className="epn-tm">{renderData.time}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const iconBtnStyle = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontSize: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default NorContainer5;
