import React, { useState, useEffect, createContext, useContext } from "react";
import { useSelector } from "react-redux";
import PreviewContainer from "./PreviewContainer";
import PreviewSlider from "./PreviewSlider";

// ─────────────────────────────────────────────────────────────────────────────
// MobileContext
// Consumed by PreviewContainer, NestedContainer overlays, and any child that
// needs to collapse its internal grid to a single column on small screens.
//
// Usage in child components:
//   import { useMobile } from "./PagePreview";
//   const isMobile = useMobile();
// ─────────────────────────────────────────────────────────────────────────────
export const MobileContext = createContext(false);
export const useMobile = () => useContext(MobileContext);

/** Breakpoint in px below which we treat the viewport as "mobile". */
const MOBILE_BREAKPOINT = 768;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth <= MOBILE_BREAKPOINT
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);

    const handler = (e) => setIsMobile(e.matches);

    // Modern API
    if (mq.addEventListener) {
      mq.addEventListener("change", handler);
    } else {
      // Safari < 14 fallback
      mq.addListener(handler);
    }

    // Sync in case the value changed between render and effect
    setIsMobile(mq.matches);

    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener("change", handler);
      } else {
        mq.removeListener(handler);
      }
    };
  }, []);

  return isMobile;
}

export default function PagePreview({ pageName = "main" }) {
  const isMobile = useIsMobile();

  const currentPage = useSelector((state) =>
    state.editpaper.pages.find((p) => p.catName === pageName)
  );

  if (!currentPage) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          color: "#999",
          fontSize: "16px",
        }}
      >
        No content available for this page
      </div>
    );
  }

  const containers = currentPage.containers || [];
  const sliders = currentPage.sliders || [];
  const lines = currentPage.lines || [];
  const pageSettings = currentPage.settings || {
    height: 600,
    gridColumns: 12,
    gap: 10,
    padding: 20,
  };

  const padding = pageSettings.padding ?? 20;

  // ── Responsive overrides ──────────────────────────────────────────────────
  // On mobile:
  //   • Collapse the outer grid to a single column.
  //   • Let height be auto so all stacked containers are visible.
  //   • Lines are hidden (see below).
  const effectiveGridColumns = isMobile ? 1 : pageSettings.gridColumns;
  const effectiveHeight = isMobile ? "auto" : `${pageSettings.height}px`;
  const effectivePadding = isMobile ? "12px" : `${padding}px`;

  return (
    // MobileContext is provided here so every nested PreviewContainer,
    // NestedContainer overlay, or slider can read `isMobile` without
    // prop-drilling through the entire tree.
    <MobileContext.Provider value={isMobile}>
      <div
        style={{
          height: effectiveHeight,
          minHeight: isMobile ? "auto" : undefined,
          padding: effectivePadding,
          position: "relative",
          // Keep overflow hidden on desktop to clip absolute-positioned lines.
          // On mobile use visible so stacked content isn't clipped.
          overflow: isMobile ? "visible" : "hidden",
          width: "100%",
          maxWidth: "1250px",
          margin: "0 auto",
          // Smooth transition when resizing between breakpoints
          transition: "padding 0.2s ease",
          boxSizing: "border-box",
        }}
      >
        {/* ── Grid of containers ────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${effectiveGridColumns}, 1fr)`,
            gap: `${pageSettings.gap}px`,
            width: "100%",
            marginBottom: `${pageSettings.gap}px`,
            position: "relative",
            zIndex: 1,
          }}
        >
          {containers.map((container) => (
            <PreviewContainer
              key={container.id}
              id={container.id}
              catName={pageName}
              // isMobile is forwarded as a prop for components that accept it
              // directly, AND is available via useMobile() for deeper descendants.
              isMobile={isMobile}
            />
          ))}
        </div>

        {/* ── Page-level sliders ────────────────────────────────────────── */}
        {sliders.map((slider) => (
          <div
            key={slider.id}
            style={{
              marginBottom: `${pageSettings.gap}px`,
              position: "relative",
              zIndex: 2,
              // Sliders scroll horizontally on desktop; on mobile we let them
              // scroll naturally within their own container.
              overflowX: isMobile ? "auto" : undefined,
            }}
          >
            <PreviewSlider
              id={slider.id}
              catName={pageName}
              containerId={null}
              isNested={false}
              parentContainerId={null}
              isMobile={isMobile}
            />
          </div>
        ))}

        {/* ── Page-level lines (desktop only) ──────────────────────────── */}
        {/* Lines are absolutely positioned decorative elements designed for the
            fixed-height desktop canvas. They have no meaningful representation
            in a reflowed single-column mobile layout, so we suppress them. */}
        {!isMobile &&
          lines.map((line) => {
            const isHorizontal = line.orientation === "horizontal";
            const bg =
              line.lineType === "pink-bold" ? "#e91e63" : "#d0d0d0";
            const width = isHorizontal ? `${line.length}px` : "2px";
            const height = isHorizontal ? "2px" : `${line.length}px`;

            return (
              <div
                key={line.id}
                style={{
                  position: "absolute",
                  left: line.x,
                  top: line.y,
                  width,
                  height,
                  backgroundColor: bg,
                  pointerEvents: "none",
                  zIndex: 10,
                }}
              />
            );
          })}

        {/* ── Empty state ───────────────────────────────────────────────── */}
        {containers.length === 0 &&
          sliders.length === 0 &&
          lines.length === 0 && (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "#999",
                fontSize: "16px",
              }}
            >
              No content has been added to this page yet
            </div>
          )}
      </div>
    </MobileContext.Provider>
  );
}