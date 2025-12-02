import React from "react";
import { useSelector } from "react-redux";
import logo from "../assets/logo.png";
import luffy from "../assets/luffy.webp";
import newsimg from "../assets/newsimg.avif";
import { IoSearchSharp } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiWorld } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiMiniMoon } from "react-icons/hi2";


export default function PreviewPage() {
  const currentNews = useSelector((state) => state.newsform.currentNews);
  const MLayout = useSelector((state) => state.newsform.MLayout);

  if (!currentNews) {
    return <div style={{ padding: 40 }}>No news selected for preview.</div>;
  }

  const { data, fullContent } = currentNews;

  /* ------------------------- thumbnail handling ------------------------- */
  const thumb = (() => {
    if (!data?.thumbnail) return luffy;
    if (typeof data.thumbnail === "string") return data.thumbnail;
    if (data.thumbnail instanceof File)
      return URL.createObjectURL(data.thumbnail);
    return luffy;
  })();

  return (
    <div>
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
      <div className="navcon1">
        <div className="navcon2">
          <div className="nav-c1">
            <div className="nav-c1-date">வியாழன் அக்டோபர் 30 2025</div>
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

      {/* ---------------------------- BREAKING NEWS ---------------------------- */}
      <div className="break-news">
        <p>
          சென்னை விமான நிலையத்தில் பாதுகாப்பு சோதனை தீவிரம் | டெல்லியில் மழை
          வெள்ளம் – போக்குவரத்து பாதிப்பு | பெங்களூருவில் பெரிய IT நிறுவனத்தில்
          திடீர் பணிநீக்கம் | தமிழகத்தில் இன்று மின்தடை அறிவிப்பு | கோவை
          அருகே வெடிகுண்டு பரபரப்பு – போலீஸ் விசாரணை தொடக்கம் | பங்குச்சந்தை
          சரிவு – முதலீட்டாளர்கள் அதிர்ச்சி
        </p>
      </div>

      {/* ------------------------------- MAIN NEWS ------------------------------ */}
      <div className="news-m-cont">
        <div className="news-m-cont2">
          <div className="ele-news2">
            <div className="ele-const-news">
              <div className="ele-const-zonar">{data.zonal}</div>
              <div className="ele-con-ne-head">{data.headline}</div>
              <div className="ele-con-ne-oneliner">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data.oneLiner}
              </div>

              <div className="ele-con-tmbnl">
                <img src={thumb} alt="thumbnail" />
              </div>
            </div>

            {/* ------------------------- FULL NEWS AREA ------------------------- */}
              <div
                className="el-full-news"
                style={{
                  height: `${currentNews.divHeight || 900}px`,
                  position: "relative",
                  overflow: "visible",        // IMPORTANT FIX
                  display: "block",           // IMPORTANT FIX
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
function NewsCard({ title = "Sample title", image = newsimg, time = "5hrs ago" }) {
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

function Line({ width = "100%", height = "1px", color = "#ffb1ffff", orientation = "horizontal", margin = "10px 0" }) {
  const style = { backgroundColor: color, margin, width: orientation === "horizontal" ? width : height, height: orientation === "horizontal" ? height : width };
  return <div style={style}></div>;
}

/* ---------------------------- SIDE ABOUT NEWS ----------------------------- */
function AdvertisementBox({ width = "300px", height = "250px" }) {
  return (
    <div style={{ width, height, backgroundColor: "#e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontSize: "14px", fontFamily: "'Helvetica Neue', Arial, sans-serif", borderRadius: "4px" }}>
      Advertisement here
    </div>
  );
}



function Melumnews()
{
  return (
    <>
       <div className="side-news">
          <div><AdvertisementBox width='100%' height='100px'/></div>
          <div className="morenews">
            <div className="mn-txt">மேலும் செய்திகள்</div>
            <Line height='2px' width='100%'/>
            </div>
          <div className="mrn-in-cont">
                 <NewsCard image={newsimg} title='பைடன் நிர்வாகம் புதிய குடியேற்றக் கொள்கையை அறிவிப்பு – அதிருப்தியில் எல்லை மாநிலங்கள்'/>
                 <NewsCard image={newsimg} title='பைடன் நிர்வாகம் புதிய குடியேற்றக் கொள்கையை அறிவிப்பு – அதிருப்தியில் எல்லை மாநிலங்கள்'/>
                 <NewsCard image={newsimg} title='பைடன் நிர்வாகம் புதிய குடியேற்றக் கொள்கையை அறிவிப்பு – அதிருப்தியில் எல்லை மாநிலங்கள்'/>
                 <NewsCard image={newsimg} title='பைடன் நிர்வாகம் புதிய குடியேற்றக் கொள்கையை அறிவிப்பு – அதிருப்தியில் எல்லை மாநிலங்கள்'/>
          </div>
       </div>    
    </>

  )
}