import React, { useEffect, useState, useCallback } from 'react'
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
  setAllNews,
  setCurrentNews, 
  setLayout
} from "../Slice/newsformslice.js";
import { createNews, updateNews as updateNewsApi } from "../../Api/newsApi.js";
import './TemplatePage.scss';

import Newsform from './Newsform.jsx';
import ImageBox from './Components/ImageBox.jsx';
import ParagraphBox from './Components/ParagraphBox.jsx';
import Melumnews from './Components/Melumnews.jsx';
import NewsContainerSettings from './Components/NewsContainerSettings.jsx';
import ContainerOverlay from './Components/ContainerOverlay.jsx';
import NewsVideoBox from './Components/NewsVideoBox.jsx';   // ← NEW

export default function Templatepage() {
  const dispatch = useDispatch();
  const currentNews = useSelector((state) => state.newsform.currentNews);
  const MLayout = useSelector(state => state.newsform.MLayout);
  const allNews = useSelector(state => state.newsform.allNews || []);

  const [boxes, setBoxes] = useState([]);
  const [containerOverlays, setContainerOverlays] = useState([]);
  
  const [containerSettings, setContainerSettings] = useState({
    height: 1000,
    padding: 20,
    gap: 10,
    gridColumns: 1
  });
  
  const [formState, setFormState] = useState(null);
  const [formStateEn, setFormStateEn] = useState(null);
  const [activeLang, setActiveLang] = useState("ta");

  const [hiddenElements, setHiddenElements] = useState({
    thumbnail: false,
    author: false,
    zonar: false
  });

  useEffect(() => {
    if (currentNews) {
      setFormState(currentNews.data || null);
      setFormStateEn(currentNews.dataEn || null);
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

  // ── Box management ───────────────────────────────────────────────────────
  const addBox = (type) => {
    const newBox = { 
      id: Date.now(), 
      type, 
      x: 100, 
      y: 100, 
      width:   type === 'paragraph' ? 550 : type === 'video' ? 600 : 250, 
      height:  type === 'paragraph' ? 200 : type === 'video' ? 340 : 200, 
      content: "",
      // video-specific initial data
      ...(type === 'video' ? { videoData: null, dimensions: { width: 600 } } : {})
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

  // ── Container overlay management ─────────────────────────────────────────
  const addContainerOverlay = () => {
    const newContainer = {
      id: Date.now(),
      settings: {
        columns: 2,
        gap: 10,
        padding: 20,
        boxes: []
      }
    };
    setContainerOverlays(prev => [...prev, newContainer]);
  };

  const removeContainerOverlay = (id) => {
    setContainerOverlays(prev => prev.filter(c => c.id !== id));
  };

  const updateContainerOverlay = (id, newSettings) => {
    setContainerOverlays(prev =>
      prev.map((c) =>
        c.id === id
          ? { ...c, settings: { ...c.settings, ...newSettings } }
          : c
      )
    );
  };

  // ── Drag & drop ──────────────────────────────────────────────────────────
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isContainerOverlay = e.dataTransfer.getData('container-overlay');
    const addBoxType         = e.dataTransfer.getData('add-box-type');
    
    if (isContainerOverlay === 'true') {
      addContainerOverlay();
    } else if (addBoxType) {
      // paragraph | image | video
      addBox(addBoxType);
    }
  };

  // ── Settings & save ───────────────────────────────────────────────────────
  const handleContainerSettingsChange = (newSettings) => {
    setContainerSettings(newSettings);
  };

  const saveThisNews = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      alert("Please log in as Admin to save news.");
      return;
    }

    const payload = {
      data: formState || {},
      dataEn: formStateEn || null,
      fullContent: boxes,
      containerOverlays: containerOverlays,
      containerSettings: containerSettings,
      layout: MLayout,
      hiddenElements: hiddenElements,
      comments: currentNews?.comments || []
    };

    try {
      if (currentNews && (currentNews._id || currentNews.id)) {
        const apiId = currentNews._id || currentNews.id;
        const updated = await updateNewsApi(apiId, payload);
        const hasMatch = allNews.some(
          (n) => n._id === updated._id || n.id === updated.id
        );
        const updatedList = hasMatch
          ? allNews.map((n) =>
              n._id === updated._id || n.id === updated.id ? updated : n
            )
          : [...allNews, updated];
        dispatch(setAllNews(updatedList));
        dispatch(setCurrentNews(updated));
        alert("News updated");
      } else {
        const created = await createNews(payload);
        dispatch(setAllNews([...allNews, created]));
        dispatch(setCurrentNews(created));
        alert("News saved");
      }
    } catch (error) {
      console.error("Failed to save news:", error);
      alert("Failed to save news. Check the server and try again.");
    }
  };

  const handleFormChange = useCallback((data) => {
    if (data && typeof data.tamil !== "undefined") {
      setFormState(data.tamil || null);
      setFormStateEn(data.english || null);
    } else {
      setFormState(data);
    }
  }, []);

  const formNewsData = activeLang === "en" && formStateEn ? formStateEn : formState;
  const zonalLabel = Array.isArray(formNewsData?.zonal)
    ? formNewsData.zonal.join(", ")
    : formNewsData?.zonal;

  const getAllParagraphBoxes = useCallback(() => {
    const outsideParagraphs = boxes.filter((b) => b.type === "paragraph");
    const containerParagraphs = [];
    
    containerOverlays.forEach(container => {
      if (container.settings && container.settings.boxes) {
        container.settings.boxes.forEach(box => {
          if (box.type === 'paragraph') {
            containerParagraphs.push({
              id: box.id,
              content: box.content,
              contentEn: box.contentEn
            });
          }
        });
      }
    });
    
    return [...outsideParagraphs, ...containerParagraphs];
  }, [boxes, containerOverlays]);

  const paragraphBoxesForTranslation = getAllParagraphBoxes();

  const handleTranslatedParagraphs = useCallback((translated) => {
    if (!translated || !translated.length) return;
    
    // Update outside container paragraphs
    setBoxes((prev) => {
      const next = prev.map((b) => {
        const t = translated.find((x) => x.id === b.id);
        if (t) return { ...b, contentEn: t.contentEn };
        return b;
      });
      return next;
    });
    
    // Update inside container paragraphs
    setContainerOverlays((prev) => {
      return prev.map((container) => {
        if (container.settings && container.settings.boxes) {
          const updatedBoxes = container.settings.boxes.map((box) => {
            const t = translated.find((x) => x.id === box.id);
            if (t) return { ...box, contentEn: t.contentEn };
            return box;
          });
          return {
            ...container,
            settings: {
              ...container.settings,
              boxes: updatedBoxes
            }
          };
        }
        return container;
      });
    });
  }, []);

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
        activeLang={activeLang}
        onActiveLangChange={setActiveLang}
        paragraphBoxes={paragraphBoxesForTranslation}
        onTranslatedParagraphs={handleTranslatedParagraphs}
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
      <br /><br />
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
                  {zonalLabel || "No category yet"}
                  <div className="hide-btn-hover" style={{
                    position: 'absolute', top: '-8px', right: '-8px',
                    background: '#ff0059', color: 'white', borderRadius: '50%',
                    width: '20px', height: '20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', fontSize: '12px', opacity: 0, transition: 'opacity 0.2s'
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
                    position: 'absolute', top: '-8px', right: '-8px',
                    background: '#ff0059', color: 'white', borderRadius: '50%',
                    width: '20px', height: '20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', fontSize: '12px', opacity: 0, transition: 'opacity 0.2s'
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
                    position: 'absolute', top: '8px', right: '8px',
                    background: '#ff0059', color: 'white', borderRadius: '50%',
                    width: '24px', height: '24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', fontSize: '14px', opacity: 0,
                    transition: 'opacity 0.2s', zIndex: 10
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
                      isVideo =
                        thumb.startsWith("data:video/") ||
                        thumb.includes(".mp4") ||
                        thumb.includes(".webm") ||
                        thumb.includes(".ogg");
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
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
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

            {/* ── Main drop canvas ────────────────────────────────────── */}
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

              {/* Container overlays */}
              {containerOverlays.map((container) => (
                <div key={container.id} style={{ gridColumn: `1 / -1` }}>
                  <ContainerOverlay
                    id={container.id}
                    onDelete={removeContainerOverlay}
                    onUpdate={updateContainerOverlay}
                    initialSettings={container.settings}
                    activeLang={activeLang}
                  />
                </div>
              ))}

              {/* Free-standing boxes: paragraph | image | video */}
              {boxes.map((box) => {
                if (box.type === "paragraph") {
                  return (
                    <ParagraphBox 
                      key={box.id}
                      id={box.id} 
                      onDelete={removeBox} 
                      onUpdate={updateBoxContent} 
                      initialContent={activeLang === "en" && box.contentEn != null ? box.contentEn : box.content}
                      contentKey={activeLang === "en" ? "contentEn" : "content"}
                      box={box}
                    />
                  );
                }

                if (box.type === "image") {
                  return (
                    <ImageBox 
                      key={box.id}
                      id={box.id} 
                      onDelete={removeBox} 
                      onUpdate={updateBoxContent} 
                      initialContent={box.content}
                      box={box}
                    />
                  );
                }

                // ── NEW: free-standing video box on canvas ─────────────
                if (box.type === "video") {
                  return (
                    <div key={box.id} style={{ gridColumn: `1 / -1` }}>
                      <NewsVideoBox
                        id={box.id}
                        onDelete={removeBox}
                        onUpdate={updateBoxContent}
                        initialData={{
                          videoData:  box.videoData  || null,
                          dimensions: box.dimensions || { width: 600 }
                        }}
                        isInContainer={false}
                      />
                    </div>
                  );
                }

                return null;
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
