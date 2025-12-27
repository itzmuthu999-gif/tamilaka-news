import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbArrowsExchange } from "react-icons/tb";
import { IoIosClose } from "react-icons/io";
import {
  dropNewsIntoSlot,
  removeNewsFromSlot,
  dropNewsIntoSliderSlot,
  removeNewsFromSliderSlot,
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
  const dispatch = useDispatch(); // Add this

  // Read newsId from Redux instead of local state
  const allNews = useSelector((state) => state.newsform.allNews);
  const slot = useSelector((state) => {
    const page = state.editpaper.pages.find((p) => p.catName === catName);
    
    // ✅ Both slider types now use the same sliders array
    if (isSlider || isSlider2) {
      const slider = page?.sliders.find((s) => s.id === containerId);
      return slider?.items.find((i) => i.slotId === slotId);
    } else {
      const container = page?.containers.find((c) => c.id === containerId);
      return container?.items.find((i) => i.slotId === slotId);
    }
  });
  const newsId = slot?.newsId; // Get newsId from Redux
  const news = allNews.find((n) => n.id === newsId);

  console.log("BigContainer1 Props:", { slotId, catName, containerId });

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
      // ✅ Use unified slider action for both slider types
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
    
    // ✅ Use unified slider action for both slider types
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
    if (!newsId) return; // don't navigate for default template
    navigate(`/preview/${newsId}`);
  };

  return (
    <div

      className={version === 1 ? "ep-nm-news-7" : "ep-nm-news-8"}
  onDrop={handleDrop}
  onDragOver={handleDragOver}
  onClick={handleNavigate}
  style={{
    border: border ? "2px dotted #999" : "none",
    position: "relative"
  }}
    >
        <style>
    {
        `
        .ep-nm-news-7 {
  width: 300px;
  height: 100px;
  max-width: 300px;
  max-height: 100px;
  // border: solid;
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
  max-width: 200px;
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
  object-fit: cover; /* This will make the image fill the box nicely */
}

.epnn7-hdln {
  font-size: 15px;
  font-weight: bold;
  height: 84px;
  overflow: hidden;
}

/// normal news container 8
.ep-nm-news-8 {
  width: 300px;
  height: 100px;
  max-width: 300px;
  max-height: 100px;
  // border: solid;
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
  max-width: 200px;
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
  object-fit: cover; /* This will make the image fill the box nicely */
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
  // background-color: blue;
}


        
        `
    }
</style>
      {/* Action buttons */}
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

      {/* VERSION 1 – Image left */}
      {version === 1 && (
        <>
          <div className="epnn7-img">
            <img src={renderData.image} alt="" />
          </div>
          <div className="ep-nm7-sbc">
            <div className="epnn7-hdln">{renderData.headline }</div>
            <div className="epn-tm">{renderData.time}</div>
          </div>
        </>
      )}

      {/* VERSION 2 – Image right */}
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
