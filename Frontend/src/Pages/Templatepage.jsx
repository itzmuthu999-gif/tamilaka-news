
import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import { IoSearchSharp } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiWorld } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiMiniMoon } from "react-icons/hi2";
import newsimg from "../assets/newsimg.avif";
import Newsform from './Newsform';
import luffy from '../assets/luffy.webp'
import { useSelector, useDispatch } from 'react-redux';


import { Rnd } from "react-rnd";
import { FaCheck, FaEdit, FaTimes } from "react-icons/fa";
import { saveNews, updateNews, setCurrentNews } from "./Slice/newsformslice.js";
function ParagraphBox({ id, onDelete, onUpdate, initialContent }) {
  const [text, setText] = useState(initialContent || "");
  const [editing, setEditing] = useState(true);

  useEffect(() => {
    onUpdate(id, { content: text });
  }, [text]);

  return (
    <Rnd
      bounds="parent"
      default={{ x: 50, y: 50, width: 550, height: "auto" }}
      style={{
        border: "2px dashed #555",
        background: "#fff",
        borderRadius: "8px",
        padding: "8px",
        position: "relative"
      }}
    >

      {/* ❗ DELETE BUTTON — now double click */}
      <FaTimes
        color="red"
        style={{
          position: "absolute",
          top: 35,
          right: 5,
          cursor: "pointer",
          fontSize: "18px"
        }}
        onDoubleClick={() => onDelete(id)}
      />

      {editing ? (
        <div style={{ display: "flex", gap: "6px" }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text..."
            style={{ width: "100%", height: "200px" }}
          />
          <FaCheck color="green" style={{cursor: "pointer"}}  onClick={() => setEditing(false)} />
        </div>
      ) : (
        <div>
          <p style={{ whiteSpace: "pre-wrap" }}>{text}</p>
          <FaEdit color="blue" onClick={() => setEditing(true)} />
        </div>
      )}
    </Rnd>
  );
}

function ImageBox({ id, onDelete, onUpdate, initialContent }) {
  const [image, setImage] = useState(initialContent || null);
  const [editing, setEditing] = useState(!initialContent);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
      setEditing(false);
      onUpdate(id, { content: url });
    }
  };

  return (
    <Rnd
      bounds="parent"
      default={{ x: 100, y: 100, width: 250, height: "auto" }}
      minWidth={150}
      minHeight={100}
      style={{
        border: "2px dashed #555",
        background: "#fdfdfd",
        borderRadius: "8px",
        padding: "8px",
        position: "relative"
      }}
    >
      {/* ❗ ALWAYS VISIBLE DELETE BUTTON */}
      <FaTimes
        color="red"
        style={{
          position: "absolute",
          top: 5,
          right: 5,
          cursor: "pointer",
          fontSize: "18px",
          zIndex: 99
        }}
        onDoubleClick={() => onDelete(id)}
      />

      {/* EDIT OR PREVIEW MODE */}
      {editing ? (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          <img
            src={image}
            alt="uploaded"
            style={{ width: "100%", borderRadius: "8px" }}
          />

          {/* EDIT BUTTON (kept as before) */}
          <div style={{ position: "absolute", top: 5, right: 30 }}>
            <FaEdit
              style={{ cursor: "pointer" }}
              color="blue"
              onClick={() => setEditing(true)}
            />
          </div>
        </div>
      )}
    </Rnd>
  );
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

function Line({ width = "100%", height = "1px", color = "#ffb1ffff", orientation = "horizontal", margin = "10px 0" }) {
  const style = { backgroundColor: color, margin, width: orientation === "horizontal" ? width : height, height: orientation === "horizontal" ? height : width };
  return <div style={style}></div>;
}

export default function Templatepage() {
  const dispatch = useDispatch();
  const currentNews = useSelector((state) => state.newsform.currentNews);
  const [boxes, setBoxes] = useState([]);
  const [divHeight, setDivHeight] = useState(1000);
  const [formState, setFormState] = useState(null);

  useEffect(() => {
    if (currentNews) {
      setFormState(currentNews.data || null);
      setBoxes(currentNews.fullContent ? JSON.parse(JSON.stringify(currentNews.fullContent)) : []);
    }
  }, [currentNews]);

  const addBox = (type) => {
    const newBox = { id: Date.now(), type, x: 100, y: 100, width: 200, height: 150, content: "" };
    setBoxes(prev => [...prev, newBox]);
  };

  const removeBox = (id) => setBoxes(prev => prev.filter(b => b.id !== id));

  const updateBoxContent = (id, updated) => {
    setBoxes(prev => prev.map(b => b.id === id ? { ...b, ...updated } : b));
  };

  const handleInputChange = (event) => setDivHeight(Number(event.target.value));
  const handleIncreaseClick = () => setDivHeight(h => h + 10);
  const handleDecreaseClick = () => setDivHeight(h => Math.max(10, h - 10));

  const handleFormChange = (data) => {
    setFormState(data);
  };

  const saveThisNews = () => {
    // if editing an existing news (currentNews exists) -> update
    if (currentNews && currentNews.id) {
      dispatch(updateNews({ id: currentNews.id, updatedNews: { data: formState, fullContent: boxes } }));
      alert('News updated');
      dispatch(setCurrentNews(null));
    } else {
      // create new
      dispatch(saveNews({ data: formState || {}, fullContent: boxes }));
      alert('News saved');
    }
    // clear local state after save
    setFormState({ headline: "", oneLiner: "", zonal: "", thumbnail: null, images: [] });
    setBoxes([]);
  };

  const formNewsData = formState;

  return (
   <div>
       <Newsform initialData={currentNews} onChange={handleFormChange} onSave={() => saveThisNews()} addbx={addBox} rmvbx={removeBox} divHeight={divHeight} handleDecreaseClick={handleDecreaseClick} handleIncreaseClick={handleIncreaseClick} handleInputChange={handleInputChange} />
       <div className='navcon1'>
       <div className='navcon2'>
           <div className="nav-c1">
               <div className="nav-c1-date">வியாக்ழன் அக்டோபர் 30 2025</div>
                <div  className='nav-c1-logo'><img src={logo} alt="alt"/></div>
                <div className="nav-c1-links">
                    <div><IoSearchSharp /></div>
                    <div><IoMdNotificationsOutline /></div>
                    <div><BiWorld /></div>
                </div>
           </div>
           <div className='nav-c2-line'></div>
           <div className="nav-c3">
           <div className="nav-c3-ham"><GiHamburgerMenu /></div>
                 <div className="nav-c3-sections">
                    <div>அரசியல்</div>
                    <div>உலகம்</div>
                    <div>இந்தியா</div>
                    <div>தமிழக நியூஸ்</div>
                    <div>மாவட்டம்</div>
                    <div>விளையாட்டு</div>
                    <div>ட்ரெண்டிங்</div>
                 </div>
                <div className="nav-c3-dm"><HiMiniMoon /></div>
           </div>
       </div>
       </div>
              <div className="break-news">
           <p>சென்னை விமான நிலையத்தில் பாதுகாப்பு சோதனை தீவிரம் | டெல்லியில் மழை வெள்ளம் – போக்குவரத்து பாதிப்பு | பெங்களூருவில் பெரிய IT நிறுவனத்தில் திடீர் பணிநீக்கம் | தமிழகத்தில் இன்று மின்தடை அறிவிப்பு | கோவை அருகே வெடிகுண்டு பரபரப்பு – போலீஸ் விசாரணை தொடக்கம் | பங்குச்சந்தை சரிவு – முதலீட்டாளர்கள் அதிர்ச்சி</p>
       </div>
       <div className="news-m-cont">
        <div className="news-m-cont2">
       <div className="ele-news">
            <div className="ele-const-news">
                <div className="ele-const-zonar">{formNewsData?.zonal || "No zonal data yet"}</div>
                <div className="ele-con-ne-head">{ formNewsData?.headline || "The Head line is comming here..."}</div>
                <div className="ele-con-ne-oneliner">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {formNewsData?.oneLiner || "one liner is comming soon..."}</div>
                <div className="ele-con-tmbnl">
  {(() => {
    const thumb = formNewsData?.thumbnail;
    let finalThumb = null;

    if (thumb) {

      // Case 1: string URL or Base64
      if (typeof thumb === "string") {
        finalThumb = thumb;
      }

      // Case 2: File object
      else if (thumb instanceof File) {
        finalThumb = URL.createObjectURL(thumb);
      }

      // Case 3: invalid (object reloaded from local storage)
      else {
        finalThumb = null;
      }
    }

    return finalThumb ? (
      <img src={finalThumb} alt="uploaded thumbnail" />
    ) : (
      <img src={luffy} alt="default" />
    );
  })()}
</div>

            </div>
            <div className="el-full-news" style={{height: `${divHeight}px`}}>

        {boxes.map((box) => box.type === "paragraph" ? (
            <ParagraphBox key={box.id} id={box.id} onDelete={removeBox} onUpdate={updateBoxContent} initialContent={box.content} />
          ) : (
            <ImageBox key={box.id} id={box.id} onDelete={removeBox} onUpdate={updateBoxContent} initialContent={box.content} />
          ))}

            </div>
       </div>
       <div className="hr-line"></div>
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
       </div>
      </div>
      </div>
  )
}

