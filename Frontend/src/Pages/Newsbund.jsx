import React, { useMemo, useState } from 'react'
import logo from '../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import luffy from '../assets/luffy.webp'
import { FaRegClock, FaPen, FaEye, FaTrash } from "react-icons/fa";
import { deleteNews, setCurrentNews } from "./Slice/newsformSlice.js";
import { deleteNews as deleteNewsApi } from "../Api/newsApi.js";
import './Newsbund.scss';

export default function Newsbund() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allNews = useSelector(state => state.newsform.allNews || []);
  const [activeCategory, setActiveCategory] = useState("all");

  // Helper function to safely get thumbnail
  const getThumbnail = (thumbnail) => {
    if (!thumbnail) return null;

    // If already a URL string → just use it
    if (typeof thumbnail === "string") {
      return thumbnail;
    }

    // If it's a File → convert to object URL
    if (thumbnail instanceof File) {
      return URL.createObjectURL(thumbnail);
    }

    // If unexpected type (object from JSON) → cannot use
    return null;
  };

  const categoryOptions = useMemo(() => {
    const map = new Map();

    const addCategory = (cat) => {
      if (!cat) return;
      const label = String(cat).trim();
      if (!label) return;
      const key = label.toLowerCase();
      if (!map.has(key)) map.set(key, label);
    };

    allNews.forEach((news) => {
      const zonal = news.data?.zonal;
      if (Array.isArray(zonal)) {
        zonal.forEach(addCategory);
      } else if (typeof zonal === "string") {
        addCategory(zonal);
      }
    });

    return Array.from(map.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [allNews]);

  const filteredNews = useMemo(() => {
    if (activeCategory === "all") return allNews;
    return allNews.filter((news) => {
      const zonal = news.data?.zonal;
      if (Array.isArray(zonal)) {
        return zonal.some(
          (cat) => String(cat).trim().toLowerCase() === activeCategory
        );
      }
      if (typeof zonal === "string") {
        return zonal.trim().toLowerCase() === activeCategory;
      }
      return false;
    });
  }, [allNews, activeCategory]);

  const activeCategoryLabel =
    activeCategory === "all"
      ? "All categories"
      : categoryOptions.find((opt) => opt.value === activeCategory)?.label ||
        activeCategory;

  return (
    <div className="newsbund-container">
      <nav className='navbar'>
        <div className='logo'><img src={logo} alt="Tamilaka News" /></div>
        <div className="nav-right">
          <div className="nav-filter">
            <span className="nav-filter-label">Category</span>
            <select
              className="nav-filter-select"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              <option value="all">All</option>
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="nav-actions">
            <Link 
              className='upload-news-btn' 
              to="/Newsupload"
              onClick={() => dispatch(setCurrentNews(null))}
            >
              Upload News
            </Link>
            <Link 
              className='edit-newspage-btn' 
              to="/newspage-edit"
            >
              Newspage Edit
            </Link>
          </div>
        </div>
      </nav>

      <div className="news-grid-container">
        <div className="news-grid">
          {filteredNews.length === 0 ? (
            <div className="no-news-message">
              <h3>{allNews.length === 0 ? "No News Yet" : "No News Found"}</h3>
              <p>
                {allNews.length === 0
                  ? 'Start creating amazing news content by clicking the "Upload News" button above!'
                  : `There are no news items in "${activeCategoryLabel}".`}
              </p>
            </div>
          ) : (
            filteredNews.map((news) => {
              const thumb = getThumbnail(news.data?.thumbnail);

              return (
                <div
                  key={news.id}
                  className="news-card-container"
                  onClick={() => {
                    dispatch(setCurrentNews(news));
                    navigate('/Newsupload');
                  }}
                >
                  {/* NEWS CARD HEADER */}
                  <div className="news-card-header">
                  <div className="news-card-content">
                    <h3 className="news-card-title">
                      {news.data?.headline || 'Untitled News'}
                    </h3>
                    <div className="news-card-time">
                      <FaRegClock />
                      {news.time || 'No time available'}
                    </div>
                  </div>
                    <div className="news-card-thumbnail">
                      <img
                        src={thumb || luffy}
                        alt="News thumbnail"
                      />
                    </div>
                  </div>

                  {/* NEWS CARD BODY */}
                  <div className="news-card-body">
                    <div className="news-card-description">
                      {news.data?.oneLiner || 'No description available for this news article.'}
                    </div>
                  </div>

                  {/* NEWS CARD ACTIONS */}
                <div className="news-card-actions">
                  <button
                    className="news-card-btn edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(setCurrentNews(news));
                      navigate('/Newsupload');
                    }}
                  >
                    <FaPen />
                    Edit
                  </button>
                  <button
                    className="news-card-btn preview-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/preview/${news.id}`);
                    }}
                  >
                    <FaEye />
                    Preview
                  </button>
                  <button
                    className="news-card-btn delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Are you sure you want to delete this news?')) {
                          const apiId = news._id || news.id;
                          deleteNewsApi(apiId)
                            .then(() => {
                              dispatch(deleteNews(news.id));
                            })
                            .catch((error) => {
                              console.error("Failed to delete news:", error);
                              alert("Failed to delete news. Check the server and try again.");
                            });
                        }
                      }}
                    >
                    <FaTrash />
                    Delete
                  </button>
                </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  )
}
