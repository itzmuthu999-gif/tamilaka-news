import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const AutoScrollContainer = ({ children, autoScroll = true }) => {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  // Check scroll position
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  // Manual scroll
  const scrollByAmount = (amount) => {
    scrollRef.current.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  };

  // Auto scroll effect
  useEffect(() => {
    if (!autoScroll) return;

    const interval = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;

      if (el.scrollLeft + el.clientWidth >= el.scrollWidth) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 300, behavior: "smooth" });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [autoScroll]);

  return (
    <div className="auto-scroll-wrapper">
      <style>{`
        .auto-scroll-wrapper {
          position: relative;
          width: 100%;
         
        }

        .auto-scroll {
          display: flex;
          gap: 0px;
          overflow-x: auto;
          scroll-behavior: smooth;
          padding: 5px 5px;
        }

        .auto-scroll::-webkit-scrollbar {
          display: none;
        }

        .scroll-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0,0,0,0.6);
          color: white;
          border: none;
          border-radius: 50%;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: 0.3s;
        }

        .scroll-btn:hover {
          background: rgba(0,0,0,0.85);
        }

        .scroll-left {
          left: 5px;
        }

        .scroll-right {
          right: 5px;
        }
      `}</style>

      {showLeft && (
        <button
          className="scroll-btn scroll-left"
          onClick={() => scrollByAmount(-306)}
        >
          <FiChevronLeft size={22} />
        </button>
      )}

      {showRight && (
        <button
          className="scroll-btn scroll-right"
          onClick={() => scrollByAmount(306)}
        >
          <FiChevronRight size={22} />
        </button>
      )}

      <div
        className="auto-scroll"
        ref={scrollRef}
        onScroll={checkScroll}
      >
        {children}
      </div>
    </div>
  );
};

export default AutoScrollContainer;
