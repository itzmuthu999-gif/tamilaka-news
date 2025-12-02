import React from 'react'
import logo from '../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import luffy from '../assets/luffy.webp'
import { deleteNews, setCurrentNews } from "./Slice/newsformslice.js";

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
    <div>
      <nav className='navbar'>
        <div className='logo'><img src={logo} alt="alt" /></div>
<Link 
  className='link' 
  to="/Newsupload"
  onClick={() => dispatch(setCurrentNews(null))}
>
  Upload News
</Link>

      </nav>

      <div className="news-grid-container">
        <div className="news-grid">

          {allNews.length === 0 && <div>No news yet</div>}

          {allNews.map((news) => {
            const thumb = getThumbnail(news.data?.thumbnail);

            return (
              <div
                key={news.id}
                className="news-card-container"
                style={{
                  border: '1px solid #ddd',
                  padding: 8,
                  margin: 8,
                  width: 300,
                  cursor: 'pointer'
                }}
                onClick={() => {
                  dispatch(setCurrentNews(news));
                  navigate('/Newsupload');
                }}
              >

                {/* NEWS CARD HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  
                  <div>
                    <h4 style={{ margin: 0 }}>{news.data?.headline || 'Untitled'}</h4>
                    <div style={{ fontSize: 12, color: 'gray' }}>{news.time}</div>
                  </div>

                  <div style={{ width: 80, height: 60 }}>
                    <img
                      src={thumb || luffy}
                      alt="thumbnail"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>

                </div>

                {/* DELETE BUTTON */}
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(deleteNews(news.id));
                    }}
                  >
                    Delete
                  </button>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(setCurrentNews(news));
                    navigate("/preview");
                  }}
                >
                  Preview
                </button>



              </div>
            );
          })}

        </div>
      </div>
    </div>
  )
}
