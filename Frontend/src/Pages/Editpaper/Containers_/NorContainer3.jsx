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
  dropNewsIntoNestedSlot,
  removeNewsFromNestedSlot,
  toggleContainerSeparator,
  toggleSliderSeparator,
  toggleNestedSeparator,
} from "../../Slice/editpaperslice";

import { useSelector, useDispatch } from "react-redux";
import jwt from "../../../assets/jwt.jpg";

const NorContainer3 = ({
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
    
    if (isSlider || isSlider2) {
      dispatch(
        removeNewsFromSliderSlot({
          catName,
          sliderId: containerId,
          slotId,
        })
      );
    } else if (isNested && parentContainerId) {
      dispatch(
        removeNewsFromNestedSlot({
          catName,
          parentContainerId,
          nestedContainerId: containerId,
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

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div
        className={version === 1 ? "ep-nm-news-5" : "ep-nm-news-6"}
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
            .ep-nm-news-5 {
              width: 395px;
              height: 100px;
              overflow: hidden;
              display: flex;
              transition: 0.5s ease-in-out;
              cursor: pointer;
            }
            
            .ep-nm-news-5:hover {
              color: rgb(237, 1, 141);
            }

            .ep-nm5-sbc {
              flex: 1;
              min-width: 0;
            }
            
            .epnn5-img {
              width: 200px;
              height: 100px;
              border-radius: 5px;
              overflow: hidden;
              flex-shrink: 0;
            }
            
            .epnn5-img img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            
            .epbn5-hdln {
              font-size: 15px;
              font-weight: bold;
              height: 84px;
              overflow: hidden;
            }

            .epnn5-onln {
              font-size: 13px;
            }

            .ep-nm-news-6 {
              width: 395px;
              height: 100px;
              overflow: hidden;
              display: flex;
              transition: 0.5s ease-in-out;
              cursor: pointer;
            }
            
            .ep-nm-news-6:hover {
              color: rgb(237, 1, 141);
            }

            .ep-nm6-sbc {
              flex: 1;
              min-width: 0;
            }
            
            .epnn6-img {
              width: 200px;
              height: 100px;
              border-radius: 5px;
              overflow: hidden;
              flex-shrink: 0;
            }
            
            .epnn6-img img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .epbn6-hdln {
              font-size: 15px;
              font-weight: bold;
              height: 84px;
              overflow: hidden;
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
              .ep-nm-news-5,
              .ep-nm-news-6 {
                width: 100%;
                max-width: 395px;
                height: auto;
                min-height: 100px;
              }
              
              .epnn5-img,
              .epnn6-img {
                width: 150px;
                height: 90px;
              }
              
              .epbn5-hdln,
              .epbn6-hdln {
                font-size: 14px;
                height: auto;
              }
            }

            @media (max-width: 480px) {
              .ep-nm-news-5,
              .ep-nm-news-6 {
                flex-direction: column;
                height: auto;
              }
              
              .epnn5-img,
              .epnn6-img {
                width: 100%;
                height: 120px;
              }
              
              .ep-nm5-sbc,
              .ep-nm6-sbc {
                width: 100%;
              }
              
              .epbn5-hdln,
              .epbn6-hdln {
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

        {/* VERSION 1 */}
        {version === 1 && (
          <>
            <div className="epnn5-img">
              <img src={renderData.image} alt="" />
            </div>
            <div className="ep-nm5-sbc">
              <div className="epbn5-hdln">{renderData.headline}</div>
              <div className="epn-tm">{renderData.time}</div>
            </div>
          </>
        )}

        {/* VERSION 2 */}
        {version === 2 && (
          <>
            <div className="ep-nm6-sbc">
              <div className="epbn6-hdln">{renderData.headline}</div>
              <div className="epn-tm">{renderData.time}</div>
            </div>
            <div className="epnn6-img">
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

export default NorContainer3;