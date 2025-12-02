import React from 'react'
import newsimg from  "../../../assets/newsimg.avif"
export default 
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
function Line({ width = "100%", height = "1px", color = "#ffb1ffff", orientation = "horizontal", margin = "10px 0" }) {
  const style = { backgroundColor: color, margin, width: orientation === "horizontal" ? width : height, height: orientation === "horizontal" ? height : width };
  return <div style={style}></div>;
}




function NewsCard({ title = "Title goes here", image, time = "5hrs ago" }) {
  return (
    <div style={{ width: "400px", display: "flex", flexDirection: "column", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "5px" }}>
        <div style={{ flex: 1, fontSize: "15px", lineHeight: "1.2", margin: 0 }}>{title}</div>
        {image && (
          <img src={image} alt="news thumbnail" style={{ width: "120px", height: "80px", objectFit: "cover", borderRadius: "4px", flexShrink: 0 }} />
        )}
      </div>
      <div>
        <span style={{ color: "gray", fontSize: "10px" }}>{time}</span>
        <div style={{ height: "1px", backgroundColor: "#ffb8e5ff", width: "100%" }}></div>
      </div>
    </div>
  );
}

function AdvertisementBox({ width = "300px", height = "250px" }) {
  return (
    <div style={{ width, height, backgroundColor: "#e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontSize: "14px", fontFamily: "'Helvetica Neue', Arial, sans-serif", borderRadius: "4px" }}>
      Advertisement here
    </div>
  );
}
