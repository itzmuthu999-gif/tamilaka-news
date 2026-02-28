import { useState } from "react";
import timeFun from "../Containers_/timeFun";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import jwt from "../../../assets/jwt.jpg";

const PreviewNorContainer5 = ({
  newsId,
  version = 1,
  showSeparator: showSeparatorProp,
  // slot identification props for reading from Redux directly
  slotId,
  catName,
  containerId,
  isSlider = false,
  isSlider2 = false,
  isNested = false,
  parentContainerId = null,
}) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const { allNews = [], translatedNews = [], language } = useSelector(
    (state) => state.newsform || {}
  );

  // FIX: Read showSeparator from Redux slot state if slot props are provided,
  // otherwise fall back to the prop passed directly.
  const slotFromRedux = useSelector((state) => {
    if (!catName || !containerId || !slotId) return null;
    const page = state.editpaper?.pages?.find((p) => p.catName === catName);
    if (!page) return null;

    if (isSlider || isSlider2) {
      const slider = page.sliders?.find((s) => s.id === containerId);
      return slider?.items?.find((i) => i.slotId === slotId) || null;
    } else if (isNested && parentContainerId) {
      const nestedCont = page.containers
        ?.find((c) => c.id === parentContainerId)
        ?.nestedContainers?.find((nc) => nc.id === containerId);
      return nestedCont?.items?.find((i) => i.slotId === slotId) || null;
    } else {
      const container = page.containers?.find((c) => c.id === containerId);
      return container?.items?.find((i) => i.slotId === slotId) || null;
    }
  });

  // Prefer Redux value if available, otherwise use the prop
  const showSeparator =
    slotFromRedux !== null
      ? slotFromRedux?.showSeparator || false
      : showSeparatorProp || false;

  const newsSource = language === "en" ? translatedNews : allNews;
  const news = newsSource.find((n) => n.id === newsId);

  const DEFAULT_DATA = {
    image: jwt,
    headline: "Breaking News Headline Comes Here",
    content:
      "This is a short description of the news. Drop a news card to replace this content.",
    time: "Just now",
  };

  const formatTime = (timestamp) => timeFun(timestamp);

  const renderData = news
    ? {
        image: (() => {
          const thumb = news.data?.thumbnail;
          if (!thumb) return DEFAULT_DATA.image;
          if (typeof thumb === "string") return thumb;
          if (thumb instanceof File) return URL.createObjectURL(thumb);
          return DEFAULT_DATA.image;
        })(),
        headline: news.data?.headline || DEFAULT_DATA.headline,
        content: news.data?.oneLiner || DEFAULT_DATA.content,
        time: formatTime(news.time || news.createdAt || news.updatedAt) || DEFAULT_DATA.time,
      }
    : DEFAULT_DATA;

  const handleNavigate = () => {
    if (!newsId) return;
    navigate(`/preview/${newsId}`);
  };

  // FIX: Pink text on hover
  const textColor = hovered ? "#e91e8c" : "inherit";

  return (
    <div
      style={{ position: "relative", display: "inline-flex", flexDirection: "column", width: "fit-content" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={version === 1 ? "ep-nm2-news-2" : "ep-nm2-news-3"}
        onClick={handleNavigate}
        style={{ cursor: "pointer" }}
      >
        {version === 1 && (
          <>
            <div
              className="epbn22-hdln"
              style={{ fontWeight: "bold", fontSize: "13px", color: textColor, transition: "color 0.2s" }}
            >
              {renderData.headline}
            </div>
            <div className="ep-nm22-sbc" style={maincontstyle}>
              <div className="epnn22-img" style={imgoverly}>
                <img style={imgstyle} src={renderData.image} alt="" />
              </div>
              <div className="ep-nm22sbc-c1">
                <div
                  className="epnn22-onln"
                  style={{ fontSize: "12px", color: textColor, transition: "color 0.2s" }}
                >
                  {renderData.content}
                </div>
                <div
                  className="epn-tm"
                  style={{ color: textColor, transition: "color 0.2s" }}
                >
                  {renderData.time}
                </div>
              </div>
            </div>
          </>
        )}

        {version === 2 && (
          <>
            <div
              className="epbn22-hdln"
              style={{ fontWeight: "bold", fontSize: "13px", color: textColor, transition: "color 0.2s" }}
            >
              {renderData.headline}
            </div>
            <div className="ep-nm22-sbc" style={maincontstyle}>
              <div className="ep-nm22sbc-c1" style={{ fontSize: "12px" }}>
                <div
                  className="epnn22-onln"
                  style={{ color: textColor, transition: "color 0.2s" }}
                >
                  {renderData.content}
                </div>
                <div
                  className="epn-tm"
                  style={{ color: textColor, transition: "color 0.2s" }}
                >
                  {renderData.time}
                </div>
              </div>
              <div className="epnn22-img" style={imgoverly} >
                <img style={imgstyle} src={renderData.image} alt="" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* FIX: Separator line — same width as container, directly below */}
      {showSeparator && (
        <div
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: "#999",
            marginTop: "4px",
            flexShrink: 0,
          }}
        />
      )}
    </div>
  );
};

const maincontstyle = {
  display: "flex",
  gap: "12px",
  alignItems: "flex-start",
};

const imgoverly = {
  width: "150px",
  minWidth: "150px",
  height: "100%",
  display: "flex",
  borderRadius:"5px",
};

const imgstyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

export default PreviewNorContainer5;


