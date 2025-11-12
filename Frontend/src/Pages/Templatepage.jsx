import React from 'react'
import logo from '../assets/logo.png'
import { IoSearchSharp } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiWorld } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiMiniMoon } from "react-icons/hi2";
import newsimg from "../assets/newsimg.avif";
import Newsform from './newsform';
function NewsCard({
  title = "Title goes here",
  image,
  time = "5hrs ago",
}) {
  return (
    <div
      style={{
        width: "400px",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {/* Top section with text and image */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "5px",
        }}
      >
        {/* Text Section */}
        <div style={{ flex: 1,
              fontSize: "15px",
              lineHeight: "1.2",
  
              margin: 0,
            }}
          >
            {title}
       
        </div>

        {/* Image Section */}
        {image && (
          <img
            src={image}
            alt="news thumbnail"
            style={{
              width: "120px",
              height: "80px",
              objectFit: "cover",
              borderRadius: "4px",
              flexShrink: 0,
            }}
          />
        )}
      </div>

      {/* Time and Divider */}
      <div >
        <span
          style={{
            color: "gray",
            fontSize: "10px",
          }}
        >
          {time}
        </span>
        <div
          style={{
           
            height: "1px",
            backgroundColor: "#ffb8e5ff",
            width: "100%",
          }}
        ></div>
      </div>
    </div>
  );
}
function AdvertisementBox({ width = "300px", height = "250px" }) {
  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#e0e0e0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#555",
        fontSize: "14px",
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        borderRadius: "4px",
      }}
    >
      Advertisement here
    </div>
  );
}function Line({
  width = "100%",
  height = "1px",
  color = "#ffb1ffff",
  orientation = "horizontal", // 'horizontal' or 'vertical'
  margin = "10px 0",
}) {
  const style = {
    backgroundColor: color,
    margin,
    width: orientation === "horizontal" ? width : height,
    height: orientation === "horizontal" ? height : width,
  };

  return <div style={style}></div>;
}

export default function Templatepage() {
  
  return (
   <div>
       <Newsform/>  
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
              <div className="break-news">
           <p>சென்னை விமான நிலையத்தில் பாதுகாப்பு சோதனை தீவிரம் | டெல்லியில் மழை வெள்ளம் – போக்குவரத்து பாதிப்பு | பெங்களூருவில் பெரிய IT நிறுவனத்தில் திடீர் பணிநீக்கம் | தமிழகத்தில் இன்று மின்தடை அறிவிப்பு | கோவை அருகே வெடிகுண்டு பரபரப்பு – போலீஸ் விசாரணை தொடக்கம் | பங்குச்சந்தை சரிவு – முதலீட்டாளர்கள் அதிர்ச்சி</p>
       </div>
       <div className="news-m-cont">
        <div className="news-m-cont2">
       <div className="ele-news">
            
       </div>
       <div className="hr-line"></div>
       <div className="side-news">
          <div><AdvertisementBox width='100%' height='100px'/></div>
          <div className="morenews">
            <div className="mn-txt">மேலும் செய்திகள்</div> 
            <Line height='2px' width='100%'/>
            </div>
          <div className="mrn-in-cont">
                 <NewsCard image={newsimg} title='பைடன் நிர்வாகம் புதிய குடியேற்றக் கொள்கையை அறிவிப்பு – அதிருப்தியில் எல்லை மாநிலங்கள்'/>
                 <NewsCard image={newsimg} title='பைடன் நிர்வாகம் புதிய குடியேற்றக் கொள்கையை அறிவிப்பு – அதிருப்தியில் எல்லை மாநிலங்கள்'/>
                 <NewsCard image={newsimg} title='பைடன் நிர்வாகம் புதிய குடியேற்றக் கொள்கையை அறிவிப்பு – அதிருப்தியில் எல்லை மாநிலங்கள்'/>
                 <NewsCard image={newsimg} title='பைடன் நிர்வாகம் புதிய குடியேற்றக் கொள்கையை அறிவிப்பு – அதிருப்தியில் எல்லை மாநிலங்கள்'/>
          </div>  
       </div>
       </div>
      </div>
      </div>
  )
}
