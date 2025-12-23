import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbArrowsExchange } from "react-icons/tb";
import { IoIosClose } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import jwt from "../../../assets/jwt.jpg";
import {dropNewsIntoSlot, removeNewsFromSlot,} from "../../Slice/editpaperslice";

const BigNewsContainer1 = ({
  border = false,
  onDelete,
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
  // border: solid;
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
  object-fit: cover; /* This will make the image fill the box nicely */
}
.epbn1-hdln {
  font-size: 25px;
  font-weight: bold;
}

.epbn1-onln {
  font-size: 14px;
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
          }}
        >
          {/* Change Button */}
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

          {/* Close Button (DOUBLE CLICK) */}
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

      {/* VERSION 1 */}
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

      {/* VERSION 2 */}
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

      {/* VERSION 3 */}
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
    </div>
  );
};

export default BigNewsContainer1;
