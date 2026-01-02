import React from "react";
import { useSelector } from "react-redux";

import luffy from "../../assets/luffy.webp";
import newsimg from "../../assets/newsimg.avif";
import { IoSearchSharp } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiWorld } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiMiniMoon } from "react-icons/hi2";
import { useParams } from "react-router-dom";
import Footer from "../Newspaper/Components/Footer";
import AutoScrollContainer from "../Newspaper/Components/AutoScrollContainer";
import BigNewsContainer4A from "../Newspaper/Containers_/BigContainer4A";
import CommentSection from "./CommentSection";
import Navbarr from "../Newspaper/Components/Navbarr";
import "./Previewpge.scss";


export default function PreviewPage() {
  const { id } = useParams();
const allNews = useSelector((state) => state.newsform.allNews);

const currentNews = allNews.find(
  (news) => news.id === Number(id)
);

  const MLayout = useSelector((state) => state.newsform.MLayout);
  if (!currentNews) 
    return <div style={{ padding: 40 }}>No news selected for preview.</div>;
  

  const { data, fullContent } = currentNews;

  const thumb = (() => {
    if (!data?.thumbnail) return { url: luffy, isVideo: false };

    let url = null;
    let isVideo = false;

    if (typeof data.thumbnail === "string") {
      url = data.thumbnail;
      isVideo =
        data.thumbnail.includes(".mp4") ||
        data.thumbnail.includes(".webm") ||
        data.thumbnail.includes(".ogg");
    } else if (data.thumbnail instanceof File) {
      url = URL.createObjectURL(data.thumbnail);
      isVideo = data.thumbnail.type?.startsWith("video/");
    }

    return {
      url: url || luffy,
      isVideo,
    };
  })();

  return (
    <div className="prepge-main">
      <style>
        {`
  .ele-news {
    overflow: visible !important;
    position: relative;
  }
  .el-full-news {
    overflow: visible !important;
    position: relative;
  }
  .news-m-cont2 {
    display: flex !important; /* remove flex clipping effect */
  }
`}
      </style>

      {/* ------------------------------- NAVBAR ------------------------------- */}
       <div className="pp-nav-ov">
        <Navbarr/>
       </div>
       <div>

        <br /><br /><br />
       </div>


      {/* ------------------------------- MAIN NEWS ------------------------------ */}
      <div className="news-m-cont">
        <div className="news-m-cont2">
          <div className="ele-news2">
            <div className="ele-const-news">
              {!currentNews.hiddenElements?.zonar && (
                <div className="ele-const-zonar">{data.zonal}</div>
              )}
              {!currentNews.hiddenElements?.author && (
                <div className="ele-const-author">
                  {" "}
                  By: {data.author || "Unknown Author"}{" "}
                </div>
              )}
              <div className="ele-const-time">
                {currentNews.time || "No date available"}
              </div>
              <div className="ele-con-ne-head">{data.headline}</div>
              <div className="ele-con-ne-oneliner">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data.oneLiner}
              </div>
              {!currentNews.hiddenElements?.thumbnail && (
                <div className="ele-con-tmbnl">
                  {thumb.isVideo ? (
                    <video
                      src={thumb.url}
                      controls
                      controlsList="nodownload" // Optional: prevent download
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img src={thumb.url} alt="thumbnail" />
                  )}
                </div>
              )}
            </div>

            {/* ------------------------- FULL NEWS AREA ------------------------- */}
            <div
              className="el-full-news"
              style={{
                height: `${currentNews.divHeight || 900}px`,
                position: "relative",
                overflow: "visible", // IMPORTANT FIX
                display: "block", // IMPORTANT FIX
                border: "none"
              }}
            >
              {fullContent.map((box) =>
                box.type === "paragraph" ? (
                  <ParagraphStatic key={box.id} box={box} />
                ) : (
                  <ImageStatic key={box.id} box={box} />
                )
              )}
            </div>
          </div>

          {/* ------------------------- SIDE NEWS (LAYOUT 1) ------------------------ */}
          {MLayout === 1 && <div className="hr-line"></div>}
          {MLayout === 1 && <Melumnews />}
        </div>
        
      </div>
      <div className="comment-sec">
        <CommentSection 
          newsId={currentNews.id} 
          comments={currentNews.comments || []} 
        />
      </div>

       <div className="footer-overlay"  style={{display: "flex",flexDirection: "column" ,justifyContent: "center", alignItems: "center", width: "1500px"}}>
                        <div
            className="npmc-c3"
            style={{
              width: "1250px",
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
        <Footer/>
       </div>
      
    </div>
  );
}

/* ----------------------------- STATIC PARAGRAPH ---------------------------- */
function ParagraphStatic({ box }) {
  return (
    <div
      style={{
        position: "absolute",
        top: box.y,
        left: box.x,
        width: box.width,
        padding: "8px",
        whiteSpace: "pre-wrap",
        fontSize: "17px",
        lineHeight: "1.4",
      }}
    >
      {box.content}
    </div>
  );
}

/* ------------------------------- STATIC IMAGE ------------------------------ */
function ImageStatic({ box }) {
  return (
    <img
      src={box.content}
      style={{
        position: "absolute",
        top: box.y,
        left: box.x,
        width: box.width,
        height: box.height,
        objectFit: "cover",
        borderRadius: "6px",
      }}
      alt="news"
    />
  );
}

/* ------------------------------ SIDE NEWS CARD ----------------------------- */
function NewsCard({
  title = "Sample title",
  image = newsimg,
  time = "5hrs ago",
}) {
  return (
    <div style={{ width: 400, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ flex: 1 }}>{title}</div>
        <img
          src={image}
          style={{ width: 120, height: 80, objectFit: "cover" }}
          alt="news"
        />
      </div>
      <div style={{ fontSize: 10, color: "gray" }}>{time}</div>
      <div style={{ height: 1, backgroundColor: "#ffb8e5ff" }}></div>
    </div>
  );
}

function Line({
  width = "100%",
  height = "1px",
  color = "#ffb1ffff",
  orientation = "horizontal",
  margin = "10px 0",
}) {
  const style = {
    backgroundColor: color,
    margin,
    width: orientation === "horizontal" ? width : height,
    height: orientation === "horizontal" ? height : width,
  };
  return <div style={style}></div>;
}

/* ---------------------------- SIDE ABOUT NEWS ----------------------------- */
function AdvertisementBox({ width = "300px", height = "250px" }) {
  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#e0e0e0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#555",
        fontSize: "14px",
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        borderRadius: "4px",
      }}
    >
      Advertisement here
    </div>
  );
}

function Melumnews() {
  return (
    <>
      <div className="side-news">
        <div>
          <AdvertisementBox width="100%" height="100px" />
        </div>
        <div className="morenews">
          <div className="mn-txt">மேலும் செய்திகள்</div>
          <Line height="2px" width="100%" />
        </div>
        <div className="mrn-in-cont">
          <NewsCard
            image={newsimg}
            title="பைடன் நிர்வாகம் புதிய குடியேற்றக் கொள்கையை அறிவிப்பு – அதிருப்தியில் எல்லை மாநிலங்கள்"
          />
          <NewsCard
            image={newsimg}
            title="பைடன் நிர்வாகம் புதிய குடியேற்றக் கொள்கையை அறிவிப்பு – அதிருப்தியில் எல்லை மாநிலங்கள்"
          />
          <NewsCard
            image={newsimg}
            title="பைடன் நிர்வாகம் புதிய குடியேற்றக் கொள்கையை அறிவிப்பு – அதிருப்தியில் எல்லை மாநிலங்கள்"
          />
          <NewsCard
            image={newsimg}
            title="பைடன் நிர்வாகம் புதிய குடியேற்றக் கொள்கையை அறிவிப்பு – அதிருப்தியில் எல்லை மாநிலங்கள்"
          />
        </div>
      </div>
    </>
  );
}
