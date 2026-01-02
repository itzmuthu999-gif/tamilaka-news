import React from 'react'
import logo from "../../../assets/logo1.png";
import { IoSearchSharp } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiWorld } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiMiniMoon } from "react-icons/hi2";
import { IoSunnySharp } from "react-icons/io5";
import { useState,useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setLanguage, setTranslatedNews } from "../../Slice/newsformslice.js";
import { translateToEnglish } from "../../Slice/translate.js";

export default function Navbarr({ setIsOn, isOn, openSidebar }) {
 
  const dispatch = useDispatch();
const { allNews, language } = useSelector(
  (state) => state.newsform
);
const [isMobile, setIsMobile] = useState(window.innerWidth > 768);
useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth > 768);
  };

  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);
const handleLanguageToggle = async () => {
  if (language === "ta") {
    // Translate ALL news to English
    const translated = await Promise.all(
      allNews.map(async (news) => ({
        ...news,
        title: await translateToEnglish(news.title),
        content: await translateToEnglish(news.content),
      }))
    );

    dispatch(setTranslatedNews(translated));
    dispatch(setLanguage("en"));
  } else {
    // Switch back to Tamil (original data)
    dispatch(setLanguage("ta"));
  }
};

  return (

          <div className="navcon1-v2">
          
        <div className="navcon2-v2">
          <div className="nav-c1-v2">
                     {!isMobile && <div className="nav-c3-ham-vm2" onClick={openSidebar}>
  <GiHamburgerMenu />
</div> }
            { isMobile && <div className="nav-c1-date-v2">வியாக்ழன் அக்டோபர் 30 2025</div> }
            <div className="nav-c1-logo-v2" style={{position: "relative"}}>
               <div className="nav-c1l-t1-v2" > <img src={logo}/></div>
               <div className="nav-c1l-t2-v2" style={{position: "absolute", transform: "translateY(20px)"}}>நடுநிலை நாளிதழ்</div>
            </div>
           {isMobile &&             <div className="nav-c1-links-v2">
              <div>
                <IoSearchSharp className="nav-c1-link-v2" />
              </div>
              <div>
                <IoMdNotificationsOutline className="nav-c1-link-v2"/>
              </div>
              <div>
             <BiWorld
  className="nav-c1-link"
  onClick={handleLanguageToggle}
  style={{ cursor: "pointer" }}
/>

              </div>
            </div>}
          </div>

          <div className="nav-c2-line-v2"></div>

          <div className="nav-c3-v2">
         {isMobile && <div className="nav-c3-ham-v2" onClick={openSidebar}>
  <GiHamburgerMenu />
</div> }

            <div className="nav-c3-sections-v2">
              <div>அரசியல்</div>
              <div>உலகம்</div>
              <div>இந்தியா</div>
              {isMobile &&  <div>தமிழக நியூஸ்</div>}
              {isMobile &&  <div>மாவட்டம்</div>}
             {isMobile &&   <div>விளையாட்டு</div>}
            {isMobile &&    <div>ட்ரெண்டிங்</div>}
            </div>
          { isMobile &&             <div className="nav-c3-dm-v2">
          {isOn ?   <IoSunnySharp onClick={() => setIsOn(!isOn)} />:<HiMiniMoon onClick={() => setIsOn(!isOn)} />}

            </div>}
          </div>
        </div>
      </div>
  )
}
