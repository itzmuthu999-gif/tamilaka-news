import React from "react";
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
  FiTrendingUp,
  FiUsers,
  FiBell
} from "react-icons/fi";
import "./Adminhome.scss";

export default function AdminHome() {
  return (
    <div className="admin-home">
      {/* Horizontal Navbar */}
      <header className="admin-navbar">
        <div className="navbar-container">
          {/* Logo Section */}
          <div className="navbar-logo">
            <img src={logo} alt="Tamilaka News Admin" />
            <span>Tamilaka Admin</span>
          </div>

          {/* Navigation Menu */}
          <nav className="navbar-nav">
            <ul className="navbar-nav-list">
              <li className="navbar-nav-item active">
                <Link to="/admin-overview" className="navbar-nav-link">
                  <FiHome className="nav-icon" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className="navbar-nav-item">
                <Link to="/Newsbund" className="navbar-nav-link">
                  <FiFileText className="nav-icon" />
                  <span>Raw News</span>
                </Link>
              </li>
              <li className="navbar-nav-item">
                <Link to="/editpaper" className="navbar-nav-link">
                  <FiEdit3 className="nav-icon" />
                  <span>Edit Paper</span>
                </Link>
              </li>
              <li className="navbar-nav-item">
                <Link to="/Newspaper" className="navbar-nav-link">
                  <FiLayers className="nav-icon" />
                  <span>Newspaper</span>
                </Link>
              </li>
              <li className="navbar-nav-item">
                <Link to="/analytics" className="navbar-nav-link">
                  <FiTrendingUp className="nav-icon" />
                  <span>Analytics</span>
                </Link>
              </li>
              <li className="navbar-nav-item">
                <Link to="/users" className="navbar-nav-link">
                  <FiUsers className="nav-icon" />
                  <span>Users</span>
                </Link>
              </li>
              <li className="navbar-nav-item">
                <Link to="/settings" className="navbar-nav-link">
                  <FiSettings className="nav-icon" />
                  <span>Settings</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* User Profile Section */}
          <div className="navbar-profile">
            <div className="profile-info">
              <div className="profile-avatar">
                <FiUser />
              </div>
              <div className="profile-details">
                <div className="profile-name">Admin User</div>
                <div className="profile-role">Administrator</div>
              </div>
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
      </header>

      {/* Main Content */}
      <main className="admin-main">
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
              
              <Link to="/analytics" className="action-card">
                <div className="action-icon">
                  <FiTrendingUp />
                </div>
                <h3>Analytics</h3>
                <p>View performance metrics and insights</p>
              </Link>
            </div>
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
      </main>
    </div>
  );
}
