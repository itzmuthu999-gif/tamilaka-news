import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbArrowsExchange } from "react-icons/tb";
import { IoIosClose } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import {
  dropNewsIntoSlot,
  removeNewsFromSlot,
} from "../../Slice/editpaperslice";
import jwt from "../../../assets/jwt.jpg";

const BigNewsContainer4A = ({
  border = false,
  onDelete,
  slotId,
  catName,
  containerId,
  size = 280,
}) => {
  const [version, setVersion] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { allNews, translatedNews, language } = useSelector(
    (state) => state.newsform
  );

  const slot = useSelector((state) => {
    const page = state.editpaper.pages.find((p) => p.catName === catName);
    const container = page?.containers.find((c) => c.id === containerId);
    return container?.items.find((i) => i.slotId === slotId);
  });

  const newsId = slot?.newsId;
  const newsSource = language === "en" ? translatedNews : allNews;
  const news = newsSource.find((n) => n.id === newsId);

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
      dispatch(
        dropNewsIntoSlot({
          catName,
          containerId,
          slotId,
          newsId: Number(droppedId),
        })
      );
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    dispatch(
      removeNewsFromSlot({
        catName,
        containerId,
        slotId,
      })
    );
    onDelete?.();
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleChange = (e) => {
    e.stopPropagation();
    setVersion((prev) => (prev === 2 ? 1 : prev + 1));
  };

  const handleNavigate = () => {
    if (!newsId) return;
    navigate(`/preview/${newsId}`);
  };

  return (
    <div
      className="ep-bg-news-4"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleNavigate}
      style={{
        border: border ? "2px dotted #999" : "none",
        position: "relative",
      }}
    >
      <style>
        {`
        .ep-bg-news-4 {
          width: ${size}px;
          height: fit-content;
          margin: 5px;
          transition: 0.5s ease-in-out;
          cursor: pointer;
          gap: 5px;
        }
        .ep-bg-news-4:hover {
          color: rgb(237, 1, 141);
        }
        .epbn4-img {
          width: ${size}px;
          height: ${size}px;
          border-radius: 5px;
          overflow: hidden;
        }
        .epbn4-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .epbn4-hdln {
          font-size: 20px;
          font-weight: bold;
        }
      `}
      </style>

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
          <button onClick={handleChange} style={iconBtnStyle}>
            <TbArrowsExchange />
          </button>
          <button onDoubleClick={handleDelete} style={iconBtnStyle}>
            <IoIosClose />
          </button>
        </div>
      )}

      {version === 1 && (
        <>
          <div className="epbn4-img">
            <img src={renderData.image} alt="" />
          </div>
          <div className="epbn4-hdln">{renderData.headline}</div>
          <div className="epn-tm">{renderData.time}</div>
        </>
      )}

      {version === 2 && (
        <>
          <div className="epbn4-hdln">{renderData.headline}</div>
          <div className="epbn4-img">
            <img src={renderData.image} alt="" />
          </div>
          <div className="epn-tm">{renderData.time}</div>
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

export default BigNewsContainer4A;
