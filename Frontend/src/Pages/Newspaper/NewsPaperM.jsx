import React from "react";
import Navbar from "./Components/Navbarr";
import { useState, useEffect } from "react";
import "./newspaper.scss";
import BigNewsContainer1 from "./Containers_/BigContainer1";
import NorContainer5 from "./Containers_/NorContainer5";
import Newsheader from "./Components/Newsheader";
import Line from "./Components/Line";
import AdBox from "./Components/Adbox";
import WeatherBox from "./Components/WeatherBox";
import NorContainer1 from "./Containers_/NorContainer1";
import BigNewsContainer2 from "./Containers_/BigContainer2";
import BigNewsContainer3 from "./Containers_/BigContainer3";
import BigNewsContainer4 from "./Containers_/BigContainer4";
import BigNewsContainer4A from "./Containers_/BigContainer4A";
import AutoScrollContainer from "./Components/AutoScrollContainer";
import NorContainer3 from "./Containers_/NorContainer3";
import NorContainer4A from "./Containers_/NorContainer4A";
import NorContainer4 from "./Containers_/NorContainer4";
import NorContainer2 from "./Containers_/NorContainer2";
import Footer from "./Components/Footer";
import Sidebar from "./Components/Sidebar";

import Main from "./Pages/Main";
export default function NewsPaperM() {
  const [isOn, setIsOn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const themeStyle = {
    backgroundColor: isOn ? "#141414" : "#ffffff",
    color: isOn ? "#ffffff" : "#141414",
    transition: "all 0.3s ease",
    fontFamily: "Noto Sans Tamil",
  };

  // Apply dark/light to entire viewport so left/right margins are never white
  useEffect(() => {
    const bg = isOn ? "#141414" : "#ffffff";
    const fg = isOn ? "#ffffff" : "#141414";
    document.body.style.backgroundColor = bg;
    document.body.style.color = fg;
    document.documentElement.style.backgroundColor = bg;
    document.documentElement.style.color = fg;
    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
      document.documentElement.style.backgroundColor = "";
      document.documentElement.style.color = "";
    };
  }, [isOn]);

  return (
    <div style={{ ...themeStyle, width: "100%", minHeight: "100vh", margin: 0, padding: 0 }}>
      <div className="main-screen" style={{ ...themeStyle, backgroundColor: "transparent", maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
<Navbar
  setIsOn={setIsOn}
  isOn={isOn}
  openSidebar={() => setSidebarOpen(true)}
/>

            <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
         openSidebar={() => setSidebarOpen(true)}
      />
      <div className="np-main-cont-ov">
         
        <Main/>
        
        <Footer/>


      </div>
      </div>
    </div>
  );
}
