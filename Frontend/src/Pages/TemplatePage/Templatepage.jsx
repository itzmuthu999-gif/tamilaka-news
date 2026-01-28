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

import { 
  saveNews, 
  updateNews, 
  setCurrentNews, 
  setLayout
} from "../Slice/newsformslice.js";
import './TemplatePage.scss';

import Newsform from './Newsform.jsx';
import ImageBox from './Components/ImageBox.jsx';
import ParagraphBox from './Components/ParagraphBox.jsx';
import Melumnews from './Components/Melumnews.jsx';
import NewsContainerSettings from './Components/NewsContainerSettings.jsx';
import ContainerOverlay from './Components/ContainerOverlay.jsx';

export default function Templatepage() {
  const dispatch = useDispatch();
  const currentNews = useSelector((state) => state.newsform.currentNews);
  const MLayout = useSelector(state => state.newsform.MLayout);

  const [boxes, setBoxes] = useState([]);
  const [containerOverlays, setContainerOverlays] = useState([]);
  
  const [containerSettings, setContainerSettings] = useState({
    height: 1000,
    padding: 20,
    gap: 10,
    gridColumns: 1
  });
  
  const [formState, setFormState] = useState(null);

  const [hiddenElements, setHiddenElements] = useState({
    thumbnail: false,
    author: false,
    zonar: false
  });

  useEffect(() => {
    if (currentNews) {
      setFormState(currentNews.data || null);
      setBoxes(currentNews.fullContent ? JSON.parse(JSON.stringify(currentNews.fullContent)) : []);
      setContainerOverlays(currentNews.containerOverlays ? JSON.parse(JSON.stringify(currentNews.containerOverlays)) : []);
      
      if (currentNews.containerSettings) {
        setContainerSettings(currentNews.containerSettings);
      } else {
        setContainerSettings({ height: 1000, padding: 20, gap: 10, gridColumns: 1 });
      }
      
      if (currentNews.layout) {
        dispatch(setLayout(currentNews.layout));
      }
      
      if (currentNews.hiddenElements) {
        setHiddenElements(currentNews.hiddenElements);
      } else {
        setHiddenElements({ thumbnail: false, author: false, zonar: false });
      }
    }
  }, [currentNews, dispatch]);

  const toggleElementVisibility = (elementName) => {
    setHiddenElements(prev => ({
      ...prev,
      [elementName]: !prev[elementName]
    }));
  };

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
      const newArr = [...prev];
      const box = newArr.find(b => b.id === id);
      if (box) {
        Object.assign(box, updated);
      }
      return newArr; 
    });
  };

  const addContainerOverlay = () => {
    const newContainer = {
      id: Date.now(),
      settings: {
        columns: 2,
        gap: 10
      }
    };
    setContainerOverlays(prev => [...prev, newContainer]);
  };

  const removeContainerOverlay = (id) => {
    setContainerOverlays(prev => prev.filter(c => c.id !== id));
  };

  const updateContainerOverlay = (id, newSettings) => {
    setContainerOverlays(prev => {
      const newArr = [...prev];
      const container = newArr.find(c => c.id === id);
      if (container) {
        container.settings = { ...container.settings, ...newSettings };
      }
      return newArr;
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isContainerOverlay = e.dataTransfer.getData('container-overlay');
    const addBoxType = e.dataTransfer.getData('add-box-type');
    
    if (isContainerOverlay === 'true') {
      addContainerOverlay();
    } else if (addBoxType) {
      addBox(addBoxType);
    }
  };

  const handleContainerSettingsChange = (newSettings) => {
    setContainerSettings(newSettings);
  };

  const saveThisNews = () => {
    if (currentNews && currentNews.id) {
      dispatch(updateNews({
        id: currentNews.id,
        updatedNews: {
          data: formState,
          fullContent: boxes,
          containerOverlays: containerOverlays,
          containerSettings: containerSettings,
          layout: MLayout,
          hiddenElements: hiddenElements
        }
      }));
      alert('News updated');
    } else {
      dispatch(saveNews({
        data: formState || {},
        fullContent: boxes,
        containerOverlays: containerOverlays,
        containerSettings: containerSettings,
        layout: MLayout,
        hiddenElements: hiddenElements
      }));
      alert('News saved');
      
      dispatch(setCurrentNews({
        id: Date.now(),
        data: formState || {},
        fullContent: boxes,
        containerOverlays: containerOverlays
      }));
    }
  };

  function handleFormChange(data) {
    setFormState(data);
  }

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
      <Newsform 
        initialData={currentNews} 
        onChange={handleFormChange} 
        onSave={() => saveThisNews()} 
      />
      <div className='navcon1'>
        <div className='navcon2'>
          <div className="nav-c1">
            <div className="nav-c1-date">விஜயன் அக்டோபர் 30 2025</div>
            <div className='nav-c1-logo'><img src={logo} alt="alt"/></div>
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
              <div>டிரெண்டிங்</div>
            </div>
            <div className="nav-c3-dm"><HiMiniMoon /></div>
          </div>
        </div>
      </div>
      <div className="break-news">
        <p>சென்னை விமான நிலையத்தில் பாதுகாப்பு சோதனை தீவிரம் | டெல்லியில் மழை வெள்ளம் – போக்குவரத்து பாதிப்பு | பெங்களூரில் பெரிய IT நிறுவனத்தில் திடீர் பணிநீக்கம் | தமிழகத்தில் இன்று மின்தடை அறிவிப்பு | கோவை அருகே வெடிகுண்டு பரபரப்பு – போலீஸ் விசாரணை தொடக்கம் | பங்குசந்தை சரிவு – முதலீட்டாளர்கள் அதிர்ச்சி</p>
      </div>
      <div className="news-m-cont">
        <div className="news-m-cont2">
          <div className="ele-news">
            <div className="ele-const-news" style={{ border: '2px solid #e0e0e0', padding: '15px', borderRadius: '8px' }}>
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

            <div 
              className="el-full-news" 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{
                height: `${containerSettings.height}px`,
                padding: `${containerSettings.padding}px`,
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: `repeat(${containerSettings.gridColumns}, 1fr)`,
                gap: `${containerSettings.gap}px`,
                alignItems: 'start'
              }}
            >
              <NewsContainerSettings 
                settings={containerSettings}
                onSettingsChange={handleContainerSettingsChange}
              />
{containerOverlays.map((container) => (
  <div key={container.id} style={{ gridColumn: `1 / -1` }}>
    <ContainerOverlay
      id={container.id}
      onDelete={removeContainerOverlay}
      onUpdate={updateContainerOverlay}
      initialSettings={container.settings}
    />
  </div>
))}
{boxes.map((box) => {
  return box.type === "paragraph" ? (
    <ParagraphBox 
      key={box.id}
      id={box.id} 
      onDelete={removeBox} 
      onUpdate={updateBoxContent} 
      initialContent={box.content}
      box={box}
    />
  ) : (
    <ImageBox 
      key={box.id}
      id={box.id} 
      onDelete={removeBox} 
      onUpdate={updateBoxContent} 
      initialContent={box.content}
      box={box}
    />
  );
})}
            </div>
          </div>
       
          {MLayout === 1 && <div className="hr-line"></div>}
          {MLayout === 1 && <Melumnews />}
        </div>
      </div>
    </div>
  );
}