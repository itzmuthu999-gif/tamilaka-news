import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbArrowsExchange } from "react-icons/tb";
import { IoIosClose } from "react-icons/io";
import { HiOutlineMinus } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import timeFun from "../../Newspaper/Containers_/timeFun";
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
} from "../../Slice/editpaperSlice/editpaperslice";

const NorContainer4B = ({
  newsId = null,
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

  const { allNews = [], translatedNews = [], language } = useSelector(
    (state) => state.newsform || {}
  );

  const newsToShow = (language === "en" ? translatedNews : allNews) || [];

  // ---------------------------------------------------------------------------
  // FIX: unified helper that resolves the correct slider object no matter
  // whether we are in a regular container or a nested container.
  // ---------------------------------------------------------------------------
  const findSlider = (page) => {
    if (!page || !sliderId) return null;

    if (isNested && parentContainerId) {
      // Slider lives inside a nested container
      return page.containers
        ?.find((c) => c.id === parentContainerId)
        ?.nestedContainers?.find((nc) => nc.id === containerId)
        ?.sliders?.find((s) => s.id === sliderId);
    } else {
      // Slider lives inside a regular top-level container
      return page.containers
        ?.find((c) => c.id === containerId)
        ?.sliders?.find((s) => s.id === sliderId);
    }
  };

  // Get separator state from Redux
  const showSeparator = useSelector((state) => {
    const page = state.editpaper?.pages?.find((p) => p.catName === catName);
    if (!page) return false;

    if (isSlider || isSlider2) {
      // FIX: use the unified helper so nested-slider path is also correct
      const slider = findSlider(page);
      const item = slider?.items?.find((i) => i.slotId === slotId);
      return item?.showSeparator || false;
    } else if (isNested && parentContainerId) {
      const nestedCont = page.containers
        ?.find((c) => c.id === parentContainerId)
        ?.nestedContainers?.find((nc) => nc.id === containerId);
      const item = nestedCont?.items?.find((i) => i.slotId === slotId);
      return item?.showSeparator || false;
    } else {
      const container = page.containers?.find((c) => c.id === containerId);
      const item = container?.items?.find((i) => i.slotId === slotId);
      return item?.showSeparator || false;
    }
  });

  // Get slot data from Redux
  const slot = useSelector((state) => {
    const page = state.editpaper?.pages?.find((p) => p.catName === catName);
    if (!page) return null;

    if (isSlider || isSlider2) {
      // FIX: use the unified helper so nested-slider path is also correct
      const slider = findSlider(page);
      return slider?.items?.find((i) => i.slotId === slotId);
    } else if (isNested && parentContainerId) {
      const nestedCont = page.containers
        ?.find((c) => c.id === parentContainerId)
        ?.nestedContainers?.find((nc) => nc.id === containerId);
      return nestedCont?.items?.find((i) => i.slotId === slotId);
    } else {
      const container = page.containers?.find((c) => c.id === containerId);
      return container?.items?.find((i) => i.slotId === slotId);
    }
  });

  const slotNewsId = slot?.newsId;
  const news = newsToShow.find((n) => n.id === slotNewsId);

  const DEFAULT_DATA = {
    content: "Drop a news card to replace this headline.",
    time: "Just now",
  };

  const renderData = news
    ? {
        content: news.data?.oneLiner || DEFAULT_DATA.content,
        time: timeFun(news.time || news.createdAt || news.updatedAt) || DEFAULT_DATA.time,
      }
    : DEFAULT_DATA;

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedId = e.dataTransfer.getData("newsId");
    if (droppedId) {
      if (isSlider || isSlider2) {
        // FIX: always pass isNested + parentContainerId so the reducer
        // can locate the slider whether it's inside a nested container or not
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
    onDelete?.();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleNavigate = () => {
    if (!slotNewsId) return;
    navigate(`/preview/${slotNewsId}`);
  };

  const toggleSeparator = (e) => {
    e.stopPropagation();

    if (isSlider || isSlider2) {
      // FIX: pass isNested + parentContainerId so the reducer finds the right
      // slider even when it's nested inside a nested container
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
      className="ep-nm-news-4b"
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
          .ep-nm-news-4b {
            width: 300px;
            height: 80px;
            margin: 4px;
            padding: 6px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            cursor: pointer;
            transition: 0.3s ease-in-out;
            background: transparent;
          }

          .ep-nm-news-4b:hover {
            color: rgb(237, 1, 141);
          }

          .ep-nm-headline-4b {
            font-size: 15px;
            font-weight: bold;
            line-height: 1.2;
            max-height: 48px;
            overflow: hidden;
          }

          .ep-nm-time-4b {
            font-size: 10px;
            color: gray;
          }

          .separator-line-4b {
            width: 100%;
            height: 1px;
            background-color: #999;
            margin-top: 4px;
            position: absolute;
            bottom: 0;
            left: 0;
          }

          .separator-btn-4b {
            position: absolute;
            bottom: -14px;
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

          .separator-btn-4b:hover {
            background: rgba(255, 255, 255, 1);
            color: #333;
            border-color: #999;
          }

          .separator-btn-4b.active {
            background: rgba(153, 153, 153, 0.9);
            color: white;
            border-color: #666;
          }

          .ep-nm-controls-4b {
            position: absolute;
            top: 4px;
            right: 4px;
            display: flex;
            gap: 4px;
            z-index: 10;
          }

          .ep-nm-controls-4b button {
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid #ccc;
            border-radius: 3px;
            cursor: pointer;
            font-size: 16px;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
          }

          .ep-nm-controls-4b button:hover {
            background: rgba(255, 255, 255, 1);
            border-color: #999;
          }

          .ep-nm-controls-4b .delete-btn {
            color: red;
          }
        `}
      </style>

      {border && (
        <div className="ep-nm-controls-4b">
          <button
            onDoubleClick={handleDelete}
            title="Double click to delete"
            className="delete-btn"
          >
            <IoIosClose />
          </button>
        </div>
      )}

      {border && (
        <button
          onClick={toggleSeparator}
          className={`separator-btn-4b ${showSeparator ? "active" : ""}`}
          title="Toggle separator line"
        >
          <HiOutlineMinus />
        </button>
      )}

      <div className="ep-nm-headline-4b">{renderData.content}</div>
      <div className="ep-nm-time-4b">{renderData.time}</div>

      {showSeparator && <div className="separator-line-4b"></div>}
    </div>
  );
};

export default NorContainer4B;

