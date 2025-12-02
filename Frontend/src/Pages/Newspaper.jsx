
import React from 'react'
import logo from '../assets/logo.png'
import { IoSearchSharp } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiWorld } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiMiniMoon } from "react-icons/hi2";

import luffy from '../assets/luffy.webp';
import './newspaper.css'
export default function Newspaper()
{


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
 </div>
 {/* MAIN SECTION */}
<div className="main-layout">
  <div className="main-left">
    <img
      className="main-img"
      src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b"
      alt="main"
    />
    <h2 className="main-head">
      டிரம்ப் பாணி அரசியலை மீண்டும் முயலும் குடியரசுக் கட்சி – பலன் இம்முறை குறையுமா?
    </h2>
    <p className="main-summary">
      2024 தேர்தலில் பல கட்சிகள் “ராஜ்யசபா” பிரதிநிதித்துவத்தை கவனித்து வருகின்றன.
      அமெரிக்க அரசியல் சூழ்நிலைகள் இம்முறை மாற்றத்தை சந்திக்குமா என அரசியல் வட்டாரங்கள் கூறுகின்றன.
    </p>
    <span className="time">5hrs ago</span>
  </div>

  {/* RIGHT SIDE NEWS */}
  <div className="main-right">
    {[1, 2, 3, 4, 5].map((n) => (
      <div className="side-card" key={n}>
        <img src={luffy} className="side-img" alt="side news" />
        <div className="side-info">
          <h4>
            டைமன் நிறுவனம் புதிய சூழ்நிலையை அறிவிப்பு – ஊழியர்கள் அதிருப்தி
          </h4>
          <span className="time">5hrs ago</span>
        </div>
      </div>
    ))}
  </div>
</div>

{/* AD BLOCK */}
<div className="ad-block">Advertisement here</div>

{/* GRID SECTION */}
<div className="grid-layout">
  <div className="list-column">
    {[1, 2, 3, 4].map((i) => (
      <div className="list-card" key={i}>
        <img src={luffy} className="list-img" alt="news" />
        <div>
          <h3>
            படைன் நிறுவாகம் புதிய குடியேர்ப்பு கொள்கையை அறிவிப்பு - மாணவர்கள் அதிருப்தியில்
          </h3>
          <p>
            புதிய குடியேர்ப்பு கொள்கையின் கீழ் மாணவர்கள் தங்கள் விருப்பத்தேர்வுகளைச்
            சமர்ப்பிக்க வேண்டியுள்ளது.
          </p>
          <span className="time">5hrs ago</span>
        </div>
      </div>
    ))}
  </div>

  {/* RIGHT COLUMN */}
  <div className="right-column">
    <div className="weather-box">
      <h2>சென்னை</h2>
      <div className="temp">29°C</div>
      <p>PARTLY CLOUDY</p>
      <div className="aqi">106 AQI - Moderate</div>
    </div>

    <div className="side-ad">Advertisement here</div>
  </div>
</div>

</div>
  )
}
