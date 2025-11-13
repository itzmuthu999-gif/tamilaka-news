import React from 'react'
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'
import luffy from '../assets/luffy.webp'
import dmk from '../assets/download.jpeg'



function NewsHeader({ time, thumbnail, headline }) {
  return (
    <div className="news-header-container">
      <div className="news-header-left">
        {/* Time and Date */}
        <div className="news-header-time">{time || "Nov 13, 2025 - 8:00 PM"}</div>

        {/* Headline */}
        <div className="news-header-title">
          {headline || "Breaking: Example Headline Goes Here"}
        </div>
      </div>

      {/* Thumbnail */}
      <div className="news-header-thumbnail">
        {thumbnail ? (
          <img src={thumbnail} alt="Thumbnail" />
        ) : (
          <div className="news-header-placeholder">No Image</div>
        )}
      </div>
    </div>
  );
}
export default function Newsbund() {
  return (

<div>
     <nav className='navbar'>

          <div  className='logo'><img src={logo} alt="alt"/></div>     
          <Link className='link' to="/Newsupload"> upload News</Link>    
       </nav>
    

    <div className="news-grid-container">
      <div className="news-grid">
         
      </div>
  
    </div>
    
    
    
    </div>
  )
}

