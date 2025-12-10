
import React, { useEffect, useState } from 'react'
import logo from "../../assets/logo.png";


import { IoSearchSharp } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiWorld } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiMiniMoon } from "react-icons/hi2";


import luffy from  "../../assets/luffy.webp"
import { useSelector, useDispatch } from 'react-redux';

import { FaTimes } from "react-icons/fa";

import { saveNews, updateNews, setCurrentNews,setLayout  } from "../Slice/newsformslice.js";
import './TemplatePage.scss';

import Newsform from './Newsform.jsx';
import ImageBox from './Components/ImageBox.jsx';
import ParagraphBox from './Components/ParagraphBox.jsx';
import Melumnews from './Components/Melumnews.jsx';


export default function Templatepage() {
  const dispatch = useDispatch();
  const currentNews = useSelector((state) => state.newsform.currentNews);
  const MLayout = useSelector(state => state.newsform.MLayout);

  const [boxes, setBoxes] = useState([]);
  const [divHeight, setDivHeight] = useState(1000);
  const [formState, setFormState] = useState(null);

  // Add this new state
const [hiddenElements, setHiddenElements] = useState({
  thumbnail: false,
  author: false,
  zonar: false
});

useEffect(() => {
  if (currentNews) {
    setFormState(currentNews.data || null);
    setBoxes(currentNews.fullContent ? JSON.parse(JSON.stringify(currentNews.fullContent)) : []);
    setDivHeight(currentNews.divHeight || 1000);
    
    if (currentNews.layout) {
      dispatch(setLayout(currentNews.layout));
    }
    
    // ADD THESE LINES:
    if (currentNews.hiddenElements) {
      setHiddenElements(currentNews.hiddenElements);
    } else {
      setHiddenElements({ thumbnail: false, author: false, zonar: false });
    }
  }
}, [currentNews, dispatch]);
// Add this function
const toggleElementVisibility = (elementName) => {
  setHiddenElements(prev => ({
    ...prev,
    [elementName]: !prev[elementName]
  }));
};

// In Templatepage.jsx
const addBox = (type) => {
  const newBox = { 
    id: Date.now(), 
    type, 
    x: 100, 
    y: 100, 
    width: type === 'paragraph' ? 550 : 250, 
    height: type === 'paragraph' ? 200 : 200, 
    content: "" 
  };
  setBoxes(prev => [...prev, newBox]);
};

  const removeBox = (id) => setBoxes(prev => prev.filter(b => b.id !== id));

const updateBoxContent = (id, updated) => {
  setBoxes(prev => {
    const newArr = [...prev];   // NEW ARRAY (forces re-render)
    const box = newArr.find(b => b.id === id);
    if (box) {
      Object.assign(box, updated);  // MUTATE OBJECT (smooth drag)
    }
    return newArr; 
  });
};


  const handleInputChange = (event) => setDivHeight(Number(event.target.value));
  const handleIncreaseClick = () => setDivHeight(h => h + 10);
  const handleDecreaseClick = () => setDivHeight(h => Math.max(10, h - 10));

  const handleFormChange = (data) => {
    setFormState(data);
  };
const saveThisNews = () => {
  if (currentNews && currentNews.id) {
    // update mode
    dispatch(updateNews({
      id: currentNews.id,
      updatedNews: {
        data: formState,
        fullContent: boxes,
        divHeight: divHeight,
        layout: MLayout , // ADD THIS LINE
          hiddenElements: hiddenElements 
      }
    }));
    alert('News updated');

  } else {
    // create new
    dispatch(saveNews({
      data: formState || {},
      fullContent: boxes,
      divHeight: divHeight,
      layout: MLayout,
       hiddenElements: hiddenElements  
    }));
    alert('News saved');
  }

  dispatch(setCurrentNews(null));
setFormState({ 
  headline: "", 
  oneLiner: "", 
  zonal: "", 
  author: "",  
  thumbnail: null, 
  images: [] 
});
  setBoxes([]);
  setHiddenElements({
    thumbnail: false,
    author: false,
    zonar: false
  });
};

  const formNewsData = formState;

  return (
   <div>
     <style>
      {`
        .hideable-element:hover .hide-btn-hover {
          opacity: 1 !important;
        }
      `}
    </style>
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
  {/* Zonar with close button */}
  {!hiddenElements.zonar && (
    <div 
      className="ele-const-zonar hideable-element" 
      style={{ position: 'relative', display: 'inline-block' }}
      onDoubleClick={() => toggleElementVisibility('zonar')}
    >
      {formNewsData?.zonal || "No zonal data yet"}
      <div className="hide-btn-hover" style={{
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        background: '#ff0059',
        color: 'white',
        borderRadius: '50%',
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '12px',
        opacity: 0,
        transition: 'opacity 0.2s'
      }}>
        <FaTimes />
      </div>
    </div>
  )}
  
  {/* Author with close button */}
  {!hiddenElements.author && (
    <div 
      className="ele-const-author hideable-element" 
      style={{ position: 'relative', display: 'inline-block' }}
      onDoubleClick={() => toggleElementVisibility('author')}
    >
      By: {formNewsData?.author || "Unknown Author"}
      <div className="hide-btn-hover" style={{
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        background: '#ff0059',
        color: 'white',
        borderRadius: '50%',
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '12px',
        opacity: 0,
        transition: 'opacity 0.2s'
      }}>
        <FaTimes />
      </div>
    </div>
  )}
  
  <div className="ele-con-ne-head">{formNewsData?.headline || "The Head line is comming here..."}</div>
  <div className="ele-con-ne-oneliner">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{formNewsData?.oneLiner || "one liner is comming soon..."}</div>
  
  {/* Thumbnail with close button */}
  {!hiddenElements.thumbnail && (
    <div 
      className="ele-con-tmbnl hideable-element" 
      style={{ position: 'relative' }}
      onDoubleClick={() => toggleElementVisibility('thumbnail')}
    >
      <div className="hide-btn-hover" style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        background: '#ff0059',
        color: 'white',
        borderRadius: '50%',
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '14px',
        opacity: 0,
        transition: 'opacity 0.2s',
        zIndex: 10
      }}>
        <FaTimes />
      </div>
      
      {(() => {
        const thumb = formNewsData?.thumbnail;
        let finalThumb = null;
        let isVideo = false;

        if (thumb) {
          if (typeof thumb === "string") {
            finalThumb = thumb;
            isVideo = thumb.includes('.mp4') || thumb.includes('.webm') || thumb.includes('.ogg');
          } else if (thumb instanceof File) {
            finalThumb = URL.createObjectURL(thumb);
            isVideo = thumb.type?.startsWith('video/');
          }
        }

        if (finalThumb && isVideo) {
          return (
            <video
              src={finalThumb}
              controls
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            >
              Your browser does not support the video tag.
            </video>
          );
        }

        return finalThumb ? (
          <img src={finalThumb} alt="uploaded thumbnail" />
        ) : (
          <img src={luffy} alt="default" />
        );
      })()}
    </div>
  )}
</div>



           
  <div className="el-full-news" style={{height: `${divHeight}px`}}>

{boxes.map((box) => box.type === "paragraph" ? (
  <ParagraphBox 
    key={box.id} 
    id={box.id} 
    onDelete={removeBox} 
    onUpdate={updateBoxContent} 
    initialContent={box.content}
    box={box}  // ADD THIS
  />
) : (
  <ImageBox 
    key={box.id} 
    id={box.id} 
    onDelete={removeBox} 
    onUpdate={updateBoxContent} 
    initialContent={box.content}
    box={box}  // ADD THIS
  />
))}
            </div>
             </div>
       
        {MLayout === 1 && <div className="hr-line"></div>}
       {MLayout === 1 && <Melumnews />}
</div>
       </div>
      </div>
     
  )
}