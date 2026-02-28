import React, { useEffect, useMemo, useState } from "react";



import logo from "../assets/logo.png";



import { Link } from "react-router-dom";



import { 



  FiHome, 



  FiFileText, 



  FiEdit3, 



  FiLayers, 



  FiSettings,



  FiUser,



  FiLogOut,



  FiChevronDown,



  FiGrid,



  FiTrendingUp,



  FiUsers,



  FiCalendar,



  FiBell



} from "react-icons/fi";



import "./Adminhome.scss";
import { getProgress } from "../Api/progressApi";







export default function AdminHome() {
  const [progressItems, setProgressItems] = useState([]);
  const [progressError, setProgressError] = useState("");

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const data = await getProgress(60);
        setProgressItems(Array.isArray(data) ? data : []);
        setProgressError("");
      } catch (error) {
        console.error("Failed to load progress:", error);
        setProgressError("Unable to load progress updates.");
      }
    };

    loadProgress();
  }, []);

  const formatTime = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString();
  };

  const progressTitle = useMemo(() => {
    return `Progress (${progressItems.length})`;
  }, [progressItems.length]);

  const formatAction = (item) => {
    switch (item.action) {
      case "login":
        return "Logged in";
      case "news_create":
        return "Created news";
      case "news_update":
        return "Updated news";
      default:
        return item.details || "Activity";
    }
  };



  return (



    <div className="admin-home">



      {/* Sidebar */}



      <div className="admin-sidebar">



        {/* Logo Section */}



        <div className="sidebar-logo">



          <img src={logo} alt="Tamilaka News Admin" />



          <span>Tamilaka Admin</span>



        </div>







        {/* Navigation Menu */}



        <nav className="sidebar-nav">



          <ul className="nav-list">



            <li className="nav-item active">



              <Link to="/admin-overview" className="nav-link">



                <FiHome className="nav-icon" />



                <span>Dashboard</span>



              </Link>



            </li>



            <li className="nav-item">



              <Link to="/Newsbund" className="nav-link">



                <FiFileText className="nav-icon" />



                <span>Raw News</span>



              </Link>



            </li>



            <li className="nav-item">



              <Link to="/editpaper" className="nav-link">



                <FiEdit3 className="nav-icon" />



                <span>Edit Paper</span>



              </Link>



            </li>



            <li className="nav-item">



              <Link to="/Newspaper" className="nav-link">



                <FiLayers className="nav-icon" />



                <span>Newspaper</span>



              </Link>



            </li>



            <li className="nav-item">



              <Link to="/adminop" className="nav-link">



                <FiTrendingUp className="nav-icon" />



                <span>Admin Operation</span>



              </Link>



            </li>



            <li className="nav-item">



              <Link to="/users" className="nav-link">



                <FiUsers className="nav-icon" />



                <span>Users</span>



              </Link>



            </li>







            <li className="nav-item">



              <Link to="/settings" className="nav-link">



                <FiSettings className="nav-icon" />



                <span>Settings</span>



              </Link>



            </li>



          </ul>



        </nav>







        {/* User Profile Section */}



        <div className="sidebar-profile">



          <div className="profile-info">



            <div className="profile-avatar">



              <FiUser />



            </div>



            <div className="profile-details">



              <div className="profile-name">Admin User</div>



              <div className="profile-role">Administrator</div>



            </div>



            <FiChevronDown className="profile-dropdown" />



          </div>



          <div className="profile-actions">



            <Link to="/notifications" className="profile-action">



              <FiBell />



            </Link>



            <Link to="/logout" className="profile-action logout">



              <FiLogOut />



            </Link>



          </div>



        </div>



      </div>







      {/* Main Content */}



      <div className="admin-main">











        {/* Dashboard Content */}



        <div className="dashboard-content">



          {/* Quick Actions Grid */}



          <div className="quick-actions">



            <h2>Quick Actions</h2>



            <div className="actions-grid">



              <Link to="/Newsbund" className="action-card">



                <div className="action-icon">



                  <FiFileText />



                </div>



                <h3>Manage News</h3>



                <p>Add, edit, and organize news articles</p>



              </Link>



              



              <Link to="/editpaper" className="action-card">



                <div className="action-icon">



                  <FiEdit3 />



                </div>



                <h3>Edit Paper</h3>



                <p>Design and layout newspaper pages</p>



              </Link>



              



              <Link to="/Newspaper" className="action-card">



                <div className="action-icon">



                  <FiLayers />



                </div>



                <h3>View Newspaper</h3>



                <p>Preview and publish newspaper</p>



              </Link>



            </div>



          </div>







          

          {/* Progress Notifications */}

          <div className="progress-section">

            <h2>{progressTitle}</h2>



            {progressError && (

              <div className="progress-empty">{progressError}</div>

            )}



            {!progressError && progressItems.length === 0 && (

              <div className="progress-empty">No progress updates yet.</div>

            )}



            {!progressError && progressItems.length > 0 && (

              <div className="progress-list">

                {progressItems.map((item) => {

                  const showNews = Boolean(item.newsTitle || item.newsImage);

                  return (

                    <div key={item._id || item.id} className="progress-item">

                      <div className="progress-meta">

                        <div className="progress-user">{item.userName || "Unknown"}</div>

                        <div className="progress-action">{formatAction(item)}</div>

                        <div className="progress-time">{formatTime(item.createdAt)}</div>

                      </div>



                      {showNews && (

                        <div className="progress-news">

                          {item.newsImage && (

                            <img

                              src={item.newsImage}

                              alt="news"

                              className="progress-news-img"

                            />

                          )}

                          <div className="progress-news-title">

                            {item.newsTitle || "News"}

                          </div>

                        </div>

                      )}

                    </div>

                  );

                })}

              </div>

            )}

          </div>



{/* Recent Activity */}



          <div className="recent-activity">



            <h2>Recent Activity</h2>



            <div className="activity-list">



              <div className="activity-item">



                <div className="activity-icon">



                  <FiEdit3 />



                </div>



                <div className="activity-content">



                  <div className="activity-title">New article published</div>



                  <div className="activity-time">2 hours ago</div>



                </div>



              </div>



              <div className="activity-item">



                <div className="activity-icon">



                  <FiUser />



                </div>



                <div className="activity-content">



                  <div className="activity-title">New user registered</div>



                  <div className="activity-time">5 hours ago</div>



                </div>



              </div>



              <div className="activity-item">



                <div className="activity-icon">



                  <FiCalendar />



                </div>



                <div className="activity-content">



                  <div className="activity-title">Publication scheduled</div>



                  <div className="activity-time">1 day ago</div>



                </div>



              </div>



            </div>



          </div>



        </div>



      </div>



    </div>



  );



}



