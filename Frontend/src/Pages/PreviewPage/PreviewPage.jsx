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

  const [isMobile, setIsMobile] = useState(window.innerWidth > 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentNews = allNews.find((news) => news.id === Number(id));
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

            <div
              className="main-news-sbcon1"
              style={{
                position: "relative",
                overflow: "visible",
                display: "block",
                border: "none",
                fontSize: `${fontSize}%`, // Apply font size here too
              }}
            >
              {fullContent
                .filter(box => box.type === "paragraph")
                .map(box => (
                  <ParagraphResponsive key={box.id} box={box} />
                ))}

              {fullContent
                .filter(box => box.type === "image")
                .map(box => (
                  <ImageResponsive key={box.id} box={box} />
                ))}
            </div>
            
            <div className="comment-sec">
              <CommentSection 
                newsId={currentNews.id} 
                comments={currentNews.comments || []} 
              />
            </div>  
          </div>

          {MLayout === 1 && isMobile && <Line direction="V" length="1250px" thickness="1px" color="#e80d8c" />}
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
    <p className="news-paragraph">
      {box.content}
    </p>
  );
}

function ImageResponsive({ box }) {
  return (
    <div className="news-image-wrapper">
      <img src={box.content} alt="news" />
    </div>
  );
}