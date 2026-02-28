import React from "react";
import BigNewsContainer1 from "../Containers_/BigContainer1";
import BigNewsContainer2 from "../Containers_/BigContainer2";
import BigNewsContainer3 from "../Containers_/BigContainer3";
import BigNewsContainer4 from "../Containers_/BigContainer4";
import BigNewsContainer4A from "../Containers_/BigContainer4A";
import BigNewsContainer5 from "../Containers_/BigContainer5";

import NorContainer1 from "../Containers_/NorContainer1";
import NorContainer2 from "../Containers_/NorContainer2";
import NorContainer3 from "../Containers_/NorContainer3";
import NorContainer4 from "../Containers_/NorContainer4";
import NorContainer4A from "../Containers_/NorContainer4A";
import NorContainer5 from "../Containers_/NorContainer5";

import AdBox from "../Components/AdBox";
import AutoScrollContainer from "../Components/AutoScrollContainer";
import Line from "../Components/Line";

import Newsheader from "../Components/Newsheader";
import WeatherBox from "../Components/WeatherBox";

import { useState,useEffect } from "react";
export default function Main() {
  const [isMobile, setIsMobile] = useState(window.innerWidth > 768);
  const newslist={
     n1: 1769719221991,
     n2: 1769719221991,
  }
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth > 768);
    };
  
    window.addEventListener("resize", handleResize);
  
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  

  return (
    <div className="np-main-cont">
      <div
        className="npmc-c1"

      >
        <BigNewsContainer1 newsId={newslist.n1} />
        {isMobile && <Line direction="V" length="630px" thickness="1px" color="#e80d8c" />}
        {/* {!isMobile && <Line direction="H" length="100%" thickness="1px" color="#e80d8c" />} */}
         {!isMobile && 
         <div>
          <br /><br />
         </div>}
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
          <NorContainer5 newsId={newslist.n1} />
          <Line
            direction="H"
            length="100%"
            thickness="0.5px"
            color="#b6b6b6ff"
          />
          <NorContainer5 newsId={newslist.n1} />
          <Line
            direction="H"
            length="100%"
            thickness="0.5px"
            color="#b6b6b6ff"
          />
          <NorContainer5 newsId={newslist.n1} />
          <Line
            direction="H"
            length="100%"
            thickness="0.5px"
            color="#b6b6b6ff"
          />

          <NorContainer5 newsId={newslist.n1} />
          <Line
            direction="H"
            length="100%"
            thickness="0.5px"
            color="#b6b6b6ff"
          />

          <NorContainer5 newsId={newslist.n1} />
          <Line
            direction="H"
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
          <NorContainer1 newsId={newslist.n1} />
          <Line
            direction="H"
            length="100%"
            thickness="0.5px"
            color="#b6b6b6ff"
          />
          <NorContainer1 newsId={newslist.n1} />
          <Line
            direction="H"
            length="100%"
            thickness="0.5px"
            color="#b6b6b6ff"
          />
          <NorContainer1 newsId={newslist.n1} />
          <Line
            direction="H"
            length="100%"
            thickness="0.5px"
            color="#b6b6b6ff"
          />
          <NorContainer1 newsId={newslist.n1} />
        </div>
        <Line direction="V" length="850px" thickness="1px" color="#e80d8c" />
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
          <BigNewsContainer4A newsId={newslist.n1} />
          <BigNewsContainer4A newsId={newslist.n1} />
          <BigNewsContainer4A newsId={newslist.n1} />
          <BigNewsContainer4A newsId={newslist.n1} />
          <BigNewsContainer4A newsId={newslist.n1} />
        </AutoScrollContainer>
      </div>
      <br /> <AdBox width="100%" height="150px" /> <br />
      <Newsheader name={"politics"} />
      <div
        className="npmc-c4"
        style={{
          display: "flex",
          gap: "15px",
        }}
      >
        <BigNewsContainer3 newsId={newslist.n1} />
        <div className="npmcc4-s1">
          <NorContainer3 newsId={newslist.n1} />

          <NorContainer3 newsId={newslist.n1} />
          <NorContainer3 newsId={newslist.n1} />
          <NorContainer3 newsId={newslist.n1} />
          <NorContainer3 newsId={newslist.n1} />
        </div>
        <div className="npmcc4-s1">
          <NorContainer3 newsId={newslist.n1} />
          <NorContainer3 newsId={newslist.n1} />
          <NorContainer3 newsId={newslist.n1} />
          <NorContainer3 newsId={newslist.n1} />
          <NorContainer3 newsId={newslist.n1} />
        </div>
      </div>
      <br /> <AdBox width="100%" height="150px" /> <br />
      <Newsheader name={"sports"} />
      <div
        className="npmc-c4"
        style={{
          display: "flex",
          gap: "15px",
        }}
      >
        <div className="npmcc4-s1">
          <NorContainer3 newsId={newslist.n1} />
          <NorContainer3 newsId={newslist.n1} />
          <NorContainer3 newsId={newslist.n1} />
          <NorContainer3 newsId={newslist.n1} />
          <NorContainer3 newsId={newslist.n1} />
        </div>
        <div className="npmcc4-s2">
          <BigNewsContainer3 newsId={newslist.n1} />
          <NorContainer3 newsId={newslist.n1} />
        </div>
        <div className="npmcc4-s1">
          <NorContainer3 newsId={newslist.n1} />
          <NorContainer3 newsId={newslist.n1} />
          <NorContainer3 newsId={newslist.n1} />
          <NorContainer3 newsId={newslist.n1} />
          <NorContainer3 newsId={newslist.n1} />
        </div>
      </div>
      <br />
      <br />
      <br />
      <div
        className="npmc-c5"
        style={{
          marginTop: "20px",
          display: "flex",
          gap: "15px",
          justifyContent: "space-between",
        }}
      >
        <div className="npmcc5-s1">
          <Newsheader name={"weather"} />
          <div style={{ display: "flex", gap: "5px" }}>
            <BigNewsContainer4A size={500} newsId={newslist.n1} />
            <div>
              <NorContainer4A newsId={newslist.n1} />
              <Line
                direction="H"
                length="100%"
                thickness="0.5px"
                color="#b6b6b6ff"
              />
              <NorContainer4A newsId={newslist.n1} />
              <Line
                direction="H"
                length="100%"
                thickness="0.5px"
                color="#b6b6b6ff"
              />
              <NorContainer4A newsId={newslist.n1} />
              <Line
                direction="H"
                length="100%"
                thickness="0.5px"
                color="#b6b6b6ff"
              />
              <NorContainer4A newsId={newslist.n1} />
              <Line
                direction="H"
                length="100%"
                thickness="0.5px"
                color="#b6b6b6ff"
              />
            </div>
          </div>
        </div>
        <Line direction="V" length="450px" thickness="1px" color="#e80d8c" />
        <div className="npmcc5-s2">
          <Newsheader name={"weather"} />
          <div style={{ display: "flex", gap: "5px" }}>
            <BigNewsContainer4A newsId={newslist.n1} />
            <div>
              <NorContainer4A newsId={newslist.n1} />
              <Line
                direction="H"
                length="100%"
                thickness="0.5px"
                color="#b6b6b6ff"
              />
              <NorContainer4A newsId={newslist.n1} />
              <Line
                direction="H"
                length="100%"
                thickness="0.5px"
                color="#b6b6b6ff"
              />
              <NorContainer4A newsId={newslist.n1} />
              <Line
                direction="H"
                length="100%"
                thickness="0.5px"
                color="#b6b6b6ff"
              />
              <NorContainer4A newsId={newslist.n1} />
              <Line
                direction="H"
                length="100%"
                thickness="0.5px"
                color="#b6b6b6ff"
              />
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
      <div className="npmc-c6">
        <Newsheader name={"Trending"} />

        <div
          style={{
            display: "flex",
            gap: "5px",
            justifyContent: "space-between",
            alignItems: "stretch",
          }}
        >
          <div>
            <NorContainer4 newsId={newslist.n1} />
            <Line
              direction="H"
              length="100%"
              thickness="0.5px"
              color="#b6b6b6ff"
            />
            <NorContainer4 newsId={newslist.n1} />
          </div>
          <Line
            direction="V"
            length="100%"
            thickness="1.5px"
            color="#b6b6b6ff"
          />
          <div>
            <NorContainer4 newsId={newslist.n1} />
            <Line
              direction="H"
              length="100%"
              thickness="0.5px"
              color="#b6b6b6ff"
            />
            <NorContainer4 newsId={newslist.n1} />
          </div>
          <Line
            direction="V"
            length="100%"
            thickness="0.5px"
            color="#b6b6b6ff"
          />
          <div>
            <NorContainer4 newsId={newslist.n1} />
            <Line
              direction="H"
              length="100%"
              thickness="0.5px"
              color="#b6b6b6ff"
            />
            <NorContainer4 newsId={newslist.n1} />
          </div>
          <Line
            direction="V"
            length="100%"
            thickness="0.5px"
            color="#b6b6b6ff"
          />
          <div style={{ display: "inline-block" }}>
            <NorContainer4 newsId={newslist.n1} />
            <Line
              direction="H"
              length="100%"
              thickness="0.5px"
              color="#b6b6b6ff"
            />
            <NorContainer4 newsId={newslist.n1} />
          </div>
          <Line
            direction="V"
            length="100%"
            thickness="0.5px"
            color="#b6b6b6ff"
          />
        </div>
      </div>
      <br />
      <br />
      <div
        className="npmc-c5"
        style={{
          marginTop: "20px",
          display: "flex",
          gap: "15px",
          justifyContent: "space-between",
        }}
      >
        <div className="npmcc5-s1">
          <Newsheader name={"weather"} />
          <div style={{ display: "flex", gap: "5px" }}>
            <BigNewsContainer4A size={500} newsId={newslist.n1} />
            <div>
              <NorContainer4A newsId={newslist.n1} />
              <Line
                direction="H"
                length="100%"
                thickness="0.5px"
                color="#b6b6b6ff"
              />
              <NorContainer4A newsId={newslist.n1} />
              <Line
                direction="H"
                length="100%"
                thickness="0.5px"
                color="#b6b6b6ff"
              />
              <NorContainer4A newsId={newslist.n1} />
              <Line
                direction="H"
                length="100%"
                thickness="0.5px"
                color="#b6b6b6ff"
              />
              <NorContainer4A newsId={newslist.n1} />
              <Line
                direction="H"
                length="100%"
                thickness="0.5px"
                color="#b6b6b6ff"
              />
            </div>
          </div>
        </div>
        <Line direction="V" length="450px" thickness="1px" color="#e80d8c" />
        <div className="npmcc5-s2">
          <Newsheader name={"weather"} />
          <div style={{ display: "flex", gap: "5px" }}>
            <BigNewsContainer4A newsId={newslist.n1} />
            <div>
              <NorContainer4A newsId={newslist.n1} />
              <Line
                direction="H"
                length="100%"
                thickness="0.5px"
                color="#b6b6b6ff"
              />
              <NorContainer4A newsId={newslist.n1} />
              <Line
                direction="H"
                length="100%"
                thickness="0.5px"
                color="#b6b6b6ff"
              />
              <NorContainer4A newsId={newslist.n1} />
              <Line
                direction="H"
                length="100%"
                thickness="0.5px"
                color="#b6b6b6ff"
              />
              <NorContainer4A newsId={newslist.n1} />
              <Line
                direction="H"
                length="100%"
                thickness="0.5px"
                color="#b6b6b6ff"
              />
            </div>
          </div>
        </div>
      </div>
      <br /> <AdBox width="100%" height="150px" /> <br /> 
    </div>
  );
}
