import React from 'react'
import logo from '../assets/logo.png'
import { IoSearchSharp } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiWorld } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiMiniMoon } from "react-icons/hi2";
export default function Templatepage() {
  return (
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

       <div className="break-news">
           <p>சென்னை விமான நிலையத்தில் பாதுகாப்பு சோதனை தீவிரம் | டெல்லியில் மழை வெள்ளம் – போக்குவரத்து பாதிப்பு | பெங்களூருவில் பெரிய IT நிறுவனத்தில் திடீர் பணிநீக்கம் | தமிழகத்தில் இன்று மின்தடை அறிவிப்பு | கோவை அருகே வெடிகுண்டு பரபரப்பு – போலீஸ் விசாரணை தொடக்கம் | பங்குச்சந்தை சரிவு – முதலீட்டாளர்கள் அதிர்ச்சி</p>
       </div>
   </div>
  )
}
