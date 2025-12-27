import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { TbArrowsExchange } from "react-icons/tb";
import { IoIosClose } from "react-icons/io";
import {
  dropNewsIntoSlot,
  removeNewsFromSlot,
  dropNewsIntoSliderSlot,
  removeNewsFromSliderSlot,
} from "../../Slice/editpaperslice";


const NorContainer4A = ({
  border = false,
  onDelete,
  slotId,
  catName,
  containerId,
    isSlider = false,
  isSlider2 = false,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { allNews, translatedNews, language } = useSelector(
    (state) => state.newsform
  );

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

  const newsId = slot?.newsId;
  const newsSource = language === "en" ? translatedNews : allNews;
  const news = newsSource.find((n) => n.id === newsId);

  const DEFAULT_DATA = {
    content: "Drop a news card to replace this headline.",
    time: "Just now",
  };

  const renderData = news
    ? {
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

  const handleNavigate = () => {
    if (!newsId) return;
    navigate(`/preview/${newsId}`);
  };

  return (
    <div
      className="ep-nm-news"
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
          .ep-nm-news {
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
          }

          .ep-nm-news:hover {
            color: rgb(237, 1, 141);
          }

          .ep-nm-headline {
            font-size: 15px;
            font-weight: bold;
            line-height: 1.2;
            max-height: 48px;
            overflow: hidden;
          }

          .ep-nm-time {
            font-size: 10px;
            color: gray;
          }
        `}
      </style>

      {border && (
        <div
          style={{
            position: "absolute",
            top: "6px",
            right: "6px",
            display: "flex",
            gap: "6px",
            zIndex: 10,
          }}
        >
          <button
            onDoubleClick={handleDelete}
            style={iconBtnStyle}
            title="Double click to delete"
          >
            <IoIosClose />
          </button>
        </div>
      )}

      <div className="ep-nm-headline">{renderData.content}</div>
      <div className="ep-nm-time">{renderData.time}</div>
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

export default NorContainer4A;
