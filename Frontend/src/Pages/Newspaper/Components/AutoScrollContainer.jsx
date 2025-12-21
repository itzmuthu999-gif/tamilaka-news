import { useRef, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const AutoScrollContainer = ({ children, autoScroll = true }) => {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [hovered, setHovered] = useState(false);

  const scrollAmount = 300;

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Auto scroll
  useEffect(() => {
    if (!autoScroll) return;

    const interval = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;

      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 5) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [autoScroll]);

  return (
    <div
      className="auto-scroll-wrapper"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <style>{`
        .auto-scroll-wrapper {
          position: relative;
          width: 100%;
        }

        .auto-scroll-container {
          display: flex;
          overflow-x: auto;
          scroll-behavior: smooth;
          scrollbar-width: none;
        }

        .auto-scroll-container::-webkit-scrollbar {
          display: none;
        }

        .scroll-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.6);
          color: white;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: opacity 0.3s ease, transform 0.3s ease;
          z-index: 10;
        }

        .scroll-btn.left {
          left: 8px;
        }

        .scroll-btn.right {
          right: 8px;
        }

        .scroll-btn.hidden {
          opacity: 0;
          pointer-events: none;
          transform: translateY(-50%) scale(0.8);
        }

        .scroll-btn.visible {
          opacity: 1;
        }

        .scroll-btn:hover {
          background: rgba(237, 1, 141, 0.9);
        }
      `}</style>

      {/* Left Button */}
      <div
        className={`scroll-btn left ${
          hovered && showLeft ? "visible" : "hidden"
        }`}
        onClick={scrollLeft}
      >
        <FaChevronLeft />
      </div>

      {/* Right Button */}
      <div
        className={`scroll-btn right ${
          hovered && showRight ? "visible" : "hidden"
        }`}
        onClick={scrollRight}
      >
        <FaChevronRight />
      </div>

      {/* Scrollable Content */}
      <div
        className="auto-scroll-container"
        ref={scrollRef}
        onScroll={checkScroll}
      >
        {children}
      </div>
    </div>
  );
};

export default AutoScrollContainer;
