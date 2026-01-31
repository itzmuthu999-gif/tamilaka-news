import React from 'react'
import logo from "../../../assets/logo1.png";
import { IoSearchSharp } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiWorld } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiMiniMoon } from "react-icons/hi2";
import { IoSunnySharp } from "react-icons/io5";
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setLanguage, setTranslatedNews } from "../../Slice/newsformslice.js";
import { translateToEnglish } from "../../Slice/translate.js";

export default function Navbarr({ setIsOn, isOn, openSidebar }) {
 
  const dispatch = useDispatch();
const { allNews, language } = useSelector(
  (state) => state.newsform
);
const [isMobile, setIsMobile] = useState(window.innerWidth > 768);
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const districtDropdownRef = useRef(null);

  const districts = [
    "சென்னை",
    "கோயம்புத்தூர்",
    "மதுரை",
    "திருச்சிராப்பள்ளி (திருச்சி)",
    "சேலம்",
    "திருப்பூர்",
    "தஞ்சாவூர்",
    "கன்னியாகுமரி",
    "திருநெல்வேலி",
    "ஈரோடு",
    "வேலூர்",
    "திருவள்ளூர்",
    "காஞ்சிபுரம்",
    "செங்கல்பட்டு",
    "விழுப்புரம்",
    "கடலூர்",
    "நாமக்கல்",
    "கரூர்",
    "திண்டுக்கல்",
    "தேனி",
    "சிவகங்கை",
    "விருதுநகர்",
    "ராமநாதபுரம்",
    "புதுக்கோட்டை",
    "பெரம்பலூர்",
    "அரியலூர்",
    "தருமபுரி",
    "கிருஷ்ணகிரி",
    "திருவண்ணாமலை",
    "திருவாரூர்",
    "நாகப்பட்டினம்",
    "மயிலாடுதுறை",
    "நீலகிரி",
    "கள்ளக்குறிச்சி",
    "ராணிப்பேட்டை",
    "திருப்பத்தூர்",
    "தென்காசி",
    "காஞ்சிபுரம்",
  ];
useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth > 768);
  };

  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (districtDropdownRef.current && !districtDropdownRef.current.contains(e.target)) {
        setDistrictDropdownOpen(false);
      }
    };
    if (districtDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [districtDropdownOpen]);
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
              <div>தமிழக நியூஸ்</div>
              {(
                <div ref={districtDropdownRef} className="nav-district-dropdown">
                  <div
                    className="nav-district-trigger"
                    onClick={() => setDistrictDropdownOpen((prev) => !prev)}
                  >
                    மாவட்டம் ▾
                  </div>
                  {districtDropdownOpen && (
                    <div className="nav-district-menu">
                      {districts.map((district) => (
                        <div
                          key={district}
                          className="nav-district-item"
                          onClick={() => setDistrictDropdownOpen(false)}
                        >
                          {district}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div>விளையாட்டு</div>
              <div>ட்ரெண்டிங்</div>
            </div>
          { isMobile &&             <div className="nav-c3-dm-v2">
          {isOn ?   <IoSunnySharp onClick={() => setIsOn(!isOn)} />:<HiMiniMoon onClick={() => setIsOn(!isOn)} />}

            </div>}
          </div>
        </div>
      </div>
  )
}
