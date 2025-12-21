import React from "react";
import Navbar from "./Components/Navbar";
import { useState } from "react";
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
    backgroundColor: isOn ? "#141414" : "#ffffffff",
    color: isOn ? "#ffffffff" : "#141414",
    minHeight: "100vh",
    width: "100vw",
    transition: "all 0.3s ease",
    fontFamily: "Noto Sans Tamil",
  };

  return (
    <div style={themeStyle}>
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
  );
}
