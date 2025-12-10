import React from "react";

import { IoSearchSharp } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiWorld } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiMiniMoon } from "react-icons/hi2";
import { useState,useRef, useEffect } from "react";

import logo from "../../assets/logo.png";
import bcs from "./../../assets/bcs.jpg";
import jwt from "./../../assets/jwt.jpg";
import "./editpapercss.scss";

import PerfectSlider from "./Containers_/PerfectSlider";
// Container 1: News 8 - Headline with image on right
const NewsContainer8 = ({ image, headline,time }) => (
  <div className="ep-nm-news-8">
    <div className="ep-nm8-sbc">
      <div className="epnn8-hdln">{headline}</div>
       <div className="epn-tm">{time}</div>
    </div>
    <div className="epnn8-img">
      <img src={image} alt="" />
    </div>
    
  </div>
);

// Container 2: News 7 - Image on left, headline on right
const NewsContainer7 = ({ image, headline,time }) => (
  <div className="ep-nm-news-7">
    <div className="epnn7-img">
      <img src={image} alt="" />
    </div>
    <div className="ep-nm7-sbc">
      <div className="epnn7-hdln">{headline}</div>
             <div className="epn-tm">{time}</div>
    </div>
  </div>
);

// Container 3: News 3 - Image on left, long content on right
const NewsContainer3 = ({ image, content,time }) => (
  <div className="ep-nm-news-3">
    <div className="epnn3-img">
      <img src={image} alt="" />
    </div>
    <div className="ep-nm3-sbc">
      <div className="epnn3-onln">{content}</div>
                   <div className="epn-tm">{time}</div>
    </div>
  </div>
);

// Container 4: News 4 - Content on left with time, image on right
const NewsContainer4 = ({ image, content, time }) => (
  <div className="ep-nm-news-4">
    <div className="ep-nm4-sbc">
      <div className="epnn4-onln">{content}</div>
      <div className="epn-tm">{time}</div>
    </div>
    <div className="epnn4-img">
      <img src={image} alt="" />
    </div>
  </div>
);

// Container 5: News 5 - Image on left, headline and time on right
const NewsContainer5 = ({ image, headline, time }) => (
  <div className="ep-nm-news-5">
    <div className="epnn5-img">
      <img src={image} alt="" />
    </div>
    <div className="ep-nm5-sbc">
      <div className="epbn5-hdln">{headline}</div>
      <div className="epn-tm">{time}</div>
    </div>
  </div>
);

// Container 6: News 6 - Headline and time on left, image on right
const NewsContainer6 = ({ image, headline, time }) => (
  <div className="ep-nm-news-6">
    <div className="ep-nm6-sbc">
      <div className="epbn6-hdln">{headline}</div>
      <div className="epn-tm">{time}</div>
    </div>
    <div className="epnn6-img">
      <img src={image} alt="" />
    </div>
  </div>
);

// Container 7: News 2.1 - Headline, content, time on left, image on right
// const NewsContainer21 = ({ image, headline, content, time }) => (
//   <div className="ep-nm2-news-1">
//     <div className="ep-nm21-sbc">
//       <div className="epbn21-hdln">{headline}</div>
//       <div className="epnn21-onln">{content}</div>
//       <div className="epn-tm">{time}</div>
//     </div>
//     <div className="epnn21-img">
//       <img src={image} alt="" />
//     </div>
//   </div>
// );

// Container 8: News 2.2 - Headline on top, content and image side by side
const NewsContainer21 = ({ image, headline, content, time }) => (
  <div className="ep-nm2-news-2">
    <div className="epbn22-hdln">{headline}</div>
    <div className="ep-nm22-sbc">
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <div className="epnn22-onln">{content}</div>
        <div className="epn-tm">{time}</div>
      </div>
      <div className="epnn22-img">
        <img src={image} alt="" />
      </div>
    </div>
  </div>
);

// Container 9: News 2.3 - Headline on top, image and content side by side
const NewsContainer22 = ({ image, headline, content, time }) => (
  <div className="ep-nm2-news-3">
    <div className="epbn23-hdln">{headline}</div>
    <div className="ep-nm23-sbc">
      <div className="epnn23-img">
        <img src={image} alt="" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <div className="epnn23-onln">{content}</div>
        <div className="epn-tm">{time}</div>
      </div>
    </div>
  </div>
);

// Container 10: News 1 - Image on left, headline, content, time on right
const NewsContainer1 = ({ image, headline, content, time }) => (
  <div className="ep-nm-news-1">
    <div className="epnn1-img">
      <img src={image} alt="" />
    </div>
    <div className="ep-nm1-sbc">
      <div className="epnn1-hdln">{headline}</div>
      <div className="epnn1-onln">{content}</div>
      <div className="epn-tm">{time}</div>
    </div>
  </div>
);

// Container 11: Big News 2 - Image on left, headline and content on right (400px width)
const BigNewsContainer2V1 = ({ image, headline, content, time }) => (
  <div className="ep-bg-news-2">
    <div className="epbn2-img">
      <img src={image} alt="" />
    </div>
    <div style={{ width: "400px" }}>
      <div className="epbn2-hdln">{headline}</div>
      <div className="epbn2-onln">{content}</div>
      <div className="epn-tm">{time}</div>
    </div>
  </div>
);
const BigNewsContainer5V1 = ({ image, headline, content, time }) => (
  <div className="ep-bg-news5-1">

    <div style={{ width: "400px" }}>
      <div className="epbn51-hdln">Head{headline}</div>
      <div className="epbn51-onln">{content}</div>
      <div className="epn-tm">{time}</div>
    </div>
        <div className="epbn51-img">
      <img src={image} alt="" />
    </div>
  </div>
);
const BigNewsContainer5V2 = ({ image, headline, content, time }) => (
  <div className="ep-bg-news5-1">
      <div className="epbn51-img">
      <img src={image} alt="" />
    </div>
    <div style={{ width: "400px" }}>
      <div className="epbn51-hdln">Head{headline}</div>
      <div className="epbn51-onln">{content}</div>
      <div className="epn-tm">{time}</div>
    </div>

  </div>
);
// Container 12: News 2 - Headline, content, time on left, image on right
const NewsContainer2 = ({ image, headline, content, time }) => (
  <div className="ep-nm-news-2">
    <div className="ep-nm2-sbc">
      <div className="epnn2-hdln">{headline}</div>
      <div className="epnn2-onln">{content}</div>
      <div className="epn-tm">{time}</div>
    </div>
    <div className="epnn2-img">
      <img src={image} alt="" />
    </div>
  </div>
);

// Container 13: Big News 1 (Version 1) - Image, headline, content, time stacked
const BigNewsContainer1V1 = ({ image, headline, content, time }) => (
  <div className="ep-bg-news-1">
    <div className="epbn1-img">
      <img src={image} alt="" />
    </div>
    <div className="epbn1-hdln">{headline}</div>
    <div className="epbn1-onln">{content}</div>
    <div className="epn-tm">{time}</div>
  </div>
);

// Container 14: Big News 1 (Version 2) - Headline, image, content, time stacked
const BigNewsContainer1V2 = ({ image, headline, content, time }) => (
  <div className="ep-bg-news-1">
    <div className="epbn1-hdln">{headline}</div>
    <div className="epbn1-img">
      <img src={image} alt="" />
    </div>
    <div className="epbn1-onln">{content}</div>
    <div className="epn-tm">{time}</div>
  </div>
);
const BigNewsContainer1V3 = ({ image, headline, content, time }) => (
  <div className="ep-bg-news-1">
    <div className="epbn1-hdln">{headline}</div>
     <div className="epbn1-onln">{content}</div>
    <div className="epbn1-img">
      <img src={image} alt="" />
    </div>
   
    <div className="epn-tm">{time}</div>
  </div>
);

// Container 15: Big News 2 (Reversed) - Content on left (400px), image on right
const BigNewsContainer2V2 = ({ image, headline, content, time }) => (
  <div className="ep-bg-news-2">
    <div style={{ width: "400px" }}>
      <div className="epbn2-hdln">{headline}</div>
      <div className="epbn2-onln">{content}</div>
      <div className="epn-tm">{time}</div>
    </div>
    <div className="epbn2-img">
      <img src={image} alt="" />
    </div>
  </div>
);


// Container 16: Big News 3 (Version 1) - Headline, image, content, time stacked
const BigNewsContainer3V1 = ({ image, headline, content, time }) => (
  <div className="ep-bg-news-3">
    <div className="epbn3-hdln">{headline}</div>
    <div className="epbn3-img">
      <img src={image} alt="" />
    </div>
    <div className="epbn3-onln">{content}</div>
    <div className="epn-tm">{time}</div>
  </div>
);
const BigNewsContainer3V3 = ({ image, headline, content, time }) => (
  <div className="ep-bg-news-3">
    <div className="epbn3-hdln">{headline}</div>
        <div className="epbn3-onln">{content}</div>
    <div className="epbn3-img">
      <img src={image} alt="" />
    </div>

    <div className="epn-tm">{time}</div>
  </div>
);

// Container 17: Big News 3 (Version 2) - Image, headline, content, time stacked
const BigNewsContainer3V2 = ({ image, headline, content, time }) => (
  <div className="ep-bg-news-3">
    <div className="epbn3-img">
      <img src={image} alt="" />
    </div>
    <div className="epbn3-hdln">{headline}</div>
    <div className="epbn3-onln">{content}</div>
    <div className="epn-tm">{time}</div>
  </div>
);

// Container 18: Big News 4 (Version 1) - Image, headline, time stacked
const BigNewsContainer4V1 = ({ image, headline, time }) => (
  <div className="ep-bg-news-4">
    <div className="epbn4-img">
      <img src={image} alt="" />
    </div>
    <div className="epbn4-hdln">{headline}</div>
    <div className="epn-tm">{time}</div>
  </div>
);

// Container 19: Big News 4 (Version 2) - Headline, time, image stacked
const BigNewsContainer4V2 = ({ image, headline, time }) => (
  <div className="ep-bg-news-4">
    <div className="epbn4-hdln">{headline}</div>
    
    <div className="epbn4-img">
      <img src={image} alt="" />
    </div>
    <div className="epn-tm">{time}</div>
  </div>
);

const CONTAINER_MAP = {
  NewsContainer1,
  NewsContainer2,
  NewsContainer3,
  NewsContainer4,
  NewsContainer5,
  NewsContainer6,
  NewsContainer7,
  NewsContainer8,
  NewsContainer21,
  NewsContainer22,
  BigNewsContainer1V1,
  BigNewsContainer1V2,
  BigNewsContainer2V1,
  BigNewsContainer2V2,
  BigNewsContainer3V1,
  BigNewsContainer3V2,
  BigNewsContainer4V1,
  BigNewsContainer4V2,
};

const sampleItems = [
    {
      image: bcs,
      headline: 'தமிழகத்தில் கனமழை எச்சரிக்கை',
      content: 'பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும்',
      time: '2 hrs ago',
    },
    {
      image: bcs,
            headline: 'செய்திகள்: தொழில்நுட்ப முன்னேற்றம்',
      content: 'புதிய தொழில்நுட்பம் சந்தைக்கு வந்துள்ளது',
      time: '3 hrs ago',
    },
    {
      image: bcs,      headline: 'விளையாட்டு செய்திகள்',
      content: 'இன்றைய போட்டியில் அசத்திய வீரர்கள்',
      time: '4 hrs ago',
    },
    {
      image: bcs,      headline: 'பொருளாதார செய்திகள்',
      content: 'பங்குச் சந்தையில் புதிய உச்சம்',
      time: '5 hrs ago',
    },
  ];
export default function Editpaper() {
  const sampleContent = `பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என,பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என,பல மாவட்டங்களில் இன்று லேசான முதல் மிதமா ன மழை பதிவாகும் என பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என,பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என`;
  const sampleHeadline= `பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும்`;
  const sampleImage=jwt;
  const sampleTime="5 hrs ago ";
  return (
    <div>
      <div className="navcon1">
        <div className="navcon2">
          <div className="nav-c1">
            <div className="nav-c1-date">வியாக்ழன் அக்டோபர் 30 2025</div>
            <div className="nav-c1-logo">
              <img src={logo} alt="alt" />
            </div>
            <div className="nav-c1-links">
              <div>
                <IoSearchSharp />
              </div>
              <div>
                <IoMdNotificationsOutline />
              </div>
              <div>
            
                <BiWorld />
              </div>
            </div>
          </div>
          <div className="nav-c2-line"></div>
          <div className="nav-c3">
            <div className="nav-c3-ham">
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
              <HiMiniMoon />
            </div>
          </div>
        </div>
      </div>
      <div className="break-news">
        <p>
          சென்னை விமான நிலையத்தில் பாதுகாப்பு சோதனை தீவிரம் | டெல்லியில் மழை
          வெள்ளம் – போக்குவரத்து பாதிப்பு | பெங்களூருவில் பெரிய IT நிறுவனத்தில்
          திடீர் பணிநீக்கம் | தமிழகத்தில் இன்று மின்தடை அறிவிப்பு | கோவை அருகே
          வெடிகுண்டு பரபரப்பு – போலீஸ் விசாரணை தொடக்கம் | பங்குச்சந்தை சரிவு –
          முதலீட்டாளர்கள் அதிர்ச்சி
        </p>
      </div>
      <div className="ep-main-ed-cont">
  <div className="ep-floater1">
      <div className="ep-fl1-sort">sort by </div>
           <div className="ep-fl1-btns">
               <div className="epf1b-btn">Politics</div>
               <div className="epf1b-btn">sports </div>
               <div className="epf1b-btn">cinema</div>
               <div className="epf1b-btn">weather</div>
               <div className="epf1b-btn">Astrology</div>
               <div className="epf1b-btn">Kids</div>
           </div>

           <div className="ep-fl1-news-cont">
               <div className="ep-f1nc-n">
                     <div className="epf1ncn-img"><img src={bcs}  /></div>
                     <div className="epf1ncn-subc">
                        <div className="epf1ncn-header">சென்னை விமான நிலையத்தில் பாதுகாப்பு சோதனை தீவிரம்</div>
                       <div className="epf1ncn-time">5 hrs ago</div>
                     </div>
               </div>
           </div>

        </div>
        <div className="ep-ed-cont">

          

          {/* <PerfectSlider
          items={sampleItems}
          containerType="NewsContainer7"
           CONTAINER_MAP={CONTAINER_MAP}
          autoSlideInterval={5000}
          direction="left"
          showControls={true}
          showIndicators={true}
          pauseOnHover={true}
        /> */}
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>

      <NewsContainer7 image={sampleImage} headline={sampleHeadline}  time={sampleTime} />
      <NewsContainer8 image={sampleImage} headline={sampleHeadline}  time={sampleTime} />
 <br />

      <NewsContainer3 image={sampleImage} content={sampleContent} time={sampleTime}/>
      <NewsContainer4 image={sampleImage} content={sampleContent} time={sampleTime} />
   <br />    
      <NewsContainer5 image={sampleImage} headline={sampleHeadline} time={sampleTime} />
      <NewsContainer6 image={sampleImage} headline={sampleHeadline} time={sampleTime} />
 <br />

 <br />
      <NewsContainer21 image={sampleImage} headline={sampleHeadline} content={sampleContent} time={sampleTime} />
      <NewsContainer22 image={sampleImage} headline={sampleHeadline} content={sampleContent} time={sampleTime} />
 <br />

      <NewsContainer1            image={sampleImage} headline={sampleHeadline} content={sampleContent} time={sampleTime} />
      <NewsContainer2            image={sampleImage} headline={sampleHeadline} content={sampleContent} time={sampleTime} />
 <br />

bg v1 and v2
      <BigNewsContainer1V1       image={sampleImage} headline={sampleHeadline} content={sampleContent} time={sampleTime} />
      <BigNewsContainer1V2       image={sampleImage} headline={sampleHeadline} content={sampleContent} time={sampleTime} />
      <BigNewsContainer1V3       image={sampleImage} headline={sampleHeadline} content={sampleContent} time={sampleTime} />

<br />      
      <BigNewsContainer2V1         image={sampleImage} headline={sampleHeadline} content={sampleContent} time={sampleTime} />
      <BigNewsContainer2V2         image={sampleImage} headline={sampleHeadline} content={sampleContent} time={sampleTime} />
<br />
      <BigNewsContainer5V1         image={sampleImage} headline={sampleHeadline} content={sampleContent} time={sampleTime} />
      <BigNewsContainer5V2         image={sampleImage} headline={sampleHeadline} content={sampleContent} time={sampleTime} />
<br/>

      <BigNewsContainer3V1       image={sampleImage} headline={sampleHeadline} content={sampleContent} time={sampleTime} />
      <BigNewsContainer3V2       image={sampleImage} headline={sampleHeadline} content={sampleContent} time={sampleTime} />
      <BigNewsContainer3V3       image={sampleImage} headline={sampleHeadline} content={sampleContent} time={sampleTime} />

    <br />
      <BigNewsContainer4V1       image={sampleImage} headline={sampleHeadline} time={sampleTime} />
      <BigNewsContainer4V2       image={sampleImage} headline={sampleHeadline} time={sampleTime} />

    </div>
</div>
      </div>
    </div>
  );
}
{/* <div>
               <div style={{display: "flex", gap: "5px"}}>
            <div className="ep-nm-news-8">

                <div className="ep-nm8-sbc">
                  <div className="epnn8-hdln">
                    பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும்
                    என
                  </div>
                </div>
                                <div className="epnn8-img">
                  <img src={jwt} alt="" />
                </div>
             </div> 
               <div className="ep-nm-news-7">
                <div className="epnn7-img">
                  <img src={jwt} alt="" />
                </div>
                <div className="ep-nm7-sbc">
                  <div className="epnn7-hdln">
                    பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும்
                    என
                  </div>
                </div>
              </div> 

               </div>
              <div className="ep-nm-news-3">
                <div className="epnn3-img">
                  <img src={jwt} alt="" />
                </div>
                <div className="ep-nm3-sbc">
                  <div className="epnn3-onln">
                    பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும்
                    என,பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும்
                    என பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும்
                    என,பல மாவட்டங்களில் இன்று லேசான முதல் மிதமா ன மழை பதிவாகும்
                    என பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும்
                    என,பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும்
                    என
                  </div>
                </div>
              </div>
              <div className="ep-nm-news-4">
                <div className="ep-nm4-sbc">
                  <div className="epnn4-onln">
                    பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும்
                    என,பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும்
                  </div>
                   <div className="epn-tm">5 hrs ago</div>
                </div>
                <div className="epnn4-img">
                  <img src={jwt} alt="" />
                </div>
              </div>
            </div>
            <div>
              <div className="ep-nm-news-5">
                <div className="epnn5-img">
                  <img src={jwt} alt="" />
                </div>
                <div className="ep-nm5-sbc">
                  <div className="epbn5-hdln">
                    தமிழகத்தில் மிதமான மிதமான மிதமான மழை
                  </div>
                   <div className="epn-tm">5 hrs ago</div>
                </div>
              </div>
              <div className="ep-nm-news-6">
                <div className="ep-nm6-sbc">
                  <div className="epbn6-hdln">
                    தமிழகத்தில் மிதமான மிதமான மிதமான மழை
                  </div>
                   <div className="epn-tm">5 hrs ago</div>
                </div>
                <div className="epnn6-img">
                  <img src={jwt} alt="" />
                </div>
              </div>
            </div>
            <div>
              <div className="ep-nm2-news-1">
                <div className="ep-nm21-sbc">
                  <div className="epbn21-hdln">
                    தமிழகத்தில் மிதமான மிதமான மிதமான மழை
                  </div>
                  <div className="epnn21-onln">
                    பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும்
                    என,பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும்
                    என பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும்
                    என,பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும்
                    என
                  </div>
                   <div className="epn-tm">5 hrs ago</div>
                </div>
                <div className="epnn21-img">
                  <img src={jwt} alt="" />
                </div>
              </div>
              <div className="ep-nm2-news-2">
                  <div className="epbn22-hdln">
                    தமிழகத்தில் மிதமான மிதமான மிதமான மிதமான மிதமான மழை
                  </div>
                <div className="ep-nm22-sbc">

                 <div style={{display: "flex",flexDirection: "column", gap: "2px"}}>
                                    <div className="epnn22-onln">
                    பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும்
                    என,பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும்

                  </div>
                   <div className="epn-tm">5 hrs ago</div>
                 </div>
                    <div className="epnn22-img">
                  <img src={jwt} alt="" />
                </div>
                </div>

              </div>
              <div className="ep-nm2-news-3">
                  <div className="epbn23-hdln">
                    தமிழகத்தில் மிதமான மிதமான மிதமான மிதமான மிதமான மழை
                  </div>
                <div className="ep-nm23-sbc">
                                  <div className="epnn23-img">
                  <img src={jwt} alt="" />
                </div>
                <div style={{display: "flex",flexDirection: "column", gap: "2px"}}>
                  <div className="epnn23-onln">
                    பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும்
                    என,பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும்
                  </div>
                  <div className="epn-tm">5 hrs ago</div>
                </div>

                </div>

              </div>
            </div>
         

          <div className="ep-nm-news-1">
            <div className="epnn1-img">
              <img src={jwt} alt="" />
            </div>
            <div className="ep-nm1-sbc">
              <div className="epnn1-hdln">
                தமிழகத்தில் மிதமான மிதமான மிதமான மழை
              </div>
              <div className="epnn1-onln">
                பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என,பல
                மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என பல
                மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என,பல
                மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என
              </div>
                                 <div className="epn-tm">5 hrs ago</div>
            </div>
          </div>
          <div className="ep-bg-news-2">
            <div className="epbn2-img">
              <img src={bcs} alt="" />
            </div>

            <div style={{ width: "400px" }}>
              <div className="epbn2-hdln">
                தமிழகத்தில் மிதமான மிதமான மிதமான மழை
              </div>
              <div className="epbn2-onln">
                பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என,பல
                மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என பல
                மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என,பல
                மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என
              </div>
                                 <div className="epn-tm">5 hrs ago</div>
            </div>
          </div>
          <div className="ep-nm-news-2">
            <div className="ep-nm2-sbc">
              <div className="epnn2-hdln">
                தமிழகத்தில் மிதமான மிதமான மிதமான மழை
              </div>
              <div className="epnn2-onln">
                பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என,பல
                மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என பல
                மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என,பல
                மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என
              </div>
                                 <div className="epn-tm">5 hrs ago</div>
            </div>
            <div className="epnn2-img">
              <img src={jwt} alt="" />
            </div>
          </div>

          <div className="ep-bg-news-1">
            <div className="epbn1-img">
              <img src={bcs} alt="" />
            </div>
            <div className="epbn1-hdln">
              தமிழகத்தில் மிதமான மிதமான மிதமான மழை
            </div>
            <div className="epbn1-onln">
              பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என,பல
              மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என பல
              மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என,பல
              மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என
            </div>
                               <div className="epn-tm">5 hrs ago</div>
          </div>
          <div className="ep-bg-news-1">
            <div className="epbn1-hdln">
              தமிழகத்தில் மிதமான மிதமான மிதமான மழை
            </div>
            <div className="epbn1-img">
              <img src={bcs} alt="" />
            </div>
            <div className="epbn1-onln">
              பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என,பல
              மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என பல
              மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என,பல
              மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என
            </div>
                               <div className="epn-tm">5 hrs ago</div>
          </div>
          <div className="ep-bg-news-2">
            <div style={{ width: "400px" }}>
              <div className="epbn2-hdln">
                தமிழகத்தில் மிதமான மிதமான மிதமான மழை
              </div>
              <div className="epbn2-onln">
                பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என,பல
                மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என பல
                மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என,பல
                மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என
              </div>
                                 <div className="epn-tm">5 hrs ago</div>
            </div>
            <div className="epbn2-img">
              <img src={bcs} alt="" />
            </div>
          </div>

          <div className="ep-bg-news-3">
            <div className="epbn3-hdln">
              தமிழகத்தில் மிதமான மிதமான மிதமான மழை
            </div>

            <div className="epbn3-img">
              <img src={bcs} alt="" />
            </div>
            <div className="epbn3-onln">
              பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என,பல
              மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என பல
              மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என,பல
              மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என
            </div>
                               <div className="epn-tm">5 hrs ago</div>
          </div>
          <div className="ep-bg-news-3">
            <div className="epbn3-img">
              <img src={bcs} alt="" />
            </div>
            <div className="epbn3-hdln">
              தமிழகத்தில் மிதமான மிதமான மிதமான மழை
            </div>

            <div className="epbn3-onln">
              பல மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என,பல
              மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என பல
              மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என,பல
              மாவட்டங்களில் இன்று லேசான முதல் மிதமான மழை பதிவாகும் என
            </div>
                               <div className="epn-tm">5 hrs ago</div>
          </div>

          <div className="ep-bg-news-4">
            <div className="epbn4-img">
              <img src={bcs} alt="" />
            </div>
            <div className="epbn4-hdln">
              தமிழகத்தில் மிதமான மிதமான மிதமான மழை
            </div>
                               <div className="epn-tm">5 hrs ago</div>
          </div>
          <div className="ep-bg-news-4">
            <div className="epbn4-hdln">
              தமிழகத்தில் மிதமான மிதமான மிதமான மழை
            </div>
                               <div className="epn-tm">5 hrs ago</div>
            <div className="epbn4-img">
              <img src={bcs} alt="" />
            </div>
          </div> */}
