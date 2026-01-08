import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbArrowsExchange } from "react-icons/tb";
import { IoIosClose } from "react-icons/io";
import { HiOutlineMinus } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import jwt from "../../../assets/jwt.jpg";
import {
  dropNewsIntoSlot,
  removeNewsFromSlot,
  dropNewsIntoSliderSlot,
  removeNewsFromSliderSlot,
  toggleContainerSeparator,
  toggleSliderSeparator,
} from "../../Slice/editpaperslice";

const BigNewsContainer1 = ({
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
  
  // Get separator state from Redux
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
    setVersion((prev) => (prev === 3 ? 1 : prev + 1));
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
      className="ep-bg-news-1"
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
          .ep-bg-news-1 {
            width: 800px; 
            height: fit-content;
            margin: 5px;
            transition: 0.5s ease-in-out;
            cursor: pointer;
          }
          
          .ep-bg-news-1:hover {
            color: rgb(237, 1, 141);
          }

          .epbn1-img {
            width: 800px;
            height: 500px;
            border-radius: 5px;
            overflow: hidden;
          }
          
          .epbn1-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          .epbn1-hdln {
            font-size: 25px;
            font-weight: bold;
          }

          .epbn1-onln {
            font-size: 14px;
          }

          .separator-line {
            width: 100%;
            height: 1px;
            background-color: #999;
            margin-top: 10px;
          }

          .separator-btn {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid #ccc;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 16px;
            color: #666;
            transition: all 0.2s;
            z-index: 10;
          }

          .separator-btn:hover {
            background: rgba(255, 255, 255, 1);
            color: #333;
            border-color: #999;
          }

          .separator-btn.active {
            background: rgba(153, 153, 153, 0.9);
            color: white;
            border-color: #666;
          }

          @media (max-width: 1024px) {
            .ep-bg-news-1 {
              width: 100%;
              max-width: 800px;
            }
            
            .epbn1-img {
              width: 100%;
              height: auto;
              aspect-ratio: 16/10;
            }
            
            .epbn1-hdln {
              font-size: 22px;
            }
          }

          @media (max-width: 768px) {
            .ep-bg-news-1 {
              width: 100%;
            }
            
            .epbn1-img {
              aspect-ratio: 16/10;
            }
            
            .epbn1-hdln {
              font-size: 20px;
            }
            
            .epbn1-onln {
              font-size: 13px;
            }
          }

          @media (max-width: 480px) {
            .epbn1-hdln {
              font-size: 18px;
            }
            
            .epbn1-onln {
              font-size: 12px;
            }
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
          <button
            onClick={handleChange}
            style={{
              background: "transparent",
              color: "lightblue",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            <TbArrowsExchange />
          </button>

          <button
            onDoubleClick={handleDelete}
            title="Double click to delete"
            style={{
              fontWeight: "bold",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
              color: "red",
            }}
          >
            <IoIosClose />
          </button>
        </div>
      )}

      {border && (
        <button
          onClick={toggleSeparator}
          className={`separator-btn ${showSeparator ? 'active' : ''}`}
          title="Toggle separator line"
        >
          <HiOutlineMinus />
        </button>
      )}

      {version === 1 && (
        <>
          <div className="epbn1-img">
            <img src={renderData.image} alt="" />
          </div>
          <div className="epbn1-hdln">{renderData.headline}</div>
          <div className="epbn1-onln">{renderData.content}</div>
          <div className="epn-tm">{renderData.time}</div>
        </>
      )}

      {version === 2 && (
        <>
          <div className="epbn1-hdln">{renderData.headline}</div>
          <div className="epbn1-img">
            <img src={renderData.image} alt="" />
          </div>
          <div className="epbn1-onln">{renderData.content}</div>
          <div className="epn-tm">{renderData.time}</div>
        </>
      )}

      {version === 3 && (
        <>
          <div className="epbn1-hdln">{renderData.headline}</div>
          <div className="epbn1-onln">{renderData.content}</div>
          <div className="epbn1-img">
            <img src={renderData.image} alt="" />
          </div>
          <div className="epn-tm">{renderData.time}</div>
        </>
      )}

      {showSeparator && <div className="separator-line"></div>}
    </div>
  );
};

export default BigNewsContainer1;