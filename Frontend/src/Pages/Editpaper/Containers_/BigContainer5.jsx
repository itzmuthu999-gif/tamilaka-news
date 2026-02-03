import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbArrowsExchange } from "react-icons/tb";
import { IoIosClose } from "react-icons/io";
import { MdHorizontalRule } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import jwt from "../../../assets/jwt.jpg";
import {
  dropNewsIntoSlot,
  removeNewsFromSlot,
  dropNewsIntoSliderSlot,
  removeNewsFromSliderSlot,
  dropNewsIntoNestedSlot,
  removeNewsFromNestedSlot,
  toggleContainerSeparator,
  toggleSliderSeparator,
  toggleNestedSeparator,
} from "../../Slice/editpaperslice";

const BigNewsContainer5 = ({
  border = false,
  onDelete,
  slotId,
  catName,
  containerId,
  sliderId,
  isSlider = false,
  isSlider2 = false,
  isNested = false,
  parentContainerId = null,
}) => {
  const [version, setVersion] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const allNews = useSelector((state) => state.newsform.allNews);
  const slot = useSelector((state) => {
    const page = state.editpaper.pages.find((p) => p.catName === catName);
    
    if (isSlider || isSlider2) {
      const slider = page?.containers.find((c) => c.id === containerId)
        ?.sliders?.find((s) => s.id === sliderId);
      return slider?.items.find((i) => i.slotId === slotId);
    } else if (isNested && parentContainerId) {
      const nestedCont = page?.containers.find((c) => c.id === parentContainerId)
        ?.nestedContainers?.find((nc) => nc.id === containerId);
      return nestedCont?.items?.find((i) => i.slotId === slotId);
    } else {
      const container = page?.containers.find((c) => c.id === containerId);
      return container?.items.find((i) => i.slotId === slotId);
    }
  });
  
  const newsId = slot?.newsId;
  const showSeparator = slot?.showSeparator || false;
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
      if (isSlider || isSlider2) {
        dispatch(
          dropNewsIntoSliderSlot({
            catName,
            sliderId: sliderId,
            slotId,
            newsId: Number(droppedId),
            containerId,
            isNested,
            parentContainerId,
          })
        );
      } else if (isNested && parentContainerId) {
        dispatch(
          dropNewsIntoNestedSlot({
            catName,
            parentContainerId,
            nestedContainerId: containerId,
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
    
    // Just call the onDelete prop passed from parent
    // The parent will handle the Redux dispatch
    onDelete?.();
  };

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
          sliderId: sliderId,
          slotId,
          containerId,
          isNested,
          parentContainerId,
        })
      );
    } else if (isNested && parentContainerId) {
      dispatch(
        toggleNestedSeparator({
          catName,
          parentContainerId,
          nestedContainerId: containerId,
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
    <div style={{ position: "relative", width: "100%" }}>
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
            width: 910px;
            height: fit-content;
            display: flex;
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
            flex-shrink: 0;
          }
          
          .epbn51-content {
            width: 400px;
            flex-shrink: 0;
          }
          
          .epbn51-hdln {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 8px;
          }
          
          .epbn51-onln {
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
          @media (max-width: 1200px) {
            .ep-bg-news5-1 {
              width: 100%;
              max-width: 910px;
            }
            
            .epbn51-img {
              width: 55%;
              min-width: 300px;
            }
            
            .epbn51-content {
              width: 45%;
              min-width: 250px;
            }
          }

          @media (max-width: 768px) {
            .ep-bg-news5-1 {
              flex-direction: column;
              width: 100%;
            }
            
            .epbn51-img {
              width: 100%;
              height: 250px;
            }
            
            .epbn51-content {
              width: 100%;
            }
            
            .epbn51-hdln {
              font-size: 18px;
            }
            
            .epbn51-onln {
              font-size: 12px;
            }
          }

          @media (max-width: 480px) {
            .epbn51-img {
              height: 200px;
            }
            
            .epbn51-hdln {
              font-size: 16px;
            }
            
            .epbn51-onln {
              font-size: 11px;
            }
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
            <div className="epbn51-content">
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
            <div className="epbn51-content">
              <div className="epbn51-hdln">{renderData.headline}</div>
              <div className="epbn51-onln">{renderData.content}</div>
              <div className="epn-tm">{renderData.time}</div>
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
};

export default BigNewsContainer5;