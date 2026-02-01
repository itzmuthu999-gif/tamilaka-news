import React from 'react'
import logo from '../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import luffy from '../assets/luffy.webp'
import { deleteNews, setCurrentNews } from "./Slice/newsformslice.js";
import './Newsbund.scss';

export default function Newsbund() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allNews = useSelector(state => state.newsform.allNews || []);

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

  return (
    <div className="newsbund-container">
      <nav className='navbar'>
        <div className='logo'><img src={logo} alt="Tamilaka News" /></div>
        <Link 
          className='upload-news-btn' 
          to="/Newsupload"
          onClick={() => dispatch(setCurrentNews(null))}
        >
          Upload News
        </Link>
      </nav>

      <div className="news-grid-container">
        <div className="news-grid">
          {allNews.length === 0 ? (
            <div className="no-news-message">
              <h3>No News Yet</h3>
              <p>Start creating amazing news content by clicking the "Upload News" button above!</p>
            </div>
          ) : (
            allNews.map((news) => {
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
                      Edit
                    </button>
                    <button
                      className="news-card-btn preview-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/preview/${news.id}`);
                      }}
                    >
                      Preview
                    </button>
                    <button
                      className="news-card-btn delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Are you sure you want to delete this news?')) {
                          dispatch(deleteNews(news.id));
                        }
                      }}
                    >
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
