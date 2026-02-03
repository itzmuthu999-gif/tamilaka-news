import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbArrowsExchange } from "react-icons/tb";
import { IoIosClose } from "react-icons/io";
import { RxDividerHorizontal } from "react-icons/rx";
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

const NorContainer5 = ({
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

  // Read newsId and showSeparator from Redux
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
    setVersion((prev) => (prev === 3 ? 1 : prev + 1));
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
    <div style={{ position: "relative" }}>
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
        {/* Top Action buttons */}
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
              <div className="ep-nm22sbc-c1">
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

              <div className="ep-nm23sbc-c1">
                <div className="epnn23-onln">{renderData.content}</div>
                <div className="epn-tm">{renderData.time}</div>
              </div>
            </div>
          </>
        )}

        {/* Bottom Separator Toggle Button */}
        {border && (
          <button
            onClick={handleToggleSeparator}
            style={{
              ...separatorBtnStyle,
              backgroundColor: showSeparator ? "#666" : "#ddd",
              color: showSeparator ? "#fff" : "#666",
            }}
            title={showSeparator ? "Remove separator" : "Add separator"}
          >
            <RxDividerHorizontal />
          </button>
        )}
      </div>

      {/* Separator Line */}
      {showSeparator && (
        <div
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: "#999",
            marginTop: "8px",
          }}
        />
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

const separatorBtnStyle = {
  position: "absolute",
  bottom: "-12px",
  left: "50%",
  transform: "translateX(-50%)",
  background: "#ddd",
  border: "1px solid #ccc",
  borderRadius: "50%",
  width: "24px",
  height: "24px",
  cursor: "pointer",
  fontSize: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10,
  transition: "all 0.2s ease",
};

export default NorContainer5;