import React, { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';

const PerfectSlider = ({
  items = [],
  containerType = 'NewsContainer7',
  autoSlideInterval = 5000,
  direction = 'left',
  showControls = true,
  pauseOnHover = true,
  transitionDuration = 500,
  defaultVisibleItems = 4,
  CONTAINER_MAP = {},
}) => {
  const [width, setWidth] = useState(1200);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  const SelectedContainer = CONTAINER_MAP[containerType] || CONTAINER_MAP['NewsContainer7'];

  const itemWidth = 280;
  const gap = 29;
  const visibleItems = Math.max(1, Math.min(defaultVisibleItems, Math.floor((width - gap) / (itemWidth + gap))));
  
  // Stop at the last visible set, no partial views
  const maxIndex = Math.max(0, items.length - visibleItems-1);

  const nextSlide = () => {
    if (isTransitioning || items.length <= visibleItems) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => {
      // Loop back to start when reaching the end
      return prev >= maxIndex ? 0 : prev + 1;
    });
    setTimeout(() => setIsTransitioning(false), transitionDuration);
  };

  const prevSlide = () => {
    if (isTransitioning || items.length <= visibleItems) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => {
      // Loop to end when going back from start
      return prev <= 0 ? maxIndex : prev - 1;
    });
    setTimeout(() => setIsTransitioning(false), transitionDuration);
  };

  useEffect(() => {
    if (!isPaused && items.length > visibleItems) {
      timerRef.current = setInterval(() => {
        direction === 'left' ? nextSlide() : prevSlide();
      }, autoSlideInterval);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused, currentIndex, items.length, direction, autoSlideInterval, visibleItems, maxIndex]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (pauseOnHover) setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (pauseOnHover) setIsPaused(false);
  };

  if (items.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>No items to display</div>;
  }

  // Don't show controls if all items are visible
  const shouldShowControls = showControls && items.length > visibleItems;

  return (
    <div style={{ padding: '10px' }}>
      <Rnd
        size={{ width, height: 'auto' }}
        position={position}
        minWidth={300}
        maxWidth={2000}
        disableDragging={false}
        enableResizing={{
          left: true,
          right: true,
        }}
        onDragStop={(e, d) => {
          setPosition({ x: d.x, y: d.y });
        }}
        onResize={(e, direction, ref) => {
          setWidth(ref.offsetWidth);
        }}
        style={{
          border: '2px dashed #ccc',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >

        <div
          style={{
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
            borderRadius: '0 0 8px 8px',
            background: '#f5f5f5',
            padding: '5px',
            
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            style={{
              display: 'flex',
              gap: `${gap}px`,
              transition: isTransitioning ? `transform ${transitionDuration}ms ease-in-out` : 'none',
              transform: `translateX(-${currentIndex * (itemWidth + gap)}px)`,
            }}
          >
            {items.map((item, index) => (
              <div
                key={index}
                style={{
                  minWidth: `${itemWidth}px`,
                  maxWidth: `${itemWidth}px`,
                }}
              >
                <SelectedContainer {...item} />
              </div>
            ))}
          </div>

          {shouldShowControls && isHovered && (
            <>
              <button
                onClick={prevSlide}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '45px',
                  height: '45px',
                  cursor: 'pointer',
                  fontSize: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)'}
              >
                ‹
              </button>
              <button
                onClick={nextSlide}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '45px',
                  height: '45px',
                  cursor: 'pointer',
                  fontSize: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)'}
              >
                ›
              </button>
            </>
          )}
        </div>
      </Rnd>
    </div>
  );
};

export default PerfectSlider;