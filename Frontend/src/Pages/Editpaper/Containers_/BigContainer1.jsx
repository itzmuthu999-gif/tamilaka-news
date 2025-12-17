import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbArrowsExchange } from "react-icons/tb";
import { IoIosClose } from "react-icons/io";

const BigNewsContainer1 = ({
  image,
  headline,
  content,
  time,
  border = false,
  navigateTo,
  onDelete, // NEW PROP
}) => {
  const [version, setVersion] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e) => {
    e.stopPropagation();
    setVersion(prev => (prev === 3 ? 1 : prev + 1));
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  const handleNavigate = () => {
    if (navigateTo) {
      navigate(navigateTo);
    }
  };

  return (
    <div
      className="ep-bg-news-1"
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
          }}
        >
          {/* Change Button */}
          <button
            onClick={handleChange}
            style={{
              background: "transparent",
              color: "lightblue",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
<TbArrowsExchange />
          </button>

          {/* Close Button (DOUBLE CLICK) */}
          <button
            onDoubleClick={handleDelete}
            title="Double click to delete"
            style={{
                fontWeight: "bold",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
              color: 'red'
            }}
          >
<IoIosClose />
          </button>
        </div>
      )}

      {/* VERSION 1 */}
      {version === 1 && (
        <>
          <div className="epbn1-img">
            <img src={image} alt="" />
          </div>
          <div className="epbn1-hdln">{headline}</div>
          <div className="epbn1-onln">{content}</div>
          <div className="epn-tm">{time}</div>
        </>
      )}

      {/* VERSION 2 */}
      {version === 2 && (
        <>
          <div className="epbn1-hdln">{headline}</div>
          <div className="epbn1-img">
            <img src={image} alt="" />
          </div>
          <div className="epbn1-onln">{content}</div>
          <div className="epn-tm">{time}</div>
        </>
      )}

      {/* VERSION 3 */}
      {version === 3 && (
        <>
          <div className="epbn1-hdln">{headline}</div>
          <div className="epbn1-onln">{content}</div>
          <div className="epbn1-img">
            <img src={image} alt="" />
          </div>
          <div className="epn-tm">{time}</div>
        </>
      )}
    </div>
  );
};

export default BigNewsContainer1;
