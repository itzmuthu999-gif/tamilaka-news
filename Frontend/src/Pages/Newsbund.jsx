import React from 'react'
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'
import luffy from '../assets/luffy.webp'
import dmk from '../assets/download.jpeg'

export default function Newsbund() {
  return (

<div>
     <nav className='navbar'>
          <div  className='logo'><img src={logo} alt="alt"/></div>     
          <Link className='link' to="/Newsupload"> upload News</Link>    
       </nav>
    

       <div className="news-grid-container">
      <div className="news-grid">
        <div className="news-card">
          <div className="news-image"></div>
          <div className="news-content">
            <h3>Lorem ipsum dolor sit amet</h3>
            <p>consectetur adipisicing elit. Eveniet, voluptates</p>
          </div>
        </div>

        <div className="news-card">
          <div className="news-image"></div>
          <div className="news-content">
            <h3>Lorem ipsum dolor sit amet</h3>
            <p>consectetur adipisicing elit. Eveniet, voluptates</p>
          </div>
        </div>

        <div className="news-card">
          <div className="news-image"></div>
          <div className="news-content">
            <h3>Lorem ipsum dolor sit amet</h3>
            <p>consectetur adipisicing elit. Eveniet, voluptates</p>
          </div>
        </div>

        <div className="news-card">
          <div className="news-image"></div>
          <div className="news-content">
            <h3>Lorem ipsum dolor sit amet</h3>
            <p>consectetur adipisicing elit. Eveniet, voluptates</p>
          </div>
        </div>

        <div className="news-card">
          <div className="news-image"></div>
          <div className="news-content">
            <h3>Lorem ipsum dolor sit amet</h3>
            <p>consectetur adipisicing elit. Eveniet, voluptates</p>
          </div>
        </div>

        <div className="news-card">
          <div className="news-image"></div>
          <div className="news-content">
            <h3>Lorem ipsum dolor sit amet</h3>
            <p>consectetur adipisicing elit. Eveniet, voluptates</p>
          </div>
        </div>

        <div className="news-card">
          <div className="news-image"></div>
          <div className="news-content">
            <h3>Lorem ipsum dolor sit amet</h3>
            <p>consectetur adipisicing elit. Eveniet, voluptates</p>
          </div>
        </div>

        <div className="news-card">
          <div className="news-image"></div>
          <div className="news-content">
            <h3>Lorem ipsum dolor sit amet</h3>
            <p>consectetur adipisicing elit. Eveniet, voluptates</p>
          </div>
        </div>

        <div className="news-card">
          <div className="news-image"></div>
          <div className="news-content">
            <h3>Lorem ipsum dolor sit amet</h3>
            <p>consectetur adipisicing elit. Eveniet, voluptates</p>
          </div>
        </div>

        <div className="news-card">
          <div className="news-image"></div>
          <div className="news-content">
            <h3>Lorem ipsum dolor sit amet</h3>
            <p>consectetur adipisicing elit. Eveniet, voluptates</p>
          </div>
        </div>

        <div className="news-card">
          <div className="news-image"></div>
          <div className="news-content">
            <h3>Lorem ipsum dolor sit amet</h3>
            <p>consectetur adipisicing elit. Eveniet, voluptates</p>
          </div>
        </div>

        <div className="news-card">
          <div className="news-image"></div>
          <div className="news-content">
            <h3>Lorem ipsum dolor sit amet</h3>
            <p>consectetur adipisicing elit. Eveniet, voluptates</p>
          </div>
        </div>
      </div>
  
    </div>
    
    
    
    </div>
  )
}

