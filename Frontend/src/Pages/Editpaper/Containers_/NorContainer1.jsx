import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbArrowsExchange } from "react-icons/tb";
import { IoIosClose } from "react-icons/io";
import {dropNewsIntoSlot, removeNewsFromSlot,} from "../../Slice/editpaperslice";
import { useSelector, useDispatch } from "react-redux";
import jwt from "../../../assets/jwt.jpg";

const NorContainer1 = ({ border = false, onDelete, 
  slotId,
  catName,
  containerId,
}) => {
  const [version, setVersion] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Add this

  // Read newsId from Redux instead of local state
  const allNews = useSelector((state) => state.newsform.allNews);
  const slot = useSelector((state) => {
    const page = state.editpaper.pages.find((p) => p.catName === catName);
    const container = page?.containers.find((c) => c.id === containerId);
    return container?.items.find((i) => i.slotId === slotId);
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
      // ✅ Dispatch to Redux instead of local state
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
    // ✅ Remove from Redux
    dispatch(
      removeNewsFromSlot({
        catName,
        containerId,
        slotId,
      })
    );
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
  gap: $gap2;
  transition: 0.5s ease-in-out;
  cursor: pointer;
}
.ep-nm-news-1:hover {
  color: rgb(237, 1, 141);
}
.epnn1-img {
  width: 390px;height: 200px;
  max-width: 700px;
  max-height: 200px;
  border-radius: 5px;
  overflow: hidden;
}
.epnn1-img img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* This will make the image fill the box nicely */
}
.epnn1-hdln {
  font-size: 20px;
  font-weight: bold;
}

.epnn1-onln {
  font-size: 13px;
}

/// normal news container 2
.ep-nm-news-2 {
  width: 800px;
  height: fit-content;
  // border: solid;
  margin: 5px;
  display: flex;
  gap: $gap2;
  transition: 0.5s ease-in-out;
  cursor: pointer;
}
.ep-nm-news-2:hover {
  color: rgb(237, 1, 141);
}

.epnn2-img {
  width: 1000px;

  height: 200px;
  border-radius: 5px;
  overflow: hidden;
}
.epnn2-img img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* This will make the image fill the box nicely */
}
.epnn2-hdln {
  font-size: 20px;
  font-weight: bold;
}

.epnn2-onln {
  font-size: 13px;
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
