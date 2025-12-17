import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BigNewsContainer3 = ({
  image,
  headline,
  content,
  time,
  border = false,
  navigateTo,
  onDelete,
}) => {
  const [version, setVersion] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e) => {
    e.stopPropagation();
    setVersion(prev => (prev === 3 ? 1 : prev + 1));
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
      className="ep-bg-news-3"
      onClick={handleNavigate}
      style={{
        border: border ? "2px dotted #999" : "none",
        position: "relative",
        cursor: navigateTo ? "pointer" : "default",
      }}
    >
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
          <button
            onClick={handleChange}
            style={iconBtnStyle}
            title="Change layout"
          >
            🔄
          </button>

          <button
            onDoubleClick={handleDelete}
            style={iconBtnStyle}
            title="Double click to delete"
          >
            ❌
          </button>
        </div>
      )}

      {/* VERSION 1 */}
      {version === 1 && (
        <>
          <div className="epbn3-hdln">{headline}</div>
          <div className="epbn3-img">
            <img src={image} alt="" />
          </div>
          <div className="epbn3-onln">{content}</div>
          <div className="epn-tm">{time}</div>
        </>
      )}

      {/* VERSION 2 */}
      {version === 2 && (
        <>
          <div className="epbn3-img">
            <img src={image} alt="" />
          </div>
          <div className="epbn3-hdln">{headline}</div>
          <div className="epbn3-onln">{content}</div>
          <div className="epn-tm">{time}</div>
        </>
      )}

      {/* VERSION 3 */}
      {version === 3 && (
        <>
          <div className="epbn3-hdln">{headline}</div>
          <div className="epbn3-onln">{content}</div>
          <div className="epbn3-img">
            <img src={image} alt="" />
          </div>
          <div className="epn-tm">{time}</div>
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
};

export default BigNewsContainer3;
