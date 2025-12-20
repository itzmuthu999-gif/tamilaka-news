import { useNavigate } from "react-router-dom";

const BigNewsContainer5 = ({
  image,
  mediaType = "image",
  headline,
  content,
  time,
  version = 1,
  border = false,
  navigateTo,
}) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (navigateTo) navigate(navigateTo);
  };

  const renderMedia = () => {
    if (mediaType === "video") {
      return (
        <video
          src={image}
          controls
          muted
          playsInline
          className="epbn51-media"
        />
      );
    }

    return <img src={image} alt="" className="epbn51-media" />;
  };

  return (
    <div
      className="ep-bg-news5-1"
      onClick={handleNavigate}
      style={{
        border: border ? "2px dotted #999" : "none",
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
      {version === 1 && (
        <>
          <div className="epbn51-text">
            <div className="epbn51-hdln">{headline}</div>
            <div className="epbn51-onln">{content}</div>
            <div className="epn-tm">{time}</div>
          </div>

          <div className="epbn51-img">{renderMedia()}</div>
        </>
      )}

      {version === 2 && (
        <>
          <div className="epbn51-img">{renderMedia()}</div>

          <div className="epbn51-text">
            <div className="epbn51-hdln">{headline}</div>
            <div className="epbn51-onln">{content}</div>
            <div className="epn-tm">{time}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default BigNewsContainer5;
