import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import logo from "../../../assets/logo1.png";
import { IoSearchSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

// Utility: highlight matching text within a string
function HighlightText({ text, query }) {
  if (!query || !text) return <span>{text}</span>;

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedQuery})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <strong key={i} style={{ fontWeight: 700, color: "#e91e8c" }}>
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

export default function Sidebar({ open, onClose, activePage, setActivePage }) {
  const [active, setActive] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState({ pages: [], news: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Get navigation data from Redux store
  const { allPages } = useSelector((state) => state.admin);
  const { allNews, language } = useSelector((state) => state.newsform);

  // Filter and sort pages that should appear in sidebar
  const sidebarPages = allPages
    .filter((page) => page.sidenavpos !== null)
    .sort((a, b) => a.sidenavpos - b.sidenavpos);

  const toggle = (name) => {
    setActive(active === name ? null : name);
  };

  const handlePageClick = (pageName) => {
    setActivePage(pageName.toLowerCase());
    onClose();
  };

  const handleDistrictClick = (districtName) => {
    setActivePage(districtName.toLowerCase());
    onClose();
  };

  // Close suggestions when clicking outside search area
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset search when sidebar closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setShowSuggestions(false);
      setSearchSuggestions({ pages: [], news: [] });
    }
  }, [open]);

  // Build search suggestions whenever query changes
  const buildSuggestions = useCallback((query) => {
    if (!query || query.trim().length === 0) {
      setSearchSuggestions({ pages: [], news: [] });
      setShowSuggestions(false);
      return;
    }

    const q = query.trim().toLowerCase();

    // Match pages
    const matchedPages = [];
    allPages.forEach(page => {
      if (!page.name) return;
      const tamName = page.name.tam || "";
      const engName = page.name.eng || "";
      if (tamName.toLowerCase().includes(q) || engName.toLowerCase().includes(q)) {
        matchedPages.push({
          id: page.id,
          displayName: language === "ta" ? tamName : engName,
          engName: engName,
        });
      }
      // Also check district sub-items
      if (page.districts) {
        page.districts.forEach(district => {
          const dTam = district.tam || "";
          const dEng = district.eng || "";
          if (dTam.toLowerCase().includes(q) || dEng.toLowerCase().includes(q)) {
            matchedPages.push({
              id: `district-${dEng}`,
              displayName: language === "ta" ? dTam : dEng,
              engName: dEng,
              isDistrict: true,
            });
          }
        });
      }
    });

    // Match news by headline or oneLiner
    const matchedNews = [];
    allNews.forEach(news => {
      const headline = news.data?.headline || news.title || "";
      const oneLiner = news.data?.oneLiner || news.content || "";
      if (
        headline.toLowerCase().includes(q) ||
        oneLiner.toLowerCase().includes(q)
      ) {
        matchedNews.push({
          id: news.id,
          headline: headline,
          oneLiner: oneLiner,
        });
      }
    });

    setSearchSuggestions({ pages: matchedPages.slice(0, 5), news: matchedNews.slice(0, 5) });
    setShowSuggestions(true);
  }, [allPages, allNews, language]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    buildSuggestions(val);
  };

  // Navigate to a page suggestion
  const handlePageSuggestionClick = (suggestion) => {
    setShowSuggestions(false);
    setSearchQuery("");
    if (setActivePage) {
      setActivePage(suggestion.engName.toLowerCase());
    }
    onClose();
  };

  // Navigate to a news suggestion
  const handleNewsSuggestionClick = (newsItem) => {
    setShowSuggestions(false);
    setSearchQuery("");
    onClose();
    navigate(`/preview/${newsItem.id}`);
  };

  const hasSuggestions =
    searchSuggestions.pages.length > 0 || searchSuggestions.news.length > 0;

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div className="sb-overlay" onClick={onClose}></div>

      {/* Sidebar */}
      <div className="sb-container">
        <div className="nav-c1-logo-v2" style={{ position: "relative" }}>
          <div className="nav-c1l-t1-v2">
            <img src={logo} />
          </div>
          <div
            className="nav-c1l-t2-v2"
            style={{ position: "absolute", transform: "translateY(20px)" }}
          >
            நடநிலை நாளிதழ்
          </div>
        </div>

        {/* Search bar with suggestions */}
        <div className="sb-header">
          <div
            ref={searchContainerRef}
            style={{ position: "relative", width: "100%" }}
          >
            {/* Search Input */}
            <div
              className="search-bar"
              style={{
                borderRadius: showSuggestions && hasSuggestions ? "8px 8px 0 0" : "8px",
                borderBottom: showSuggestions && hasSuggestions ? "none" : undefined,
              }}
            >
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                className="search-input"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => {
                  if (searchQuery.trim()) setShowSuggestions(true);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) buildSuggestions(searchQuery);
                }}
              />
              <IoSearchSharp className="search-icon" />
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && hasSuggestions && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  backgroundColor: "white",
                  border: "1px solid #fce4f3",
                  borderTop: "none",
                  borderRadius: "0 0 8px 8px",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                  zIndex: 300,
                  maxHeight: "280px",
                  overflowY: "auto",
                }}
              >
                {/* Page Suggestions */}
                {searchSuggestions.pages.length > 0 && (
                  <div>
                    {searchSuggestions.pages.map((page) => (
                      <div
                        key={page.id}
                        onClick={() => handlePageSuggestionClick(page)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "9px 12px",
                          cursor: "pointer",
                          borderBottom: "1px solid #fce4f3",
                          fontSize: "14px",
                          transition: "background 0.15s",
                          color: "#222",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#fff0f8")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                      >
                        <span style={{ color: "#e91e8c", fontSize: "13px", minWidth: "16px" }}>
                          ☰
                        </span>
                        <HighlightText text={page.displayName} query={searchQuery} />
                      </div>
                    ))}
                  </div>
                )}

                {/* News Suggestions */}
                {searchSuggestions.news.length > 0 && (
                  <div>
                    {searchSuggestions.news.map((newsItem) => (
                      <div
                        key={newsItem.id}
                        onClick={() => handleNewsSuggestionClick(newsItem)}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "10px",
                          padding: "9px 12px",
                          cursor: "pointer",
                          borderBottom: "1px solid #fce4f3",
                          fontSize: "13px",
                          transition: "background 0.15s",
                          color: "#222",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#fff0f8")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                      >
                        <span style={{ color: "#aaa", fontSize: "13px", minWidth: "16px", paddingTop: "1px" }}>
                          🗞
                        </span>
                        <div>
                          <div style={{ fontWeight: 500, lineHeight: "1.4" }}>
                            <HighlightText text={newsItem.headline} query={searchQuery} />
                          </div>
                          {newsItem.oneLiner && (
                            <div style={{ color: "#888", fontSize: "12px", marginTop: "2px" }}>
                              <HighlightText text={newsItem.oneLiner} query={searchQuery} />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* No results */}
                {!hasSuggestions && searchQuery.trim() && (
                  <div style={{ padding: "12px", color: "#aaa", fontSize: "13px" }}>
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Navigation Items */}
        <div className="sb-content">
          {sidebarPages.map((page) => {
            // Special handling for District selector
            if (page.districts) {
              return (
                <SidebarItem
                  key={page.id}
                  title={page.name.tam}
                  active={active}
                  toggle={toggle}
                >
                  {page.districts.map((district, index) => (
                    <li
                      key={index}
                      onClick={() => handleDistrictClick(district.eng)}
                      style={{ cursor: "pointer" }}
                    >
                      {district.tam}
                    </li>
                  ))}
                </SidebarItem>
              );
            }

            // Regular page items without sub-items
            return (
              <div key={page.id} className="sb-item">
                <div
                  className="sb-title-simple"
                  onClick={() => handlePageClick(page.name.eng)}
                  style={{ cursor: "pointer" }}
                >
                  {page.name.tam}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* Reusable item with dropdown */
function SidebarItem({ title, children, active, toggle }) {
  const isOpen = active === title;

  return (
    <div className="sb-item">
      <div className="sb-title" onClick={() => toggle(title)}>
        {title}
        <span>{isOpen ? "−" : "+"}</span>
      </div>
      {isOpen && <ul className="sb-sub">{children}</ul>}
    </div>
  );
}