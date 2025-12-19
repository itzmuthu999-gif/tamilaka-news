import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbArrowsExchange } from "react-icons/tb";
import { IoIosClose } from "react-icons/io";

const BigNewsContainer5 = ({
  image,
  mediaType = "image",
  headline,
  content,
  time,
  border = false,
  navigateTo,
  onDelete,
}) => {
  const [version, setVersion] = useState(1);
  const navigate = useNavigate();
  
const renderMedia = () => {
  if (mediaType === "video") {
    return (
      <video
        src={image}
        controls
        muted
        playsInline
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  }

  return (
    <img
      src={image}
      alt=""
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
};

  const handleChange = (e) => {
    e.stopPropagation();
    setVersion(prev => (prev === 2 ? 1 : 2));
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.();
  };

  const handleNavigate = () => {
    if (navigateTo) {
      navigate(navigateTo);
    }
  };

  return (
    <div
      className="ep-bg-news5-1"
      onClick={handleNavigate}
      style={{
        border: border ? "2px dotted #999" : "none",
        position: "relative",
        cursor: navigateTo ? "pointer" : "default",
      }}
    >
        <style>
    {
        `
        .ep-bg-news5-1 {
  width: fit-content;
  height: fit-content;
  margin: 5px;
  display: flex;
  gap: 10px;

  transition: 0.5s ease-in-out;
  cursor: pointer;
}
.ep-bg-news5-1:hover {
  color: rgb(237, 1, 141);
}
.epbn51-img {
  width: 500px;
  height: 300px;
  border-radius: 5px;
  overflow: hidden;
}
.epbn51-img img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* This will make the image fill the box nicely */
}
.epbn51-hdln {
  font-size: 20px;
  font-weight: bold;
}

.epbn51-onln {
  font-size: 13px;
}

        `
    }
</style>
      {/* Action Buttons */}
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
          {/* Change layout */}
          <button
            onClick={handleChange}
            style={iconBtnStyle}
            title="Change layout"
          >
            <TbArrowsExchange />
          </button>

          {/* Delete (double click) */}
          <button
            onDoubleClick={handleDelete}
            style={iconBtnStyle}
            title="Double click to delete"
          >
            <IoIosClose />
          </button>
        </div>
      )}

      {/* VERSION 1 */}
      {version === 1 && (
        <>
          <div style={{ width: "400px" }}>
            <div className="epbn51-hdln">Head{headline}</div>
            <div className="epbn51-onln">{content}</div>
            <div className="epn-tm">{time}</div>
          </div>
          <div className="epbn51-img">

  {renderMedia()}


          </div>
        </>
      )}

      {/* VERSION 2 */}
      {version === 2 && (
        <>
          <div className="epbn51-img">

  {renderMedia()}

          </div>
          <div style={{ width: "400px" }}>
            <div className="epbn51-hdln">Head{headline}</div>
            <div className="epbn51-onln">{content}</div>
            <div className="epn-tm">{time}</div>
          </div>
        </>
      )}
    </div>
  );
};

const iconBtnStyle = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontSize: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default BigNewsContainer5;
