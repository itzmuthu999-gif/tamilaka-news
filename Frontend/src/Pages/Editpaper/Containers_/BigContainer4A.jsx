import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbArrowsExchange } from "react-icons/tb";
import { IoIosClose } from "react-icons/io";
import { HiOutlineMinus } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import {
  dropNewsIntoSlot,
  removeNewsFromSlot,
  dropNewsIntoSliderSlot,
  removeNewsFromSliderSlot,
  toggleContainerSeparator,
  toggleSliderSeparator,
} from "../../Slice/editpaperslice";

import jwt from "../../../assets/jwt.jpg";

const BigNewsContainer4A = ({
  border = false,
  onDelete,
  slotId,
  catName,
  containerId,
  size = 280,
  isSlider = false,
  isSlider2 = false,
}) => {
  const [version, setVersion] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { allNews, translatedNews, language } = useSelector(
    (state) => state.newsform
  );

  const showSeparator = useSelector((state) => {
    const page = state.editpaper.pages.find((p) => p.catName === catName);
    if (isSlider || isSlider2) {
      const slider = page?.sliders.find((s) => s.id === containerId);
      const item = slider?.items.find((i) => i.slotId === slotId);
      return item?.showSeparator || false;
    } else {
      const container = page?.containers.find((c) => c.id === containerId);
      const item = container?.items.find((i) => i.slotId === slotId);
      return item?.showSeparator || false;
    }
  });

  const slot = useSelector((state) => {
    const page = state.editpaper.pages.find((p) => p.catName === catName);
    if (isSlider || isSlider2) {
      const slider = page?.sliders.find((s) => s.id === containerId);
      return slider?.items.find((i) => i.slotId === slotId);
    } else {
      const container = page?.containers.find((c) => c.id === containerId);
      return container?.items.find((i) => i.slotId === slotId);
    }
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

  const handleDragOver = (e) => e.preventDefault();

  const handleChange = (e) => {
    e.stopPropagation();
    setVersion((prev) => (prev === 2 ? 1 : 2));
  };

  const handleNavigate = () => {
    if (!newsId) return;
    navigate(`/preview/${newsId}`);
  };

  const toggleSeparator = (e) => {
    e.stopPropagation();
    if (isSlider || isSlider2) {
      dispatch(
        toggleSliderSeparator({
          catName,
          sliderId: containerId,
          slotId,
        })
      );
    } else {
      dispatch(
        toggleContainerSeparator({
          catName,
          containerId,
          slotId,
        })
      );
    }
  };

  return (
    <div
      className="ep-bg-news-4a-wrapper"
      style={{
        position: "relative",
        width: "fit-content",
      }}
    >
      <style>
        {`
        .ep-bg-news-4a-wrapper {
          display: inline-block;
        }

        .ep-bg-news-4a {
          width: ${size}px;
          height: fit-content;
          margin: 5px;
          transition: 0.5s ease-in-out;
          cursor: pointer;
          gap: 5px;
        }

        .ep-bg-news-4a:hover {
          color: rgb(237, 1, 141);
        }

        .epbn4a-img {
          width: ${size}px;
          height: ${size}px;
          border-radius: 5px;
          overflow: hidden;
        }

        .epbn4a-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .epbn4a-hdln {
          font-size: 20px;
          font-weight: bold;
          word-wrap: break-word;
        }

        .separator-line {
          width: 100%;
          height: 1px;
          background-color: #999;
          margin-top: 5px;
        }

        .separator-btn {
          position: absolute;
          bottom: -14px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid #ccc;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
          z-index: 10;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: all 0.2s ease;
        }

        .separator-btn:hover {
          background: rgba(240, 240, 240, 0.95);
          border-color: #999;
        }

        .separator-btn.active {
          background: rgba(153, 153, 153, 0.95);
          color: #fff;
          border-color: #666;
        }

        /* Tablet and below */
        @media (max-width: 1024px) {
          .ep-bg-news-4a {
            width: 100%;
            max-width: ${size}px;
          }

          .epbn4a-img {
            width: 100%;
            height: auto;
            aspect-ratio: 1 / 1;
          }
        }

        /* Mobile */
        @media (max-width: 640px) {
          .ep-bg-news-4a {
            margin: 3px;
          }

          .epbn4a-img {
            border-radius: 3px;
          }

          .epbn4a-hdln {
            font-size: 18px;
          }

          .separator-btn {
            width: 24px;
            height: 24px;
            font-size: 14px;
            bottom: -12px;
          }
        }

        /* Small mobile */
        @media (max-width: 480px) {
          .epbn4a-hdln {
            font-size: 16px;
          }
        }
      `}
      </style>

      <div
        className="ep-bg-news-4a"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleNavigate}
        style={{
          border: border ? "2px dotted #999" : "none",
        }}
      >
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
            <button onClick={handleChange} style={iconBtnStyle} title="Change layout">
              <TbArrowsExchange />
            </button>
            <button
              onDoubleClick={handleDelete}
              style={iconBtnStyle}
              title="Double click to delete"
            >
              <IoIosClose />
            </button>
          </div>
        )}

        {version === 1 && (
          <>
            <div className="epbn4a-img">
              <img src={renderData.image} alt="" />
            </div>
            <div className="epbn4a-hdln">{renderData.headline}</div>
            <div className="epn-tm">{renderData.time}</div>
          </>
        )}

        {version === 2 && (
          <>
            <div className="epbn4a-hdln">{renderData.headline}</div>
            <div className="epbn4a-img">
              <img src={renderData.image} alt="" />
            </div>
            <div className="epn-tm">{renderData.time}</div>
          </>
        )}
      </div>

      {/* Separator line - OUTSIDE the container */}
      {showSeparator && <div className="separator-line"></div>}

      {/* Separator toggle button */}
      <button
        onClick={toggleSeparator}
        className={`separator-btn ${showSeparator ? "active" : ""}`}
        title={showSeparator ? "Remove separator" : "Add separator"}
      >
        <HiOutlineMinus />
      </button>
    </div>
  );
};

const iconBtnStyle = {
  background: "rgba(255, 255, 255, 0.9)",
  border: "1px solid #ccc",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "4px",
  transition: "all 0.2s ease",
};

export default BigNewsContainer4A;