import React from 'react'
import logo from "../../../assets/logo1.png";
import { IoSearchSharp } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiWorld } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiMiniMoon } from "react-icons/hi2";
import { IoSunnySharp } from "react-icons/io5";

import { useDispatch, useSelector } from "react-redux";
import { setLanguage, setTranslatedNews } from "../../Slice/newsformslice.js";
import { translateToEnglish } from "../../Slice/translate.js";

export default function Navbar({ setIsOn, isOn, openSidebar }) {
  const dispatch = useDispatch();
const { allNews, translatedNews, language } = useSelector(
  (state) => state.newsform
);
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

          <div className="navcon1">
            <style>

            {
                `
                .navcon1 {
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
.navcon2 {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.nav-c1-logo{
  width: 300px;

  padding: 15px 15px;
  display:flex; 
    flex-direction: column;
  justify-content: center;
  align-items: center;
}
.nav-c1l-t1
{
  font-size: 50px;
  font-family: 'BaminiTamil07';
  font-weight: bold;
  color: #e8098c;

}
.nav-c1l-t2
{
  font-size: 10px;
    font-weight: bold;
}     
.nav-c1 {
  display: flex;
  justify-content: space-between;
  align-items: end;
  width: 1250px;
}
.nav-c3 {
  display: flex;

  justify-content: space-between;
  align-items: end;
}
.nav-c1-date {
  font-size: 13px;
}
.nav-c1-links,
.nav-c3-ham {
  display: flex;
  gap: 10px;
  font-size: 20px;
}
.nav-c3-sections {
  display: flex;
  gap: 20px;
}
.nav-c2-line {
  width: 1250px;
  height: 2px;
  background-color: pink;
}
.break-news {
  background-color: rgb(220, 220, 220);
  width: 1530px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  overflow-x: hidden;
  margin: 30px 0px;
}

.ep-main-ed-cont {
  padding-top: 20px;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
    position: relative;
}
.ep-ed-cont {
  width: 1250px;
  height: fit-content;
  border: 1px solid;
 position: relative;
  overflow: visible !important;


}

                `
            }
            </style>
        <div className="navcon2">
          <div className="nav-c1">
            <div className="nav-c1-date">வியாக்ழன் அக்டோபர் 30 2025</div>
            <div className="nav-c1-logo" style={{position: "relative"}}>
               <div className="nav-c1l-t1" > <img src={logo}/></div>
               <div className="nav-c1l-t2" style={{position: "absolute", transform: "translateY(20px)"}}>நடுநிலை நாளிதழ்</div>
            </div>
            <div className="nav-c1-links">
              <div>
                <IoSearchSharp className="nav-c1-link" />
              </div>
              <div>
                <IoMdNotificationsOutline className="nav-c1-link"/>
              </div>
              <div>
<BiWorld
  className="nav-c1-link"
  onClick={handleLanguageToggle}
  style={{ cursor: "pointer" }}
/>

              </div>
            </div>
          </div>

          <div className="nav-c2-line"></div>

          <div className="nav-c3">
<div className="nav-c3-ham" onClick={openSidebar}>
  <GiHamburgerMenu />
</div>

            <div className="nav-c3-sections">
              <div>அரசியல்</div>
              <div>உலகம்</div>
              <div>இந்தியா</div>
              <div>தமிழக நியூஸ்</div>
              <div>மாவட்டம்</div>
              <div>விளையாட்டு</div>
              <div>ட்ரெண்டிங்</div>
            </div>
            <div className="nav-c3-dm">
          {isOn ?   <IoSunnySharp onClick={() => setIsOn(!isOn)} />:<HiMiniMoon onClick={() => setIsOn(!isOn)} />}

            </div>
          </div>
        </div>
      </div>
  )
}
