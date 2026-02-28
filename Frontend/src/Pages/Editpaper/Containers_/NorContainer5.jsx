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
  updateSlotShfval,
  updateSliderSlotShfval,
  updateNestedSlotShfval,
} from "../../Slice/editpaperSlice/editpaperSlice";

import { useSelector, useDispatch } from "react-redux";
import jwt from "../../../assets/jwt.jpg";

const NorContainer5 = ({
  border = false,
  onDelete,
  slotId,
  catName,
  containerId,
  isSlider = false,
  isSlider2 = false,
  isNested = false,
  parentContainerId = null,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const allNews = useSelector((state) => state.newsform.allNews);
  const slot = useSelector((state) => {
    const page = state.editpaper.pages.find((p) => p.catName === catName);

    if (isSlider || isSlider2) {
      const slider = page?.sliders.find((s) => s.id === containerId);
      return slider?.items.find((i) => i.slotId === slotId);
    } else if (isNested && parentContainerId) {
      const nestedCont = page?.containers
        .find((c) => c.id === parentContainerId)
        ?.nestedContainers?.find((nc) => nc.id === containerId);
      return nestedCont?.items?.find((i) => i.slotId === slotId);
    } else {
      const container = page?.containers.find((c) => c.id === containerId);
      return container?.items.find((i) => i.slotId === slotId);
    }
  });

  const newsId = slot?.newsId;
  const showSeparator = slot?.showSeparator || false;
  const version = slot?.shfval ?? 1;
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

  // Cycle between version 1 and 2, persisted in Redux
  const handleChange = (e) => {
    e.stopPropagation();
    const newVersion = version === 1 ? 2 : 1;

    if (isSlider || isSlider2) {
      dispatch(
        updateSliderSlotShfval({
          catName,
          sliderId: containerId,
          slotId,
          shfval: newVersion,
        })
      );
    } else if (isNested && parentContainerId) {
      dispatch(
        updateNestedSlotShfval({
          catName,
          parentContainerId,
          nestedContainerId: containerId,
          slotId,
          shfval: newVersion,
        })
      );
    } else {
      dispatch(
        updateSlotShfval({
          catName,
          containerId,
          slotId,
          shfval: newVersion,
        })
      );
    }
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
    <div style={{ position: "relative", display: "inline-flex", flexDirection: "column", width: "fit-content" }}>
      <style>
        {`
          .ep-nm2-news-2,
          .ep-nm2-news-3 {
            display: flex;
            flex-direction: column;
            width: 430px;
            height: fit-content;
            min-width: 430px;
            min-height: 100px;
          }

          @media (max-width: 768px) {
            .ep-nm2-news-2,
            .ep-nm2-news-3 {
              width: 100%;
              min-width: unset;
              max-width: 550px;
              height: fit-content;
              min-height: 120px;
            }
          }
        `}
      </style>

      {/* Main content box */}
      <div
        className={version === 1 ? "ep-nm2-news-2" : "ep-nm2-news-3"}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleNavigate}
        style={{
          border: border ? "2px dotted #999" : "none",
          position: "relative",
          // Extra bottom padding to make room for the separator toggle button
          paddingBottom: border ? "5px" : "0",
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
            <div className="epbn22-hdln" style={{ fontWeight: "bold", fontSize: "13px" }}>
              {renderData.headline}
            </div>
            <div className="ep-nm22-sbc" style={maincontstyle}>
              <div className="epnn22-img" style={imgoverly}>
                <img style={imgstyle} src={renderData.image} alt="" />
              </div>
              <div className="ep-nm22sbc-c1">
                <div className="epnn22-onln" style={{ fontSize: "12px" }}>
                  {renderData.content}
                </div>
                <div className="epn-tm">{renderData.time}</div>
              </div>
            </div>
          </>
        )}

        {/* VERSION 2 */}
        {version === 2 && (
          <>
            <div className="epbn22-hdln" style={{ fontWeight: "bold", fontSize: "13px" }}>
              {renderData.headline}
            </div>
            <div className="ep-nm22-sbc" style={maincontstyle}>
              <div className="ep-nm22sbc-c1" style={{ fontSize: "12px" }}>
                <div className="epnn22-onln">{renderData.content}</div>
                <div className="epn-tm">{renderData.time}</div>
              </div>
              <div className="epnn22-img" style={imgoverly}>
                <img style={imgstyle} src={renderData.image} alt="" />
              </div>
            </div>
          </>
        )}

        {/* Separator Toggle Button — sits at bottom center of the content box */}
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

      {/* FIX: Separator line — same width as container, directly below, no extra space */}
      {showSeparator && (
        <div
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: "#999",
            flexShrink: 0,
          }}
        />
      )}
    </div>
  );
};

const maincontstyle = {
  display: "flex",
  gap: "12px",
  alignItems: "flex-start",
};

const imgoverly = {
  width: "150px",
  minWidth: "150px",
  height: "100%",
  display: "flex",
  borderRadius: "5px"
};

const imgstyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
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
  bottom: "-2px",
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