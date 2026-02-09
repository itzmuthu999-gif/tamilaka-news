import React from 'react';
import ReactDOM from 'react-dom';
import logo from "../../../assets/logo1.png";
import { IoSearchSharp } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiWorld } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiMiniMoon } from "react-icons/hi2";
import { IoSunnySharp } from "react-icons/io5";
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setLanguage, setTranslatedNews } from "../../Slice/newsformslice.js";
import { translateToEnglish } from "../../Slice/translate.js";

export default function Navbarr({ setIsOn, isOn, openSidebar }) {
 
  const dispatch = useDispatch();
const { allNews, language } = useSelector(
  (state) => state.newsform
);
const { allPages, selectedDistrict1 } = useSelector(
  (state) => state.admin
);
const [isMobile, setIsMobile] = useState(window.innerWidth > 768);
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const [menuPortalPosition, setMenuPortalPosition] = useState(null);
  const districtDropdownRef = useRef(null);

  // Get pages that should appear in top navigation (topnavpos is not null)
  // and sort them by topnavpos value
  const topNavPages = allPages
    .filter(page => page.topnavpos !== null)
    .sort((a, b) => a.topnavpos - b.topnavpos);

  // Find the district page (it has a 'districts' property)
  const districtPage = allPages.find(page => page.districts);
  const districts = districtPage?.districts || [];

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth > 768);
  };

  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);

  useLayoutEffect(() => {
    if (!districtDropdownOpen || !districtDropdownRef.current) {
      setMenuPortalPosition(null);
      return;
    }
    const rect = districtDropdownRef.current.getBoundingClientRect();
    setMenuPortalPosition({ top: rect.bottom + 6, left: rect.left });
  }, [districtDropdownOpen]);

  useEffect(() => {
    if (!districtDropdownOpen) return;
    const handleScrollOrResize = () => setDistrictDropdownOpen(false);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [districtDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (districtDropdownRef.current && !districtDropdownRef.current.contains(e.target)) {
        const menuEl = document.querySelector(".nav-district-menu-portal");
        if (menuEl && menuEl.contains(e.target)) return;
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
              {topNavPages.map((page) => {
                // Check if this is the district page (has districts property)
                if (page.districts) {
                  return (
                    <div key={page.id} ref={districtDropdownRef} className="nav-district-dropdown">
                      <div
                        className="nav-district-trigger"
                        onClick={() => setDistrictDropdownOpen((prev) => !prev)}
                      >
                        {language === "ta" ? page.name.tam : page.name.eng} ▾
                      </div>
                      {districtDropdownOpen && menuPortalPosition && ReactDOM.createPortal(
                        <div
                          className={`nav-district-menu nav-district-menu-portal${isOn ? " nav-district-menu-dark" : ""}`}
                          style={{
                            position: "fixed",
                            top: menuPortalPosition.top,
                            left: menuPortalPosition.left,
                          }}
                        >
                          {districts.map((district, index) => (
                            <div
                              key={index}
                              className="nav-district-item"
                              onClick={() => setDistrictDropdownOpen(false)}
                            >
                              {language === "ta" ? district.tam : district.eng}
                            </div>
                          ))}
                        </div>,
                        document.body
                      )}
                    </div>
                  );
                }
                
                // Regular page (not district)
                return (
                  <div key={page.id}>
                    {language === "ta" ? page.name.tam : page.name.eng}
                  </div>
                );
              })}
            </div>
          { isMobile &&             <div className="nav-c3-dm-v2">
          {isOn ?   <IoSunnySharp onClick={() => setIsOn(!isOn)} />:<HiMiniMoon onClick={() => setIsOn(!isOn)} />}

            </div>}
          </div>
        </div>
      </div>
  )
}