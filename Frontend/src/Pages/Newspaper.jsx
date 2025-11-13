
import React from 'react'
import logo from '../assets/logo.png'
import { IoSearchSharp } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiWorld } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiMiniMoon } from "react-icons/hi2";
import newsimg from "../assets/newsimg.avif";
import Newsform from './newsform';
import luffy from '../assets/luffy.webp';
import './newspaper.css'
export default function Newspaper() {
  return (
    <div> 
      <div>
       <div className='navcon1'>
       <div className='navcon2'>
           <div className="nav-c1">
               <div className="nav-c1-date">வியாக்ழன் அக்டோபர் 30 2025</div>
                <div  className='nav-c1-logo'><img src={logo} alt="alt"/></div>
                <div className="nav-c1-links">
                    <div><IoSearchSharp /></div>
                    <div><IoMdNotificationsOutline /></div>
                    <div><BiWorld /></div>
                </div>
           </div>
           <div className='nav-c2-line'></div>
           <div className="nav-c3">
           <div className="nav-c3-ham"><GiHamburgerMenu /></div>    
                 <div className="nav-c3-sections">
                    <div>அரசியல்</div>
                    <div>உலகம்</div>
                    <div>இந்தியா</div>
                    <div>தமிழக நியூஸ்</div>
                    <div>மாவட்டம்</div>
                    <div>விளையாட்டு</div>
                    <div>ட்ரெண்டிங்</div>
                 </div>
                <div className="nav-c3-dm"><HiMiniMoon /></div>
           </div>
       </div>
       </div>
       </div>
       <div> 
        <div className="breaking-news-bar">
        <marquee behavior="scroll" direction="left" scrollamount="6">
          சென்னை விமான நிலையத்தில் பாதுகாப்பு சோதனை தீவிரம் | டெல்லியில் மழை வெள்ளம் – போக்குவரத்து பாதிப்பு |
          பெங்களூருவில் பெரிய IT நிறுவனத்தில் தீயில் பலர் பாதிப்பு | தமிழகத்தில் வெயில் குறையும் என வானிலை மையம் தெரிவித்துள்ளது
        </marquee>
      </div>
            <div className="news-container">

      <div className="main-content">
        {/* Left main story */}
        <div className="main-article">
          <img
            src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b"
            alt="Main News"
            className="main-image"
          />
          <h2 className="headline">
            டிரம்ப் பாணி அரசியலை மீண்டும் முயலும் குடியரசுக் கட்சி – பலன் இம்முறை குறையுமா?
          </h2>
          <p className="article-summary">
            2024 தேர்தலில் பெரும்பாலான பிராந்திய கட்சிகள் “ராஜ்யசபா” பிரதிநிதித்துவத்தை
            கவனித்து வருகின்றன. அமெரிக்க அரசியல் சூழ்நிலைகள் இம்முறை மாற்றத்தை சந்திக்குமா என
            அரசியல் வட்டாரங்கள் கூறுகின்றன.
          </p>
          <span className="time">5hrs ago</span>
        </div>

        {/* Right sidebar */}
        <div className="side-news">
          {[1, 2, 3, 4,5].map((item) => (
            <div className="side-item" key={item}>
              <img
                src={luffy}
                alt="Side News"
                className="side-thumb"
              />
              <div className="side-text">
                <h4>டைமன் நிறுவனம் புதிய சூழ்நிலையை அறிவிப்பு – அதிருப்தியில் ஊழியர்கள்</h4>
                <span className="time">5hrs ago</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
       </div>
          <div className="ad-wrapper">
      <div className="ad-top-border"></div>
      <div className="ad-box">
        <p>Advertisement here</p>
      </div>
    </div> 
     <div className="news-card">
      <img
        src={luffy}
        alt="news"
        className="news-image"
      />
      <div className="news-content">
        <h3>
          படைன் நிறுவாகம் புதிய குடியேர்ப்பு கொள்கையை அறிவிப்பு - அதிருப்தியில்
          எஸ்லை மாணவர்கள்
        </h3>
        <p>
          புதிய குடியேர்ப்பு கொள்கையின் கீழ் மாணவர்கள் தங்கள் விருப்பத்தேர்வுகளைச்
          சமர்ப்பிக்க வேண்டியுள்ளது. இதனால் அதிருப்தி தெரிவிக்கும் நிகழ்வுகள்
          நடந்துள்ளன.
        </p>
        <span className="news-time">5 hrs ago</span>
      </div>
    </div>
     <div className="news-card">
      <img
        src={luffy}
        alt="news"
        className="news-image"
      />
      <div className="news-content">
        <h3>
          படைன் நிறுவாகம் புதிய குடியேர்ப்பு கொள்கையை அறிவிப்பு - அதிருப்தியில்
          எஸ்லை மாணவர்கள்
        </h3>
        <p>
          புதிய குடியேர்ப்பு கொள்கையின் கீழ் மாணவர்கள் தங்கள் விருப்பத்தேர்வுகளைச்
          சமர்ப்பிக்க வேண்டியுள்ளது. இதனால் அதிருப்தி தெரிவிக்கும் நிகழ்வுகள்
          நடந்துள்ளன.
        </p>
        <span className="news-time">5 hrs ago</span>
      </div>
      
    </div>
     <div className="news-card">
      <img
        src={luffy}
        alt="news"
        className="news-image"
      />
      <div className="news-content">
        <h3>
          படைன் நிறுவாகம் புதிய குடியேர்ப்பு கொள்கையை அறிவிப்பு - அதிருப்தியில்
          எஸ்லை மாணவர்கள்
        </h3>
        <p>
          புதிய குடியேர்ப்பு கொள்கையின் கீழ் மாணவர்கள் தங்கள் விருப்பத்தேர்வுகளைச்
          சமர்ப்பிக்க வேண்டியுள்ளது. இதனால் அதிருப்தி தெரிவிக்கும் நிகழ்வுகள்
          நடந்துள்ளன.
        </p>
        <span className="news-time">5 hrs ago</span>
      </div>
       <div className="right-container">
      {/* Weather Widget */}
      <div className="weather-card">
        <div className="weather-header">
          <span className="city">சென்னை</span>
          <span className="today">Today's Weather ▾</span>
        </div>

        <div className="weather-main">
          <h1>29°C</h1>
          <p>PARTLY CLOUDY</p>
          <div className="weather-icon">🌤️</div>
        </div>

        <div className="weather-aqi">
          <span className="aqi-label">106 AQI</span>
          <div className="aqi-bar">
            <div className="aqi-green"></div>
            <div className="aqi-yellow active"></div>
            <div className="aqi-orange"></div>
            <div className="aqi-red"></div>
          </div>
          <p className="aqi-text">106 AQI - Moderate</p>
        </div>
      </div>

      {/* Advertisement Box */}
      <div className="ad-box">
        <p>Advertisement here</p>
      </div>
    </div> 
    </div>
    
    
      
    </div>
  )
}
