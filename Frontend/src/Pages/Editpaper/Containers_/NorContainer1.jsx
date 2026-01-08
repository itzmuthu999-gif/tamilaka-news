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

const NorContainer1 = ({
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
        className={version === 1 ? "ep-nm-news-1" : "ep-nm-news-2"}
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
            .ep-nm-news-1 {
              width: 800px;
              height: fit-content;
              margin: 5px;
              display: flex;
              gap: 10px;
              transition: 0.5s ease-in-out;
              cursor: pointer;
            }
            
            .ep-nm-news-1:hover {
              color: rgb(237, 1, 141);
            }
            
            .epnn1-img {
              width: 390px;
              height: 200px;
              max-width: 700px;
              max-height: 200px;
              border-radius: 5px;
              overflow: hidden;
              flex-shrink: 0;
            }
            
            .epnn1-img img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            
            .ep-nm1-sbc {
              flex: 1;
              min-width: 0;
            }
            
            .epnn1-hdln {
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 8px;
            }
            
            .epnn1-onln {
              font-size: 13px;
              margin-bottom: 8px;
            }

            .ep-nm-news-2 {
              width: 800px;
              height: fit-content;
              margin: 5px;
              display: flex;
              gap: 10px;
              transition: 0.5s ease-in-out;
              cursor: pointer;
            }
            
            .ep-nm-news-2:hover {
              color: rgb(237, 1, 141);
            }

            .epnn2-img {
              width: 390px;
              height: 200px;
              border-radius: 5px;
              overflow: hidden;
              flex-shrink: 0;
            }
            
            .epnn2-img img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            
            .ep-nm2-sbc {
              flex: 1;
              min-width: 0;
            }
            
            .epnn2-hdln {
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 8px;
            }
            
            .epnn2-onln {
              font-size: 13px;
              margin-bottom: 8px;
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
            @media (max-width: 1024px) {
              .ep-nm-news-1,
              .ep-nm-news-2 {
                width: 100%;
                max-width: 800px;
              }
              
              .epnn1-img,
              .epnn2-img {
                width: 45%;
                min-width: 250px;
              }
            }

            @media (max-width: 768px) {
              .ep-nm-news-1,
              .ep-nm-news-2 {
                flex-direction: column;
                width: 100%;
              }
              
              .epnn1-img,
              .epnn2-img {
                width: 100%;
                height: 180px;
              }
              
              .epnn1-hdln,
              .epnn2-hdln {
                font-size: 18px;
              }
              
              .epnn1-onln,
              .epnn2-onln {
                font-size: 12px;
              }
            }

            @media (max-width: 480px) {
              .epnn1-img,
              .epnn2-img {
                height: 150px;
              }
              
              .epnn1-hdln,
              .epnn2-hdln {
                font-size: 16px;
              }
              
              .epnn1-onln,
              .epnn2-onln {
                font-size: 11px;
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

        {/* VERSION 1 */}
        {version === 1 && (
          <>
            <div className="epnn1-img">
              <img src={renderData.image} alt="" />
            </div>
            <div className="ep-nm1-sbc">
              <div className="epnn1-hdln">{renderData.headline}</div>
              <div className="epnn1-onln">{renderData.content}</div>
              <div className="epn-tm">{renderData.time}</div>
            </div>
          </>
        )}

        {/* VERSION 2 */}
        {version === 2 && (
          <>
            <div className="ep-nm2-sbc">
              <div className="epnn2-hdln">{renderData.headline}</div>
              <div className="epnn2-onln">{renderData.content}</div>
              <div className="epn-tm">{renderData.time}</div>
            </div>
            <div className="epnn2-img">
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

export default NorContainer1;