import React, { useState } from "react";
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
import BigNewsContainer4 from "../Newspaper/Containers_/BigContainer4";
import CommentSection from "./CommentSection";
import Navbarr from "../Newspaper/Components/Navbarr";
import "./Previewpge.scss";

import timeFun from "../Newspaper/Containers_/timeFun";
import AdBox from '../Newspaper/Components/AdBox';
import Newsheader from '../Newspaper/Components/Newsheader';
import NorContainer5 from "../Newspaper/Containers_/NorContainer5";
import Line from "../Newspaper/Components/Line";
import { useEffect } from "react";
import { RxFontSize } from "react-icons/rx";
import { BiFontSize } from "react-icons/bi";
import {
  FaFacebookF,
  FaWhatsapp,
  FaTelegramPlane,
  FaEnvelope,
  FaLink,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import BigNewsContainer4B from "../Newspaper/Containers_/BigContainer4B";

export default function PreviewPage() {
  const { id } = useParams();
  const allNews = useSelector((state) => state.newsform.allNews);
  
  // Font size state - starts at 100% (base size)
  const [fontSize, setFontSize] = useState(100);
  
  const icons = [
    { icon: <FaWhatsapp />, href: "#" },
    { icon: <FaFacebookF />, href: "#" },
    { icon: <FaXTwitter />, href: "#" },
    { icon: <FaLink />, href: "#" },
  ];
  
  const styles = {
    container: {
      display: "flex",
      gap: "12px",
      margin: "15px 0px",
    },
    icon: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      border: "1px solid #000",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#000",
      fontSize: "18px",
      textDecoration: "none",
      transition: "0.2s ease",
    },
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentNews = allNews.find((news) => news.id === Number(id));
  const MLayout = useSelector((state) => state.newsform.MLayout);
  
  if (!currentNews) 
    return <div style={{ padding: 40 }}>No news selected for preview.</div>;

  const { data } = currentNews;

  const thumb = (() => {
    if (!data?.thumbnail) return { url: luffy, isVideo: false };

    let url = null;
    let isVideo = false;

    if (typeof data.thumbnail === "string") {
      url = data.thumbnail;
      isVideo =
        data.thumbnail.includes(".mp4") ||
        data.thumbnail.includes(".webm") ||
        data.thumbnail.includes(".ogg") ||
        data.thumbnail.startsWith("data:video/");
    } else if (data.thumbnail instanceof File) {
      url = URL.createObjectURL(data.thumbnail);
      isVideo = data.thumbnail.type?.startsWith("video/");
    }

    return {
      url: url || luffy,
      isVideo,
    };
  })();

  // Font size control functions
  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 10, 150)); // Max 150%
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 10, 70)); // Min 70%
  };

  return (
    <div className="prepge-main">
      <div className="pp-nav-ov">
        <Navbarr/>
      </div>
      <div>
        <br />
      </div>

      <div className="Prevpge-main-con1">
        <div className="premain-con1-sub">
          <div className="main-news-cont">
            <div className="main-news-sbcon1" style={{ fontSize: `${fontSize}%` }}>
              <div className="mannsw-sc-head">{data.headline}</div>
              <div className="mannsw-sc-oneliner">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data.oneLiner}
              </div>
              {!currentNews.hiddenElements?.thumbnail && (
                <div className="mannsw-sc-tmbnl">
                  {thumb.isVideo ? (
                    <video
                      src={thumb.url}
                      controls
                      controlsList="nodownload"
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
              <div className="mannsw-sc-time">
                {timeFun(currentNews.time) || "No date available"}
              </div>
              <div className="mannsw-lnksz">
                <div style={styles.container}>
                  {icons.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      style={styles.icon}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.icon}
                    </a>
                  ))}
                </div>
                <div className="mannsw-ls-c2">
                  <div 
                    className="mannswls-c11-dec mannswbtn" 
                    onClick={decreaseFontSize}
                    style={{ cursor: 'pointer' }}
                  >
                    <RxFontSize />
                  </div>
                  <div 
                    className="mannswls-c11-inc mannswbtn" 
                    onClick={increaseFontSize}
                    style={{ cursor: 'pointer' }}
                  >
                    <BiFontSize />
                  </div>
                </div>
              </div>
            </div>

            {/* Render containers with responsive design */}
            <div
              className="main-news-content"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                fontSize: `${fontSize}%`,
              }}
            >
              {currentNews.containerOverlays && currentNews.containerOverlays.length > 0 ? (
                currentNews.containerOverlays.map((container) => (
                  <ContainerView 
                    key={container.id} 
                    container={container} 
                    isMobile={isMobile}
                  />
                ))
              ) : (
                <div style={{ padding: "20px", color: "#999", textAlign: "center" }}>
                  No content available
                </div>
              )}
            </div>
            
            <div className="comment-sec">
              <CommentSection 
                newsId={currentNews.id} 
                comments={currentNews.comments || []} 
              />
            </div>  
          </div>

          {MLayout === 1 && !isMobile && <Line direction="V" length="1250px" thickness="1px" color="#e80d8c" />}
          {MLayout === 1 && <Melumnews />}
        </div>
      </div>
       <div className="mannsw-ns-header"><div className="mannswns-nd-o2"><Newsheader name={"Top news"} /></div></div>
      <div className="footer-overlay">
        
        <div className="npmc-c3">
          <AutoScrollContainer gap={0} autoScrollDelay={10000} autoTranslateX={310} manualTranslateX={310}>
            <BigNewsContainer4B  imgHeight={200}  imgWidth={300}/>
            <BigNewsContainer4B  imgHeight={200}  imgWidth={300}/>
            <BigNewsContainer4B  imgHeight={200}  imgWidth={300}/>
            <BigNewsContainer4B  imgHeight={200}  imgWidth={300}/>
            <BigNewsContainer4B  imgHeight={200}  imgWidth={300}/>
            <BigNewsContainer4B  imgHeight={200}  imgWidth={300}/>
          </AutoScrollContainer>
        </div>
        <Footer/>
      </div>
    </div>
  );
}

// New component to render containers responsively
function ContainerView({ container, isMobile }) {
  // The container structure from Redux is: { id, settings: { columns, gap, padding, boxes } }
  const settings = container.settings || container; // Handle both structures
  
  // Adjust columns for mobile - if more than 1 column, make it 1 on mobile
  const responsiveColumns = isMobile && settings.columns > 1 ? 1 : settings.columns;
  
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${responsiveColumns}, 1fr)`,
        gap: `${settings.gap}px`,
        padding: `${settings.padding}px`,
        background: "rgba(102, 126, 234, 0.02)",
        borderRadius: "8px",
        border: "1px solid rgba(102, 126, 234, 0.1)",
      }}
    >
      {settings.boxes && settings.boxes.length > 0 ? (
        settings.boxes.map((box) => (
          <div key={box.id}>
            {box.type === "paragraph" ? (
              <ParagraphResponsive box={box} />
            ) : box.type === "image" ? (
              <ImageResponsive box={box} />
            ) : null}
          </div>
        ))
      ) : (
        <div style={{ 
          gridColumn: `span ${responsiveColumns}`, 
          textAlign: "center", 
          color: "#999", 
          padding: "20px" 
        }}>
          No content in this container
        </div>
      )}
    </div>
  );
}

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
      <div className="mens-side-news">
        <div>
          <AdvertisementBox width="100%" height="100px" />
        </div>
        <div className="mens-morenews">
          <Newsheader name={"Top news"} />
        </div>
        <div className="mens-in-cont">
          <NorContainer5/>
          <Line direction="H" length="100%" thickness="0.5px" color="#b6b6b6ff" />
          <NorContainer5/>
          <Line direction="H" length="100%" thickness="0.5px" color="#b6b6b6ff" />
          <NorContainer5/>
          <Line direction="H" length="100%" thickness="0.5px" color="#b6b6b6ff" />
          <NorContainer5/>
          <Line direction="H" length="100%" thickness="0.5px" color="#b6b6b6ff" />
          <NorContainer5/>
          <Line direction="H" length="100%" thickness="0.5px" color="#b6b6b6ff" />
        </div>
      </div>
    </>
  );
}

function ParagraphResponsive({ box }) {
  return (
    <div
      style={{
        padding: "12px",
        background: "#fff",
        borderRadius: "6px",
        border: "1px solid #e0e0e0",
      }}
    >
      <p 
        style={{ 
          whiteSpace: "pre-wrap",
          fontSize: "17px",
          lineHeight: "1.6",
          margin: 0,
          color: "#333",
        }}
      >
        {box.content}
      </p>
    </div>
  );
}

function ImageResponsive({ box }) {
  return (
    <div
      style={{
        width: "100%",
        borderRadius: "6px",
        overflow: "hidden",
        border: "1px solid #e0e0e0",
      }}
    >
      <img 
        src={box.content} 
        alt="news" 
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          objectFit: "cover",
        }}
      />
    </div>
  );
}