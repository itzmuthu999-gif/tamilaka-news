import { useState } from "react";
import "./newsfilter.scss"
export default function NewsFilter({ categories, newsData }) {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const filteredNews = newsData.filter(
    (n) => n.zonal.toLowerCase() === activeCategory.toLowerCase()
  );

  return (
    <div className="ep-floater1">
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
          <div className="no-news">No news available.</div>
        )}

        {filteredNews.map((n, index) => (
          <div key={index} className="ep-f1nc-n">
            <div className="epf1ncn-img">
              <img src={n.img} alt="news" />
            </div>

            <div className="epf1ncn-subc">
              <div className="epf1ncn-header">{n.title}</div>
              <div className="epf1ncn-time">{n.time}</div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
