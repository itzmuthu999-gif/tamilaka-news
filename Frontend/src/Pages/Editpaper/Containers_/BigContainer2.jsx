import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbArrowsExchange } from "react-icons/tb";
import { IoIosClose } from "react-icons/io";
import { HiOutlineMinus } from "react-icons/hi";

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
  removeSlotFromContainer,
  removeSlotFromNestedContainer,
  updateSlotShfval,
  updateNestedSlotShfval,
  updateSliderSlotShfval,
} from "../../Slice/editpaperSlice/editpaperslice";

import { useSelector, useDispatch } from "react-redux";
import jwt from "../../../assets/jwt.jpg";

const BigNewsContainer2 = ({
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
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const allNews = useSelector((state) => state.newsform?.allNews || []);

  const showSeparator = useSelector((state) => {
    const page = state.editpaper.pages.find((p) => p.catName === catName);
    if (isSlider || isSlider2) {
      const slider = page?.containers.find((c) => c.id === containerId)
        ?.sliders?.find((s) => s.id === sliderId);
      const item = slider?.items.find((i) => i.slotId === slotId);
      return item?.showSeparator || false;
    } else if (isNested && parentContainerId) {
      const nestedCont = page?.containers.find((c) => c.id === parentContainerId)
        ?.nestedContainers?.find((nc) => nc.id === containerId);
      const item = nestedCont?.items?.find((i) => i.slotId === slotId);
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
    if (!droppedId) return;

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
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.();
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleChange = (e) => {
    e.stopPropagation();
    const nextVal = version === 1 ? 2 : 1;
    if (isSlider || isSlider2) {
      dispatch(updateSliderSlotShfval({ catName, sliderId, slotId, containerId, isNested, parentContainerId, shfval: nextVal }));
    } else if (isNested && parentContainerId) {
      dispatch(updateNestedSlotShfval({ catName, parentContainerId, nestedContainerId: containerId, slotId, shfval: nextVal }));
    } else {
      dispatch(updateSlotShfval({ catName, containerId, slotId, shfval: nextVal }));
    }
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

  return (
    <div
      className="ep-bg-news-2-wrapper"
      style={{
        position: "relative",
        width: "fit-content",
      }}
    >
      <style>{`
        .ep-bg-news-2-wrapper {
          display: inline-block;
        }

        .ep-bg-news-2 {
          width: 800px;
          display: flex;
          transition: 0.5s ease-in-out;
          cursor: pointer;
          height: fit-content;
        }

        .ep-bg-news-2:hover {
          color: rgb(237, 1, 141);
        }

        .epbn2-img {
          width: 500px;
          height: 350px;
          border-radius: 5px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .epbn2-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .epbn2-content {
          max-width: 400px;
          flex: 1;
          min-width: 0;
        }

        .epbn2-hdln {
          font-size: 20px;
          font-weight: bold;
          word-wrap: break-word;
        }

        .epbn2-onln {
          font-size: 13px;
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

        @media (max-width: 1024px) {
          .ep-bg-news-2 {
            width: 100%;
            max-width: 800px;
            flex-direction: column;
          }

          .epbn2-img {
            width: 100%;
            height: auto;
            aspect-ratio: 16 / 10;
          }

          .epbn2-content {
            max-width: 100%;
          }
        }

        @media (max-width: 640px) {
          .epbn2-img {
            aspect-ratio: 16 / 9;
            border-radius: 3px;
          }

          .epbn2-hdln {
            font-size: 18px;
          }

          .epbn2-onln {
            font-size: 12px;
          }

          .separator-btn {
            width: 24px;
            height: 24px;
            font-size: 14px;
            bottom: -12px;
          }
        }

        @media (max-width: 480px) {
          .epbn2-hdln {
            font-size: 16px;
          }

          .epbn2-onln {
            font-size: 11px;
          }
        }
      `}</style>

      <div
        className="ep-bg-news-2"
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
            <button onClick={handleChange} style={iconBtnStyle}>
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
            <div className="epbn2-img">
              <img src={renderData.image} alt="" />
            </div>
            <div className="epbn2-content">
              <div className="epbn2-hdln">{renderData.headline}</div>
              <div className="epbn2-onln">{renderData.content}</div>
              <div className="epn-tm">{renderData.time}</div>
            </div>
          </>
        )}

        {version === 2 && (
          <>
            <div className="epbn2-content">
              <div className="epbn2-hdln">{renderData.headline}</div>
              <div className="epbn2-onln">{renderData.content}</div>
              <div className="epn-tm">{renderData.time}</div>
            </div>
            <div className="epbn2-img">
              <img src={renderData.image} alt="" />
            </div>
          </>
        )}
      </div>

      {showSeparator && <div className="separator-line"></div>}

      {border && (
        <button
          onClick={toggleSeparator}
          className={`separator-btn ${showSeparator ? "active" : ""}`}
          title={showSeparator ? "Remove separator" : "Add separator"}
        >
          <HiOutlineMinus />
        </button>
      )}
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

export default BigNewsContainer2;