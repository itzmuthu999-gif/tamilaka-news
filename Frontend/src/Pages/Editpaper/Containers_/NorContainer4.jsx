import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbArrowsExchange } from "react-icons/tb";
import { IoIosClose } from "react-icons/io";
import { MdHorizontalRule } from "react-icons/md";
import {
  dropNewsIntoSlot,
  removeNewsFromSlot,
  dropNewsIntoSliderSlot,
  removeNewsFromSliderSlot,
  toggleContainerSeparator,
  toggleSliderSeparator,
} from "../../Slice/editpaperslice";

import { useSelector, useDispatch } from "react-redux";
import jwt from "../../../assets/jwt.jpg";

const NorContainer4 = ({
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
    
    if (isSlider || isSlider2) {
      const slider = page?.sliders.find((s) => s.id === containerId);
      return slider?.items.find((i) => i.slotId === slotId);
    } else {
      const container = page?.containers.find((c) => c.id === containerId);
      return container?.items.find((i) => i.slotId === slotId);
    }
  });

  const newsId = slot?.newsId;
  const showSeparator = slot?.showSeparator || false;
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

  const handleToggleSeparator = (e) => {
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

  const handleNavigate = () => {
    if (!newsId) return;
    navigate(`/preview/${newsId}`);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div
        className={version === 1 ? "ep-nm-news-7" : "ep-nm-news-8"}
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
            .ep-nm-news-7 {
              width: 300px;
              height: 100px;
              max-width: 300px;
              max-height: 100px;
              flex: 0 0 300px;
              margin: 4px;
              overflow: hidden;
              display: flex;
              gap: 10px;
              transition: 0.5s ease-in-out;
              cursor: pointer;
            }
            
            .ep-nm-news-7:hover {
              color: rgb(237, 1, 141);
            }

            .ep-nm7-sbc {
              flex: 1;
              min-width: 0;
            }
            
            .epnn7-img {
              width: 100px;
              height: 100px;
              border-radius: 5px;
              overflow: hidden;
              flex-shrink: 0;
            }
            
            .epnn7-img img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .epnn7-hdln {
              font-size: 15px;
              font-weight: bold;
              height: 84px;
              overflow: hidden;
            }

            .ep-nm-news-8 {
              width: 300px;
              height: 100px;
              max-width: 300px;
              max-height: 100px;
              flex: 0 0 300px;
              margin: 4px;
              overflow: hidden;
              display: flex;
              gap: 10px;
              transition: 0.5s ease-in-out;
              cursor: pointer;
            }
            
            .ep-nm-news-8:hover {
              color: rgb(237, 1, 141);
            }

            .ep-nm8-sbc {
              flex: 1;
              min-width: 0;
            }
            
            .epnn8-img {
              width: 100px;
              height: 100px;
              border-radius: 5px;
              overflow: hidden;
              flex-shrink: 0;
            }
            
            .epnn8-img img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .epnn8-hdln {
              font-size: 15px;
              font-weight: bold;
              height: 84px;
              overflow: hidden;
            }

            .epn-tm {
              font-size: 10px;
              color: gray;
            }

            .separator-btn-wrapper {
              position: absolute;
              bottom: -20px;
              left: 50%;
              transform: translateX(-50%);
              z-index: 15;
            }
            
            .separator-line {
              width: 100%;
              height: 1px;
              background-color: #999;
              margin-top: 10px;
            }

            /* Responsive Styles */
            @media (max-width: 768px) {
              .ep-nm-news-7,
              .ep-nm-news-8 {
                width: 100%;
                max-width: 300px;
                flex: 1 1 auto;
                height: auto;
                min-height: 100px;
              }
              
              .epnn7-img,
              .epnn8-img {
                width: 90px;
                height: 90px;
              }
              
              .epnn7-hdln,
              .epnn8-hdln {
                font-size: 14px;
                height: auto;
              }
            }

            @media (max-width: 480px) {
              .ep-nm-news-7,
              .ep-nm-news-8 {
                flex-direction: column;
                height: auto;
                max-width: 100%;
              }
              
              .epnn7-img,
              .epnn8-img {
                width: 100%;
                height: 120px;
              }
              
              .ep-nm7-sbc,
              .ep-nm8-sbc {
                width: 100%;
              }
              
              .epnn7-hdln,
              .epnn8-hdln {
                font-size: 13px;
                height: auto;
                max-height: none;
              }
            }
          `}
        </style>

        {/* Action Buttons */}
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
            <button
              onClick={handleChange}
              style={iconBtnStyle}
              title="Change layout"
            >
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

        {/* VERSION 1 - Image left */}
        {version === 1 && (
          <>
            <div className="epnn7-img">
              <img src={renderData.image} alt="" />
            </div>
            <div className="ep-nm7-sbc">
              <div className="epnn7-hdln">{renderData.headline}</div>
              <div className="epn-tm">{renderData.time}</div>
            </div>
          </>
        )}

        {/* VERSION 2 - Image right */}
        {version === 2 && (
          <>
            <div className="ep-nm8-sbc">
              <div className="epnn8-hdln">{renderData.headline}</div>
              <div className="epn-tm">{renderData.time}</div>
            </div>
            <div className="epnn8-img">
              <img src={renderData.image} alt="" />
            </div>
          </>
        )}
      </div>

      {/* Separator Toggle Button */}
      {border && (
        <div className="separator-btn-wrapper">
          <button
            onClick={handleToggleSeparator}
            style={{
              ...iconBtnStyle,
              backgroundColor: showSeparator ? "#666" : "#ccc",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #999",
            }}
            title="Toggle separator line"
          >
            <MdHorizontalRule size={20} color={showSeparator ? "#fff" : "#666"} />
          </button>
        </div>
      )}

      {/* Separator Line */}
      {showSeparator && <div className="separator-line" />}
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

export default NorContainer4;