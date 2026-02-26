import React from 'react';
import ReactDOM from 'react-dom';
import logo from "../../../assets/logo1.png";
import { IoSearchSharp } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiWorld } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiMiniMoon } from "react-icons/hi2";
import { IoSunnySharp } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setLanguage, setTranslatedNews } from "../../Slice/newsformslice.js";
import { translateToEnglish } from "../../Slice/translate.js";
import { useNavigate } from "react-router-dom";
import { getTodayInTamil } from './getTodayInTamil.js';
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

export default function Navbarr({ setIsOn, isOn, openSidebar, activePage, setActivePage }) {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allNews, language } = useSelector((state) => state.newsform);
  const { allPages, selectedDistrict1 } = useSelector((state) => state.admin);

  const [isMobile, setIsMobile] = useState(window.innerWidth > 768);
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState({ pages: [], news: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [menuPortalPosition, setMenuPortalPosition] = useState(null);
  const [langPopupOpen, setLangPopupOpen] = useState(false);

  const districtDropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const globeRef = useRef(null);

  // Get pages that should appear in top navigation
  const topNavPages = allPages
    .filter(page => page.topnavpos !== null)
    .sort((a, b) => a.topnavpos - b.topnavpos);

  // Find the district page
  const districtPage = allPages.find(page => page.districts);
  const districts = districtPage?.districts || [];

  // All searchable pages (flatten district sub-pages too)
  const allSearchablePages = allPages.filter(p => p.name);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useLayoutEffect(() => {
    if (!districtDropdownOpen || !districtDropdownRef.current) {
      setMenuPortalPosition(null);
      return;
    }
    const rect = districtDropdownRef.current.getBoundingClientRect();
    setMenuPortalPosition({ top: rect.bottom + 6, left: rect.left });
  }, [districtDropdownOpen]);

  useEffect(() => {
    if (!districtDropdownOpen) return;
    const handleScrollOrResize = () => setDistrictDropdownOpen(false);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [districtDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (districtDropdownRef.current && !districtDropdownRef.current.contains(e.target)) {
        const menuEl = document.querySelector(".nav-district-menu-portal");
        if (menuEl && menuEl.contains(e.target)) return;
        setDistrictDropdownOpen(false);
      }
    };
    if (districtDropdownOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [districtDropdownOpen]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [searchOpen]);

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
      if (
        tamName.toLowerCase().includes(q) ||
        engName.toLowerCase().includes(q)
      ) {
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

    // Match news by headline, oneLiner, content
    const matchedNews = [];
    const newsSource = language === "ta" ? allNews : allNews;
    newsSource.forEach(news => {
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

  const handleLanguageSelect = async (lang) => {
    setLangPopupOpen(false);
    if (lang === "en" && language === "ta") {
      const translated = await Promise.all(
        allNews.map(async (news) => ({
          ...news,
          title: await translateToEnglish(news.title),
          content: await translateToEnglish(news.content),
        }))
      );
      dispatch(setTranslatedNews(translated));
      dispatch(setLanguage("en"));
    } else if (lang === "ta" && language !== "ta") {
      dispatch(setLanguage("ta"));
    }
  };

  // Close lang popup on outside click
  useEffect(() => {
    if (!langPopupOpen) return;
    const handleClick = (e) => {
      if (globeRef.current && !globeRef.current.contains(e.target)) {
        setLangPopupOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [langPopupOpen]);

  const handlePageClick = (pageName) => {
    setActivePage(pageName.toLowerCase());
  };

  const handleDistrictClick = (districtName) => {
    setActivePage(districtName.toLowerCase());
    setDistrictDropdownOpen(false);
  };

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    buildSuggestions(val);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) buildSuggestions(searchQuery);
  };

  // Navigate to a page suggestion
  const handlePageSuggestionClick = (suggestion) => {
    setShowSuggestions(false);
    setSearchQuery("");
    setSearchOpen(false);
    if (setActivePage) {
      setActivePage(suggestion.engName.toLowerCase());
    }
  };

  // Navigate to a news suggestion
  const handleNewsSuggestionClick = (newsItem) => {
    setShowSuggestions(false);
    setSearchQuery("");
    setSearchOpen(false);
    navigate(`/preview/${newsItem.id}`);
  };

  const hasSuggestions =
    searchSuggestions.pages.length > 0 || searchSuggestions.news.length > 0;

  return (
    <div className="navcon1-v2">
      <div className="navcon2-v2">
        <div className="nav-c1-v2" style={{ position: "relative" }}>
          {!isMobile && (
            <div className="nav-c3-ham-vm2" onClick={openSidebar}>
              <GiHamburgerMenu />
            </div>
          )}
          {isMobile && (
            <div className="nav-c1-date-v2">{getTodayInTamil()}</div>
          )}
          <div className="nav-c1-logo-v2" style={{ position: "relative" }}>
            <div className="nav-c1l-t1-v2">
              <img src={logo} />
            </div>
            <div
              className="nav-c1l-t2-v2"
              style={{ position: "absolute", fontSize:"15px", transform: "translateY(30px)" }}
            >
              நடுநிலை  நாளிதழ்
            </div>
          </div>

          {/* Search bar with suggestions - positioned absolutely to avoid layout shift */}
          {isMobile && searchOpen && (
            <div
              ref={searchContainerRef}
              style={{ position: "absolute", right: "55px", top: "69px", transform: "translateY(-50%)", zIndex: 100 }}
            >
              {/* Search Input Row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "white",
                  border: "solid 0.5px pink",
                  padding: "4px 12px",
                  borderRadius: showSuggestions && hasSuggestions ? "10px 10px 0 0" : "10px",
                  minWidth: "300px",
                  boxShadow: showSuggestions && hasSuggestions ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                  zIndex: 20,
                }}
              >
                <IoSearchSharp style={{ fontSize: "18px", color: "#666" }} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => { if (searchQuery.trim()) setShowSuggestions(true); }}
                  placeholder="Search"
                  style={{
                    flex: 1,
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    fontSize: "14px",
                    padding: "4px 0",
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleSearchSubmit(e);
                  }}
                />
                <IoClose
                  onClick={handleSearchToggle}
                  style={{ cursor: "pointer", fontSize: "20px", color: "#666" }}
                />
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && hasSuggestions && (
                <div
                  style={{
                    position: "absolute",
                    left: "0",
                    top: "100%",
                    minWidth: "300px",
                    backgroundColor: "white",
                    border: "solid 0.5px pink",
                    borderTop: "none",
                    borderRadius: "0 0 10px 10px",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                    zIndex: 200,
                    maxHeight: "320px",
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
                            padding: "9px 14px",
                            cursor: "pointer",
                            borderBottom: "1px solid #fce4f3",
                            fontSize: "14px",
                            transition: "background 0.15s",
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
                            padding: "9px 14px",
                            cursor: "pointer",
                            borderBottom: "1px solid #fce4f3",
                            fontSize: "13px",
                            transition: "background 0.15s",
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

                  {/* No results fallback */}
                  {!hasSuggestions && searchQuery.trim() && (
                    <div style={{ padding: "12px 14px", color: "#aaa", fontSize: "13px" }}>
                      No results found
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {isMobile && (
            <div className="nav-c1-links-v2">
              <div onClick={handleSearchToggle} style={{ cursor: "pointer" }}>
                <IoSearchSharp className="nav-c1-link-v2" />
              </div>
              <div>
                <IoMdNotificationsOutline className="nav-c1-link-v2" />
              </div>
              <div ref={globeRef} style={{ position: "relative" }}>
                <BiWorld
                  className="nav-c1-link"
                  onClick={() => setLangPopupOpen((prev) => !prev)}
                  style={{ cursor: "pointer" }}
                />
                {langPopupOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 10px)",
                      right: "0",
                      backgroundColor: "white",
                      border: "1px solid #f9c0e0",
                      borderRadius: "10px",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                      zIndex: 300,
                      minWidth: "140px",
                      overflow: "hidden",
                    }}
                  >

                    {[
                      { code: "en", label: "English", sublabel: "English" },
                      { code: "ta", label: "தமிழ்", sublabel: "Tamil" },
                    ].map(({ code, label, sublabel }) => {
                      const isActive = (code === "ta" && language === "ta") || (code === "en" && language !== "ta");
                      return (
                        <div
                          key={code}
                          onClick={() => handleLanguageSelect(code)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "5px 10px",
                            cursor: "pointer",
                            background: isActive ? "#fff0f8" : "white",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#fdf0f8"; }}
                          onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "white"; }}
                        >
                          <div>
                            <div style={{ fontSize: "14px", fontWeight: isActive ? 600 : 400, color: isActive ? "#e91e8c" : "#333" }}>{label}</div>
                            <div style={{ fontSize: "11px", color: "#aaa" }}>{sublabel}</div>
                          </div>
                          {isActive && (
                            <span style={{ color: "#e91e8c", fontSize: "14px", fontWeight: 700 }}>✓</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="nav-c2-line-v2"></div>

        <div className="nav-c3-v2">
          {isMobile && (
            <div className="nav-c3-ham-v2" onClick={openSidebar}>
              <GiHamburgerMenu />
            </div>
          )}

          <div className="nav-c3-sections-v2">
            {topNavPages.map((page) => {
              if (page.districts) {
                return (
                  <div key={page.id} ref={districtDropdownRef} className="nav-district-dropdown">
                    <div
                      className="nav-district-trigger"
                      onClick={() => setDistrictDropdownOpen((prev) => !prev)}
                    >
                      {language === "ta" ? "மாவட்டம்" : page.name.eng} ▾
                    </div>
                    {districtDropdownOpen && menuPortalPosition && ReactDOM.createPortal(
                      <div
                        className={`nav-district-menu nav-district-menu-portal${isOn ? " nav-district-menu-dark" : ""}`}
                        style={{
                          position: "fixed",
                          top: menuPortalPosition.top,
                          left: menuPortalPosition.left,
                        }}
                      >
                        {districts.map((district, index) => (
                          <div
                            key={index}
                            className="nav-district-item"
                            onClick={() => handleDistrictClick(district.eng)}
                          >
                            {language === "ta" ? district.tam : district.eng}
                          </div>
                        ))}
                      </div>,
                      document.body
                    )}
                  </div>
                );
              }

              return (
                <div
                  key={page.id}
                  onClick={() => handlePageClick(page.name.eng)}
                  style={{ cursor: "pointer" }}
                >
                  {language === "ta" ? page.name.tam : page.name.eng}
                </div>
              );
            })}
          </div>

          {isMobile && (
            <div className="nav-c3-dm-v2">
              {isOn ? (
                <IoSunnySharp onClick={() => setIsOn(!isOn)} />
              ) : (
                <HiMiniMoon onClick={() => setIsOn(!isOn)} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}