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

export default function NewsPaperM() {
  const [isOn, setIsOn] = useState(false);
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
      <Navbar setIsOn={setIsOn} isOn={isOn} />
      <div className="np-main-cont-ov">
        <div className="np-main-cont">
          <div
            className="npmc-c1"
            style={{
              display: "flex",
              gap: "5px",
            }}
          >
            <BigNewsContainer1 />
            <Line
              direction="V"
              length="630px"
              thickness="1px"
              color="#e80d8c"
            />

            <div
              className="npmcc1-s1"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                width: "420px",
              }}
            >
              <Newsheader name={"Top news"} />
              <NorContainer5 />
              <Line
                direction="H"
                length="100%"
                thickness="0.5px"
                color="#b6b6b6ff"
              />
              <NorContainer5 />
              <Line
                direction="H"
                length="100%"
                thickness="0.5px"
                color="#b6b6b6ff"
              />
              <NorContainer5 />
              <Line
                direction="H"
                length="100%"
                thickness="0.5px"
                color="#b6b6b6ff"
              />

              <NorContainer5 />
              <Line
                direction="H"
                length="100%"
                thickness="0.5px"
                color="#b6b6b6ff"
              />

              <NorContainer5 />
              <Line
                direction="V"
                length="100%"
                thickness="0.5px"
                color="#b6b6b6ff"
              />
            </div>
          </div>
          <Line direction="H" length="100%" thickness="1px" color="#e80d8c" />
          <AdBox width="100%" height="150px" />
          <div
            className="npmc-c2"
            style={{
              display: "flex",
              gap: "15px",
              margin: "15px 0px",
            }}
          >
            <div className="npmcc2-s1">
              <NorContainer1 />
              <Line
                direction="H"
                length="100%"
                thickness="0.5px"
                color="#b6b6b6ff"
              />
              <NorContainer1 />
              <Line
                direction="H"
                length="100%"
                thickness="0.5px"
                color="#b6b6b6ff"
              />
              <NorContainer1 />
              <Line
                direction="H"
                length="100%"
                thickness="0.5px"
                color="#b6b6b6ff"
              />
              <NorContainer1 />
              <Line
                direction="H"
                length="100%"
                thickness="0.5px"
                color="#b6b6b6ff"
              />
            </div>
            <Line
              direction="V"
              length="850px"
              thickness="1px"
              color="#e80d8c"
            />
            <div className="npmcc2-s2">
              <WeatherBox />
            </div>
          </div>
          <Newsheader name={"Other News"} />
          <div
            className="npmc-c3"
            style={{
              display: "flex",
              gap: "15px",
              margin: "15px 0px",
            }}
          >
            <AutoScrollContainer>
              <BigNewsContainer4A />
              <BigNewsContainer4A />
              <BigNewsContainer4A />
              <BigNewsContainer4A />
              <BigNewsContainer4A />
            </AutoScrollContainer>
          </div>
          
         <br /> <AdBox width="100%" height="150px" /> <br />

          <Newsheader name={"politics"} />
          <div className="npmc-c4" 
                      style={{
              display: "flex",
              gap: "15px",

            }}
          >
             <BigNewsContainer3/>
             <div className="npmcc4-s1">
                 <NorContainer3 />
                 <NorContainer3 />
                 <NorContainer3 />
                 <NorContainer3 />
                 <NorContainer3 />
                 <NorContainer3 />

             </div>
                          <div className="npmcc4-s1">
                 <NorContainer3 />
                 <NorContainer3 />
                 <NorContainer3 />
                 <NorContainer3 />
                 <NorContainer3 />
                 <NorContainer3 />

             </div>
          </div>

                   <br /> <AdBox width="100%" height="150px" /> <br />
                          <Newsheader name={"sports"} />
          <div className="npmc-c4" 
                      style={{
              display: "flex",
              gap: "15px",

            }}
          >
             <BigNewsContainer3/>
             <div className="npmcc4-s1">
                 <NorContainer3 />
                 <NorContainer3 />
                 <NorContainer3 />
                 <NorContainer3 />
                 <NorContainer3 />
                 <NorContainer3 />

             </div>
                          <div className="npmcc4-s1">
                 <NorContainer3 />
                 <NorContainer3 />
                 <NorContainer3 />
                 <NorContainer3 />
                 <NorContainer3 />
                 <NorContainer3 />

             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
