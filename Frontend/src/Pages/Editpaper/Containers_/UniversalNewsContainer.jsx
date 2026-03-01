import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { TbArrowsExchange } from "react-icons/tb";
import { IoIosClose } from "react-icons/io";
import { HiOutlineMinus } from "react-icons/hi";
import { MdEdit } from "react-icons/md";
import { IoCopyOutline } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import jwt from "../../../assets/jwt.jpg";
import {
  dropNewsIntoSlot,
  dropNewsIntoSliderSlot,
  dropNewsIntoNestedSlot,
  toggleContainerSeparator,
  toggleSliderSeparator,
  toggleNestedSeparator,
  updateSlotShfval,
  updateNestedSlotShfval,
  updateSliderSlotShfval,
  // FIXED: Added the missing import for regular container slot dimensions
  updateSlotDimensions,
  updateNestedSlotDimensions,
  updateSliderSlotDimensions,
  addPresetContainer,
} from "../../Slice/editpaperSlice/editpaperslice";

/**
 * Universal News Container Component
 * 
 * Supports 12 layout variations:
 * 1. Headline -> Image -> OneLiner (vertical)
 * 2. Headline + OneLiner -> Image (vertical)
 * 3. Image -> Headline + OneLiner (vertical)
 * 4. Image (left) | Headline + OneLiner (right)
 * 5. Headline + OneLiner (left) | Image (right)
 * 6. Image (left) | Headline (right)
 * 7. Headline (left) | Image (right)
 * 8. Image (left) | OneLiner (right)
 * 9. OneLiner (left) | Image (right)
 * 10. Headline only
 * 11. OneLiner only
 * 12. Image/Video only
 */

const UniversalNewsContainer = ({
  border = false,
  onDelete,
  slotId,
  catName,
  containerId,
  sliderId,
  isSlider = false,
  isSlider2 = false,
  isNested = false,
  parentContainerId = null,
  defaultWidth = 400,
  defaultHeight = 300,
  defaultLayout = 1,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Edit popup state
  const [showEditPopup, setShowEditPopup] = useState(false);
  
  // Save preset state
  const [showSavePresetPopup, setShowSavePresetPopup] = useState(false);
  const [presetName, setPresetName] = useState("");

  // Dimension state â€” container, image, and padding
  const [containerWidth, setContainerWidth] = useState(defaultWidth);
  const [containerHeight, setContainerHeight] = useState(defaultHeight);
  const [padding, setPadding] = useState(10);
  const [imgWidth, setImgWidth] = useState(defaultWidth);
  const [imgHeight, setImgHeight] = useState(defaultHeight);
  const [configInput, setConfigInput] = useState(
    `${defaultWidth}-${defaultHeight}-${defaultLayout}-10-${defaultWidth}-${defaultHeight}`
  );
  const [copySuccess, setCopySuccess] = useState(false);

  const allNews = useSelector((state) => state.newsform?.allNews || []);

  // Helper to find slider in both regular and nested containers
  const findSlider = (page) => {
    if (!page || !sliderId) return null;
    if (isNested && parentContainerId) {
      return page.containers
        ?.find((c) => c.id === parentContainerId)
        ?.nestedContainers?.find((nc) => nc.id === containerId)
        ?.sliders?.find((s) => s.id === sliderId);
    } else {
      return page.containers
        ?.find((c) => c.id === containerId)
        ?.sliders?.find((s) => s.id === sliderId);
    }
  };

  // Get separator state
  const showSeparator = useSelector((state) => {
    const page = state.editpaper.pages.find((p) => p.catName === catName);
    if (!page) return false;

    if (isSlider || isSlider2) {
      const slider = findSlider(page);
      const item = slider?.items.find((i) => i.slotId === slotId);
      return item?.showSeparator || false;
    } else if (isNested && parentContainerId) {
      const nestedCont = page.containers
        ?.find((c) => c.id === parentContainerId)
        ?.nestedContainers?.find((nc) => nc.id === containerId);
      const item = nestedCont?.items?.find((i) => i.slotId === slotId);
      return item?.showSeparator || false;
    } else {
      const container = page.containers?.find((c) => c.id === containerId);
      const item = container?.items.find((i) => i.slotId === slotId);
      return item?.showSeparator || false;
    }
  });

  // Get slot data
  const slot = useSelector((state) => {
    const page = state.editpaper.pages.find((p) => p.catName === catName);
    if (!page) return null;

    if (isSlider || isSlider2) {
      const slider = findSlider(page);
      return slider?.items.find((i) => i.slotId === slotId);
    } else if (isNested && parentContainerId) {
      const nestedCont = page.containers
        ?.find((c) => c.id === parentContainerId)
        ?.nestedContainers?.find((nc) => nc.id === containerId);
      return nestedCont?.items?.find((i) => i.slotId === slotId);
    } else {
      const container = page.containers?.find((c) => c.id === containerId);
      return container?.items.find((i) => i.slotId === slotId);
    }
  });

  const newsId = slot?.newsId;
  const version = slot?.shfval ?? 1;
  const news = allNews.find((n) => n.id === newsId);

  // Build config string from current fields
  const buildConfig = (cw, ch, sv, pad, iw, ih) =>
    `${cw}-${ch}-${sv}-${pad}-${iw}-${ih}`;

  // Load dimensions from slot when available
  useEffect(() => {
    if (slot?.dimensions) {
      const dims = slot.dimensions;
      if (dims.containerWidth !== undefined) setContainerWidth(dims.containerWidth);
      if (dims.containerHeight !== undefined) setContainerHeight(dims.containerHeight);
      if (dims.imgWidth !== undefined) setImgWidth(dims.imgWidth);
      if (dims.imgHeight !== undefined) setImgHeight(dims.imgHeight);
      if (dims.padding !== undefined) setPadding(dims.padding);
      
      // Update config input to reflect loaded dimensions
      const newConfig = buildConfig(
        dims.containerWidth || containerWidth,
        dims.containerHeight || containerHeight,
        version,
        dims.padding || padding,
        dims.imgWidth || imgWidth,
        dims.imgHeight || imgHeight
      );
      setConfigInput(newConfig);
    }
  }, [slot?.dimensions]); // Only re-run when dimensions object changes

  const DEFAULT_DATA = {
    media: jwt,
    mediaType: "image",
    headline: "Breaking News Headline Comes Here",
    content: "This is a short description of the news. Drop a news card to replace this content.",
    time: "Just now",
  };

  const renderData = news
    ? {
        media: (() => {
          const thumb = news.data?.thumbnail || news.data?.video;
          if (!thumb) return DEFAULT_DATA.media;
          if (typeof thumb === "string") return thumb;
          if (thumb instanceof File) return URL.createObjectURL(thumb);
          return DEFAULT_DATA.media;
        })(),
        mediaType: news.data?.video ? "video" : "image",
        headline: news.data?.headline || DEFAULT_DATA.headline,
        content: news.data?.oneLiner || DEFAULT_DATA.content,
        time: news.time || DEFAULT_DATA.time,
      }
    : DEFAULT_DATA;

  // Event handlers
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedId = e.dataTransfer.getData("newsId");
    if (droppedId) {
      if (isSlider || isSlider2) {
        dispatch(
          dropNewsIntoSliderSlot({
            catName,
            sliderId,
            slotId,
            newsId: Number(droppedId),
            containerId,
            isNested,
            parentContainerId,
          })
        );
      } else if (isNested && parentContainerId) {
        dispatch(
          dropNewsIntoNestedSlot({
            catName,
            parentContainerId,
            nestedContainerId: containerId,
            slotId,
            newsId: Number(droppedId),
          })
        );
      } else {
        dispatch(
          dropNewsIntoSlot({
            catName,
            containerId,
            slotId,
            newsId: Number(droppedId),
          })
        );
      }
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.();
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleShuffle = (e) => {
    e.stopPropagation();
    const nextVal = version >= 12 ? 1 : version + 1;
    
    if (isSlider || isSlider2) {
      dispatch(
        updateSliderSlotShfval({
          catName,
          sliderId,
          slotId,
          containerId,
          isNested,
          parentContainerId,
          shfval: nextVal,
        })
      );
    } else if (isNested && parentContainerId) {
      dispatch(
        updateNestedSlotShfval({
          catName,
          parentContainerId,
          nestedContainerId: containerId,
          slotId,
          shfval: nextVal,
        })
      );
    } else {
      dispatch(
        updateSlotShfval({
          catName,
          containerId,
          slotId,
          shfval: nextVal,
        })
      );
    }
  };

  const handleNavigate = () => {
    if (!newsId) return;
    navigate(`/preview/${newsId}`);
  };

  const toggleSeparator = (e) => {
    e.stopPropagation();

    if (isSlider || isSlider2) {
      dispatch(
        toggleSliderSeparator({
          catName,
          sliderId,
          slotId,
          containerId,
          isNested,
          parentContainerId,
        })
      );
    } else if (isNested && parentContainerId) {
      dispatch(
        toggleNestedSeparator({
          catName,
          parentContainerId,
          nestedContainerId: containerId,
          slotId,
        })
      );
    } else {
      dispatch(
        toggleContainerSeparator({
          catName,
          containerId,
          slotId,
        })
      );
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setShowEditPopup(!showEditPopup);
  };

  // Sync config string â†’ individual fields and dispatch instantly
  const syncFromConfigInput = useCallback((raw) => {
    const parts = raw.split("-").map(p => p.trim());
    if (parts.length !== 6) return;
    const [cw, ch, sv, pad, iw, ih] = parts.map(Number);
    if ([cw, ch, sv, pad, iw, ih].some(isNaN)) return;

    if (cw > 0) setContainerWidth(cw);
    if (ch > 0) setContainerHeight(ch);
    if (pad >= 0) setPadding(pad);
    if (iw > 0) setImgWidth(iw);
    if (ih > 0) setImgHeight(ih);

    // Dispatch shfval
    const layoutNum = Math.round(sv);
    if (layoutNum >= 1 && layoutNum <= 12) {
      dispatchShfval(layoutNum);
    }

    // Dispatch dimensions
    dispatchDimensions({ cw, ch, pad, iw, ih });
  }, [catName, containerId, slotId, isSlider, isSlider2, isNested, parentContainerId]);

  // Dispatch shfval helper
  const dispatchShfval = (shfval) => {
    if (isSlider || isSlider2) {
      dispatch(updateSliderSlotShfval({ catName, sliderId, slotId, containerId, isNested, parentContainerId, shfval }));
    } else if (isNested && parentContainerId) {
      dispatch(updateNestedSlotShfval({ catName, parentContainerId, nestedContainerId: containerId, slotId, shfval }));
    } else {
      dispatch(updateSlotShfval({ catName, containerId, slotId, shfval }));
    }
  };

  // Dispatch dimensions helper - NOW USES SLOT-LEVEL DIMENSIONS
  const dispatchDimensions = ({ cw, ch, pad, iw, ih }) => {
    const payload = {
      catName,
      slotId,
      containerWidth: cw,
      containerHeight: ch,
      imgWidth: iw,
      imgHeight: ih,
      padding: pad,
    };
    
    if (isSlider || isSlider2) {
      // Slider slot dimensions
      dispatch(updateSliderSlotDimensions({ 
        ...payload, 
        sliderId,
        containerId,
        isNested,
        parentContainerId 
      }));
    } else if (isNested && parentContainerId) {
      // Nested container slot dimensions
      dispatch(updateNestedSlotDimensions({ 
        ...payload, 
        parentContainerId, 
        nestedContainerId: containerId 
      }));
    } else {
      // Regular container slot dimensions
      dispatch(updateSlotDimensions({ 
        ...payload, 
        containerId 
      }));
    }
  };

  // Handler: individual field changed â†’ sync configInput + dispatch
  const handleDimensionChange = (field, rawVal) => {
    const val = parseInt(rawVal) || 0;
    let cw = containerWidth, ch = containerHeight, pad = padding, iw = imgWidth, ih = imgHeight;
    if (field === "containerWidth") { cw = val; setContainerWidth(val); }
    else if (field === "containerHeight") { ch = val; setContainerHeight(val); }
    else if (field === "padding") { pad = val; setPadding(val); }
    else if (field === "imgWidth") { iw = val; setImgWidth(val); }
    else if (field === "imgHeight") { ih = val; setImgHeight(val); }
    const newConfig = buildConfig(cw, ch, version, pad, iw, ih);
    setConfigInput(newConfig);
    dispatchDimensions({ cw, ch, pad, iw, ih });
  };

  // Handler: config string changed â†’ parse + sync fields + dispatch
  const handleConfigInputChange = (e) => {
    const raw = e.target.value;
    setConfigInput(raw);
    syncFromConfigInput(raw);
  };

  // Copy button: copy slot contents (config string) to clipboard
  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(configInput).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1500);
    });
  };

  // Media renderer
  const renderMedia = () => {
    if (renderData.mediaType === "video") {
      return (
        <video
          src={renderData.media}
          controls
          muted
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      );
    }
    return (
      <img
        src={renderData.media}
        alt=""
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  };

  // Layout renderer based on version
  const renderLayout = () => {
    const imageStyle = {
      width: `${imgWidth}px`,
      height: `${imgHeight}px`,
      borderRadius: "5px",
      overflow: "hidden",
      flexShrink: 0,
    };

    const headlineStyle = {
      fontSize: "20px",
      fontWeight: "bold",
  
    };

    const contentStyle = {
      fontSize: "14px",
     
    };

    const timeStyle = {
      fontSize: "12px",
      color: "gray",
    };

    switch (version) {
      // Layout 1: Headline -> Image -> OneLiner
      case 1:
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={headlineStyle}>{renderData.headline}</div>
            <div style={imageStyle}>{renderMedia()}</div>
            <div style={contentStyle}>{renderData.content}</div>
            <div style={timeStyle}>{renderData.time}</div>
          </div>
        );

      // Layout 2: Headline + OneLiner -> Image
      case 2:
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={headlineStyle}>{renderData.headline}</div>
            <div style={contentStyle}>{renderData.content}</div>
            <div style={timeStyle}>{renderData.time}</div>
            <div style={imageStyle}>{renderMedia()}</div>
          </div>
        );

      // Layout 3: Image -> Headline + OneLiner
      case 3:
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={imageStyle}>{renderMedia()}</div>
            <div style={headlineStyle}>{renderData.headline}</div>
            <div style={contentStyle}>{renderData.content}</div>
            <div style={timeStyle}>{renderData.time}</div>
          </div>
        );

      // Layout 4: Image (left) | Headline + OneLiner (right)
      case 4:
        return (
          <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
            <div style={imageStyle}>{renderMedia()}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={headlineStyle}>{renderData.headline}</div>
              <div style={contentStyle}>{renderData.content}</div>
              <div style={timeStyle}>{renderData.time}</div>
            </div>
          </div>
        );

      // Layout 5: Headline + OneLiner (left) | Image (right)
      case 5:
        return (
          <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={headlineStyle}>{renderData.headline}</div>
              <div style={contentStyle}>{renderData.content}</div>
              <div style={timeStyle}>{renderData.time}</div>
            </div>
            <div style={imageStyle}>{renderMedia()}</div>
          </div>
        );

      // Layout 6: Image (left) | Headline (right)
      case 6:
        return (
          <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
            <div style={imageStyle}>{renderMedia()}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={headlineStyle}>{renderData.headline}</div>
              <div style={timeStyle}>{renderData.time}</div>
            </div>
          </div>
        );

      // Layout 7: Headline (left) | Image (right)
      case 7:
        return (
          <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={headlineStyle}>{renderData.headline}</div>
              <div style={timeStyle}>{renderData.time}</div>
            </div>
            <div style={imageStyle}>{renderMedia()}</div>
          </div>
        );

      // Layout 8: Image (left) | OneLiner (right)
      case 8:
        return (
          <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
            <div style={imageStyle}>{renderMedia()}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={contentStyle}>{renderData.content}</div>
              <div style={timeStyle}>{renderData.time}</div>
            </div>
          </div>
        );

      // Layout 9: OneLiner (left) | Image (right)
      case 9:
        return (
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={contentStyle}>{renderData.content}</div>
              <div style={timeStyle}>{renderData.time}</div>
            </div>
            <div style={imageStyle}>{renderMedia()}</div>
          </div>
        );

      // Layout 10: Headline only
      case 10:
        return (
          <div>
            <div style={headlineStyle}>{renderData.headline}</div>
            <div style={timeStyle}>{renderData.time}</div>
          </div>
        );

      // Layout 11: OneLiner only
      case 11:
        return (
          <div>
            <div style={contentStyle}>{renderData.content}</div>
            <div style={timeStyle}>{renderData.time}</div>
          </div>
        );

      // Layout 12: Image/Video only
      case 12:
        return (
          <div>
            <div style={imageStyle}>{renderMedia()}</div>
            <div style={timeStyle}>{renderData.time}</div>
          </div>
        );

      default:
        return renderLayout.call(this, 1);
    }
  };

  return (
    <div style={{ position: "relative", width: "fit-content" }}>
      <style>
        {`
          .universal-container {
            transition: 0.3s ease-in-out;
            cursor: pointer;
          }

          .universal-container:hover {
            color: rgb(237, 1, 141);
          }

          .separator-line {
            width: 100%;
            height: 1px;
            background-color: #999;
            margin-top: 10px;
          }

          .separator-btn {
            position: absolute;
            bottom: -14px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid #ccc;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 16px;
            z-index: 10;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: all 0.2s ease;
          }

          .separator-btn:hover {
            background: rgba(240, 240, 240, 0.95);
            border-color: #999;
          }

          .separator-btn.active {
            background: rgba(153, 153, 153, 0.95);
            color: #fff;
            border-color: #666;
          }

          .edit-popup {
            position: absolute;
            top: 50px;
            right: 8px;
            background: white;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1000;
            min-width: 250px;
          }

          .edit-popup-title {
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 16px;
          }

          .edit-input-group {
            margin-bottom: 10px;
          }

          .edit-input-label {
            display: block;
            font-size: 12px;
            margin-bottom: 4px;
            color: #555;
          }

          .edit-input {
            width: 100%;
            padding: 6px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
          }


          @media (max-width: 768px) {
            .universal-container {
              width: 100% !important;
              max-width: 100%;
            }
          }
        `}
      </style>

      <div
        className="universal-container"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleNavigate}
        style={{
          border: border ? "2px dotted #999" : "none",
          position: "relative",
          width: containerWidth > 0 ? `${containerWidth}px` : undefined,
          minHeight: containerHeight > 0 ? `${containerHeight}px` : undefined,
          padding: `${padding}px`,
        }}
      >
        {border && (
          <div
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              display: "flex",
              gap: "6px",
              zIndex: 10,
            }}
          >
            <button
              onClick={handleEditClick}
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "4px",
                transition: "all 0.2s ease",
              }}
              title="Edit layout"
            >
              <MdEdit />
            </button>

            <button
              onClick={handleShuffle}
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "4px",
                transition: "all 0.2s ease",
              }}
              title="Shuffle layout"
            >
              <TbArrowsExchange />
            </button>

            <button
              onDoubleClick={handleDelete}
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "4px",
                transition: "all 0.2s ease",
                color: "red",
              }}
              title="Double click to delete"
            >
              <IoIosClose />
            </button>
          </div>
        )}

        {/* Edit Popup */}
        {showEditPopup && border && (
          <div className="edit-popup" onClick={(e) => e.stopPropagation()}>
            <div className="edit-popup-title">Edit Layout</div>

            {/* Container dimensions */}
            <div style={{ marginBottom: "10px" }}>
              <div className="edit-input-label" style={{ fontWeight: "600", marginBottom: "6px", color: "#333" }}>
                Container Size
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <div style={{ flex: 1 }}>
                  <label className="edit-input-label">Width (px)</label>
                  <input
                    type="number"
                    className="edit-input"
                    value={containerWidth}
                    min={50}
                    onChange={(e) => handleDimensionChange("containerWidth", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="edit-input-label">Height (px)</label>
                  <input
                    type="number"
                    className="edit-input"
                    value={containerHeight}
                    min={50}
                    onChange={(e) => handleDimensionChange("containerHeight", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            </div>

            {/* Padding */}
            <div style={{ marginBottom: "10px" }}>
              <div className="edit-input-label" style={{ fontWeight: "600", marginBottom: "6px", color: "#333" }}>
                Padding
              </div>
              <input
                type="number"
                className="edit-input"
                value={padding}
                min={0}
                max={100}
                onChange={(e) => handleDimensionChange("padding", e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Image dimensions */}
            <div style={{ marginBottom: "12px" }}>
              <div className="edit-input-label" style={{ fontWeight: "600", marginBottom: "6px", color: "#333" }}>
                Image Size
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <div style={{ flex: 1 }}>
                  <label className="edit-input-label">Width (px)</label>
                  <input
                    type="number"
                    className="edit-input"
                    value={imgWidth}
                    min={20}
                    onChange={(e) => handleDimensionChange("imgWidth", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="edit-input-label">Height (px)</label>
                  <input
                    type="number"
                    className="edit-input"
                    value={imgHeight}
                    min={20}
                    onChange={(e) => handleDimensionChange("imgHeight", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            </div>

            {/* Unified config input with copy button */}
            <div className="edit-input-group">
              <label className="edit-input-label" style={{ fontWeight: "600", color: "#333" }}>
                Quick Config
              </label>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <input
                  type="text"
                  className="edit-input"
                  placeholder="cW-cH-layout-pad-iW-iH"
                  value={configInput}
                  onChange={handleConfigInputChange}
                  onClick={(e) => e.stopPropagation()}
                  style={{ fontFamily: "monospace", fontSize: "12px" }}
                />
                <button
                  onClick={handleCopy}
                  title="Copy config"
                  style={{
                    flexShrink: 0,
                    background: copySuccess ? "#4CAF50" : "#f0f0f0",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "6px 8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.2s",
                    color: copySuccess ? "white" : "#333",
                    fontSize: "16px",
                  }}
                >
                  <IoCopyOutline />
                </button>
              </div>
              <div style={{ fontSize: "10px", color: "#888", marginTop: "4px" }}>
                containerWâ€“containerHâ€“layout(1-12)â€“paddingâ€“imgWâ€“imgH
              </div>
            </div>

            {/* Save as Preset button */}
            <div style={{ marginTop: "15px", paddingTop: "12px", borderTop: "1px solid #e0e0e0" }}>
              <button
                onClick={() => setShowSavePresetPopup(!showSavePresetPopup)}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "14px",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => e.target.style.background = "#1976D2"}
                onMouseLeave={(e) => e.target.style.background = "#2196F3"}
              >
                Save as Preset
              </button>

              {/* Preset name input and create button */}
              {showSavePresetPopup && (
                <div style={{ marginTop: "10px", animation: "fadeIn 0.2s" }}>
                  <label className="edit-input-label" style={{ fontWeight: "600", color: "#333", marginBottom: "6px", display: "block" }}>
                    Preset Name
                  </label>
                  <input
                    type="text"
                    className="edit-input"
                    placeholder="Enter preset name..."
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    style={{ marginBottom: "8px" }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (presetName.trim()) {
                        dispatch(addPresetContainer(presetName.trim(), {
                          containerWidth,
                          containerHeight,
                          imgWidth,
                          imgHeight,
                          padding
                        }, version));
                        setPresetName("");
                        setShowSavePresetPopup(false);
                        // Show success message
                        alert(`Preset "${presetName}" saved successfully!`);
                      } else {
                        alert("Please enter a preset name");
                      }
                    }}
                    style={{
                      width: "100%",
                      padding: "8px",
                      background: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "13px",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => e.target.style.background = "#45a049"}
                    onMouseLeave={(e) => e.target.style.background = "#4CAF50"}
                  >
                    Create Preset
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {renderLayout()}
      </div>

      {showSeparator && <div className="separator-line" />}

      {border && (
        <button
          onClick={toggleSeparator}
          className={`separator-btn ${showSeparator ? "active" : ""}`}
          title={showSeparator ? "Remove separator" : "Add separator"}
        >
          <HiOutlineMinus />
        </button>
      )}
    </div>
  );
};

export default UniversalNewsContainer;

