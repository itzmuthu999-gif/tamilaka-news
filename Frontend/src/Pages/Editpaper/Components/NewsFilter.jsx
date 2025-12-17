import { useState } from "react";
import { useSelector } from "react-redux";
import { Rnd } from "react-rnd";
import "./newsfilter.scss";
import { IoClose } from "react-icons/io5";

export default function NewsFilter({ open, onClose }) {
  // Retrieve real news from Redux store
  const allNews = useSelector((state) => state.newsform.allNews || []);
  
  // Fixed list of categories
  const categories = ["politics", "cinema", "sports", "weather", "astrology"];

  const [activeCategory, setActiveCategory] = useState(categories[0]);

  // Filter news based on active category (case-insensitive)
  // Note: zonal is inside news.data.zonal (matching Newsbund structure)
  const filteredNews = allNews.filter(
    (news) => news.data?.zonal?.trim().toLowerCase() === activeCategory.toLowerCase()
  );


  const getThumbnail = (thumbnail) => {
    if (!thumbnail) return null;

    if (typeof thumbnail === "string") {
      return thumbnail;
    }

    if (thumbnail instanceof File) {
      return URL.createObjectURL(thumbnail);
    }


    return null;
  };

  console.log("All News:", allNews); // Debug
  console.log("Active Category:", activeCategory); // Debug
  console.log("Filtered News:", filteredNews); // Debug

  // Don't render if not open
  if (!open) return null;

  return (
    <Rnd
      default={{ x: 100, y: 100, width: 400, height: 600 }}
      bounds="window"
      dragHandleClassName="drag-handle-filter"
      style={{
        zIndex: 9998,position: "fixed"
      }}
    >
      <div className="ep-floater1">
        <div className="ep-close-btn-sec drag-handle-filter" style={{ cursor: "move" }}>
          <div className="epcbs-nm">News Container</div>
          <div className="epcbs-btn" onClick={onClose}><IoClose /></div>
        </div>
        <div className="ep-fl1-btns">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className={`epf1b-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </div>
          ))}
        </div>

        <div className="ep-fl1-news-cont">
          {filteredNews.length === 0 && (
            <div className="no-news">No news available for {activeCategory}.</div>
          )}

          {filteredNews.map((news, index) => {
            const thumb = getThumbnail(news.data?.thumbnail);

            return (
              <div key={news.id || index} className="ep-f1nc-n">
                <div className="epf1ncn-img">
                  {thumb && (
                    <img src={thumb} alt="news" />
                  )}
                </div>

                <div className="epf1ncn-subc">
                  <div className="epf1ncn-header">{news.data?.headline || 'Untitled'}</div>
                  <div className="epf1ncn-time">{news.time}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Rnd>
  );
}