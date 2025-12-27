import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbArrowsExchange } from "react-icons/tb";
import { IoIosClose } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import jwt from "../../../assets/jwt.jpg";
import {
  dropNewsIntoSlot,
  removeNewsFromSlot,
  dropNewsIntoSliderSlot,
  removeNewsFromSliderSlot,
} from "../../Slice/editpaperslice";


const BigNewsContainer5 = ({
  border = false,
  onDelete,
  slotId,
  catName,
  containerId,
    isSlider = false,
  isSlider2 = false,
}) => {
  const [version, setVersion] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const allNews = useSelector((state) => state.newsform.allNews);
  const slot = useSelector((state) => {
    const page = state.editpaper.pages.find((p) => p.catName === catName);
    
    // ✅ Both slider types now use the same sliders array
    if (isSlider || isSlider2) {
      const slider = page?.sliders.find((s) => s.id === containerId);
      return slider?.items.find((i) => i.slotId === slotId);
    } else {
      const container = page?.containers.find((c) => c.id === containerId);
      return container?.items.find((i) => i.slotId === slotId);
    }
  });
  const newsId = slot?.newsId;
  const news = allNews.find((n) => n.id === newsId);

  const DEFAULT_DATA = {
    media: jwt,
    mediaType: "image",
    headline: "Breaking News Headline Comes Here",
    content: "Drop a news card here",
    time: "Just now",
  };

  const renderData = news
    ? {
        media: (() => {
          const thumb = news.data?.thumbnail || news.data?.video;
          if (!thumb) return DEFAULT_DATA.media;
          if (typeof thumb === "string") return thumb;
          if (thumb instanceof File) return URL.createObjectURL(thumb);
          return DEFAULT_DATA.media;
        })(),
        mediaType: news.data?.video ? "video" : "image",
        headline: news.data?.headline || DEFAULT_DATA.headline,
        content: news.data?.oneLiner || DEFAULT_DATA.content,
        time: news.time || DEFAULT_DATA.time,
      }
    : DEFAULT_DATA;
  const handleDragOver = (e) => e.preventDefault();
const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedId = e.dataTransfer.getData("newsId");
    if (droppedId) {
      // ✅ Use unified slider action for both slider types
      if (isSlider || isSlider2) {
        dispatch(
          dropNewsIntoSliderSlot({
            catName,
            sliderId: containerId,
            slotId,
            newsId: Number(droppedId),
          })
        );
      } else {
        dispatch(
          dropNewsIntoSlot({
            catName,
            containerId,
            slotId,
            newsId: Number(droppedId),
          })
        );
      }
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    
    // ✅ Use unified slider action for both slider types
    if (isSlider || isSlider2) {
      dispatch(
        removeNewsFromSliderSlot({
          catName,
          sliderId: containerId,
          slotId,
        })
      );
    } else {
      dispatch(
        removeNewsFromSlot({
          catName,
          containerId,
          slotId,
        })
      );
    }
    
    onDelete?.();
  };


  const handleChange = (e) => {
    e.stopPropagation();
    setVersion((prev) => (prev === 2 ? 1 : 2));
  };

  const handleNavigate = () => {
    if (!newsId) return;
    navigate(`/preview/${newsId}`);
  };

  const renderMedia = () => {
    if (renderData.mediaType === "video") {
      return (
        <video
          src={renderData.media}
          controls
          muted
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      );
    }
    return (
      <img
        src={renderData.media}
        alt=""
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  };

  return (
    <div
      className="ep-bg-news5-1"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleNavigate}
      style={{
        border: border ? "2px dotted #999" : "none",
        position: "relative",
        cursor: "pointer",
      }}
    >
      <style>{`
        .ep-bg-news5-1 {
          width: fit-content;
          height: fit-content;
          margin: 5px;
          display: flex;
          gap: 10px;
          transition: 0.5s ease-in-out;
        }
        .ep-bg-news5-1:hover {
          color: rgb(237, 1, 141);
        }
        .epbn51-img {
          width: 500px;
          height: 300px;
          border-radius: 5px;
          overflow: hidden;
        }
        .epbn51-hdln {
          font-size: 20px;
          font-weight: bold;
        }
        .epbn51-onln {
          font-size: 13px;
        }
      `}</style>

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
          <div style={{ width: "400px" }}>
            <div className="epbn51-hdln">{renderData.headline}</div>
            <div className="epbn51-onln">{renderData.content}</div>
            <div className="epn-tm">{renderData.time}</div>
          </div>
          <div className="epbn51-img">{renderMedia()}</div>
        </>
      )}

      {version === 2 && (
        <>
          <div className="epbn51-img">{renderMedia()}</div>
          <div style={{ width: "400px" }}>
            <div className="epbn51-hdln">{renderData.headline}</div>
            <div className="epbn51-onln">{renderData.content}</div>
            <div className="epn-tm">{renderData.time}</div>
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
};

export default BigNewsContainer5;
