import { useRef, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function AutoScrollContainer ({
  children,
  autoScroll = true,
  gap = 16,
  autoTranslateX = 300,
  manualTranslateX = 300,
  autoScrollDelay = 3000
}) {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Detect mobile/tablet devices
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Calculate total pages and current page for mobile
  useEffect(() => {
    if (!isMobile) return;
    
    const calculatePages = () => {
      const el = scrollRef.current;
      if (!el) return;
      
      const containerWidth = el.clientWidth;
      const scrollWidth = el.scrollWidth;
      const pages = Math.ceil(scrollWidth / containerWidth);
      setTotalPages(pages);
    };
    
    calculatePages();
    window.addEventListener('resize', calculatePages);
    return () => window.removeEventListener('resize', calculatePages);
  }, [isMobile, children]);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
    
    // Calculate current page for mobile dots
    if (isMobile) {
      const containerWidth = el.clientWidth;
      const currentPageNum = Math.round(el.scrollLeft / containerWidth);
      setCurrentPage(currentPageNum);
    }
  };

  // Calculate responsive scroll distance
  const getScrollDistance = (baseDistance) => {
    const el = scrollRef.current;
    if (!el) return baseDistance;
    
    // Use a percentage of container width for better responsiveness
    return Math.min(baseDistance, el.clientWidth * 0.8);
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -getScrollDistance(manualTranslateX),
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: getScrollDistance(manualTranslateX),
      behavior: "smooth",
    });
  };

  const scrollToPage = (pageIndex) => {
    const el = scrollRef.current;
    if (!el) return;
    
    const containerWidth = el.clientWidth;
    el.scrollTo({
      left: pageIndex * containerWidth,
      behavior: "smooth"
    });
  };

  // Auto-scroll effect (disabled on mobile)
  useEffect(() => {
    if (!autoScroll || isMobile) return;

    const interval = setInterval(() => {
      const el = scrollRef.current;
      if (!el || hovered) return;

      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 5) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({
          left: getScrollDistance(autoTranslateX),
          behavior: "smooth",
        });
      }
    }, autoScrollDelay);

    return () => clearInterval(interval);
  }, [autoScroll, autoTranslateX, autoScrollDelay, hovered, isMobile]);

  return (
    <div
      className="auto-scroll-wrapper"
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
    >
      <style>{`
        .auto-scroll-wrapper {
          position: relative;
          width: 100%;
          padding: 0 4px;
        }

        .auto-scroll-container {
          display: flex;
          gap: ${gap}px;
          overflow-x: auto;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          padding: 8px 0;
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
          border: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
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

        .scroll-btn:active {
          transform: translateY(-50%) scale(0.95);
        }

        /* Pagination dots container */
        .pagination-dots {
          display: none;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
          padding: 8px 0;
        }

        .pagination-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          padding: 0;
        }

        .pagination-dot.active {
          background: rgba(237, 1, 141, 0.9);
          width: 10px;
          height: 10px;
        }

        .pagination-dot:hover {
          background: rgba(237, 1, 141, 0.6);
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .scroll-btn {
            width: 36px;
            height: 36px;
          }
          
          .auto-scroll-container {
            gap: ${Math.max(gap * 0.75, 12)}px;
          }
        }

        /* Mobile - Hide buttons, show dots */
        @media (max-width: 768px) {
          .auto-scroll-wrapper {
            padding: 0 2px;
          }
          
          .scroll-btn {
            display: none !important;
          }
          
          .auto-scroll-container {
            gap: ${Math.max(gap * 0.5, 8)}px;
            padding: 4px 0;
            scroll-snap-type: x mandatory;
          }

          .auto-scroll-container > * {
            scroll-snap-align: start;
          }
          
          .pagination-dots {
            display: flex;
          }
        }

        /* Small mobile */
        @media (max-width: 480px) {
          .auto-scroll-container {
            gap: ${Math.max(gap * 0.4, 6)}px;
          }
          
          .pagination-dot {
            width: 7px;
            height: 7px;
          }
          
          .pagination-dot.active {
            width: 9px;
            height: 9px;
          }
        }
      `}</style>

      {/* Left Button - hidden on mobile */}
      <div
        className={`scroll-btn left ${
          (isMobile ? false : hovered && showLeft) ? "visible" : "hidden"
        }`}
        onClick={scrollLeft}
      >
        <FaChevronLeft />
      </div>

      {/* Right Button - hidden on mobile */}
      <div
        className={`scroll-btn right ${
          (isMobile ? false : hovered && showRight) ? "visible" : "hidden"
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

      {/* Pagination Dots - only visible on mobile */}
      {isMobile && totalPages > 1 && (
        <div className="pagination-dots">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`pagination-dot ${currentPage === index ? 'active' : ''}`}
              onClick={() => scrollToPage(index)}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};